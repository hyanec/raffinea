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