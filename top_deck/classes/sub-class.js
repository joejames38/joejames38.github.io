document.addEventListener("DOMContentLoaded", loadSubclassFeats);

async function loadSubclassFeats() {

    const container = document.getElementById("subclass-feats");

    if (!container) {
        return;
    }

    // Get the JSON file from the HTML page
    const dataFile = container.dataset.source || "cleric-subclass-feats.json";

    try {

        const response = await fetch(dataFile);

        if (!response.ok) {
            throw new Error("Could not load " + dataFile);
        }

        const feats = await response.json();

        window.subclassFeats = feats;

        createFilters(feats);
        displaySubclassFeats(feats);

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p>
                Unable to load subclass feats.
                Make sure <strong>${dataFile}</strong> exists and is valid JSON.
            </p>
        `;
    }
}


/*
 * Create the filter controls
 */

function createFilters(feats) {

    const filterContainer = document.getElementById("subclass-filters");

    if (!filterContainer) {
        return;
    }

    const types = [...new Set(
        feats.map(feat => feat.type)
    )].sort();

    const costs = [...new Set(
        feats.map(feat => feat.cost)
    )].sort((a, b) => a - b);


    filterContainer.innerHTML = `

        <label for="subclass-type">
            Type:
        </label>

        <select id="subclass-type">
            <option value="all">All</option>

            ${types.map(type => `
                <option value="${type}">
                    ${type}
                </option>
            `).join("")}

        </select>


        <label for="subclass-cost">
            Cost:
        </label>

        <select id="subclass-cost">
            <option value="all">All</option>

            ${costs.map(cost => `
                <option value="${cost}">
                    ${cost}
                </option>
            `).join("")}

        </select>


        <label for="subclass-search">
            Search:
        </label>

        <input
            type="text"
            id="subclass-search"
            placeholder="Search feats..."
        >

    `;


    document
        .getElementById("subclass-type")
        .addEventListener("change", applySubclassFilters);

    document
        .getElementById("subclass-cost")
        .addEventListener("change", applySubclassFilters);

    document
        .getElementById("subclass-search")
        .addEventListener("input", applySubclassFilters);
}


/*
 * Apply all filters
 */

function applySubclassFilters() {

    const type =
        document.getElementById("subclass-type").value;

    const cost =
        document.getElementById("subclass-cost").value;

    const search =
        document
            .getElementById("subclass-search")
            .value
            .toLowerCase();


    const filtered = window.subclassFeats.filter(feat => {

        const matchesType =
            type === "all" ||
            feat.type === type;

        const matchesCost =
            cost === "all" ||
            String(feat.cost) === cost;

        const searchableText = `
            ${feat.name}
            ${feat.type}
            ${feat.prerequisite}
            ${feat.description}
        `.toLowerCase();

        const matchesSearch =
            searchableText.includes(search);

        return (
            matchesType &&
            matchesCost &&
            matchesSearch
        );
    });


    displaySubclassFeats(filtered);
}


/*
 * Display subclass feat cards
 */

function displaySubclassFeats(feats) {

    const container =
        document.getElementById("subclass-feats");

    if (!container) {
        return;
    }

    if (feats.length === 0) {

        container.innerHTML = `
            <p>No subclass feats match your filters.</p>
        `;

        return;
    }


    container.innerHTML = feats.map(feat => `

        <article class="feat-card">

            <h3>${feat.name}</h3>

            <p class="feat-type">
                ${feat.type}
            </p>

            <p>
                <strong>Cost:</strong>
                ${feat.cost} Feat Points
            </p>

            <p>
                <strong>Prerequisite:</strong>
                ${feat.prerequisite}
            </p>

            <p>
                ${feat.description}
            </p>

        </article>

    `).join("");
}