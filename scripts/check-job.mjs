import fetch from 'node-fetch';
import fs from 'fs';

const jobId = '019e1192-eb07-716d-b2e0-c089da4a85e9';
async function run() {
    let status = 'scraping';
    while (status === 'scraping' || status === 'pending') {
        const checkRes = await fetch(`https://api.firecrawl.dev/v2/crawl/${jobId}`, {
            headers: {
                Authorization: 'Bearer fc-a0b1abc010704eec9e8a73e8d274b402',
            }
        });
        const checkData = await checkRes.json();
        status = checkData.status;
        console.log('Status:', status);
        if (status === 'completed' || status === 'failed') {
            fs.writeFileSync('crawl-results.json', JSON.stringify(checkData, null, 2));
            console.log('Saved to crawl-results.json');
            break;
        }
        await new Promise(r => setTimeout(r, 10000));
    }
}
run();
