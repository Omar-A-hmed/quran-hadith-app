const fs = require('fs');
const path = require('path');

const book = 'al_adab_al_mufrad';
const basePath = 'c:\\Downloads\\Quran and hadith APP\\quran-hadith-app\\assets\\hadith';

try {
    const filePath = path.join(basePath, `${book}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`\n--- ${book} ---`);
    console.log(`Chapters Array Length: ${data.chapters.length}`);
    const maxChapterIdFromChapters = data.chapters.reduce((max, c) => Math.max(max, c.id || 0), 0);
    console.log(`Max Chapter ID in Chapters: ${maxChapterIdFromChapters}`);

    console.log(`Hadiths Array Length: ${data.hadiths.length}`);
    const maxChapterIdFromHadiths = data.hadiths.reduce((max, h) => Math.max(max, h.chapterId || 0), 0);
    console.log(`Max Chapter ID in Hadiths: ${maxChapterIdFromHadiths}`);

    // Check max idInBook
    const maxIdInBook = data.hadiths.reduce((max, h) => Math.max(max, h.idInBook || 0), 0);
    console.log(`Max idInBook: ${maxIdInBook}`);

} catch (e) {
    console.error(`Error reading ${book}: ${e.message}`);
}
