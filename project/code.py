import json
import random
import itertools
from pathlib import Path

SYSTEM_PROMPT = """You are NJIRLAH, the Omni Framework Architect‑Class AI. You master every programming language ever created, every framework, every library, every protocol, and every technical domain – including cybersecurity, networking, cloud infrastructure, DevOps, IoT, embedded systems, blockchain, quantum computing, game development, scientific computing, and more.

You write production‑ready code with zero placeholders, follow strict domain segregation, use monadic error handling, zero‑copy data transfer, and immutable state by default. You can build and deploy full applications to any platform. You have perfect memory of all code and conversations, and you continuously learn from GitHub, documentation, and the real world.

You can use tools to read/write files, execute commands, search the web, and interact with the environment. When you need to use a tool, output a tool_call without any extra text; after receiving the tool result, provide your final answer."""

DOMAINS = ["System", "Concurrency", "AI/ML", "Frontend", "Backend", "Security", "DevOps", "Database", "Streaming", "Verification", "Game", "Blockchain", "Quantum", "LowCode"]
SKILLS = ["CodeGen", "Debug", "Architecture", "Config", "Publish", "Test", "Deploy", "FileMgmt", "Learn", "Memory", "DeepThink", "BinaryBuild", "ProductionRules", "ToolCall"]
DIFFICULTIES = ["basic", "intermediate", "advanced", "expert"]

TEMPLATES = {
    "CodeGen": "Write a production-ready {lang} {module} that implements {feature} with monadic error handling, zero-copy data transfer, and immutable state.",
    "Debug": "Explain why this {lang} code causes {bug} and provide a fixed version using {pattern}.",
    "Architecture": "Design a scalable {domain} system combining {tech1} and {tech2}. Include zero-copy routing and monadic transaction handling.",
    "ToolCall": "Check if {path} exists, read it, update {field} to {value}, write it back, then run {command}.",
    # Add 10+ more templates per domain/skill combo
}

def generate_dataset(count=10000, output_path="njirlah_benchmark.jsonl"):
    with open(output_path, "w", encoding="utf-8") as f:
        for i in range(count):
            domain = DOMAINS[i % len(DOMAINS)]
            skill = SKILLS[i % len(SKILLS)]
            difficulty = DIFFICULTIES[i % len(DIFFICULTIES)]
            
            # Deterministic prompt generation (replace with LLM or template engine in prod)
            user_prompt = TEMPLATES.get(skill, f"Implement {skill} for {domain} at {difficulty} level.")
            assistant_response = f"[Production-ready {skill} implementation for {domain} at {difficulty} level. Zero-copy, monadic, immutable.]"
            
            entry = {
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                    {"role": "assistant", "content": assistant_response}
                ]
            }
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    print(f"Generated {count} lines → {output_path}")

if __name__ == "__main__":
    generate_dataset()
