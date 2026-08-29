document.addEventListener("DOMContentLoaded", function () {

    fetch("ancestry.json")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Could not load ancestry.json");
            }

            return response.json();
        })
        .then(function (ancestries) {

            const container = document.getElementById("ancestry-list");

            if (!container) {
                console.error("Missing #ancestry-list element.");
                return;
            }

            container.innerHTML = "";

            ancestries.forEach(function (ancestry) {

                // -----------------------------------------
                // Ancestry Card
                // -----------------------------------------

                const ancestryCard = document.createElement("section");

                ancestryCard.className = "ancestry-card";

                const ancestryTitle = document.createElement("h2");

                ancestryTitle.textContent = ancestry.name;

                ancestryCard.appendChild(ancestryTitle);


                // -----------------------------------------
                // Feat Grid
                // -----------------------------------------

                const featGrid = document.createElement("div");

                featGrid.className = "ancestry-feat-grid";


                // -----------------------------------------
                // Create Four Feat Cards
                // -----------------------------------------

                ancestry.feats.forEach(function (feat) {

                    const featCard = document.createElement("article");

                    featCard.className = "ancestry-feat-card";


                    const featName = document.createElement("h3");

                    featName.textContent = feat.name;


                    const prerequisite = document.createElement("p");

                    prerequisite.innerHTML =
                        "<strong>Prerequisite:</strong> " +
                        feat.prerequisite;


                    const description = document.createElement("p");

                    description.textContent = feat.description;


                    featCard.appendChild(featName);
                    featCard.appendChild(prerequisite);
                    featCard.appendChild(description);

                    featGrid.appendChild(featCard);

                });


                ancestryCard.appendChild(featGrid);

                container.appendChild(ancestryCard);

            });

        })
        .catch(function (error) {

            console.error("Ancestry loading error:", error);

            const container = document.getElementById("ancestry-list");

            if (container) {
                container.innerHTML =
                    "<p>Unable to load the ancestry library.</p>";
            }

        });

});