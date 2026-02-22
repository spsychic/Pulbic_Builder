class LottoBall extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const number = this.getAttribute('number');
        const color = this.getColorForNumber(number);
        this.shadowRoot.innerHTML = `
            <style>
                .ball {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 24px;
                    font-weight: bold;
                    color: #fff;
                    background-color: ${color};
                    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
                }
            </style>
            <div class="ball">${number}</div>
        `;
    }

    getColorForNumber(number) {
        if (number <= 10) return '#f44336'; // Red
        if (number <= 20) return '#ff9800'; // Orange
        if (number <= 30) return '#ffeb3b'; // Yellow
        if (number <= 40) return '#4caf50'; // Green
        return '#2196f3'; // Blue
    }
}

customElements.define('lotto-ball', LottoBall);

const themeToggle = document.getElementById('theme-toggle');
const wideToggle = document.getElementById('wide-toggle');
const generateButton = document.getElementById('generate-btn');
const lottoNumbersContainer = document.getElementById('lotto-numbers');

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

initToggles();

themeToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark');
    applyTheme(isDark);
});

wideToggle.addEventListener('click', () => {
    const isWide = !document.body.classList.contains('wide');
    applyWide(isWide);
});

generateButton.addEventListener('click', () => {
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();

    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    for (const number of numbers) {
        const lottoBall = document.createElement('lotto-ball');
        lottoBall.setAttribute('number', number);
        lottoNumbersContainer.appendChild(lottoBall);
    }
});
