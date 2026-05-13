import fetch from 'node-fetch';

const url = 'https://api.firecrawl.dev/v2/crawl';
const options = {
  method: 'POST',
  headers: {
    Authorization: 'Bearer fc-a0b1abc010704eec9e8a73e8d274b402',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "url": "https://mcpservers.org/",
    "sitemap": "include",
    "crawlEntireDomain": true,
    "limit": 200,
    "prompt": "GET ALL PAGE AND BLOG",
    "scrapeOptions": {
        "onlyMainContent": false,
        "maxAge": 172800000,
        "proxy": "stealth",
        "parsers": [
            "pdf"
        ],
        "formats": [
            "markdown",
            "summary",
            "links",
            "html",
            {
                "type": "json",
                "schema": {
                    "type": "object",
                    "required": [],
                    "properties": {
                        "company_name": {
                            "type": "string"
                          },
                        "company_description": {
                            "type": "string"
                        }
                    }
                }
            },
            "branding",
            "images",
            {
                "type": "screenshot",
                "fullPage": true
            }
        ]
    }
})
};

async function run() {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
    
    // If it returns a job ID, let's poll it until complete
    if (data.id) {
        let status = 'scraping';
        console.log('Job ID:', data.id, 'Polling for completion...');
        
        while (status === 'scraping' || status === 'pending') {
            await new Promise(r => setTimeout(r, 5000));
            const checkRes = await fetch(`https://api.firecrawl.dev/v2/crawl/${data.id}`, {
                headers: {
                    Authorization: 'Bearer fc-a0b1abc010704eec9e8a73e8d274b402',
                }
            });
            const checkData = await checkRes.json();
            status = checkData.status;
            console.log('Status:', status);
            if (status === 'completed' || status === 'failed') {
                console.log(JSON.stringify(checkData, null, 2));
                break;
            }
        }
    }
  } catch (error) {
    console.error(error);
  }
}

run();
