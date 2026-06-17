// ==========================================================================
// 1. CONFIGURATION & SETUP FIREBASE
// ==========================================================================
const firebaseConfig = {
    apiKey: "AIzaSyAlQBqaDBx1efC89wSEMBMRh6EzRUvaKiU",
    authDomain: "match-footlaconstitutionrp.firebaseapp.com",
    databaseURL: "https://match-footlaconstitutionrp-default-rtdb.firebaseio.com/",
    projectId: "match-footlaconstitutionrp",
    storageBucket: "match-footlaconstitutionrp.firebasestorage.app",
    messagingSenderId: "19180021045",
    appId: "1:19180021045:web:8f1e61cd43d7900f1a187c",
    measurementId: "G-NXKQPYMDKE"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let currentRawData = null;
let lastClockHTML = {};
let countdownTargets = {};

// ==========================================================================
// 2. RACCOURCI SECRÈT POUR S'OUVRIR LA REGIE ADMIN ("c" + 876421)
// ==========================================================================
let isCPressed = false;
let inputSequence = "";
const targetCode = "876421";

const adminModal = document.getElementById("admin-modal");
const closeAdmin = document.getElementById("close-admin");

window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "c") isCPressed = true;
    if (isCPressed && /[0-9]/.test(e.key)) {
        inputSequence += e.key;
        if (inputSequence === targetCode) {
            openAdminPanel();
            inputSequence = "";
        }
        if (inputSequence.length > targetCode.length) inputSequence = "";
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key.toLowerCase() === "c") { isCPressed = false; inputSequence = ""; }
});

closeAdmin.addEventListener("click", () => adminModal.classList.remove("open"));

function openAdminPanel() {
    adminModal.classList.add("open");
    if (currentRawData) {
        document.getElementById("input-match-active").value = currentRawData.isMatchActive !== false ? "true" : "false";
        document.getElementById("input-slogan-country").value = currentRawData.countrySlogan || "";
        document.getElementById("input-archive-duration").value = currentRawData.archiveDurationDefault || "90:00";
        
        document.getElementById("input-name-1").value = currentRawData.team1?.name || "";
        document.getElementById("input-slogan-1").value = currentRawData.team1?.slogan || "";
        document.getElementById("input-flag-1").value = currentRawData.team1?.flagUrl || "";
        document.getElementById("input-score-1").value = currentRawData.team1?.score || 0;
        document.getElementById("input-color-1").value = currentRawData.team1?.color || "#3b82f6";
        
        document.getElementById("input-name-2").value = currentRawData.team2?.name || "";
        document.getElementById("input-slogan-2").value = currentRawData.team2?.slogan || "";
        document.getElementById("input-flag-2").value = currentRawData.team2?.flagUrl || "";
        document.getElementById("input-score-2").value = currentRawData.team2?.score || 0;
        document.getElementById("input-color-2").value = currentRawData.team2?.color || "#ef4444";
    }
}

// Formatage BBCode direct depuis la régie
document.querySelectorAll('.btn-format').forEach(button => {
    button.addEventListener('click', () => {
        const toolbar = button.closest('.toolbar');
        const targetInput = document.getElementById(toolbar.getAttribute('data-target'));
        const formatType = button.getAttribute('data-type');
        const start = targetInput.selectionStart, end = targetInput.selectionEnd, text = targetInput.value;
        const selected = text.substring(start, end);
        
        let replacement = "";
        if (formatType === "bold") replacement = `[b]${selected || "texte"}[/b]`;
        if (formatType === "color") {
            const hex = prompt("Couleur HEX :", "#ff0000");
            if (!hex) return;
            replacement = `[color=${hex}]${selected || "texte"}[/color]`;
        }
        targetInput.value = text.substring(0, start) + replacement + text.substring(end);
        targetInput.focus();
    });
});

// ==========================================================================
// 3. ENGIN DE RENDU DU LIVE (TAGS ET CHRONOS)
// ==========================================================================
function parseCustomTags(text, elementId) {
    if (!text) return "";
    let parsed = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    parsed = parsed.replace(/\[b\]([\s\S]*?)\[\/b\]/g, "<strong>$1</strong>");
    parsed = parsed.replace(/\[color=(#[0-9a-fA-F]{3,8})\]([\s\S]*?)\[\/color\]/g, "<span style='color: $1;'>$2</span>");

    // [countdown:"22mi"]
    parsed = parsed.replace(/\[countdown:"(\d+)(mi|s|h|j)"\]/g, (match, val, unit) => {
        const key = elementId + match;
        if (!countdownTargets[key]) {
            let dur = parseInt(val) * 1000;
            if (unit === "mi") dur *= 60;
            if (unit === "h") dur *= 3600;
            countdownTargets[key] = Date.now() + dur;
        }
        let left = countdownTargets[key] - Date.now();
        if (left <= 0) return "<span style='color:#ef4444; font-weight:bold;'>EXPIRÉ</span>";
        return formatClock(left, key, "#f59e0b", "#d97706", false);
    });

    // [timer:"17/06/2026:22:00"]
    parsed = parsed.replace(/\[timer:"(\d{2})\/(\d{2})\/(\d{4}):(\d{2}):(\d{2})"\]/g, (match, j, mo, a, h, mi) => {
        const key = elementId + match;
        let left = new Date(`${a}-${mo}-${j}T${h}:${mi}:00`).getTime() - Date.now();
        if (left <= 0) return "<span style='color:#ef4444; font-weight:bold;'>FINI</span>";
        return formatClock(left, key, "#f59e0b", "#d97706", false);
    });

    // [startedat:"17/06/2026:22:00" max:"02:15:00"]
    parsed = parsed.replace(/\[startedat:"(\d{2})\/(\d{2})\/(\d{4}):(\d{2}):(\d{2})"(?:\s+max:"(\d{2}):(\d{2}):(\d{2})")?\]/g, (match, j, mo, a, h, mi, maxH, maxM, maxS) => {
        const key = elementId + match;
        let elapsed = Date.now() - new Date(`${a}-${mo}-${j}T${h}:${mi}:00`).getTime();
        if (elapsed < 0) return "<span style='color:#3b82f6; font-weight:bold;'>PAS COMMENCÉ</span>";

        let maxReached = false;
        if (maxH && maxM && maxS) {
            const limit = ((parseInt(maxH) * 3600) + (parseInt(maxM) * 60) + parseInt(maxS)) * 1000;
            if (elapsed >= limit) { elapsed = limit; maxReached = true; }
        }
        let clockHtml = formatClock(elapsed, key, maxReached ? "#f43f5e" : "#22c55e", maxReached ? "#e11d48" : "#16a34a", maxReached);
        if (maxReached) clockHtml += ` <span style='color:#ef4444; font-weight:800; font-size:0.8rem; margin-left:4px;'>FIN</span>`;
        return clockHtml;
    });

    return parsed;
}

function formatClock(ms, key, digitCol, sepCol, frozen) {
    let s = Math.floor(ms / 1000), d = Math.floor(s / 86400); s %= 86400;
    let h = Math.floor(s / 3600); s %= 3600;
    let m = Math.floor(s / 60); s %= 60;

    let str = "";
    if (d > 0) str += String(d).padStart(2, '0') + "j ";
    if (h > 0 || d > 0) str += String(h).padStart(2, '0') + "h ";
    str += String(m).padStart(2, '0') + "m " + String(s).padStart(2, '0') + "s";

    if (!lastClockHTML[key]) lastClockHTML[key] = [];
    let out = `<span class="digital-clock" style="border-color:${digitCol}30; box-shadow:0 0 15px ${digitCol}10;">`;
    for (let i = 0; i < str.length; i++) {
        let ch = str[i];
        if (/[0-9]/.test(ch)) {
            let changed = lastClockHTML[key][i] !== ch;
            let anim = (changed && !frozen) ? "digit-animate" : "";
            out += `<span class="clock-digit" style="color:${digitCol};"><span class="${anim}">${ch}</span></span>`;
        } else {
            out += `<span class="clock-sep" style="color:${sepCol};">${ch}</span>`;
        }
        lastClockHTML[key][i] = ch;
    }
    return out + `</span>`;
}

// ==========================================================================
// 4. BOUCLE INTERACTIVE DE RENDU LIVE & TRAITEMENT DES FLUX
// ==========================================================================
function updateDisplay() {
    if (!currentRawData) return;

    const isActive = currentRawData.isMatchActive !== false;
    const liveBox = document.getElementById("active-match-state");
    const emptyBox = document.getElementById("no-match-state");

    if (!isActive) {
        liveBox.classList.add("hidden");
        emptyBox.classList.remove("hidden");
        document.title = "Aucun Match - FIFA 26";
    } else {
        emptyBox.classList.add("hidden");
        liveBox.classList.remove("hidden");

        const s1 = currentRawData.team1?.score || 0;
        const s2 = currentRawData.team2?.score || 0;
        document.title = `[${s1} - ${s2}] FIFA 26 - En Direct`;

        document.getElementById("country-slogan").innerHTML = parseCustomTags(currentRawData.countrySlogan, "country-slogan");

        ["1", "2"].forEach(num => {
            const team = currentRawData[`team${num}`];
            if (team) {
                document.getElementById(`name-${num}`).innerHTML = parseCustomTags(team.name, `name-${num}`);
                document.getElementById(`slogan-${num}`).innerHTML = parseCustomTags(team.slogan, `slogan-${num}`);
                document.getElementById(`flag-${num}`).src = team.flagUrl || "https://flagcdn.com/w320/un.png";
                document.getElementById(`score-${num}`).innerText = String(team.score).padStart(2, '0');
                
                let col = team.color || (num === "1" ? "#3b82f6" : "#ef4444");
                document.getElementById(`score-${num}`).style.color = col;
                document.getElementById(`score-${num}`).style.textShadow = `0 0 20px ${col}`;
                document.getElementById(`score-${num}`).style.borderColor = col + "40";
                document.getElementById(`card-${num}`).style.borderColor = col + "25";
            }
        });
    }
}
setInterval(updateDisplay, 1000);

// ==========================================================================
// 5. GESTION DU STOCKAGE DES ARCHIVES FIREBASE
// ==========================================================================
document.getElementById("save-admin-btn").addEventListener("click", () => {
    countdownTargets = {};
    const tableData = {
        isMatchActive: document.getElementById("input-match-active").value === "true",
        countrySlogan: document.getElementById("input-slogan-country").value,
        archiveDurationDefault: document.getElementById("input-archive-duration").value || "90:00",
        team1: {
            name: document.getElementById("input-name-1").value,
            slogan: document.getElementById("input-slogan-1").value,
            flagUrl: document.getElementById("input-flag-1").value,
            score: parseInt(document.getElementById("input-score-1").value) || 0,
            color: document.getElementById("input-color-1").value
        },
        team2: {
            name: document.getElementById("input-name-2").value,
            slogan: document.getElementById("input-slogan-2").value,
            flagUrl: document.getElementById("input-flag-2").value,
            score: parseInt(document.getElementById("input-score-2").value) || 0,
            color: document.getElementById("input-color-2").value
        }
    };

    database.ref("customScoreboard/live").set(tableData)
        .then(() => adminModal.classList.remove("open"))
        .catch(err => alert("Erreur : " + err.message));
});

// ACTION DU BOUTON ARCHIVER LE MATCH ACTUEL
document.getElementById("btn-archive-now").addEventListener("click", () => {
    if (!currentRawData || !currentRawData.team1 || !currentRawData.team2) {
        alert("Aucun match valide à archiver.");
        return;
    }

    if (!confirm("Voulez-vous vraiment clore ce match et le basculer dans l'historique ?")) return;

    // Création de l'objet d'archive
    const archivedMatch = {
        timestamp: Date.now(),
        duration: document.getElementById("input-archive-duration").value || "90:00",
        team1: { name: currentRawData.team1.name, flagUrl: currentRawData.team1.flagUrl, score: currentRawData.team1.score },
        team2: { name: currentRawData.team2.name, flagUrl: currentRawData.team2.flagUrl, score: currentRawData.team2.score }
    };

    // 1. On pousse dans la liste d'archives
    database.ref("customScoreboard/archives").push(archivedMatch)
        .then(() => {
            // 2. On désactive l'écran de direct et on nettoie les entrées
            return database.ref("customScoreboard/live").update({
                isMatchActive: false,
                countrySlogan: "Aucun match en cours",
                "team1/score": 0,
                "team2/score": 0
            });
        })
        .then(() => {
            adminModal.classList.remove("open");
            alert("Match envoyé dans l'historique avec succès ! L'écran principal est libéré.");
        })
        .catch(err => alert("Erreur lors de l'archivage : " + err.message));
});

// ÉCOUTE FIREBASE DES MATRICES LIVE
database.ref("customScoreboard/live").on("value", (snapshot) => {
    currentRawData = snapshot.val();
    updateDisplay();
});

// ÉCOUTE ET INJECTION DU RENDU DES ARCHIVES EN BAS
database.ref("customScoreboard/archives").on("value", (snapshot) => {
    const listDiv = document.getElementById("archive-list");
    listDiv.innerHTML = "";
    
    if (!snapshot.exists()) {
        listDiv.innerHTML = `<p class="no-archives">Aucun match archivé dans la base de données.</p>`;
        return;
    }

    let records = [];
    snapshot.forEach(child => {
        records.unshift({ id: child.key, ...child.val() }); // Du plus récent au plus ancien
    });

    records.forEach(match => {
        const card = document.createElement("div");
        card.className = "archive-card";
        
        // Nettoyage rapide des restes de tags gras ou couleur pour l'archive
        const n1 = (match.team1?.name || "Inconnu").replace(/\[\/?b\]/g, "").replace(/\[color=[^\]]+\]/g, "").replace(/\[\/color\]/g, "");
        const n2 = (match.team2?.name || "Inconnu").replace(/\[\/?b\]/g, "").replace(/\[color=[^\]]+\]/g, "").replace(/\[\/color\]/g, "");

        card.innerHTML = `
            <div class="archive-card-header">
                <span>Match Terminé</span>
                <span class="archive-duration"><i class="ri-time-line"></i> ${match.duration || "90:00"}</span>
            </div>
            <div class="archive-teams-row">
                <div class="archive-team left">
                    <img src="${match.team1?.flagUrl || 'https://flagcdn.com/w320/un.png'}" class="archive-flag">
                    <span class="archive-team-name">${n1}</span>
                </div>
                <div class="archive-score-center">${match.team1?.score || 0} - ${match.team2?.score || 0}</div>
                <div class="archive-team right">
                    <img src="${match.team2?.flagUrl || 'https://flagcdn.com/w320/un.png'}" class="archive-flag">
                    <span class="archive-team-name">${n2}</span>
                </div>
            </div>
        `;
        listDiv.appendChild(card);
    });
});
