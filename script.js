document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.querySelector('.game-board');

    // Alfabeto completo
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    // Letras que serão GIFs
    const gifLetters = ['H', 'J', 'K', 'X', 'Z'];

    // Crie as cartas para cada letra do alfabeto
    const gameCards = alphabet.flatMap(letter => {
        // Verifica se a letra atual está na lista de GIFs
        const isGif = gifLetters.includes(letter);
        const fileExtension = isGif ? 'gif' : 'png'; // Use .gif ou .png
        
        return [
            { type: 'letter', content: letter },
            { type: 'media', content: `media/${letter.toLowerCase()}.${fileExtension}` }
        ];
    });

    // Função para embaralhar as cartas
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffle(gameCards);

    let flippedCards = [];
    let lockBoard = false;
    let matchedPairs = 0;

    function createCard(cardData) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = cardData.type === 'letter' ? cardData.content : cardData.content.charAt(6); // Pega a letra do nome do arquivo (ex: 'media/a.png')

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');

        if (cardData.type === 'letter') {
            cardFront.textContent = cardData.content;
        } else {
            const media = document.createElement('img');
            media.src = cardData.content;
            media.alt = `Sinal de Libras para a letra ${cardData.content.charAt(6)}`;
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
        flippedCards.forEach(card => {
            card.classList.add('matched');
        });

        matchedPairs++;
        if (matchedPairs === gameCards.length / 2) {
            setTimeout(() => alert('Parabéns! Você venceu o jogo!'), 500);
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

    // Inicializa o jogo
    gameCards.forEach(cardData => {
        const cardElement = createCard(cardData);
        gameBoard.appendChild(cardElement);
    });
});