// ==========================================================================
// CONFIGURATION & INITIALISATION FIREBASE
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

// Initialisation via le SDK Compat présent dans ton HTML
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let currentRawData = null;
let lastClockHTML = {};
let countdownTargets = {};

// ==========================================================================
// RACCOURCI CLAVIER : MAINTENIR "c" + TAPER 876421 POUR L'ADMIN
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
    if (e.key.toLowerCase() === "c") {
        isCPressed = false;
        inputSequence = "";
    }
});

closeAdmin.addEventListener("click", () => adminModal.classList.remove("open"));

function openAdminPanel() {
    adminModal.classList.add("open");
    
    if (currentRawData) {
        document.getElementById("input-slogan-country").value = currentRawData.countrySlogan || "";
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

// ==========================================================================
// BARRE D'OUTILS TEXTE EDITEUR (GRAS / COULEUR)
// ==========================================================================
document.querySelectorAll('.btn-format').forEach(button => {
    button.addEventListener('click', () => {
        const toolbar = button.closest('.toolbar');
        const targetInputId = toolbar.getAttribute('data-target');
        const input = document.getElementById(targetInputId);
        const formatType = button.getAttribute('data-type');
        
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const text = input.value;
        const selectedText = text.substring(start, end);
        
        let replacement = "";
        
        if (formatType === "bold") {
            replacement = `[b]${selectedText || "texte"}[/b]`;
        } else if (formatType === "color") {
            const hexColor = prompt("Entre le code couleur HEX (ex: #ff0000) :", "#ff0000");
            if (!hexColor) return;
            replacement = `[color=${hexColor}]${selectedText || "texte"}[/color]`;
        }
        
        input.value = text.substring(0, start) + replacement + text.substring(end);
        input.focus();
        input.setSelectionRange(start + replacement.length, start + replacement.length);
    });
});

// ==========================================================================
// MOTEUR DE RENDU (PARSER) ET EFFET HORLOGE
// ==========================================================================
function parseCustomTags(text, elementId) {
    if (!text) return "";

    let parsed = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Rendu [b] et [color]
    parsed = parsed.replace(/\[b\]([\s\S]*?)\[\/b\]/g, "<strong>$1</strong>");
    parsed = parsed.replace(/\[color=(#[0-9a-fA-F]{3,8})\]([\s\S]*?)\[\/color\]/g, "<span style='color: $1;'>$2</span>");

    // Rendu [countdown:"22mi"]
    parsed = parsed.replace(/\[countdown:"(\d+)(mi|s|h|j|mo)"\]/g, (match, val, unit) => {
        const key = elementId + match;
        if (!countdownTargets[key]) {
            let durationMs = parseInt(val) * 1000;
            if (unit === "mi") durationMs *= 60;
            if (unit === "h") durationMs *= 3600;
            if (unit === "j") durationMs *= 86400;
            if (unit === "mo") durationMs *= 86400 * 30;
            countdownTargets[key] = Date.now() + durationMs;
        }
        
        let timeLeft = countdownTargets[key] - Date.now();
        if (timeLeft <= 0) return "<span style='color:#ef4444; font-weight:bold;'>EXPIRÉ</span>";
        
        return formatTimeLeft(timeLeft, key);
    });

    // Rendu [timer:"17/06/2026:22:00"]
    parsed = parsed.replace(/\[timer:"(\d{2})\/(\d{2})\/(\d{4}):(\d{2}):(\d{2})"\]/g, (match, j, mo, a, h, mi) => {
        const key = elementId + match;
        const targetDate = new Date(`${a}-${mo}-${j}T${h}:${mi}:00`);
        let timeLeft = targetDate.getTime() - Date.now();
        if (timeLeft <= 0) return "<span style='color:#ef4444; font-weight:bold;'>FINI</span>";
        
        return formatTimeLeft(timeLeft, key);
    });

    return parsed;
}

// Création des structures HTML dynamiques pour l'animation de descente des chiffres
function formatTimeLeft(ms, key) {
    let totalSecs = Math.floor(ms / 1000);
    let days = Math.floor(totalSecs / 86400);
    totalSecs %= 86400;
    let hours = Math.floor(totalSecs / 3600);
    totalSecs %= 3600;
    let mins = Math.floor(totalSecs / 60);
    let secs = totalSecs % 60;

    let rawString = "";
    if (days > 0) rawString += String(days).padStart(2, '0') + "j ";
    if (hours > 0 || days > 0) rawString += String(hours).padStart(2, '0') + "h ";
    rawString += String(mins).padStart(2, '0') + "m " + String(secs).padStart(2, '0') + "s";

    if (!lastClockHTML[key]) {
        lastClockHTML[key] = [];
    }

    let htmlOutput = `<span class="digital-clock">`;
    
    for (let i = 0; i < rawString.length; i++) {
        let char = rawString[i];
        
        if (/[0-9]/.test(char)) {
            let hasChanged = lastClockHTML[key][i] !== char;
            let animateClass = hasChanged ? "digit-animate" : "";
            
            htmlOutput += `<span class="clock-digit"><span class="${animateClass}">${char}</span></span>`;
        } else {
            htmlOutput += `<span class="clock-sep">${char}</span>`;
        }
        
        lastClockHTML[key][i] = char;
    }
    
    htmlOutput += `</span>`;
    return htmlOutput;
}

// ==========================================================================
// BOUCLE DE RAFRAÎCHISSEMENT ET RÉCEPTION / ENVOI FIREBASE
// ==========================================================================
function updateDisplay() {
    if (!currentRawData) return;

    if (currentRawData.countrySlogan) {
        document.getElementById("country-slogan").innerHTML = parseCustomTags(currentRawData.countrySlogan, "country-slogan");
    }

    if (currentRawData.team1) {
        document.getElementById("name-1").innerHTML = parseCustomTags(currentRawData.team1.name, "name-1");
        document.getElementById("slogan-1").innerHTML = parseCustomTags(currentRawData.team1.slogan, "slogan-1");
        document.getElementById("flag-1").src = currentRawData.team1.flagUrl || "https://flagcdn.com/w320/un.png";
        document.getElementById("score-1").innerText = String(currentRawData.team1.score).padStart(2, '0');
        
        const color1 = currentRawData.team1.color || "#3b82f6";
        document.getElementById("score-1").style.color = color1;
        document.getElementById("score-1").style.borderColor = color1 + "40";
        document.getElementById("score-1").style.textShadow = `0 0 25px ${color1}`;
        document.getElementById("card-1").style.borderColor = color1 + "20";
    }

    if (currentRawData.team2) {
        document.getElementById("name-2").innerHTML = parseCustomTags(currentRawData.team2.name, "name-2");
        document.getElementById("slogan-2").innerHTML = parseCustomTags(currentRawData.team2.slogan, "slogan-2");
        document.getElementById("flag-2").src = currentRawData.team2.flagUrl || "https://flagcdn.com/w320/un.png";
        document.getElementById("score-2").innerText = String(currentRawData.team2.score).padStart(2, '0');
        
        const color2 = currentRawData.team2.color || "#ef4444";
        document.getElementById("score-2").style.color = color2;
        document.getElementById("score-2").style.borderColor = color2 + "40";
        document.getElementById("score-2").style.textShadow = `0 0 25px ${color2}`;
        document.getElementById("card-2").style.borderColor = color2 + "20";
    }
}

// Boucle locale à 1 FPS pour l'actualisation visuelle fluide des timers
setInterval(updateDisplay, 1000);

// Sauvegarde vers Firebase
document.getElementById("save-admin-btn").addEventListener("click", () => {
    countdownTargets = {}; // Reset les comptes à rebours éphémères à la mise à jour

    const tableData = {
        countrySlogan: document.getElementById("input-slogan-country").value,
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

    database.ref("customScoreboard").set(tableData)
        .then(() => adminModal.classList.remove("open"))
        .catch(err => alert("Erreur Firebase : " + err.message));
});

// Écoute en temps réel de Firebase
database.ref("customScoreboard").on("value", (snapshot) => {
    currentRawData = snapshot.val();
    updateDisplay();
});
