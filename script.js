document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.querySelector('.game-board');
    const winScreen = document.getElementById('win-screen');
    const restartButton = document.getElementById('restart-button');
    const gameContainer = document.querySelector('.game-container');

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const gifLetters = ['H', 'J', 'K', 'X', 'Z'];

    let flippedCards = [];
    let lockBoard = false;
    let matchedPairs = 0;

    function createCards() {
        const gameCards = alphabet.flatMap(letter => {
            const isGif = gifLetters.includes(letter);
            const fileExtension = isGif ? 'gif' : 'png';
            
            return [
                { type: 'letter', value: letter, content: letter },
                { type: 'media', value: letter, content: `media/${letter.toLowerCase()}.${fileExtension}` }
            ];
        });

        shuffle(gameCards);
        gameCards.forEach(cardData => {
            const cardElement = createCardElement(cardData);
            gameBoard.appendChild(cardElement);
        });
    }

    function createCardElement(cardData) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = cardData.value; // Usa o 'value' para a comparação

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');

        if (cardData.type === 'letter') {
            cardFront.textContent = cardData.content;
        } else {
            const media = document.createElement('img');
            media.src = cardData.content;
            media.alt = `Sinal de Libras para a letra ${cardData.value}`;
            cardFront.appendChild(media);
        }

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');

        card.appendChild(cardFront);
        card.appendChild(cardBack);

        card.addEventListener('click', () => flipCard(card));
        return card;
    }

    function flipCard(card) {
        if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            lockBoard = true;
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.value === card2.dataset.value;

        if (isMatch) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    function disableCards() {
    flippedCards.forEach(card => card.classList.add('matched'));
    matchedPairs++;

    if (matchedPairs === alphabet.length) {
        setTimeout(() => showWinScreen(), 500);
    }

    resetBoard();
}

    function unflipCards() {
        setTimeout(() => {
            flippedCards.forEach(card => card.classList.remove('flipped'));
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [flippedCards, lockBoard] = [[], false];
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showWinScreen() {
        gameContainer.style.display = 'none'; // Esconde o tabuleiro
        winScreen.classList.remove('hidden'); // Exibe a tela de vitória
    }

    function restartGame() {
        gameBoard.innerHTML = ''; // Limpa o tabuleiro
        matchedPairs = 0;
        winScreen.classList.add('hidden'); // Esconde a tela de vitória
        gameContainer.style.display = 'flex'; // Exibe o tabuleiro novamente
        createCards(); // Cria um novo jogo
    }

    restartButton.addEventListener('click', restartGame);

    // Inicia o jogo
    createCards();
});