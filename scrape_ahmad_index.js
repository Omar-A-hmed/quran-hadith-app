const https = require('https');

function fetchIndex() {
    const url = 'https://sunnah.com/ahmad';
    console.log(`Fetching index from ${url}...`);
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            // Regex to find links like /ahmad/1, /ahmad/2, etc.
            // <div class="book_title">... <a href="/ahmad/1">...</a>
            const regex = /href="\/ahmad\/(\d+)"/g;
            let match;
            const chapters = new Set();

            while ((match = regex.exec(data)) !== null) {
                chapters.add(parseInt(match[1]));
            }

            const sortedChapters = Array.from(chapters).sort((a, b) => a - b);
            console.log('Found Chapters:', sortedChapters.join(', '));
            console.log('Total Chapters:', sortedChapters.length);
        });
    }).on('error', (e) => {
        console.error(e);
    });
}

fetchIndex();
