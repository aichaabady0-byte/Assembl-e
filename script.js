document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".ad-slide");
    const dots = document.querySelectorAll(".dot");
    let currentSlide = 0;
    const slideIntervalTime = 5000; // 5 secondes par pub
    let slideInterval;

    // Fonction pour changer de diapositive
    function changeSlide(nextSlideIndex) {
        // Retire la classe active de la slide et du point actuels
        slides[currentSlide].classList.remove("active");
        dots[currentSlide].classList.remove("active");

        // Met à jour l'index actuel
        currentSlide = nextSlideIndex;

        // Ajoute la classe active sur la nouvelle slide et le nouveau point
        slides[currentSlide].classList.add("active");
        dots[currentSlide].classList.add("active");
    }

    // Passage automatique à la suivante
    function nextSlide() {
        let nextSlideIndex = (currentSlide + 1) % slides.length;
        changeSlide(nextSlideIndex);
    }

    // Démarrer le défilement automatique
    function startInterval() {
        slideInterval = setInterval(nextSlide, slideIntervalTime);
    }

    // Réinitialiser le chronomètre quand l'utilisateur clique manuellement
    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    // Rendre les points (dots) cliquables
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            if (currentSlide !== index) {
                changeSlide(index);
                resetInterval();
            }
        });
    });

    // Initialisation
    startInterval();
});
