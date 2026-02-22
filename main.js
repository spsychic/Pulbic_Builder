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
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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


document.getElementById('generate-btn').addEventListener('click', () => {
    const lottoNumbersContainer = document.getElementById('lotto-numbers');
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();

    while(numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    for (const number of numbers) {
        const lottoBall = document.createElement('lotto-ball');
        lottoBall.setAttribute('number', number);
        lottoNumbersContainer.appendChild(lottoBall);
    }
});
