#!/usr/bin/env python3
"""
Flatten Codebase Script
-----------------------
Recursively walks through an Expo project directory and combines all relevant
source files into a single text file for LLM context.

Usage:
    python3 flatten_codebase.py
"""

import os
from pathlib import Path
from typing import Set

# Directories to ignore during traversal
IGNORED_DIRS: Set[str] = {
    'node_modules',
    '.git',
    '.expo',
    'dist',
    'web-build',
    'android',
    'ios',
    '__pycache__',
    '.next',
    'build',
    'coverage',
}

# File extensions to include
INCLUDED_EXTENSIONS: Set[str] = {
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.json',
    '.css',
    '.md',
}

# Specific files to exclude
EXCLUDED_FILES: Set[str] = {
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
}

# Output file name
OUTPUT_FILE = 'full_project_context.txt'


def should_process_file(file_path: Path) -> bool:
    """
    Determine if a file should be included in the output.
    
    Args:
        file_path: Path object representing the file
        
    Returns:
        True if the file should be processed, False otherwise
    """
    # Check if file has an allowed extension
    if file_path.suffix not in INCLUDED_EXTENSIONS:
        return False
    
    # Check if file is in the exclusion list
    if file_path.name in EXCLUDED_FILES:
        return False
    
    return True


def should_skip_directory(dir_name: str) -> bool:
    """
    Determine if a directory should be skipped during traversal.
    
    Args:
        dir_name: Name of the directory
        
    Returns:
        True if the directory should be skipped, False otherwise
    """
    return dir_name in IGNORED_DIRS or dir_name.startswith('.')


def read_file_safe(file_path: Path) -> str:
    """
    Safely read a file with UTF-8 encoding, handling errors gracefully.
    
    Args:
        file_path: Path to the file to read
        
    Returns:
        File contents as string, or error message if reading failed
    """
    encodings = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']
    
    for encoding in encodings:
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.read()
        except (UnicodeDecodeError, UnicodeError):
            continue
        except Exception as e:
            return f"[ERROR: Could not read file - {str(e)}]"
    
    return f"[ERROR: Could not decode file with any supported encoding]"


def flatten_codebase(root_dir: Path, output_file: Path) -> None:
    """
    Walk through the directory tree and flatten all relevant files into one output file.
    
    Args:
        root_dir: Root directory to start the traversal
        output_file: Path to the output file
    """
    files_processed = 0
    files_skipped = 0
    
    # Collect all files first for better organization
    files_to_process = []
    
    print(f"Scanning directory: {root_dir}")
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Remove ignored directories from the search
        dirnames[:] = [d for d in dirnames if not should_skip_directory(d)]
        
        current_path = Path(dirpath)
        
        for filename in filenames:
            file_path = current_path / filename
            
            # Skip the output file itself
            if file_path.name == OUTPUT_FILE:
                continue
            
            if should_process_file(file_path):
                relative_path = file_path.relative_to(root_dir)
                files_to_process.append((file_path, relative_path))
    
    # Sort files for consistent output
    files_to_process.sort(key=lambda x: str(x[1]))
    
    print(f"Found {len(files_to_process)} files to process")
    print(f"Writing to: {output_file}")
    
    # Write all files to the output
    with open(output_file, 'w', encoding='utf-8') as out:
        # Write header
        out.write("=" * 80 + "\n")
        out.write("FLATTENED CODEBASE\n")
        out.write("=" * 80 + "\n\n")
        
        for file_path, relative_path in files_to_process:
            try:
                # Write file header
                out.write(f"--- START OF FILE: {relative_path} ---\n")
                
                # Read and write file contents
                content = read_file_safe(file_path)
                out.write(content)
                
                # Ensure content ends with newline
                if content and not content.endswith('\n'):
                    out.write('\n')
                
                # Write file footer
                out.write(f"--- END OF FILE: {relative_path} ---\n\n")
                
                files_processed += 1
                
                if files_processed % 10 == 0:
                    print(f"  Processed {files_processed} files...")
                
            except Exception as e:
                print(f"  WARNING: Failed to process {relative_path}: {e}")
                files_skipped += 1
    
    print("\n" + "=" * 80)
    print(f"✓ Successfully processed {files_processed} files")
    if files_skipped > 0:
        print(f"⚠ Skipped {files_skipped} files due to errors")
    print(f"✓ Output saved to: {output_file}")
    print("=" * 80)


def main():
    """Main entry point for the script."""
    # Get the current directory as the root
    root_dir = Path.cwd()
    output_file = root_dir / OUTPUT_FILE
    
    print("\n" + "=" * 80)
    print("CODEBASE FLATTENING UTILITY")
    print("=" * 80)
    print(f"Root directory: {root_dir}")
    print(f"Output file: {output_file.name}")
    print()
    
    # Confirm if output file already exists
    if output_file.exists():
        print(f"⚠ Warning: {OUTPUT_FILE} already exists and will be overwritten.")
        response = input("Continue? (y/n): ").strip().lower()
        if response != 'y':
            print("Cancelled.")
            return
        print()
    
    try:
        flatten_codebase(root_dir, output_file)
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user.")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        raise


if __name__ == "__main__":
    main()
