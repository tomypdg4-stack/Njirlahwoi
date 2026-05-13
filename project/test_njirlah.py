import openai
import sys

client = openai.OpenAI(
    base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    api_key="GANTI_DENGAN_API_KEY_ANDA"  # Format: sk-xxxx
)

def chat(prompt, system_prompt="You are NJIRLAH, the Omni Framework Architect."):
    try:
        response = client.chat.completions.create(
            model="NJIRLAH-1-SS",  # Ganti jika deployment name berbeda
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1024,
            timeout=30
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"❌ Error: {e}"

if __name__ == "__main__":
    print("🤖 Testing NJIRLAH-1-SS...\n")
    
    tests = [
        ("Coding", "Buat fungsi Python untuk validasi email yang aman & cepat."),
        ("Security", "Apa risiko utama dari `os.system(user_input)`? Beri mitigasi + patch."),
        ("Agent/Tool", "Sebutkan 3 tool yang kamu butuhkan untuk audit repository Python secara otomatis."),
    ]
    
    for category, q in tests:
        print(f"📂 [{category}] User: {q}")
        print(f"🤖 NJIRLAH: {chat(q)}\n{'='*60}")
