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
    bot.innerText = "Digitando...";
    document.getElementById("chat-box").appendChild(bot);

    try {
        const res = await fetch("https://api.dify.ai/v1/chat-messages", {
            method: "POST",
            headers: {
                "Authorization": "Bearer SUA_API_AQUI",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: {},
                query: texto,
                response_mode: "blocking",
                user: "player"
            })
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        bot.innerText = data.answer;

    } catch {
        bot.innerText = "Erro ao responder 😢";
    }

    enviando = false;
}

/* ENTER */
const inputEl = document.getElementById("input");
if (inputEl) {
    inputEl.addEventListener("keypress", e => {
        if (e.key === "Enter") enviar();
    });
}

/* JOGOS */
function abrirJogo(link) {
    irPara("telaJogo");
    document.getElementById("frameJogo").src = link;
}

function fecharJogo() {
    irPara("jogos");
    document.getElementById("frameJogo").src = "";
}

/* FUNDO ESPACIAL */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

/* ESTRELAS */
let stars = [];

function criarEstrelas() {
    stars = [];
    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.2,
            speed: Math.random() * 0.3
        });
    }
}

/* GALÁXIAS */
let galaxies = [
    { x: 300, y: 200, r: 120, rot: 0 },
    { x: 900, y: 500, r: 150, rot: 0 }
];

function drawGalaxy(g) {
    ctx.save();
    ctx.translate(g.x, g.y);
    ctx.rotate(g.rot);

    const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, g.r);
    gradient.addColorStop(0, "rgba(255,255,255,0.2)");
    gradient.addColorStop(0.3, "rgba(100,100,255,0.15)");
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, g.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    g.rot += 0.0005;
}

/* NEBULOSA ESCURA */
function drawNebula() {
    const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        50,
        canvas.width / 2,
        canvas.height / 2,
        500
    );

    gradient.addColorStop(0, "rgba(20,0,40,0.4)");
    gradient.addColorStop(0.5, "rgba(0,0,50,0.3)");
    gradient.addColorStop(1, "rgba(0,0,0,1)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/* LOOP */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawNebula();

    /* estrelas */
    ctx.fillStyle = "rgba(255,255,255,0.7)";
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

    /* galáxias */
    galaxies.forEach(drawGalaxy);

    requestAnimationFrame(draw);
}

criarEstrelas();
draw();

window.addEventListener("resize", () => {
    resizeCanvas();
    criarEstrelas();
});
