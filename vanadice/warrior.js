
(function () {
    const progression = [
        {
            level: 1,
            proficiency: "+2",
            rageUses: 2,
            rageDamage: "+2",
            features: [
                "Rage",
                "Unarmored Defense",
                "Weapon Mastery"
            ]
        },
        {
            level: 2,
            proficiency: "+2",
            rageUses: 2,
            rageDamage: "+2",
            features: [
                "Danger Sense",
                "Reckless Attack"
            ]
        },
        {
            level: 3,
            proficiency: "+2",
            rageUses: 3,
            rageDamage: "+2",
            features: [
                "Warrior Subclass",
                "Primal Knowledge"
            ]
        },
        {
            level: 4,
            proficiency: "+2",
            rageUses: 3,
            rageDamage: "+2",
            features: [
                "Ability Score Improvement"
            ]
        },
        {
            level: 5,
            proficiency: "+3",
            rageUses: 3,
            rageDamage: "+2",
            features: [
                "Extra Attack",
                "Fast Movement"
            ]
        },
        {
            level: 6,
            proficiency: "+3",
            rageUses: 4,
            rageDamage: "+2",
            features: [
                "Subclass Feature"
            ]
        },
        {
            level: 7,
            proficiency: "+3",
            rageUses: 4,
            rageDamage: "+2",
            features: [
                "Feral Instinct",
                "Instinctive Pounce"
            ]
        },
        {
            level: 8,
            proficiency: "+3",
            rageUses: 4,
            rageDamage: "+2",
            features: [
                "Ability Score Improvement"
            ]
        },
        {
            level: 9,
            proficiency: "+4",
            rageUses: 4,
            rageDamage: "+3",
            features: [
                "Brutal Strike",
                "Subclass Feature"
            ]
        },
        {
            level: 10,
            proficiency: "+4",
            rageUses: 4,
            rageDamage: "+3",
            features: [
                "Relentless Fury"
            ]
        }
    ];

    function renderProgression(container) {
        const table = document.createElement("table");

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        [
            "Level",
            "Proficiency Bonus",
            "Rage Uses",
            "Rage Damage",
            "Features"
        ].forEach(label => {
            const th = document.createElement("th");
            th.textContent = label;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);

        const tbody = document.createElement("tbody");

        progression.forEach(level => {
            const row = document.createElement("tr");

            const values = [
                level.level,
                level.proficiency,
                level.rageUses,
                level.rageDamage,
                level.features.join(", ")
            ];

            values.forEach(value => {
                const td = document.createElement("td");
                td.textContent = value;
                row.appendChild(td);
            });

            tbody.appendChild(row);
        });

        table.append(thead, tbody);

        container.innerHTML = "";
        container.appendChild(table);

        const note = document.createElement("div");
        note.className = "rule-note";

        const heading = document.createElement("h3");
        heading.textContent = "Warrior Progression Notes";

        const description = document.createElement("p");
        description.textContent =
            "Rage uses are restored on a Long Rest, with one expended use " +
            "restored on a Short Rest. Subclass features are gained at " +
            "levels 3, 6, and 9. Ability Score Improvements are gained " +
            "at levels 4 and 8.";

        note.append(heading, description);
        container.appendChild(note);
    }

    window.VanadiceWarrior = {
        progression,
        renderProgression
    };
})();
