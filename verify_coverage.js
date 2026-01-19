const fs = require('fs');

const metaPath = 'c:/Downloads/Quran and hadith APP/quran-hadith-app/constants/hadith_books_meta.json';
const transPath = 'c:/Downloads/Quran and hadith APP/quran-hadith-app/constants/ChapterTranslations.ts';

const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
const transFile = fs.readFileSync(transPath, 'utf8');

// Extract keys from ChapterTranslations.ts (simple regex parse)
// We look for: "Some Title": { ... }
const transKeys = new Set();
const regex = /"([^"]+)":\s*{/g;
let match;
while ((match = regex.exec(transFile)) !== null) {
    transKeys.add(match[1]);
}

console.log(`Loaded ${transKeys.size} translation keys.`);

const missing = {};

Object.keys(meta).forEach(bookId => {
    const book = meta[bookId];
    if (book.chapters) {
        book.chapters.forEach(c => {
            const title = c.title.trim();
            if (!transKeys.has(title)) {
                // Check if it's a "Chapter X" pattern which is handled dynamically
                if (!title.startsWith('Chapter ')) {
                    if (!missing[bookId]) missing[bookId] = [];
                    missing[bookId].push(title);
                }
            }
        });
    }
});

console.log('Missing Translations by Book:');
fs.writeFileSync('missing_report.json', JSON.stringify(missing, null, 2), 'utf8');
console.log('Written to missing_report.json');

