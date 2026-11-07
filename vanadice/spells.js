/* ============================================
   VANADICE - SPELL DATABASE
   Loads and displays spells.json
   ============================================ */

let spellData = [];

// Page elements
const container = document.getElementById("spellContainer");
const searchInput = document.getElementById("spellSearch");
const listFilter = document.getElementById("spellListFilter");
const levelFilter = document.getElementById("spellLevelFilter");
const elementFilter = document.getElementById("spellElementFilter");
const countDisplay = document.getElementById("spellCount");

/* ============================================
   LOAD SPELL DATA
   ============================================ */

async function loadSpells() {
    try {
        const response = await fetch("spells.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !Array.isArray(data.spells)) {
            throw new Error("Invalid spells JSON structure.");
        }

        spellData = data.spells;

        renderSpells();

    } catch (error) {
        console.error("Spell loading error:", error);

        container.innerHTML = `
            <div class="rule-note">
                Unable to load spell information.
                Please verify that spells.json exists
                and contains valid JSON.
            </div>
        `;

        countDisplay.textContent = "Spells unavailable.";
    }
}

/* ============================================
   RENDER SPELL CARDS
   ============================================ */

function renderSpells() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedList = listFilter.value;
    const selectedLevel = levelFilter.value;
    const selectedElement = elementFilter.value;

    const filteredSpells = spellData.filter(spell => {
        const spellLists = Array.isArray(spell.spellList)
            ? spell.spellList
            : [];

        const components = Array.isArray(spell.components)
            ? spell.components
            : [];

        const searchableText = [
            spell.name,
            spell.element,
            spell.description,
            spell.upcastEffect,
            spell.castingTime,
            spell.range,
            spell.duration,
            ...spellLists,
            ...components
        ]
            .filter(value => typeof value === "string")
            .join(" ")
            .toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        const matchesList =
            selectedList === "all" ||
            spellLists.includes(selectedList);

        const matchesLevel =
            selectedLevel === "all" ||
            String(spell.spellLevel) === selectedLevel;

        const matchesElement =
            selectedElement === "all" ||
            spell.element === selectedElement;

        return (
            matchesSearch &&
            matchesList &&
            matchesLevel &&
            matchesElement
        );
    });

    countDisplay.textContent =
        `Showing ${filteredSpells.length} of ${spellData.length} spells`;

    if (filteredSpells.length === 0) {
        container.innerHTML = `
            <div class="rule-note">
                No spells match your search.
            </div>
        `;
        return;
    }

    container.innerHTML = filteredSpells.map(spell => {
        const spellLists = Array.isArray(spell.spellList)
            ? spell.spellList
            : [];

        const components = Array.isArray(spell.components)
            ? spell.components
            : [];

        const levelName = Number(spell.spellLevel) === 0
            ? "Cantrip"
            : `Level ${escapeHTML(String(spell.spellLevel))}`;

        const listHTML = spellLists.map(list => `
            <span class="spell-list-tag">
                ${escapeHTML(list)}
            </span>
        `).join("");

        return `
            <article class="rule-card spell-card">

                <div class="spell-card-header">
                    <h3>${escapeHTML(spell.name || "Unnamed Spell")}</h3>

                    <span class="spell-level-tag">
                        ${levelName}
                    </span>
                </div>

                <div class="spell-tags">
                    ${listHTML}
                    <span class="spell-element-tag">
                        ${escapeHTML(spell.element || "None")}
                    </span>
                </div>

                <p class="spell-mp">
                    <strong>MP Cost:</strong>
                    ${escapeHTML(String(spell.mpCost ?? 0))} MP
                </p>

                <div class="spell-stat-grid">

                    <div>
                        <strong>Casting Time</strong>
                        <span>${escapeHTML(spell.castingTime || "Unspecified")}</span>
                    </div>

                    <div>
                        <strong>Range</strong>
                        <span>${escapeHTML(spell.range || "Unspecified")}</span>
                    </div>

                    <div>
                        <strong>Components</strong>
                        <span>${escapeHTML(components.join(", ") || "None")}</span>
                    </div>

                    <div>
                        <strong>Duration</strong>
                        <span>${escapeHTML(spell.duration || "Unspecified")}</span>
                    </div>

                </div>

                <div class="spell-description">
                    <h4>Description</h4>
                    <p>
                        ${escapeHTML(spell.description || "No description available.")}
                    </p>
                </div>

                <div class="spell-upcast">
                    <h4>Upcast Effect</h4>
                    <p>
                        ${escapeHTML(spell.upcastEffect || "No additional effect.")}
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
   FILTER EVENTS
   ============================================ */

searchInput.addEventListener("input", renderSpells);
listFilter.addEventListener("change", renderSpells);
levelFilter.addEventListener("change", renderSpells);
elementFilter.addEventListener("change", renderSpells);

/* ============================================
   INITIALIZE
   ============================================ */

loadSpells();