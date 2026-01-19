const fs = require('fs');
const https = require('https');

const books = [
    { name: 'shamail', start: 1, end: 56 },
    { name: 'ahmad', start: 1, end: 35 } // Musnad Ahmad chapters 1-35
];

async function fetchPage(book, chapter) {
    return new Promise((resolve, reject) => {
        const url = `https://sunnah.com/${book}/${chapter}`;
        console.log(`Fetching ${url}...`);
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
            res.on('error', reject);
        });
    });
}

function extractGrades(html, bookName) {
    const grades = {};
    const hadithContainers = html.split('class="actualHadithContainer');

    hadithContainers.slice(1).forEach(container => {
        // Extract ID
        // Look for "Musnad Ahmad X" or in-book reference
        let id = null;

        // Strategy 1: Sticky header (e.g. "Musnad Ahmad 1")
        let idMatch = container.match(/<div class="hadith_reference_sticky">[^<]*?(\d+)<\/div>/);
        if (idMatch) {
            id = parseInt(idMatch[1]);
        }

        // Strategy 2: In-book reference
        if (!id) {
            const inBookMatch = container.match(/In-book reference<\/td><td>&nbsp;:&nbsp;[^<]*?Hadith (\d+)[^<]*?<\/td>/);
            if (inBookMatch) {
                id = parseInt(inBookMatch[1]);
            }
        }

        if (id) {
            // Extract Grade
            // Look for english_grade.
            // Sunnah.com structure: <td class=english_grade ...><b>Grade</b>:</td><td class=english_grade ...>&nbsp;<b>Sahih</b>...

            let grade = null;
            const englishGradeMatches = container.match(/class=english_grade[^>]*>.*?<b>([^<]+)<\/b>/g);

            if (englishGradeMatches && englishGradeMatches.length > 1) {
                // The second match is usually the value
                const valMatch = englishGradeMatches[1].match(/<b>([^<]+)<\/b>/);
                if (valMatch) grade = valMatch[1].trim();
            } else if (englishGradeMatches && englishGradeMatches.length === 1) {
                const valMatch = englishGradeMatches[0].match(/<b>([^<]+)<\/b>/);
                // Only use if it doesn't say "Grade"
                if (valMatch && !valMatch[1].includes("Grade")) {
                    grade = valMatch[1].trim();
                }
            }

            if (grade) {
                // Normalize
                let normalized = grade;
                const lower = grade.toLowerCase();
                if (lower.includes('sahih')) normalized = 'Sahih';
                else if (lower.includes('hasan')) normalized = 'Hasan';
                else if (lower.includes('da\'if') || lower.includes('daif') || lower.includes('weak')) normalized = 'Da\'if';

                grades[id] = normalized;
            }
        }
    });
    return grades;
}

async function scrape() {
    for (const book of books) {
        if (book.name !== 'ahmad') continue; // Only process Ahmad for now

        let allGrades = {};
        console.log(`Scraping ${book.name} from chapter ${book.start} to ${book.end}...`);

        for (let i = book.start; i <= book.end; i++) {
            try {
                const html = await fetchPage(book.name, i);
                const grades = extractGrades(html, book.name);
                const count = Object.keys(grades).length;
                console.log(`Chapter ${i}: Found ${count} grades.`);
                Object.assign(allGrades, grades);

                // Allow some time between requests
                await new Promise(r => setTimeout(r, 500));
            } catch (e) {
                console.error(`Error scraping ${book.name} chapter ${i}:`, e.message);
            }
        }

        fs.writeFileSync(`grades_${book.name}.json`, JSON.stringify(allGrades, null, 2));
        console.log(`Saved grades_${book.name}.json with ${Object.keys(allGrades).length} entries.`);
    }
}

scrape();
