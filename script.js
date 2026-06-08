document.addEventListener("DOMContentLoaded", () => {
  const btnSubmit = document.getElementById("btn-submit-code");
  const codeInput = document.getElementById("sneak-code");
  const appContainer = document.getElementById("app-container");

  // Code secret
  const SECRET_CODE = "EarlyAccess85";

  btnSubmit.addEventListener("click", () => {
    if (codeInput.value.trim() === SECRET_CODE) {
      loadEditor();
    } else {
      alert("Code incorrect !");
      codeInput.value = "";
    }
  });

  // Fonction qui remplace l'écran de maintenance par l'éditeur visuel
  function loadEditor() {
    appContainer.innerHTML = `
      <div class="editor-container">
        <h1>Éditeur HTML Simplifié</h1>
        <p class="editor-subtitle">Composez votre page visuellement, puis cliquez sur Finir pour générer le code.</p>
        
        <div class="editor-layout">
          <div class="editor-sidebar">
            <h3>Ajouter des éléments</h3>
            <button id="add-title" class="btn-tool">✨ Titre (H1)</button>
            <button id="add-text" class="btn-tool">📝 Paragraphe de texte</button>
            <button id="add-box" class="btn-tool">📦 Conteneur (Box)</button>
            <button id="add-frame" class="btn-tool">🖼️ Frame (Bordure)</button>
            <hr>
            <button id="btn-finish" class="btn-finish">💾 Finir & Exporter</button>
          </div>
          
          <div class="editor-preview-pane">
            <h3>Aperçu en direct :</h3>
            <div id="sandbox-preview" class="sandbox">
              <p class="empty-notice">La page est vide. Cliquez sur les outils à gauche pour ajouter du contenu !</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attacher les événements de l'éditeur
    initEditorLogic();
  }

  function initEditorLogic() {
    const sandbox = document.getElementById("sandbox-preview");

    function removeEmptyNotice() {
      const notice = sandbox.querySelector(".empty-notice");
      if (notice) notice.remove();
    }

    // Ajouter un Titre
    document.getElementById("add-title").addEventListener("click", () => {
      removeEmptyNotice();
      const text = prompt("Entrez le texte de votre titre :", "Mon Super Titre");
      if (text) {
        const h1 = document.createElement("h1");
        h1.textContent = text;
        sandbox.appendChild(h1);
      }
    });

    // Ajouter un Paragraphe
    document.getElementById("add-text").addEventListener("click", () => {
      removeEmptyNotice();
      const text = prompt("Entrez votre paragraphe de texte :", "Ceci est un exemple de paragraphe.");
      if (text) {
        const p = document.createElement("p");
        p.textContent = text;
        sandbox.appendChild(p);
      }
    });

    // Ajouter une Box (Boîte grise stylisée)
    document.getElementById("add-box").addEventListener("click", () => {
      removeEmptyNotice();
      const text = prompt("Texte à mettre à l'intérieur de la box :", "Contenu de la boîte");
      if (text) {
        const div = document.createElement("div");
        div.className = "custom-box";
        div.textContent = text;
        sandbox.appendChild(div);
      }
    });

    // Ajouter une Frame (Un cadre avec bordure)
    document.getElementById("add-frame").addEventListener("click", () => {
      removeEmptyNotice();
      const text = prompt("Texte à mettre à l'intérieur du cadre :", "Contenu encadré");
      if (text) {
        const div = document.createElement("div");
        div.className = "custom-frame";
        div.textContent = text;
        sandbox.appendChild(div);
      }
    });

    // Action finale : Générer le package HTML complet avec CSS inclus
    document.getElementById("btn-finish").addEventListener("click", () => {
      // Nettoyage temporaire pour récupérer uniquement les éléments utilisateur
      const userContent = sandbox.innerHTML;

      // Création du modèle HTML final intégrant directement le CSS nécessaire
      const finalHTMLCode = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Générée</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f4f4f9;
      color: #333;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
    }
    .wrapper {
      max-width: 800px;
      width: 100%;
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    h1 {
      color: #111;
      font-size: 28px;
      margin-bottom: 20px;
      border-bottom: 2px solid #eaeaea;
      padding-bottom: 10px;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 15px;
    }
    .custom-box {
      background: #f0f2f5;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 15px;
      font-weight: 500;
    }
    .custom-frame {
      border: 2px dashed #0070f3;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 15px;
      background: #f0f7ff;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    ${userContent}
  </div>
</body>
</html>`;

      // Afficher le résultat dans une fenêtre d'export propre pour l'utilisateur
      appContainer.innerHTML = `
        <div class="bubble export-box">
          <h1>🎉 Code HTML/CSS Prêt !</h1>
          <p style="margin-bottom: 15px; color:#555;">Copiez le code ci-dessous pour l'utiliser où vous le souhaitez :</p>
          <textarea readonly id="html-code-output" style="width:100%; height:250px; font-family:monospace; padding:10px; border-radius:6px; border:1px solid #ccc; resize:none;">${finalHTMLCode}</textarea>
          <button id="btn-copy" class="btn-tool" style="margin-top:15px; background:#0070f3; color:white; font-weight:bold;">📋 Copier le code</button>
          <button onclick="window.location.reload();" class="btn-tool" style="margin-top:10px; background:#666; color:white;">⬅️ Retour</button>
        </div>
      `;

      // Gestion du bouton copier
      document.getElementById("btn-copy").addEventListener("click", () => {
        const copyText = document.getElementById("html-code-output");
        copyText.select();
        document.execCommand("copy");
        alert("Code copié dans le presse-papiers !");
      });
    });
  }
});
