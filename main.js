const themeToggle = document.getElementById('theme-toggle');
const wideToggle = document.getElementById('wide-toggle');
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');
const statusEl = document.getElementById('status');
const webcamContainer = document.getElementById('webcam-container');
const resultsList = document.getElementById('results-list');
const resultLabel = document.getElementById('result-label');
const resultScore = document.getElementById('result-score');

const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/k57MADZYr/';

let model;
let webcam;
let maxPredictions = 0;
let animationId = null;
let isRunning = false;

const setToggleState = (button, isActive, activeLabel, inactiveLabel) => {
    button.setAttribute('aria-pressed', String(isActive));
    button.textContent = isActive ? activeLabel : inactiveLabel;
};

const applyTheme = (isDark) => {
    document.body.classList.toggle('dark', isDark);
    setToggleState(themeToggle, isDark, 'Light Mode', 'Dark Mode');
    localStorage.setItem('lotto-theme', isDark ? 'dark' : 'light');
};

const applyWide = (isWide) => {
    document.body.classList.toggle('wide', isWide);
    setToggleState(wideToggle, isWide, 'Normal Width', 'Wide Mode');
    localStorage.setItem('lotto-wide', isWide ? 'wide' : 'normal');
};

const initToggles = () => {
    const storedTheme = localStorage.getItem('lotto-theme');
    const storedWide = localStorage.getItem('lotto-wide');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    applyTheme(storedTheme ? storedTheme === 'dark' : prefersDark);
    applyWide(storedWide ? storedWide === 'wide' : false);
};

const setStatus = (message) => {
    statusEl.textContent = message;
};

const clearResults = () => {
    resultsList.innerHTML = '';
    resultLabel.textContent = '-';
    resultScore.textContent = '0%';
};

const renderResultRows = (predictions) => {
    resultsList.innerHTML = '';
    predictions.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'result-row';

        const label = document.createElement('span');
        label.className = 'result-name';
        label.textContent = item.className;

        const bar = document.createElement('div');
        bar.className = 'result-bar';

        const fill = document.createElement('div');
        fill.className = 'result-fill';
        fill.style.width = `${Math.round(item.probability * 100)}%`;

        const score = document.createElement('span');
        score.className = 'result-value';
        score.textContent = `${(item.probability * 100).toFixed(1)}%`;

        bar.appendChild(fill);
        row.appendChild(label);
        row.appendChild(bar);
        row.appendChild(score);
        resultsList.appendChild(row);
    });
};

const updatePrimaryResult = (topPrediction) => {
    if (!topPrediction) {
        resultLabel.textContent = '-';
        resultScore.textContent = '0%';
        return;
    }
    resultLabel.textContent = topPrediction.className;
    resultScore.textContent = `${(topPrediction.probability * 100).toFixed(1)}%`;
};

const stopWebcam = () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    if (webcam) {
        webcam.stop();
        webcam = null;
    }
    isRunning = false;
    stopButton.disabled = true;
    startButton.disabled = false;
    setStatus('중지되었습니다.');
};

async function init() {
    if (isRunning) return;

    try {
        setStatus('모델을 불러오는 중...');
        startButton.disabled = true;
        stopButton.disabled = false;
        clearResults();

        const modelURL = `${MODEL_URL}model.json`;
        const metadataURL = `${MODEL_URL}metadata.json`;

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        if (webcam) {
            webcam.stop();
        }
        webcam = new tmImage.Webcam(360, 360, true);
        await webcam.setup();
        await webcam.play();
        webcamContainer.innerHTML = '';
        webcamContainer.appendChild(webcam.canvas);

        isRunning = true;
        setStatus('분석 중입니다.');
        animationId = window.requestAnimationFrame(loop);
    } catch (error) {
        console.error(error);
        setStatus('카메라 권한 또는 모델 로드에 실패했습니다.');
        startButton.disabled = false;
        stopButton.disabled = true;
        isRunning = false;
    }
}

async function loop() {
    if (!isRunning || !webcam) return;
    webcam.update();
    await predict();
    animationId = window.requestAnimationFrame(loop);
}

async function predict() {
    if (!model || !webcam) return;
    const prediction = await model.predict(webcam.canvas);
    const sorted = [...prediction].sort((a, b) => b.probability - a.probability);
    updatePrimaryResult(sorted[0]);
    renderResultRows(sorted.slice(0, maxPredictions));
}

initToggles();

themeToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark');
    applyTheme(isDark);
});

wideToggle.addEventListener('click', () => {
    const isWide = !document.body.classList.contains('wide');
    applyWide(isWide);
});

startButton.addEventListener('click', () => {
    init();
});

stopButton.addEventListener('click', () => {
    stopWebcam();
});

window.addEventListener('beforeunload', () => {
    if (webcam) {
        webcam.stop();
    }
});
