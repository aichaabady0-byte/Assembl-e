document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app-container");
  let selectedElement = null;

  // ==========================================================
  // ANIMATION DES POINTS EN ARRIÈRE-PLAN (EFFET DEFILLEMENT/PUBS)
  // ==========================================================
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  let particlesArray = [];
  const numberOfParticles = 45; // Nombre de points à l'écran

  // Redimensionnement automatique
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Objet Particule
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 4 + 2; // Taille des points
      this.speedX = Math.random() * 0.6 - 0.3; // Vitesse défilement X
      this.speedY = Math.random() * 0.6 - 0.3; // Vitesse défilement Y
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Rebondir sur les bords de l'écran
      if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
      if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    draw() {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'; // Points blancs semi-transparents
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Initialisation des points
  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  // Boucle d'animation
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner et lier les points proches par des lignes fines
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
      
      for (let j = i; j < particlesArray.length; j++) {
        const dx = particlesArray[i].x - particlesArray[j].x;
        const dy = particlesArray[i].y - particlesArray[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 110) { // Si deux points sont proches, on trace un lien
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 - (distance/110) * 0.15})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
          ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();

  // ==========================================================
  // FONCTION DE L'ÉDITEUR (Prête au cas où tu en as besoin)
  // ==========================================================
  window.loadEditor = function() {
    // Si tu veux lancer l'éditeur depuis ta propre fonction/bouton caché,
    // il te suffira d'exécuter la commande : loadEditor();
    canvas.style.display = "none"; // Coupe l'animation pour laisser la place
    appContainer.innerHTML = `
      <div class="editor-container">
        <h1>Éditeur HTML & Design Avancé</h1>
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
            <div id="sandbox-preview" class="sandbox">
              <p class="empty-notice">La page est vide.</p>
            </div>
          </div>
          <div class="editor-inspector" id="editor-inspector">
            <h3>Propriétés</h3>
            <div id="inspector-controls">
               <p>Sélectionnez un élément inséré pour ajuster sa transparence, sa taille, ses angles et ses polices.</p>
            </div>
          </div>
        </div>
      </div>
    `;
    // La logique interne reste disponible si appelée.
  }
});
