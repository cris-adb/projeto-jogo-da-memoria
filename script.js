const gameContainer = document.querySelector('.game-container');
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let lockBoard = false;

// Array com as letras e os caminhos dos GIFs
const cardData = [
    { type: 'letter', content: 'A' },
    { type: 'gif', content: 'caminho/para/o/seu/gif/da/letra/a.gif' },
    { type: 'letter', content: 'B' },
    { type: 'gif', content: 'caminho/para/o/seu/gif/da/letra/b.gif' },
    { type: 'letter', content: 'C' },
    { type: 'gif', content: 'caminho/para/o/seu/gif/da/letra/c.gif' },
    { type: 'letter', content: 'D' },
    { type: 'gif', content: 'caminho/para/o/seu/gif/da/letra/d.gif' },
    { type: 'letter', content: 'E' },
    { type: 'gif', content: 'caminho/para/o/seu/gif/da/letra/e.gif' },
    { type: 'letter', content: 'F' },
    { type: 'gif', content: 'caminho/para/o/seu/gif/da/letra/f.gif' }
];

// Função para embaralhar o array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Cria as cartas no HTML
function createCards() {
    const shuffledCards = shuffle([...cardData]); // Cria uma cópia e embaralha

    gameContainer.innerHTML = '';
    cards = [];
    matchedPairs = 0;
    flippedCards = [];
    lockBoard = false;

    shuffledCards.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = item.content;
        card.dataset.type = item.type;
        card.addEventListener('click', flipCard);

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');
        if (item.type === 'letter') {
            cardFront.textContent = item.content;
        } else if (item.type === 'gif') {
            const img = document.createElement('img');
            img.src = item.content;
            cardFront.appendChild(img);
        }

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');
        cardBack.textContent = '?';

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        gameContainer.appendChild(card);
        cards.push(card);
    });
}

// Lógica de virar a carta
function flipCard() {
    if (lockBoard) return;
    if (this === flippedCards[0]) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        lockBoard = true;
        checkForMatch();
    }
}

// Verifica se as cartas combinam
function checkForMatch() {
    const [card1, card2] = flippedCards;
    const value1 = card1.dataset.value;
    const value2 = card2.dataset.value;

    const isMatch = (card1.dataset.type !== card2.dataset.type) && (value1.replace(/^(.*\/([a-z])\..*)$/i, '$2').toLowerCase() === value2.toLowerCase() || value2.replace(/^(.*\/([a-z])\..*)$/i, '$2').toLowerCase() === value1.toLowerCase());
    
    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

// Desabilita as cartas que formam um par
function disableCards() {
    const [card1, card2] = flippedCards;
    card1.removeEventListener('click', flipCard);
    card2.removeEventListener('click', flipCard);
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;
    
    resetBoard();
    
    if (matchedPairs === cardData.length / 2) {
        setTimeout(() => alert('Parabéns! Você venceu o jogo!'), 500);
    }
}

// Desvira as cartas que não combinam
function unflipCards() {
    setTimeout(() => {
        flippedCards.forEach(card => card.classList.remove('flipped'));
        resetBoard();
    }, 1000);
}

// Reseta o estado do jogo
function resetBoard() {
    [flippedCards, lockBoard] = [[], false];
}

// Função para reiniciar o jogo
function restartGame() {
    createCards();
}

// Inicia o jogo
createCards();