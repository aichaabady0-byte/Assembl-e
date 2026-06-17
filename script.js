// ==========================================================================
// CONFIGURATION CONFIG FIREBASE (Remplis avec tes identifiants)
// ==========================================================================
const firebaseConfig = {
    apiKey: "AIzaSyAlQBqaDBx1efC89wSEMBMRh6EzRUvaKiU",
    authDomain: "match-footlaconstitutionrp.firebaseapp.com",
    databaseURL: "https://match-footlaconstitutionrp-default-rtdb.firebaseio.com/", // URL de ta Realtime Database
    projectId: "match-footlaconstitutionrp",
    storageBucket: "match-footlaconstitutionrp.firebasestorage.app",
    messagingSenderId: "19180021045",
    appId: "1:19180021045:web:8f1e61cd43d7900f1a187c"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ==========================================================================
// DETECTEUR CLAVIER UNIQUE ("c" + 876421)
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

// Charger les valeurs actuelles dans le formulaire au moment de l'ouverture
function openAdminPanel() {
    adminModal.classList.add("open");
    
    document.getElementById("input-slogan-country").value = document.getElementById("country-slogan").innerText;
    
    // Équipe 1
    document.getElementById("input-name-1").value = document.getElementById("name-1").innerText;
    document.getElementById("input-slogan-1").value = document.getElementById("slogan-1").innerText;
    document.getElementById("input-flag-1").value = document.getElementById("flag-1").src;
    document.getElementById("input-score-1").value = parseInt(document.getElementById("score-1").innerText);
    
    // Équipe 2
    document.getElementById("input-name-2").value = document.getElementById("name-2").innerText;
    document.getElementById("input-slogan-2").value = document.getElementById("slogan-2").innerText;
    document.getElementById("input-flag-2").value = document.getElementById("flag-2").src;
    document.getElementById("input-score-2").value = parseInt(document.getElementById("score-2").innerText);
}

// ==========================================================================
// SENSE UNIQUE : ENVOI DU CONFIGURATEUR VERS FIREBASE
// ==========================================================================
document.getElementById("save-admin-btn").addEventListener("click", () => {
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
        .catch(err => alert("Erreur de sauvegarde : " + err.message));
});

// ==========================================================================
// SENSE DUPLEX : EN TEMPS RÉEL DEPUIS FIREBASE VERS L'ÉCRAN
// ==========================================================================
database.ref("customScoreboard").on("value", (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    // Slogan Global
    if (data.countrySlogan) document.getElementById("country-slogan").innerText = data.countrySlogan;

    // Sync Équipe 1
    if (data.team1) {
        document.getElementById("name-1").innerText = data.team1.name || "Équipe 1";
        document.getElementById("slogan-1").innerText = data.team1.slogan || "";
        document.getElementById("flag-1").src = data.team1.flagUrl || "https://flagcdn.com/w320/un.png";
        document.getElementById("score-1").innerText = String(data.team1.score).padStart(2, '0');
        
        // Application dynamique de la couleur choisie par l'admin
        const color1 = data.team1.color || "#3b82f6";
        document.getElementById("score-1").style.color = color1;
        document.getElementById("score-1").style.borderColor = color1 + "40"; // Ajoute de la transparence pour la bordure
        document.getElementById("score-1").style.textShadow = `0 0 25px ${color1}`;
        document.getElementById("card-1").style.borderColor = color1 + "20";
    }

    // Sync Équipe 2
    if (data.team2) {
        document.getElementById("name-2").innerText = data.team2.name || "Équipe 2";
        document.getElementById("slogan-2").innerText = data.team2.slogan || "";
        document.getElementById("flag-2").src = data.team2.flagUrl || "https://flagcdn.com/w320/un.png";
        document.getElementById("score-2").innerText = String(data.team2.score).padStart(2, '0');
        
        // Application dynamique de la couleur choisie par l'admin
        const color2 = data.team2.color || "#ef4444";
        document.getElementById("score-2").style.color = color2;
        document.getElementById("score-2").style.borderColor = color2 + "40";
        document.getElementById("score-2").style.textShadow = `0 0 25px ${color2}`;
        document.getElementById("card-2").style.borderColor = color2 + "20";
    }
});
