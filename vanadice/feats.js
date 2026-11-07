/* ============================================
   VANADICE - FEAT DATABASE
   Loads and displays feats.json
   ============================================ */

let featData = [];

// Page elements
const container = document.getElementById("featContainer");
const searchInput = document.getElementById("featSearch");
const categoryFilter = document.getElementById("featCategoryFilter");
const countDisplay = document.getElementById("featCount");

/* ============================================
   LOAD FEAT DATA
   ============================================ */

async function loadFeats() {
    try {
        const response = await fetch("feats.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !Array.isArray(data.feats)) {
            throw new Error("Invalid feats JSON structure.");
        }

        featData = data.feats;

        renderFeats();

    } catch (error) {
        console.error("Feat loading error:", error);

        container.innerHTML = `
            <div class="rule-note">
                Unable to load feat information.
                Please verify that feats.json exists
                and contains valid JSON.
            </div>
        `;

        countDisplay.textContent = "Feats unavailable.";
    }
}

/* ============================================
   RENDER FEAT CARDS
   ============================================ */

function renderFeats() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredFeats = featData.filter(feat => {
        const searchableText = [
            feat.name,
            feat.category,
            feat.originFeat,
            feat.prerequisites,
            feat.description
        ]
            .filter(value => typeof value === "string")
            .join(" ")
            .toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            feat.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    countDisplay.textContent =
        `Showing ${filteredFeats.length} of ${featData.length} feats`;

    if (filteredFeats.length === 0) {
        container.innerHTML = `
            <div class="rule-note">
                No feats match your search.
            </div>
        `;
        return;
    }

    container.innerHTML = filteredFeats.map(feat => {
        const originStatus =
            String(feat.originFeat).toLowerCase() === "yes";

        return `
            <article class="rule-card feat-card">

                <div class="feat-card-header">
                    <h3>${escapeHTML(feat.name || "Unnamed Feat")}</h3>
                    <span class="feat-category">
                        ${escapeHTML(feat.category || "Uncategorized")}
                    </span>
                </div>

                <p class="feat-origin">
                    <strong>Origin Feat:</strong>
                    ${originStatus ? "Yes" : "No"}
                </p>

                <p class="feat-prerequisites">
                    <strong>Prerequisites:</strong>
                    ${escapeHTML(feat.prerequisites || "None")}
                </p>

                <div class="feat-description">
                    <p>${escapeHTML(
                        feat.description || "No description available."
                    )}</p>
                </div>

            </article>
        `;
    }).join("");
}

/* ============================================
   HTML ESCAPING
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

searchInput.addEventListener("input", renderFeats);
categoryFilter.addEventListener("change", renderFeats);

/* ============================================
   INITIALIZE
   ============================================ */

loadFeats();