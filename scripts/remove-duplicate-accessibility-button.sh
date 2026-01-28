#!/bin/bash

# Fix duplicate accessibilityRole props
# Pattern: accessibilityRole="link" onPress={...}
#          accessibilityRole="button"
# Solution: Remove the accessibilityRole="button" line

echo "🔧 Removing duplicate accessibilityRole=\"button\" lines..."

# Find all blog post files
find app/blog -name "*.tsx" -type f ! -name "_layout.tsx" ! -name "index.tsx" | while read file; do
  # Create a temp file
  temp_file="${file}.tmp"
  
  # Process the file
  awk '
    /accessibilityRole="link" onPress/ {
      print
      getline
      # If next line is just accessibilityRole="button", skip it
      if ($0 ~ /^[[:space:]]*accessibilityRole="button"[[:space:]]*$/) {
        next
      } else {
        print
      }
      next
    }
    { print }
  ' "$file" > "$temp_file"
  
  # Check if file changed
  if ! cmp -s "$file" "$temp_file"; then
    mv "$temp_file" "$file"
    echo "✅ Fixed: $(basename "$file")"
  else
    rm "$temp_file"
  fi
done

echo ""
echo "✅ Done!"
