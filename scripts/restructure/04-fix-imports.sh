#!/bin/bash

###############################################################################
# Script: 04-fix-imports.sh
# Purpose: Fix imports after restructuring
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

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      The Copy - Project Restructure: Fix Imports       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

###############################################################################
# Function: Search and report imports
###############################################################################

search_imports() {
    local pattern=$1
    local description=$2

    echo -e "${YELLOW}Searching for: $description${NC}"
    local count=$(grep -r "$pattern" "$FRONTEND_DIR/src" --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)

    if [ $count -gt 0 ]; then
        echo -e "${RED}Found $count occurrences${NC}"
        grep -r "$pattern" "$FRONTEND_DIR/src" --include="*.ts" --include="*.tsx" -n 2>/dev/null | head -10
        echo ""
        return 1
    else
        echo -e "${GREEN}✅ None found${NC}"
        echo ""
        return 0
    fi
}

###############################################################################
# Check for problematic imports
###############################################################################

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Checking for problematic imports${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

has_errors=false

# Check for imports from deleted directories
if search_imports "from ['\"]@\/\.\.\/ai\/" "Imports from deleted /ai directory"; then
    :
else
    has_errors=true
fi

if search_imports "from ['\"]\.\.\/\.\.\/ai\/" "Relative imports from deleted /ai"; then
    :
else
    has_errors=true
fi

if search_imports "from ['\"]@\/\.\.\/stations\/" "Imports from deleted /stations"; then
    :
else
    has_errors=true
fi

if search_imports "from ['\"]@\/\.\.\/utils\/" "Imports from old /utils location"; then
    :
else
    has_errors=true
fi

# Check for .js imports (should be .ts)
if search_imports "from ['\"].*\.js['\"]" "Imports of .js files"; then
    :
else
    has_errors=true
fi

###############################################################################
# Manual fixes needed
###############################################################################

if [ "$has_errors" = true ]; then
    echo -e "${RED}⚠️  Problematic imports found!${NC}"
    echo ""
    echo -e "${YELLOW}Common fixes:${NC}"
    echo ""
    echo "1. Replace imports from deleted directories:"
    echo "   FROM: import { ... } from '../ai/services/gemini'"
    echo "   TO:   import { ... } from '@/lib/ai/services/gemini'"
    echo ""
    echo "2. Replace imports from old utils:"
    echo "   FROM: import { ... } from '../../utils/helper'"
    echo "   TO:   import { ... } from '@/lib/utils/helper'"
    echo ""
    echo "3. Remove .js extensions:"
    echo "   FROM: import { ... } from './file.js'"
    echo "   TO:   import { ... } from './file'"
    echo ""
    echo -e "${YELLOW}Run TypeScript compiler to see all errors:${NC}"
    echo "   pnpm run typecheck"
    echo ""
else
    echo -e "${GREEN}✅ No problematic imports found!${NC}"
    echo ""
fi

###############################################################################
# Verify structure
###############################################################################

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Verifying new structure${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Checking required directories:${NC}"

required_dirs=(
    "$FRONTEND_DIR/src/lib/ai"
    "$FRONTEND_DIR/src/lib/drama-analyst"
    "$FRONTEND_DIR/src/lib/config"
    "$FRONTEND_DIR/src/lib/utils"
)

all_exist=true
for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅ $dir${NC}"
    else
        echo -e "${RED}❌ $dir${NC}"
        all_exist=false
    fi
done

echo ""

if [ "$all_exist" = true ]; then
    echo -e "${GREEN}✅ All required directories exist${NC}"
else
    echo -e "${RED}❌ Some directories are missing${NC}"
fi

echo ""

###############################################################################
# Summary
###############################################################################

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              Import Check Complete!                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$has_errors" = false ] && [ "$all_exist" = true ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Run: pnpm run typecheck"
    echo "  2. Run: pnpm run lint"
    echo "  3. Run: pnpm run test"
    echo "  4. If all pass, run: ./scripts/restructure/05-verify-build.sh"
else
    echo -e "${YELLOW}⚠️  Manual fixes required${NC}"
    echo ""
    echo "Please fix the reported issues and run this script again."
fi

echo ""
