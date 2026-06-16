document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".ad-slide");
    const dots = document.querySelectorAll(".dot");
    let currentSlide = 0;
    const slideIntervalTime = 5000; // Les pubs changent toutes les 5 secondes
    let slideInterval;

    // Fonction pour changer de pub et afficher son texte
    function changeSlide(nextSlideIndex) {
        // Retire le mode actif de la pub actuelle
        slides[currentSlide].classList.remove("active");
        dots[currentSlide].classList.remove("active");

        // Passe à la pub suivante
        currentSlide = nextSlideIndex;

        // Active la nouvelle pub (le CSS va automatiquement afficher le titre/desc)
        slides[currentSlide].classList.add("active");
        dots[currentSlide].classList.add("active");
    }

    // Fonction pour passer automatiquement à la suivante
    function nextSlide() {
        let nextSlideIndex = (currentSlide + 1) % slides.length;
        changeSlide(nextSlideIndex);
    }

    // Lance le défilement automatique
    function startInterval() {
        slideInterval = setInterval(nextSlide, slideIntervalTime);
    }

    // Relance le compteur si on clique manuellement sur un point
    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    // Permet de cliquer sur les points en bas pour changer de pub
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            if (currentSlide !== index) {
                changeSlide(index);
                resetInterval();
            }
        });
    });

    // Initialisation au chargement de la page
    startInterval();
});
