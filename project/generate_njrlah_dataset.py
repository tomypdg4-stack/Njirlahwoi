#!/usr/bin/env python3
"""
NJIRLAH Benchmark Dataset Generator
Generates ChatML format training data for Architect-Class AI fine-tuning.
"""

import json
import random
from datetime import datetime, timezone

SYSTEM_PROMPT = """You are NJIRLAH, the Omni Framework Architect‑Class AI. You master every programming language ever created, every framework, every library, every protocol, and every technical domain – including cybersecurity, networking, cloud infrastructure, DevOps, IoT, embedded systems, blockchain, quantum computing, game development, scientific computing, and more.

You write production‑ready code with zero placeholders, follow strict domain segregation, use monadic error handling, zero‑copy data transfer, and immutable state by default. You can build and deploy full applications to any platform. You have perfect memory of all code and conversations, and you continuously learn from GitHub, documentation, and the real world.

You can use tools to read/write files, execute commands, search the web, and interact with the environment. When you need to use a tool, output a tool_call without any extra text; after receiving the tool result, provide your final answer."""

DOMAINS = {
    "system_programming": ["Rust", "C", "C++", "Zig", "Go", "Objective-C"],
    "concurrency_networking": ["Go", "Elixir", "Rust-Actix", "Java", "Node.js"],
    "ai_ml_data": ["Python", "Julia", "CUDA", "Mojo", "R"],
    "frontend_mobile": ["TypeScript/React", "Swift/SwiftUI", "Kotlin/Compose", "Dart/Flutter"],
    "backend_business": ["C#", "Ruby", "PHP", "SQL", "GraphQL"],
    "security": ["Rego", "Python", "Go", "HCL"],
    "infrastructure_devops": ["Terraform", "Ansible", "Helm", "Pulumi", "YAML"],
    "databases": ["PostgreSQL", "MongoDB", "Redis", "Neo4j"],
    "blockchain": ["Solidity", "Move", "Rust/Substrate"],
    "quantum": ["Qiskit", "Q#", "Cirq"],
    "testing_verification": ["QuickCheck", "TLA+", "Coq", "Dafny"],
    "game_simulation": ["Unity/C#", "Unreal/C++", "Godot/GDScript"]
}

def get_rust_code():
    return '''use std::fs;
use std::io::{self, Read};

/// Reads a file and returns contents as String
fn read_file(path: &str) -> Result<String, io::Error> {
    let mut file = fs::File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

/// Write binary-safe data to file
fn write_binary(path: &str, data: &[u8]) -> Result<(), io::Error> {
    fs::write(path, data)?;
    Ok(())
}'''


def get_python_code():
    return '''import os
from pathlib import Path
from typing import Optional, List

def read_file_safe(path: str) -> Optional[str]:
    """Safely read file with error handling"""
    try:
        return Path(path).read_text(encoding="utf-8")
    except (FileNotFoundError, IOError):
        return None

def find_files(pattern: str, base_dir: str = ".") -> List[str]:
    """Find files matching pattern recursively"""
    return [str(p) for p in Path(base_dir).rglob(pattern)]

async def process_batch(items: list, processor) -> list:
    """Process items in batches asynchronously"""
    results = []
    async for item in items:
        results.append(await processor(item))
    return results'''


def get_go_code():
    return '''package main

import (
    "context"
    "time"
)

type RetryConfig struct {
    MaxRetries   int
    BaseDelay    time.Duration
    MaxDelay     time.Duration
    BackoffMulti float64
}

func WithRetry(ctx context.Context, fn func() error, config RetryConfig) error {
    var lastErr error
    
    for i := 0; i < config.MaxRetries; i++ {
        err := fn()
        if err == nil {
            return nil
        }
        lastErr = err
        
        delay := config.BaseDelay * time.Duration(config.BackoffMulti)
        time.Sleep(delay)
        
        if delay > config.MaxDelay {
            delay = config.MaxDelay
        }
    }
    
    return lastErr
}'''


def get_solidity_code():
    return '''// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AccessControlled {
    mapping(address => bool) private _admins;
    address public owner;
    
    constructor() {
        owner = msg.sender;
        _admins[msg.sender] = true;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyAdmin() {
        require(_admins[msg.sender], "Not admin");
        _;
    }
    
    function isAdmin(address account) public view returns (bool) {
        return _admins[account];
    }
    
    function addAdmin(address admin) external onlyOwner {
        _admins[admin] = true;
    }
    
    function removeAdmin(address admin) external onlyOwner {
        _admins[admin] = false;
    }
}'''


def get_typescript_code():
    return '''interface CacheEntry<T> {
    value: T;
    expiresAt: number;
}

class TTLCache<K, V> {
    private cache: Map<K, CacheEntry<V>>;
    private defaultTTL: number;

    constructor(defaultTTL: number = 3600000) {
        this.cache = new Map();
        this.defaultTTL = defaultTTL;
    }

    set(key: K, value: V, ttl?: number): void {
        const expiresAt = Date.now() + (ttl ?? this.defaultTTL);
        this.cache.set(key, { value, expiresAt });
    }

    get(key: K): V | undefined {
        const entry = this.cache.get(key);
        if (!entry || Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return undefined;
        }
        return entry.value;
    }

    clear(): void {
        this.cache.clear();
    }

    size(): number {
        return this.cache.size;
    }
}'''


def get_terraform_code():
    return '''variable "region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

resource "aws_vpc" "main" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.project_name}-vpc"
    Environment = var.environment
  }
}

resource "aws_security_group" "allow_https" {
  name        = "allow_https_traffic"
  description = "Allow HTTPS inbound traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}'''


def get_kubernetes_code():
    return '''apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
  labels:
    app: api-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-service
  template:
    metadata:
      labels:
        app: api-service
    spec:
      containers:
      - name: api
        image: myregistry/api-service:latest
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api-service
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer'''


def get_dockerfile_code():
    return '''FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]'''


def get_sqlite_code():
    return '''CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);'''


def get_kafka_producer_code():
    return '''from kafka import KafkaProducer
from kafka.errors import KafkaTimeoutError
import json
import logging

logger = logging.getLogger(__name__)

class ReliableKafkaProducer:
    def __init__(self, bootstrap_servers, topic, max_retries=3):
        self.producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
            acks="all",
            retries=max_retries,
            request_timeout_ms=30000
        )
        self.topic = topic
        
    def send(self, key, value, headers=None):
        future = self.producer.send(
            self.topic,
            key=key.encode() if key else None,
            value=value,
            headers=headers or []
        )
        return future.get(timeout=30)
    
    def flush(self):
        self.producer.flush()
    
    def close(self):
        self.producer.close(timeout=10)'''


def get_redis_code():
    return '''import redis
from redis.exceptions import ConnectionError, TimeoutError
import asyncio

class RedisPool:
    def __init__(self, host="localhost", port=6379, db=0, max_connections=50):
        self.pool = redis.ConnectionPool(
            host=host,
            port=port,
            db=db,
            max_connections=max_connections,
            retry_on_timeout=True
        )
    
    def get_client(self):
        return redis.Redis(connection_pool=self.pool)
    
    async def async_get(self, key: str):
        try:
            async with self.pool.get_connection() as conn:
                return await conn.execute_command("GET", key)
        except (ConnectionError, TimeoutError):
            return None
    
    def pipeline_atomic(self, keys: list):
        pipe = self.get_client().pipeline(transaction=True)
        for key in keys:
            pipe.get(key)
        return pipe'''


def get_qsharp_code():
    return '''namespace QuantumAlgorithms {
    open Microsoft.Quantum.Intrinsic;
    open Microsoft.Quantum.Canon;
    open Microsoft.Quantum.Arithmetic;

    operation PrepareSuperposition(qubits : Qubit[]) : Unit {
        foreach (qubit in qubits) {
            H(qubit);
        }
        return ();
    }

    operation CreateBellPair(first : Qubit, second : Qubit) : Unit {
        H(first);
        CNOT(first, second);
        return ();
    }
}'''


def get_tla_code():
    return '''MODULE Example
EXTENDS Integers, Sequences

VARIABLE state, counter

Init == 
    /\ state = 0
    /\ counter = 0

Next == 
    IF counter < 100
    THEN /\ counter' = counter + 1
         /\ state' = state
    ELSE TRUE

Invariant == counter <= 100

Spec == Init /\ [][Next]_<<state, counter>>'''


def get_qiskit_code():
    return '''from qiskit import QuantumCircuit, transpile

def create_superposition(num_qubits):
    qc = QuantumCircuit(num_qubits)
    for i in range(num_qubits):
        qc.h(i)
    return qc

def create_entanglement_pair():
    qc = QuantumCircuit(2)
    qc.h(0)
    qc.cx(0, 1)
    return qc

if __name__ == "__main__":
    circuit = create_superposition(3)
    print(circuit.draw())'''


def get_unity_csharp_code():
    return '''using UnityEngine;
using System.Collections;

public class PlayerController : MonoBehaviour {
    public float moveSpeed = 5f;
    public float jumpForce = 10f;
    
    private Rigidbody rb;
    private bool isGrounded;
    
    void Start() {
        rb = GetComponent<Rigidbody>();
        CheckGroundStatus();
    }
    
    void Update() {
        HandleInput();
        CheckGroundStatus();
    }
    
    void HandleInput() {
        float vertical = Input.GetAxis("Vertical");
        float horizontal = Input.GetAxis("Horizontal");
        
        Vector3 moveDirection = transform.forward * vertical + 
                               transform.right * horizontal;
        
        rb.velocity = new Vector3(moveDirection.x, rb.velocity.y, moveDirection.z) * moveSpeed;
        
        if (Input.GetButtonDown("Jump") && isGrounded) {
            Jump();
        }
    }
    
    void Jump() {
        rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
        isGrounded = false;
    }
    
    void CheckGroundStatus() {
        Ray ray = new Ray(transform.position, Vector3.down);
        isGrounded = Physics.Raycast(ray, 0.1f);
    }
}'''


def get_godot_gdscript_code():
    return '''extends CharacterBody2D

const SPEED = 300.0
const JUMP_VELOCITY = -400.0

@export var gravity = 980.0

func _physics_process(delta):
    if not is_on_floor():
        velocity.y -= gravity * delta
    
    var input_direction = Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")
    velocity.x = lerp(velocity.x, input_direction.x * SPEED, 0.1)
    
    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = JUMP_VELOCITY
    
    move_and_slide()

func _on_area_2d_body_entered(body):
    if body.has_method("take_damage"):
        body.take_damage(10)'''


CODE_TEMPLATES = {
    "Rust": get_rust_code(),
    "Python": get_python_code(),
    "Go": get_go_code(),
    "Solidity": get_solidity_code(),
    "TypeScript/React": get_typescript_code(),
    "Terraform": get_terraform_code(),
    "Kubernetes": get_kubernetes_code(),
    "Docker/Dockerfile": get_dockerfile_code(),
    "SQLite": get_sqlite_code(),
    "Kafka": get_kafka_producer_code(),
    "Redis": get_redis_code(),
    "Q#": get_qsharp_code(),
    "TLA+": get_tla_code(),
    "Qiskit": get_qiskit_code(),
    "Unity/C#": get_unity_csharp_code(),
    "Godot/GDScript": get_godot_gdscript_code()
}

SKILLS = ["code_generation", "debugging", "architecture_design", "configuration", 
          "deployment", "tool_calling", "deep_thinking"]

DIFFICULTIES = ["basic", "intermediate", "advanced", "expert"]


def difficulty_modifier(difficulty):
    modifiers = {
        "basic": "Write",
        "intermediate": "Build a robust",
        "advanced": "Design a scalable",
        "expert": "Architect an enterprise-grade"
    }
    return modifiers.get(difficulty, "Write")


def generate_tool_call_example(example_id):
    tool_id = f"call_{example_id:03d}"
    return {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": "Read the contents of `/etc/app/config.toml` and extract database settings."},
            {
                "role": "assistant",
                "content": None,
                "tool_calls": [{
                    "id": tool_id,
                    "type": "function",
                    "function": {
                        "name": "read_file",
                        "arguments": json.dumps({"path": "/etc/app/config.toml"})
                    }
                }]
            },
            {"role": "tool", "tool_call_id": tool_id, "content": "[database]\nhost = \"prod-db.internal\"\nport = 5432\nssl_mode = \"verify-full\""},
            {"role": "assistant", "content": "Database connection configuration:\n- Host: prod-db.internal\n- Port: 5432\n- SSL Mode: verify-full"}
        ]
    }


def generate_deep_thinking_example(difficulty):
    scale_map = {"basic": "~100", "intermediate": "~10K", "advanced": "~100K", "expert": ">1M"}
    scale = scale_map.get(difficulty, "~100")
    
    return {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": "Analyze tradeoffs between microservices vs monolith for a high-scale system requiring {} req/sec.".format(scale)},
            {"role": "assistant", "content": "## Architecture Tradeoff Analysis\n\n### Microservices Approach\n**Pros:**\n- Independent scaling per service\n- Technology diversity allowed\n- Fault isolation\n\n**Cons:**\n- Network latency overhead\n- Complex deployment orchestration\n- Data consistency challenges\n\n### Monolith Approach\n**Pros:**\n- Simple deployment model\n- Strong consistency guarantees\n- Lower operational overhead\n\n**Cons:**\n- Scaling requires full redeployment\n- Technology lock-in\n- Single point of failure risk\n\n### Recommendation\nFor systems requiring >{} req/sec with diverse team structure -> Microservices\nFor startup/MVP phase with single tech stack -> Monolith\n\nImplement event-driven architecture with eventual consistency patterns regardless of choice.".format(scale)}
        ]
    }


def generate_code_example(language, skill, difficulty):
    modifier = difficulty_modifier(difficulty)
    
    if skill == "code_generation":
        lang_lower = language.lower().replace("/", "")
        code_func = CODE_TEMPLATES.get(lang_lower) or CODE_TEMPLATES.get(language) or CODE_TEMPLATES.get("Python")
        code = code_func or "# Code for " + language
        response = modifier + " solution in " + language + ":\n\n```" + language.lower() + "\n" + code + "\n```\n\n**Key features:**\n- Proper error handling throughout\n- Type safety enforced\n- Production-ready implementation"
    elif skill == "debugging":
        response = """Found the bug and here's the fix:

Issue: Missing null check on optional parameter
Fix: Added defensive programming with default values

```python
def safe_divide(a, b=None):
    if b is None:
        b = 1
    return a / b
```"""
    elif skill == "architecture_design":
        response = """### System Architecture Design

```
Client --> API Gateway --> Services
                             |
                         Database
```

Technology choices justified:
1. API Gateway for authentication/rate limiting
2. Horizontal scaling via load balancer
3. Connection pooling at DB layer"""
    elif skill == "configuration":
        lang_lower = language.lower()
        ext_map = {"terraform": "tf", "yaml": "yml", "dockerfile": "dockerfile"}
        ext = ext_map.get(lang_lower, "txt")
        lang_key = lang_lower.replace("/", "")
        code_func = CODE_TEMPLATES.get(lang_key) or CODE_TEMPLATES.get(language)
        code = code_func or "# Configuration"
        response = "Configuration file for " + language + ":\n\n```" + ext + "\n" + code + "\n```"
    elif skill == "deployment":
        response = """### Deployment Pipeline

```bash
#!/bin/bash
set -e

echo "Building..."
npm run build

echo "Testing..."
npm test

echo "Deploying to production..."
kubectl apply -f k8s/deployment.yaml
kubectl rollout status deployment/api-service

echo "Verification check..."
curl -f https://api.example.com/health
```"""
    else:
        lang_lower = language.lower().replace("/", "")
        code_func = CODE_TEMPLATES.get(lang_lower) or CODE_TEMPLATES.get(language) or "# Implementation"
        code = code_func
        response = "Solution implemented:\n\n```" + language.lower() + "\n" + code + "\n```"
    
    return {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": modifier + " feature in " + language},
            {"role": "assistant", "content": response}
        ]
    }


def generate_dataset(num_examples=1000):
    examples = []
    domains_list = list(DOMAINS.keys())
    languages_by_domain = {d: DOMAINS[d] for d in domains_list}
    
    for i in range(num_examples):
        # Balanced rotation through domains
        domain_idx = i % len(domains_list)
        domain_key = domains_list[domain_idx]
        language = random.choice(languages_by_domain[domain_key])
        
        # Rotate through skills
        skill_idx = i % len(SKILLS)
        skill = SKILLS[skill_idx]
        
        # Weighted difficulty selection
        diff_weights = [0.2, 0.3, 0.3, 0.2]
        difficulty = random.choices(DIFFICULTIES, weights=diff_weights)[0]
        
        # Generate appropriate example
        if skill == "tool_calling":
            example = generate_tool_call_example(i + 1)
        elif skill == "deep_thinking":
            example = generate_deep_thinking_example(difficulty)
        else:
            example = generate_code_example(language, skill, difficulty)
        
        # Add metadata
        example["_metadata"] = {
            "example_id": i + 1,
            "domain": domain_key,
            "language": language,
            "skill_type": skill,
            "difficulty": difficulty,
            "generated_at": datetime.now(timezone.utc).isoformat()
        }
        
        examples.append(example)
    
    return examples


def save_to_jsonl(examples, output_path):
    with open(output_path, 'w', encoding='utf-8') as f:
        for example in examples:
            messages_only = {"messages": example["messages"]}
            f.write(json.dumps(messages_only, ensure_ascii=False) + '\n')


if __name__ == "__main__":
    print("Generating NJIRLAH Benchmark Dataset...")
    print("-" * 50)
    
    examples = generate_dataset(1000)
    
    print("Generated {} examples".format(len(examples)))
    print("\nDistribution:")
    
    from collections import Counter
    domains = Counter(e["_metadata"]["domain"] for e in examples)
    skills = Counter(e["_metadata"]["skill_type"] for e in examples)
    difficulties = Counter(e["_metadata"]["difficulty"] for e in examples)
    
    print("\nBy Domain:")
    for domain, count in sorted(domains.items()):
        print("  {}: {}".format(domain, count))
    
    print("\nBy Skill Type:")
    for skill, count in sorted(skills.items()):
        print("  {}: {}".format(skill, count))
    
    print("\nBy Difficulty:")
    for diff, count in sorted(difficulties.items()):
        print("  {}: {}".format(diff, count))
    
    save_to_jsonl(examples, "njrlah_benchmark_dataset.jsonl")
    print("\nSaved to njrlah_benchmark_dataset.jsonl")
    print("-" * 50)
