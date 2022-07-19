'use strict';

// constantes globales
const userInput = document.querySelector('.js_input');
const btnSearch = document.querySelector('.js_search');
const btnReset = document.querySelector('.js_reset');
const resultsList = document.querySelector('.js_results');
const favoritesList = document.querySelector('.js_favorites');
const btnRemoveFav = document.querySelector('.js-btnRemoveFav')

const imgNotFound = "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png"; 
const newImage = "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";

// variables /arrays
let cardFounded = []; //guardar lo que devuelve 
let cardFavorites = [];  //guardar los favoritos
let cardSelected = []; //guarda los seleccionados


// funciones

// fetch para obtener datos del servidor

function getData() {
    fetch(`https://api.jikan.moe/v4/anime?q=${userInput.value}`) 
    .then((response) => response.json()) 
    .then((json) => {
        console.log(json);
        cardFounded = json.data;
        renderCardFounded();
    }); 
}



//renderizar los encontrados
function renderCardFounded() { 
    let html = "";
    let classFavorite = "";

    cardFounded.forEach((item) => {
        const selected = cardSelected.findIndex((selected) => item.mal_id === selected.mal_id);
        if (selected !== -1) {
            classFavorite = "selected"; 
        } else {
            classFavorite = "";
        }
        if (item.images.jpg.image_url === imgNotFound) {
            html += `<li class="js-list-cards list__cards ${classFavorite}" id=${item.mal_id}>`;
            html += `<img src="${newImage}"`;
            html += `<h3>${item.title}</h3>`;   
        } else {
            html += `<li class="js-list-cards ${classFavorite}" id=${item.mal_id}>`;
            html += `<img src="${item.images.jpg.image_url}" />`;
            html += `<h3>${item.title}</h3>`;
            html += `</li>`;
        }
    });
    resultsList.innerHTML = html;
    listenerCards();
}

//renderizar los favoritos
function renderFav() { 
    let html = "";

    cardFavorites.forEach((item) => {
        if (item.images.jpg.image_url === imgNotFound) {
            html += `<li class="js-fav-cards id=${item.mal_id}>`;
            html += `<img src="${newImage}"/>`;
            html += `<h3>${item.title}</h3>`;
            html += `</li>`;
        }
    });
    favoritesList.innerHTML = html;
    listenerFav();
}



function removeFav() {
    cardFavorites = [];
    cardSelected = [];
    favoritesList.innerHTML = "";
    renderCardFounded();
    //saveMyFavorites();
    saveFav();
}

function saveSelected() {
    localStorage.setItem('cardSelected', JSON.stringify(cardSelected));     
}

function loadSelected() {
    const dataLocalStorage = JSON.parse(localStorage.getItem('cardSelected'));

    if(dataLocalStorage !== null){
        cardSelected = dataLocalStorage; 
        renderCardFounded();
    } 
}

function saveFav() {
    localStorage.setItem('favoritesList', JSON.stringify(cardFavorites)); 
}

function loadFav() {
    const dataLocalStorage = JSON.parse(localStorage.getItem('favoritesList'));

    if(dataLocalStorage !== null){
        cardFavorites = dataLocalStorage; 
        renderFav();
    } 
}



// función que escucha card de html
function listenerCards() {
    const liCard = document.querySelectorAll(".js-list-cards");
    for (const li of liCard) {
        li.addEventListener("click", handleClickCards);
    }
}



function listenerFav() {
    const liCard = document.querySelectorAll(".js-fav-cards");
    for (const li of liCard) {
        li.addEventListener("click", handleClickFavorites);
    }
}



// funciones manejadoras de eventos

    
const handleFilter = (event) => {
    event.preventDefault();
    const inputValue = userInput.value.toLowerCase();

    const cardFilter = cardFounded.filter((item) => item.title.toLowerCase().includes(inputValue)
    );
    getData();
    renderCardFounded(cardFilter);
};


function handleReset(event) {
    event.preventDefault();
    userInput.value = "";
    cardFounded.innerHTML = "";
}


function handleClickCards(event) {
    const idSelected = parseInt(event.currentTarget.id);

    const cardFound = cardFounded.find((item) => item.mal_id === idSelected);

    const favoriteFound = cardFavorites.findIndex((item) => cardFound.mal_id === idSelected);
    
    if(favoriteFound === -1) {
        cardFavorites.push(cardFound); 
        cardSelected.push(cardFound);
    } 
    renderCardFounded();  
    renderFav();
    saveFav();
    saveSelected();
    listenerCards();
}

function handleClickFavorites(event) {
    const clicFavorite = parseInt(event.currentTarget.id);
    const favoriteFound = cardFavorites.findIndex((item) => item.mal_id === clicFavorite); 
    const foSelect = cardSelected.findIndex((item) => item.mal_id === favoriteFound);

    cardFavorites.splice(favoriteFound, 1);
    cardSelected.splice(foSelect, 1);
    renderCardFounded();
    renderFav();
}



// events

userInput.addEventListener('click', handleFilter);
btnSearch.addEventListener('click', handleFilter);
btnReset.addEventListener('click', handleReset);


loadFav();
loadSelected();