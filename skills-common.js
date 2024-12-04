// Load skills-navbar.html into the #navbar element
	document.addEventListener('DOMContentLoaded', () => {
    const navbarContainer = document.getElementById('navbar');

    fetch('skills-navbar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load navbar: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            navbarContainer.innerHTML = html;

            // Highlight the active link
            const currentPage = location.pathname.split('/').pop();
            const navLinks = navbarContainer.querySelectorAll('.nav-links a');
            navLinks.forEach(link => {
                if (link.href.includes(currentPage)) {
                    link.classList.add('active');
                }
            });
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
            navbarContainer.innerHTML = '<p class="error">Failed to load navigation bar.</p>';
        });
	});

// Load Slides	
	document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const stepLinks = document.querySelectorAll('.slideshow-steps a');

    let currentSlide = 0;

    // Function to show a specific slide
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
        currentSlide = index;
    }

    // Show the first slide initially
    showSlide(currentSlide);

    // Handle "Next" button click
    nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length; // Loop to the beginning
        showSlide(currentSlide);
    });

    // Handle "Previous" button click
    prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length; // Loop to the end
        showSlide(currentSlide);
    });

    // Handle step link clicks
    stepLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            const slideIndex = parseInt(link.getAttribute('data-slide'), 10);
            showSlide(slideIndex);
        });
    });
});


// Load equipment from equipment.json and display it
	document.addEventListener('DOMContentLoaded', () => {
    const equipmentList = document.getElementById('equipmentList');

    fetch('equipment.json')
        .then(response => response.json())
        .then(data => {
            data.equipment.forEach(item => {
                // Create container for each equipment item
                const equipmentContainer = document.createElement('div');
                equipmentContainer.classList.add('equipment-item');

                // Add equipment details
                equipmentContainer.innerHTML = `
                    <h3>${item.name}</h3>
                    <p><strong>Tech Level:</strong> ${item.techLevel}</p>
                    <p><strong>Location Worn:</strong> ${item.locationWorn}</p>
                    <p><strong>Purpose:</strong> ${item.purpose}</p>
                    <p><strong>Bulk:</strong> ${item.bulk === 1 ? "1 Hand" : "2 Hands"}</p>
                    <p><strong>Description:</strong> ${item.description}</p>
                `;

                // Append the equipment item to the list
                equipmentList.appendChild(equipmentContainer);
            });
        })
        .catch(error => {
            console.error('Error loading equipment.json:', error);
            equipmentList.innerHTML = '<p class="error">Failed to load equipment. Please try again later.</p>';
        });
	});
	
// Load skills from skills.json and display them
	document.addEventListener('DOMContentLoaded', () => {
    const skillsList = document.getElementById('skillsList');

    fetch('skills2.json')
        .then(response => response.json())
        .then(data => {
            data.skills.forEach(item => {
                // Create container for each skills
                const skillsContainer = document.createElement('div');
                skillsContainer.classList.add('skill-item');

                // Add skills details
                skillsContainer.innerHTML = `
                    <h3>${item.name}</h3>
                    <p><strong>Primary Attribute:</strong> ${item.attribute}</p>
                    <p><strong>Type:</strong> ${item.type}</p>
                    <p><strong>Description:</strong> ${item.description}</p>
                `;

                // Append the skills item to the list
                skillsList.appendChild(skillsContainer);
            });
        })
        .catch(error => {
            console.error('Error loading skills.json:', error);
            skillsList.innerHTML = '<p class="error">Failed to load skills. Please try again later.</p>';
        });
	});

// Load feats from feats.json and display them
	document.addEventListener('DOMContentLoaded', () => {
    const featsList = document.getElementById('featsList');

    fetch('feats.json')
        .then(response => response.json())
        .then(data => {
            data.feats.forEach(item => {
                // Create container for each feats
                const skillsContainer = document.createElement('div');
                skillsContainer.classList.add('skill-item');

                // Add feats details
                skillsContainer.innerHTML = `
                    <h3>${item.name}</h3>
                    <p><strong>SP Cost:</strong> ${item.cost}</p>
                    <p><strong>Prerequisite:</strong> ${item.prerequisite}</p>
                    <p><strong>Description:</strong> ${item.description}</p>
                `;

                // Append the feats item to the list
                featsList.appendChild(skillsContainer);
            });
        })
        .catch(error => {
            console.error('Error loading feats.json:', error);
            featsList.innerHTML = '<p class="error">Failed to load feats. Please try again later.</p>';
        });
	});