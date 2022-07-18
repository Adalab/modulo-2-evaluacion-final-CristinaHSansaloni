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



function handleClick(event) {
    const idSelected = parseInt(event.currentTarget.mal_id);

    const cardFound = cardFounded.find((oneCard) => oneCard.mal_id === idSelected);

    const favoriteFound = cardFavorites.findIndex((fav) => fav.mal_id === idSelected);
    
    if(favoriteFound === -1) {
        cardFavorites.push(cardFound); 
    } else {
        cardFavorites.splice(favoriteFound, 1);
    }
    renderCardFounded(cardFounded); //los datos de la api
     
}



function listenerCards() {
    const liCard = document.querySelectorAll(".js-list-cards");
    for (const li of liCard) {
        li.addEventListener("click", handleClick);
    }
}


//renderizar
function renderCardFounded(arrayCardFounded) {
    let html = "";
    let classFavorite = "";
    for (const oneCard of arrayCardFounded) {

        const favoriteFoundIndex = cardFavorites.findIndex((fav) => oneCard.mal_id === fav.mal_id);
        if(favoriteFoundIndex !== -1) { //está
            classFavorite = "card--favorite";
        } else {
            classFavorite = "";
        }

        html += `<li class="js-list-cards" ${classFavorite} id=${oneCard.mal_id}>`;
        html += `<img src="${oneCard.images.jpg.image_url}" />`;
        html += `<h3>${oneCard.title}</h3>`;
        html += `</li>`;
    }
    resultsList.innerHTML = html;
    listenerCards();
}


// fetch para obtener datos del servidor

function getData() {
    fetch(`https://api.jikan.moe/v4/anime?q=${userInput}`)
    .then((response) => response.json()) 
    .then((data) => {
        cardFounded = data; 
        localStorage.setItem('data', JASON.stringify(cardFavorites));
        renderCardFounded(cardFounded);//cuando vengan datos de api
    }); 
}
    
const handleFilter = (event) => {
    const inputValue = userInput.value.toLowerCase();

    const cardFilter = cardFounded.filter((oneCard) => oneCard.title.toLowerCase().includes(inputValue)
    );
    renderCardFounded(cardFilter);//las cards filtradas
};



function handleSearch (event) {
    event.preventDefault();
    
}

function onLoad() { //se ejecuta cuando carga la página
    const dataLocalStorage = JSON.parse(localStorage.getItem('data'));
    console.log(dataLocalStorage);

    if(dataLocalStorage){
        cardFounded = dataLocalStorage; //que actualice
        renderCardFounded(cardFounded); //y que lo pinte
    } else {
        getData(); 
    }
}

onLoad();
// events

userInput.addEventListener('keyup', handleFilter);

btnSearch.addEventListener('click', handleSearch);


