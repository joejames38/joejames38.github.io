// Load dropdown options from dropdowns.json
fetch('dropdowns.json')
    .then(response => response.json())
    .then(data => {
        const ancestrySelect = document.getElementById('charAncestry');

        // Populate Ancestry dropdown
        for (const ancestry in data.ancestries[0]) {
            const option = document.createElement('option');
            option.value = ancestry;
            option.textContent = `${ancestry} - ${data.ancestries[0][ancestry]}`;
            ancestrySelect.appendChild(option);
        }
    })
    .catch(error => console.error('Error loading dropdowns.json:', error));

// Load dropdown options for ancestries and backgrounds
fetch('dropdowns.json')
    .then(response => response.json())
    .then(data => {
        // Populate Fantasy Background dropdown
        const heritageBackground = document.getElementById('heritageBackground');
        for (const background in data.backgrounds[0]) {
            const option = document.createElement('option');
            option.value = background;
            option.textContent = `${background} - ${data.backgrounds[0][background]}`;
            heritageBackground.appendChild(option);
        }

        // Populate Biome Background dropdown
        const biomeDropdown = document.getElementById('biomeBackground');
        for (const background in data.backgrounds[1]) {
            const option = document.createElement('option');
            option.value = background;
            option.textContent = `${background} - ${data.backgrounds[1][background]}`;
            biomeDropdown.appendChild(option);
        }

        // Event listeners for displaying features
        heritageBackground.addEventListener('change', () => {
            const selected = heritageBackground.value;
            const featureText = data.backgrounds[0][selected] || 'None selected';
            document.getElementById('featureFantasy').querySelector('span').textContent = featureText;
        });

        biomeDropdown.addEventListener('change', () => {
            const selected = biomeDropdown.value;
            const featureText = data.backgrounds[1][selected] || 'None selected';
            document.getElementById('featureBiome').querySelector('span').textContent = featureText;
        });
    })
    .catch(error => console.error('Error loading dropdowns.json:', error));


// Load skills from skills.json
fetch('skills.json')
    .then(response => response.json())
    .then(data => {
        const initiativeSkillsSection = document.getElementById('initiativeSkillsSection');
        const saveSkillsSection = document.getElementById('saveSkillsSection');
        const combatSkillsSection = document.getElementById('combatSkillsSection');
        const adventureSkillsSection = document.getElementById('adventureSkillsSection');
		const customSkillsSection = document.getElementById('customSkillsSection');

        // Process Initiative Skill
        data.skills
            .filter(skill => skill.type === "Initiative")
            .forEach(skill => {
                const skillContainer = document.createElement('div');
                skillContainer.classList.add('skill-display');
                skillContainer.innerHTML = `
                    <label>
                        <input type="number" id="skill${skill.name}" name="skill${skill.name}" min="0" value="0" class="skill-input" data-associated-stat="stat${skill.attribute}">
                        ${skill.name} (${skill.attribute})
						<span class="skill-result" id="result${skill.name}">0</span>
                    </label>
                `;
                initiativeSkillsSection.appendChild(skillContainer);
            });

        // Process Saves
        data.skills
            .filter(skill => skill.type === "Save")
            .forEach(skill => {
                const skillContainer = document.createElement('div');
                skillContainer.classList.add('skill-display');
                skillContainer.innerHTML = `
                    <label>
                        <input type="number" id="skill${skill.name}" name="skill${skill.name}" min="0" value="0" class="skill-input" data-associated-stat="stat${skill.attribute}">
                        ${skill.name} (${skill.attribute})
						<span class="skill-result" id="result${skill.name}">0</span>
                    </label>
                `;
                saveSkillsSection.appendChild(skillContainer);
            });

        // Process Combat Skills
        data.skills
            .filter(skill => skill.type === "Combat")
            .forEach(skill => {
                const skillContainer = document.createElement('div');
                skillContainer.classList.add('skill-display');
                skillContainer.innerHTML = `
                    <label>
                        <input type="number" id="skill${skill.name}" name="skill${skill.name}" min="0" value="0" class="skill-input" data-associated-stat="stat${skill.attribute}">
                        ${skill.name} (${skill.attribute})
						<span class="skill-result" id="result${skill.name}">0</span>
                    </label>
                `;
                combatSkillsSection.appendChild(skillContainer);
            });

        // Process Adventure Skills
        data.skills
            .filter(skill => skill.type === "Adventure")
            .forEach(skill => {
                const skillContainer = document.createElement('div');
                skillContainer.classList.add('skill-display');
                skillContainer.innerHTML = `
                    <label>
                        <input type="number" id="skill${skill.name}" name="skill${skill.name}" min="0" value="0" class="skill-input" data-associated-stat="stat${skill.attribute}">
                        ${skill.name} (${skill.attribute})
						<span class="skill-result" id="result${skill.name}">0</span>
                    </label>
                `;
                adventureSkillsSection.appendChild(skillContainer);
            });

        // Process Custom Skills
        data.skills
            .filter(skill => skill.type === "Science") // Change this value based on the baseset skills
            .forEach(skill => {
                const skillContainer = document.createElement('div');
                skillContainer.classList.add('skill-display');
                skillContainer.innerHTML = `
                    <label>
                        <input type="number" id="skill${skill.name}" name="skill${skill.name}" min="0" value="0" class="skill-input" data-associated-stat="stat${skill.attribute}">
                        ${skill.name} (${skill.attribute})
						<span class="skill-result" id="result${skill.name}">0</span>
                    </label>
                `;
                customSkillsSection.appendChild(skillContainer);
            });

        // Add event listeners for skill validation and totals
        document.querySelectorAll('.stat-input').forEach(input => {
            input.addEventListener('input', () => {
                updateMaxSkillValues(data.skills);
                updateSkillTotals(data.skills);
            });
        });

        document.querySelectorAll('.skill-input').forEach(input => {
            input.addEventListener('input', () => {
                validateSkillValue(data.skills);
                updateSkillTotals(data.skills);
            });
        });

        updateMaxSkillValues(data.skills);
        updateSkillTotals(data.skills);
    })
    .catch(error => console.error('Error loading skills.json:', error));


// Function to validate skill values
function validateSkillValue(skills) {
    document.querySelectorAll('.skill-input').forEach(skillInput => {
        const associatedStatId = skillInput.dataset.associatedStat;
        const associatedStatValue = parseInt(document.getElementById(associatedStatId).value) || 0;

        // Ensure skill value does not exceed the associated stat
        if (parseInt(skillInput.value) > associatedStatValue) {
            skillInput.value = associatedStatValue;
        }
    });
}

// Function to update max values for skills
function updateMaxSkillValues(skills) {
    skills.forEach(skill => {
        const skillInput = document.getElementById(`skill${skill.name}`);
        const associatedStatId = skillInput.dataset.associatedStat;
        const associatedStatValue = parseInt(document.getElementById(associatedStatId).value) || 0;

        // Set max value for skill based on associated stat
        skillInput.max = associatedStatValue;

        // Adjust value if it exceeds the new max
        if (parseInt(skillInput.value) > associatedStatValue) {
            skillInput.value = associatedStatValue;
        }
    });
}

// Function to update skill totals
function updateSkillTotals(skills) {
    skills.forEach(skill => {
        const skillInput = document.getElementById(`skill${skill.name}`);
        const associatedStatId = skillInput.dataset.associatedStat;
        const associatedStatValue = parseInt(document.getElementById(associatedStatId).value) || 0;
        const skillValue = parseInt(skillInput.value) || 0;

        // Calculate and display the total
        const total = associatedStatValue + skillValue;
        const resultElement = document.getElementById(`result${skill.name}`);
        resultElement.textContent = total;
    });
}

// Function to dynamically generate Action Dice checkboxes
function updateActionDice() {
    const actionDiceCount = document.getElementById('actionDiceCount').value || 0;
    const actionDiceTracker = document.getElementById('actionDiceTracker');
    actionDiceTracker.innerHTML = ''; // Clear existing checkboxes

    // Generate checkboxes
    for (let i = 0; i < actionDiceCount; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('styled-checkbox');
        checkbox.id = `actionDice${i + 1}`;

        const label = document.createElement('label');
        label.htmlFor = `actionDice${i + 1}`;
        label.textContent = `Die ${i + 1}`;
        label.classList.add('checkbox-label');

        const container = document.createElement('div');
        container.classList.add('checkbox-container');
        container.appendChild(checkbox);
        container.appendChild(label);

        actionDiceTracker.appendChild(container);
    }
}

// Event listener for Action Dice input changes
document.getElementById('actionDiceCount').addEventListener('input', updateActionDice);

// Initialize with default value
updateActionDice();
