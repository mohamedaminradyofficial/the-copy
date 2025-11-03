#!/usr/bin/env python3
"""
scripts/parse_create_issues.py

Parse SECURITY_SCAN_REPORT.md and create GitHub issues for each finding.
Requires: gh CLI (GitHub CLI) installed and authenticated (gh auth login)

Usage:
    python3 scripts/parse_create_issues.py [--dry-run]
"""

import re
import subprocess
import sys
from pathlib import Path
from typing import List, Dict, Tuple

REPORT_PATH = Path("SECURITY_SCAN_REPORT.md")


def run_command(cmd: str, dry_run: bool = False) -> Tuple[int, str]:
    """Execute shell command and return (returncode, output)."""
    if dry_run:
        print(f"[DRY-RUN] Would execute: {cmd}")
        return 0, ""

    print(f"🔧 Executing: {cmd}")
    try:
        result = subprocess.run(
            cmd, shell=True, capture_output=True, text=True, encoding="utf-8"
        )
        return result.returncode, result.stdout + result.stderr
    except Exception as e:
        print(f"❌ Error executing command: {e}")
        return 1, str(e)


def sanitize(text: str) -> str:
    """Clean and sanitize text for use in commands."""
    return text.strip().strip("`").strip()


def escape_for_shell(text: str) -> str:
    """Escape text for safe shell command usage."""
    # Replace double quotes with escaped double quotes
    text = text.replace('"', '\\"')
    # Replace backticks
    text = text.replace("`", "\\`")
    # Replace dollar signs
    text = text.replace("$", "\\$")
    return text


def parse_severity(text: str) -> str:
    """Extract severity level from text."""
    text_lower = text.lower()
    if "critical" in text_lower:
        return "critical"
    elif "high" in text_lower:
        return "high"
    elif "medium" in text_lower:
        return "medium"
    elif "low" in text_lower:
        return "low"
    return "medium"  # Default


def get_labels_for_severity(severity: str) -> str:
    """Get comma-separated labels for given severity."""
    base_labels = ["security"]

    if severity == "critical":
        base_labels.append("security-critical")
        base_labels.append("priority-p0")
    elif severity == "high":
        base_labels.append("security-high")
        base_labels.append("priority-p1")
    elif severity == "medium":
        base_labels.append("security-medium")
        base_labels.append("priority-p2")
    else:
        base_labels.append("security-low")
        base_labels.append("priority-p3")

    return ",".join(base_labels)


def parse_report() -> List[Dict[str, str]]:
    """Parse SECURITY_SCAN_REPORT.md and extract findings."""
    if not REPORT_PATH.exists():
        print(f"❌ ERROR: {REPORT_PATH} not found.")
        sys.exit(1)

    findings = []
    current_section = None

    with REPORT_PATH.open(encoding="utf-8") as f:
        content = f.read()

    lines = content.split("\n")

    for i, line in enumerate(lines):
        # Detect section headers for severity
        if line.strip().startswith("### Critical") or "Critical Fixes" in line:
            current_section = "CRITICAL"
        elif line.strip().startswith("### High"):
            current_section = "HIGH"
        elif line.strip().startswith("### Medium"):
            current_section = "MEDIUM"

        # Parse table rows that contain findings
        if line.strip().startswith("|") and "|" in line:
            parts = [p.strip() for p in line.split("|")]
            # Remove empty first and last elements
            parts = [p for p in parts if p]

            # Skip header rows and separator rows
            if len(parts) < 3:
                continue
            if all(c in "-:|" for c in "".join(parts)):
                continue
            if "Severity" in line or "Category" in line or "Location" in line:
                continue

            # Try to extract finding data
            # Expected format variations:
            # | ID | SEVERITY | CATEGORY | LOCATION | LINE | SUMMARY | STATUS |
            # | SEVERITY | CATEGORY | LOCATION | LINE | SUMMARY |

            if len(parts) >= 5:
                # Determine structure
                finding = {}

                # Try to identify columns
                severity_col = None
                category_col = None
                location_col = None
                line_col = None
                summary_col = None

                for idx, part in enumerate(parts):
                    part_lower = part.lower()
                    if any(
                        s in part_lower for s in ["critical", "high", "medium", "low"]
                    ):
                        severity_col = idx
                    elif any(
                        c in part_lower
                        for s in [
                            "xss",
                            "path traversal",
                            "dos",
                            "insecure",
                            "code style",
                            "complexity",
                        ]
                    ):
                        category_col = idx
                    elif "/" in part and (
                        ".ts" in part
                        or ".tsx" in part
                        or ".js" in part
                        or ".jsx" in part
                        or ".py" in part
                        or ".yml" in part
                        or ".md" in part
                    ):
                        location_col = idx
                    elif part.strip().isdigit() and int(part) < 100000:
                        line_col = idx

                if severity_col is not None and location_col is not None:
                    finding["severity"] = parse_severity(parts[severity_col])
                    finding["category"] = (
                        parts[category_col]
                        if category_col is not None
                        else "Security Issue"
                    )
                    finding["file"] = sanitize(parts[location_col])
                    finding["line"] = parts[line_col] if line_col is not None else "N/A"

                    # Get summary - usually the longest remaining field
                    remaining = [
                        p
                        for i, p in enumerate(parts)
                        if i not in [severity_col, category_col, location_col, line_col]
                    ]
                    finding["summary"] = (
                        " ".join(remaining)
                        if remaining
                        else "Security finding detected"
                    )

                    if finding.get("file"):
                        findings.append(finding)

    # If table parsing didn't work well, try alternative text-based parsing
    if len(findings) < 10:
        print("⚠️  Table parsing yielded few results, trying alternative method...")
        findings = parse_report_alternative(content)

    return findings


def parse_report_alternative(content: str) -> List[Dict[str, str]]:
    """Alternative parser for less structured reports."""
    findings = []
    lines = content.split("\n")

    current_severity = "MEDIUM"

    for i, line in enumerate(lines):
        # Update current severity based on headers
        if "CRITICAL" in line.upper() or "Critical" in line:
            current_severity = "CRITICAL"
        elif "HIGH" in line.upper() or "High" in line:
            current_severity = "HIGH"
        elif "MEDIUM" in line.upper() or "Medium" in line:
            current_severity = "MEDIUM"

        # Look for file paths
        if any(
            ext in line
            for ext in [".ts", ".tsx", ".js", ".jsx", ".py", ".yml", ".css", ".md"]
        ):
            # Try to extract structured information
            file_match = re.search(
                r"([^\s]+\.(ts|tsx|js|jsx|py|yml|css|md|json))", line
            )
            if file_match:
                file_path = file_match.group(1)

                # Look for line numbers nearby
                line_num = "N/A"
                line_match = re.search(r"\b(\d{1,5})\b", line)
                if line_match:
                    line_num = line_match.group(1)

                # Extract description from surrounding context
                summary = line.strip()
                if len(summary) > 200:
                    summary = summary[:197] + "..."

                finding = {
                    "severity": current_severity.lower(),
                    "category": "Security Issue",
                    "file": file_path,
                    "line": line_num,
                    "summary": summary,
                }
                findings.append(finding)

    return findings


def create_github_issue(finding: Dict[str, str], dry_run: bool = False) -> bool:
    """Create a GitHub issue for a single finding."""
    severity = finding["severity"].upper()
    labels = get_labels_for_severity(finding["severity"])

    # Create issue title
    title = f"[{severity}] {finding['category']} - {finding['file']}:{finding['line']}"
    if len(title) > 256:
        title = title[:253] + "..."

    # Create issue body
    body = f"""## Security Finding

**Severity:** {severity}
**Category:** {finding["category"]}
**File:** `{finding["file"]}`
**Line:** {finding["line"]}

### Description
{finding["summary"]}

### Source
This issue was automatically created from `SECURITY_SCAN_REPORT.md`.

### Required Actions
- [ ] Triage and assign owner
- [ ] Implement remediation with tests
- [ ] Add evidence (before/after, screenshots, PR link)
- [ ] Update SECURITY_FIXES.md
- [ ] Move to 'To Verify' column
- [ ] Verify fix and close issue

### References
- Security Process: [SECURITY_PROCESS.md](../SECURITY_PROCESS.md)
- Security Policy: [SECURITY.md](../SECURITY.md)
"""

    # Escape for shell
    title_escaped = escape_for_shell(title)
    body_escaped = escape_for_shell(body)

    # Create gh CLI command
    cmd = f'gh issue create --title "{title_escaped}" --body "{body_escaped}" --label "{labels}"'

    returncode, output = run_command(cmd, dry_run)

    if returncode == 0:
        print(f"✅ Created issue: {title}")
        return True
    else:
        print(f"❌ Failed to create issue: {title}")
        print(f"   Error: {output}")
        return False


def main():
    """Main execution function."""
    dry_run = "--dry-run" in sys.argv or "-n" in sys.argv

    print("=" * 80)
    print("🔒 Security Issue Creator")
    print("=" * 80)
    print()

    if dry_run:
        print("🏃 Running in DRY-RUN mode (no issues will be created)")
        print()

    # Check if gh CLI is installed and authenticated
    returncode, output = run_command("gh auth status", dry_run=False)
    if returncode != 0:
        print("❌ GitHub CLI not authenticated. Please run: gh auth login")
        sys.exit(1)

    print("✅ GitHub CLI authenticated")
    print()

    # Parse the report
    print(f"📖 Reading {REPORT_PATH}...")
    findings = parse_report()

    print(f"✅ Found {len(findings)} security findings")
    print()

    if not findings:
        print("⚠️  No findings detected in the report.")
        print(
            "    Please ensure SECURITY_SCAN_REPORT.md contains a properly formatted table."
        )
        sys.exit(0)

    # Show severity distribution
    severity_counts = {}
    for finding in findings:
        sev = finding["severity"]
        severity_counts[sev] = severity_counts.get(sev, 0) + 1

    print("📊 Severity Distribution:")
    for sev in ["critical", "high", "medium", "low"]:
        count = severity_counts.get(sev, 0)
        if count > 0:
            print(f"   {sev.upper()}: {count}")
    print()

    # Ask for confirmation unless in CI or dry-run
    if not dry_run and sys.stdin.isatty():
        response = input(f"Create {len(findings)} GitHub issues? [y/N]: ")
        if response.lower() not in ["y", "yes"]:
            print("❌ Cancelled by user")
            sys.exit(0)
        print()

    # Create issues
    print(f"🚀 Creating {len(findings)} issues...")
    print()

    created = 0
    failed = 0

    for i, finding in enumerate(findings, 1):
        print(f"[{i}/{len(findings)}] ", end="")
        if create_github_issue(finding, dry_run):
            created += 1
        else:
            failed += 1

    print()
    print("=" * 80)
    print(f"✅ Successfully created: {created}")
    if failed > 0:
        print(f"❌ Failed: {failed}")
    print("=" * 80)
    print()

    if not dry_run:
        print("Next steps:")
        print(
            '1. Run: bash scripts/link_issues_to_project.sh "Security Findings (classic)"'
        )
        print("2. Configure branch protection rules")
        print("3. Review and triage issues on the project board")

    sys.exit(0 if failed == 0 else 1)


if __name__ == "__main__":
    main()
