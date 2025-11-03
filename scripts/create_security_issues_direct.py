#!/usr/bin/env python3
"""
scripts/create_security_issues_direct.py

Create GitHub issues directly using GitHub API (no gh CLI required).
Reads SECURITY_SCAN_REPORT.md and creates issues for each finding.

Usage:
    python scripts/create_security_issues_direct.py --token YOUR_GITHUB_TOKEN
    python scripts/create_security_issues_direct.py --dry-run
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Optional
from urllib import request, parse, error

REPORT_PATH = Path("SECURITY_SCAN_REPORT.md")
GITHUB_API = "https://api.github.com"


class GitHubAPI:
    """Simple GitHub API client."""

    def __init__(self, token: str, repo: str):
        self.token = token
        self.repo = repo  # Format: "owner/repo"
        self.headers = {
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "X-GitHub-Api-Version": "2022-11-28",
        }

    def create_issue(self, title: str, body: str, labels: List[str]) -> Optional[Dict]:
        """Create a GitHub issue."""
        url = f"{GITHUB_API}/repos/{self.repo}/issues"
        data = {"title": title, "body": body, "labels": labels}

        req = request.Request(
            url,
            data=json.dumps(data).encode("utf-8"),
            headers=self.headers,
            method="POST",
        )

        try:
            with request.urlopen(req) as response:
                return json.loads(response.read().decode("utf-8"))
        except error.HTTPError as e:
            print(f"❌ HTTP Error: {e.code} - {e.reason}")
            print(f"   Response: {e.read().decode('utf-8')}")
            return None
        except Exception as e:
            print(f"❌ Error: {e}")
            return None


def parse_severity(text: str) -> str:
    """Extract severity from text."""
    text_lower = text.lower()
    if "critical" in text_lower or "crit" in text_lower:
        return "critical"
    elif "high" in text_lower:
        return "high"
    elif "medium" in text_lower or "med" in text_lower:
        return "medium"
    elif "low" in text_lower:
        return "low"
    return "medium"


def get_labels(severity: str) -> List[str]:
    """Get labels for severity."""
    labels = ["security"]

    if severity == "critical":
        labels.extend(["security-critical", "priority-p0"])
    elif severity == "high":
        labels.extend(["security-high", "priority-p1"])
    elif severity == "medium":
        labels.extend(["security-medium", "priority-p2"])
    else:
        labels.extend(["security-low", "priority-p3"])

    return labels


def parse_report() -> List[Dict[str, str]]:
    """Parse SECURITY_SCAN_REPORT.md."""
    if not REPORT_PATH.exists():
        print(f"❌ {REPORT_PATH} not found")
        sys.exit(1)

    findings = []
    with REPORT_PATH.open(encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # Parse line by line looking for findings
    lines = content.split("\n")
    current_severity = "MEDIUM"

    for line in lines:
        # Track severity sections
        if "CRITICAL" in line.upper() or "Critical" in line:
            current_severity = "CRITICAL"
        elif "HIGH" in line.upper():
            current_severity = "HIGH"
        elif "MEDIUM" in line.upper():
            current_severity = "MEDIUM"

        # Look for code/file references
        if any(
            ext in line
            for ext in [
                ".ts",
                ".tsx",
                ".js",
                ".jsx",
                ".py",
                ".yml",
                ".css",
                ".json",
                ".md",
            ]
        ):
            # Extract file path
            file_match = re.search(
                r"([^\s|]+\.(ts|tsx|js|jsx|py|yml|yaml|css|json|md|sh|ps1))", line
            )
            if not file_match:
                continue

            file_path = file_match.group(1).strip("`")

            # Extract line number if present
            line_num = "N/A"
            line_match = re.search(r"\b(\d{1,5})\b", line)
            if line_match:
                line_num = line_match.group(1)

            # Get severity from line or use current section
            severity = (
                parse_severity(line)
                if any(s in line.lower() for s in ["critical", "high", "medium", "low"])
                else current_severity.lower()
            )

            # Extract category/description
            summary = line.strip()
            # Clean up table markers
            summary = re.sub(r"\|", " ", summary)
            summary = " ".join(summary.split())

            if len(summary) > 200:
                summary = summary[:197] + "..."

            finding = {
                "severity": severity,
                "file": file_path,
                "line": line_num,
                "summary": summary,
            }

            # Avoid duplicates
            if finding not in findings:
                findings.append(finding)

    return findings


def create_issue_for_finding(
    api: GitHubAPI, finding: Dict[str, str], dry_run: bool
) -> bool:
    """Create GitHub issue for a finding."""
    severity = finding["severity"].upper()
    labels = get_labels(finding["severity"])

    # Title
    title = f"[{severity}] Security Issue - {finding['file']}:{finding['line']}"
    if len(title) > 256:
        title = title[:253] + "..."

    # Body
    body = f"""## 🔒 Security Finding

**Severity:** {severity}
**File:** `{finding["file"]}`
**Line:** {finding["line"]}

### 📝 Description
{finding["summary"]}

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
"""

    if dry_run:
        print(f"[DRY-RUN] Would create: {title}")
        return True

    result = api.create_issue(title, body, labels)
    if result:
        print(f"✅ Created issue #{result['number']}: {title}")
        return True
    else:
        print(f"❌ Failed: {title}")
        return False


def get_repo_from_git() -> Optional[str]:
    """Extract repo from git remote."""
    try:
        import subprocess

        result = subprocess.run(
            ["git", "config", "--get", "remote.origin.url"],
            capture_output=True,
            text=True,
            check=True,
        )
        url = result.stdout.strip()

        # Parse GitHub URL
        # Format: https://github.com/owner/repo.git or git@github.com:owner/repo.git
        if "github.com" in url:
            parts = url.replace(".git", "").split("github.com")[1].strip(":/")
            return parts
    except:
        pass
    return None


def main():
    parser = argparse.ArgumentParser(
        description="Create GitHub issues from security report"
    )
    parser.add_argument("--token", help="GitHub Personal Access Token")
    parser.add_argument("--repo", help="Repository (owner/repo)")
    parser.add_argument(
        "--dry-run", action="store_true", help="Don't actually create issues"
    )
    args = parser.parse_args()

    print("=" * 80)
    print("🔒 Security Issue Creator (Direct API)")
    print("=" * 80)
    print()

    # Get token
    token = (
        args.token
        or os.getenv("GITHUB_TOKEN")
        or os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN")
    )
    if not token and not args.dry_run:
        print("❌ GitHub token required. Set GITHUB_TOKEN env var or use --token")
        sys.exit(1)

    # Get repo
    repo = args.repo or get_repo_from_git()
    if not repo:
        print("❌ Could not determine repository. Use --repo owner/repo")
        sys.exit(1)

    print(f"📦 Repository: {repo}")
    print()

    if args.dry_run:
        print("🏃 DRY-RUN mode (no issues will be created)")
        print()

    # Parse report
    print(f"📖 Reading {REPORT_PATH}...")
    findings = parse_report()
    print(f"✅ Found {len(findings)} findings")
    print()

    # Show distribution
    severity_counts = {}
    for f in findings:
        s = f["severity"]
        severity_counts[s] = severity_counts.get(s, 0) + 1

    print("📊 Distribution:")
    for sev in ["critical", "high", "medium", "low"]:
        count = severity_counts.get(sev, 0)
        if count > 0:
            print(f"   {sev.upper()}: {count}")
    print()

    if not findings:
        print("⚠️  No findings detected")
        sys.exit(0)

    # Confirm
    if not args.dry_run and sys.stdin.isatty():
        response = input(f"Create {len(findings)} issues? [y/N]: ")
        if response.lower() not in ["y", "yes"]:
            print("❌ Cancelled")
            sys.exit(0)
        print()

    # Create API client
    api = GitHubAPI(token, repo) if not args.dry_run else None

    # Create issues
    print(f"🚀 Creating issues...")
    print()

    created = 0
    failed = 0

    for i, finding in enumerate(findings, 1):
        print(f"[{i}/{len(findings)}] ", end="")
        if create_issue_for_finding(api, finding, args.dry_run):
            created += 1
        else:
            failed += 1

    print()
    print("=" * 80)
    print(f"✅ Created: {created}")
    if failed > 0:
        print(f"❌ Failed: {failed}")
    print("=" * 80)


if __name__ == "__main__":
    main()
