# Security Scripts Documentation

This directory contains automation scripts for managing security findings and GitHub issues.

## 📋 Overview

- **`parse_create_issues.py`** - Parse SECURITY_SCAN_REPORT.md and create GitHub issues (requires gh CLI)
- **`create_security_issues_direct.py`** - Create issues using GitHub API directly (no gh CLI required)
- **`link_issues_to_project.sh`** - Link security issues to a GitHub Project board

## 🚀 Quick Start

### Option 1: Using GitHub CLI (Recommended)

```bash
# 1. Install and authenticate GitHub CLI
gh auth login

# 2. Create issues from security report
python3 scripts/parse_create_issues.py

# 3. Link issues to project board
bash scripts/link_issues_to_project.sh "Security Findings"
```

### Option 2: Using Direct API (No gh CLI)

```bash
# Set your GitHub token
export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_your_token_here"

# Create issues
python3 scripts/create_security_issues_direct.py

# Or with explicit parameters
python3 scripts/create_security_issues_direct.py \
  --token "ghp_your_token_here" \
  --repo "owner/repo"
```

## 📖 Detailed Usage

### parse_create_issues.py

**Requirements:**

- GitHub CLI (`gh`) installed and authenticated
- `jq` installed (for JSON processing)

**Usage:**
```bash
# Dry run (preview without creating issues)
python3 scripts/parse_create_issues.py --dry-run

# Create issues
python3 scripts/parse_create_issues.py
```

**Features:**

- Extracts severity, file path, line number, and description
- Creates issues with appropriate labels:
  - `security-critical` + `priority-p0`
  - `security-high` + `priority-p1`
  - `security-medium` + `priority-p2`
- Uses issue template structure
- Shows severity distribution before creating

### create_security_issues_direct.py

**Requirements:**
- Python 3.7+ (standard library only, no external dependencies)
- GitHub Personal Access Token with `repo` scope

**Usage:**
```bash
# Using environment variable
export GITHUB_TOKEN="ghp_your_token_here"
python3 scripts/create_security_issues_direct.py

# Using command line argument
python3 scripts/create_security_issues_direct.py --token "ghp_your_token_here"

# With explicit repository
python3 scripts/create_security_issues_direct.py \
  --token "ghp_your_token_here" \
  --repo "mohamedaminradyofficial/the-copy-monorepo"

# Dry run
python3 scripts/create_security_issues_direct.py --dry-run
```

**Environment Variables:**
- `GITHUB_TOKEN` - GitHub Personal Access Token
- `GITHUB_PERSONAL_ACCESS_TOKEN` - Alternative token variable (from .env)

**Features:**
- No external dependencies (uses Python standard library)
- Direct GitHub API v3 calls
- Automatic repository detection from git remote
- Smart severity parsing
- Duplicate detection
- Clean error handling

### link_issues_to_project.sh

**Requirements:**
- GitHub CLI (`gh`) installed and authenticated
- Bash shell
- `jq` installed

**Usage:**
```bash
# Default project name
bash scripts/link_issues_to_project.sh

# Custom project name
bash scripts/link_issues_to_project.sh "My Security Board"

# Help
bash scripts/link_issues_to_project.sh --help
```

**Features:**
- Creates GitHub Project (v2) if it doesn't exist
- Automatically links issues based on labels
- Organizes by severity:
  - `security-critical` → Critical Fixes column
  - `security-high` → High column
  - `security-medium` → Medium column
- Shows summary statistics
- Color-coded output

## 🔐 Setting Up GitHub Token

### Creating a Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token" → "Generate new token (classic)"
3. Set description: "Security Issue Automation"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `project` (Full control of projects)
5. Generate token and copy it
6. Store securely in `.env` file:

```bash
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
```

### Loading Token from .env

```bash
# Load environment variables
export $(cat .env | xargs)

# Verify token is set
echo $GITHUB_PERSONAL_ACCESS_TOKEN
```

## 📊 Expected Report Format

The scripts expect `SECURITY_SCAN_REPORT.md` to contain findings in this format:

```markdown
### Critical Fixes

| Severity | Category | Location | Line | Summary |
|----------|----------|----------|------|---------|
| CRITICAL | XSS | frontend/src/app.tsx | 182 | dangerouslySetInnerHTML detected |

### High

| Severity | Category | Location | Line | Summary |
|----------|----------|----------|------|---------|
| HIGH | Dependency | package-lock.json | 19842 | npm/next@15.3.3 (CVE-2025-57752) |
```

## 🎯 Complete Workflow

```bash
# 1. Generate or update security scan report
semgrep --config auto . > SECURITY_SCAN_REPORT.md

# 2. Create issues from report
python3 scripts/create_security_issues_direct.py

# 3. Create and configure project board manually on GitHub
# Go to: Projects → New project → "Security Findings"
# Add columns: Critical Fixes, High, Medium, To Verify, Done

# 4. Link issues to project (requires gh CLI)
bash scripts/link_issues_to_project.sh "Security Findings"

# 5. Configure branch protection
# Settings → Branches → Add rule
# Enable: Require status checks (Security Gate workflow)
```

## 🔧 Troubleshooting

### "gh: command not found"

Install GitHub CLI:
```bash
# Windows (with winget)
winget install --id GitHub.cli

# macOS
brew install gh

# Linux
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

### "Authentication required"

```bash
# Authenticate gh CLI
gh auth login

# Or set token directly
export GH_TOKEN="ghp_your_token_here"
```

### "No findings detected"

Ensure `SECURITY_SCAN_REPORT.md`:
1. Exists in repository root
2. Contains properly formatted tables
3. Has severity keywords (CRITICAL, HIGH, MEDIUM)
4. Has file paths with extensions (.ts, .js, etc.)

### "API rate limit exceeded"

Wait for rate limit reset or use authenticated token:
```bash
export GITHUB_TOKEN="ghp_your_token_here"
```

## 📝 Issue Template

Created issues follow this structure:

```markdown
## 🔒 Security Finding

**Severity:** CRITICAL
**File:** `frontend/src/app.tsx`
**Line:** 182

### 📝 Description
[Finding description from report]

### 📌 Source
Auto-generated from `SECURITY_SCAN_REPORT.md`

### ✅ Required Actions
- [ ] Triage and assign owner
- [ ] Implement fix with tests
- [ ] Add evidence (before/after)
- [ ] Update `SECURITY_FIXES.md`
- [ ] Verify and close

### 📚 References
- [Security Process](../SECURITY_PROCESS.md)
- [Security Policy](../SECURITY.md)
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Create Security Issues
on:
  schedule:
    - cron: '0 0 * * 1' # Weekly on Monday
  workflow_dispatch:

jobs:
  create-issues:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Create security issues
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          python3 scripts/create_security_issues_direct.py
```

## 📚 Related Documentation

- [SECURITY_PROCESS.md](../SECURITY_PROCESS.md) - Complete security workflow
- [SECURITY.md](../SECURITY.md) - Security policy and reporting
- [SECURITY_FIXES.md](../SECURITY_FIXES.md) - Log of security fixes
- [.github/ISSUE_TEMPLATE/security-finding.yml](../.github/ISSUE_TEMPLATE/security-finding.yml) - Issue template

## 🤝 Contributing

When adding new scripts:
1. Follow existing naming conventions
2. Add documentation to this README
3. Include `--help` and `--dry-run` options
4. Use clear error messages
5. Test with various report formats

## 📄 License

These scripts are part of the-copy-monorepo project.