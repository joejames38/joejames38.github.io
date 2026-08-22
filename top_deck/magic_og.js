
async function loadSpellLibrary() {

    const container =
        document.getElementById("spell-library-container");

    const status =
        document.getElementById("spell-library-status");

    try {

        const response = await fetch("magic-spells.json");

        if (!response.ok) {
            throw new Error(
                "Unable to load magic-spells.json (" +
                response.status +
                ")"
            );
        }

        const data = await response.json();

        status.remove();

        renderSpells(data.spells, container);

    } catch (error) {

        status.innerHTML =
            "<strong>Spell Library Error</strong>" +
            "<p>" +
            error.message +
            "</p>" +
            "<p>" +
            "If you are opening this page directly from your computer, " +
            "run the site through a local web server such as VS Code " +
            "Live Server." +
            "</p>";

        console.error(error);

    }

}


function renderSpells(spells, container) {

    const tiers = [0, 1, 2, 3, 4, 5];

    tiers.forEach(tier => {

        const tierSpells =
            spells.filter(spell => spell.tier === tier);

        if (tierSpells.length === 0) {
            return;
        }

        const section =
            document.createElement("section");

        section.className =
            "spell-tier-section";

        const heading =
            document.createElement("h3");

        heading.textContent =
            "Tier " + tier;

        section.appendChild(heading);

        tierSpells.forEach(spell => {

            const card =
                document.createElement("article");

            card.className =
                "ability-box spell-card";

            const title =
                document.createElement("h4");

            title.textContent =
                spell.name;

            card.appendChild(title);

            const metadata =
                document.createElement("div");

            metadata.className =
                "spell-metadata";

            metadata.innerHTML =
                "<strong>Resonance:</strong> " +
                spell.resonance +
                " &nbsp; | &nbsp; " +

                "<strong>Range:</strong> " +
                spell.range +
                " &nbsp; | &nbsp; " +

                "<strong>Target:</strong> " +
                spell.target +
                " &nbsp; | &nbsp; " +

                "<strong>Duration:</strong> " +
                spell.duration +
                " &nbsp; | &nbsp; " +

                "<strong>Classes:</strong> " +
                spell.classes.join(", ");

            card.appendChild(metadata);

            if (spell.channel) {

                const channel =
                    document.createElement("p");

                channel.innerHTML =
                    "<strong>Channel:</strong> " +
                    spell.channel;

                card.appendChild(channel);

            }

            const description =
                document.createElement("p");

            description.textContent =
                spell.description;

            card.appendChild(description);

            section.appendChild(card);

        });

        container.appendChild(section);

    });

}


loadSpellLibrary();