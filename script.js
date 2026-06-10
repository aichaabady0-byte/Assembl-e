document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll('.ad-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  const slideInterval = 5000; // Temps d'affichage par pub (5 secondes)

  function nextSlide() {
    // Retirer la classe active de la pub et du point actuel
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Passer à la suivante (et revenir à 0 si on dépasse)
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Ajouter la classe active sur la nouvelle pub et le nouveau point
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  // Lancer le défilement automatique
  setInterval(nextSlide, slideInterval);

  // Permettre aussi de cliquer sur les points pour changer manuellement de pub
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      
      currentSlide = index;
      
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    });
  });
});
