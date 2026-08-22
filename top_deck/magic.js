document.addEventListener("DOMContentLoaded", () => {

    const spellList = document.getElementById("spell-list");
    const tierFilter = document.getElementById("tier-filter");
    const classFilter = document.getElementById("class-filter");
    const domainFilter = document.getElementById("domain-filter");
    const searchInput = document.getElementById("spell-search");
    const resultCount = document.getElementById("result-count");
    const resetButton = document.getElementById("reset-filters");

    let spells = [];


    // Load spell library
    fetch("spells.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Unable to load spells.json");
            }

            return response.json();
        })
        .then(data => {

            // Allow either:
            // [ ...spells ]
            // or
            // { "spells": [ ...spells ] }

            spells = Array.isArray(data)
                ? data
                : data.spells;

            if (!Array.isArray(spells)) {
                throw new Error("Spell library format is invalid.");
            }

            populateFilters();
            displaySpells();

        })
        .catch(error => {

            console.error(error);

            spellList.innerHTML =
                "<p>Unable to load the spell library.</p>";

        });


    // Populate filter menus from the JSON
    function populateFilters() {

        const tiers = new Set();
        const classes = new Set();
        const domains = new Set();


        spells.forEach(spell => {

            if (spell.tier !== undefined) {
                tiers.add(spell.tier);
            }


            if (Array.isArray(spell.classes)) {

                spell.classes.forEach(className => {
                    classes.add(className);
                });

            }


            if (spell.domain) {
                domains.add(spell.domain);
            }

        });


        // Tiers
        [...tiers]
            .sort((a, b) => Number(a) - Number(b))
            .forEach(tier => {

                const option =
                    document.createElement("option");

                option.value = tier;
                option.textContent = `Tier ${tier}`;

                tierFilter.appendChild(option);

            });


        // Classes
        [...classes]
            .sort()
            .forEach(className => {

                const option =
                    document.createElement("option");

                option.value = className;
                option.textContent = className;

                classFilter.appendChild(option);

            });


        // Domains
        [...domains]
            .sort()
            .forEach(domain => {

                const option =
                    document.createElement("option");

                option.value = domain;
                option.textContent = domain;

                domainFilter.appendChild(option);

            });

    }


    // Display filtered spells
    function displaySpells() {

        const selectedTier = tierFilter.value;
        const selectedClass = classFilter.value;
        const selectedDomain = domainFilter.value;
        const searchText =
            searchInput.value.trim().toLowerCase();


        const filteredSpells = spells.filter(spell => {

            // Tier
            if (
                selectedTier !== "all" &&
                String(spell.tier) !== selectedTier
            ) {
                return false;
            }


            // Class
            if (
                selectedClass !== "all" &&
                (
                    !Array.isArray(spell.classes) ||
                    !spell.classes.includes(selectedClass)
                )
            ) {
                return false;
            }


            // Domain
            if (
                selectedDomain !== "all" &&
                spell.domain !== selectedDomain
            ) {
                return false;
            }


            // Search
            if (searchText !== "") {

                const searchableText = [

                    spell.name,
                    spell.domain,
                    spell.description,
                    spell.range,
                    spell.target,
                    spell.duration,
                    ...(spell.classes || [])

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                if (!searchableText.includes(searchText)) {
                    return false;
                }

            }


            return true;

        });


        spellList.innerHTML = "";


        if (filteredSpells.length === 0) {

            spellList.innerHTML =
                "<p>No spells match your filters.</p>";

            resultCount.textContent =
                "0 spells";

            return;

        }


        filteredSpells.forEach(spell => {

            const card =
                document.createElement("article");

            card.className = "spell-card";


            const classes =
                Array.isArray(spell.classes)
                    ? spell.classes.join(", ")
                    : spell.classes || "—";


            card.innerHTML = `

                <h3>${spell.name}</h3>

                <div class="spell-meta">

                    <span>
                        Tier ${spell.tier}
                    </span>

                    <span>
                        ${spell.domain || "—"}
                    </span>

                </div>

                <p>
                    <strong>Range:</strong>
                    ${spell.range || "—"}
                </p>

                <p>
                    <strong>Target:</strong>
                    ${spell.target || "—"}
                </p>

                <p>
                    <strong>Duration:</strong>
                    ${spell.duration || "—"}
                </p>

                <p>
                    <strong>Classes:</strong>
                    ${classes}
                </p>

                <p>
                    ${spell.description || ""}
                </p>

            `;


            spellList.appendChild(card);

        });


        resultCount.textContent =
            `${filteredSpells.length} spell${
                filteredSpells.length === 1 ? "" : "s"
            }`;

    }


    // Filter events
    tierFilter.addEventListener(
        "change",
        displaySpells
    );


    classFilter.addEventListener(
        "change",
        displaySpells
    );


    domainFilter.addEventListener(
        "change",
        displaySpells
    );


    searchInput.addEventListener(
        "input",
        displaySpells
    );


    // Reset filters
    resetButton.addEventListener("click", () => {

        tierFilter.value = "all";
        classFilter.value = "all";
        domainFilter.value = "all";
        searchInput.value = "";

        displaySpells();

    });

});