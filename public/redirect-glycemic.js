document.addEventListener('DOMContentLoaded', function() {
    // Funcție pentru a face redirect direct la pagina de glicemie
    window.redirectToGlycemicTracker = function() {
        window.location.href = 'glycemic-tracker.html';
    };

    // Fixează butonul de control glicemic din popup-ul de scopuri - Optimizat pentru mobil
    function fixGlycemicButton() {
        // Verifică periodic dacă butonul a fost adăugat în DOM
        const checkInterval = setInterval(function() {
            const glycemicBtn = document.querySelector('.goal-option[data-goal="control-glycemic"]');
            
            if (glycemicBtn) {
                console.log('Butonul de control glicemic găsit, adaug event listeners');
                
                // Adaugă event listeners pentru desktop și mobile
                glycemicBtn.addEventListener('click', handleGlycemicRedirect);
                glycemicBtn.addEventListener('touchend', handleGlycemicRedirect);
                
                // Stilizează butonul pentru a arăta că este activ și pentru a fi mai ușor de apăsat pe mobil
                glycemicBtn.style.backgroundColor = '#2a6b34';
                glycemicBtn.style.position = 'relative';
                glycemicBtn.style.padding = '12px';  // Padding mai mare pentru targheturi touch mai mari
                glycemicBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                glycemicBtn.style.transition = 'transform 0.2s, background-color 0.2s';
                
                // Adaugă text de ajutor mai vizibil pentru ecrane mici
                const helpText = document.createElement('div');
                helpText.textContent = 'Click pentru monitorizare';
                helpText.style.fontSize = '12px';
                helpText.style.marginTop = '5px';
                helpText.style.fontWeight = 'bold';
                helpText.style.color = '#ffffff';
                glycemicBtn.appendChild(helpText);
                
                // Adaugă stare activă pentru feedback tactil pe mobile
                glycemicBtn.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.97)';
                    this.style.backgroundColor = '#245f2d';
                });
                
                glycemicBtn.addEventListener('touchend', function() {
                    this.style.transform = 'scale(1)';
                    this.style.backgroundColor = '#2a6b34';
                });
                
                // Ajustează dimensiunea bazată pe dimensiunea ecranului
                if (window.innerWidth < 500) {
                    glycemicBtn.style.minHeight = '60px';
                    glycemicBtn.style.fontSize = '15px';
                }
                
                // Oprim verificarea după ce am găsit și modificat butonul
                clearInterval(checkInterval);
            }
        }, 1000); // Verifică la fiecare secundă
    }
    
    // Funcție separată pentru a gestiona redirecționarea
    function handleGlycemicRedirect(e) {
        console.log('Buton de control glicemic apăsat, redirecționez...');
        e.preventDefault();
        e.stopPropagation();
        
        // Feedback vizual pentru utilizator că butonul a fost apăsat
        const btn = e.currentTarget;
        btn.style.backgroundColor = '#245f2d';
        
        // Redirecționează către pagina de monitorizare
        setTimeout(function() {
            window.location.href = 'glycemic-tracker.html';
        }, 100);
        
        return false;
    }
    
    // Pornește funcția de fixare și adaugă detector pentru redimensionarea ferestrei
    fixGlycemicButton();
    
    // Ajustează pentru orientarea mobilului
    window.addEventListener('resize', function() {
        const glycemicBtn = document.querySelector('.goal-option[data-goal="control-glycemic"]');
        if (glycemicBtn) {
            // Ajustează bazat pe orientare și dimensiune
            if (window.innerWidth < 500) {
                glycemicBtn.style.minHeight = '60px';
                glycemicBtn.style.fontSize = '15px';
            } else {
                glycemicBtn.style.minHeight = '50px';
                glycemicBtn.style.fontSize = '14px';
            }
        }
    });
});