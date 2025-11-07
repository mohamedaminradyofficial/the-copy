#!/bin/bash

###############################################################################
# Script: 01-backup-and-prepare.sh
# Purpose: Create backup and prepare for restructuring
# Author: The Copy Team
# Date: 2025-11-07
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_BRANCH="backup/pre-restructure-$(date +%Y%m%d-%H%M%S)"
WORKING_BRANCH="refactor/project-restructure"
DOCS_DIR="docs/restructure"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   The Copy - Project Restructure: Backup & Prepare    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

###############################################################################
# Step 1: Check prerequisites
###############################################################################

echo -e "${YELLOW}[1/6] Checking prerequisites...${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed!${NC}"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed!${NC}"
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not a git repository!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

###############################################################################
# Step 2: Check for uncommitted changes
###############################################################################

echo -e "${YELLOW}[2/6] Checking for uncommitted changes...${NC}"

if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ You have uncommitted changes!${NC}"
    echo -e "${YELLOW}Please commit or stash your changes before proceeding.${NC}"
    git status --short
    exit 1
fi

echo -e "${GREEN}✅ Working directory is clean${NC}"
echo ""

###############################################################################
# Step 3: Create backup branch
###############################################################################

echo -e "${YELLOW}[3/6] Creating backup branch: ${BACKUP_BRANCH}${NC}"

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: ${CURRENT_BRANCH}"

# Create backup branch
git branch "${BACKUP_BRANCH}"
echo -e "${GREEN}✅ Backup branch created: ${BACKUP_BRANCH}${NC}"

# Push backup to remote (optional)
read -p "Push backup branch to remote? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin "${BACKUP_BRANCH}"
    echo -e "${GREEN}✅ Backup branch pushed to remote${NC}"
fi
echo ""

###############################################################################
# Step 4: Create documentation directory
###############################################################################

echo -e "${YELLOW}[4/6] Creating documentation directory...${NC}"

mkdir -p "${DOCS_DIR}"
echo -e "${GREEN}✅ Created directory: ${DOCS_DIR}${NC}"
echo ""

###############################################################################
# Step 5: Document current state
###############################################################################

echo -e "${YELLOW}[5/6] Documenting current state...${NC}"

# Document dependencies
echo "Documenting dependencies..."
pnpm list --depth=0 > "${DOCS_DIR}/dependencies-before.txt" 2>&1 || true
pnpm list --depth=0 --json > "${DOCS_DIR}/dependencies-before.json" 2>&1 || true

# Count files
echo "Counting files..."
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | \
    grep -v node_modules | \
    wc -l > "${DOCS_DIR}/files-count-before.txt"

# Count test files
find . -name "*.test.ts" -o -name "*.test.tsx" | \
    grep -v node_modules | \
    wc -l > "${DOCS_DIR}/test-files-count-before.txt"

# Document directory structure
echo "Documenting directory structure..."
find frontend -type d -not -path "*/node_modules/*" -not -path "*/.next/*" | \
    sort > "${DOCS_DIR}/directory-structure-before.txt"

# Document gemini files
echo "Documenting gemini files..."
find . -type f \( -name "gemini*.js" -o -name "gemini*.ts" \) | \
    grep -v node_modules > "${DOCS_DIR}/gemini-files-before.txt"

# Calculate directory sizes
echo "Calculating directory sizes..."
du -sh frontend/src/lib/* 2>/dev/null | \
    sort -hr > "${DOCS_DIR}/lib-sizes-before.txt" || true

echo -e "${GREEN}✅ Current state documented in ${DOCS_DIR}${NC}"
echo ""

###############################################################################
# Step 6: Create working branch
###############################################################################

echo -e "${YELLOW}[6/6] Creating working branch: ${WORKING_BRANCH}${NC}"

# Check if branch already exists
if git show-ref --verify --quiet "refs/heads/${WORKING_BRANCH}"; then
    echo -e "${YELLOW}⚠️  Branch ${WORKING_BRANCH} already exists${NC}"
    read -p "Delete and recreate? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git branch -D "${WORKING_BRANCH}"
        echo "Deleted existing branch"
    else
        echo "Keeping existing branch"
        git checkout "${WORKING_BRANCH}"
        echo -e "${GREEN}✅ Switched to existing branch${NC}"
        exit 0
    fi
fi

# Create and checkout working branch
git checkout -b "${WORKING_BRANCH}"
echo -e "${GREEN}✅ Created and switched to: ${WORKING_BRANCH}${NC}"
echo ""

###############################################################################
# Summary
###############################################################################

echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              Backup & Preparation Complete!            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Summary:${NC}"
echo "  📋 Current branch: ${CURRENT_BRANCH}"
echo "  💾 Backup branch: ${BACKUP_BRANCH}"
echo "  🚀 Working branch: ${WORKING_BRANCH}"
echo "  📁 Documentation: ${DOCS_DIR}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Run: ./scripts/restructure/02-cleanup-duplicates.sh"
echo "  2. Or review the backup documentation first"
echo ""
echo -e "${GREEN}✨ Ready to proceed with restructuring!${NC}"
