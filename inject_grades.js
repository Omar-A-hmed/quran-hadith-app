const fs = require('fs');
const path = require('path');

const files = [
    { name: 'shamail', jsonPath: 'quran-hadith-app/assets/hadith/shamail.json', gradesPath: 'grades_shamail.json' },
    { name: 'al_adab_al_mufrad', jsonPath: 'quran-hadith-app/assets/hadith/al_adab_al_mufrad.json', gradesPath: 'grades_adab.json' },
    { name: 'musnad_ahmad', jsonPath: 'quran-hadith-app/assets/hadith/musnad_ahmad.json', gradesPath: 'grades_ahmad.json' }
];

files.forEach(file => {
    // Check if grades file exists
    if (!fs.existsSync(file.gradesPath)) {
        console.log(`Grades file not found for ${file.name}: ${file.gradesPath}`);
        return;
    }

    const grades = JSON.parse(fs.readFileSync(file.gradesPath));
    const targetPath = path.join(__dirname, file.jsonPath);

    if (!fs.existsSync(targetPath)) {
        console.log(`Target JSON file not found: ${targetPath}`);
        return;
    }

    console.log(`Processing ${file.name}...`);
    const hadithData = JSON.parse(fs.readFileSync(targetPath));
    let updatedCount = 0;

    hadithData.hadiths.forEach(h => {
        // Match by idInBook
        if (grades[h.idInBook]) {
            h.grade = grades[h.idInBook];
            updatedCount++;
        }
    });

    fs.writeFileSync(targetPath, JSON.stringify(hadithData, null, 2));
    console.log(`Updated ${file.name}: Injected ${updatedCount} grades.`);
});
