const apiKey = "d87c0c98";
const placeholderURL = "https://placehold.co/300x450.png?text=No+Image&font=roboto";

const mainContainer = document.querySelector("main");
const fetchBtn = document.querySelector(".fetch-btn");
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");

const modal = document.getElementById("movie-modal");
const modalContent = document.getElementById("modal-content");
const modalCloseBtn = document.getElementById("modal-close");

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarClose = document.getElementById("sidebar-close");

const loadingIndicator = document.getElementById("loading-indicator");

let currentSearchTerm = "";
let currentPage = 1;
let loading = false;
let hasMorePages = true;

// Sidebar toggle
sidebarToggle.onclick = openSidebar;
sidebarClose.onclick = closeSidebar;
sidebarOverlay.onclick = closeSidebar;

function openSidebar() {
    sidebar.classList.remove("-translate-x-full");
    sidebarOverlay.classList.remove("hidden");
    // small delay for fade-in effect
    setTimeout(() => sidebarOverlay.classList.add("opacity-100"), 10);
}

function closeSidebar() {
    sidebar.classList.add("-translate-x-full");
    sidebarOverlay.classList.remove("opacity-100");
    setTimeout(() => sidebarOverlay.classList.add("hidden"), 300);
}

// Unified search handler
function searchHandler() {
    const term = searchInput.value.trim();
    if (!term) return alert("Please enter a search term.");

    currentSearchTerm = term;
    currentPage = 1;
    hasMorePages = true;
    mainContainer.innerHTML = `<div class="col-span-full text-center text-gray-400">🔎 Searching for "${term}"...</div>`;
    fetchManyMovies(term, currentPage, true);
}

fetchBtn.onclick = searchHandler;
searchBtn.onclick = searchHandler;

// Fetch movies with loading indicator
function fetchManyMovies(searchTerm, page = 1, reset = false) {
    if (loading || !hasMorePages) return;
    loading = true;
    loadingIndicator.classList.remove("hidden");

    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchTerm)}&page=${page}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            loading = false;
            loadingIndicator.classList.add("hidden");

            if (data.Response === "True") {
                if (reset) mainContainer.innerHTML = "";

                Promise.all(data.Search.map(movie => renderCard(movie))).then(cards => {
                    cards.forEach(card => mainContainer.appendChild(card));
                });

                // OMDb API returns max 10 results per page, max 100 results (10 pages)
                if (page >= 10 || data.Search.length < 10) {
                    hasMorePages = false;
                } else {
                    currentPage++;
                }
            } else {
                if (reset) {
                    mainContainer.innerHTML = `<div class="col-span-full text-center text-red-400">🚫 No results for "${searchTerm}".</div>`;
                    hasMorePages = false;
                }
            }
        })
        .catch(err => {
            loading = false;
            loadingIndicator.classList.add("hidden");
            if (reset) {
                mainContainer.innerHTML = `<div class="col-span-full text-center text-red-400">❌ Failed to load data.</div>`;
                hasMorePages = false;
            }
            console.error("Fetch error:", err);
        });
}

function renderCard(movie) {
    return fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}&plot=full`)
        .then(res => res.json())
        .then(fullData => {
            const card = document.createElement("div");
            card.className = `
        group bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl
        transition duration-300 flex flex-col cursor-pointer border border-gray-700 hover:border-blue-500
      `;

            const posterUrl = fullData.Poster && fullData.Poster !== "N/A" ? fullData.Poster : placeholderURL;
            const img = document.createElement("img");
            img.src = posterUrl;
            img.alt = fullData.Title;
            img.className = "aspect-[2/3] object-cover w-full";
            img.onerror = () => (img.src = placeholderURL);

            const content = document.createElement("div");
            content.className = "p-4 flex flex-col flex-grow";
            content.innerHTML = `
        <h2 class="text-xl font-bold mb-1 text-slate-100 group-hover:text-blue-400">${fullData.Title}</h2>
        <p class="text-sm text-slate-400 mb-3 line-clamp-3">${fullData.Plot}</p>
        <div class="mt-auto flex justify-between items-center text-sm text-slate-500">
          <span class="group-hover:text-yellow-400">⭐ ${fullData.imdbRating}/10</span>
          <span>${fullData.Year}</span>
        </div>
      `;

            card.appendChild(img);
            card.appendChild(content);
            card.addEventListener("click", () => showModal(fullData));
            return card;
        });
}

function showModal(data) {
    modalContent.innerHTML = `
    <div class="flex flex-col md:flex-row gap-6 max-w-full">
      <img
        src="${data.Poster && data.Poster !== 'N/A' ? data.Poster : placeholderURL}"
        alt="${data.Title}"
        class="w-full md:w-1/3 object-cover rounded-lg shadow-md aspect-[2/3] max-h-[300px] md:max-h-full mx-auto"
        onerror="this.src='${placeholderURL}'"
      />
      <div class="flex flex-col flex-grow text-slate-200 px-2 md:px-0 max-w-full">
        <h2 class="text-xl sm:text-2xl font-bold mb-2 text-white text-center md:text-left">${data.Title}</h2>
        <p class="mb-3 italic text-slate-400 text-center md:text-left text-sm md:text-base">${data.Genre} • ${data.Runtime} • ${data.Released}</p>
        <p class="mb-3 leading-relaxed text-slate-300 text-sm md:text-base max-h-[150px] overflow-y-auto">${data.Plot}</p>
        <ul class="text-xs sm:text-sm space-y-1 max-h-[120px] overflow-y-auto px-2 md:px-0">
          <li><strong class="text-slate-400">Director:</strong> ${data.Director}</li>
          <li><strong class="text-slate-400">Actors:</strong> ${data.Actors}</li>
          <li><strong class="text-slate-400">Language:</strong> ${data.Language}</li>
          <li><strong class="text-slate-400">IMDb Rating:</strong> ⭐ ${data.imdbRating}/10 (${data.imdbVotes} votes)</li>
          <li><strong class="text-slate-400">Box Office:</strong> ${data.BoxOffice || "N/A"}</li>
          <li><strong class="text-slate-400">Awards:</strong> ${data.Awards || "N/A"}</li>
        </ul>
      </div>
    </div>
  `;

    modal.classList.remove("hidden");

    requestAnimationFrame(() => {
        const modalBox = document.getElementById("modal-box");
        modalBox.classList.remove("scale-95", "opacity-0");
        modalBox.classList.add("scale-100", "opacity-100");
    });
}

modalCloseBtn.onclick = closeModal;
modal.onclick = (e) => {
    if (e.target === modal) closeModal();
};

function closeModal() {
    const modalBox = document.getElementById("modal-box");
    modalBox.classList.add("scale-95", "opacity-0");
    modalBox.classList.remove("scale-100", "opacity-100");
    setTimeout(() => {
        modal.classList.add("hidden");
    }, 300);
}

// Keyboard accessibility: Close modal on Escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (!modal.classList.contains("hidden")) closeModal();
        if (!sidebar.classList.contains("-translate-x-full")) closeSidebar();
    }
});

// Debounced infinite scroll
let scrollTimeout = null;
window.addEventListener("scroll", () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
        if (loading || !hasMorePages || !currentSearchTerm) return;

        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 150) {
            fetchManyMovies(currentSearchTerm, currentPage);
        }
    }, 150);
});
