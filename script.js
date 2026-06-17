document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".ad-slide");
    const dots = document.querySelectorAll(".dot");
    let currentSlide = 0;
    const intervalTime = 5000; // Change de pub toutes les 5 secondes
    let slideInterval;

    function showSlide(index) {
        // Enlève la classe active partout
        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));

        // Active la diapo demandée
        slides[index].classList.add("active");
        dots[index].classList.add("active");
        currentSlide = index;
    }

    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    // Gestion du clic manuel sur les points (dots)
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            clearInterval(slideInterval); // Relance le chrono après un clic
            slideInterval = setInterval(nextSlide, intervalTime);
        });
    });

    // Lance le défilement automatique
    slideInterval = setInterval(nextSlide, intervalTime);
});
