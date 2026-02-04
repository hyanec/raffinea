// Données des salons par catégorie
const salonsData = {
    'coiffure': [
        { id: 1, name: 'Salon Essence', city: 'Casablanca', lat: 33.5731, lng: -7.5898, rating: 4.8, reviews: 156, price: 450, image: 'images/image1.jpg' },
        { id: 2, name: 'Bella Coiffure', city: 'Rabat', lat: 34.0209, lng: -6.8416, rating: 4.6, reviews: 98, price: 350, image: 'images/image2.jpg' },
        { id: 3, name: 'Style & Grace', city: 'Marrakech', lat: 31.6295, lng: -7.9811, rating: 4.9, reviews: 203, price: 500, image: 'images/coiffure1.jpg' },
        { id: 4, name: 'Studio Glow', city: 'Fès', lat: 34.0637, lng: -5.0048, rating: 4.7, reviews: 87, price: 380, image: 'images/ongles1.jpg' },
    ],
    'beaute': [
        { id: 5, name: 'Luxe Wellness', city: 'Casablanca', lat: 33.5731, lng: -7.5898, rating: 4.9, reviews: 178, price: 800, image: 'images/beaute1.jpg' },
        { id: 6, name: 'Spa Élégance', city: 'Marrakech', lat: 31.6295, lng: -7.9811, rating: 4.8, reviews: 145, price: 650, image: 'images/beaute2.jpg' },
        { id: 7, name: 'Institut Prémium', city: 'Casablanca', lat: 33.5731, lng: -7.5898, rating: 4.7, reviews: 134, price: 600, image: 'images/image3.jpg' },
    ],
    'ongles': [
        { id: 8, name: 'Nails & Beauty', city: 'Casablanca', lat: 33.5731, lng: -7.5898, rating: 4.6, reviews: 112, price: 250, image: 'images/image2.jpg' },
        { id: 9, name: 'Perfect Nails', city: 'Marrakech', lat: 31.6295, lng: -7.9811, rating: 4.8, reviews: 167, price: 300, image: 'images/image1.jpg' },
        { id: 10, name: 'Ongles Brillants', city: 'Rabat', lat: 34.0209, lng: -6.8416, rating: 4.7, reviews: 92, price: 280, image: 'images/ongle2.jpg' },
    ],
    'specialistes': [
        { id: 11, name: 'Beauté à Domicile', city: 'Casablanca', lat: 33.5731, lng: -7.5898, rating: 4.9, reviews: 234, price: 400, image: 'images/coiffure1.jpg' },
        { id: 12, name: 'Pro Express', city: 'Rabat', lat: 34.0209, lng: -6.8416, rating: 4.7, reviews: 156, price: 350, image: 'images/beaute1.jpg' },
        { id: 13, name: 'Service Mobile', city: 'Marrakech', lat: 31.6295, lng: -7.9811, rating: 4.8, reviews: 189, price: 420, image: 'images/beaute2.jpg' },
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
        'Salon Essence': 'essence',
        'Bella Coiffure': 'bella',
        'Luxe Wellness': 'luxe',
        'Style & Grace': 'grace',
        'Studio Glow': 'glow',
        'Spa Élégance': 'style',
        'Institut Prémium': 'institut',
        'Nails & Beauty': 'nails',
        'Perfect Nails': 'cheveux',
        'Ongles Brillants': 'ongles',
        'Beauté à Domicile': 'domicile',
        'Pro Express': 'pro',
        'Service Mobile': 'express'
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
        Object.values(salonsData).forEach(salons => {
            filteredSalons = filteredSalons.concat(salons);
        });
    } else {
        filteredSalons = salonsData[currentFilters.category] || [];
    }

    if (currentFilters.city !== 'all') {
        filteredSalons = filteredSalons.filter(salon => salon.city === currentFilters.city);
    }

    return filteredSalons;
}

// Afficher les salons filtrés
function displayFilteredSalons() {
    const salons = getFilteredSalons();
    
    let categoryText = currentFilters.category === 'all' ? 'Tous les salons' : categories[currentFilters.category];
    if (currentFilters.city !== 'all') {
        categoryText += ' à ' + currentFilters.city;
    }
    $('#categoryName').text(categoryText);
    $('#pageTitle').text(`${categoryText} - ${salons.length} salons disponibles`);

    $('#salonsList').empty();

    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    if (salons.length === 0) {
        $('#salonsList').html('<div style="padding: 20px; text-align: center; color: #999;">Aucun salon trouvé avec ces filtres.</div>');
    } else {
        salons.forEach(salon => {
            const salonParam = getSalonParam(salon.name);
            const salonHtml = `
                <div class="salon-item" data-id="${salon.id}" onclick="highlightSalon(${salon.id})" onmouseenter="hoverSalon(${salon.id})">
                    <img src="${salon.image}" alt="${salon.name}" class="salon-image" onerror="this.src='images/default-salon.jpg'">
                    <div class="salon-name">${salon.name}</div>
                    <div class="salon-location">
                        <i class="bi bi-geo-alt"></i>
                        ${salon.city}
                    </div>
                    <div class="salon-rating">
                        <span class="stars">${'★'.repeat(Math.floor(salon.rating))}${'☆'.repeat(5-Math.floor(salon.rating))}</span>
                        <span>${salon.rating} (${salon.reviews} avis)</span>
                    </div>
                    <div class="salon-price">À partir de ${salon.price} DH</div>
                    <a href="reserver.html?salon=${salonParam}" class="btn btn-sm" style="background: #BADFDB; color: #1a1a1a; border: none; border-radius: 20px; width: 100%;">
                        Réserver
                    </a>
                </div>
            `;
            $('#salonsList').append(salonHtml);

            const marker = L.marker([salon.lat, salon.lng]).addTo(map);
            marker.bindPopup(`<b>${salon.name}</b><br>${salon.city}<br>${salon.rating} ★ | ${salon.price} DH`);
            marker.on('click', () => highlightSalon(salon.id));
            markers.push(marker);
        });
    }
}

function displaySalons(category) {
    currentCategory = category;
    currentFilters.category = category;
    currentFilters.city = 'all';
    
    document.getElementById('categorySelect').value = category;
    document.getElementById('citySelect').value = 'all';
    
    displayFilteredSalons();
}

function highlightSalon(salonId) {
    $('.salon-item').removeClass('active');
    $(`.salon-item[data-id="${salonId}"]`).addClass('active');

    const salons = getFilteredSalons();
    const salon = salons.find(s => s.id === salonId);
    if (salon) {
        map.setView([salon.lat, salon.lng], 13);
    }
}

function hoverSalon(salonId) {
    const salons = getFilteredSalons();
    const salon = salons.find(s => s.id === salonId);
    if (salon) {
        map.setView([salon.lat, salon.lng], 12, { animate: true, duration: 0.5 });
    }
}

function resetFilters() {
    currentFilters.category = 'all';
    currentFilters.city = 'all';
    document.getElementById('categorySelect').value = 'all';
    document.getElementById('citySelect').value = 'all';
    displayFilteredSalons();
}

// Fonction de gestion changement catégorie
function handleCategoryChange() {
    currentFilters.category = $(this).val();
    currentFilters.city = 'all';
    document.getElementById('citySelect').value = 'all';
    displayFilteredSalons();
}

// Fonction de gestion changement ville
function handleCityChange() {
    currentFilters.city = $(this).val();
    displayFilteredSalons();
}

const synonymesCategoriesMap = {
    'coiffure': ['coiffure', 'coupe', 'cheuveux', 'style', 'barbier', 'styliste', 'coiffeur', 'salon de coiffure', 'hair'],
    'beaute': ['beauté', 'beauty', 'wellness', 'bien-être', 'spa', 'massage', 'détente', 'relaxation', 'soin', 'institut', 'facial', 'visage'],
    'ongles': ['ongles', 'manucure', 'pédicure', 'nails', 'vernis', 'nail art', 'maquillage', 'makeup'],
    'specialistes': ['domicile', 'indépendant', 'spécialiste', 'professionnel', 'service', 'express', 'mobile']
};

function getCategoryFromKeyword(keyword) {
    const keywordLower = keyword.toLowerCase().trim();
    
    for (let category in synonymesCategoriesMap) {
        if (synonymesCategoriesMap[category].some(synonym => keywordLower.includes(synonym))) {
            return category;
        }
    }
    return null;
}

function searchSalons(query) {
    const queryLower = query.toLowerCase().trim();
    
    if (!queryLower) {
        return getFilteredSalons();
    }

    let allSalons = [];
    Object.values(salonsData).forEach(salons => {
        allSalons = allSalons.concat(salons);
    });

    let results = allSalons.filter(salon => 
        salon.name.toLowerCase().includes(queryLower) ||
        salon.city.toLowerCase().includes(queryLower)
    );

    if (results.length === 0) {
        const matchedCategory = getCategoryFromKeyword(queryLower);
        if (matchedCategory) {
            results = salonsData[matchedCategory] || [];
            currentFilters.category = matchedCategory;
            $('#categorySelect').val(matchedCategory);
            const categoryDisplayName = categories[matchedCategory];
            $('#categoryName').text(`Résultats pour "${query}" dans ${categoryDisplayName}`);
            $('#pageTitle').text(`${results.length} salon${results.length !== 1 ? 's' : ''} trouvé${results.length !== 1 ? 's' : ''} en ${categoryDisplayName}`);
        } else {
            results = allSalons.filter(salon => 
                salon.name.toLowerCase().includes(queryLower.substring(0, 3))
            );
        }
    }

    if (results.length === 0) {
        $('#categoryName').text(`Aucun résultat pour "${query}"`);
        $('#pageTitle').text('Essayez avec un autre terme de recherche');
    }

    return results;
}

function getSearchQueryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
}

function getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category') || 'coiffure';
    return cat;
}

function displaySearchResults(query) {
    const salons = searchSalons(query);
    
    $('#categoryName').text(`Résultats pour: "${query}"`);
    $('#pageTitle').text(`${salons.length} salon${salons.length !== 1 ? 's' : ''} trouvé${salons.length !== 1 ? 's' : ''}`);

    $('#salonsList').empty();

    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    if (salons.length === 0) {
        $('#salonsList').html(`
            <div style="padding: 40px 20px; text-align: center;">
                <i class="bi bi-search" style="font-size: 3rem; color: #ddd; margin-bottom: 15px;"></i>
                <p style="color: #999; font-size: 1.1rem; margin-bottom: 10px;">Aucun salon trouvé pour "${query}"</p>
                <p style="color: #bbb; font-size: 0.9rem;">Essayez avec un autre terme de recherche ou parcourez nos catégories.</p>
            </div>
        `);
    } else {
        salons.forEach(salon => {
            const salonParam = getSalonParam(salon.name);
            const salonHtml = `
                <div class="salon-item" data-id="${salon.id}" onclick="highlightSalon(${salon.id})" onmouseenter="hoverSalon(${salon.id})">
                    <img src="${salon.image}" alt="${salon.name}" class="salon-image" onerror="this.src='images/default-salon.jpg'">
                    <div class="salon-name">${salon.name}</div>
                    <div class="salon-location">
                        <i class="bi bi-geo-alt"></i>
                        ${salon.city}
                    </div>
                    <div class="salon-rating">
                        <span class="stars">${'★'.repeat(Math.floor(salon.rating))}${'☆'.repeat(5-Math.floor(salon.rating))}</span>
                        <span>${salon.rating} (${salon.reviews} avis)</span>
                    </div>
                    <div class="salon-price">À partir de ${salon.price} DH</div>
                    <a href="reserver.html?salon=${salonParam}" class="btn btn-sm" style="background: #BADFDB; color: #1a1a1a; border: none; border-radius: 20px; width: 100%;">
                        Réserver
                    </a>
                </div>
            `;
            $('#salonsList').append(salonHtml);

            const marker = L.marker([salon.lat, salon.lng]).addTo(map);
            marker.bindPopup(`<b>${salon.name}</b><br>${salon.city}<br>${salon.rating} ★ | ${salon.price} DH`);
            marker.on('click', () => highlightSalon(salon.id));
            markers.push(marker);
        });

        if (markers.length > 0) {
            const group = new L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.1));
        }
    }
}

$(document).ready(function() {
    initMap();
    
    // Attacher les écouteurs d'événements
    $('#categorySelect').on('change', handleCategoryChange);
    $('#citySelect').on('change', handleCityChange);
    
    const searchQuery = getSearchQueryFromURL();
    
    if (searchQuery) {
        displaySearchResults(searchQuery);
    } else {
        const categoryFromURL = getCategoryFromURL();
        displaySalons(categoryFromURL);
    }
});