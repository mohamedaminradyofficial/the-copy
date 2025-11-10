#!/bin/bash

###############################################################################
# Script: 02-cleanup-duplicates.sh
# Purpose: Remove duplicate files and directories
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
DRY_RUN=${DRY_RUN:-false}
FRONTEND_DIR="frontend"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      The Copy - Project Restructure: Cleanup           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}⚠️  DRY RUN MODE - No files will be deleted${NC}"
    echo ""
fi

###############################################################################
# Safety checks
###############################################################################

echo -e "${YELLOW}[Safety Checks]${NC}"

# Check if we're in the right directory
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}❌ Frontend directory not found!${NC}"
    echo "Please run this script from the project root"
    exit 1
fi

# Check if we're on the right branch
CURRENT_BRANCH=$(git branch --show-current)
if [[ ! "$CURRENT_BRANCH" =~ ^(refactor/|backup/) ]]; then
    echo -e "${RED}❌ Not on a safe branch!${NC}"
    echo "Current branch: $CURRENT_BRANCH"
    echo "Please run 01-backup-and-prepare.sh first"
    exit 1
fi

echo -e "${GREEN}✅ Safety checks passed${NC}"
echo ""

###############################################################################
# Function: Safe delete
###############################################################################

safe_delete() {
    local path=$1
    local description=$2

    if [ ! -e "$path" ]; then
        echo -e "${YELLOW}⚠️  Not found: $path${NC}"
        return 0
    fi

    echo -e "${YELLOW}🗑️  Deleting: $description${NC}"
    echo "   Path: $path"

    if [ "$DRY_RUN" = true ]; then
        echo -e "${BLUE}   [DRY RUN] Would delete${NC}"
    else
        if [ -d "$path" ]; then
            rm -rf "$path"
            echo -e "${GREEN}   ✅ Directory deleted${NC}"
        elif [ -f "$path" ]; then
            rm -f "$path"
            echo -e "${GREEN}   ✅ File deleted${NC}"
        fi
    fi
    echo ""
}

###############################################################################
# Step 1: Delete duplicate directories outside src/
###############################################################################

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 1: Removing duplicate directories outside src/${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

safe_delete "$FRONTEND_DIR/ai" "AI directory (duplicate)"
safe_delete "$FRONTEND_DIR/stations" "Stations directory (duplicate)"
safe_delete "$FRONTEND_DIR/constitutional" "Constitutional directory (duplicate)"
safe_delete "$FRONTEND_DIR/core" "Core directory (old)"
safe_delete "$FRONTEND_DIR/interfaces" "Interfaces directory (should be in src)"

echo -e "${GREEN}✅ Step 1 complete: Duplicate directories removed${NC}"
echo ""

###############################################################################
# Step 2: Delete duplicate .js files
###############################################################################

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 2: Removing duplicate .js files${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

safe_delete "$FRONTEND_DIR/gemini-core.js" "gemini-core.js (root level)"

# Find and delete .js files in src/lib/ai (keeping .ts files)
if [ -d "$FRONTEND_DIR/src/lib/ai" ]; then
    echo -e "${YELLOW}Cleaning .js files from src/lib/ai...${NC}"

    if [ "$DRY_RUN" = true ]; then
        find "$FRONTEND_DIR/src/lib/ai" -name "*.js" -type f | while read file; do
            echo -e "${BLUE}[DRY RUN] Would delete: $file${NC}"
        done
    else
        find "$FRONTEND_DIR/src/lib/ai" -name "*.js" -type f -delete
        echo -e "${GREEN}✅ Deleted .js files${NC}"
    fi

    # Also delete .d.ts files (they'll be regenerated)
    if [ "$DRY_RUN" = true ]; then
        find "$FRONTEND_DIR/src/lib/ai" -name "*.d.ts" -type f | while read file; do
            echo -e "${BLUE}[DRY RUN] Would delete: $file${NC}"
        done
    else
        find "$FRONTEND_DIR/src/lib/ai" -name "*.d.ts" -type f -delete
        echo -e "${GREEN}✅ Deleted .d.ts files${NC}"
    fi
fi

echo ""
echo -e "${GREEN}✅ Step 2 complete: Duplicate .js files removed${NC}"
echo ""

###############################################################################
# Step 3: Move utils/ to src/lib/
###############################################################################

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 3: Moving utils/ to src/lib/${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

if [ -d "$FRONTEND_DIR/utils" ] && [ "$(ls -A $FRONTEND_DIR/utils)" ]; then
    echo -e "${YELLOW}Moving utils/ to src/lib/utils/${NC}"

    if [ "$DRY_RUN" = true ]; then
        echo -e "${BLUE}[DRY RUN] Would move:${NC}"
        ls -la "$FRONTEND_DIR/utils"
    else
        # Create destination if it doesn't exist
        mkdir -p "$FRONTEND_DIR/src/lib/utils"

        # Move files (don't overwrite existing)
        for file in "$FRONTEND_DIR/utils"/*; do
            filename=$(basename "$file")
            dest="$FRONTEND_DIR/src/lib/utils/$filename"

            if [ -e "$dest" ]; then
                echo -e "${YELLOW}⚠️  File exists, keeping src version: $filename${NC}"
            else
                mv "$file" "$dest"
                echo -e "${GREEN}✅ Moved: $filename${NC}"
            fi
        done

        # Remove empty utils directory
        rmdir "$FRONTEND_DIR/utils" 2>/dev/null || true
    fi
else
    echo -e "${YELLOW}⚠️  utils/ directory not found or empty${NC}"
fi

echo ""
echo -e "${GREEN}✅ Step 3 complete: utils/ processed${NC}"
echo ""

###############################################################################
# Step 4: Report results
###############################################################################

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Cleanup Results${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Count remaining files
if [ -d "$FRONTEND_DIR/src/lib" ]; then
    echo -e "${YELLOW}Remaining src/lib structure:${NC}"
    du -sh "$FRONTEND_DIR/src/lib"/* 2>/dev/null | sort -hr || true
    echo ""
fi

# List remaining gemini files
echo -e "${YELLOW}Remaining gemini files:${NC}"
find "$FRONTEND_DIR" -name "gemini*.ts" -type f | grep -v node_modules | sort || echo "None found"
echo ""

###############################################################################
# Git status
###############################################################################

if [ "$DRY_RUN" = false ]; then
    echo -e "${YELLOW}Git status:${NC}"
    git status --short
    echo ""

    echo -e "${YELLOW}Files to be deleted:${NC}"
    git status --short | grep "^ D" | wc -l
    echo ""

    # Prompt for commit
    read -p "Commit changes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add -A
        git commit -m "refactor: remove duplicate files and directories

- Remove duplicate ai/, stations/, constitutional/ directories
- Remove duplicate .js files (keep .ts sources)
- Move utils/ to src/lib/utils/
- Clean up gemini-*.js files

Part of project restructure initiative.
"
        echo -e "${GREEN}✅ Changes committed${NC}"
    fi
fi

###############################################################################
# Summary
###############################################################################

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                  Cleanup Complete!                     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}This was a DRY RUN. To apply changes, run:${NC}"
    echo "  DRY_RUN=false ./scripts/restructure/02-cleanup-duplicates.sh"
else
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Run tests: pnpm run test"
    echo "  2. Check build: pnpm run build"
    echo "  3. If OK, run: ./scripts/restructure/03-restructure-config.sh"
fi
echo ""
