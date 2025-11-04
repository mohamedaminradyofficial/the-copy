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
import requests

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
        """Create a GitHub issue.

        SECURITY: Validates URL scheme to prevent file:// or custom scheme access.
        """
        url = f"{GITHUB_API}/repos/{self.repo}/issues"

        # SECURITY FIX: Validate URL scheme to prevent file:// or custom schemes
        if not url.startswith("https://") or url.startswith("file://"):
            print(f"[ERROR] Invalid URL scheme. Only HTTPS is allowed: {url}")
            return None

        data = {"title": title, "body": body, "labels": labels}

        try:
            response = requests.post(
                url,
                data=json.dumps(data).encode("utf-8"),
                headers=self.headers,
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            print(f"[ERROR] HTTP {e.response.status_code}: {e.response.reason}")
            try:
                error_json = e.response.json()
                print(f"[ERROR] {error_json.get('message', 'Unknown error')}")
            except json.JSONDecodeError:
                print(f"[ERROR] {e.response.text}")
            return None
        except Exception as e:
            print(f"[ERROR] Unexpected error: {e}")
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
        current_severity = _update_severity(line, current_severity)
        finding = _extract_finding_from_line(line, current_severity)
        if finding:
            findings.append(finding)

    return findings


def _update_severity(line: str, current_severity: str) -> str:
    """Update current severity based on line content."""
    if "CRITICAL" in line.upper() or "Critical" in line:
        return "CRITICAL"
    elif "HIGH" in line.upper():
        return "HIGH"
    elif "MEDIUM" in line.upper():
        return "MEDIUM"
    return current_severity


def _extract_finding_from_line(line: str, current_severity: str) -> Optional[Dict[str, str]]:
    """Extract finding data from a single line."""
    if not any(
        ext in line
        for ext in [
            ".ts",
            ".tsx",
            ".js",
            ".jsx",
            ".py",
            ".yml",
            ".yaml",
            ".css",
            ".json",
            ".md",
            ".sh",
            ".ps1",
        ]
    ):
        return None

    file_match = re.search(
        r"([^\s|]+\.(ts|tsx|js|jsx|py|yml|yaml|css|json|md|sh|ps1))", line
    )
    if not file_match:
        return None

    file_path = file_match.group(1).strip("`")
    line_num = _extract_line_number(line)
    severity = _determine_severity(line, current_severity)
    summary = _create_summary(line)

    finding = {
        "severity": severity,
        "file": file_path,
        "line": line_num,
        "summary": summary,
    }

    return finding


def _extract_line_number(line: str) -> str:
    """Extract line number from line if present."""
    line_match = re.search(r"\b(\d{1,5})\b", line)
    return line_match.group(1) if line_match else "N/A"


def _determine_severity(line: str, current_severity: str) -> str:
    """Determine severity for finding."""
    if any(s in line.lower() for s in ["critical", "high", "medium", "low"]):
        return parse_severity(line)
    return current_severity.lower()


def _create_summary(line: str) -> str:
    """Create summary text from line."""
    summary = line.strip()
    summary = re.sub(r"\|", " ", summary)
    summary = " ".join(summary.split())

    if len(summary) > 200:
        summary = summary[:197] + "..."

    return summary


def create_issue_for_finding(
    api: GitHubAPI, finding: Dict[str, str], index: int
) -> bool:
    """Create GitHub issue for a finding."""
    severity = finding["severity"].upper()
    labels = get_labels(finding["severity"])

    title = f"[{severity}] Security Issue #{index} - {finding['file']}:{finding['line']}"
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
    """Extract repo from git remote.

    SECURITY: Uses subprocess.run with command as list (not shell=True)
    to prevent command injection.
    """
    try:
        import subprocess

        # SECURITY: Command passed as list without shell=True is safe
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
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Git command failed: {e}")
    except Exception as e:
        print(f"[ERROR] Failed to get repo from git: {e}")
    return None


def setup_arguments() -> argparse.Namespace:
    """Parse command line arguments."""
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
    return parser.parse_args()


def get_token(args: argparse.Namespace) -> str:
    """Get GitHub token from arguments or environment."""
    token = (
        args.token
        or os.getenv("GITHUB_TOKEN")
        or os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN")
    )
    if not token:
        print("[ERROR] GitHub token required. Set GITHUB_PERSONAL_ACCESS_TOKEN in .env")
        sys.exit(1)

    return token.strip('"').strip("'")


def get_repo(args: argparse.Namespace) -> str:
    """Get repository from arguments or git."""
    repo = args.repo or get_repo_from_git()
    if not repo:
        print("[ERROR] Could not determine repository. Use --repo owner/repo")
        sys.exit(1)
    return repo


def parse_and_filter_findings(args: argparse.Namespace) -> List[Dict[str, str]]:
    """Parse report and apply filters."""
    print(f"Reading {REPORT_PATH}...")
    findings = parse_report()
    print(f"[OK] Found {len(findings)} total findings")

    if args.severity:
        findings = [
            f for f in findings if f["severity"].lower() == args.severity.lower()
        ]
        print(f"[OK] Filtered to {len(findings)} {args.severity} findings")

    findings = findings[: args.limit]
    print(f"[OK] Creating {len(findings)} issues")
    print()
    return findings


def confirm_creation(findings: List[Dict[str, str]], args: argparse.Namespace) -> None:
    """Get user confirmation before creating issues."""
    if not args.yes and sys.stdin.isatty():
        response = input(f"Create {len(findings)} issues? [y/N]: ")
        if response.lower() not in ["y", "yes"]:
            print("[CANCELLED]")
            sys.exit(0)
        print()


def create_issues(api: GitHubAPI, findings: List[Dict[str, str]]) -> tuple[int, int]:
    """Create GitHub issues and return counts."""
    print("Creating issues...")
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

    return created, failed


def main():
    """Main execution function."""
    args = setup_arguments()

    print("=" * 80)
    print("Security Issue Creator - TEST MODE")
    print("=" * 80)
    print()

    token = get_token(args)
    repo = get_repo(args)
    print(f"Repository: {repo}")
    print(f"Limit: {args.limit} issues")
    if args.severity:
        print(f"Severity filter: {args.severity}")
    print()

    findings = parse_and_filter_findings(args)
    confirm_creation(findings, args)

    api = GitHubAPI(token, repo)
    created, failed = create_issues(api, findings)

    print("=" * 80)
    print(f"[OK] Created: {created}")
    if failed > 0:
        print(f"[ERROR] Failed: {failed}")
    print("=" * 80)


if __name__ == "__main__":
    main()
