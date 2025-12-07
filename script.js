const card = document.getElementById('card');
let isFlipped = false;
let tiltEnabled = true;

// Device orientation tilt effect for mobile
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation, true);
}

function handleOrientation(event) {
    // Disabled
}



// Random back messages
const backMessages = [
    'Founder @ Loyal9 LLC<br><span class="tagline-separator">|</span><br>Open-Source code — We Pass Them Left,<br>Then Watch the Industry Blink.',
    'I turn chaos into revenue.',
    'Currently building Loyal9<br>— one middle finger at a time.',
    '90s R&B + motorcycles + ramen<br>= default personality',
    'If it doesn\'t scale,<br>it doesn\'t exist.',
    'Available for the right kind of trouble.'
];

let flipCount = parseInt(localStorage.getItem('flipCount') || '0');
let messageIndex = 0;

function updateBackMessage() {
    const tagline = document.querySelector('.tagline-full');
    if (tagline) {
        messageIndex = (messageIndex + 1) % backMessages.length;
        tagline.innerHTML = backMessages[messageIndex];
    }
}

// Time-of-day background
function updateBackground() {
    const hour = new Date().getHours();
    document.body.classList.remove('golden', 'night', 'space');
    if (hour >= 20 || hour < 6) document.body.classList.add('night');
    else if (hour >= 17) document.body.classList.add('golden');
}
updateBackground();
setInterval(updateBackground, 60000);

// Flip card on click/tap with counter
card.addEventListener('click', () => {
    isFlipped = !isFlipped;
    
    if (isFlipped) {
        card.classList.add('flipped');
    } else {
        card.classList.remove('flipped');
        flipCount++;
        localStorage.setItem('flipCount', flipCount);
        updateBackMessage();
        
        if (flipCount >= 3) {
            const counter = document.getElementById('flipCounter');
            if (counter) {
                counter.textContent = `${flipCount} flips 🔥`;
                counter.classList.add('show');
            }
            
            if (flipCount === 10 || flipCount === 25 || flipCount === 50) {
                createConfetti();
            }
        }
    }
});

// Simple confetti effect
function createConfetti() {
    const colors = ['#04AA6D', '#ffffff', '#667eea'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.animation = `fall ${2 + Math.random() * 2}s linear forwards`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
}

// Add fall animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Shake detection for mobile
let lastX, lastY, lastZ;
let shakeThreshold = 15;
window.addEventListener('devicemotion', (e) => {
    if (!e.accelerationIncludingGravity) return;
    
    const { x, y, z } = e.accelerationIncludingGravity;
    
    if (lastX !== undefined) {
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);
        
        if (deltaX > shakeThreshold || deltaY > shakeThreshold || deltaZ > shakeThreshold) {
            card.classList.add('shake');
            setTimeout(() => card.classList.remove('shake'), 500);
            updateBackMessage();
        }
    }
    
    lastX = x;
    lastY = y;
    lastZ = z;
});

// Contact data
const contactData = {
    name: "Shannon Goddard",
    phone: "+19097089759",
    email: "shannon@loyal9.app",
    org: "Loyal9 LLC"
};

// Add to Contacts
document.getElementById('addContact').addEventListener('click', () => {
    const vcf = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "N:Goddard;Shannon;;;",
        "FN:Shannon Goddard",
        "ORG:" + contactData.org,
        "TITLE:Founder",
        "TEL;TYPE=CELL:" + contactData.phone,
        "EMAIL:" + contactData.email,
        "END:VCARD"
    ].join("\r\n");
    
    const blob = new Blob([vcf], {type: "text/vcard"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Shannon-Goddard.vcf";
    a.click();
    URL.revokeObjectURL(url);
});

// Share Contact
document.getElementById('shareBtn').addEventListener('click', async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: "Shannon Goddard – Loyal9 LLC",
                text: "Here's my contact – Join the chaos!",
                url: window.location.href
            });
        } catch (err) {
            console.log('Share cancelled');
        }
    } else {
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        alert('Link copied to clipboard!');
    }
});

// GitHub
document.getElementById('githubBtn').addEventListener('click', () => {
    window.open('https://github.com/Shannon-Goddard', '_blank');
});

// LinkedIn
document.getElementById('linkedinBtn').addEventListener('click', () => {
    window.open('https://www.linkedin.com/in/shannon-goddard', '_blank');
});

// Performance optimization: reduce motion if preferred
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    card.style.transition = 'none';
}
