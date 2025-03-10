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

// Busca uma nova piada da API de Chuck Norris e atualiza a interface
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

// Adiciona a piada atual aos favoritos através da API do back‑end
async function addToFavorites() {
    if (!currentJoke) return;
    
    try {
        const response = await fetch('/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentJoke)
        });
        if (!response.ok) {
            const data = await response.json();
            alert(data.error || 'Erro ao favoritar');
            return;
        }
        loadFavorites();
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Remove um favorito chamando a API do back‑end
async function deleteFavorite(id) {
    try {
        const response = await fetch(`/favorites/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const data = await response.json();
            alert(data.error || 'Erro ao remover favorito');
            return;
        }
        loadFavorites();
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Carrega os favoritos salvos chamando a API e renderiza-os na página
async function loadFavorites() {
    try {
        const response = await fetch('/favorites');
        const favorites = await response.json();
        elements.favoritesList.innerHTML = favorites.length ? '' : '<p>Nenhum favorito salvo ainda!</p>';

        favorites.forEach(fav => {
            const clone = elements.favoriteTemplate.content.cloneNode(true);
            const item = clone.querySelector('.favorite-item');
            
            item.querySelector('.favorite-img').src = fav.image;
            item.querySelector('.favorite-text').textContent = fav.text;
            item.querySelector('.delete-btn').addEventListener('click', () => deleteFavorite(fav.id));
            
            elements.favoritesList.appendChild(clone);
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    getNewJoke();
    loadFavorites();
});
