// Declaração dos elementos e da variável currentJoke
const elements = {
    jokeContainer: document.getElementById('joke-container'),
    chuckImage: document.getElementById('chuck-image'),
    favoritesList: document.getElementById('favorites-list'),
    favoriteTemplate: document.getElementById('favorite-template')
};

let currentJoke = null;

document.getElementById('new-joke-btn').addEventListener('click', getNewJoke);
document.getElementById('favorite-btn').addEventListener('click', addToFavorites);

// Busca uma nova piada da API e atualiza a interface
async function getNewJoke() {
    try {
        const response = await fetch('https://api.chucknorris.io/jokes/random');
        const data = await response.json();
        
        currentJoke = {
            id: data.id,
            text: data.value,
            image: data.icon_url
        };
        
        elements.jokeContainer.textContent = data.value;
        elements.chuckImage.src = data.icon_url;
    } catch (error) {
        console.error('Erro:', error);
        elements.jokeContainer.textContent = 'Chuck Norris quebrou o servidor... Tente novamente!';
    }
}

// Adiciona a piada atual aos favoritos utilizando localStorage
function addToFavorites() {
    if (!currentJoke) return;
    
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Verifica se a piada já foi favoritada
    if (favorites.some(fav => fav.id === currentJoke.id)) {
        alert('Piada já favoritada!');
        return;
    }
    
    favorites.push(currentJoke);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites();
}

// Remove um favorito com base no id utilizando localStorage
function deleteFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites();
}

// Carrega os favoritos salvos no localStorage e renderiza-os na página
function loadFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    elements.favoritesList.innerHTML = favorites.length ? '' : '<p>Nenhum favorito salvo ainda!</p>';

    favorites.forEach(fav => {
        const clone = elements.favoriteTemplate.content.cloneNode(true);
        const item = clone.querySelector('.favorite-item');
        
        item.querySelector('.favorite-img').src = fav.image;
        item.querySelector('.favorite-text').textContent = fav.text;
        item.querySelector('.delete-btn').addEventListener('click', () => deleteFavorite(fav.id));
        
        elements.favoritesList.appendChild(clone);
    });
}

// Inicializa os dados quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    getNewJoke();
    loadFavorites();
});
