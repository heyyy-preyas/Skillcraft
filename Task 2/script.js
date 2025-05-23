let startTime = 0;
let elapsed = 0;
let timerInterval = null;
let running = false;
let laps = [];

const display = document.getElementById('display');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsList = document.getElementById('laps');

// Sound effect for lap times
const lapSound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return (
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0') + '.' +
        String(centiseconds).padStart(2, '0')
    );
}

function updateDisplay() {
    display.textContent = formatTime(elapsed);
}

function start() {
    if (!running) {
        startTime = performance.now() - elapsed;
        timerInterval = setInterval(() => {
            elapsed = performance.now() - startTime;
            updateDisplay();
        }, 10);
        running = true;
        startPauseBtn.textContent = 'Pause';
        resetBtn.disabled = false;
        lapBtn.disabled = false;
    }
}

function pause() {
    if (running) {
        clearInterval(timerInterval);
        running = false;
        startPauseBtn.textContent = 'Start';
        lapBtn.disabled = false;
    }
}

function reset() {
    clearInterval(timerInterval);
    running = false;
    elapsed = 0;
    updateDisplay();
    startPauseBtn.textContent = 'Start';
    resetBtn.disabled = true;
    lapBtn.disabled = true;
    laps = [];
    renderLaps();
}

function lap() {
    if (!resetBtn.disabled) {
        laps.unshift(elapsed);
        renderLaps();
        lapSound.play().catch(e => console.error('Error playing sound:', e));
    }
}

function renderLaps() {
    lapsList.innerHTML = '';
    laps.forEach((lapTime, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>Lap ${laps.length - idx}</span> <span>${formatTime(lapTime)}</span>`;
        lapsList.appendChild(li);
    });
}

startPauseBtn.addEventListener('click', () => {
    if (running) {
        pause();
    } else {
        start();
    }
});

resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lap);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (running) {
            pause();
        } else {
            start();
        }
    } else if (e.code === 'KeyL' && !resetBtn.disabled) {
        lap();
    } else if (e.code === 'KeyR' && !resetBtn.disabled) {
        reset();
    }
});

// Initialize
updateDisplay(); 