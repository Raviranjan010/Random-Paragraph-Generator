/* ─── SENTENCE POOL ─── */
const sentencePool = {
    short: [
        'JavaScript powers the modern web.',
        'It runs in every major browser.',
        'Functions are first-class citizens in JS.',
        'ES6 introduced arrow functions and classes.',
        'The DOM connects JS to HTML.',
        'Promises handle asynchronous operations.',
        'Node.js brought JS to the server.',
        'npm hosts millions of open-source packages.',
        'React changed how UIs are built.',
        'TypeScript adds types to JavaScript.',
        'WebSockets enable real-time apps.',
        'Service Workers power offline PWAs.',
        'Closures are a core JS concept.',
        'Arrays and objects are reference types.',
        'The event loop enables non-blocking I/O.',
        'JSON is native to JavaScript.',
        'Destructuring simplifies data access.',
        'Template literals replaced string concatenation.',
        'Modules keep codebases organized.',
        'fetch() replaced XMLHttpRequest.',
        'Async/await simplifies promise chains.',
        'Map and Set expand data structures.',
        'WeakMap prevents memory leaks.',
        'Proxies intercept object operations.',
        'Generators produce lazy sequences.',
        'Symbols create unique identifiers.',
        'Iterators enable custom loops.',
        'Optional chaining prevents null errors.',
        'Nullish coalescing replaces fallback patterns.',
        'BigInt handles large integers precisely.',
    ],
    medium: [
        'JavaScript is a powerful programming language used for web development.',
        'It allows developers to create interactive and dynamic web applications.',
        'JavaScript can manipulate HTML and CSS to update content in real time.',
        'It supports event-driven programming, making web pages more responsive.',
        'With JavaScript, developers can interact with the Document Object Model (DOM).',
        'Modern frameworks like React, Vue.js, and Angular make JavaScript even more powerful.',
        'JavaScript is widely used for both frontend and backend development.',
        'Many companies rely on JavaScript for their web applications and services.',
        'It has a large and active developer community providing continuous improvements.',
        'JavaScript is the foundation of modern web applications and interactive UIs.',
        'The popularity of JavaScript continues to grow with new libraries and tools.',
        'Learning JavaScript opens doors to opportunities in web development and beyond.',
        'JavaScript enables asynchronous programming using promises and async/await.',
        'It is often used with RESTful APIs to fetch and send data dynamically.',
        'JavaScript can be used in mobile app development with frameworks like React Native.',
        'The introduction of ES6 brought many improvements, including arrow functions and template literals.',
        'Web developers use JavaScript to build Single Page Applications (SPAs) for smooth user experiences.',
        'With Node.js, JavaScript can run on servers, enabling full-stack development.',
        'JavaScript can interact with databases using technologies like MongoDB and Firebase.',
        'It allows the creation of browser-based games using HTML5 Canvas and WebGL.',
        'JavaScript libraries like D3.js help in data visualization and interactive charts.',
        'Many modern applications use WebSockets for real-time communication with JavaScript.',
        'Progressive Web Apps use JavaScript to work offline and enhance user experience.',
        'The flexibility of JavaScript allows it to be used in automation and scripting tasks.',
        'With WebAssembly, JavaScript can run high-performance applications alongside C++ and Rust.',
        'Machine learning can be integrated into web apps using JavaScript libraries like TensorFlow.js.',
        'JavaScript has a strong presence in cybersecurity, used for penetration testing and ethical hacking.',
        'Blockchain applications also leverage JavaScript for smart contracts and decentralized apps.',
        'With frameworks like Electron, JavaScript is used to create desktop applications.',
        'The JavaScript ecosystem includes package managers like npm and yarn for managing dependencies.',
    ],
    long: [
        'JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification, offering dynamic typing, prototype-based object orientation, and first-class functions, making it remarkably flexible for both beginner and advanced developers alike.',
        'Originally designed in 1995 by Brendan Eich at Netscape Communications, JavaScript has evolved from a simple client-side scripting tool into a full-stack programming language capable of powering everything from interactive websites to sophisticated server-side applications and mobile platforms.',
        'The Document Object Model provides JavaScript with a structured, tree-like representation of HTML documents, allowing scripts to programmatically read, modify, and respond to changes in page content, structure, and styles without requiring a full page reload from the server.',
        'Asynchronous programming patterns such as callbacks, promises, and the modern async/await syntax allow JavaScript applications to perform time-consuming operations like network requests and file system access without blocking the main execution thread or degrading user experience.',
        'The Node.js runtime environment, built on Chrome\'s V8 JavaScript engine, extended the language beyond the browser in 2009, enabling developers to build scalable network applications, command-line tools, RESTful APIs, and real-time services using a single unified programming language.',
        'JavaScript frameworks and libraries have dramatically accelerated development cycles; React introduced a virtual DOM and component-based architecture, Vue.js provided a gentle learning curve with reactive data binding, and Angular offered a comprehensive enterprise-grade solution with built-in tooling and strict conventions.',
        'The npm package registry, containing over two million packages as of recent counts, represents one of the largest software ecosystems in existence, providing JavaScript developers with reusable solutions for virtually every programming challenge from cryptography to machine learning.',
        'WebSockets provide JavaScript applications with full-duplex communication channels over a single persistent TCP connection, enabling real-time features such as live chat, collaborative document editing, financial tickers, and multiplayer gaming with dramatically lower latency than traditional HTTP polling techniques.',
        'Progressive Web Applications leverage JavaScript service workers, the Cache API, and web manifests to deliver native app-like experiences in the browser, including offline functionality, push notifications, background synchronization, and home screen installation across supported platforms.',
        'TypeScript, a statically typed superset of JavaScript developed by Microsoft, has gained widespread adoption in large-scale projects by adding optional type annotations, interfaces, and advanced tooling support, catching entire classes of runtime errors at compile time and improving code maintainability significantly.',
    ]
};

/* ─── STATE ─── */
let synthesis = window.speechSynthesis;
let currentUtterance = null;
let isPaused = false;
let voices = [];
let currentLength = 'medium';
let lineNumbersOn = false;
let currentFontSize = 15;
let hasContent = false;

/* ─── CLOCK ─── */
function updateClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('live-clock').textContent = `${hh}:${mm}:${ss}`;
}
setInterval(updateClock, 1000);
updateClock();

/* ─── VOICES ─── */
function populateVoices() {
    voices = synthesis.getVoices();
    const sel = document.getElementById('voice-select');
    sel.innerHTML = '';
    voices.forEach((v, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `${v.name} (${v.lang})`;
        sel.appendChild(opt);
    });
}

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
}
populateVoices();

/* ─── THEME ─── */
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('#theme-toggle .toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.val === theme);
    });
    localStorage.setItem('tl-theme', theme);
}

// Restore saved theme
const savedTheme = localStorage.getItem('tl-theme');
if (savedTheme) setTheme(savedTheme);

/* ─── SENTENCE LENGTH ─── */
document.querySelectorAll('#length-toggle .toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentLength = btn.dataset.val;
        document.querySelectorAll('#length-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

/* ─── COUNTER ─── */
function adjustValue(amount) {
    const input = document.getElementById('items');
    const slider = document.getElementById('para-slider');
    let val = parseInt(input.value) + amount;
    if (val >= 1 && val <= 50) {
        input.value = val;
        slider.value = val;
    }
}

function syncSlider() {
    const slider = document.getElementById('para-slider');
    document.getElementById('items').value = slider.value;
}

/* ─── SPEED ─── */
function updateSpeedLabel() {
    const val = parseFloat(document.getElementById('rate').value).toFixed(1);
    document.getElementById('speed-val').textContent = val + '×';
}

/* ─── SHUFFLE ─── */
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/* ─── GENERATE ─── */
function generate() {
    const count = parseInt(document.getElementById('items').value);
    const container = document.getElementById('data');
    const pool = sentencePool[currentLength];

    let sentences = shuffle(pool);
    while (sentences.length < count * 5) {
        sentences = [...sentences, ...shuffle(pool)];
    }

    const sentencesPerPara = { short: [4, 7], medium: [3, 5], long: [2, 3] };
    const [min, max] = sentencesPerPara[currentLength];

    let html = '';
    let totalWords = 0;
    let totalChars = 0;

    for (let i = 0; i < count; i++) {
        const len = Math.floor(Math.random() * (max - min + 1)) + min;
        const paraText = sentences.splice(0, len).join(' ');
        const wordCount = paraText.split(/\s+/).length;
        totalWords += wordCount;
        totalChars += paraText.length;

        html += `
        <div class="para-block" style="animation-delay:${i * 0.05}s">
            <div class="para-num">${String(i + 1).padStart(2, '0')}</div>
            <p class="para-text">${paraText}</p>
            <div class="para-actions">
                <button class="para-action-btn" onclick="copyPara(this)" title="Copy">
                    <i class="fa-regular fa-copy"></i>
                </button>
                <button class="para-action-btn" onclick="removePara(this)" title="Remove">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        </div>`;
    }

    container.innerHTML = html;
    hasContent = true;

    // Update stats
    document.getElementById('word-count').textContent = totalWords.toLocaleString() + ' words';
    document.getElementById('para-count-label').textContent = count + ' paragraphs';
    document.getElementById('char-count').textContent = totalChars.toLocaleString() + ' characters';
    const readMins = Math.max(1, Math.round(totalWords / 200));
    document.getElementById('read-time').textContent = '~' + readMins + ' min read';

    stopSpeech();
    showToast('Generated ' + count + ' paragraph' + (count > 1 ? 's' : ''));
}

/* ─── PARA ACTIONS ─── */
function copyPara(btn) {
    const text = btn.closest('.para-block').querySelector('.para-text').textContent;
    navigator.clipboard.writeText(text.trim()).then(() => showToast('Paragraph copied!'));
}

function removePara(btn) {
    const block = btn.closest('.para-block');
    block.style.opacity = '0';
    block.style.transform = 'translateX(20px)';
    block.style.transition = 'all 0.25s ease';
    setTimeout(() => {
        block.remove();
        updateStats();
    }, 250);
}

function updateStats() {
    const paras = document.querySelectorAll('.para-text');
    const totalText = Array.from(paras).map(p => p.textContent).join(' ');
    const words = totalText.trim() ? totalText.trim().split(/\s+/).length : 0;
    document.getElementById('word-count').textContent = words.toLocaleString() + ' words';
    document.getElementById('para-count-label').textContent = paras.length + ' paragraphs';
    document.getElementById('char-count').textContent = totalText.length.toLocaleString() + ' characters';
    const readMins = Math.max(1, Math.round(words / 200));
    document.getElementById('read-time').textContent = words > 0 ? '~' + readMins + ' min read' : '~0 min read';
}

/* ─── FONT SIZE ─── */
function increaseFont() {
    currentFontSize = Math.min(22, currentFontSize + 1);
    document.querySelector('.output-zone').style.fontSize = currentFontSize + 'px';
}
function decreaseFont() {
    currentFontSize = Math.max(11, currentFontSize - 1);
    document.querySelector('.output-zone').style.fontSize = currentFontSize + 'px';
}

/* ─── LINE NUMBERS ─── */
function toggleLineNumbers() {
    lineNumbersOn = !lineNumbersOn;
    document.querySelectorAll('.para-num').forEach(el => {
        el.style.display = lineNumbersOn ? 'block' : 'none';
    });
    document.getElementById('ln-btn').classList.toggle('active', lineNumbersOn);
    showToast(lineNumbersOn ? 'Line numbers on' : 'Line numbers off');
}

/* ─── SPEECH ─── */
function readAloud() {
    const paras = document.querySelectorAll('.para-text');
    if (!paras.length) { showToast('Generate text first!'); return; }
    const text = Array.from(paras).map(p => p.textContent).join('\n\n');

    stopSpeech();
    currentUtterance = new SpeechSynthesisUtterance(text);
    const voiceIdx = document.getElementById('voice-select').value;
    if (voices[voiceIdx]) currentUtterance.voice = voices[voiceIdx];
    currentUtterance.rate = document.getElementById('rate').value;

    currentUtterance.onend = () => {
        document.getElementById('pause-btn').disabled = true;
        isPaused = false;
    };

    synthesis.speak(currentUtterance);
    document.getElementById('pause-btn').disabled = false;
    document.getElementById('pause-btn').innerHTML = '<i class="fa-solid fa-pause"></i>';
    showToast('Reading aloud…');
}

function toggleSpeech() {
    if (!synthesis.speaking) return;
    if (isPaused) {
        synthesis.resume();
        document.getElementById('pause-btn').innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        synthesis.pause();
        document.getElementById('pause-btn').innerHTML = '<i class="fa-solid fa-play"></i>';
    }
    isPaused = !isPaused;
}

function stopSpeech() {
    synthesis.cancel();
    isPaused = false;
    const pauseBtn = document.getElementById('pause-btn');
    pauseBtn.disabled = true;
    pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}

/* ─── COPY & DOWNLOAD ─── */
function copyAll() {
    const paras = document.querySelectorAll('.para-text');
    if (!paras.length) { showToast('Nothing to copy!'); return; }
    const text = Array.from(paras).map(p => p.textContent.trim()).join('\n\n');
    navigator.clipboard.writeText(text).then(() => showToast('All content copied!'));
}

function downloadText() {
    const paras = document.querySelectorAll('.para-text');
    if (!paras.length) { showToast('Nothing to download!'); return; }
    const text = Array.from(paras).map(p => p.textContent.trim()).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'textlab-output.txt';
    a.click();
    showToast('Download started!');
}

function downloadHTML() {
    const paras = document.querySelectorAll('.para-text');
    if (!paras.length) { showToast('Nothing to export!'); return; }
    const parasHTML = Array.from(paras).map((p, i) => `<p>${p.textContent.trim()}</p>`).join('\n');
    const fullHTML = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<title>TextLab Export</title>\n<style>body{font-family:Georgia,serif;max-width:720px;margin:40px auto;line-height:1.75;color:#1a1a1a}p{margin-bottom:1.4em}</style>\n</head>\n<body>\n${parasHTML}\n</body>\n</html>`;
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'textlab-output.html';
    a.click();
    showToast('HTML export started!');
}

/* ─── FIND & HIGHLIGHT ─── */
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.getElementById('find-modal').classList.remove('hidden');
        document.getElementById('find-input').focus();
        return;
    }
    if (e.key === 'Escape') {
        closeModal();
        return;
    }
    if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
        generate();
    }
});

function closeModal() {
    document.getElementById('find-modal').classList.add('hidden');
    clearHighlights();
}

function findInText() {
    const term = document.getElementById('find-input').value.trim();
    if (!term) { showToast('Enter a search term'); return; }

    clearHighlights();

    const paras = document.querySelectorAll('.para-text');
    let totalMatches = 0;

    paras.forEach(p => {
        const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
        const matches = p.textContent.match(regex);
        if (matches) {
            totalMatches += matches.length;
            p.innerHTML = p.textContent.replace(regex, '<mark class="highlight">$1</mark>');
        }
    });

    const resultEl = document.getElementById('find-results');
    if (totalMatches > 0) {
        resultEl.textContent = `Found ${totalMatches} match${totalMatches > 1 ? 'es' : ''}`;
        // Scroll to first match
        const firstMark = document.querySelector('mark.highlight');
        if (firstMark) firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        resultEl.textContent = 'No matches found';
    }
}

function clearHighlights() {
    document.querySelectorAll('.para-text').forEach(p => {
        p.innerHTML = p.textContent;
    });
    document.getElementById('find-results').textContent = '';
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ─── TOAST ─── */
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ─── KEYBOARD SHORTCUT: ENTER to generate ─── */
// (handled inside the combined keydown listener above)
