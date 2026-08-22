const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const daycareFile = path.join(root, 'Student-Learning-Portal', 'data', 'daycarecentre.json');
const subjectsFile = path.join(root, 'Student-Learning-Portal', 'js', 'subjects.js');

const daycare = JSON.parse(fs.readFileSync(daycareFile, 'utf8'));
const subjectsCode = fs.readFileSync(subjectsFile, 'utf8');

if (!daycare.subjects || !daycare.subjects.Science || daycare.subjects.Science.length < 4) {
  throw new Error('Science must contain at least 4 chapters for Day Care Centre School.');
}

if (!subjectsCode.includes('quiz.html?subject=')) {
  throw new Error('Subjects page should redirect to quiz.html when a subject is clicked.');
}

console.log('Subject chapter tests passed.');
