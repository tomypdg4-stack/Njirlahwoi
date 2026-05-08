# NJIRLAH Benchmark Dataset

High-quality ChatML-format training dataset for fine-tuning Architect-Class AI systems like NJIRLAH.

## Overview

This dataset contains **1,000 carefully constructed examples** designed to train AI models to master:

- Every programming language and framework
- All IT technical domains
- Production-ready code generation
- Tool calling and automation
- Deep architectural reasoning

## Dataset Statistics

MetricValueTotal Examples1,000File Size\~1.6 MBFormatJSONL (ChatML)Languages Covered50+ across 12 domain categories

### Domain Distribution

```
system_programming        84  (8.4%)
concurrency_networking    84  (8.4%)
ai_ml_data                84  (8.4%)
frontend_mobile           84  (8.4%)
backend_business          83  (8.3%)
security                  83  (8.3%)
infrastructure_devops     83  (8.3%)
databases                 83  (8.3%)
blockchain                83  (8.3%)
quantum                   83  (8.3%)
testing_verification      83  (8.3%)
game_simulation           83  (8.3%)
```

### Skill Type Distribution

```
code_generation          143  (14.3%)
debugging                143  (14.3%)
architecture_design      143  (14.3%)
configuration            143  (14.3%)
deployment               143  (14.3%)
tool_calling             143  (14.3%)
deep_thinking            142  (14.2%)
```

### Difficulty Level Distribution

```
intermediate   308  (30.8%)
advanced       284  (28.4%)
basic          204  (20.4%)
expert         204  (20.4%)
```

## File Format

Each line is a valid JSON object in **ChatML format**:

```json
{
  "messages": [
    {"role": "system", "content": "You are NJIRLAH..."},
    {"role": "user", "content": "<instruction>"},
    {"role": "assistant", "content": "<response>"}
  ]
}
```

### Tool Calling Examples

Some examples demonstrate tool usage with special message structure:

```json
{
  "messages": [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "..."},
    {
      "role": "assistant",
      "content": null,
      "tool_calls": [{"id": "call_001", "type": "function", "function": {"name": "read_file", "arguments": "{\"path\":\"/etc/config\"}"}}]
    },
    {"role": "tool", "tool_call_id": "call_001", "content": "file contents here"},
    {"role": "assistant", "content": "final answer"}
  ]
}
```

## Supported Domains

### System Programming

Rust, C, C++, Zig, Go, Objective-C

### Concurrency & Networking

Go, Elixir, Rust-Actix, Java, Node.js

### AI/ML/Data Science

Python, Julia, CUDA, Mojo, R, TensorFlow, PyTorch

### Frontend & Mobile

TypeScript/React, Swift/SwiftUI, Kotlin/Compose, Dart/Flutter

### Backend & Business

C#, Ruby, PHP, SQL, GraphQL

### Security

Rego (OPA), Python, Go, HCL

### Infrastructure & DevOps

Terraform, Ansible, Helm, Pulumi, YAML, Docker, Kubernetes

### Databases

PostgreSQL, MongoDB, Redis, Neo4j, SQLite

### Blockchain

Solidity, Move, Rust/Substrate

### Quantum Computing

Qiskit, Q#, Cirq

### Testing & Verification

QuickCheck, TLA+, Coq, Dafny

### Game Development

Unity/C#, Unreal/C++, Godot/GDScript

## Example Samples

### Code Generation

```
User: Write robust solution in Rust
Assistant: Here's production-ready Rust code with proper error handling...
```

### Debugging

```
User: Build robust feature in Python  
Assistant: Found the bug! Added defensive programming pattern...
```

### Architecture Design

```
User: Design scalable system for microservices architecture
Assistant: 
### System Architecture Design
Client --> API Gateway --> Services
                             |
                         Database
```

### Tool Calling

```
User: Read config.toml and extract database settings
Assistant: [calls read_file tool]
Tool: Returns TOML content
Assistant: Based on configuration, connection uses host prod-db.internal...
```

### Deep Thinking

```
User: Analyze tradeoffs between microservices vs monolith
Assistant: ## Architecture Tradeoff Analysis
Microservices Approach: Pros/Cons
Monolith Approach: Pros/Cons
Recommendation based on scale...
```

## Usage Guidelines

### Training Data Preparation

1. Parse JSONL file line by line
2. Extract `messages` array from each record
3. Feed to model training pipeline in ChatML format
4. Apply appropriate loss masking for conversation turns

### Validation

```python
import json
from pathlib import Path

def validate_dataset(path):
    errors = []
    with open(path) as f:
        for i, line in enumerate(f, 1):
            try:
                record = json.loads(line.strip())
                assert "messages" in record
                assert len(record["messages"]) >= 2
                assert record["messages"][-1]["role"] == "assistant"
            except Exception as e:
                errors.append((i, str(e)))
    
    if errors:
        print(f"Found {len(errors)} validation errors:")
        for idx, err in errors[:10]:
            print(f"  Line {idx}: {err}")
    else:
        print("Dataset validated successfully!")
```

### Fine-tuning Configuration

```yaml
model_name: njrlah-v1
learning_rate: 2e-5
batch_size: 32
epochs: 3
warmup_ratio: 0.1
max_seq_length: 4096
loss_type: cross_entropy
```

## Generation Script

The dataset was generated using `generate_njrlah_dataset.py`:

```bash
# Generate fresh dataset
python generate_njrlah_dataset.py

# Custom size
python generate_njrlah_dataset.py --num-examples 2000
```

## License & Terms

This dataset is provided for research and evaluation purposes. When using:

1. Acknowledge source appropriately
2. Do not redistribute without permission
3. Verify outputs before production use
4. Report any issues to maintainers

## Contributing

To contribute examples:

1. Ensure production-ready, compilable code
2. Cover underrepresented domains/languages
3. Include metadata with domain, skill, difficulty tags
4. Follow ChatML format strictly

## Future Roadmap

- \[ \] Expand to 10,000+ examples
- \[ \] Add more blockchain/cryptocurrency examples
- \[ \] Include reinforcement learning scenarios
- \[ \] Add multi-turn conversation examples
- \[ \] Create specialized subsets per domain
- \[ \] Generate synthetic edge cases

## Contact

For questions or contributions, please reach out to the NJIRLAH development team.

---

**Generated:** 2024-05-08\
**Version:** 1.0.0\
**Total Examples:** 1,000