let score = 0;
let currentTool = null;

const tools = document.querySelectorAll('.tool');
const dropZone = document.getElementById('dropZone');
const rhythmBarContainer = document.getElementById('rhythmBarContainer');
const overlay = document.getElementById('overlay');
const rhythmButton = document.getElementById('rhythmButton');
const rhythmIndicator = document.getElementById('rhythmIndicator');
const feedback = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score');

// Drag and Drop
tools.forEach(tool => {
    tool.addEventListener('dragstart', (e) => {
        currentTool = e.target.dataset.tool;
        e.dataTransfer.effectAllowed = 'move';
    });
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('active');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('active');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('active');
    
    if (currentTool) {
        startRhythmGame();
    }
});

// Rhythm Game
function startRhythmGame() {
    rhythmBarContainer.classList.add('active');
    overlay.classList.add('active');
    feedback.textContent = '';
    feedback.className = 'feedback';
}

rhythmButton.addEventListener('click', () => {
    checkRhythm();
});

function checkRhythm() {
    const indicator = rhythmIndicator.getBoundingClientRect();
    const bar = rhythmIndicator.parentElement.getBoundingClientRect();
    
    const position = (indicator.left - bar.left) / bar.width;
    
    let points = 0;
    let message = '';
    let feedbackClass = '';

    // Green zone is in the middle (33% - 67%)
    if (position >= 0.33 && position <= 0.67) {
        // Perfect zone (center 40-60%)
        if (position >= 0.40 && position <= 0.60) {
            points = 20;
            message = '🎯 PERFECT! +20 points';
            feedbackClass = 'perfect';
        } else {
            points = 10;
            message = '✓ Good! +10 points';
            feedbackClass = 'good';
        }
    } else {
        points = 0;
        message = '✗ Missed! +0 points';
        feedbackClass = 'miss';
    }

    score += points;
    const neweScore = scoreDisplay.textContent = Math.min(score, 100);
    if (neweScore==100  && score - points < 100){
        triggerConfetti();
    }
    
    feedback.textContent = message;
    feedback.className = `feedback ${feedbackClass}`;

    setTimeout(() => {
        closeRhythmGame();
    }, 1500);
}

function closeRhythmGame() {
    rhythmBarContainer.classList.remove('active');
    overlay.classList.remove('active');
    currentTool = null;
}

// Touch support for mobile
tools.forEach(tool => {
    tool.addEventListener('touchstart', (e) => {
        currentTool = e.target.closest('.tool').dataset.tool;
    });
});

dropZone.addEventListener('touchend', (e) => {
    if (currentTool) {
        startRhythmGame();
    }
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && rhythmBarContainer.classList.contains('active')) {
        e.preventDefault();
        checkRhythm();
    }
});
function triggerConfetti() {
    // First burst
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
    
    // Second burst after a delay
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
    }, 250);
    
    // Third burst
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
    }, 400);
}