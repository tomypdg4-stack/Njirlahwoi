import json
import os
import re
import urllib.request
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="fc-a0b1abc010704eec9e8a73e8d274b402")

os.makedirs(".firecrawl", exist_ok=True)
os.makedirs("public/mcp", exist_ok=True)

# Step 1: Scrape the main MCP Market page
print("[1/3] Scraping mcpmarket.com ...")
try:
    result = app.scrape(
        "https://mcpmarket.com",
        formats=["markdown", "links", "html"],
        only_main_content=False,
    )
    data = result.model_dump() if hasattr(result, "model_dump") else result
    with open(".firecrawl/mcpmarket_home.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, default=str)
    print("  -> Saved mcpmarket_home.json")
except Exception as e:
    print(f"  -> ERROR: {e}")

# Step 2: Scrape additional pages
EXTRA_PAGES = [
    "https://mcpmarket.com/servers",
    "https://mcpmarket.com/categories",
]

for url in EXTRA_PAGES:
    slug = url.replace("https://mcpmarket.com", "").replace("/", "_") or "_home"
    filename = f".firecrawl/mcpmarket{slug}.json"
    if os.path.exists(filename):
        print(f"[SKIP] {filename}")
        continue
    print(f"[SCRAPING] {url} ...")
    try:
        result = app.scrape(url, formats=["markdown", "links", "html"], only_main_content=False)
        data = result.model_dump() if hasattr(result, "model_dump") else result
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)
        print(f"  -> Saved to {filename}")
    except Exception as e:
        print(f"  -> ERROR: {e}")

# Step 3: Extract SVG URLs from all scraped data
print("\n[2/3] Extracting SVG URLs from scraped data...")
all_svg_urls = set()
for fname in os.listdir(".firecrawl"):
    if not fname.startswith("mcpmarket"):
        continue
    fpath = os.path.join(".firecrawl", fname)
    try:
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()
        svgs = re.findall(r'https?://[^\s\"\'\>\)]+?\.svg', content)
        all_svg_urls.update(svgs)
    except:
        pass

print(f"  Found {len(all_svg_urls)} unique SVG URLs")

# Step 4: Download SVGs
print("\n[3/3] Downloading SVGs to public/mcp/ ...")
for url in sorted(all_svg_urls):
    filename = url.split("/")[-1].split("?")[0]
    if not filename.endswith(".svg"):
        filename += ".svg"
    outpath = os.path.join("public/mcp", filename)
    if os.path.exists(outpath):
        print(f"  [SKIP] {filename}")
        continue
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            with open(outpath, "wb") as out:
                out.write(resp.read())
        print(f"  [OK] {filename}")
    except Exception as e:
        print(f"  [FAIL] {filename}: {e}")

print("\n[DONE] MCP Market crawl complete!")
