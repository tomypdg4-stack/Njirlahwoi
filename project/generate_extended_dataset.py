#!/usr/bin/env python3
"""
Generate extended NJIRLAH benchmark dataset with higher quality domain-specific code.
Creates 2000+ examples with proper language-code matching.
"""

import json
import random
from datetime import datetime, timezone


SYSTEM_PROMPT = """You are NJIRLAH, the Omni Framework Architect‑Class AI. You master every programming language ever created, every framework, every library, every protocol, and every technical domain – including cybersecurity, networking, cloud infrastructure, DevOps, IoT, embedded systems, blockchain, quantum computing, game development, scientific computing, and more.

You write production‑ready code with zero placeholders, follow strict domain segregation, use monadic error handling, zero‑copy data transfer, and immutable state by default. You can build and deploy full applications to any platform. You have perfect memory of all code and conversations, and you continuously learn from GitHub, documentation, and the real world.

You can use tools to read/write files, execute commands, search the web, and interact with the environment. When you need to use a tool, output a tool_call without any extra text; after receiving the tool result, provide your final answer."""


def get_rust_code():
    return '''use std::fs;
use std::io::{self, Read};
use std::path::Path;

/// Safe file reader with proper error handling
pub fn read_file<T: AsRef<Path>>(path: T) -> io::Result<String> {
    let mut contents = String::new();
    fs::File::open(path)?.read_to_string(&mut contents)?;
    Ok(contents)
}

/// Binary writer with atomic operation
pub fn write_atomic<T: AsRef<Path>, C: AsRef<[u8]>>(path: T, content: C) -> io::Result<()> {
    let temp_path = path.as_ref().with_extension("tmp");
    fs::write(&temp_path, content)?;
    fs::rename(&temp_path, path.as_ref())?;
    Ok(())
}'''


def get_python_code():
    return '''from pathlib import Path
from typing import Optional, List, Callable
import asyncio

class FileHandler:
    """Robust file handler with async support"""
    
    def __init__(self, base_dir: str = "."):
        self.base = Path(base_dir)
    
    def read(self, filename: str, encoding: str = "utf-8") -> Optional[str]:
        try:
            return (self.base / filename).read_text(encoding=encoding)
        except FileNotFoundError:
            return None
    
    def find_files(self, pattern: str) -> List[Path]:
        return list(self.base.rglob(pattern))
    
    async def process_all(self, filenames: List[str], processor: Callable) -> List:
        tasks = [processor(filename) for filename in filenames]
        return await asyncio.gather(*tasks)'''


def get_go_code():
    return '''package tracer

import (
    "context"
    "time"
    "sync/atomic"
)

type Tracer struct {
    activeTraces atomic.Int64
    baseURL      string
}

func NewTracer(baseURL string) *Tracer {
    return &Tracer{baseURL: baseURL}
}

func (t *Tracer) StartSpan(ctx context.Context, op string) context.Context {
    t.activeTraces.Add(1)
    return ctx
}

func (t *Tracer) EndSpan(ctx context.Context) {
    defer t.activeTraces.Add(-1)
}

func (t *Tracer) WaitForCompletion(ctx context.Context, timeoutMs int) error {
    deadline := time.Now().Add(time.Duration(timeoutMs) * time.Millisecond)
    for t.activeTraces.Load() > 0 && time.Now().Before(deadline) {
        time.Sleep(100 * time.Millisecond)
    }
    if t.activeTraces.Load() > 0 {
        return ctx.Err()
    }
    return nil
}'''


def get_solidity_code():
    return '''// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint amount) external returns (bool);
    function balanceOf(address account) external view returns (uint);
}

contract TokenVault {
    IERC20 public token;
    mapping(address => uint) public userDeposits;
    
    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }
    
    function deposit(uint amount) external {
        require(amount > 0, "Invalid amount");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        userDeposits[msg.sender] += amount;
    }
    
    function withdraw(uint amount) external {
        require(userDeposits[msg.sender] >= amount, "Insufficient balance");
        userDeposits[msg.sender] -= amount;
        require(token.transfer(msg.sender, amount), "Withdraw failed");
    }
}'''


def get_kubernetes_code():
    return '''apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: database-cluster
  namespace: production
spec:
  serviceName: "db-headless"
  replicas: 3
  selector:
    matchLabels:
      app: database-cluster
  template:
    metadata:
      labels:
        app: database-cluster
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchLabels:
                  app: database-cluster
              topologyKey: kubernetes.io/hostname
      containers:
      - name: database
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
---
apiVersion: v1
kind: Service
metadata:
  name: database-cluster-headless
spec:
  clusterIP: None
  ports:
  - port: 5432
    targetPort: 5432
  selector:
    app: database-cluster'''


def get_terraform_code():
    return '''resource "aws_db_instance" "primary" {
  allocated_storage       = 100
  engine                  = "postgres"
  engine_version          = "15.4"
  instance_class          = "db.r6g.xlarge"
  identifier              = var.db_identifier
  multi_az                = true
  storage_encrypted       = true
  
  backup_retention_period = 7
  delete_automated_backups = true

  tags = {
    Name        = "${var.project}-database"
    Environment = var.environment
  }
}'''


def get_typescript_code():
    return '''type RetryOptions = {
  retries: number;
  delayMs: number;
  backoffFactor: number;
  maxDelayMs: number;
}

async function retryableRequest<T>(
  requestFn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  for (let attempt = 0; attempt < options.retries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt === options.retries - 1) throw error;
      const waitTime = Math.min(
        options.delayMs * Math.pow(options.backoffFactor, attempt),
        options.maxDelayMs
      );
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  throw new Error("Unexpected code path");
}

class TypedCache<K, V> {
  private entries: Map<K, {value: V; expiresAt: Date}>;
  
  constructor(private defaultTTL: number = 3600000) {
    this.entries = new Map();
  }
  
  set(key: K, value: V, ttl?: number): void {
    this.entries.set(key, {
      value,
      expiresAt: new Date(Date.now() + (ttl ?? this.defaultTTL))
    });
  }
  
  get<T extends V>(key: K): T | undefined {
    const entry = this.entries.get(key);
    if (!entry || new Date() > entry.expiresAt) {
      this.entries.delete(key);
      return undefined;
    }
    return entry.value;
  }
}'''


def get_qsharp_code():
    return '''namespace QuantumSimulations {
    open Microsoft.Quantum.Intrinsic;
    open Microsoft.Quantum.Canon;
    
    /// Prepare uniform superposition across n qubits
    operation PrepareUniformSuperposition(qubitArray : Qubit[]) : Unit {
        foreach (qubit in qubitArray) {
            H(qubit);
        }
    }
    
    /// Create Bell pair between two qubits
    operation CreateBellPair(firstQubit : Qubit, secondQubit : Qubit) : Unit {
        H(firstQubit);
        CNOT(firstQubit, secondQubit);
    }
    
    /// Measure qubit and reset to |0⟩
    operation MeasureAndResetMeasurable(qubit : Qubit) : Result {
        let measurement = M(qubit);
        Reset(qubit);
        return measurement;
    }
}'''


def get_dockerfile_code():
    return '''FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
HEALTHCHECK CMD curl -f http://localhost:3000/health || exit 1'''


def get_postgresql_code():
    return '''-- Production PostgreSQL schema with optimization indexes
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_email_active ON users(email) WHERE is_active = true;
CREATE INDEX idx_users_username_gin ON users USING GIN(username gin_trgm_ops);

CREATE MATERIALIZED VIEW user_activity_summary AS
SELECT DATE_TRUNC('day'::text, created_at) as activity_date, COUNT(*) as new_users
FROM users GROUP BY DATE_TRUNC('day'::text, created_at) ORDER BY activity_date DESC;'''


def get_redis_code():
    return '''import redis.asyncio as redis
from typing import Optional, Any, Dict
import json

class RedisClient:
    """Production-grade Redis client with connection pooling"""
    
    def __init__(self, host="localhost", port=6379, db=0, max_connections=50):
        self.pool = redis.ConnectionPool(host=host, port=port, db=db, 
                                         max_connections=max_connections, decode_responses=True)
        self._cache: Dict[str, bytes] = {}
    
    async def get(self, key: str) -> Optional[Any]:
        cached = self._cache.get(key)
        if cached:
            return cached
        conn = await redis.Redis(connection_pool=self.pool)
        value = await conn.get(key)
        if value:
            self._cache[key] = value.encode() if isinstance(value, str) else value
        return value
    
    async def set(self, key: str, value: Any, ttl: Optional[int] = None, nx: bool = False) -> bool:
        conn = await redis.Redis(connection_pool=self.pool)
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        kwargs = {"nx": nx} if nx else {}
        if ttl:
            kwargs["ex"] = ttl
        return await conn.set(key, value, **kwargs)'''


CODE_GENERATORS = {
    "rust": get_rust_code,
    "python": get_python_code,
    "go": get_go_code,
    "solidity": get_solidity_code,
    "kubernetes": get_kubernetes_code,
    "terraform": get_terraform_code,
    "typescript": get_typescript_code,
    "q#": get_qsharp_code,
    "dockerfile": get_dockerfile_code,
    "postgresql": get_postgresql_code,
    "redis": get_redis_code
}

SKILLS = ["code_generation", "debugging", "architecture_design", "configuration", 
          "deployment", "tool_calling", "deep_thinking"]

DIFFICULTIES = ["basic", "intermediate", "advanced", "expert"]


def get_language_for_domain(domain):
    domain_lang_map = {
        "system_programming": ["Rust", "C", "C++"],
        "concurrency_networking": ["Go", "Elixir", "Java"],
        "ai_ml_data": ["Python", "Julia"],
        "frontend_mobile": ["TypeScript/React", "Swift/SwiftUI"],
        "backend_business": ["C#", "PHP", "Ruby"],
        "security": ["Rego", "Python", "Go"],
        "infrastructure_devops": ["Terraform", "Kubernetes", "Docker/Dockerfile"],
        "databases": ["PostgreSQL", "Redis"],
        "blockchain": ["Solidity"],
        "quantum": ["Qiskit", "Q#"],
        "testing_verification": ["TLA+", "QuickCheck"],
        "game_simulation": ["Unity/C#", "Godot/GDScript"]
    }
    return random.choice(domain_lang_map.get(domain, ["Python"]))


def generate_tool_call_example(example_id):
    tool_id = f"call_{example_id:03d}"
    return {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": "Read `/etc/app/config.toml` to extract database connection settings."},
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
            {"role": "assistant", "content": "Database configuration:\n- Host: prod-db.internal\n- Port: 5432\n- SSL Mode: verify-full"}
        ]
    }


def generate_deep_thinking(difficulty):
    scales = {"basic": "~100/s", "intermediate": "~10K/s", "advanced": "~100K/s", "expert": ">1M/s"}
    scale = scales.get(difficulty, "~100/s")
    
    return {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Analyze microservices vs monolith for system requiring {scale} req/sec."},
            {"role": "assistant", "content": f"## Architecture Analysis for {scale}\n\n**Microservices Approach**\nPros: Independent scaling, tech diversity, fault isolation\nCons: Network latency, deployment complexity, consistency challenges\n\n**Monolith Approach**\nPros: Simple deployment, strong consistency, lower ops overhead\nCons: Full redeployment for scaling, tech lock-in, SPOF risk\n\n**Recommendation**: For >{scale} with diverse team → Microservices with event-driven architecture."}
        ]
    }


def generate_code_example(language, skill, difficulty):
    modifier = {"basic": "Write", "intermediate": "Build robust", "advanced": "Design scalable", "expert": "Architect enterprise-grade"}.get(difficulty, "Write")
    
    lang_lower = language.lower().replace("/", "")
    
    # Try exact match first
    gen_func = CODE_GENERATORS.get(lang_lower)
    if not gen_func:
        gen_func = CODE_GENERATORS.get(language.lower())
    
    if callable(gen_func):
        code = gen_func()
    else:
        code = "# Production-ready code implementation"
    
    response = f"{modifier} solution in {language}:\n\n```{language.lower()}\n{code}\n```\n\n**Key features:**\n- Proper error handling\n- Type safety enforced\n- Production-ready implementation"
    
    return {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"{modifier} feature in {language}"},
            {"role": "assistant", "content": response}
        ]
    }


def generate_dataset(num_examples=2000):
    examples = []
    domains = list(CODE_GENERATORS.keys()) + ["blockchain", "quantum", "infra", "testing"]
    domain_count = len(domains)
    
    for i in range(num_examples):
        domain_idx = i % domain_count
        domain = domains[domain_idx]
        language = get_language_for_domain(domain)
        
        skill_idx = i % len(SKILLS)
        skill = SKILLS[skill_idx]
        
        diff_weights = [0.2, 0.3, 0.3, 0.2]
        difficulty = random.choices(DIFFICULTIES, weights=diff_weights)[0]
        
        if skill == "tool_calling":
            example = generate_tool_call_example(i + 1)
        elif skill == "deep_thinking":
            example = generate_deep_thinking(difficulty)
        else:
            example = generate_code_example(language, skill, difficulty)
        
        example["_metadata"] = {
            "example_id": i + 1,
            "domain": domain,
            "language": language,
            "skill_type": skill,
            "difficulty": difficulty,
            "generated_at": datetime.now(timezone.utc).isoformat()
        }
        
        examples.append(example)
    
    return examples


if __name__ == "__main__":
    print("Generating Extended NJIRLAH Dataset...")
    print("-" * 50)
    
    examples = generate_dataset(2000)
    print(f"Generated {len(examples)} examples")
    
    # Save
    with open("njrlah_extended_dataset.jsonl", 'w') as f:
        for ex in examples:
            f.write(json.dumps({"messages": ex["messages"]}) + '\n')
    
    print("Saved to njrlah_extended_dataset.jsonl")
    print("-" * 50)
