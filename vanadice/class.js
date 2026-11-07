
document.addEventListener("DOMContentLoaded", loadClasses);

async function loadClasses() {
    const classGrid = document.getElementById("class-grid");

    if (!classGrid) {
        console.error("Class grid element not found.");
        return;
    }

    try {
        const response = await fetch("class.json");

        if (!response.ok) {
            throw new Error("Unable to load class.json.");
        }

        const data = await response.json();

        if (!data.classes || !Array.isArray(data.classes)) {
            throw new Error("Invalid class data format.");
        }

        classGrid.innerHTML = "";

        data.classes.forEach(characterClass => {
            const card = document.createElement("div");
            card.className = "rule-card";

            const heading = document.createElement("h3");
            heading.textContent = characterClass.name;

            const description = document.createElement("p");
            description.textContent = characterClass.description;

            const button = document.createElement("button");
            button.type = "button";
            button.textContent = "View Job";

            button.addEventListener("click", () => {
                displayClass(characterClass);
            });

            card.append(heading, description, button);
            classGrid.appendChild(card);
        });

        if (data.classes.length > 0) {
            displayClass(data.classes[0]);
        } else {
            classGrid.textContent = "No classes available.";
        }

    } catch (error) {
        console.error("Class loading error:", error);
        classGrid.textContent = "Unable to load classes.";
    }
}

function displayClass(characterClass) {
    if (!characterClass) {
        console.error("Invalid class selection.");
        return;
    }

    document.getElementById("class-name").textContent =
        characterClass.name || "Unnamed Class";

    document.getElementById("class-description").textContent =
        characterClass.description || "";

    document.getElementById("primary-ability").textContent =
        characterClass.primaryAbility || "—";

    document.getElementById("hit-die").textContent =
        characterClass.hitDie || "—";

    document.getElementById("saving-throws").textContent =
        (characterClass.savingThrows || []).join(", ");

    document.getElementById("weapon-proficiency").textContent =
        (characterClass.weaponProficiency || []).join(", ");

    document.getElementById("armor-training").textContent =
        (characterClass.armorTraining || []).join(", ");

    document.getElementById("multiclass-requirement").textContent =
        characterClass.multiclassRequirement || "—";

    displaySubclasses(characterClass.subclasses || []);

    const progression = document.getElementById("progression-table");

    if (
        characterClass.id === "warrior" &&
        window.VanadiceWarrior
    ) {
        window.VanadiceWarrior.renderProgression(progression);
    } else if (progression) {
        progression.textContent =
            "Level progression has not yet been created for this job.";
    }

    document.getElementById("class-details").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function displaySubclasses(subclasses) {
    const subclassGrid = document.getElementById("subclass-grid");

    if (!subclassGrid) {
        return;
    }

    subclassGrid.innerHTML = "";

    if (subclasses.length === 0) {
        subclassGrid.textContent =
            "No subclasses currently available.";
        return;
    }

    subclasses.forEach(subclass => {
        const card = document.createElement("div");
        card.className = "rule-card";

        const heading = document.createElement("h3");
        heading.textContent = subclass.name || "Unnamed Subclass";

        const description = document.createElement("p");
        description.textContent = subclass.description || "";

        card.append(heading, description);
        subclassGrid.appendChild(card);
    });
}
