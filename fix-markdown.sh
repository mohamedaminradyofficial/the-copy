#!/bin/bash

# Fix markdown linting issues across all .md files
# This script applies common markdown formatting fixes

echo "🔧 Applying markdown linting fixes..."

# Find all markdown files
find . -type f -name "*.md" ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/build/*" ! -path "*/dist/*" | while read -r file; do
    echo "Processing: $file"

    # Create a temporary file
    temp_file=$(mktemp)

    # Apply fixes using sed
    # 1. Remove trailing colons from headers (but keep content after colon)
    # 2. Ensure blank line before list items that directly follow headers
    sed -e 's/^\(###\? .*\):$/\1/' \
        -e '/^###/{ N; s/\n-/\n\n-/; }' \
        "$file" > "$temp_file"

    # Only update if file changed
    if ! cmp -s "$file" "$temp_file"; then
        mv "$temp_file" "$file"
        echo "  ✓ Updated: $file"
    else
        rm "$temp_file"
    fi
done

echo "✅ Markdown linting fixes complete!"
