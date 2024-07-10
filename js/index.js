// index.js

const API_KEY = '95a6a380e4mshdc73b12326288e0p10172fjsn2734fcec90b9';
const API_HOST = 'free-to-play-games-database.p.rapidapi.com';
const API_URL = `https://${API_HOST}/api/games`;

class Game {
    constructor(id, title, genre, platform, thumbnail, short_description, status, game_url) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.platform = platform;
        this.thumbnail = thumbnail;
        this.short_description = short_description;
        this.status = status;
        this.game_url = game_url;
    }
}

class UI {
    static displayGames(games) {
        const gameData = document.getElementById('gameData');
        gameData.innerHTML = '';

        games.forEach(game => {
            const gameCard = `
                <div class="col">
                    <div data-id="${game.id}" class="card h-100 bg-transparent" role="button">
                        <div class="card-body">
                            <figure class="position-relative">
                                <img class="card-img-top object-fit-cover h-100" src="${game.thumbnail}" />
                            </figure>
                            <figcaption>
                                <div class="hstack justify-content-between">
                                    <h3 class="h6 small">${game.title}</h3>
                                    <span class="badge text-bg-primary p-2">Free</span>
                                </div>
                                <p class="card-text small text-center opacity-50">
                                    ${game.short_description.split(" ", 8).join(" ")}
                                </p>
                            </figcaption>
                        </div>
                        <footer class="card-footer small hstack justify-content-between">
                            <span class="badge badge-color">${game.genre}</span>
                            <span class="badge badge-color">${game.platform}</span>
                        </footer>
                    </div>
                </div>
            `;
            gameData.insertAdjacentHTML('beforeend', gameCard);
        });

        UI.addGameClickEvents();
    }

    static displayGameDetails(game) {
        const detailsContent = document.getElementById('detailsContent');
        detailsContent.innerHTML = `
            <div class="col-md-4">
                <img src="${game.thumbnail}" class="w-100" alt="image details" />
            </div>
            <div class="col-md-8">
                <h3>Title: ${game.title}</h3>
                <p>Category: <span class="badge text-bg-info"> ${game.genre}</span> </p>
                <p>Platform: <span class="badge text-bg-info"> ${game.platform}</span> </p>
                <p>Status: <span class="badge text-bg-info"> ${game.status}</span> </p>
                <p class="small">${game.description}</p>
                <a class="btn btn-outline-warning" target="_blank" href="${game.game_url}">Show Game</a>
            </div>
        `;
        document.querySelector('.details').classList.remove('d-none');
    }

    static addGameClickEvents() {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => {
                const gameId = card.getAttribute('data-id');
                UI.fetchGameDetails(gameId);
            });
        });
    }

    static async fetchGameDetails(gameId) {
        const response = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/game?id=${gameId}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': API_HOST
            }
        });
        const game = await response.json();
        UI.displayGameDetails(game);
    }

    static async fetchGames(genre) {
        const response = await fetch(`${API_URL}?category=${genre}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': API_HOST
            }
        });
        const games = await response.json();
        UI.displayGames(games);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (event) => {
            const category = event.target.getAttribute('data-category');
            UI.fetchGames(category);
        });
    });

    document.getElementById('btnClose').addEventListener('click', () => {
        document.querySelector('.details').classList.add('d-none');
    });

    UI.fetchGames('mmorpg');
});
