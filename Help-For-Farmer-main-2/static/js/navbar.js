firebase.auth().onAuthStateChanged((user) => {
    console.log("Auth state changed. User:", user ? "Authenticated" : "Not authenticated");
    if (!user) {
        window.location.href = "http://127.0.0.1:5000/";
    } 
});
console.log('navbar.js loaded');
function redirectToPage(url) {
    console.log('Redirecting to:', url);
    window.history.pushState({}, '', url);
    
    const headers = new Headers({
        'Accept': 'text/html',
        'Content-Type': 'text/html'
    });
    
    fetch(url, {
        method: 'GET',
        headers: headers,
        credentials: 'same-origin'
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(html => {
        console.log('Received HTML response');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        const mainContainer = document.querySelector('.container');
        
        if (mainContainer) {
            const newContent = tempDiv.querySelector('.container');
            if (newContent) {
                console.log('Updating content');
                mainContainer.innerHTML = newContent.innerHTML;
                
                if (url.includes('/tools')) {
                    console.log('Initializing tools page');
                    if (typeof loadTools === 'function') {
                        loadTools();
                    }
                } else if (url.includes('/disease')) {
                    console.log('Initializing disease page');
                    if (typeof initDiseasePage === 'function') {
                        initDiseasePage();
                    }
                }
                
                loadNavbar();
                loadFooter();
            } else {
                console.error('New content not found in fetched HTML');
            }
        } else {
            console.error('Main container not found in current page');
        }
    })
    .catch(error => {
        console.error('Error loading page:', error);
        window.location.href = url;
    });
}

// Function to load navbar HTML
function loadNavbar() {
    console.log('Loading navbar HTML');
    fetch("/navbar")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log('Navbar HTML received');
            const navbarPlaceholder = document.getElementById("navbar-placeholder");
            if (!navbarPlaceholder) {
                console.error('Navbar placeholder not found');
                return;
            }
            navbarPlaceholder.innerHTML = data;
            console.log('Navbar HTML loaded, initializing dropdown');
            initDropdown();
            setupNavButtons();
        })
        .catch(error => console.error("Error loading the navbar:", error));
}

function setupNavButtons() {
    console.log('Setting up navigation buttons');
    const navButtons = document.querySelectorAll('.button-nav');
    console.log('Found buttons:', navButtons.length);
    
    navButtons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            console.log('Button clicked, URL:', url);
            if (url) {
                window.location.href = 'http://127.0.0.1:5000' + url;
            } else {
                console.error('No URL found for button');
            }
        });
    });
}

function loadFooter() {
    console.log('Loading footer HTML');
    fetch("/footer")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const footerPlaceholder = document.getElementById("footer-placeholder");
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
                console.log('Footer HTML loaded');
            } else {
                console.error('Footer placeholder not found');
            }
        })
        .catch(error => console.error("Error loading the footer:", error));
}

// Function to initialize the dropdown
function initDropdown() {
    console.log('Initializing dropdown');
    
    // Get the account button and dropdown elements
    const accountButton = document.getElementById('account-button');
    const dropdown = document.getElementById('account-dropdown');
    const logoutButton = document.querySelector('.logout-button');
    const userEmail = document.querySelector('.user-email');
    const userName = document.querySelector('.user-name');
    
    console.log('Account button found:', accountButton);
    console.log('Dropdown found:', dropdown);
    
    if (!accountButton || !dropdown) {
        console.error('Account button or dropdown not found');
        return;
    }
    
    console.log('Account button and dropdown found');
    
    // Get current user and update email and name
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            if (userEmail) {
                userEmail.textContent = user.email;
            }
            fetch('/get_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: user.email })
            })
            .then(response => response.json())
            .then(data => {
                if (data.name && userName) {
                    userName.textContent = data.name;
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        }
    });
    
    const newAccountButton = accountButton.cloneNode(true);
    accountButton.parentNode.replaceChild(newAccountButton, accountButton);
    
    newAccountButton.addEventListener('click', function(e) {
        console.log('Account button clicked');
        e.stopPropagation();
        dropdown.classList.toggle('show');
        console.log('Dropdown show class toggled:', dropdown.classList.contains('show'));
    });
    
    const newDocumentClickHandler = function(e) {
        if (!dropdown.contains(e.target) && !newAccountButton.contains(e.target)) {
            dropdown.classList.remove('show');
            console.log('Dropdown closed - clicked outside');
        }
    };
    
    document.removeEventListener('click', newDocumentClickHandler);
    document.addEventListener('click', newDocumentClickHandler);
    
    // Prevent dropdown from closing when clicking inside
    dropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    if (logoutButton) {
        const newLogoutButton = logoutButton.cloneNode(true);
        logoutButton.parentNode.replaceChild(newLogoutButton, logoutButton);
        
        newLogoutButton.addEventListener('click', function() {
            console.log('Logout button clicked');
            dropdown.classList.remove('show');
            firebase.auth().signOut().then(() => {
                window.location.href = '/';
            }).catch((error) => {
                console.error('Error signing out:', error);
            });
        });
    }
    console.log('Navbar dropdown initialized');
}

// Initialize dropdown when the page loads
document.addEventListener("DOMContentLoaded", () => {
    console.log('DOM content loaded');
    loadNavbar();
    loadFooter();
});

// Reinitialize dropdown after navigation
window.addEventListener('popstate', () => {
    console.log('Navigation state changed');
    if (document.getElementById('account-button') && document.getElementById('account-dropdown')) {
        initDropdown();
    }
});

// Reinitialize dropdown after content is loaded
window.addEventListener('load', () => {
    console.log('Window loaded');
    if (document.getElementById('account-button') && document.getElementById('account-dropdown')) {
        initDropdown();
    }
}); 