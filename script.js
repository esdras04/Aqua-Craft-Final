// ===== Game State Variables =====
let score = 0;
let currentTool = null;
let difficulty = 'easy';
let rhythmSpeed = 2;
let clearedContaminants = new Set();
let perfectPoints = 25;
let goodPoints = 12.5;

// ===== DOM Elements =====
const tools = document.querySelectorAll('.tool');
const dropZone = document.getElementById('dropZone');
const rhythmBarContainer = document.getElementById('rhythmBarContainer');
const overlay = document.getElementById('overlay');
const rhythmButton = document.getElementById('rhythmButton');
const rhythmIndicator = document.getElementById('rhythmIndicator');
const feedback = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score');
const contaminationList = document.getElementById('contaminationList');
const difficultyModal = document.getElementById('difficultyModal');
const difficultyBadge = document.getElementById('difficultyBadge');
const journalContent = document.getElementById('journalContent');

// ===== Game Data =====
const toolEffects = {
    boiling: { 
        targets: ['🦠 Bacteria', '🧫 Viruses'], 
        description: 'Kills bacteria and viruses through sustained heat treatment at 100°C for 1-3 minutes.' 
    },
    filter: { 
        targets: ['🪨 Sediment'], 
        description: 'Removes sediment and particles using activated carbon filtration technology.' 
    },
    chlorine: { 
        targets: ['🦠 Bacteria', '🧫 Viruses'], 
        description: 'Disinfects water by releasing hypochlorous acid that destroys microorganisms.' 
    },
    uv: { 
        targets: ['🦠 Bacteria', '🧫 Viruses'], 
        description: 'Uses ultraviolet light radiation to neutralize pathogens without chemicals.' 
    },
    sediment: { 
        targets: ['🪨 Sediment'], 
        description: 'Specialized physical filtration system for removing suspended particles.' 
    },
    reverse: { 
        targets: ['🧪 Chemicals', '🦠 Bacteria', '🧫 Viruses', '🪨 Sediment'], 
        description: 'Advanced multi-stage filtration using semipermeable membrane to remove all contaminants.' 
    }
};

const contaminants = {
    easy: ['🦠 Bacteria', '🪨 Sediment'],
    medium: ['🦠 Bacteria', '🧫 Viruses', '🪨 Sediment'],
    hard: ['🦠 Bacteria', '🧫 Viruses', '🪨 Sediment', '🧪 Chemicals']
};

const difficultySettings = {
    easy: { speed: 2.5, badge: 'Apprentice', color: '#6b9f78' },
    medium: { speed: 1.5, badge: 'Chemist', color: '#d4a056' },
    hard: { speed: 0.9, badge: 'Master', color: '#c85a54' }
};

// ===== Initialization Functions =====
function initializeJournal() {
    journalContent.innerHTML = '';
    Object.keys(toolEffects).forEach(tool => {
        const entry = document.createElement('div');
        entry.className = 'journal-entry';
        entry.innerHTML = `<strong>${tool}</strong>${toolEffects[tool].description}`;
        entry.id = `journal-${tool}`;
        journalContent.appendChild(entry);
    });
}

function initializeContaminants() {
    clearedContaminants.clear();
    contaminationList.innerHTML = '';
    contaminants[difficulty].forEach(contaminant => {
        const li = document.createElement('li');
        li.textContent = contaminant;
        li.id = `contaminant-${contaminant}`;
        contaminationList.appendChild(li);
    });
}

function calculatePoints() {
    const numContaminants = contaminants[difficulty].length;
    perfectPoints = 100 / numContaminants;
    goodPoints = perfectPoints / 2;
}

// ===== Difficulty Selection =====
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        difficulty = e.target.closest('.difficulty-btn').dataset.difficulty;
        rhythmSpeed = difficultySettings[difficulty].speed;
        difficultyBadge.textContent = difficultySettings[difficulty].badge;
        difficultyBadge.style.color = difficultySettings[difficulty].color;
        difficultyModal.classList.add('hidden');
        initializeContaminants();
        initializeJournal();
        calculatePoints();
    });
});

// ===== Drag and Drop Functionality =====
tools.forEach(tool => {
    tool.addEventListener('dragstart', (e) => {
        currentTool = e.target.closest('.tool').dataset.tool;
        e.dataTransfer.effectAllowed = 'move';
        
        // Create custom drag image
        const dragImage = document.createElement('div');
        dragImage.style.width = '70px';
        dragImage.style.height = '70px';
        dragImage.style.background = 'linear-gradient(135deg, #2c8ba0 0%, #1a5f7a 100%)';
        dragImage.style.borderRadius = '12px';
        dragImage.style.fontSize = '2.5rem';
        dragImage.style.display = 'flex';
        dragImage.style.alignItems = 'center';
        dragImage.style.justifyContent = 'center';
        dragImage.style.position = 'fixed';
        dragImage.style.top = '-1000px';
        dragImage.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        
        const icon = e.target.closest('.tool').querySelector('.tool-icon');
        dragImage.textContent = icon.textContent;
        document.body.appendChild(dragImage);
        
        e.dataTransfer.setDragImage(dragImage, 35, 35);
        
        setTimeout(() => document.body.removeChild(dragImage), 0);
        
        tool.classList.add('dragging');
    });

    tool.addEventListener('dragend', () => {
        tool.classList.remove('dragging');
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

// ===== Rhythm Game =====
function startRhythmGame() {
    rhythmBarContainer.classList.add('active');
    overlay.classList.add('active');
    feedback.textContent = '';
    feedback.className = 'feedback';
    
    // Reset and start animation
    rhythmIndicator.style.animation = 'none';
    setTimeout(() => {
        rhythmIndicator.style.animation = `slideRhythm ${rhythmSpeed}s linear infinite`;
    }, 10);
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

    // Check if in green zone (center third)
    if (position >= 0.33 && position <= 0.67) {
        // Perfect zone (center 40-60%)
        if (position >= 0.40 && position <= 0.60) {
            feedbackClass = 'perfect';
        } else {
            feedbackClass = 'good';
        }
    } else {
        feedbackClass = 'miss';
    }

    // Apply tool effects
    if (feedbackClass !== 'miss' && currentTool) {
        const clearedCount = applyToolEffect(currentTool);
        markJournalEntry(currentTool);
        
        // Calculate points based on cleared contaminants
        if (feedbackClass === 'perfect') {
            points = perfectPoints * clearedCount;
            message = `⚗️ Perfect Application! Cleared ${clearedCount} contaminant${clearedCount > 1 ? 's' : ''}! +${Math.round(points)} points`;
        } else {
            points = goodPoints * clearedCount;
            message = `🧪 Good Work! Cleared ${clearedCount} contaminant${clearedCount > 1 ? 's' : ''}! +${Math.round(points)} points`;
        }
    } else if (feedbackClass === 'miss') {
        message = '✗ Missed the optimal zone! Treatment failed. +0 points';
    }

    // Update score
    score += points;
    const newScore = Math.min(score, 100);
    scoreDisplay.textContent = Math.round(newScore);
    
    // Check for game completion
    if (newScore === 100 && score - points < 100) {
        triggerConfetti();
        setTimeout(() => {
            showCompletionMessage();
        }, 1000);
    }
    
    feedback.textContent = message;
    feedback.className = `feedback ${feedbackClass}`;

    setTimeout(() => {
        closeRhythmGame();
    }, 2000);
}

function applyToolEffect(tool) {
    const targets = toolEffects[tool].targets;
    let clearedCount = 0;
    
    targets.forEach(target => {
        if (!clearedContaminants.has(target)) {
            clearedContaminants.add(target);
            clearedCount++;
            const li = document.getElementById(`contaminant-${target}`);
            if (li) {
                li.classList.add('cleared');
            }
        }
    });
    
    return clearedCount;
}

function markJournalEntry(tool) {
    const entry = document.getElementById(`journal-${tool}`);
    if (entry) {
        entry.classList.add('used');
    }
}

function closeRhythmGame() {
    rhythmBarContainer.classList.remove('active');
    overlay.classList.remove('active');
    currentTool = null;
}

function showCompletionMessage() {
    const completionDiv = document.createElement('div');
    completionDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 40px;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        z-index: 2000;
        text-align: center;
        border: 3px solid #6b9f78;
        max-width: 500px;
    `;
    
    completionDiv.innerHTML = `
        <h2 style="color: #2c5f6f; margin-bottom: 15px; font-size: 2rem;">🎉 Water Purified!</h2>
        <p style="color: #5a8a9a; font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px;">
            Excellent work, chemist! You've successfully purified the water sample. 
            In real-world situations, access to clean water saves lives every day.
        </p>
        <button onclick="location.reload()" style="
            padding: 15px 30px;
            background: linear-gradient(135deg, #2c8ba0 0%, #1a5f7a 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        ">Try Another Sample</button>
    `;
    
    document.body.appendChild(completionDiv);
    overlay.classList.add('active');
}

// ===== Keyboard Support =====
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && rhythmBarContainer.classList.contains('active')) {
        e.preventDefault();
        checkRhythm();
    }
});

// ===== Confetti Effect =====
function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2c8ba0', '#6b9f78', '#d4a056']
    });
    
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#2c8ba0', '#6b9f78', '#d4a056']
        });
    }, 250);
    
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#2c8ba0', '#6b9f78', '#d4a056']
        });
    }, 400);
}

// ===== Initialize Game =====
initializeJournal();