// Gestion de la sélection du créneau horaire
function selectTime(element, time) {
    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
    element.classList.add('selected');
    document.getElementById('time').value = time;
    updateSummary();
}

// Mise à jour du résumé de réservation en temps réel
function updateSummary() {
    // Salon
    const salonSelect = document.getElementById('salon');
    const salonText = salonSelect.options[salonSelect.selectedIndex].text;
    document.getElementById('summarySalon').textContent = salonSelect.value ? salonText : 'Non sélectionné';

    // Service
    const serviceSelect = document.getElementById('service');
    const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
    document.getElementById('summaryService').textContent = serviceSelect.value ? serviceText : 'Non sélectionné';

    // Date
    const dateValue = document.getElementById('date').value;
    if(dateValue) {
        const dateObj = new Date(dateValue + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('summaryDate').textContent = formattedDate;
    } else {
        document.getElementById('summaryDate').textContent = 'Non sélectionnée';
    }

    // Heure
    const timeValue = document.getElementById('time').value;
    document.getElementById('summaryTime').textContent = timeValue || 'Non sélectionnée';

    // Nom
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const fullName = (firstName + ' ' + lastName).trim();
    document.getElementById('summaryName').textContent = fullName || 'Non fourni';

    // Email
    const email = document.getElementById('email').value;
    document.getElementById('summaryEmail').textContent = email || 'Non fourni';
}

// Écouteurs d'événements - Mise à jour au changement
document.getElementById('salon').addEventListener('change', updateSummary);
document.getElementById('service').addEventListener('change', updateSummary);
document.getElementById('date').addEventListener('change', updateSummary);
document.getElementById('firstName').addEventListener('input', updateSummary);
document.getElementById('lastName').addEventListener('input', updateSummary);
document.getElementById('email').addEventListener('input', updateSummary);

// Gestion de la soumission du formulaire
document.getElementById('reservationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const salon = document.getElementById('salon').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;

    if(!salon || !service || !date || !time) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }

    // Log les données dans la console avec formatage
    const reservationData = {
        'Salon': document.getElementById('salon').options[document.getElementById('salon').selectedIndex].text,
        'Service': document.getElementById('service').options[document.getElementById('service').selectedIndex].text,
        'Date': document.getElementById('summaryDate').textContent,
        'Heure': time,
        'Prénom': firstName,
        'Nom': lastName,
        'Email': email,
        'Téléphone': document.getElementById('phone').value,
        'Notes': document.getElementById('notes').value || 'Aucune'
    };

    console.log('%c=== RÉSERVATION CONFIRMÉE ===', 'color: #BADFDB; font-size: 16px; font-weight: bold;');
    console.table(reservationData);
    console.log('%cDonnées complètes:', 'color: #FFA4A4; font-weight: bold;', reservationData);

    // Afficher le pop-up
    const popup = document.getElementById('reservationPopup');
    if (popup) {
        popup.classList.add('active');
        popup.setAttribute('aria-hidden', 'false');
    }

    // Réinitialiser le formulaire
    this.reset();
    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
});

// Gestion du bouton de fermeture du pop-up
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('reservationPopup');
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
});

// Définir la date minimum à aujourd'hui
const today = new Date().toISOString().split('T')[0];
document.getElementById('date').setAttribute('min', today);

// Récupérer les paramètres d'URL et pré-remplir le formulaire
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Mappage des valeurs d'URL vers les options du formulaire
const salonMap = {
    'essence': 'essence',
    'bella': 'bella',
    'luxe': 'luxe',
    'grace': 'grace',
    'style': 'style',
    'cheveux': 'cheveux',
    'glow': 'glow',
    'institut': 'institut',
    'nails': 'nails',
    'ongles': 'ongles',
    'domicile': 'domicile',
    'pro': 'pro',
    'express': 'express'
};

const serviceMap = {
    'coupe': 'coupe',
    'coloration': 'coloration',
    'massage': 'massage',
    'soinvisage': 'soinvisage',
    'manucure': 'manucure',
    'pedicure': 'pedicure'
};

// Pré-remplir le salon et le service si fournis dans l'URL
window.addEventListener('DOMContentLoaded', function() {
    const salonParam = getUrlParameter('salon');
    const serviceParam = getUrlParameter('service');

    if(salonParam && salonMap[salonParam]) {
        document.getElementById('salon').value = salonMap[salonParam];
    }

    if(serviceParam && serviceMap[serviceParam]) {
        document.getElementById('service').value = serviceMap[serviceParam];
    }

    updateSummary();
});

// Appel initial pour afficher les valeurs par défaut
document.addEventListener('DOMContentLoaded', updateSummary);
