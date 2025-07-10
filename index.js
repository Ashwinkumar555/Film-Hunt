// script.js

const searchBtn = document.getElementById('searchBtn');
const movieInput = document.getElementById('movieInput');
const movieResult = document.getElementById('movieResult');
const watchlistBox = document.getElementById('watchlistBox');

const API_KEY = '5b6ec058'; // Replace with your actual OMDB API key

let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
displayWatchlist();

searchBtn.addEventListener('click', () => {
  const movieName = movieInput.value.trim();
  if (!movieName) {
    movieResult.innerHTML = '<p>Please enter a movie name.</p>';
    return;
  }
  fetchMovie(movieName);
});

function fetchMovie(name) {
  movieResult.innerHTML = '<div class="spinner"></div>';
  fetch(`https://www.omdbapi.com/?t=${name}&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "True") {
        const genres = data.Genre.split(", ");
        const relatedGenre = genres[0];

        movieResult.innerHTML = `
          <img src="${data.Poster}" class="poster" alt="${data.Title}">
          <h2>${data.Title} (${data.Year})</h2>
          <p><strong>Genre:</strong> ${data.Genre}</p>
          <p><strong>Plot:</strong> ${data.Plot}</p>
          <p><strong>IMDb Rating:</strong> ⭐ ${data.imdbRating}</p>
          <p><a href="https://www.youtube.com/results?search_query=${data.Title}+official+trailer" target="_blank">🎬 Watch Trailer</a></p>
          <button onclick="addToWatchlist('${data.Title}', '${data.Poster}')">➕ Add to Watchlist</button>
          <div id="relatedMovies"></div>
        `;

        fetchRelatedMovies(relatedGenre, data.Title);
      } else {
        movieResult.innerHTML = '<p>Movie not found.</p>';
      }
    })
    .catch(() => {
      movieResult.innerHTML = '<p>Error fetching data.</p>';
    });
}

function fetchRelatedMovies(genre, excludeTitle) {
  fetch(`https://www.omdbapi.com/?s=${genre}&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (data.Search) {
        const related = data.Search.filter(movie => movie.Title !== excludeTitle).slice(0, 3);
        const relatedHTML = related.map(m => `
          <div style="margin-top:10px">
            <img src="${m.Poster}" alt="${m.Title}" style="width:80px; vertical-align:middle; border-radius:6px;"> 
            <span style="margin-left:10px">${m.Title}</span>
          </div>
        `).join("");
        document.getElementById("relatedMovies").innerHTML = `<h3>Related Movies</h3>${relatedHTML}`;
      }
    });
}

function addToWatchlist(title, poster) {
  const movie = { title, poster };
  if (!watchlist.some(item => item.title === title)) {
    watchlist.push(movie);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    alert("Added to Watchlist!");
    displayWatchlist();
  } else {
    alert("Already in Watchlist");
  }
}

function displayWatchlist() {
  if (watchlist.length === 0) {
    watchlistBox.innerHTML = '<p>No movies in your watchlist.</p>';
    return;
  }

  const items = watchlist.map(m => `
    <div style="margin: 10px 0; display: flex; align-items: center;">
      <img src="${m.poster}" alt="${m.title}" style="width: 60px; height: auto; border-radius: 5px; margin-right: 10px;">
      <span>${m.title}</span>
    </div>
  `).join("");

  watchlistBox.innerHTML = `<h3>Your Watchlist</h3>${items}`;
}

