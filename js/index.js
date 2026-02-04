// Gestion de la recherche
function handleSearch(event) {
    event.preventDefault();
    const searchQuery = document.querySelector('#searchInput') || document.querySelector('input[name="q"]');
    if (searchQuery && searchQuery.value.trim()) {
        window.location.href = 'search.html?q=' + encodeURIComponent(searchQuery.value.trim());
        return false;
    }
    return false;
}

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
            let $section = $(this);
            let sectionTop = $section.offset().top - 150;

            if($(window).scrollTop() >= sectionTop) {
                current = $section.attr('id');
            }
        });

        // Supprimer la classe active de tous les liens
        $('.nav-link').removeClass('active');

        // Ajouter la classe active au lien correspondant
        if(current) {
            $('a[href="#' + current + '"]').addClass('active');
        }
    });
});


// Abonnement newsletter
document.addEventListener('DOMContentLoaded', function() {
    const subscribeForm = document.getElementById('subscribeForm');
    const popup = document.getElementById('subscribePopup');
    const popupCloseBtn = document.getElementById('popupCloseBtn');

    function closePopup() {
        if (popup) {
            popup.classList.remove('active');
            popup.setAttribute('aria-hidden', 'true');
        }
    }

    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                closePopup();
            }
        });
    }

    if (popupCloseBtn) {
        popupCloseBtn.addEventListener('click', closePopup);
    }

    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('subscribeEmail');
            const emailValue = emailInput ? emailInput.value.trim() : '';
            if (!emailValue) {
                alert('Veuillez saisir une adresse e-mail valide.');
                return;
            }
            console.log('Nouvel abonnement:', emailValue);
            if (popup) {
                popup.classList.add('active');
                popup.setAttribute('aria-hidden', 'false');
            }
            subscribeForm.reset();
        });
    }
});

// Contact
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const contactPopup = document.getElementById('contactPopup');
    const contactPopupCloseBtn = document.getElementById('contactPopupCloseBtn');

    function closeContactPopup() {
        if (contactPopup) {
            contactPopup.classList.remove('active');
            contactPopup.setAttribute('aria-hidden', 'true');
        }
    }

    if (contactPopup) {
        contactPopup.addEventListener('click', function(e) {
            if (e.target === contactPopup) {
                closeContactPopup();
            }
        });
    }

    if (contactPopupCloseBtn) {
        contactPopupCloseBtn.addEventListener('click', closeContactPopup);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fullName = document.getElementById('full-name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const message = document.getElementById('message')?.value.trim();

            if (!fullName || !email || !message) {
                alert('Veuillez remplir tous les champs.');
                return;
            }

            console.log('Message contact:', { fullName, email, message });

            if (contactPopup) {
                contactPopup.classList.add('active');
                contactPopup.setAttribute('aria-hidden', 'false');
            }

            contactForm.reset();
        });
    }
});
