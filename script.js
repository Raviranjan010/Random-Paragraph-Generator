const sentencePool = [
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
    'Progressive Web Apps (PWAs) use JavaScript to work offline and enhance user experience.',
    'The flexibility of JavaScript allows it to be used in automation and scripting tasks.',
    'With WebAssembly, JavaScript can run high-performance applications alongside C++ and Rust.',
    'Machine learning can be integrated into web apps using JavaScript libraries like TensorFlow.js.',
    'JavaScript has a strong presence in cybersecurity, used for penetration testing and ethical hacking.',
    'Blockchain and cryptocurrency applications also leverage JavaScript for smart contracts and DApps.',
    'With frameworks like Electron, JavaScript is used to create desktop applications.',
    'The JavaScript ecosystem includes package managers like npm and yarn for managing dependencies.',
    'Vanilla JavaScript, without frameworks, is often used for lightweight and efficient solutions.',
    'JavaScript plays a vital role in web accessibility by enhancing user interactions.',
    'Using Service Workers, JavaScript helps cache resources and improve website performance.',
    'JavaScript can access and control browser cookies, local storage, and session storage.',
    'It is essential for implementing authentication and authorization in web applications.',
    'Front-end development often uses JavaScript alongside CSS preprocessors like SASS and LESS.',
    'Many AI-powered chatbots use JavaScript for natural language processing and automation.',
    'JavaScript allows for dynamic styling and animations using CSS and the Web Animations API.',
    'Web scraping can be automated using JavaScript tools like Puppeteer and Cheerio.',
    'JavaScript enables drag-and-drop functionality in web applications with ease.',
    'It can be used for augmented reality (AR) and virtual reality (VR) applications with WebXR.',
    'JavaScript is evolving rapidly, with updates introducing new features every year.',
    'The demand for JavaScript developers continues to rise across industries worldwide.',
    'Serverless computing with JavaScript allows for efficient and scalable cloud functions.',
    'JavaScript helps build custom browser extensions for Chrome and Firefox.',
    'Hybrid applications built with JavaScript can run seamlessly on multiple platforms.',
    'Voice recognition and speech synthesis APIs in JavaScript enable hands-free interactions.',
    'Many online learning platforms provide interactive JavaScript courses and projects.',
    'JavaScript developers use GitHub and version control systems to collaborate on projects.',
    'Frameworks like Three.js allow JavaScript to create immersive 3D web experiences.'
];

let synthesis = window.speechSynthesis;
let currentUtterance = null;
let isPaused = false;
let voices = [];

// Initialize Voices
function populateVoices() {
    voices = synthesis.getVoices();
    const voiceSelect = document.getElementById("voice-select");
    voiceSelect.innerHTML = '';

    voices.forEach((voice, i) => {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
}

// Logic: Shuffle array
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Input Button Controls
function adjustValue(amount) {
    const input = document.getElementById("items");
    let val = parseInt(input.value) + amount;
    if (val >= 1 && val <= 50) input.value = val;
}

function updateSpeedLabel() {
    document.getElementById("speed-val").innerText = document.getElementById("rate").value + "x";
}

// Generate Paragraphs
function generate() {
    const count = parseInt(document.getElementById("items").value);
    const container = document.getElementById("data");
    
    // Create random sentence combinations
    let shuffledSentences = shuffle([...sentencePool]);
    let htmlContent = "";

    // If request is large, duplicate pool
    while (shuffledSentences.length < count * 3) {
        shuffledSentences = [...shuffledSentences, ...sentencePool];
    }

    for (let i = 0; i < count; i++) {
        // Construct a paragraph from 3 to 5 random sentences
        let sentenceCount = Math.floor(Math.random() * 3) + 3; 
        let paraText = shuffledSentences.splice(0, sentenceCount).join(" ");
        
        htmlContent += `
            <div class="generated-p">
                ${paraText}
                <button class="copy-item-btn" onclick="copyText(this)" title="Copy Paragraph">
                    <i class="fa-regular fa-copy"></i>
                </button>
            </div>`;
    }

    container.innerHTML = htmlContent;
    
    // Enable Read button if it was disabled
    stopSpeech();
}

// Text to Speech
function readAloud() {
    const text = document.getElementById("data").innerText;
    if (!text.trim() || text.includes("Ready to generate")) {
        showToast("Generate text first!");
        return;
    }

    stopSpeech(); // Clear previous

    currentUtterance = new SpeechSynthesisUtterance(text);
    
    // Settings
    const voiceIdx = document.getElementById("voice-select").value;
    if(voices[voiceIdx]) currentUtterance.voice = voices[voiceIdx];
    
    currentUtterance.rate = document.getElementById("rate").value;

    // Events
    currentUtterance.onend = () => {
        document.getElementById("pause-btn").disabled = true;
        isPaused = false;
    };

    synthesis.speak(currentUtterance);
    document.getElementById("pause-btn").disabled = false;
    document.getElementById("pause-btn").innerHTML = '<i class="fa-solid fa-pause"></i>';
}

function toggleSpeech() {
    if (!synthesis.speaking) return;

    if (isPaused) {
        synthesis.resume();
        document.getElementById("pause-btn").innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        synthesis.pause();
        document.getElementById("pause-btn").innerHTML = '<i class="fa-solid fa-play"></i>';
    }
    isPaused = !isPaused;
}

function stopSpeech() {
    synthesis.cancel();
    isPaused = false;
    document.getElementById("pause-btn").disabled = true;
    document.getElementById("pause-btn").innerHTML = '<i class="fa-solid fa-pause"></i>';
}

// Utilities
function copyText(btn) {
    const text = btn.parentElement.innerText;
    navigator.clipboard.writeText(text).then(() => showToast("Paragraph copied!"));
}

function copyAll() {
    const text = document.getElementById("data").innerText;
    if (!text.trim() || text.includes("Ready to generate")) return;
    navigator.clipboard.writeText(text).then(() => showToast("All content copied!"));
}

function downloadText() {
    const text = document.getElementById("data").innerText;
    if (!text.trim() || text.includes("Ready to generate")) return;

    const blob = new Blob([text], { type: "text/plain" });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "generated-paragraphs.txt";
    anchor.click();
    showToast("Download started!");
}

function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// Init
populateVoices();
