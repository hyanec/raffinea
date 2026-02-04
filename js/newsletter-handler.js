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
                alert('Veuillez entrer une adresse email valide.');
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