document.addEventListener("DOMContentLoaded", () => {
  const btnSubmit = document.getElementById("btn-submit-code");
  const codeInput = document.getElementById("sneak-code");
  const appContainer = document.getElementById("app-container");

  const SECRET_CODE = "EarlyAccess85";
  let selectedElement = null; // Stocke l'élément en cours de modification

  btnSubmit.addEventListener("click", () => {
    if (codeInput.value.trim() === SECRET_CODE) {
      loadEditor();
    } else {
      alert("Code incorrect !");
      codeInput.value = "";
    }
  });

  function loadEditor() {
    appContainer.innerHTML = `
      <div class="editor-container">
        <h1>Éditeur HTML & Design Avancé</h1>
        <p class="editor-subtitle">Cliquez sur un outil pour l'ajouter, puis cliquez sur l'élément dans l'aperçu pour le personnaliser.</p>
        
        <div class="editor-layout">
          <div class="editor-sidebar">
            <h3>Ajouter</h3>
            <button id="add-box" class="btn-tool">📦 Box (Conteneur vide)</button>
            <button id="add-frame" class="btn-tool">🖼️ Frame (Cadre vide)</button>
            <button id="add-text" class="btn-tool">📝 Texte simple</button>
            <hr>
            <button id="btn-finish" class="btn-finish">💾 Finir & Exporter</button>
          </div>
          
          <div class="editor-preview-pane">
            <h3>Aperçu en direct (Sélectionnez un élément pour le modifier) :</h3>
            <div id="sandbox-preview" class="sandbox">
              <p class="empty-notice">La page est vide. Ajoutez des éléments !</p>
            </div>
          </div>

          <div class="editor-inspector" id="editor-inspector">
            <h3>Propriétés</h3>
            <p class="inspector-notice">Aucun élément sélectionné.</p>
            <div id="inspector-controls" style="display:none;">
              
              <div id="box-options">
                <label>Largeur (%) : <input type="range" id="prop-width" min="10" max="100" value="100"></label>
                <label>Hauteur (px) : <input type="number" id="prop-height" min="20" max="500" value="100"></label>
                <label>Angles arrondis (px) : <input type="range" id="prop-radius" min="0" max="50" value="6"></label>
                <label>Couleur du fond : <input type="color" id="prop-bgcolor" value="#f0f2f5"></label>
                <label>Transparence fond : <input type="range" id="prop-opacity" min="0" max="100" value="100"></label>
              </div>

              <div id="text-options" style="margin-top:15px;">
                <label>Contenu texte : <input type="text" id="prop-text-content" placeholder="Mon texte..."></label>
                <label>Police : 
                  <select id="prop-font">
                    <option value="Arial">Arial</option>
                    <option value="'Helvetica Neue'">Helvetica</option>
                    <option value="'Times New Roman'">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Courier New">Monospace</option>
                  </select>
                </label>
                <label>Taille du texte (px) : <input type="number" id="prop-size" min="8" max="72" value="16"></label>
                <label>Couleur du texte : <input type="color" id="prop-color" value="#111111"></label>
                <div class="checkbox-group">
                  <label><input type="checkbox" id="prop-bold"> Gras</label>
                  <label><input type="checkbox" id="prop-underline"> Souligné</label>
                </div>
              </div>

              <button id="prop-delete" class="btn-delete" style="margin-top:20px;">🗑️ Supprimer l'élément</button>
            </div>
          </div>
        </div>
      </div>
    `;

    initEditorLogic();
  }

  function initEditorLogic() {
    const sandbox = document.getElementById("sandbox-preview");
    const inspector = document.getElementById("editor-inspector");
    const controls = document.getElementById("inspector-controls");
    const notice = inspector.querySelector(".inspector-notice");

    // Inputs Propriétés
    const pWidth = document.getElementById("prop-width");
    const pHeight = document.getElementById("prop-height");
    const pRadius = document.getElementById("prop-radius");
    const pBgcolor = document.getElementById("prop-bgcolor");
    const pOpacity = document.getElementById("prop-opacity");
    const pTextContent = document.getElementById("prop-text-content");
    const pFont = document.getElementById("prop-font");
    const pSize = document.getElementById("prop-size");
    const pColor = document.getElementById("prop-color");
    const pBold = document.getElementById("prop-bold");
    const pUnderline = document.getElementById("prop-underline");

    function removeEmptyNotice() {
      const empty = sandbox.querySelector(".empty-notice");
      if (empty) empty.remove();
    }

    // Gestion du clic pour sélectionner un élément dans la sandbox
    sandbox.addEventListener("click", (e) => {
      e.stopPropagation();
      if (e.target === sandbox || e.target.classList.contains("empty-notice")) return;

      // On enlève l'ancienne sélection
      if (selectedElement) selectedElement.classList.remove("selected-target");

      selectedElement = e.target;
      selectedElement.classList.add("selected-target");

      // Afficher le panneau de configuration
      notice.style.display = "none";
      controls.style.display = "block";

      // Adapter les champs visibles
      const isText = selectedElement.tagName === "P" || selectedElement.tagName === "SPAN";
      document.getElementById("box-options").style.display = isText ? "none" : "block";

      // Charger les valeurs actuelles de l'élément sélectionné dans le panneau
      pTextContent.value = selectedElement.innerText || selectedElement.textContent;
      pSize.value = parseInt(window.getComputedStyle(selectedElement).fontSize) || 16;
      pFont.value = window.getComputedStyle(selectedElement).fontFamily.replace(/"/g, "");
      pBold.checked = window.getComputedStyle(selectedElement).fontWeight === "700" || window.getComputedStyle(selectedElement).fontWeight === "bold";
      pUnderline.checked = window.getComputedStyle(selectedElement).textDecoration.includes("underline");
      
      if (!isText) {
        pHeight.value = parseInt(window.getComputedStyle(selectedElement).height) || 100;
        pRadius.value = parseInt(window.getComputedStyle(selectedElement).borderRadius) || 0;
      }
    });

    // Événements de mise à jour en direct depuis l'inspecteur
    pTextContent.addEventListener("input", () => { if(selectedElement) selectedElement.textContent = pTextContent.value; });
    pSize.addEventListener("input", () => { if(selectedElement) selectedElement.style.fontSize = pSize.value + "px"; });
    pFont.addEventListener("change", () => { if(selectedElement) selectedElement.style.fontFamily = pFont.value; });
    pColor.addEventListener("input", () => { if(selectedElement) selectedElement.style.color = pColor.value; });
    pBold.addEventListener("change", () => { if(selectedElement) selectedElement.style.fontWeight = pBold.checked ? "bold" : "normal"; });
    pUnderline.addEventListener("change", () => { if(selectedElement) selectedElement.style.textDecoration = pUnderline.checked ? "underline" : "none"; });
    
    pWidth.addEventListener("input", () => { if(selectedElement) selectedElement.style.width = pWidth.value + "%"; });
    pHeight.addEventListener("input", () => { if(selectedElement) selectedElement.style.height = pHeight.value + "px"; });
    pRadius.addEventListener("input", () => { if(selectedElement) selectedElement.style.borderRadius = pRadius.value + "px"; });
    
    // Mixage couleur + opacité
    function updateBackground() {
      if(!selectedElement) return;
      const hex = pBgcolor.value;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const alpha = pOpacity.value / 100;
      selectedElement.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    pBgcolor.addEventListener("input", updateBackground);
    pOpacity.addEventListener("input", updateBackground);

    // Supprimer l'élément sélectionné
    document.getElementById("prop-delete").addEventListener("click", () => {
      if (selectedElement) {
        selectedElement.remove();
        selectedElement = null;
        controls.style.display = "none";
        notice.style.display = "block";
        if (sandbox.children.length === 0) {
          sandbox.innerHTML = '<p class="empty-notice">La page est vide. Ajoutez des éléments !</p>';
        }
      }
    });

    // BOUTONS D'AJOUT
    document.getElementById("add-box").addEventListener("click", () => {
      removeEmptyNotice();
      const box = document.createElement("div");
      box.className = "custom-box-generated";
      box.style.width = "100%";
      box.style.height = "100px";
      box.style.backgroundColor = "rgba(240, 242, 245, 1)";
      box.style.borderRadius = "6px";
      box.textContent = "Conteneur (Box)";
      sandbox.appendChild(box);
    });

    document.getElementById("add-frame").addEventListener("click", () => {
      removeEmptyNotice();
      const frame = document.createElement("div");
      frame.className = "custom-frame-generated";
      frame.style.width = "100%";
      frame.style.height = "100px";
      frame.style.border = "2px dashed #0070f3";
      frame.style.backgroundColor = "rgba(240, 247, 255, 1)";
      frame.style.borderRadius = "6px";
      frame.textContent = "Cadre (Frame)";
      sandbox.appendChild(frame);
    });

    document.getElementById("add-text").addEventListener("click", () => {
      removeEmptyNotice();
      const text = document.createElement("p");
      text.className = "custom-text-generated";
      text.textContent = "Nouveau texte éditable";
      text.style.fontSize = "16px";
      text.style.color = "#111111";
      sandbox.appendChild(text);
    });

    // EXPORTATION FINALE NETTOYÉE
    document.getElementById("btn-finish").addEventListener("click", () => {
      // Retirer les contours de sélection avant export
      if (selectedElement) selectedElement.classList.remove("selected-target");
      
      const cleanContent = sandbox.innerHTML;

      const finalHTMLCode = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Personnalisée</title>
  <style>
    body {
      font-family: sans-serif;
      background-color: #f4f4f9;
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
    .custom-box-generated, .custom-frame-generated {
      margin-bottom: 15px;
      padding: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
    .custom-text-generated {
      margin-bottom: 12px;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    ${cleanContent}
  </div>
</body>
</html>`;

      appContainer.innerHTML = `
        <div class="bubble export-box">
          <h1>🎉 Code HTML/CSS Exporté !</h1>
          <p style="margin-bottom: 15px; color:#555;">Votre design sur mesure est prêt. Copiez le code ci-dessous :</p>
          <textarea readonly id="html-code-output" style="width:100%; height:250px; font-family:monospace; padding:10px; border-radius:6px; border:1px solid #ccc; resize:none;">${finalHTMLCode}</textarea>
          <button id="btn-copy" class="btn-tool" style="margin-top:15px; background:#0070f3; color:white; font-weight:bold; width:100%; text-align:center;">📋 Copier le code</button>
          <button onclick="window.location.reload();" class="btn-tool" style="margin-top:10px; background:#666; color:white; width:100%; text-align:center;">⬅️ Retour</button>
        </div>
      `;

      document.getElementById("btn-copy").addEventListener("click", () => {
        const copyText = document.getElementById("html-code-output");
        copyText.select();
        document.execCommand("copy");
        alert("Code copié avec succès !");
      });
    });
  }
});
