#!/usr/bin/env python3
"""
scripts/create_test_issues.py

Test script to create a limited number of security issues from SECURITY_SCAN_REPORT.md
This is useful for testing before creating all issues.

Usage:
    python scripts/create_test_issues.py --limit 5
    python scripts/create_test_issues.py --limit 10 --severity critical
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Optional
from urllib import request, error

# Fix encoding for Windows console
if sys.platform == "win32":
    import codecs

    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())
    sys.stderr = codecs.getwriter("utf-8")(sys.stderr.detach())

REPORT_PATH = Path("SECURITY_SCAN_REPORT.md")
GITHUB_API = "https://api.github.com"


class GitHubAPI:
    """Simple GitHub API client."""

    def __init__(self, token: str, repo: str):
        self.token = token
        self.repo = repo
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
            print(f"[ERROR] HTTP {e.code}: {e.reason}")
            error_body = e.read().decode("utf-8")
            try:
                error_json = json.loads(error_body)
                print(f"[ERROR] {error_json.get('message', 'Unknown error')}")
            except:
                print(f"[ERROR] {error_body}")
            return None
        except Exception as e:
            print(f"[ERROR] {e}")
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
        print(f"[ERROR] {REPORT_PATH} not found")
        sys.exit(1)

    findings = []
    with REPORT_PATH.open(encoding="utf-8", errors="ignore") as f:
        content = f.read()

    lines = content.split("\n")
    current_severity = "MEDIUM"

    for line in lines:
        if "CRITICAL" in line.upper() or "Critical" in line:
            current_severity = "CRITICAL"
        elif "HIGH" in line.upper():
            current_severity = "HIGH"
        elif "MEDIUM" in line.upper():
            current_severity = "MEDIUM"

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
                ".sh",
                ".ps1",
            ]
        ):
            file_match = re.search(
                r"([^\s|]+\.(ts|tsx|js|jsx|py|yml|yaml|css|json|md|sh|ps1))", line
            )
            if not file_match:
                continue

            file_path = file_match.group(1).strip("`")
            line_num = "N/A"
            line_match = re.search(r"\b(\d{1,5})\b", line)
            if line_match:
                line_num = line_match.group(1)

            severity = (
                parse_severity(line)
                if any(s in line.lower() for s in ["critical", "high", "medium", "low"])
                else current_severity.lower()
            )

            summary = line.strip()
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

            if finding not in findings:
                findings.append(finding)

    return findings


def create_issue_for_finding(
    api: GitHubAPI, finding: Dict[str, str], index: int
) -> bool:
    """Create GitHub issue for a finding."""
    severity = finding["severity"].upper()
    labels = get_labels(finding["severity"])

    title = (
        f"[{severity}] Security Issue #{index} - {finding['file']}:{finding['line']}"
    )
    if len(title) > 256:
        title = title[:253] + "..."

    body = f"""## Security Finding

**Severity:** {severity}
**File:** `{finding["file"]}`
**Line:** {finding["line"]}

### Description
{finding["summary"]}

### Source
Auto-generated from `SECURITY_SCAN_REPORT.md`

### Required Actions
- [ ] Triage and assign owner
- [ ] Implement fix with tests
- [ ] Add evidence (before/after)
- [ ] Update `SECURITY_FIXES.md`
- [ ] Verify and close

### References
- [Security Process](../SECURITY_PROCESS.md)
- [Security Policy](../SECURITY.md)
"""

    result = api.create_issue(title, body, labels)
    if result:
        issue_url = result.get("html_url", "")
        print(f"[OK] Created issue #{result['number']}: {title}")
        print(f"     URL: {issue_url}")
        return True
    else:
        print(f"[ERROR] Failed: {title}")
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
        if "github.com" in url:
            parts = url.replace(".git", "").split("github.com")[1].strip(":/")
            return parts
    except:
        pass
    return None


def main():
    parser = argparse.ArgumentParser(
        description="Create limited security issues for testing"
    )
    parser.add_argument("--token", help="GitHub Personal Access Token")
    parser.add_argument("--repo", help="Repository (owner/repo)")
    parser.add_argument(
        "--limit", type=int, default=5, help="Number of issues to create (default: 5)"
    )
    parser.add_argument(
        "--severity", help="Filter by severity (critical/high/medium/low)"
    )
    parser.add_argument(
        "--yes", "-y", action="store_true", help="Skip confirmation prompt"
    )
    args = parser.parse_args()

    print("=" * 80)
    print("Security Issue Creator - TEST MODE")
    print("=" * 80)
    print()

    # Get token
    token = (
        args.token
        or os.getenv("GITHUB_TOKEN")
        or os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN")
    )
    if not token:
        print("[ERROR] GitHub token required. Set GITHUB_PERSONAL_ACCESS_TOKEN in .env")
        sys.exit(1)

    # Remove quotes if present
    token = token.strip('"').strip("'")

    # Get repo
    repo = args.repo or get_repo_from_git()
    if not repo:
        print("[ERROR] Could not determine repository. Use --repo owner/repo")
        sys.exit(1)

    print(f"Repository: {repo}")
    print(f"Limit: {args.limit} issues")
    if args.severity:
        print(f"Severity filter: {args.severity}")
    print()

    # Parse report
    print(f"Reading {REPORT_PATH}...")
    findings = parse_report()
    print(f"[OK] Found {len(findings)} total findings")

    # Filter by severity if requested
    if args.severity:
        findings = [
            f for f in findings if f["severity"].lower() == args.severity.lower()
        ]
        print(f"[OK] Filtered to {len(findings)} {args.severity} findings")

    # Limit
    findings = findings[: args.limit]
    print(f"[OK] Creating {len(findings)} issues")
    print()

    # Confirm
    if not args.yes and sys.stdin.isatty():
        response = input(f"Create {len(findings)} issues? [y/N]: ")
        if response.lower() not in ["y", "yes"]:
            print("[CANCELLED]")
            sys.exit(0)
        print()

    # Create API client
    api = GitHubAPI(token, repo)

    # Create issues
    print(f"Creating issues...")
    print()

    created = 0
    failed = 0

    for i, finding in enumerate(findings, 1):
        print(f"[{i}/{len(findings)}] ", end="")
        if create_issue_for_finding(api, finding, i):
            created += 1
        else:
            failed += 1
        print()

    print("=" * 80)
    print(f"[OK] Created: {created}")
    if failed > 0:
        print(f"[ERROR] Failed: {failed}")
    print("=" * 80)


if __name__ == "__main__":
    main()
