import os
import json
from firecrawl import FirecrawlApp
from firecrawl.v2.types import ScrapeOptions

def run_scraper():
    app = FirecrawlApp(api_key="fc-a0b1abc010704eec9e8a73e8d274b402")
    
    print("Crawling https://openrouter.ai/models...")
    
    # We will just scrape a few key pages for images since crawling 200 pages takes too long.
    result = app.scrape(
        "https://openrouter.ai/models", 
        formats=["html", "markdown", "links"],
    )
    
    with open("openrouter_scrape.json", "w", encoding="utf-8") as f:
        # Convert response to dict if it's a Pydantic model
        if hasattr(result, "model_dump"):
            json.dump(result.model_dump(), f, indent=2)
        elif hasattr(result, "dict"):
            json.dump(result.dict(), f, indent=2)
        else:
            json.dump(result, f, indent=2)
        
    print("Scrape completed! Saved to openrouter_scrape.json")

if __name__ == "__main__":
    run_scraper()
