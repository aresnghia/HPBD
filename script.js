// ================= CẤU HÌNH THÔNG TIN NGƯỜI NHẬN =================
const CONFIG = {
    recipientName: "Khánh Linh 🍅🌙",                  // Tên hiển thị ở Màn 2
    recipientTag: "🎂 BIRTHDAY GIRL",          // Huy hiệu dưới Avatar
    birthDate: "2005-11-21T00:00:00",          // Ngày sinh (YYYY-MM-DD)
    wishMessage: "Tui không nghĩ là hôm nay tui sẽ đến sinh nhật bà đâu vì đơn giản là tui cảm thấy very shy, nên là sorry vì món quà chậm trễ, tui chỉ dự định cái kia thôi :)). Anyway, chúc mừng sinh nhật, tuổi mới mong bà sẽ luôn vui vẻ, xinh đẹp, học hành thuận lợi, và sớm đạt được những mục tiêu mà bà đề ra. Hi vọng bà có thể tạm bỏ qua những gì trước đó trong hôm mà có thể nhận món quà nhỏ một cách vui vẻ... 🌷✨",
    senderSign: "— From TrNghia",

    memories: [
        { src: "./assets/linh1.jpg", caption: "Nụ cười tỏa nắng ✨" },
        { src: "./assets/linh2.jpg", caption: "Tuổi mới rực rỡ 🎂" },
        { src: "./assets/linh3.jpg", caption: "Luôn hạnh phúc nhé 💖" },
        { src: "./assets/linh4.jpg", caption: "Happy Birthday 🎉" }
    ]
};

// Gán dữ liệu từ CONFIG vào giao diện
document.getElementById('recipientName').textContent = CONFIG.recipientName;
document.getElementById('recipientTag').textContent = CONFIG.recipientTag;
document.getElementById('senderSign').textContent = CONFIG.senderSign;

// ================= 1. DÂY CHUYỀN ẢNH & LIGHTBOX =================
const photoTrack = document.getElementById('photoTrack');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCap = document.getElementById('lightboxCap');

if (photoTrack && CONFIG.memories.length > 0) {
    const loopList = [...CONFIG.memories, ...CONFIG.memories];

    photoTrack.innerHTML = loopList.map(item => `
    <div class="polaroid" data-src="${item.src}" data-cap="${item.caption}">
      <img class="polaroid__img" src="${item.src}" alt="${item.caption}">
      <div class="polaroid__cap">${item.caption}</div>
    </div>
  `).join('');

    photoTrack.querySelectorAll('.polaroid').forEach(card => {
        card.addEventListener('click', () => {
            launchConfetti(40);
            lightboxImg.src = card.dataset.src;
            lightboxCap.textContent = card.dataset.cap;
            lightbox.classList.add('open');
        });
    });
}

lightbox.addEventListener('click', () => {
    lightbox.classList.remove('open');
});

// ================= 2. NHẠC NỀN =================
const bgMusic = document.getElementById('bgMusic');
const musicToggleBtn = document.getElementById('musicToggleBtn');
let isPlaying = false;

function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicToggleBtn.classList.remove('playing');
        musicToggleBtn.querySelector('.musicText').textContent = 'Bật nhạc';
        isPlaying = false;
    } else {
        bgMusic.play().then(() => {
            musicToggleBtn.classList.add('playing');
            musicToggleBtn.querySelector('.musicText').textContent = 'Tắt nhạc';
            isPlaying = true;
        }).catch(e => console.log("Trình duyệt chờ tương tác để phát nhạc:", e));
    }
}

musicToggleBtn.addEventListener('click', toggleMusic);

// ================= 3. CHUYỂN MÀN HÌNH =================
// screens[0] = screen-0 (mật khẩu)
// screens[1] = screen-1 (nến)
// screens[2] = screen-2 (profile)
// screens[3] = screen-3 (lời chúc)
const screens = document.querySelectorAll('.screen');
const dots = document.querySelectorAll('.dotBtn');
const stepDotsEl = document.getElementById('stepDots');
const flame = document.getElementById('flame');
const smoke = document.getElementById('smoke');
let typingTimer = null;

function goToScreen(stepNumber) {
    const step = Number(stepNumber);

    // Hiển thị/ẩn dot navigation (ẩn ở màn 0)
    stepDotsEl.classList.toggle('hidden', step === 0);

    // Chuyển màn hình
    screens.forEach((sc, idx) => sc.classList.toggle('active', idx === step));

    // Cập nhật trạng thái dot (dots tương ứng màn 1, 2, 3)
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx + 1 === step));

    if (step === 1) {
        flame.classList.remove('off');
        smoke.classList.remove('rise');
    }

    if (step === 3) {
        startTypewriter(CONFIG.wishMessage);
    }
}

document.querySelectorAll('[data-target]').forEach(btn => {
    btn.addEventListener('click', () => goToScreen(btn.dataset.target));
});

// ================= 4. THỔI NẾN =================
function blowCandle() {
    if (flame.classList.contains('off')) return;
    flame.classList.add('off');
    smoke.classList.add('rise');
    launchConfetti(95);

    if (!isPlaying) {
        toggleMusic();
    }

    setTimeout(() => {
        goToScreen(2);
    }, 950);
}

document.getElementById('blowBtn').addEventListener('click', blowCandle);
document.getElementById('actionBlow').addEventListener('click', blowCandle);
document.getElementById('fireworkBtn').addEventListener('click', () => launchConfetti(120));

// ================= 5. HIỆU ỨNG GÕ CHỮ =================
function startTypewriter(text) {
    const el = document.getElementById('typewriterText');
    el.textContent = "";
    clearInterval(typingTimer);
    let i = 0;
    typingTimer = setInterval(() => {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typingTimer);
        }
    }, 28);
}

// ================= 6. BỘ ĐẾM THỜI GIAN =================
const birthTimestamp = new Date(CONFIG.birthDate).getTime();

function updateAliveTimer() {
    const now = Date.now();
    const diff = Math.max(0, now - birthTimestamp);

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    document.getElementById('alive-days').textContent = String(d);
    document.getElementById('alive-hours').textContent = String(h).padStart(2, '0');
    document.getElementById('alive-mins').textContent = String(m).padStart(2, '0');
    document.getElementById('alive-secs').textContent = String(s).padStart(2, '0');
}
setInterval(updateAliveTimer, 1000);
updateAliveTimer();

// ================= 7. PHÁO GIẤY MÀU HỒNG =================
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti(count = 80) {
    const colors = ['#ff9ec4', '#e91e8c', '#ffcc00', '#ffffff', '#d4a0ff'];
    for (let i = 0; i < count; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 16,
            vy: (Math.random() - 0.85) * 16,
            size: Math.random() * 7 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rot: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 10,
            alpha: 1
        });
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dùng filter thay vì splice trong forEach để tránh bỏ sót phần tử
    particles = particles.filter(p => p.alpha > 0);

    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.rot += p.vRot;
        p.alpha -= 0.012;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
    });
    requestAnimationFrame(animateConfetti);
}
animateConfetti();

// ================= 8. MẬT KHẨU PIN =================
const CORRECT_PIN = '2111';
let currentPin = '';

function updatePinDots() {
    document.querySelectorAll('.pinDot').forEach((dot, i) => {
        dot.classList.toggle('filled', i < currentPin.length);
    });
}

function handlePinKey(val) {
    const pinError = document.getElementById('pinError');
    const pinDotsEl = document.getElementById('pinDots');

    if (val === 'clear') {
        currentPin = currentPin.slice(0, -1);
        updatePinDots();
        pinError.textContent = '';

    } else if (val === 'confirm') {
        if (currentPin === CORRECT_PIN) {
            // Đúng mật khẩu → bắn pháo hoa rồi chuyển sang màn 1
            launchConfetti(60);
            setTimeout(() => goToScreen(1), 350);
        } else {
            pinError.textContent = '❌ Mật khẩu không đúng, thử lại nhé!';
            // Hiệu ứng rung
            pinDotsEl.classList.remove('shake');
            void pinDotsEl.offsetWidth; // reflow để restart animation
            pinDotsEl.classList.add('shake');
            setTimeout(() => pinDotsEl.classList.remove('shake'), 450);
            currentPin = '';
            updatePinDots();
        }

    } else {
        if (currentPin.length < 4) {
            currentPin += val;
            updatePinDots();
            pinError.textContent = '';
            // Tự động xác nhận sau khi nhập đủ 4 số
            if (currentPin.length === 4) {
                setTimeout(() => handlePinKey('confirm'), 350);
            }
        }
    }
}

document.querySelectorAll('.pinKey').forEach(btn => {
    btn.addEventListener('click', () => handlePinKey(btn.dataset.val));
});

// ================= 9. LƯU THIỆP (HTML2CANVAS) =================
document.getElementById('saveBtn').addEventListener('click', () => {
    const card = document.querySelector('.cardContainer');
    const btn = document.getElementById('saveBtn');
    const originalTxt = btn.textContent;

    btn.textContent = '⏳ Đang lưu...';
    btn.disabled = true;

    html2canvas(card, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#1a0810'   // màu nền tối hồng khi backdrop-filter không render
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'thiepcuaban.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        btn.textContent = '✅ Đã lưu thiệp!';
        setTimeout(() => {
            btn.textContent = originalTxt;
            btn.disabled = false;
        }, 2500);
    }).catch(err => {
        console.error('Lỗi khi lưu thiệp:', err);
        btn.textContent = originalTxt;
        btn.disabled = false;
    });
});
