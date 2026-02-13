// Prevent spacebar from scrolling the page
window.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.code === 'Space') {
        // Don't prevent space in input or textarea fields
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    }
});

// Terminal typing animation
const terminalText = document.getElementById('terminal-text');
const scrollBtn = document.getElementById('scroll-btn');

// Lines with color markup: {label: 'text', value: 'text'} for two-color, or just string for single color
const lines = [
    '> establishing connection...',
    '> handshake successful',
    '',
    { label: '> from:', value: ' Saint Petersburg, RU' },
    { label: '> to:', value: ' Bakı, AZ' },
    { label: '> distance:', value: ' 2482 km' },
    { label: '> latency:', value: ' 0ms' },
    '',
    // { label: '> uptime:', value: ' [calculating...]' },
    // { label: '> connection_strength:', value: ' infinite' },
    { label: '> status:', value: ' deeply in sync ♥' }
];

let lineIndex = 0;
let charIndex = 0;
let currentLine = '';

function typeWriter() {
    if (lineIndex < lines.length) {
        const line = lines[lineIndex];
        const isColoredLine = typeof line === 'object';

        if (isColoredLine) {
            const fullText = line.label + line.value;

            if (charIndex < fullText.length) {
                currentLine += fullText.charAt(charIndex);
                terminalText.innerHTML = getAllLines() + '<span class="cursor"></span>';
                charIndex++;
                setTimeout(typeWriter, 100);
            } else {
                lineIndex++;
                charIndex = 0;
                currentLine = '';
                setTimeout(typeWriter, 1000);
            }
        } else {
            if (charIndex < line.length) {
                currentLine += line.charAt(charIndex);
                terminalText.innerHTML = getAllLines() + '<span class="cursor"></span>';
                charIndex++;
                setTimeout(typeWriter, 50);
            } else {
                lineIndex++;
                charIndex = 0;
                currentLine = '';
                setTimeout(typeWriter, 250);
            }
        }
    } else {
        // Typing complete - show scroll button
        scrollBtn.style.opacity = '1';
    }
}

function getAllLines() {
    let result = '';

    for (let i = 0; i < lineIndex; i++) {
        const line = lines[i];
        if (typeof line === 'object') {
            result += `<span class="terminal-label">${line.label}</span><span class="terminal-value">${line.value}</span>\n`;
        } else {
            result += line + '\n';
        }
    }

    // Current line being typed
    const currentLineData = lines[lineIndex];
    if (currentLineData) {
        if (typeof currentLineData === 'object') {
            const fullText = currentLineData.label + currentLineData.value;
            const labelLength = currentLineData.label.length;

            if (currentLine.length <= labelLength) {
                result += `<span class="terminal-label">${currentLine}</span>`;
            } else {
                result += `<span class="terminal-label">${currentLineData.label}</span><span class="terminal-value">${currentLine.substring(labelLength)}</span>`;
            }
        } else {
            result += currentLine;
        }
    }

    return result;
}

// Start typing animation when page loads
window.addEventListener('load', () => {
    setTimeout(typeWriter, 500);
});

// Scroll button functionality
scrollBtn.addEventListener('click', () => {
    document.getElementById('timeline').scrollIntoView({ behavior: 'smooth' });
});

// Scroll reveal for timeline items
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

const timelineItems = document.querySelectorAll('[data-reveal]');
timelineItems.forEach(item => observer.observe(item));

// Interactive hold button
const holdBtn = document.getElementById('hold-btn');
const hugText = document.getElementById('hug-text');
const heartPulse = document.querySelector('.heart-pulse');
const interactiveSection = document.getElementById('interactive');

let holdTimer;

holdBtn.addEventListener('mousedown', startHolding);
holdBtn.addEventListener('touchstart', startHolding);
holdBtn.addEventListener('mouseup', stopHolding);
holdBtn.addEventListener('mouseleave', stopHolding);
holdBtn.addEventListener('touchend', stopHolding);

function startHolding(e) {
    e.preventDefault();
    holdBtn.classList.add('holding');
    interactiveSection.classList.add('holding');

    holdTimer = setTimeout(() => {
        hugText.classList.add('visible');
        heartPulse.classList.add('active');
    }, 200);
}

function stopHolding() {
    holdBtn.classList.remove('holding');
    interactiveSection.classList.remove('holding');
    hugText.classList.remove('visible');
    heartPulse.classList.remove('active');
    clearTimeout(holdTimer);
}

// Countdown timer
function updateCountdown() {
    // Set your next meeting date here (example: March 14, 2026)
    const nextMeeting = new Date('2026-03-14T00:00:00').getTime();
    const now = new Date().getTime();
    const distance = nextMeeting - now;

    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<div class="countdown-item"><span class="countdown-value">♥</span><span class="countdown-unit">together</span></div>';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerHTML = `
        <div class="countdown-item">
            <span class="countdown-value">${days}</span>
            <span class="countdown-unit">days</span>
        </div>
        <div class="countdown-item">
            <span class="countdown-value">${hours}</span>
            <span class="countdown-unit">hours</span>
        </div>
        <div class="countdown-item">
            <span class="countdown-value">${minutes}</span>
            <span class="countdown-unit">minutes</span>
        </div>
        <div class="countdown-item">
            <span class="countdown-value">${seconds}</span>
            <span class="countdown-unit">seconds</span>
        </div>
    `;
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Easter Egg - Secret Command
const secretCommand = 'npm install forever';
let typedKeys = '';
let isUnlocked = false;

const typedTextInput = document.getElementById('typed-text-input');
const typedTextMirror = document.getElementById('typed-text-mirror');
const promptCursor = document.getElementById('prompt-cursor');
const lockIcon = document.getElementById('lock-icon');
const secretMessage = document.getElementById('secret-message');
const hint = document.getElementById('hint');

// Function to update cursor position
function updateCursorPosition() {
    typedTextMirror.textContent = typedTextInput.value;
    const textWidth = typedTextMirror.offsetWidth;
    promptCursor.style.left = textWidth + 'px';
}

// Handle input from the text field (works for both mobile and desktop)
typedTextInput.addEventListener('input', (e) => {
    if (isUnlocked) return;
    
    typedKeys = e.target.value;
    updateCursorPosition();
    
    // Check if the typed text matches the secret command
    if (typedKeys.toLowerCase() === secretCommand.toLowerCase()) {
        unlockSecret();
    }
});

// Auto-focus the input when the easter egg section becomes visible
const easterEggObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !isUnlocked) {
            // Small delay to ensure smooth scrolling
            setTimeout(() => {
                typedTextInput.focus();
            }, 500);
        }
    });
}, { threshold: 0.5 });

const easterEggSection = document.getElementById('easter-egg');
easterEggObserver.observe(easterEggSection);

// Also allow clicking on the terminal prompt area to focus
document.getElementById('terminal-prompt').addEventListener('click', () => {
    if (!isUnlocked) {
        typedTextInput.focus();
    }
});

// Keep global keydown for desktop users who want to type without focusing
document.addEventListener('keydown', (e) => {
    // Only track when easter egg section is visible
    const rect = easterEggSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

    if (!isVisible || isUnlocked) return;
    
    // Don't interfere if the input is already focused
    if (document.activeElement === typedTextInput) return;

    // Handle backspace
    if (e.key === 'Backspace') {
        typedKeys = typedKeys.slice(0, -1);
        typedTextInput.value = typedKeys;
        updateCursorPosition();
        return;
    }

    // Only accept letters, numbers, and space
    if (e.key.length === 1) {
        typedKeys += e.key;
        typedTextInput.value = typedKeys;
        updateCursorPosition();

        // Check if the typed text matches the secret command
        if (typedKeys.toLowerCase() === secretCommand.toLowerCase()) {
            unlockSecret();
        }
    }
});

function unlockSecret() {
    isUnlocked = true;
    lockIcon.classList.add('unlocked');

    setTimeout(() => {
        secretMessage.classList.add('revealed');
        hint.classList.add('hidden');
    }, 600);
}
