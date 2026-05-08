#!/usr/bin/env python3
"""
NJIRLAH Dataset Auto-Cleaner
Filter/Flag language mismatch between user prompt & assistant response.
Usage: python auto_clean_dataset.py [--mode filter|flag]
"""
import json
import re
import sys
import argparse
from pathlib import Path

# Signature pola kode per bahasa (heuristic, akurat untuk 95% kasus)
LANG_SIGS = {
    "c": [r"#include\s*<", r"int\s+main\s*\(", r"printf\s*\(", r"malloc\s*\(", r"free\s*\("],
    "cpp": [r"#include\s*<", r"std::", r"cout\s*<<", r"vector\s*<", r"class\s+\w+\s*\{"],
    "python": [r"^(import|from)\s", r"def\s+\w+\s*\(", r"print\s*\(", r"class\s+\w+\s*:"],
    "javascript": [r"const\s+\w+\s*=", r"function\s+\w+\s*\(", r"console\.log\s*\(", r"module\.exports"],
    "typescript": [r"interface\s+\w+", r"type\s+\w+\s*=", r"as\s+\w+", r"<\w+>", r"readonly\s"],
    "nodejs": [r"require\s*\(", r"async\s+function", r"express\s*\(", r"process\.", r"__dirname"],
    "r": [r"library\s*\(", r"data\.frame\s*\(", r"<-\s*", r"ggplot\s*\(", r"dplyr"],
    "go": [r"package\s+main", r"fmt\.", r"go\s+mod", r"func\s+\w+\s*\(", r"defer\s"],
    "java": [r"public\s+class\s+\w+", r"System\.out\.println", r"public\s+static\s+void\s+main"],
    "rust": [r"fn\s+\w+\s*\(", r"let\s+mut\s+", r"println!\s*\(", r"use\s+std::", r"->\s*\w+"],
}

def detect_lang_in_assistant(text):
    # 1. Cek code block markdown
    code_blocks = re.findall(r"```(\w*)\n([\s\S]*?)```", text)
    candidates = []
    for lang_hint, code in code_blocks:
        if lang_hint.lower() in LANG_SIGS:
            candidates.append(lang_hint.lower())
        for lang, patterns in LANG_SIGS.items():
            if any(re.search(p, code, re.MULTILINE) for p in patterns):
                candidates.append(lang)
    
    if candidates:
        return max(set(candidates), key=candidates.count)  # Ambil yang paling sering muncul
    
    # 2. Fallback ke seluruh teks
    for lang, patterns in LANG_SIGS.items():
        if any(re.search(p, text, re.MULTILINE) for p in patterns):
            return lang
    return "unknown"

def extract_requested_lang(user_content):
    text = user_content.lower()
    patterns = [
        r"in\s+(c\+\+|c|python|javascript|typescript|node\.js|r|go|java|rust|swift|kotlin|php|ruby)",
        r"using\s+(c\+\+|c|python|javascript|typescript|node\.js|r|go|java|rust)",
        r"(c\+\+|c|python|javascript|typescript|node\.js|r|go|java|rust)\s+(code|script|feature|function|module)"
    ]
    for p in patterns:
        m = re.search(p, text)
        if m:
            lang = m.group(1).strip().lower()
            return "nodejs" if lang == "node.js" else ("cpp" if lang == "c++" else lang)
    return None

def main():
    parser = argparse.ArgumentParser(description="Auto-clean NJIRLAH dataset")
    parser.add_argument("--input", default="njirlah_combined_dataset.jsonl")
    parser.add_argument("--output", default="njirlah_cleaned.jsonl")
    parser.add_argument("--flagged", default="njirlah_flagged.jsonl")
    parser.add_argument("--mode", choices=["filter", "flag"], default="filter",
                        help="filter: hapus mismatch | flag: simpan & tandai")
    args = parser.parse_args()

    if not Path(args.input).exists():
        print(f"❌ File '{args.input}' tidak ditemukan.")
        sys.exit(1)

    kept, flagged, dropped = 0, 0, 0
    fout = open(args.output, "w", encoding="utf-8")
    fflag = open(args.flagged, "w", encoding="utf-8") if args.mode == "flag" else None

    print("🔍 Memindai dataset...")
    with open(args.input, "r", encoding="utf-8") as fin:
        for i, line in enumerate(fin, 1):
            line = line.strip()
            if not line: continue
            
            try:
                data = json.loads(line)
                msgs = data.get("messages", [])
                user_text = next((m["content"] for m in msgs if m["role"] == "user"), "")
                assist_text = next((m["content"] for m in msgs if m["role"] == "assistant"), "")

                req_lang = extract_requested_lang(user_text)
                det_lang = detect_lang_in_assistant(assist_text)

                is_mismatch = req_lang and req_lang != det_lang and det_lang != "unknown"

                if is_mismatch:
                    if args.mode == "filter":
                        dropped += 1
                        continue
                    else:
                        data["_audit_flag"] = f"MISMATCH:req={req_lang}|det={det_lang}"
                        flagged += 1
                        if fflag: fflag.write(json.dumps(data, ensure_ascii=False) + "\n")
                
                kept += 1
                fout.write(json.dumps(data, ensure_ascii=False) + "\n")
                
            except Exception as e:
                print(f"⚠️ Baris {i} error: {e}")
                dropped += 1

    fout.close()
    if fflag: fflag.close()

    print(f"\n📊 LAPORAN PEMBERSIHAN:")
    print(f"   📥 Total diproses : {kept + flagged + dropped}")
    print(f"   ✅ Bersih & disimpan: {kept}")
    if args.mode == "flag":
        print(f"   🏷️  Ditandai (review): {flagged} → {args.flagged}")
    else:
        print(f"   🗑️  Dibuang (mismatch): {dropped}")
    print(f"    Output siap upload: {args.output}")
    print(f"💡 Rekomendasi: Gunakan mode --filter untuk training. Dataset bersih > dataset besar.")

if __name__ == "__main__":
    main()
