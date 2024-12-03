// Load navbar.html into the #navbar element
document.addEventListener('DOMContentLoaded', () => {
    const navbarContainer = document.getElementById('navbar');

    fetch('navbar.html')
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
