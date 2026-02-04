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
                alert('Veuillez remplir tous les champs obligatoires.');
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