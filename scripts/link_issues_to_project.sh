#!/usr/bin/env bash
# scripts/link_issues_to_project.sh
# Link GitHub issues to a Classic Project board based on severity labels
# Requires: gh CLI authenticated (gh auth login)
#
# Usage:
#   ./scripts/link_issues_to_project.sh "Security Findings (classic)"
#   ./scripts/link_issues_to_project.sh --help

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default project name
DEFAULT_PROJECT_NAME="Security Findings (classic)"
PROJECT_NAME="${1:-$DEFAULT_PROJECT_NAME}"

# Help message
if [[ "${1:-}" == "--help" ]] || [[ "${1:-}" == "-h" ]]; then
  echo "Usage: $0 [PROJECT_NAME]"
  echo ""
  echo "Link GitHub issues to a Classic Project board based on severity labels."
  echo ""
  echo "Arguments:"
  echo "  PROJECT_NAME    Name of the project board (default: '$DEFAULT_PROJECT_NAME')"
  echo ""
  echo "Examples:"
  echo "  $0"
  echo "  $0 'My Security Board'"
  echo ""
  echo "Prerequisites:"
  echo "  - GitHub CLI (gh) installed and authenticated"
  echo "  - Issues created with security labels (security-critical, security-high, security-medium)"
  exit 0
fi

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}  Security Issues → Project Board Linker${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""
echo -e "Project: ${GREEN}$PROJECT_NAME${NC}"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
  echo -e "${RED}❌ ERROR: GitHub CLI (gh) is not installed.${NC}"
  echo "Install it from: https://cli.github.com/"
  exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
  echo -e "${RED}❌ ERROR: GitHub CLI not authenticated.${NC}"
  echo "Run: gh auth login"
  exit 1
fi

echo -e "${GREEN}✅ GitHub CLI authenticated${NC}"
echo ""

# Get repository info
REPO_INFO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
if [[ -z "$REPO_INFO" ]]; then
  echo -e "${RED}❌ ERROR: Not in a GitHub repository or no remote configured.${NC}"
  exit 1
fi

echo -e "Repository: ${GREEN}$REPO_INFO${NC}"
echo ""

# Check if project exists (for Classic Projects, we'll use the API)
echo -e "${YELLOW}🔍 Checking if project exists...${NC}"

# Note: Classic Projects API is different from Projects v2
# We need to use the GraphQL API or the REST API v3 for classic projects

# For now, we'll try to create it if it doesn't exist
# The gh project commands work with Projects v2, not Classic
# So we'll use a different approach

echo -e "${YELLOW}⚠️  Note: This script works with GitHub Projects v2${NC}"
echo -e "${YELLOW}    For Classic Projects, please create manually and use project number${NC}"
echo ""

# Check if project exists (v2)
PROJECT_EXISTS=$(gh project list --owner "$REPO_INFO" --format json 2>/dev/null | jq -r --arg name "$PROJECT_NAME" '.projects[] | select(.title==$name) | .number' || echo "")

if [[ -z "$PROJECT_EXISTS" ]]; then
  echo -e "${YELLOW}📋 Project not found. Creating new project...${NC}"

  # Create project (v2)
  gh project create --owner "$REPO_INFO" --title "$PROJECT_NAME" || {
    echo -e "${RED}❌ Failed to create project${NC}"
    exit 1
  }

  echo -e "${GREEN}✅ Project created${NC}"

  # Get the project number
  sleep 2
  PROJECT_NUMBER=$(gh project list --owner "$REPO_INFO" --format json | jq -r --arg name "$PROJECT_NAME" '.projects[] | select(.title==$name) | .number')
else
  PROJECT_NUMBER="$PROJECT_EXISTS"
  echo -e "${GREEN}✅ Project found: #$PROJECT_NUMBER${NC}"
fi

echo ""

# For Projects v2, we need to add custom fields for status
echo -e "${YELLOW}🔧 Setting up project fields...${NC}"

# Get project ID
PROJECT_ID=$(gh project list --owner "$REPO_INFO" --format json | jq -r --arg name "$PROJECT_NAME" '.projects[] | select(.title==$name) | .id')

if [[ -z "$PROJECT_ID" ]]; then
  echo -e "${RED}❌ Could not get project ID${NC}"
  exit 1
fi

# Note: Adding custom fields requires GraphQL mutations
# For simplicity, we'll document the required fields

echo -e "${BLUE}ℹ️  Please manually add the following Status field values to your project:${NC}"
echo -e "   - Critical Fixes"
echo -e "   - High"
echo -e "   - Medium"
echo -e "   - To Verify"
echo -e "   - Done"
echo ""

# Function to add issue to project
add_issue_to_project() {
  local ISSUE_NUMBER=$1
  local SEVERITY=$2

  echo -e "${BLUE}Adding issue #$ISSUE_NUMBER ($SEVERITY)...${NC}"

  # Add to project
  gh project item-add "$PROJECT_NUMBER" --owner "$REPO_INFO" --url "https://github.com/$REPO_INFO/issues/$ISSUE_NUMBER" 2>/dev/null || {
    echo -e "${YELLOW}  ⚠️  Issue #$ISSUE_NUMBER may already be in project${NC}"
    return 0
  }

  echo -e "${GREEN}  ✅ Added issue #$ISSUE_NUMBER${NC}"
}

# Process critical issues
echo -e "${RED}🔥 Processing CRITICAL issues...${NC}"
CRITICAL_ISSUES=$(gh issue list --label "security-critical" --state open --json number --jq '.[].number' 2>/dev/null || echo "")
CRITICAL_COUNT=0

if [[ -n "$CRITICAL_ISSUES" ]]; then
  while IFS= read -r issue_num; do
    if [[ -n "$issue_num" ]]; then
      add_issue_to_project "$issue_num" "CRITICAL"
      ((CRITICAL_COUNT++))
    fi
  done <<< "$CRITICAL_ISSUES"
fi

echo -e "${RED}   Total: $CRITICAL_COUNT critical issues${NC}"
echo ""

# Process high priority issues
echo -e "${YELLOW}⚠️  Processing HIGH priority issues...${NC}"
HIGH_ISSUES=$(gh issue list --label "security-high" --state open --json number --jq '.[].number' 2>/dev/null || echo "")
HIGH_COUNT=0

if [[ -n "$HIGH_ISSUES" ]]; then
  while IFS= read -r issue_num; do
    if [[ -n "$issue_num" ]]; then
      add_issue_to_project "$issue_num" "HIGH"
      ((HIGH_COUNT++))
    fi
  done <<< "$HIGH_ISSUES"
fi

echo -e "${YELLOW}   Total: $HIGH_COUNT high priority issues${NC}"
echo ""

# Process medium priority issues
echo -e "${BLUE}ℹ️  Processing MEDIUM priority issues...${NC}"
MEDIUM_ISSUES=$(gh issue list --label "security-medium" --state open --json number --jq '.[].number' 2>/dev/null || echo "")
MEDIUM_COUNT=0

if [[ -n "$MEDIUM_ISSUES" ]]; then
  while IFS= read -r issue_num; do
    if [[ -n "$issue_num" ]]; then
      add_issue_to_project "$issue_num" "MEDIUM"
      ((MEDIUM_COUNT++))
    fi
  done <<< "$MEDIUM_ISSUES"
fi

echo -e "${BLUE}   Total: $MEDIUM_COUNT medium priority issues${NC}"
echo ""

# Summary
TOTAL=$((CRITICAL_COUNT + HIGH_COUNT + MEDIUM_COUNT))

echo -e "${BLUE}============================================================${NC}"
echo -e "${GREEN}✅ Summary${NC}"
echo -e "${BLUE}============================================================${NC}"
echo -e "  Critical: ${RED}$CRITICAL_COUNT${NC}"
echo -e "  High:     ${YELLOW}$HIGH_COUNT${NC}"
echo -e "  Medium:   ${BLUE}$MEDIUM_COUNT${NC}"
echo -e "  ${GREEN}Total:    $TOTAL issues added to project${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

if [[ $CRITICAL_COUNT -gt 0 ]]; then
  echo -e "${RED}⚠️  WARNING: $CRITICAL_COUNT critical security issues require immediate attention!${NC}"
  echo -e "${RED}   These issues will block merges until resolved.${NC}"
  echo ""
fi

echo -e "${GREEN}Next steps:${NC}"
echo -e "  1. Visit project: ${BLUE}https://github.com/$REPO_INFO/projects/$PROJECT_NUMBER${NC}"
echo -e "  2. Organize issues by moving them to appropriate status columns"
echo -e "  3. Assign owners to each critical and high priority issue"
echo -e "  4. Set up branch protection rules to enforce security gate"
echo ""
echo -e "${GREEN}Done!${NC}"
