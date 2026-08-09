/*

* ============================================================
* REALM & RUNE — FEAT LIBRARY
*
* This file controls the feat library displayed by feats.html.
*
* Required files:
*
* ```
  feats.html
  ```
* ```
  feats.json
  ```
* ```
  feats.js
  ```
*
* feats.json must contain an array of feat objects.
*
* Example:
*
* {
* ```
  "name": "Skilled",
  ```
* ```
  "type": "skill",
  ```
* ```
  "cost": 2,
  ```
* ```
  "prerequisite": "None",
  ```
* ```
  "description": "Gain proficiency in one skill."
  ```
* }
*
* ============================================================
  */

let feats = [];

let currentCategory = "all";

/*

* ============================================================
* LOAD FEAT DATA
* ============================================================
  */

async function loadFeats() {

```
const status =
    document.getElementById("feat-status");


try {

    const response =
        await fetch("feats.json", {
            cache: "no-cache"
        });


    /*
     * fetch() does not automatically throw an error for
     * HTTP errors such as 404.
     */

    if (!response.ok) {

        throw new Error(
            "HTTP " +
            response.status +
            " — feats.json could not be loaded."
        );

    }


    /*
     * Convert the response into JavaScript data.
     */

    const data =
        await response.json();


    /*
     * The library must be a JSON array.
     */

    if (!Array.isArray(data)) {

        throw new Error(
            "feats.json must contain a JSON array."
        );

    }


    feats = data;


    /*
     * Warn about malformed feat entries.
     */

    validateFeats();


    /*
     * Loading succeeded.
     */

    status.style.display = "none";


    createCategoryButtons();

    displayFeats();

}


catch (error) {

    console.error(
        "Unable to load feat library:",
        error
    );


    showLoadError(
        status,
        error
    );

}
```

}

/*

* ============================================================
* VALIDATE FEATS
* ============================================================
  */

function validateFeats() {

```
feats.forEach(
    (feat, index) => {

        if (!feat.name) {

            console.warn(
                "Feat " +
                index +
                " is missing a name."
            );

        }


        if (feat.cost === undefined) {

            console.warn(
                "Feat " +
                index +
                " is missing a cost."
            );

        }


        if (!feat.type) {

            console.warn(
                "Feat " +
                index +
                " is missing a type."
            );

        }


        if (!feat.description) {

            console.warn(
                "Feat " +
                index +
                " is missing a description."
            );

        }

    }
);
```

}

/*

* ============================================================
* ERROR DISPLAY
* ============================================================
  */

function showLoadError(
status,
error
) {

```
const openedLocally =
    window.location.protocol === "file:";


if (openedLocally) {

    status.innerHTML = `

        <strong>
            Unable to load feats.json.
        </strong>

        <p>

            This page is being opened directly from your
            computer using <code>file://</code>.

            Most browsers block JavaScript from loading
            local JSON files this way.

        </p>

        <p>

            Run the project through a local web server
            and open the page through
            <code>http://localhost</code>.

        </p>

        <pre>python -m http.server 8000</pre>

    `;

}

else {

    status.innerHTML = `

        <strong>
            Unable to load feats.json.
        </strong>

        <p>
            ${escapeHTML(error.message)}
        </p>

        <p>

            Verify that <code>feats.json</code> exists
            in the same directory as
            <code>feats.html</code>.

        </p>

    `;

}


status.classList.add(
    "feat-error"
);
```

}

/*

* ============================================================
* CREATE CATEGORY BUTTONS
* ============================================================
  */

function createCategoryButtons() {

```
const filter =
    document.getElementById(
        "feat-filter"
    );


/*
 * Prevent duplicate buttons if the function is called
 * again during development.
 */

filter.innerHTML = "";


/*
 * Create the All button.
 */

const allButton =
    document.createElement("button");


allButton.type = "button";

allButton.dataset.category = "all";

allButton.classList.add("active");

allButton.textContent = "All";


allButton.addEventListener(
    "click",
    function () {

        currentCategory = "all";

        updateActiveButton();

        displayFeats();

    }
);


filter.appendChild(
    allButton
);


/*
 * Find unique feat categories.
 */

const categories = [
    ...new Set(
        feats
            .map(
                feat => feat.type
            )
            .filter(Boolean)
    )
];


categories.sort();


/*
 * Create a button for each category.
 */

categories.forEach(
    category => {

        const button =
            document.createElement(
                "button"
            );


        button.type = "button";

        button.dataset.category =
            category;


        button.textContent =
            capitalize(category);


        button.addEventListener(
            "click",
            function () {

                currentCategory =
                    category;

                updateActiveButton();

                displayFeats();

            }
        );


        filter.appendChild(
            button
        );

    }
);
```

}

/*

* ============================================================
* UPDATE ACTIVE CATEGORY BUTTON
* ============================================================
  */

function updateActiveButton() {

```
const buttons =
    document.querySelectorAll(
        "#feat-filter button"
    );


buttons.forEach(
    button => {

        button.classList.toggle(
            "active",
            button.dataset.category ===
                currentCategory
        );

    }
);
```

}

/*

* ============================================================
* DISPLAY FEATS
* ============================================================
  */

function displayFeats() {

```
const library =
    document.getElementById(
        "feat-library"
    );


library.innerHTML = "";


let visibleFeats;


if (currentCategory === "all") {

    visibleFeats = feats;

}

else {

    visibleFeats =
        feats.filter(
            feat =>
                feat.type ===
                currentCategory
        );

}


/*
 * No results.
 */

if (visibleFeats.length === 0) {

    library.innerHTML = `

        <div class="feat-status">

            No feats found in this category.

        </div>

    `;

    return;

}


/*
 * Create each feat card.
 */

visibleFeats.forEach(
    feat => {

        const card =
            createFeatCard(feat);


        library.appendChild(
            card
        );

    }
);
```

}

/*

* ============================================================
* CREATE FEAT CARD
* ============================================================
  */

function createFeatCard(feat) {

```
const card =
    document.createElement(
        "article"
    );


card.className =
    "feat-card";


const name =
    feat.name ||
    "Unnamed Feat";


const cost =
    feat.cost !== undefined
        ? feat.cost
        : "—";


const prerequisite =
    feat.prerequisite ||
    "None";


const type =
    feat.type ||
    "General";


const description =
    feat.description ||
    "No description provided.";


card.innerHTML = `

    <h3>
        ${escapeHTML(name)}
    </h3>


    <div class="feat-meta">

        <span class="feat-cost">

            Cost:
            ${escapeHTML(cost)}
            Feat Points

        </span>


        <span class="feat-type">

            ${escapeHTML(
                capitalize(type)
            )}

        </span>

    </div>


    <div class="feat-prerequisite">

        <strong>
            Prerequisite:
        </strong>

        ${escapeHTML(
            prerequisite
        )}

    </div>


    <div class="feat-description">

        ${escapeHTML(
            description
        )}

    </div>

`;


return card;
```

}

/*

* ============================================================
* UTILITY FUNCTIONS
* ============================================================
  */

function capitalize(text) {

```
if (!text) {

    return "";

}


return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
);
```

}

function escapeHTML(value) {

```
return String(value)

    .replace(
        /&/g,
        "&amp;"
    )

    .replace(
        /</g,
        "&lt;"
    )

    .replace(
        />/g,
        "&gt;"
    )

    .replace(
        /"/g,
        "&quot;"
    )

    .replace(
        /'/g,
        "&#039;"
    );
```

}

/*

* ============================================================
* START
* ============================================================
  */

loadFeats();
