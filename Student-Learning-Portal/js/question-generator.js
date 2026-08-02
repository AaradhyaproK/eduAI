document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const pasteArea = document.getElementById('pasteArea');
  const schoolNameSelect = document.getElementById('schoolNameSelect');
  const subjectSelect = document.getElementById('subjectSelect');
  const parseBtn = document.getElementById('parseBtn');
  const chapterSelect = document.getElementById('chapterSelect');
  const chaptersSection = document.getElementById('chaptersSection');
  const parseError = document.getElementById('parseError');
  const generateBtn = document.getElementById('generateBtn');
  const numQuestionsInput = document.getElementById('numQuestions');
  const results = document.getElementById('results');
  const generatedCount = document.getElementById('generatedCount');

  let chapters = [];

  if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  parseBtn.addEventListener('click', async () => {
    parseError.classList.add('d-none');
    results.innerHTML = '';
    generatedCount.textContent = '0';

    let text = '';
    if (fileInput.files && fileInput.files[0]) {
      try {
        text = await readInputAsText(fileInput.files[0]);
      } catch (err) {
        showError('Failed to read the selected file. Please try a different PDF or text file.');
        return;
      }
    } else if (pasteArea.value.trim().length > 0) {
      text = pasteArea.value;
    } else {
      showError('Please upload a .pdf or .txt file or paste the content into the box.');
      return;
    }

    const type = schoolNameSelect ? schoolNameSelect.value : 'ssc';
    const subject = subjectSelect ? subjectSelect.value : 'general-science';

    if (subject !== 'general-science' && subject !== 'mathematics') {
      showError('This version currently supports General Science and Mathematics for SSC Board and Day Care Centre School students.');
      return;
    }

    chapters = parseChapters(text, type, subject);
    if (chapters.length === 0) {
      showError('No chapters detected. Make sure the PDF or text has chapter headings such as "Chapter 1" or similar.');
      return;
    }

    populateSelect(chapters);
    chaptersSection.classList.remove('d-none');
  });

  generateBtn.addEventListener('click', () => {
    const idx = chapterSelect.selectedIndex;
    if (idx < 0) return;
    const chapter = chapters[idx];
    const num = Math.max(1, parseInt(numQuestionsInput.value, 10) || 1);
    const subject = subjectSelect ? subjectSelect.value : 'general-science';
    const qs = generateQuestionsFromText(chapter.content, num, subject);
    displayQuestions(qs);
  });

  async function readInputAsText(file) {
    if (file.name.toLowerCase().endsWith('.pdf')) {
      return extractTextFromPdf(file);
    }

    return readFileAsText(file);
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  async function extractTextFromPdf(file) {
    if (!window.pdfjsLib) {
      throw new Error('PDF viewer library is not available.');
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(' ');
      fullText += `${pageText}\n`;
    }

    return fullText;
  }

  function showError(msg) {
    parseError.textContent = msg;
    parseError.classList.remove('d-none');
  }

  function parseChapters(text, type, subject) {
    const lines = text.split(/\r?\n/);
    const chapters = [];
    let current = { title: subject === 'general-science' ? 'General Science Overview' : subject === 'mathematics' ? 'Mathematics Overview' : 'Full Text', contentLines: [] };

    const isHeadingForType = (line) => {
      if (!line) return false;
      const trimmed = line.trim();
      if (type === 'ssc') {
        return /^\s*(Chapter\s+\d+[:\.]?\s*(.*)|CHAPTER\s+\d+|^CHAPTER\b|^Chapter\b)/i.test(line);
      }
      if (/^\s*(Lesson|Topic)\b/i.test(trimmed)) return true;
      const isAllCaps = trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed) && trimmed.length < 80;
      if (isAllCaps && trimmed.split(/\s+/).length <= 6) return true;
      return false;
    };

    for (let line of lines) {
      if (isHeadingForType(line)) {
        if (current.contentLines.length > 0 || current.title !== (subject === 'general-science' ? 'General Science Overview' : 'Full Text')) {
          chapters.push({ title: current.title, content: current.contentLines.join(' ') });
        }
        const t = line.trim();
        current = { title: t, contentLines: [] };
      } else if (trimmedLine(line)) {
        current.contentLines.push(trimmedLine(line));
      }
    }

    if (current.contentLines.length > 0 || chapters.length === 0) {
      chapters.push({ title: current.title, content: current.contentLines.join(' ') });
    }

    return chapters.filter((chapter) => chapter.content.trim().length > 0);
  }

  function trimmedLine(line) {
    return line.trim();
  }

  function generateQuestionsFromText(text, n, subject) {
    if (subject === 'mathematics') {
      return generateMathQuestions(text, n);
    }

    const sentences = splitIntoSentences(text);
    const out = [];
    if (sentences.length === 0) return out;

    const used = new Set();
    for (let i = 0; i < n; i++) {
      let idx;
      let attempts = 0;
      do {
        idx = Math.floor(Math.random() * sentences.length);
        attempts++;
      } while (used.has(idx) && attempts < 10);
      used.add(idx);
      const s = sentences[idx];
      const q = makeFillBlankQuestion(s);
      out.push(q);
    }
    return out;
  }

  function generateMathQuestions(text, n) {
    const numbers = Array.from(text.matchAll(/\d+/g), (m) => Number(m[0]));
    const questions = [];
    const operations = [
      { symbol: '+', fn: (a, b) => a + b },
      { symbol: '-', fn: (a, b) => a - b },
      { symbol: '×', fn: (a, b) => a * b },
      { symbol: '÷', fn: (a, b) => a / b },
    ];

    const getRandomNumber = () => Math.floor(Math.random() * 20) + 1;
    const safeDivide = (a, b) => (b === 0 ? 0 : Math.round((a / b) * 100) / 100);

    for (let i = 0; i < n; i++) {
      const useTextNumbers = numbers.length >= 2 && Math.random() < 0.6;
      let a = useTextNumbers ? numbers[i % numbers.length] : getRandomNumber();
      let b = useTextNumbers ? numbers[(i + 1) % numbers.length] : getRandomNumber();
      const op = operations[Math.floor(Math.random() * operations.length)];

      if (op.symbol === '÷') {
        if (b === 0) b = 1;
        a = a * b;
      }

      const answer = op.symbol === '÷' ? safeDivide(a, b) : op.fn(a, b);
      const qText = `What is ${a} ${op.symbol} ${b}?`;
      questions.push({ question: qText, answer: String(answer) });
    }

    return questions;
  }

  function populateSelect(chapters) {
    chapterSelect.innerHTML = '';
    chapters.forEach((c, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${c.title}`;
      chapterSelect.appendChild(opt);
    });
  }

  function splitIntoSentences(text) {
    // naive sentence splitter
    return text
      .replace(/\s+/g, ' ')
      .split(/(?<=[\.\?\!])\s+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  function generateQuestionsFromText(text, n) {
    const sentences = splitIntoSentences(text);
    const out = [];
    if (sentences.length === 0) return out;

    const used = new Set();
    for (let i = 0; i < n; i++) {
      // pick a random sentence not used yet (or allow reuse if not enough)
      let idx;
      let attempts = 0;
      do {
        idx = Math.floor(Math.random() * sentences.length);
        attempts++;
      } while (used.has(idx) && attempts < 10);
      used.add(idx);
      const s = sentences[idx];
      const q = makeFillBlankQuestion(s);
      out.push(q);
    }
    return out;
  }

  function makeFillBlankQuestion(sentence) {
    // remove a random word (longer than 3 chars) and return blanked sentence
    const words = sentence.split(/(\s+)/);
    const candidateIndexes = [];
    for (let i = 0; i < words.length; i++) {
      const w = words[i].replace(/[^a-zA-Z]/g, '');
      if (w.length >= 4) candidateIndexes.push(i);
    }
    if (candidateIndexes.length === 0) return { question: `Explain: ${sentence}`, answer: '' };
    const pick = candidateIndexes[Math.floor(Math.random() * candidateIndexes.length)];
    const answer = words[pick].trim();
    words[pick] = '____';
    const qText = words.join('');
    return { question: qText, answer };
  }

  function displayQuestions(qs) {
    results.innerHTML = '';
    qs.forEach((q, i) => {
      const item = document.createElement('div');
      item.className = 'list-group-item';
      const html = `<div><strong>Q${i + 1}.</strong> ${escapeHtml(q.question)}</div>` + (q.answer ? `<div class="text-muted small mt-1">Answer: ${escapeHtml(q.answer)}</div>` : '');
      item.innerHTML = html;
      results.appendChild(item);
    });
    generatedCount.textContent = String(qs.length);
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }
});
