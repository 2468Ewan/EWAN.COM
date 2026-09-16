// ========================================
// MUSIC.APP - RECHERCHE ARTISTE
// ========================================

let allSongs = [];
let displayedSongs = 0;
const songsPerPage = 30;


// ========================================
// RECHERCHE
// ========================================

function searchArtist() {

    const input = document.getElementById("searchInput");
    const status = document.getElementById("status");
    const results = document.getElementById("results");
    const artist = document.getElementById("artist");
    const more = document.getElementById("moreButton");

    const query = input.value.trim();

    if (query === "") {
        status.textContent = "⚠️ Écris le nom d'un artiste.";
        return;
    }

    status.textContent = "🔎 Recherche de " + query + "...";

    results.innerHTML = "";
    artist.innerHTML = "";

    more.style.display = "none";

    allSongs = [];
    displayedSongs = 0;

    // Recherche directe des chansons de l'artiste
    const url =
        "https://itunes.apple.com/search" +
        "?term=" + encodeURIComponent(query) +
        "&media=music" +
        "&entity=song" +
        "&attribute=artistTerm" +
        "&limit=200" +
        "&callback=musicSearch";

    // Supprimer une ancienne recherche
    const oldScript = document.getElementById("musicAPI");

    if (oldScript) {
        oldScript.remove();
    }

    // JSONP : fonctionne mieux avec Acode
    const script = document.createElement("script");

    script.id = "musicAPI";
    script.src = url;

    script.onerror = function() {

        status.textContent =
            "❌ Impossible de contacter le serveur.";

    };

    document.body.appendChild(script);
}


// ========================================
// RÉSULTAT DE LA RECHERCHE
// ========================================

window.musicSearch = function(data) {

    const status =
        document.getElementById("status");

    const results =
        document.getElementById("results");

    const artistBox =
        document.getElementById("artist");

    if (!data || !data.results) {

        status.textContent =
            "❌ Aucun résultat.";

        return;
    }

    if (data.results.length === 0) {

        status.textContent =
            "❌ Aucun morceau trouvé.";

        return;
    }

    // Garder uniquement les chansons
    allSongs = data.results.filter(function(song) {

        return song.kind === "song";

    });

    // Supprimer les doublons
    const ids = new Set();

    allSongs = allSongs.filter(function(song) {

        if (ids.has(song.trackId)) {
            return false;
        }

        ids.add(song.trackId);

        return true;

    });

    const artistName =
        allSongs.length > 0
            ? allSongs[0].artistName
            : "Artiste";

    // Afficher artiste
    artistBox.innerHTML = `

        <div class="artistBox">

            <div style="font-size:60px;">
                🎤
            </div>

            <h2>
                ${escapeHTML(artistName)}
            </h2>

            <p>
                ${allSongs.length}
                morceaux trouvés
            </p>

        </div>

    `;

    status.textContent =
        "🎵 " +
        allSongs.length +
        " morceaux trouvés pour " +
        artistName;

    displayedSongs = 0;

    results.innerHTML = "";

    showSongs();

};


// ========================================
// AFFICHER LES MORCEAUX
// ========================================

function showSongs() {

    const results =
        document.getElementById("results");

    const more =
        document.getElementById("moreButton");

    const songs =
        allSongs.slice(
            displayedSongs,
            displayedSongs + songsPerPage
        );

    songs.forEach(function(song) {

        const card =
            document.createElement("div");

        card.className = "card";

        const image =
            song.artworkUrl100 ||
            "https://via.placeholder.com/100";

        const title =
            song.trackName ||
            "Titre inconnu";

        const album =
            song.collectionName ||
            "Album inconnu";

        const artist =
            song.artistName ||
            "Artiste inconnu";

        let player = "";

        if (song.previewUrl) {

            player = `

                <audio
                    controls
                    preload="none"
                    src="${song.previewUrl}">
                </audio>

                <p>
                    🎧 Extrait disponible
                </p>

            `;

        } else {

            player = `

                <p>
                    🎧 Extrait non disponible
                </p>

            `;

        }

        card.innerHTML = `

            <img
                class="cover"
                src="${image}"
                alt="Pochette">

            <div class="info">

                <h3>
                    🎵 ${escapeHTML(title)}
                </h3>

                <p>
                    👤 ${escapeHTML(artist)}
                </p>

                <p>
                    💿 ${escapeHTML(album)}
                </p>

                ${player}

            </div>

        `;

        results.appendChild(card);

    });

    displayedSongs += songs.length;

    if (displayedSongs < allSongs.length) {

        more.style.display = "block";

    } else {

        more.style.display = "none";

    }

}


// ========================================
// CHARGER PLUS
// ========================================

function loadMore() {

    showSongs();

}


// ========================================
// RECHERCHE RAPIDE
// ========================================

function quickSearch(name) {

    document.getElementById("searchInput").value = name;

    searchArtist();

}


// ========================================
// EFFACER
// ========================================

function clearSearch() {

    document.getElementById("searchInput").value = "";

    document.getElementById("results").innerHTML = "";

    document.getElementById("artist").innerHTML = "";

    document.getElementById("status").textContent = "";

    document.getElementById("moreButton").style.display = "none";

}


// ========================================
// PROTECTION DU TEXTE
// ========================================

function escapeHTML(text) {

    return String(text)

        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ========================================
// TOUCHE ENTRÉE
// ========================================

document
    .getElementById("searchInput")
    .addEventListener("keydown", function(event) {

        if (event.key === "Enter") {

            searchArtist();

        }

    });
