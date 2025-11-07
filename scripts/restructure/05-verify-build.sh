#!/bin/bash

###############################################################################
# Script: 05-verify-build.sh
# Purpose: Comprehensive verification of restructured project
# Author: The Copy Team
# Date: 2025-11-07
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

FRONTEND_DIR="frontend"
BACKEND_DIR="backend"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      The Copy - Project Restructure: Verification      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

all_passed=true

###############################################################################
# Step 1: Install dependencies
###############################################################################

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}[1/6] Installing dependencies${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Running: pnpm install${NC}"
if pnpm install; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    all_passed=false
fi
echo ""

###############################################################################
# Step 2: Type checking
###############################################################################

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}[2/6] Type checking${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Running: pnpm run typecheck${NC}"
if pnpm run typecheck; then
    echo -e "${GREEN}✅ Type checking passed${NC}"
else
    echo -e "${RED}❌ Type checking failed${NC}"
    all_passed=false
fi
echo ""

###############################################################################
# Step 3: Linting
###############################################################################

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}[3/6] Linting${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Running: pnpm run lint${NC}"
if pnpm run lint; then
    echo -e "${GREEN}✅ Linting passed${NC}"
else
    echo -e "${RED}❌ Linting failed${NC}"
    all_passed=false
fi
echo ""

###############################################################################
# Step 4: Running tests
###############################################################################

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}[4/6] Running tests${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Running: pnpm run test${NC}"
if pnpm run test; then
    echo -e "${GREEN}✅ Tests passed${NC}"
else
    echo -e "${RED}❌ Tests failed${NC}"
    all_passed=false
fi
echo ""

###############################################################################
# Step 5: Building project
###############################################################################

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}[5/6] Building project${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Running: pnpm run build${NC}"
if pnpm run build; then
    echo -e "${GREEN}✅ Build successful${NC}"

    # Check build output
    if [ -d "$FRONTEND_DIR/.next" ]; then
        echo -e "${YELLOW}Build size:${NC}"
        du -sh "$FRONTEND_DIR/.next"
        echo ""
    fi
else
    echo -e "${RED}❌ Build failed${NC}"
    all_passed=false
fi
echo ""

###############################################################################
# Step 6: Structure verification
###############################################################################

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}[6/6] Verifying structure${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Check that old directories are gone
echo -e "${YELLOW}Checking deleted directories:${NC}"
deleted_dirs=(
    "$FRONTEND_DIR/ai"
    "$FRONTEND_DIR/stations"
    "$FRONTEND_DIR/constitutional"
    "$FRONTEND_DIR/core"
)

for dir in "${deleted_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${RED}❌ $dir still exists (should be deleted)${NC}"
        all_passed=false
    else
        echo -e "${GREEN}✅ $dir removed${NC}"
    fi
done
echo ""

# Check that new directories exist
echo -e "${YELLOW}Checking new directories:${NC}"
new_dirs=(
    "$FRONTEND_DIR/src/lib/config"
)

for dir in "${new_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅ $dir exists${NC}"
    else
        echo -e "${RED}❌ $dir missing${NC}"
        all_passed=false
    fi
done
echo ""

# Count TypeScript files
echo -e "${YELLOW}File statistics:${NC}"
ts_count=$(find "$FRONTEND_DIR/src" -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l)
js_count=$(find "$FRONTEND_DIR/src" -name "*.js" -o -name "*.jsx" 2>/dev/null | wc -l)

echo "  TypeScript files: $ts_count"
echo "  JavaScript files: $js_count"

if [ $js_count -gt 10 ]; then
    echo -e "${YELLOW}  ⚠️  Many .js files found (expected mostly .ts)${NC}"
fi
echo ""

###############################################################################
# Performance comparison
###############################################################################

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Performance Comparison${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

if [ -f "docs/restructure/lib-sizes-before.txt" ]; then
    echo -e "${YELLOW}Before restructure:${NC}"
    cat docs/restructure/lib-sizes-before.txt 2>/dev/null || echo "No data"
    echo ""
fi

if [ -d "$FRONTEND_DIR/src/lib" ]; then
    echo -e "${YELLOW}After restructure:${NC}"
    du -sh "$FRONTEND_DIR/src/lib"/* 2>/dev/null | sort -hr
    echo ""
fi

###############################################################################
# Git summary
###############################################################################

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Git Changes Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

git_stats=$(git diff --shortstat HEAD)
echo -e "${YELLOW}Changes:${NC}"
echo "$git_stats"
echo ""

echo -e "${YELLOW}Files changed:${NC}"
git diff --name-status HEAD | head -20
echo ""

###############################################################################
# Final Summary
###############################################################################

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"

if [ "$all_passed" = true ]; then
    echo -e "${GREEN}║              🎉 ALL VERIFICATIONS PASSED! 🎉            ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}✅ TypeCheck: Passed${NC}"
    echo -e "${GREEN}✅ Linting: Passed${NC}"
    echo -e "${GREEN}✅ Tests: Passed${NC}"
    echo -e "${GREEN}✅ Build: Successful${NC}"
    echo -e "${GREEN}✅ Structure: Verified${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Review the changes: git diff"
    echo "  2. Commit the changes: git add -A && git commit -m 'refactor: project restructure'"
    echo "  3. Push to remote: git push origin $(git branch --show-current)"
    echo "  4. Create PR for review"
    echo "  5. Deploy to staging environment"
    echo ""
    echo -e "${GREEN}🚀 Ready for production deployment!${NC}"
else
    echo -e "${RED}║              ❌ VERIFICATION FAILED ❌                  ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}Some checks failed. Please review the errors above.${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo "  1. Check TypeScript errors: pnpm run typecheck"
    echo "  2. Fix linting issues: pnpm run lint:fix"
    echo "  3. Review failing tests: pnpm run test"
    echo "  4. Check build logs for errors"
    echo ""
    echo -e "${YELLOW}Rollback if needed:${NC}"
    echo "  git checkout backup/pre-restructure"
fi

echo ""
