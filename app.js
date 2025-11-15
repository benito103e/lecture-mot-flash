const wordInput = document.getElementById('wordInput');
const checkboxContainer = document.getElementById('checkboxContainer');
const loadingStatus = document.getElementById('loadingStatus');
const speedRange = document.getElementById('speedRange');
const speedValue = document.getElementById('speedValue');
const startBtn = document.getElementById('startBtn');
const setupScreen = document.querySelector('.setup-screen');
const readingScreen = document.querySelector('.reading-screen');
const wordDisplay = document.getElementById('wordDisplay');
const progress = document.getElementById('progress');
const nextBtn = document.getElementById('nextBtn');
const stopBtn = document.getElementById('stopBtn');

let words = [];
let currentIndex = 0;
let displayTime = 2;
let timer = null;

// Écouter les changements sur les checkboxes
checkboxContainer.addEventListener('change', async (e) => {
    if (e.target.type === 'checkbox') {
        await loadSelectedLists();
    }
});

async function loadSelectedLists() {
    const checkboxes = checkboxContainer.querySelectorAll('input[type="checkbox"]:checked');
    const selectedLists = Array.from(checkboxes).map(cb => cb.value);
    loadingStatus.style.display = 'block';
    loadingStatus.textContent = 'Chargement des listes...';

    let allWords = [];
    for (const selectedList of selectedLists) {
        allWords = allWords.concat(lists[selectedList]);
    }
    allWords = [...new Set(allWords)];
    wordInput.value = allWords.join('\n');

    loadingStatus.textContent = `✓ ${allWords.length} mots chargés`;
    setTimeout(() => {loadingStatus.style.display = 'none';}, 2000);
}

speedRange.addEventListener('input', (e) => {
    speedValue.textContent = e.target.value;
});

startBtn.addEventListener('click', () => {
    const text = wordInput.value.trim();
    words = text.split('\n').map(w => w.trim()).filter(w => w);

    if (0 === words.length) {
        alert('Veuillez entrer au moins un mot');
        return;
    }

    words = words.sort(() => Math.random() - 0.5);

    displayTime = parseInt(speedRange.value) * 1000;
    currentIndex = 0;

    setupScreen.classList.remove('active');
    readingScreen.classList.add('active');

    showNextWord();
});

nextBtn.addEventListener('click', () => {
    if (timer) {
        clearTimeout(timer);
    }
    showNextWord();
});

stopBtn.addEventListener('click', () => {
    if (timer) {
        clearTimeout(timer);
    }
    resetApp();
});

function showNextWord() {
    if (currentIndex >= words.length) {
        showCompletion();
        return;
    }

    wordDisplay.textContent = words[currentIndex];
    progress.textContent = `Mot ${currentIndex + 1} / ${words.length}`;

    timer = setTimeout(() => {
        wordDisplay.textContent = '';
    }, displayTime);

    currentIndex++;
}

function showCompletion() {
    readingScreen.innerHTML = `
                <div class="completion-message">
                    <h2>🦄 Bravo !</h2>
                    <p>Vous avez terminé tous les mots</p>
                    <button class="btn-start" onclick="location.reload()">Recommencer</button>
                </div>
            `;
}

function resetApp() {
    if (timer) {
        clearTimeout(timer);
    }
    readingScreen.classList.remove('active');
    setupScreen.classList.add('active');
    wordDisplay.textContent = '';
    currentIndex = 0;
}