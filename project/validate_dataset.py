#!/usr/bin/env python3
"""
Validate NJIRLAH benchmark dataset structure and quality.
"""

import json
import sys
from pathlib import Path


def validate_file(filepath):
    """Validate a JSONL file against ChatML schema."""
    
    errors = []
    warnings = []
    stats = {
        "total_lines": 0,
        "valid_messages": 0,
        "tool_call_examples": 0,
        "domain_count": set(),
        "skill_count": set()
    }
    
    with open(filepath, 'r', encoding='utf-8') as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            
            stats["total_lines"] += 1
            
            try:
                record = json.loads(line)
                
                # Validate messages array exists
                if "messages" not in record:
                    errors.append((line_num, "Missing 'messages' key"))
                    continue
                
                messages = record["messages"]
                
                # Validate non-empty
                if not isinstance(messages, list) or len(messages) == 0:
                    errors.append((line_num, "Empty messages array"))
                    continue
                
                # Check required roles
                roles = [m.get("role") for m in messages]
                if roles[0] != "system":
                    errors.append((line_num, f"First message should be 'system', got '{roles[0]}'"))
                
                # Count tool call examples
                has_tool_calls = any(
                    "tool_calls" in m for m in messages
                )
                has_tool_responses = any(
                    m.get("role") == "tool" for m in messages
                )
                
                if has_tool_calls or has_tool_responses:
                    stats["tool_call_examples"] += 1
                
                # Extract metadata if present
                if "_metadata" in record:
                    meta = record["_metadata"]
                    if "domain" in meta:
                        stats["domain_count"].add(meta["domain"])
                    if "skill_type" in meta:
                        stats["skill_count"].add(meta["skill_type"])
                
                stats["valid_messages"] += 1
                
            except json.JSONDecodeError as e:
                errors.append((line_num, f"Invalid JSON: {e}"))
            except Exception as e:
                errors.append((line_num, f"Error: {e}"))
    
    return errors, warnings, stats


def main():
    filepath = sys.argv[1] if len(sys.argv) > 1 else "njrlah_benchmark_dataset.jsonl"
    path = Path(filepath)
    
    if not path.exists():
        print(f"Error: File not found: {filepath}")
        sys.exit(1)
    
    print("=" * 60)
    print(f"Validating: {filepath}")
    print(f"File size: {path.stat().st_size / 1024 / 1024:.2f} MB")
    print("=" * 60)
    
    errors, warnings, stats = validate_file(str(path))
    
    print("\n--- STATISTICS ---")
    print(f"Total lines: {stats['total_lines']}")
    print(f"Valid records: {stats['valid_messages']}")
    print(f"Tool-call examples: {stats['tool_call_examples']}")
    print(f"Unique domains: {len(stats['domain_count'])}")
    print(f"Unique skills: {len(stats['skill_count'])}")
    
    print("\nDomains:")
    for domain in sorted(stats["domain_count"]):
        print(f"  - {domain}")
    
    print("\nSkills:")
    for skill in sorted(stats["skill_count"]):
        print(f"  - {skill}")
    
    if errors:
        print("\n--- ERRORS ({}) ---".format(len(errors)))
        for line_num, error in errors[:10]:
            print(f"  Line {line_num}: {error}")
        if len(errors) > 10:
            print(f"  ... and {len(errors) - 10} more errors")
    
    if warnings:
        print("\n--- WARNINGS ({}) ---".format(len(warnings)))
        for line_num, warning in warnings[:5]:
            print(f"  Line {line_num}: {warning}")
    
    print("\n--- VALIDATION RESULT ---")
    if errors:
        print("FAILED: Found {} error(s)".format(len(errors)))
        sys.exit(1)
    else:
        print("PASSED: All records valid!")
        sys.exit(0)


if __name__ == "__main__":
    main()
