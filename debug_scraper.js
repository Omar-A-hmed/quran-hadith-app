const https = require('https');
const fs = require('fs');

const url = '/ahmad/1';
const options = {
    hostname: 'sunnah.com',
    path: url,
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        fs.writeFileSync('debug_ahmad.html', data);
        console.log('Saved debug_ahmad.html');
    });
});

req.on('error', e => console.error(e));
req.end();
