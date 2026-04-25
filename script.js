/* TROCA DE TELAS */
let trocandoTela = false;

function irPara(tela) {
    if (trocandoTela) return;

    trocandoTela = true;

    const atual = document.querySelector(".tela.ativa");
    const proxima = document.getElementById(tela);

    if (atual) atual.classList.remove("ativa");

    setTimeout(() => {
        proxima.classList.add("ativa");

        setTimeout(() => {
            trocandoTela = false;
        }, 400);
    }, 200);
}

/* CHAT */
function escapeHTML(text) {
    return text.replace(/[&<>"']/g, m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[m]);
}

function addMsg(text, tipo) {
    const div = document.createElement("div");
    div.classList.add("msg", tipo);
    div.innerHTML = escapeHTML(text);

    const chat = document.getElementById("chat-box");
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

let enviando = false;

async function enviar() {
    if (enviando) return;

    const input = document.getElementById("input");
    const texto = input.value.trim();
    if (!texto) return;

    enviando = true;

    addMsg(texto, "user");
    input.value = "";

    const bot = document.createElement("div");
    bot.classList.add("msg", "bot");
    bot.innerText = "...";
    document.getElementById("chat-box").appendChild(bot);

    try {
        const res = await fetch("https://api.dify.ai/v1/chat-messages", {
            method: "POST",
            headers: {
                "Authorization": "Bearer app-6KiuHyxnTyqU00QceRbLM3uS",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: {},
                query: texto,
                response_mode: "blocking",
                user: "player"
            })
        });

        const data = await res.json();
        bot.innerText = data.answer;

    } catch {
        bot.innerText = "Erro ao responder";
    }

    enviando = false;
}

/* ENTER */
document.getElementById("input").addEventListener("keypress", e => {
    if (e.key === "Enter") enviar();
});

/* JOGOS */
function abrirJogo(link) {
    irPara("telaJogo");
    document.getElementById("frameJogo").src = link;
}

function fecharJogo() {
    irPara("jogos");
    document.getElementById("frameJogo").src = "";
}

/* ========================= */
/* 🌌 FUNDO ESPACIAL */
/* ========================= */

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

/* ⭐ ESTRELAS */
let stars = [];

function criarEstrelas() {
    stars = [];
    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5,
            speed: Math.random() * 0.5
        });
    }
}

/* 🪐 PLANETAS REALISTAS */
let planets = [
    {
        x: 200,
        y: 200,
        r: 60,
        speed: 0.1,
        light: "#7ec8ff",
        dark: "#1e3a8a",
        glow: "rgba(100,150,255,0.4)"
    },
    {
        x: 700,
        y: 400,
        r: 80,
        speed: 0.05,
        light: "#ffd27f",
        dark: "#8a4b1e",
        glow: "rgba(255,180,100,0.4)"
    }
];

/* 🪐 DESENHO REALISTA */
function drawPlanet(p) {
    // Base (luz)
    const gradient = ctx.createRadialGradient(
        p.x - p.r * 0.3,
        p.y - p.r * 0.3,
        p.r * 0.2,
        p.x,
        p.y,
        p.r
    );

    gradient.addColorStop(0, p.light);
    gradient.addColorStop(1, p.dark);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    // Sombra
    const shadow = ctx.createRadialGradient(
        p.x + p.r * 0.4,
        p.y + p.r * 0.4,
        p.r * 0.2,
        p.x,
        p.y,
        p.r
    );

    shadow.addColorStop(0, "transparent");
    shadow.addColorStop(1, "rgba(0,0,0,0.6)");

    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    // Atmosfera (glow)
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r + 10, 0, Math.PI * 2);
    ctx.strokeStyle = p.glow;
    ctx.lineWidth = 4;
    ctx.stroke();
}

/* 🌌 NEBULOSA */
function drawNebula() {
    const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        100,
        canvas.width / 2,
        canvas.height / 2,
        600
    );

    gradient.addColorStop(0, "rgba(120,0,200,0.2)");
    gradient.addColorStop(0.5, "rgba(0,100,255,0.1)");
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/* LOOP */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawNebula();

    // estrelas
    ctx.fillStyle = "white";
    stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        s.y += s.speed;

        if (s.y > canvas.height) {
            s.y = 0;
            s.x = Math.random() * canvas.width;
        }
    });

    // planetas realistas
    planets.forEach(p => {
        drawPlanet(p);

        p.y += p.speed;

        if (p.y > canvas.height + 150) {
            p.y = -150;
            p.x = Math.random() * canvas.width;
        }
    });

    requestAnimationFrame(draw);
}

/* INIT */
criarEstrelas();
draw();

/* RESPONSIVO */
window.addEventListener("resize", () => {
    resizeCanvas();
    criarEstrelas();
});
