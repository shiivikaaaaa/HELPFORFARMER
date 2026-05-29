document.getElementById('predict-button').addEventListener('click', () => {
  const selectedSymptoms = Array.from(document.querySelectorAll('input[name="symptom"]:checked'))
    .map(input => input.value);
  alert(`Selected Symptoms: ${selectedSymptoms.join(', ')}`);
});
  
document.getElementById('search-button').addEventListener('click', () => {
  const searchTerm = document.getElementById('disease-search').value;
  alert(`Searching for: ${searchTerm}`);
});
  
function redirectToPage(url) {
    console.log("redirectToPage called with URL:", url);
    
    const element = event.currentTarget;
    console.log("Clicked element:", element);
    
    if (element.classList.contains('card')) {
        console.log("Adding card-clicked class");
        element.classList.add('card-clicked');
    } else if (element.classList.contains('button-nav')) {
        console.log("Adding button-clicked class");
        element.classList.add('button-clicked');
    }
    
    setTimeout(() => {
        console.log("Redirecting to:", url);
        window.location.href = url;
    }, 200);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event fired");
    
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
