const questions = [
    { question: "Câu 1: Hiện tại, Khoa Công nghệ và Kỹ thuật có bao nhiêu bộ môn?", answers: { A: "3", B: "4", C: "5", D: "6" }, correct: "B" },
    { question: "Câu 2: Trưởng Bộ môn Khoa học máy tính là ai?", answers: { A: "Thầy Lương Thái Ngọc", B: "Cô Lê Minh Thư", C: "Thầy Nguyễn Hữu Duyệt", D: "Cô Trần Kim Hương" }, correct: "A" },
    { question: "Câu 3: Ngày 14/06/2024, Khoa Công nghệ và Kỹ thuật đã ký kết hợp tác với công ty nào để hợp tác đào tạo cho sinh viên chuyên ngành Mạng máy tinh và an ninh?", answers: { A: "ATHENA", B: "FPT", C: "VNG Corporation", D: "NFQ Asia" }, correct: "A" },
];

let currentQuestion = 0;
let players = { player1: { name: "", score: 0 }, player2: { name: "", score: 0 } };
let timerInterval, selectedPlayer = null;

const mainScreen = document.getElementById("main-screen");
const playerScreen = document.getElementById("player-screen");
const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const confirmPlayersBtn = document.getElementById("confirm-players-btn");
const selectPlayerBtn = document.getElementById("select-player-btn");
const restartBtn = document.getElementById("restart-btn");
const questionText = document.getElementById("question-text");
const answerBtns = document.querySelectorAll(".answer-btn");
const countdownElement = document.getElementById("countdown");
const winnerText = document.getElementById("winner");
const scorePlayer1 = document.getElementById("score-player1");
const scorePlayer2 = document.getElementById("score-player2");
const selectPlayerModal = new bootstrap.Modal(document.getElementById("select-player-modal"));
const answerFeedbackModal = new bootstrap.Modal(document.getElementById("answer-feedback-modal"));
const feedbackTitle = document.getElementById("answer-feedback-title");
const feedbackBody = document.getElementById("answer-feedback-body");
const fireworksCanvas = document.getElementById("fireworks-canvas");
const startBtnForQuestion = document.getElementById("start-question-btn");

startBtn.addEventListener("click", () => {
    mainScreen.classList.add("d-none");
    playerScreen.classList.remove("d-none");
});

confirmPlayersBtn.addEventListener("click", () => {
    const player1NameInput = document.getElementById("player1").value.trim();
    const player2NameInput = document.getElementById("player2").value.trim();

    players.player1.name = player1NameInput !== "" ? player1NameInput : "Người chơi 1";
    players.player2.name = player2NameInput !== "" ? player2NameInput : "Người chơi 2";

    playerScreen.classList.add("d-none");
    showQuestion();
    updateScoreboard();
});

function showQuestion() {
    if (currentQuestion >= questions.length) {
        endGame();
        return;
    }

    questionScreen.classList.remove("d-none");
    const questionData = questions[currentQuestion];
    questionText.innerText = questionData.question;

    answerBtns.forEach(btn => {
        const answerKey = btn.getAttribute("data-answer");
        btn.innerText = `${answerKey}: ${questionData.answers[answerKey]}`;
        btn.classList.remove("correct", "incorrect");
        btn.disabled = true;
    });
    startBtnForQuestion.classList.remove("d-none");
    startBtnForQuestion.addEventListener("click", () => {
        startBtnForQuestion.classList.add("d-none");
        clearInterval(timerInterval);
        timerRunning = false;
        clearTimeout(timeRun);
        startTimer();
    });
}

let timerRunning = false;
let timeRun;

function startTimer() {
    let timeLeft = 5;
    countdownElement.innerText = timeLeft;

    const clockSound = new Audio('sound/clock.mp3');
    clockSound.loop = true;
    timeRun = setTimeout(() => {
        clockSound.play();
    }, 1000);

    if (!timerRunning) {
        timerInterval = setInterval(() => {
            timeLeft--;
            countdownElement.innerText = timeLeft;
            console.log(timeLeft)
            if (timeLeft === 0) {
                clearInterval(timerInterval);
                clearTimeout(timeRun);
                clockSound.pause();
                timerRunning = false;

                selectPlayerBtn.classList.remove("d-none");
            }
        }, 1000);
    }
}

selectPlayerBtn.addEventListener("click", () => {
    document.getElementById("choose-player1").innerText = players.player1.name;
    document.getElementById("choose-player2").innerText = players.player2.name;

    selectPlayerModal.show();

    document.getElementById("choose-player1").addEventListener("click", () => {
        selectedPlayer = "player1";
        enableAnswers();
        selectPlayerModal.hide();
    });

    document.getElementById("choose-player2").addEventListener("click", () => {
        selectedPlayer = "player2";
        enableAnswers();
        selectPlayerModal.hide();
    });
});

function enableAnswers() {
    answerBtns.forEach(btn => {
        btn.disabled = false;
        btn.addEventListener("click", handleAnswer);
    });
}

function handleAnswer(event) {
    const selectedAnswer = event.target.getAttribute("data-answer");
    const correctAnswer = questions[currentQuestion].correct;

    answerBtns.forEach(btn => btn.disabled = true);
    event.target.classList.add(selectedAnswer === correctAnswer ? "correct" : "incorrect");

    setTimeout(() => {
        event.target.classList.remove("correct", "incorrect");
        event.target.classList.add(selectedAnswer === correctAnswer ? "correct" : "incorrect");
    }, 2000);

    setTimeout(() => {
        showAnswerFeedback(selectedAnswer === correctAnswer);
    }, 3000);
}

function showAnswerFeedback(isCorrect) {
    feedbackTitle.innerText = isCorrect ? "Chính xác!" : "Sai rồi!";
    feedbackBody.innerText = isCorrect 
        ? `${players[selectedPlayer].name} đã trả lời đúng!` 
        : `${players[selectedPlayer].name} đã trả lời sai!`;

    if (isCorrect) players[selectedPlayer].score++;
    updateScoreboard();

    answerFeedbackModal.show();

    answerFeedbackModal._element.addEventListener('hidden.bs.modal', nextQuestion);
}

function nextQuestion() {
    currentQuestion++;
    clearInterval(timerInterval);
    timerRunning = false;
    countdownElement.innerText = "5";
    selectPlayerBtn.classList.add("d-none");

    answerBtns.forEach(btn => {
        btn.disabled = true;
        btn.classList.remove("correct", "incorrect");
    });

    if (currentQuestion >= questions.length) {
        endGame();
    } else {
        showQuestion();
    }
}

function updateScoreboard() {
    scorePlayer1.innerText = `${players.player1.name}: ${players.player1.score}`;
    scorePlayer2.innerText = `${players.player2.name}: ${players.player2.score}`;
}

function endGame() {
    questionScreen.classList.add("d-none");
    resultScreen.classList.remove("d-none");

    const winner = 
        players.player1.score > players.player2.score
            ? players.player1.name
            : players.player2.score > players.player1.score
                ? players.player2.name
                : "Không ai thắng!";

    winnerText.innerText = winner === "Không ai thắng!"
        ? "Hòa nhau rồi!"
        : `${winner} là người chiến thắng!`;

    if (winner !== "Không ai thắng!") {
        const victorySound = new Audio('sound/victory.mp3');
        victorySound.play();
        startFireworks();
    }
}

function startFireworks() {
    const canvas = fireworksCanvas;
    canvas.classList.add("d-block");

    const fireworks = new Fireworks(canvas, {
        rocketsPoint: 50,
        hue: { min: 0, max: 360 },
        delay: { min: 30, max: 60 },
    });

    fireworks.start();

    setTimeout(() => {
        fireworks.stop();
        canvas.classList.remove("d-block");
    }, 5000);
}

restartBtn.addEventListener("click", () => {
    currentQuestion = 0;
    players.player1.score = 0;
    players.player2.score = 0;
    resultScreen.classList.add("d-none");
    mainScreen.classList.remove("d-none");
});

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    cw = window.innerWidth,
    ch = window.innerHeight,
    fireworks = [],
    particles = [],
    hue = 120,
    limiterTotal = 30,
    limiterTick = 0,
    timerTotal = 200,
    timerTick = 0,
    mousedown = false,
    mx, my;

canvas.width = cw;
canvas.height = ch;

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function calculateDistance(p1x, p1y, p2x, p2y) {
    var xDistance = p1x - p2x,
        yDistance = p1y - p2y;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function Firework(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = random(50, 70);
    this.targetRadius = 1;
}

Firework.prototype.update = function (index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }

    this.speed *= this.acceleration;
    var vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed;

    this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

    if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty);
        fireworks.splice(index, 1);
    } else {
        this.x += vx;
        this.y += vy;
    }
};

Firework.prototype.draw = function () {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
    ctx.stroke();
};

function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = random(0, Math.PI * 2);
    this.speed = random(1, 10);
    this.friction = 0.95;
    this.gravity = 0.6;
    this.hue = random(hue - 20, hue + 20);
    this.brightness = random(50, 80);
    this.alpha = 1;
    this.decay = random(0.0075, 0.009);
}

Particle.prototype.update = function (index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if (this.alpha <= this.decay) {
        particles.splice(index, 1);
    }
};

Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
    ctx.stroke();
};

function createParticles(x, y) {
    var particleCount = 20;
    while (particleCount--) {
        particles.push(new Particle(x, y));
    }
}

function loop() {
    requestAnimationFrame(loop);

    hue += 0.5;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, cw, ch);

    ctx.globalCompositeOperation = 'lighter';

    var i = fireworks.length;
    while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
    }

    var i = particles.length;
    while (i--) {
        particles[i].draw();
        particles[i].update(i);
    }

    if (timerTick >= timerTotal) {
        timerTick = 0;
    } else {
        var temp = timerTick % 400;
        if (temp <= 15) {
            fireworks.push(new Firework(100, ch, random(190, 200), random(90, 100)));
            fireworks.push(new Firework(cw - 100, ch, random(cw - 200, cw - 190), random(90, 100)));
        }

        timerTick++;
    }

    if (limiterTick >= limiterTotal) {
        if (mousedown) {
            fireworks.push(new Firework(cw / 2, ch, mx, my));
            limiterTick = 0;
        }
    } else {
        limiterTick++;
    }
}

canvas.addEventListener('mousemove', function (e) {
    mx = e.pageX - canvas.offsetLeft;
    my = e.pageY - canvas.offsetTop;
});

canvas.addEventListener('mousedown', function (e) {
    e.preventDefault();
    mousedown = true;
});

canvas.addEventListener('mouseup', function (e) {
    e.preventDefault();
    mousedown = false;
});

window.onload = loop;