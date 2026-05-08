import json
import os
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="fc-a0b1abc010704eec9e8a73e8d274b402")

os.makedirs(".firecrawl", exist_ok=True)

# ── Key pages to scrape from OpenRouter ──
PAGES = [
    "https://openrouter.ai",
    "https://openrouter.ai/models",
    "https://openrouter.ai/docs/quickstart",
    "https://openrouter.ai/docs/api-reference",
    "https://openrouter.ai/docs/frameworks",
    "https://openrouter.ai/docs/features",
    "https://openrouter.ai/rankings",
    "https://openrouter.ai/docs/use-cases",
]

for url in PAGES:
    slug = url.replace("https://openrouter.ai", "").replace("/", "_") or "_home"
    filename = f".firecrawl/openrouter{slug}.json"
    
    if os.path.exists(filename):
        print(f"[SKIP] {filename} already exists")
        continue
    
    print(f"[SCRAPING] {url} ...")
    try:
        result = app.scrape(url, formats=["markdown", "links", "html"])
        data = result.model_dump() if hasattr(result, "model_dump") else result
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)
        print(f"  -> Saved to {filename}")
    except Exception as e:
        print(f"  -> ERROR: {e}")

# ── Also map the site to find all subpages ──
print("\n[MAPPING] Finding all OpenRouter subpages...")
try:
    map_result = app.map("https://openrouter.ai", params={"limit": 100})
    data = map_result.model_dump() if hasattr(map_result, "model_dump") else map_result
    with open(".firecrawl/openrouter_sitemap.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, default=str)
    print(f"  -> Sitemap saved")
except Exception as e:
    print(f"  -> MAP ERROR: {e}")

print("\n[DONE] All OpenRouter pages scraped!")
