import os
import json
import re
import urllib.request

def process_svgs():
    with open("openrouter_scrape.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    html = data.get("html", "")
    
    # Create directory for SVGs
    os.makedirs("public/providers", exist_ok=True)
    os.makedirs("public/models", exist_ok=True)
    
    # Extract URLs ending in .svg
    svg_urls = re.findall(r'https://[^\s\"\'\>]+?\.svg', html)
    svg_urls = list(set(svg_urls)) # deduplicate
    
    print(f"Found {len(svg_urls)} SVG URLs.")
    
    for url in svg_urls:
        filename = url.split("/")[-1]
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                content = response.read()
                with open(os.path.join("public/providers", filename), "wb") as img_file:
                    img_file.write(content)
                print(f"Downloaded {filename}")
        except Exception as e:
            print(f"Failed to download {url}: {e}")

if __name__ == "__main__":
    process_svgs()
