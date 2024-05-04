const global = {
    currentPage: window.location.pathname,
    search: {
        term: "",
        type: "",
        page: 1,
        totalPages: 1,
        totalResuls: 0,
    },
    api: {
        // Throw api key from https://api.themoviedb.org/3/ to use
        apiKey: "",
        apiUrl: "https://api.themoviedb.org/3/",
    },
};

// Fetch data from API
async function fetchAPIData(endpoint) {
    const API_KEY = "1160fa40ee05ff31f7bfeff4b6f2f43a";
    const API_URL = "https://api.themoviedb.org/3/";

    showSpinner();

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

    const data = await response.json();

    hideSpinner();

    return data;
}

async function searchAPIData() {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;

    showSpinner();

    const response = await fetch(
        `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
    );

    const data = await response.json();

    hideSpinner();

    return data;
}

async function displayPopularTVShows() {
    const { results } = await fetchAPIData("tv/popular");

    results.forEach((tvShow) => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <a href="tv-details.html?id=${tvShow.id}">
                ${
                    tvShow.poster_path
                        ? `<img
                src="https://image.tmdb.org/t/p/w500/${tvShow.poster_path}"
                class="card-img-top"
                alt="${tvShow.name}"
                />`
                        : `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${tvShow.name}"
                />`
                }
            </a>
            <div class="card-body">
                <h5 class="card-title">${tvShow.name}</h5>
                <p class="card-text">
                <small class="text-muted">Air date: ${tvShow.first_air_date}</small>
                </p>
            </div>
        `;

        document.getElementById("popular-shows").appendChild(div);
    });
}

async function displayPopularMovies() {
    const { results } = await fetchAPIData("movie/popular");

    results.forEach((movie) => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
                ${
                    movie.poster_path
                        ? `<img
                src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}"
                />`
                        : `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${movie.title}"
                />`
                }
            </a>
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">
                <small class="text-muted">Release: ${movie.release_date}</small>
                </p>
            </div>
        `;

        document.getElementById("popular-movies").appendChild(div);
    });
}

async function displayMovieDetails() {
    const movieId = window.location.search.split("=")[1];
    const movie = await fetchAPIData(`movie/${movieId}`);

    displayBackgroundImage("movie", movie.backdrop_path);
    const div = document.createElement("div");
    div.innerHTML = `
        <div class="details-top">
            <div>
                ${
                    movie.poster_path
                        ? `<img
                src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}"
                />`
                        : `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${movie.title}"
                />`
                }
            </div>
            <div>
                <h2>${movie.title}</h2>
                <p>
                <i class="fas fa-star text-primary"></i>
                ${movie.vote_average.toFixed(1)} / 10
                </p>
                <p class="text-muted">Release Date: ${movie.release_date}</p>
                <p>${movie.overview}</p>
                <h5>Genres</h5>
                <ul class="list-group">
                    ${movie.genres.map((genres) => `<li>${genres.name}</li>`).join("")}
                </ul>
                <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
            </div>
            </div>
            <div class="details-bottom">
            <h2>Movie Info</h2>
            <ul>
                <li><span class="text-secondary">Budget:</span> $${addCommaToNumber(movie.budget)}</li>
                <li><span class="text-secondary">Revenue:</span> $${addCommaToNumber(movie.revenue)}</li>
                <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
                <li><span class="text-secondary">Status:</span> ${movie.status}</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">${movie.production_companies.map((company) => `<span>${company.name}</span>`)}</div>
            </div>
    `;

    document.getElementById("movie-details").appendChild(div);
}

// Display show details
async function displayShowDetails() {
    const showId = window.location.search.split("=")[1];
    const show = await fetchAPIData(`tv/${showId}`);

    displayBackgroundImage("show", show.backdrop_path);
    const div = document.createElement("div");
    div.innerHTML = `
        <div class="details-top">
            <div>
                ${
                    show.poster_path
                        ? `<img
                src="https://image.tmdb.org/t/p/w500/${show.poster_path}"
                class="card-img-top"
                alt="${show.name}"
                />`
                        : `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${show.name}"
                />`
                }
            </div>
            <div>
                <h2>${show.name}</h2>
                <p>
                <i class="fas fa-star text-primary"></i>
                ${show.vote_average.toFixed(1)} / 10
                </p>
                <p class="text-muted">Air Date: ${show.first_air_date}</p>
                <p>${show.overview}</p>
                <h5>Genres</h5>
                <ul class="list-group">
                    ${show.genres.map((genres) => `<li>${genres.name}</li>`).join("")}
                </ul>
                <a href="${show.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
            </div>
            </div>
            <div class="details-bottom">
            <h2>Show Info</h2>
            <ul>
                <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
                <li><span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.air_date}</li>
                <li><span class="text-secondary">Status:</span> ${show.status}</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">${show.production_companies.map((company) => `<span>${company.name}</span>`)}</div>
            </div>
    `;

    document.getElementById("show-details").appendChild(div);
}

function displayBackgroundImage(type, backgroundPath) {
    const overlayDiv = document.createElement("div");

    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    overlayDiv.style.backgroundSize = "cover";
    overlayDiv.style.backgroundPosition = "center";
    overlayDiv.style.backgroundRepeat = "no-repeat";
    overlayDiv.style.height = "100vh";
    overlayDiv.style.width = "100vw";
    overlayDiv.style.position = "absolute";
    overlayDiv.style.top = "0";
    overlayDiv.style.left = "0";
    overlayDiv.style.zIndex = "-1";
    overlayDiv.style.opacity = "0.1";

    if (type === "movie") {
        document.getElementById("movie-details").appendChild(overlayDiv);
    } else {
        document.getElementById("show-details").appendChild(overlayDiv);
    }
}

function initSwiper() {
    const swiper = new Swiper(".swiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            500: {
                slidesPerView: 2,
            },
            700: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            },
        },
    });
}

function displayPagination() {
    const div = document.createElement("div");

    div.classList.add("pagination");
    div.innerHTML = `
        <button class="btn btn-primary" id="prev">Prev</button>
        <button class="btn btn-primary" id="next">Next</button>
        <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
    `;

    document.getElementById("pagination").appendChild(div);

    // Disable prev button if on first page
    if (global.search.page === 1) {
        document.getElementById("prev").disabled = true;
    }

    // Disable next button if on last page
    if (global.search.page === global.search.totalPages) {
        document.getElementById("next").disabled = true;
    }

    // Next page
    document.getElementById("next").addEventListener("click", async () => {
        global.search.page++;
        const { results } = await searchAPIData();

        displaySearchResult(results);
    });

    // Prev page
    document.getElementById("prev").addEventListener("click", async () => {
        global.search.page--;
        const { results } = await searchAPIData();

        displaySearchResult(results);
    });
}

function displaySearchResult(results) {
    // Clear previous result
    document.getElementById("search-results").innerHTML = "";
    document.getElementById("search-results-heading").innerHTML = "";
    document.getElementById("pagination").innerHTML = "";

    results.forEach((result) => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <a href="${global.search.type}-details.html?id=${result.id}">
                ${
                    result.poster_path
                        ? `<img
                src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
                class="card-img-top"
                alt="${global.search.type === "movie" ? result.title : result.name}"
                />`
                        : `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${global.search.type === "movie" ? result.title : result.name}"
                />`
                }
            </a>
            <div class="card-body">
                <h5 class="card-title">${global.search.type === "movie" ? result.title : result.name}</h5>
                <p class="card-text">
                <small class="text-muted">Release: ${
                    global.search.type === "movie" ? result.release_date : result.first_air_date
                }</small>
                </p>
            </div>
        `;
        document.getElementById("search-results-heading").innerHTML = `
                <h2>${results.length} of ${global.search.totalResuls} Results for ${global.search.term}</h2>
        `;

        document.getElementById("search-results").appendChild(div);
    });

    displayPagination();
}

// Search Movie/Show
async function search() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    global.search.term = urlParams.get("search-term");
    global.search.type = urlParams.get("type");

    if (global.search.term !== "" && global.search.term !== null) {
        const { results, page, total_pages, total_results } = await searchAPIData();

        global.search.page = page;
        global.search.totalResuls = total_results;
        global.search.totalPages = total_pages;

        if (results.length === 0) {
            showAlert("No results found", "alert-success");
            return;
        }

        displaySearchResult(results);

        document.getElementById("search-term").value = "";
    } else {
        showAlert("Please enter a search term", "alert-error");
    }
}

async function diplaySlider() {
    const { results } = await fetchAPIData("movie/now_playing");

    results.forEach((result) => {
        const swiperSlideDiv = document.createElement("div");

        swiperSlideDiv.classList.add("swiper-slide");
        swiperSlideDiv.innerHTML = `
            <a href="movie-details.html?id=${result.id}">
                <img src="https://image.tmdb.org/t/p/w500/${result.poster_path}" alt="${result.title}" />
            </a>
            <h4 class="swiper-rating"><i class="fas fa-star text-secondary"></i> ${result.vote_average.toFixed(
                1
            )} / 10</h4>
        `;

        document.querySelector(".swiper-wrapper").appendChild(swiperSlideDiv);

        initSwiper();
    });
}

function highlightActiveLink() {
    const links = document.querySelectorAll(".nav-link");

    links.forEach((link) => {
        if (link.getAttribute("href") === global.currentPage) {
            link.classList.add("active");
        }
    });
}

function showAlert(message, className) {
    const alertEl = document.createElement("div");

    alertEl.classList.add("alert", className);
    alertEl.appendChild(document.createTextNode(message));

    document.getElementById("alert").appendChild(alertEl);

    setTimeout(() => alertEl.remove(), 3000);
}

function addCommaToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showSpinner() {
    document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
    document.querySelector(".spinner").classList.remove("show");
}

function init() {
    switch (global.currentPage) {
        case "/":
        case "/index.html":
            diplaySlider();
            displayPopularMovies();
            break;
        case "/shows.html":
            displayPopularTVShows();
            break;
        case "/movie-details.html":
            displayMovieDetails();
            break;
        case "/tv-details.html":
            displayShowDetails();
            break;
        case "/search.html":
            search();
            break;
    }

    highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
