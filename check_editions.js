const https = require('https');
const fs = require('fs');

const url = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions.json';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const editions = JSON.parse(data);
            fs.writeFileSync('editions_dump.json', JSON.stringify(editions, null, 2), 'utf8');
            console.log('Dumped editions to editions_dump.json');
        } catch (e) {
            console.error(e);
        }
    });
}).on('error', (e) => {
    console.error(e);
});
