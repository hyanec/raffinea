// Animation des mots - Section À propos
$(document).ready(function() {
    const words = $('.animated-word');
    let currentIndex = 0;
    
    function animateNextWord() {
        // Réinitialiser tous les mots
        words.css({
            'animation': 'none',
            'opacity': '0',
            'transform': 'translateY(-50px)'
        });
        
        // Forcer un reflow pour relancer l'animation
        words[currentIndex].offsetHeight;
        
        // Lancer l'animation sur le mot actuel
        $(words[currentIndex]).css({
            'animation': 'wordFall 3s ease-in-out forwards'
        });
        
        // Passer au mot suivant
        currentIndex = (currentIndex + 1) % words.length;
    }
    
    // Démarrer l'animation
    animateNextWord();
    setInterval(animateNextWord, 3000);

    // Script de défilement fluide pour tous les liens avec ancres
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.getAttribute('href'));
        if(target.length) {
            e.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 1000);
            
            // Fermer le menu mobile si ouvert
            if($('.navbar-collapse').hasClass('show')) {
                $('.navbar-toggler').click();
            }
        }
    });

    // Détection de la section active au défilement
    $(window).on('scroll', function() {
        let current = '';
        
        $('section').each(function() {
            const sectionTop = $(this).offset().top;
            const sectionHeight = $(this).height();
            if($(window).scrollTop() >= (sectionTop - 150)) {
                current = $(this).attr('id');
            }
        });
        
        // Supprimer la classe active de tous les liens
        $('.nav-link').removeClass('active');
        
        // Ajouter la classe active au lien correspondant
        if(current) {
            $('.nav-link[href="#' + current + '"]').addClass('active');
        }
    });
});