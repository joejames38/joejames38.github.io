
/* ============================================
   VANADICE - ANCESTRY DATABASE
   Loads and displays ancestry.json
   ============================================ */

let ancestryData = [];

// Page elements
const container = document.getElementById("ancestryContainer");
const searchInput = document.getElementById("ancestrySearch");
const sizeFilter = document.getElementById("sizeFilter");
const countDisplay = document.getElementById("ancestryCount");

/* ============================================
   LOAD ANCESTRY DATA
   ============================================ */

async function loadAncestries() {

    try {

        const response = await fetch("ancestry.json");

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }

        const data = await response.json();

        if (!data || !Array.isArray(data.ancestries)) {
            throw new Error("Invalid ancestry JSON structure.");
        }

        ancestryData = data.ancestries;

        renderAncestries();

    } catch (error) {

        console.error("Ancestry loading error:", error);

        container.innerHTML = `
            <div class="rule-note">
                Unable to load ancestry information.
                Please verify that ancestry.json exists
                and contains valid JSON.
            </div>
        `;

        countDisplay.textContent = "Ancestries unavailable.";

    }

}

/* ============================================
   RENDER ANCESTRY CARDS
   ============================================ */

function renderAncestries() {

    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedSize = sizeFilter.value;

    const filteredAncestries = ancestryData.filter(ancestry => {

        const traits = Array.isArray(ancestry.specialTraits)
            ? ancestry.specialTraits
            : [];

        const traitSearchText = traits.map(trait =>
            `${trait.name || ""} ${trait.description || ""}`
        ).join(" ");

        const searchableText = [
            ancestry.name,
            ancestry.description,
            traitSearchText
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        const matchesSize =
            selectedSize === "all" ||
            ancestry.size === selectedSize;

        return matchesSearch && matchesSize;

    });

    countDisplay.textContent =
        `Showing ${filteredAncestries.length} of ${ancestryData.length} ancestries`;

    if (filteredAncestries.length === 0) {

        container.innerHTML = `
            <div class="rule-note">
                No ancestries match your search.
            </div>
        `;

        return;

    }

    container.innerHTML = filteredAncestries.map(ancestry => {

        const traits = Array.isArray(ancestry.specialTraits)
            ? ancestry.specialTraits
            : [];

        const traitHTML = traits.map(trait => `

            <li>
                <strong>${escapeHTML(trait.name || "Unnamed Trait")}:</strong>
                ${escapeHTML(trait.description || "No description available.")}
            </li>

        `).join("");

        return `

            <article class="rule-card ancestry-card">

                <h3>${escapeHTML(ancestry.name || "Unnamed Ancestry")}</h3>
				<br>
                <p class="ancestry-description">
                    ${escapeHTML(ancestry.description || "No description available.")}
                </p>
				<br>
                <div class="ancestry-stats">

                    <span>
                        <strong>Size:</strong>
                        ${escapeHTML(ancestry.size || "Unspecified")}
                    </span>

                    <span>
                        <strong>Speed:</strong>
                        ${escapeHTML(String(ancestry.speed ?? "Unspecified"))}
                        ${ancestry.speed !== undefined ? " ft." : ""}
                    </span>

                </div>
				<br>
                <h4>Special Traits</h4>
				<br>
                <ul class="ancestry-traits">
                    ${traitHTML || "<li>No special traits listed.</li>"}
                </ul>

            </article>

        `;

    }).join("");

}

/* ============================================
   HTML ESCAPING
   Prevents JSON content from being interpreted
   as executable HTML.
   ============================================ */

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];

    });

}

/* ============================================
   SEARCH AND FILTER EVENTS
   ============================================ */

searchInput.addEventListener("input", renderAncestries);

sizeFilter.addEventListener("change", renderAncestries);

/* ============================================
   INITIALIZE
   ============================================ */

loadAncestries();
