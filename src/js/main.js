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


// funciones

// fetch para obtener datos del servidor

function getData() {
    fetch(`https://api.jikan.moe/v4/anime?q=${userInput.value}`)  //o userInput.value
    .then((response) => response.json()) 
    .then((data) => {
        
        cardFounded = data.data;
        console.log(data); 
        localStorage.setItem('data', JSON.stringify(cardFavorites));
        renderCardFounded(cardFounded);//cuando vengan datos de api
        //¿Sacarlo fuera en una const?
    }); 
}


//renderizar
function renderCardFounded(arrayCardFounded) {
    let html = "";
    let classFavorite = ""; //para ponerle estilos
    const imgNotFound = "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png"; //si no tiene img

    for (const oneCard of arrayCardFounded) {
        const newImage = "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";

        const favoriteFoundIndex = cardFavorites.findIndex((fav) => oneCard.mal_id === fav.mal_id);//puede que sea alreves,fav.id === oneCard.id 

        if(favoriteFoundIndex !== -1) { //está
            classFavorite = "card--favorite"; //el css
        } else {
            classFavorite = "";
        }

        html += `<li class="js-list-cards ${classFavorite}" id="${oneCard.mal_id}">`;
        if (oneCard.image.jpg.image_url === imgNotFound) {
            html += `<img src="${newImage}"/>`;
        } else {
            html += `<img src="${oneCard.images.jpg.image_url}" />`; //¿puedo poner solo .image?
        }
        html += `<h3>${oneCard.title}</h3>`;
        //aquí iría el icono de borrar
        html += `</li>`;
    }
    // estos dos, o return html;
    resultsList.innerHTML = html;
    listenerCards();
}



// función que escucha
function listenerCards() {
    const liCard = document.querySelectorAll(".js-list-cards");
    for (const li of liCard) {
        li.addEventListener("click", handleClick);
    }
}


// funciones manejadoras de eventos

    
const handleFilter = (event) => {
    event.preventDefault();
    const inputValue = userInput.value.toLowerCase();

    const cardFilter = cardFounded.filter((oneCard) => oneCard.title.toLowerCase().includes(inputValue)
    );
    getData();
    renderCardFounded(cardFilter);//las cards filtradas
};


function handleReset(event) {
    event.preventDefault();
    userInput.value = "";
    cardFounded.innerHTML = "";
}

function handleClick(event) { //no funciona poner en fav
    const idSelected = parseInt(event.currentTarget.mal_id);

    const cardFound = cardFounded.find((oneCard) => oneCard.mal_id === idSelected);

    const favoriteFound = cardFavorites.findIndex((fav) => fav.mal_id === idSelected);
    
    if(favoriteFound === -1) {
        cardFavorites.push(cardFound); 
    } else {
        cardFavorites.splice(favoriteFound, 1);
    }
    renderCardFounded(cardFounded); //pinta los datos de la api
     
}



function onLoad() { //se ejecuta cuando carga la página
    const dataLocalStorage = JSON.parse(localStorage.getItem('data'));
    console.log(dataLocalStorage);

    if(dataLocalStorage){
        cardFavorites = dataLocalStorage; //que actualice
        
    } else {
        getData(); 
    }
}


// events

userInput.addEventListener('click', handleFilter);
btnSearch.addEventListener('click', handleFilter);
btnReset.addEventListener('click', handleReset);

onLoad();