const bodyEl = document.querySelector("body");
const movieContainer = document.querySelector(".movies-container");
const form = document.querySelector("#form");
const search = document.querySelector("#search");
const overlay = document.querySelector(".overlay");
const overlayClose = document.querySelector(".overlay-close");
const closeBtn = document.querySelector(".close-btn-container");

const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=fa22d773ca02b4471912d4ff1d299c12&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=fa22d773ca02b4471912d4ff1d299c12&query=";

window.addEventListener("DOMContentLoaded", () => {
  getMovies(APIURL);
});

async function getMovies(url, searchTerm = "") {
  const resp = await fetch(url);
  const respData = await resp.json();
  console.log(respData);
  showMovies(respData, searchTerm);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if (searchTerm) {
    getMovies(SEARCHAPI + searchTerm, searchTerm);
    search.value = "";
  }
});

document.addEventListener("backbutton", (e) => {
  e.preventDefault();
  hideOverlay();
});

function hideOverlay() {
  overlayClose.classList.add("hidden");
  overlay.classList.add("hidden");
  closeBtn.classList.add("hidden");
  bodyEl.classList.remove("no-scroll");
}

overlayClose.addEventListener("click", hideOverlay);

document.querySelector(".close-btn").addEventListener("click", hideOverlay);

function showMovies(movies, searchTerm = "") {
  if (searchTerm) {
    movieContainer.innerHTML = `<h1 class="search-for">Searching for: <i>${searchTerm}</i></h1>`;
  } else {
    movieContainer.innerHTML = "";
  }
  movies.results.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    const { poster_path, title, vote_average, release_date, backdrop_path, overview } = movie;
    movieEl.innerHTML = `
    <img src="${IMGPATH + poster_path}" alt="" />
    <div class="cover-layer"></div>
    <div class="movie-info">
      <h3 class="movie-title">${title}</h3>
      <div class="stats">
        <span>${release_date.split("-")[0]}</span>
        <span><i class="fa-solid fa-star"></i>${vote_average}</span>
      </div>
    </div>`;
    movieContainer.appendChild(movieEl);
    movieEl.addEventListener("click", () => {
      const overlayContent = `
      
      <div class="overlay-movie">
        <img src="${IMGPATH + backdrop_path}" alt="" />
        <div class="overlay-info">
          <h1 class="overlay-title">${title}</h1>
          <div class="overlay-stats">
            <span class="overlay-year">${release_date.split("-")[0]}</span>
            <span class="overlay-rating"><i class="fa-solid fa-star"></i>${vote_average}</span>
          </div>
          <p class="overlay-description">${overview}</p>
        </div>
      </div`;
      overlay.innerHTML = overlayContent;
      overlay.classList.remove("hidden");
      overlayClose.classList.remove("hidden");
      closeBtn.classList.remove("hidden");
      bodyEl.classList.add("no-scroll");
    });
  });
}
