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

// Initialisation de Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ==========================================================================
// SÉCURITÉ : CODE ADMIN INVISIBLE ("c" maintenu + 876421)
// ==========================================================================
let isCPressed = false;
let inputSequence = "";
const targetCode = "876421";

const adminModal = document.getElementById("admin-modal");
const closeAdmin = document.getElementById("close-admin");

// Écoute des touches enfoncées
window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "c") {
        isCPressed = true;
    }

    // Si la touche "c" est active et qu'on tape des chiffres
    if (isCPressed && /[0-9]/.test(e.key)) {
        inputSequence += e.key;

        // Si le code tapé correspond à la cible
        if (inputSequence === targetCode) {
            openAdminPanel();
            inputSequence = ""; // reset la saisie
        }
        
        // Anti-bug : évite d'accumuler une suite infinie si on se trompe
        if (inputSequence.length > targetCode.length) {
            inputSequence = "";
        }
    }
});

// Quand on relâche les touches
window.addEventListener("keyup", (e) => {
    if (e.key.toLowerCase() === "c") {
        isCPressed = false;
        inputSequence = ""; // Annule la séquence si on lâche C
    }
});

// Fermeture de la modale
closeAdmin.addEventListener("click", () => {
    adminModal.classList.remove("open");
});

function openAdminPanel() {
    adminModal.classList.add("open");
    
    // On pré-remplit les inputs de la modale avec les valeurs actuelles du tableau
    document.getElementById("input-slogan").value = document.getElementById("country-slogan").innerText;
    document.getElementById("input-flag").value = document.getElementById("country-flag").src;
    document.getElementById("input-score-1").value = parseInt(document.getElementById("score-1").innerText);
    document.getElementById("input-score-2").value = parseInt(document.getElementById("score-2").innerText);
}

// ==========================================================================
// SYNC FIREBASE : ENVOI DES DONNÉES (ADMIN)
// ==========================================================================
const saveBtn = document.getElementById("save-admin-btn");

saveBtn.addEventListener("click", () => {
    const sloganValue = document.getElementById("input-slogan").value;
    const flagValue = document.getElementById("input-flag").value;
    const score1Value = parseInt(document.getElementById("input-score-1").value) || 0;
    const score2Value = parseInt(document.getElementById("input-score-2").value) || 0;

    // Envoi à la racine de la Realtime Database
    database.ref("scoreboard").set({
        slogan: sloganValue,
        flagUrl: flagValue,
        score1: score1Value,
        score2: score2Value
    }).then(() => {
        // Ferme la modale une fois enregistré
        adminModal.classList.remove("open");
    }).catch((error) => {
        alert("Erreur Firebase : " + error.message);
    });
});

// ==========================================================================
// SYNC FIREBASE : RÉCEPTION EN TEMPS RÉEL (TOUT LE MONDE)
// ==========================================================================
// Cette fonction écoute Firebase en permanence. Dès qu'un admin change une valeur,
// l'écran se met à jour instantanément chez TOUS les utilisateurs connectés.
database.ref("scoreboard").on("value", (snapshot) => {
    const data = snapshot.val();
    
    if (data) {
        if (data.slogan) document.getElementById("country-slogan").innerText = data.slogan;
        if (data.flagUrl) document.getElementById("country-flag").src = data.flagUrl;
        
        // Formatage des scores pour toujours avoir 2 chiffres (Ex: 04 au lieu de 4)
        if (data.score1 !== undefined) {
            document.getElementById("score-1").innerText = String(data.score1).padStart(2, '0');
        }
        if (data.score2 !== undefined) {
            document.getElementById("score-2").innerText = String(data.score2).padStart(2, '0');
        }
    }
});
