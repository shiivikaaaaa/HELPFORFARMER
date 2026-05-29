document.addEventListener('DOMContentLoaded', function() {
    const predictButton = document.getElementById('predict-button');
    const searchButton = document.getElementById('search-button');
    
    if (predictButton) {
        predictButton.addEventListener('click', () => {
            const selectedSymptoms = Array.from(document.querySelectorAll('input[name="symptom"]:checked'))
                .map(input => input.value);
            alert(`Selected Symptoms: ${selectedSymptoms.join(', ')}`);
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const searchTerm = document.getElementById('disease-search').value;
            alert(`Searching for: ${searchTerm}`);
        });
    }

    function redirectToPage(url) {
        const element = event.currentTarget;
        if (element.classList.contains('card')) {
            element.classList.add('card-clicked');
        } else if (element.classList.contains('button-nav')) {
            element.classList.add('button-clicked');
        }
        setTimeout(() => {
            window.location.href = url;
        }, 200);
    }

    const cards = document.querySelectorAll('.card');
    console.log("Found cards:", cards.length);
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('card-hover');
        });
        card.addEventListener('mouseleave', function() {
            this.classList.remove('card-hover');
        });
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const url = this.getAttribute('onclick').match(/'([^']+)'/)[1];
                redirectToPage(url);
            }
        });
    });

    const navButtons = document.querySelectorAll('.button-nav');
    console.log("Found navbar buttons:", navButtons.length);
    
    navButtons.forEach(button => {
        button.setAttribute('tabindex', '0');
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const url = this.getAttribute('onclick').match(/'([^']+)'/)[1];
                redirectToPage(url);
            }
        });
    });
});

window.onload = () => {
    console.log("Window loaded");
};
