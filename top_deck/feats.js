/*

* Realm & Rune
* Feat Library
*
* Loads feats.json and displays each feat
* as a card on feats.html.
  */

fetch("feats.json")
.then(response => {


    if (!response.ok) {
        throw new Error(
            "Could not load feats.json"
        );
    }

    return response.json();

})


.then(feats => {

    const library =
        document.getElementById(
            "feat-library"
        );


    feats.forEach(feat => {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "feat-card";


        card.innerHTML = `

            <h3>
                ${feat.name}
            </h3>

            <div class="feat-meta">

                <span class="feat-cost">
                    Cost: ${feat.cost} Feat Points
                </span>

                <span class="feat-type">
                    ${feat.type}
                </span>

            </div>

            <div class="feat-prerequisite">

                <strong>
                    Prerequisite:
                </strong>

                ${feat.prerequisite || "None"}

            </div>

            <p class="feat-description">

                ${feat.description}

            </p>

        `;


        library.appendChild(card);

    });


    /*
     * Remove the loading message after
     * the feats have successfully loaded.
     */

    const status =
        document.getElementById(
            "feat-status"
        );


    if (status) {
        status.style.display = "none";
    }

})


.catch(error => {

    console.error(
        "Feat loading error:",
        error
    );


    const status =
        document.getElementById(
            "feat-status"
        );


    if (status) {

        status.textContent =
            "Unable to load the feat library.";

    }

});

