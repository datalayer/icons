#!/usr/bin/env python3
# Copyright (c) 2023-2024 Datalayer, Inc.
#
# Datalayer License

"""
Clean SVG files by removing non-standard attributes and metadata.

This script removes:
- Inkscape namespaces and attributes (inkscape:*)
- Sodipodi namespaces and attributes (sodipodi:*)
- RDF/CC/DC metadata elements
- xml:space attribute
- Unnecessary namespace declarations
- Empty defs elements
- namedview elements
- metadata elements

Usage:
    python clean_svgs.py [--dry-run] [path]
    
    --dry-run: Show what would be changed without modifying files
    path: Optional path to a specific SVG file or directory (default: current directory)
"""

import argparse
import re
import sys
from pathlib import Path


# Namespaces to remove from xmlns declarations
NAMESPACES_TO_REMOVE = [
    'xmlns:dc',
    'xmlns:cc', 
    'xmlns:rdf',
    'xmlns:sodipodi',
    'xmlns:inkscape',
    'xmlns:svg',  # Redundant when xmlns is present
]

# Attribute prefixes to remove
ATTR_PREFIXES_TO_REMOVE = [
    'inkscape:',
    'sodipodi:',
]

# Standalone attributes to remove
ATTRS_TO_REMOVE = [
    'xml:space',
]

# Elements to remove entirely (including their content)
ELEMENTS_TO_REMOVE = [
    'metadata',
    'sodipodi:namedview',
    'rdf:RDF',
    'inkscape:path-effect',
    'inkscape:perspective',
    'inkscape:grid',
]


def clean_svg(content: str) -> str:
    """Clean an SVG string by removing non-standard attributes and elements."""
    
    # Remove elements entirely (with their content)
    for element in ELEMENTS_TO_REMOVE:
        # Handle self-closing tags
        content = re.sub(
            rf'<{re.escape(element)}[^>]*/>\s*',
            '',
            content,
            flags=re.DOTALL | re.IGNORECASE
        )
        # Handle opening/closing tag pairs
        content = re.sub(
            rf'<{re.escape(element)}[^>]*>.*?</{re.escape(element)}>\s*',
            '',
            content,
            flags=re.DOTALL | re.IGNORECASE
        )
    
    # Remove namespace declarations
    for ns in NAMESPACES_TO_REMOVE:
        content = re.sub(
            rf'\s*{re.escape(ns)}="[^"]*"',
            '',
            content
        )
    
    # Remove attributes with unwanted prefixes
    for prefix in ATTR_PREFIXES_TO_REMOVE:
        content = re.sub(
            rf'\s*{re.escape(prefix)}[a-zA-Z0-9_-]+="[^"]*"',
            '',
            content
        )
    
    # Remove standalone attributes
    for attr in ATTRS_TO_REMOVE:
        content = re.sub(
            rf'\s*{re.escape(attr)}="[^"]*"',
            '',
            content
        )
    
    # Remove empty defs elements
    content = re.sub(
        r'<defs[^>]*>\s*</defs>\s*',
        '',
        content,
        flags=re.DOTALL
    )
    content = re.sub(
        r'<defs[^>]*/>\s*',
        '',
        content
    )
    
    # Clean up multiple spaces in tags
    content = re.sub(r'(<[^>]*?)  +', r'\1 ', content)
    
    # Clean up spaces before > or />
    content = re.sub(r'\s+(/?>)', r'\1', content)
    
    # Clean up multiple newlines
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    
    # Clean up leading whitespace on lines inside svg tag
    lines = content.split('\n')
    cleaned_lines = []
    for line in lines:
        # Remove trailing whitespace
        line = line.rstrip()
        cleaned_lines.append(line)
    
    content = '\n'.join(cleaned_lines)
    
    # Ensure file ends with newline
    if not content.endswith('\n'):
        content += '\n'
    
    return content


def process_file(filepath: Path, dry_run: bool = False) -> tuple[bool, str]:
    """
    Process a single SVG file.
    
    Returns:
        tuple of (was_modified, message)
    """
    try:
        original_content = filepath.read_text(encoding='utf-8')
    except Exception as e:
        return False, f"Error reading {filepath}: {e}"
    
    cleaned_content = clean_svg(original_content)
    
    if cleaned_content == original_content:
        return False, f"No changes needed: {filepath.name}"
    
    if dry_run:
        # Calculate size difference
        original_size = len(original_content.encode('utf-8'))
        cleaned_size = len(cleaned_content.encode('utf-8'))
        savings = original_size - cleaned_size
        return True, f"Would clean: {filepath.name} (save {savings} bytes)"
    
    try:
        filepath.write_text(cleaned_content, encoding='utf-8')
        original_size = len(original_content.encode('utf-8'))
        cleaned_size = len(cleaned_content.encode('utf-8'))
        savings = original_size - cleaned_size
        return True, f"Cleaned: {filepath.name} (saved {savings} bytes)"
    except Exception as e:
        return False, f"Error writing {filepath}: {e}"


def process_directory(directory: Path, dry_run: bool = False) -> None:
    """Process all SVG files in a directory recursively."""
    svg_files = list(directory.rglob('*.svg'))
    
    if not svg_files:
        print(f"No SVG files found in {directory}")
        return
    
    print(f"Found {len(svg_files)} SVG files")
    print("-" * 50)
    
    modified_count = 0
    total_savings = 0
    
    for filepath in sorted(svg_files):
        was_modified, message = process_file(filepath, dry_run)
        print(message)
        
        if was_modified:
            modified_count += 1
            # Extract savings from message
            match = re.search(r'(\d+) bytes', message)
            if match:
                total_savings += int(match.group(1))
    
    print("-" * 50)
    action = "Would modify" if dry_run else "Modified"
    print(f"{action} {modified_count}/{len(svg_files)} files")
    print(f"Total savings: {total_savings:,} bytes ({total_savings/1024:.1f} KB)")


def main():
    parser = argparse.ArgumentParser(
        description='Clean SVG files by removing non-standard attributes and metadata.'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would be changed without modifying files'
    )
    parser.add_argument(
        'path',
        nargs='?',
        default='.',
        help='Path to SVG file or directory (default: current directory)'
    )
    
    args = parser.parse_args()
    path = Path(args.path)
    
    if not path.exists():
        print(f"Error: Path does not exist: {path}")
        sys.exit(1)
    
    if path.is_file():
        if path.suffix.lower() != '.svg':
            print(f"Error: Not an SVG file: {path}")
            sys.exit(1)
        was_modified, message = process_file(path, args.dry_run)
        print(message)
    else:
        process_directory(path, args.dry_run)


if __name__ == '__main__':
    main()
