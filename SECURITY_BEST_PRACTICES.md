# Security Best Practices Guide

## 🔐 Overview

This document outlines critical security practices for developers working on this project. **Failure to follow these guidelines can result in security breaches and data leaks.**

---

## ⚠️ CRITICAL: Never Commit Secrets

### What NOT to commit

❌ **NEVER commit these to Git:**

- Database passwords and connection strings
- Private keys (.pem, .key files)
- `.env` files containing secrets
- SSH keys
- OAuth client secrets
- JWT secret keys
- Encryption keys
- Service account credentials
- Any file containing `token`, `password`, `secret`, or `key` in sensitive context

### ✅ What to do instead:

1. **Use `.env` files** (already in `.gitignore`)
   ```bash
   # .env (NEVER commit this file)
   GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
   DATABASE_URL=postgresql://user:pass@localhost/db
   API_KEY=your_secret_key
   ```

2. **Load from environment variables**
   ```typescript
   // Good ✅
   const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
   
   // Bad ❌
   const token = "ghp_abc123...";
   ```

3. **Use secret management services** for production:
   - GitHub Secrets (for GitHub Actions)
   - AWS Secrets Manager
   - Azure Key Vault
   - HashiCorp Vault

---

## 🛡️ Pre-Commit Checklist

Before every commit, verify:

- [ ] No `.env` files being committed
- [ ] No hardcoded credentials in code
- [ ] No API keys in comments
- [ ] No tokens in configuration files
- [ ] No private keys in repository
- [ ] Run: `git diff --cached` to review staged changes
- [ ] Check: `git status` for untracked sensitive files

---

## 🚨 What to Do If You Accidentally Commit a Secret

### Immediate Actions (within 5 minutes):

1. **DO NOT push** if you haven't already
   ```bash
   git reset --soft HEAD~1  # Undo the commit
   git reset HEAD <file>     # Unstage the file
   ```

2. **If you already pushed:**
   ```bash
   # Remove from history (DANGER: rewrites history)
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch <FILE_WITH_SECRET>" \
     --prune-empty --tag-name-filter cat -- --all
   
   git push origin --force --all
   ```

3. **Immediately revoke the exposed secret:**
   - GitHub tokens: https://github.com/settings/tokens
   - AWS keys: AWS IAM Console
   - Database passwords: Change immediately
   - API keys: Regenerate from provider

4. **Report the incident:**
   - Notify your security team
   - Document what was exposed and for how long
   - Update `SECURITY_FIXES.md` with incident details

### GitHub Push Protection

This repository has **GitHub Push Protection** enabled, which will block commits containing:
- GitHub Personal Access Tokens
- AWS credentials
- Azure credentials
- Google Cloud keys
- Slack tokens
- And 200+ other secret types

If blocked, **DO NOT bypass** - remove the secret properly!

---

## 🔒 Code Security Guidelines

### 1. Input Validation

```typescript
// Bad ❌ - No validation
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  db.query(`SELECT * FROM users WHERE id = ${userId}`); // SQL Injection!
});

// Good ✅ - Validated and parameterized
app.get('/user/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId) || userId < 1) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  db.query('SELECT * FROM users WHERE id = ?', [userId]);
});
```

### 2. XSS Prevention

```typescript
// Bad ❌ - Direct HTML insertion
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// Good ✅ - Use safe alternatives
<div>{userInput}</div>  // React escapes automatically

// Or sanitize if HTML is needed
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

### 3. Path Traversal Prevention

```typescript
// Bad ❌ - User input in file path
const filePath = path.join(__dirname, 'uploads', req.query.filename);
fs.readFile(filePath); // Can access ../../etc/passwd

// Good ✅ - Validate and restrict
const filename = path.basename(req.query.filename); // Remove path components
const filePath = path.join(__dirname, 'uploads', filename);
if (!filePath.startsWith(path.join(__dirname, 'uploads'))) {
  throw new Error('Invalid file path');
}
fs.readFile(filePath);
```

### 4. Authentication & Authorization

```typescript
// Bad ❌ - No auth check
app.delete('/admin/user/:id', (req, res) => {
  deleteUser(req.params.id);
});

// Good ✅ - Proper auth and authz
app.delete('/admin/user/:id', 
  authenticateToken,
  requireAdmin,
  (req, res) => {
    if (req.user.id === req.params.id) {
      return res.status(403).json({ error: 'Cannot delete yourself' });
    }
    deleteUser(req.params.id);
  }
);
```

### 5. Dependency Security

```bash
# Regularly audit dependencies
npm audit
pnpm audit

# Update vulnerable packages
npm audit fix
pnpm audit --fix

# Use Dependabot (enabled on this repo)
# It will create PRs for vulnerable dependencies
```

---

## 🔐 Environment Variables

### Naming Convention

Use descriptive, uppercase names with underscores:

```bash
# Good ✅
DATABASE_URL=
GITHUB_PERSONAL_ACCESS_TOKEN=
GOOGLE_CLOUD_PROJECT_ID=
JWT_SECRET_KEY=

# Bad ❌
db=
token=
secret=
```

### Loading Environment Variables

```typescript
// .env file
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here

// In your code
import * as dotenv from 'dotenv';
dotenv.config();

const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
if (!token) {
  throw new Error('GITHUB_PERSONAL_ACCESS_TOKEN is required');
}
```

### Production Environment

**NEVER** commit `.env.production` - use platform-specific secrets:

```yaml
# GitHub Actions
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## 🛠️ Security Tools

### 1. Pre-commit Hooks (Recommended)

Install pre-commit hooks to catch secrets before commit:

```bash
# Using Husky (already configured in this project)
npm install --save-dev husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run security-check"
```

Create `npm run security-check` script:
```json
{
  "scripts": {
    "security-check": "git diff --cached --name-only | xargs grep -l 'ghp_\\|sk-\\|aws_' && exit 1 || exit 0"
  }
}
```

### 2. Secret Scanning Tools

```bash
# TruffleHog - Scans for secrets in git history
docker run --rm -v "$(pwd):/repo" trufflesecurity/trufflehog:latest filesystem /repo

# Gitleaks - Fast secret scanner
docker run -v "$(pwd):/path" zricethezav/gitleaks:latest detect --source="/path" --verbose

# Semgrep - SAST scanner (already used in this project)
semgrep --config auto .
```

### 3. GitHub Secret Scanning

This repository has **GitHub Secret Scanning** enabled:
- Automatically scans commits for secrets
- Blocks pushes containing secrets (Push Protection)
- Alerts maintainers of exposed secrets

---

## 📋 Security Checklist for PRs

Before submitting a Pull Request:

- [ ] No hardcoded secrets or credentials
- [ ] All user inputs are validated
- [ ] SQL queries use parameterized statements
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] File operations validate and restrict paths
- [ ] Authentication checks on protected routes
- [ ] Dependencies updated and audited
- [ ] Security tests added for new features
- [ ] Code reviewed for common vulnerabilities (XSS, SQLi, CSRF)
- [ ] `.env.example` updated (without real values)

---

## 🎯 Common Vulnerabilities to Avoid

### 1. SQL Injection
```typescript
// ❌ BAD
db.query(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ GOOD
db.query('SELECT * FROM users WHERE email = ?', [email]);
```

### 2. Cross-Site Scripting (XSS)
```typescript
// ❌ BAD
innerHTML = userInput;

// ✅ GOOD
textContent = userInput;
```

### 3. Cross-Site Request Forgery (CSRF)
```typescript
// ✅ GOOD - Use CSRF tokens
import csrf from 'csurf';
app.use(csrf({ cookie: true }));
```

### 4. Insecure Direct Object References
```typescript
// ❌ BAD
app.get('/invoice/:id', (req, res) => {
  const invoice = getInvoice(req.params.id);
  res.json(invoice); // Anyone can access any invoice!
});

// ✅ GOOD
app.get('/invoice/:id', authenticate, (req, res) => {
  const invoice = getInvoice(req.params.id);
  if (invoice.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(invoice);
});
```

### 5. Unvalidated Redirects
```typescript
// ❌ BAD
res.redirect(req.query.redirect); // Open redirect vulnerability

// ✅ GOOD
const allowedDomains = ['https://example.com'];
const redirectUrl = req.query.redirect;
if (allowedDomains.some(domain => redirectUrl.startsWith(domain))) {
  res.redirect(redirectUrl);
} else {
  res.redirect('/');
}
```

---

## 📞 Security Contacts

### Report Security Vulnerabilities

**DO NOT** open public issues for security vulnerabilities!

Instead, use:
1. GitHub Security → Report a vulnerability
2. Email: [Your security email]
3. Follow process in `SECURITY.md`

### Security Team

- **Security Owner**: mohamedaminradyofficial
- **Repository**: https://github.com/mohamedaminradyofficial/the-copy
- **Security Policy**: [SECURITY.md](./SECURITY.md)
- **Security Process**: [SECURITY_PROCESS.md](./SECURITY_PROCESS.md)

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [TypeScript Security Guide](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)

---

## 🔄 Regular Security Audits

Schedule and complete these regularly:

### Weekly
- [ ] Review Dependabot alerts
- [ ] Check GitHub Security tab
- [ ] Review new security advisories

### Monthly
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Review access logs for anomalies
- [ ] Update dependencies to latest stable versions
- [ ] Review and rotate long-lived tokens

### Quarterly
- [ ] Full security audit with external tools
- [ ] Review and update this document
- [ ] Security training for team members
- [ ] Penetration testing (if applicable)

---

**Last Updated**: 2025-11-03  
**Version**: 1.0  
**Maintained By**: Security Team

---

## ⚡ Quick Reference Commands

```bash
# Check for secrets before commit
git diff --cached | grep -E "token|password|secret|key" --color

# Audit dependencies
npm audit --audit-level=high

# Scan for secrets in history
git log -p | grep -E "ghp_|sk-|aws_" --color

# Remove sensitive file from git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch PATH_TO_FILE" \
  --prune-empty --tag-name-filter cat -- --all

# Check .gitignore is working
git check-ignore -v .env
```

---

**Remember: Security is everyone's responsibility!** 🛡️