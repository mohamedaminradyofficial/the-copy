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
from typing import List, Dict, Tuple, Optional

REPORT_PATH = Path("SECURITY_SCAN_REPORT.md")


def run_command(cmd: List[str], dry_run: bool = False) -> Tuple[int, str]:
    """Execute command safely without shell and return (returncode, output).

    SECURITY: This function does NOT use shell=True to prevent command injection.
    Commands must be passed as a list of arguments.
    """
    if dry_run:
        print(f"[DRY-RUN] Would execute: {' '.join(cmd)}")
        return 0, ""

    print(f" Executing: {' '.join(cmd)}")
    try:
        # SECURITY FIX: Removed shell=True to prevent command injection
        result = subprocess.run(
            cmd, shell=False, capture_output=True, text=True, encoding="utf-8"
        )
        return result.returncode, result.stdout + result.stderr
    except subprocess.SubprocessError as e:
        print(f" Error executing command: {e}")
        return 1, str(e)


def sanitize(text: str) -> str:
    """Clean and sanitize text for use in commands."""
    return text.strip().strip("`").strip()


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


def _parse_table_row(row_parts: List[str]) -> Optional[Dict[str, str]]:
    """Parse a single table row into finding data."""
    if len(row_parts) < 3:
        return None

    # Skip header/empty rows
    row_text = " ".join(row_parts)
    if any(c in "-:|" for c in row_text) or "Severity" in row_text:
        return None

    finding = {}

    # Try to identify columns by content
    severity_col = _find_column_by_content(row_parts, ["critical", "high", "medium", "low"])
    category_col = _find_column_by_content(row_parts, [
        "xss", "path traversal", "dos", "insecure", "code style",
        "complexity", "security"
    ])
    location_col = _find_location_column(row_parts)
    line_col = _find_line_column(row_parts)

    if severity_col is not None and location_col is not None:
        finding["severity"] = parse_severity(row_parts[severity_col])
        finding["category"] = (
            row_parts[category_col]
            if category_col is not None
            else "Security Issue"
        )
        finding["file"] = sanitize(row_parts[location_col])
        finding["line"] = row_parts[line_col] if line_col is not None else "N/A"
        finding["summary"] = _create_summary_from_parts(row_parts, severity_col, category_col, location_col, line_col)

        if finding.get("file"):
            return finding

    return None


def _find_column_by_content(parts: List[str], keywords: List[str]) -> Optional[int]:
    """Find column index containing any of the keywords."""
    for idx, part in enumerate(parts):
        part_lower = part.lower()
        if any(keyword in part_lower for keyword in keywords):
            return idx
    return None


def _find_location_column(parts: List[str]) -> Optional[int]:
    """Find column containing file path."""
    for idx, part in enumerate(parts):
        if "/" in part and any(
            ext in part for ext in [".ts", ".tsx", ".js", ".jsx", ".py", ".yml", ".md"]
        ):
            return idx
    return None


def _find_line_column(parts: List[str]) -> Optional[int]:
    """Find column containing line number."""
    for idx, part in enumerate(parts):
        if part.strip().isdigit() and int(part.strip()) < 100000:
            return idx
    return None


def _create_summary_from_parts(parts: List[str], *exclude_indices: int) -> str:
    """Create summary from remaining parts after excluding known columns."""
    remaining = [
        p for i, p in enumerate(parts)
        if i not in exclude_indices
    ]
    return " ".join(remaining) if remaining else "Security finding detected"


def parse_report() -> List[Dict[str, str]]:
    """Parse SECURITY_SCAN_REPORT.md and extract findings."""
    if not REPORT_PATH.exists():
        print(f" ERROR: {REPORT_PATH} not found.")
        sys.exit(1)

    findings = []

    with REPORT_PATH.open(encoding="utf-8") as f:
        content = f.read()

    lines = content.split("\n")

    # First try table parsing
    table_findings = _parse_table_format(lines)
    if table_findings:
        findings.extend(table_findings)

    # If table parsing didn't work well, try alternative text-based parsing
    if len(findings) < 10:
        print("  Table parsing yielded few results, trying alternative method...")
        text_findings = _parse_text_format(content)
        findings.extend(text_findings)

    # Remove duplicates
    unique_findings = []
    seen = set()
    for finding in findings:
        key = (finding["file"], finding["line"], finding["summary"][:100])
        if key not in seen:
            unique_findings.append(finding)
            seen.add(key)

    return unique_findings


def _parse_table_format(lines: List[str]) -> List[Dict[str, str]]:
    """Parse table format from lines."""
    findings = []

    for line in lines:
        if line.strip().startswith("|") and "|" in line:
            parts = [p.strip() for p in line.split("|")]
            # Remove empty first and last elements
            parts = [p for p in parts if p]

            finding = _parse_table_row(parts)
            if finding:
                findings.append(finding)

    return findings


def _parse_text_format(content: str) -> List[Dict[str, str]]:
    """Parse alternative text-based format."""
    findings = []
    lines = content.split("\n")
    current_severity = "MEDIUM"

    for line in lines:
        # Update current severity based on headers
        current_severity = _update_severity_from_line(line, current_severity)

        # Look for file paths
        if any(
            ext in line
            for ext in [".ts", ".tsx", ".js", ".jsx", ".py", ".yml", ".css", ".md"]
        ):
            finding = _extract_finding_from_text_line(line, current_severity)
            if finding:
                findings.append(finding)

    return findings


def _update_severity_from_line(line: str, current_severity: str) -> str:
    """Update severity based on line content."""
    if "CRITICAL" in line.upper() or "Critical" in line:
        return "CRITICAL"
    elif "HIGH" in line.upper() or "High" in line:
        return "HIGH"
    elif "MEDIUM" in line.upper() or "Medium" in line:
        return "MEDIUM"
    return current_severity


def _extract_finding_from_text_line(line: str, current_severity: str) -> Optional[Dict[str, str]]:
    """Extract finding from text line."""
    # Try to extract structured information
    file_match = re.search(
        r"([^\s]+\.(ts|tsx|js|jsx|py|yml|css|md|json))", line
    )
    if not file_match:
        return None

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
    return finding


def create_github_issue(finding: Dict[str, str], dry_run: bool = False) -> bool:
    """Create a GitHub issue for a single finding.

    SECURITY: Uses subprocess without shell=True to prevent command injection.
    """
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

    # SECURITY FIX: Build command as list to avoid shell injection
    # When using subprocess without shell=True, no escaping is needed
    cmd = ["gh", "issue", "create", "--title", title, "--body", body, "--label", labels]

    returncode, output = run_command(cmd, dry_run)

    if returncode == 0:
        print(f" Created issue: {title}")
        return True
    else:
        print(f" Failed to create issue: {title}")
        print(f"   Error: {output}")
        return False


def check_github_cli() -> None:
    """Check if GitHub CLI is installed and authenticated."""
    returncode, output = run_command(["gh", "auth", "status"], dry_run=False)
    if returncode != 0:
        print(" GitHub CLI not authenticated. Please run: gh auth login")
        sys.exit(1)

    print(" GitHub CLI authenticated")


def display_findings_summary(findings: List[Dict[str, str]]) -> None:
    """Display summary of findings by severity."""
    if not findings:
        return

    severity_counts = {}
    for finding in findings:
        sev = finding["severity"]
        severity_counts[sev] = severity_counts.get(sev, 0) + 1

    print(" Severity Distribution:")
    for sev in ["critical", "high", "medium", "low"]:
        count = severity_counts.get(sev, 0)
        if count > 0:
            print(f"   {sev.upper()}: {count}")
    print()


def get_user_confirmation(findings_count: int, dry_run: bool) -> None:
    """Get user confirmation before creating issues."""
    if dry_run or not sys.stdin.isatty():
        return

    response = input(f"Create {findings_count} GitHub issues? [y/N]: ")
    if response.lower() not in ["y", "yes"]:
        print(" Cancelled by user")
        sys.exit(0)
    print()


def create_all_issues(findings: List[Dict[str, str]], dry_run: bool) -> Tuple[int, int]:
    """Create all GitHub issues and return counts."""
    print(f" Creating {len(findings)} issues...")
    print()

    created = 0
    failed = 0

    for i, finding in enumerate(findings, 1):
        print(f"[{i}/{len(findings)}] ", end="")
        if create_github_issue(finding, dry_run):
            created += 1
        else:
            failed += 1

    return created, failed


def main():
    """Main execution function."""
    dry_run = "--dry-run" in sys.argv or "-n" in sys.argv

    print("=" * 80)
    print(" Security Issue Creator")
    print("=" * 80)
    print()

    if dry_run:
        print(" Running in DRY-RUN mode (no issues will be created)")
        print()

    # Check GitHub CLI
    check_github_cli()
    print()

    # Parse the report
    print(f" Reading {REPORT_PATH}...")
    findings = parse_report()

    print(f" Found {len(findings)} security findings")
    display_findings_summary(findings)

    if not findings:
        print("  No findings detected in the report.")
        print(
            "    Please ensure SECURITY_SCAN_REPORT.md contains a properly formatted table."
        )
        sys.exit(0)

    # Get user confirmation
    get_user_confirmation(len(findings), dry_run)

    # Create issues
    created, failed = create_all_issues(findings, dry_run)

    print()
    print("=" * 80)
    print(f" Successfully created: {created}")
    if failed > 0:
        print(f" Failed: {failed}")
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
