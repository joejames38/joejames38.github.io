document.addEventListener("DOMContentLoaded", loadBestiary);

async function loadBestiary() {
    const container = document.getElementById("bestiary");

    try {
        const response = await fetch("bestiary.json");

        if (!response.ok) {
            throw new Error("Could not load bestiary.json");
        }

        const enemies = await response.json();

        container.innerHTML = "";

        enemies.forEach(enemy => {
            container.appendChild(createEnemyCard(enemy));
        });

    } catch (error) {
        console.error(error);

        container.innerHTML = `
            <p>
                Unable to load the bestiary.
                Make sure <strong>bestiary.json</strong> is in the same
                directory as this page and that the site is being served
                through GitHub Pages or another web server.
            </p>
        `;
    }
}


function createEnemyCard(enemy) {

    const card = document.createElement("article");

    card.className = "enemy-card";

    card.innerHTML = `
        <div class="card-corner top-left">
            <strong>${enemy.level}</strong>
            <span>${getSuitSymbol(enemy.suit)}</span>
        </div>

        <div class="enemy-card-header">
            <h2>${enemy.name}</h2>
            <p>${enemy.type}</p>
        </div>

        <div class="enemy-card-level">
            ${getSuitSymbol(enemy.suit)}
            ${enemy.level}
        </div>

        <div class="enemy-stats">

            <div class="stat">
                <span>HP</span>
                <strong>${enemy.hp}</strong>
            </div>

            <div class="stat">
                <span>AC</span>
                <strong>${enemy.ac}</strong>
            </div>

            <div class="stat">
                <span>Hand</span>
                <strong>${enemy.handSize}</strong>
            </div>

        </div>

        <div class="attribute-grid">

            <div>
                <span>♠ Might</span>
                <strong>${formatModifier(enemy.might)}</strong>
            </div>

            <div>
                <span>♥ Spirit</span>
                <strong>${formatModifier(enemy.spirit)}</strong>
            </div>

            <div>
                <span>♣ Dexterity</span>
                <strong>${formatModifier(enemy.dexterity)}</strong>
            </div>

            <div>
                <span>♦ Cunning</span>
                <strong>${formatModifier(enemy.cunning)}</strong>
            </div>

        </div>

        <div class="abilities">
            <h3>Abilities</h3>

            ${enemy.abilities.map(ability => `
                <div class="ability">
                    <strong>${ability.name}</strong>
                    <p>${ability.description}</p>
                </div>
            `).join("")}

        </div>

        <div class="card-corner bottom-right">
            <strong>${enemy.level}</strong>
            <span>${getSuitSymbol(enemy.suit)}</span>
        </div>
    `;

    return card;
}


function getSuitSymbol(suit) {

    switch (suit.toLowerCase()) {

        case "spades":
            return "♠";

        case "hearts":
            return "♥";

        case "clubs":
            return "♣";

        case "diamonds":
            return "♦";

        default:
            return "?";
    }
}


function formatModifier(value) {

    if (value > 0) {
        return "+" + value;
    }

    return value;
}