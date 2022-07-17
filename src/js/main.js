'use strict';

// constantes globales
const userInput = document.querySelector('.js_input');
const btnSearch = document.querySelector('.js_search');
const btnReset = document.querySelector('.js_reset');
const resultsList = document.querySelector('.js_results');
const favoritesList = document.querySelector('.js_favorites');

// variables /arrays
let cardFounded = []; //guardar lo que devuelve img y title, resultado
let cardFavorites = [];  //guardar los favoritos


// Funciones
function handleClick(event) {
    console.log(event.currentTarget);
}



function listenerCards() {
    const liCard = document.querySelectorAll(".js-list-cards");
    for (const li of liCard) {
        li.addEventListener("click", handleClick);
    }
}


//renderizar
function renderCardFounded() {
    let html = "";
    for (const oneCard of cardFounded) {
        html += `<li class="js-list-cards" id=${oneCard.mal_id}>`;
        html += `<img src="${oneCard.images.jpg.image_url}" />`;
        html += `<h3>${oneCard.title}</h3>`;
        html += `</li>`;
    }
    resultsList.innerHTML = html;
    
}



// fetch para obtener datos del servidor

function getData() {
    fetch(`https://api.jikan.moe/v4/anime?q=${userInput}`)
    .then((response) => response.json()) 
    .then((data) => {
        cardFounded = data; 
        renderCardFounded();
        listenerCards();

    }); 
}
    
    




// función manejadora
function handleSearch (event) {
    event.preventDefault();
    getData(); //función del fetch
}


// events

btnSearch.addEventListener('click', handleSearch);


