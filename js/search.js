// Données des salons par catégorie
const salonsData = {
    'coiffure': [
        { id: 1, name: 'Essence Coiffure', city: 'Casablanca', lat: 33.5731, lng: -7.5898, rating: 4.8, reviews: 125, price: 390, image: 'images/salon1.jpg' },
        { id: 2, name: 'Style Créatif', city: 'Rabat', lat: 34.0209, lng: -6.8416, rating: 4.6, reviews: 92, price: 350, image: 'images/salon2.jpg' },
        { id: 3, name: 'Cheveux & Cie', city: 'Marrakech', lat: 31.6295, lng: -8.0088, rating: 4.9, reviews: 156, price: 420, image: 'images/salon3.jpg' },
        { id: 4, name: 'Studio Glow', city: 'Fès', lat: 34.0637, lng: -5.0048, rating: 4.7, reviews: 87, price: 380, image: 'images/ongles1.jpg' },
    ],
    'beaute': [
        { id: 5, name: 'Bella Beauté', city: 'Rabat', lat: 34.0209, lng: -6.8416, rating: 4.8, reviews: 98, price: 450, image: 'images/ongle2.jpg' },
        { id: 6, name: 'Luxe & Spa', city: 'Marrakech', lat: 31.6295, lng: -8.0088, rating: 4.9, reviews: 156, price: 750, image: 'images/massage3.jpg' },
        { id: 7, name: 'Institut Prémium', city: 'Casablanca', lat: 33.5731, lng: -7.5898, rating: 4.7, reviews: 134, price: 600, image: 'images/image3.jpg' },
    ],
    'ongles': [
        { id: 8, name: 'Style & Grace', city: 'Fès', lat: 34.0637, lng: -5.0048, rating: 4.8, reviews: 87, price: 250, image: 'images/image2.jpg' },
        { id: 9, name: 'Nails Art Studio', city: 'Casablanca', lat: 33.5731, lng: -7.5898, rating: 4.6, reviews: 76, price: 300, image: 'images/ongles1.jpg' },
        { id: 10, name: 'Ongles Brillants', city: 'Rabat', lat: 34.0209, lng: -6.8416, rating: 4.7, reviews: 92, price: 280, image: 'images/ongle2.jpg' },
    ],
    'specialistes': [
        { id: 11, name: 'Beauté à Domicile', city: 'Casablanca', lat: 33.5731, lng: -7.5898, rating: 4.9, reviews: 203, price: 550, image: 'images/coiffure.jpg' },
        { id: 12, name: 'Professionnelle Indépendante', city: 'Marrakech', lat: 31.6295, lng: -8.0088, rating: 4.8, reviews: 165, price: 500, image: 'images/maquillage1.jpg' },
        { id: 13, name: 'Service Express', city: 'Rabat', lat: 34.0209, lng: -6.8416, rating: 4.7, reviews: 112, price: 400, image: 'images/massage1.jpg' },
    ]
};

const categories = {
    'coiffure': 'Coiffure',
    'beaute': 'Beauté & Wellness',
    'ongles': 'Ongles & Maquillage',
    'specialistes': 'Spécialistes'
};

let map;
let markers = [];
let currentCategory = 'coiffure';
let currentFilters = {
    category: 'all',
    city: 'all'
};

// Fonction pour convertir le nom du salon en paramètre URL
function getSalonParam(salonName) {
    const salonParams = {
        'Essence Coiffure': 'essence',
        'Style Créatif': 'style',
        'Cheveux & Cie': 'cheveux',
        'Studio Glow': 'glow',
        'Bella Beauté': 'bella',
        'Luxe & Spa': 'luxe',
        'Institut Prémium': 'institut',
        'Style & Grace': 'grace',
        'Nails Art Studio': 'nails',
        'Ongles Brillants': 'ongles',
        'Beauté à Domicile': 'domicile',
        'Professionnelle Indépendante': 'pro',
        'Service Express': 'express'
    };
    return salonParams[salonName] || salonName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
}

// Initialiser la carte
function initMap() {
    map = L.map('map').setView([31.8, -7.5], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
}

// Obtenir les salons filtrés
function getFilteredSalons() {
    let filteredSalons = [];

    if (currentFilters.category === 'all') {
        // Tous les salons de toutes les catégories
        Object.values(salonsData).forEach(salons => {
            filteredSalons = filteredSalons.concat(salons);
        });
    } else {
        // Salons d'une catégorie spécifique
        filteredSalons = salonsData[currentFilters.category] || [];
    }

    // Filtrer par ville si sélectionnée
    if (currentFilters.city !== 'all') {
        filteredSalons = filteredSalons.filter(salon => salon.city === currentFilters.city);
    }

    return filteredSalons;
}

// Afficher les salons filtrés
function displayFilteredSalons() {
    const salons = getFilteredSalons();

    // Mettre à jour le titre et badge
    let categoryText = currentFilters.category === 'all' ? 'Tous les salons' : categories[currentFilters.category];
    if (currentFilters.city !== 'all') {
        categoryText += ` - ${currentFilters.city}`;
    }
    $('#categoryName').text(categoryText);
    $('#pageTitle').text(`${categoryText} - ${salons.length} salons disponibles`);

    // Vider la liste
    $('#salonsList').empty();

    // Vider les marqueurs
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Ajouter les salons à la liste et sur la carte
    if (salons.length === 0) {
        $('#salonsList').html('<div style="padding: 20px; text-align: center; color: #999;">Aucun salon trouvé avec ces filtres.</div>');
    } else {
        salons.forEach((salon) => {
            // Ajouter à la liste
            const salonHtml = `
                <div class="salon-item" data-id="${salon.id}" onclick="highlightSalon(${salon.id})" onmouseenter="hoverSalon(${salon.id})">
                    <img src="${salon.image}" alt="${salon.name}" class="salon-image">
                    <div class="salon-name">${salon.name}</div>
                    <div class="salon-location">
                        <i class="bi bi-geo-alt-fill" style="color: #FFA4A4;"></i>
                        ${salon.city}
                    </div>
                    <div class="salon-rating">
                        <span class="stars">${'★'.repeat(Math.floor(salon.rating))}☆</span>
                        <small class="text-muted">(${salon.reviews} avis)</small>
                    </div>
                    <div class="salon-price">À partir de ${salon.price} MAD</div>
                    <a href="reserver.html?salon=${getSalonParam(salon.name)}" class="btn btn-sm" style="background: #BADFDB; color: #1a1a1a; border: none; border-radius: 20px; width: 100%;">Réserver</a>
                </div>
            `;
            $('#salonsList').append(salonHtml);

            // Ajouter marqueur sur la carte
            const marker = L.marker([salon.lat, salon.lng])
                .bindPopup(`<strong>${salon.name}</strong><br>${salon.city}<br>À partir de ${salon.price} MAD`)
                .addTo(map);

            marker.salonId = salon.id;
            markers.push(marker);
        });

        // Centrer la carte sur les salons
        if (salons.length > 0) {
            const group = new L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.1));
        }
    }
}

// Afficher les salons (ancienne fonction - conservée pour compatibilité)
function displaySalons(category) {
    currentCategory = category;
    currentFilters.category = category;
    currentFilters.city = 'all';

    // Réinitialiser les sélecteurs
    $('#categorySelect').val(category);
    $('#citySelect').val('all');

    displayFilteredSalons();
}

// Surligner un salon
function highlightSalon(salonId) {
    $('.salon-item').removeClass('active');
    $(`.salon-item[data-id="${salonId}"]`).addClass('active');

    const salons = getFilteredSalons();
    const salon = salons.find(s => s.id === salonId);
    if (salon) {
        map.setView([salon.lat, salon.lng], 14);
    }
}

// Fonction de survol pour ajuster la carte
function hoverSalon(salonId) {
    const salons = getFilteredSalons();
    const salon = salons.find(s => s.id === salonId);
    if (salon) {
        map.setView([salon.lat, salon.lng], 14);
    }
}

// Réinitialiser les filtres
function resetFilters() {
    currentFilters.category = 'all';
    currentFilters.city = 'all';
    $('#categorySelect').val('all');
    $('#citySelect').val('all');
    displayFilteredSalons();
}

// Dictionnaire de synonymes pour les services avec mapping vers catégories
const synonymesCategoriesMap = {
    'coiffure': ['coiffure', 'coupe', 'cheuveux', 'style', 'barbier', 'styliste', 'coiffeur', 'salon de coiffure', 'hair'],
    'beaute': ['beauté', 'beauty', 'wellness', 'bien-être', 'spa', 'massage', 'détente', 'relaxation', 'soin', 'institut', 'facial', 'visage'],
    'ongles': ['ongles', 'manucure', 'pédicure', 'nails', 'vernis', 'nail art', 'maquillage', 'makeup'],
    'specialistes': ['domicile', 'indépendant', 'spécialiste', 'professionnel', 'service', 'express', 'mobile']
};

// Fonction pour déterminer la catégorie à partir d'un mot-clé
function getCategoryFromKeyword(keyword) {
    const keywordLower = keyword.toLowerCase().trim();

    for (let category in synonymesCategoriesMap) {
        if (synonymesCategoriesMap[category].some(syn =>
            keywordLower.includes(syn) || syn.includes(keywordLower)
        )) {
            return category;
        }
    }
    return null;
}

// Fonction pour trouver les salons correspondant à la recherche
function searchSalons(query) {
    const queryLower = query.toLowerCase().trim();

    if (!queryLower) {
        return [];
    }

    let allSalons = [];
    Object.values(salonsData).forEach(salons => {
        allSalons = allSalons.concat(salons);
    });

    // 1. Recherche par nom de salon (priorité haute)
    let results = allSalons.filter(salon =>
        salon.name.toLowerCase().includes(queryLower) ||
        salon.city.toLowerCase().includes(queryLower)
    );

    // 2. Si pas de résultats par nom, chercher par catégorie/service
    if (results.length === 0) {
        const matchedCategory = getCategoryFromKeyword(queryLower);

        if (matchedCategory && salonsData[matchedCategory]) {
            // Retourner uniquement les salons de la catégorie correspondante
            results = salonsData[matchedCategory];
        } else {
            // Recherche partielle dans toutes les catégories
            const keywords = queryLower.split(' ');

            for (let keyword of keywords) {
                const cat = getCategoryFromKeyword(keyword);
                if (cat && salonsData[cat]) {
                    results = results.concat(salonsData[cat]);
                }
            }

            // Supprimer les doublons
            results = results.filter((salon, index, self) =>
                index === self.findIndex((s) => s.id === salon.id)
            );
        }
    }

    // 3. Si toujours pas de résultats, afficher un message personnalisé
    if (results.length === 0) {
        console.log('Aucun résultat trouvé pour:', queryLower);
    }

    return results;
}

// Récupérer la requête de recherche depuis l'URL
function getSearchQueryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
}

// Récupérer la catégorie depuis l'URL
function getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category') || 'coiffure';
    return cat;
}

// Afficher les résultats de recherche
function displaySearchResults(query) {
    const salons = searchSalons(query);

    // Mettre à jour le titre
    $('#categoryName').text(`Résultats pour: "${query}"`);
    $('#pageTitle').text(`${salons.length} salon${salons.length !== 1 ? 's' : ''} trouvé${salons.length !== 1 ? 's' : ''}`);

    // Vider la liste
    $('#salonsList').empty();

    // Vider les marqueurs
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Ajouter les salons à la liste et sur la carte
    if (salons.length === 0) {
        $('#salonsList').html('<div style="padding: 20px; text-align: center; color: #999;">Aucun salon trouvé pour cette recherche.</div>');
    } else {
        salons.forEach((salon) => {
            // Ajouter à la liste
            const salonHtml = `
                <div class="salon-item" data-id="${salon.id}" onclick="highlightSalon(${salon.id})" onmouseenter="hoverSalon(${salon.id})">
                    <img src="${salon.image}" alt="${salon.name}" class="salon-image">
                    <div class="salon-name">${salon.name}</div>
                    <div class="salon-location">
                        <i class="bi bi-geo-alt-fill" style="color: #FFA4A4;"></i>
                        ${salon.city}
                    </div>
                    <div class="salon-rating">
                        <span class="stars">${'★'.repeat(Math.floor(salon.rating))}☆</span>
                        <small class="text-muted">(${salon.reviews} avis)</small>
                    </div>
                    <div class="salon-price">À partir de ${salon.price} MAD</div>
                    <a href="reserver.html?salon=${getSalonParam(salon.name)}" class="btn btn-sm" style="background: #BADFDB; color: #1a1a1a; border: none; border-radius: 20px; width: 100%;">Réserver</a>
                </div>
            `;
            $('#salonsList').append(salonHtml);

            // Ajouter marqueur sur la carte
            const marker = L.marker([salon.lat, salon.lng])
                .bindPopup(`<strong>${salon.name}</strong><br>${salon.city}<br>À partir de ${salon.price} MAD`)
                .addTo(map);

            marker.salonId = salon.id;
            markers.push(marker);
        });

        // Centrer la carte sur les salons
        if (salons.length > 0) {
            const group = new L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.1));
        }
    }
}

// Initialiser
$(document).ready(function() {
    initMap();

    const searchQuery = getSearchQueryFromURL();
    const category = getCategoryFromURL();

    if (searchQuery) {
        // Afficher les résultats de recherche
        displaySearchResults(searchQuery);
    } else {
        // Afficher les résultats par catégorie
        displaySalons(category);
    }

    // Ajouter les événements de changement de filtres
    $('#categorySelect').on('change', function() {
        currentFilters.category = $(this).val();
        displayFilteredSalons();
    });

    $('#citySelect').on('change', function() {
        currentFilters.city = $(this).val();
        displayFilteredSalons();
    });
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
