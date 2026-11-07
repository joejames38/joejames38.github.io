/* ============================================
   VANADICE - BACKGROUND DATABASE
   Loads and displays backgrounds.json
   ============================================ */

let backgroundData = [];

// Page elements
const container = document.getElementById("backgroundContainer");
const searchInput = document.getElementById("backgroundSearch");
const featFilter = document.getElementById("backgroundFeatFilter");
const countDisplay = document.getElementById("backgroundCount");

/* ============================================
   LOAD BACKGROUND DATA
   ============================================ */

async function loadBackgrounds() {
    try {
        const response = await fetch("backgrounds.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !Array.isArray(data.backgrounds)) {
            throw new Error("Invalid backgrounds JSON structure.");
        }

        backgroundData = data.backgrounds;

        populateFeatFilter();
        renderBackgrounds();

    } catch (error) {
        console.error("Background loading error:", error);

        container.innerHTML = `
            <div class="rule-note">
                Unable to load background information.
                Please verify that backgrounds.json exists
                and contains valid JSON.
            </div>
        `;

        countDisplay.textContent = "Backgrounds unavailable.";
    }
}

/* ============================================
   POPULATE ORIGIN FEAT FILTER
   ============================================ */

function populateFeatFilter() {
    const feats = [
        ...new Set(
            backgroundData
                .map(background => background.originFeat)
                .filter(feat => typeof feat === "string" && feat.trim())
        )
    ].sort();

    featFilter.innerHTML = `
        <option value="all">All Origin Feats</option>
        ${feats.map(feat => `
            <option value="${escapeHTML(feat)}">
                ${escapeHTML(feat)}
            </option>
        `).join("")}
    `;
}

/* ============================================
   RENDER BACKGROUND CARDS
   ============================================ */

function renderBackgrounds() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedFeat = featFilter.value;

    const filteredBackgrounds = backgroundData.filter(background => {
        const abilityOptions = Array.isArray(background.abilityOptions)
            ? background.abilityOptions
            : [];

        const skills = Array.isArray(background.skillProficiencies)
            ? background.skillProficiencies
            : [];

        const searchableText = [
            background.name,
            background.description,
            ...abilityOptions,
            background.originFeat,
            ...skills,
            background.toolProficiency
        ]
            .filter(value => typeof value === "string")
            .join(" ")
            .toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        const matchesFeat =
            selectedFeat === "all" ||
            background.originFeat === selectedFeat;

        return matchesSearch && matchesFeat;
    });

    countDisplay.textContent =
        `Showing ${filteredBackgrounds.length} of ${backgroundData.length} backgrounds`;

    if (filteredBackgrounds.length === 0) {
        container.innerHTML = `
            <div class="rule-note">
                No backgrounds match your search.
            </div>
        `;
        return;
    }

    container.innerHTML = filteredBackgrounds.map(background => {
        const abilityOptions = Array.isArray(background.abilityOptions)
            ? background.abilityOptions
            : [];

        const skills = Array.isArray(background.skillProficiencies)
            ? background.skillProficiencies
            : [];

        const abilityHTML = abilityOptions
            .map(ability => `<span>${escapeHTML(ability)}</span>`)
            .join("");

        const skillHTML = skills
            .map(skill => `<li>${escapeHTML(skill)}</li>`)
            .join("");

        return `
            <article class="rule-card ancestry-card background-card">

                <h3>${escapeHTML(background.name || "Unnamed Background")}</h3>

                <p class="ancestry-description">
                    ${escapeHTML(
                        background.description || "No description available."
                    )}
                </p>

                <div class="background-detail">
                    <h4>Ability Score Options</h4>
                    <div class="background-abilities">
                        ${abilityHTML || "<span>Not specified</span>"}
                    </div>
                    <p class="background-note">
                        Choose +2/+1 or +1 to each of the three abilities.
                    </p>
                </div>

                <div class="background-detail">
                    <h4>Origin Feat</h4>
                    <p>
                        ${escapeHTML(background.originFeat || "Not specified")}
                    </p>
                </div>

                <div class="background-detail">
                    <h4>Skill Proficiencies</h4>
                    <ul class="ancestry-traits">
                        ${skillHTML || "<li>Not specified</li>"}
                    </ul>
                </div>

                <div class="background-detail">
                    <h4>Tool Proficiency</h4>
                    <p>
                        ${escapeHTML(
                            background.toolProficiency || "Not specified"
                        )}
                    </p>
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

searchInput.addEventListener("input", renderBackgrounds);
featFilter.addEventListener("change", renderBackgrounds);

/* ============================================
   INITIALIZE
   ============================================ */

loadBackgrounds();