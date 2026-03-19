// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const btnMicDejun = document.getElementById('btn-micdejun');
    const btnPranz = document.getElementById('btn-pranz');
    const btnCina = document.getElementById('btn-cina');
    const btnGustare = document.getElementById('btn-gustare');
    
    const recipeDisplay = document.getElementById('recipe-display');
    const recipeText = document.getElementById('recipe-text');
    const recipeActions = document.getElementById('recipe-actions');
    const btnAssistant = document.getElementById('btn-assistant');
    const btnFacebook = document.getElementById('btn-facebook');
    const btnSave = document.getElementById('btn-save');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    // PWA install prompt elements
    const installApp = document.getElementById('install-app');
    const btnInstall = document.getElementById('btn-install');
    const btnCloseInstall = document.getElementById('btn-close-install');
    
    // PWA installation
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 76+ from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show the install button
        if (installApp) installApp.style.display = 'block';
    });
    
    // Handle install button click
    if (btnInstall) {
        btnInstall.addEventListener('click', () => {
            if (!deferredPrompt) return;
            
            // Show the install prompt
            deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                    if (installApp) installApp.style.display = 'none';
                }
                deferredPrompt = null;
            });
        });
    }
    
    // Handle close install button click
    if (btnCloseInstall) {
        btnCloseInstall.addEventListener('click', () => {
            if (installApp) installApp.style.display = 'none';
        });
    }
    
    // Check if app is installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true) {
        // App is installed, hide install prompt
        if (installApp) installApp.style.display = 'none';
    }
    
    // Current recipe data
    let currentRecipe = null;
    
    // Add event listeners
    if (btnMicDejun) btnMicDejun.addEventListener('click', () => fetchRecipe('Mic dejun'));
    if (btnPranz) btnPranz.addEventListener('click', () => fetchRecipe('Prânz'));
    if (btnCina) btnCina.addEventListener('click', () => fetchRecipe('Cină'));
    if (btnGustare) btnGustare.addEventListener('click', () => fetchRecipe('Snack'));
    
    // Handle Assistant button click (keeping compatibility with both button and anchor)
    if (btnAssistant) btnAssistant.addEventListener('click', function(e) {
        // Save the recipe data but don't prevent default navigation
        saveRecipeForAssistant();
    });
    if (btnFacebook) btnFacebook.addEventListener('click', shareOnFacebook);
    if (btnSave) btnSave.addEventListener('click', saveRecipeLocally);
    
    // Current meal type global variable
    let currentMealType = '';
    
    // Fetch recipe function
    function fetchRecipe(mealType) {
        // Verifică dacă s-a selectat un regim
        if (!window.selectedRegime) {
            alert('Vă rugăm să selectați mai întâi un regim alimentar (Sănătos sau Diabetic).');
            return;
        }
        
        // Store the current meal type globally
        currentMealType = mealType;
        
        // Show loading
        if (recipeText) recipeText.textContent = 'Se încarcă...';
        if (loadingSpinner) loadingSpinner.style.display = 'inline-block';
        if (recipeDisplay) {
            recipeDisplay.style.display = 'block';
            // Scroll to recipe display on mobile
            if (window.innerWidth <= 600) {
                recipeDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        if (recipeActions) recipeActions.style.display = 'none';
        
        // Add loading animation to button
        const button = document.getElementById('btn-' + mealType.toLowerCase().replace(' ', '').replace('â', 'a'));
        if (button) {
            button.disabled = true;
            button.style.opacity = '0.7';
        }
        
        // Console log for debugging
        console.log('Fetching recipe for meal type:', mealType, 'with regime:', window.selectedRegime);
        
        // Fetch from API with regime parameter
        fetch(`/api/recipe/${mealType}?regime=${window.selectedRegime}`)
            .then(response => {
                if (!response.ok) throw new Error('Network error');
                return response.json();
            })
            .then(data => {
                // Store recipe and explicitly set meal type
                currentRecipe = data;
                // Make sure we explicitly set the meal type
                currentRecipe.tip_masa = currentMealType;
                
                // Console log for debugging
                console.log('Recipe loaded with meal type:', currentRecipe.tip_masa);
                
                // Display recipe with better formatting for mobile
                if (recipeText) {
                    // Format recipe content for better readability
                    recipeText.innerHTML = '<strong>' + data.nume + '</strong><br><br>' +
                        formatRecipeContent(data.descriere);
                }
                
                // Show buttons
                if (recipeActions) {
                    recipeActions.style.display = 'flex';
                    recipeActions.classList.add('visible');
                }
                
                // Reset button state
                if (button) {
                    button.disabled = false;
                    button.style.opacity = '1';
                }
                
                // Ensure recipe display is scrolled to top
                if (recipeDisplay) {
                    recipeDisplay.scrollTop = 0;
                }
                
                // Hide loading spinner
                if (loadingSpinner) loadingSpinner.style.display = 'none';
            })
            .catch(error => {
                console.error('Error:', error);
                if (recipeText) recipeText.textContent = 'A apărut o eroare. Te rugăm să încerci din nou.';
                
                // Reset button state
                if (button) {
                    button.disabled = false;
                    button.style.opacity = '1';
                }
                
                // Hide loading spinner
                if (loadingSpinner) loadingSpinner.style.display = 'none';
            });
    }
    
    // Helper function to format recipe content for better readability
    function formatRecipeContent(text) {
        // Replace double line breaks with paragraph tags
        let formatted = text.replace(/\n\n/g, '</p><p>');
        
        // Replace single line breaks with <br>
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Wrap in paragraph tags if not already
        if (!formatted.startsWith('<p>')) {
            formatted = '<p>' + formatted;
        }
        if (!formatted.endsWith('</p>')) {
            formatted = formatted + '</p>';
        }
        
        return formatted;
    }
    
    // Helper function to save recipe data for assistant access
    function saveRecipeForAssistant() {
        // Store the current recipe for potential use in the assistant
        if (currentRecipe) {
            try {
                // Save current recipe to session storage for access in assistant
                sessionStorage.setItem('currentRecipe', JSON.stringify(currentRecipe));
                console.log('Recipe saved for assistant');
            } catch (e) {
                console.error('Error saving recipe to session storage:', e);
            }
        }
    }
    
    // Share on Facebook function
    function shareOnFacebook() {
        if (!currentRecipe) return;
        
        try {
            // Prepare a more formatted, social media friendly version of the recipe
            // Keep it shorter for better sharing
            const tipMasa = currentRecipe.tip_masa || currentMealType || '';
            const recipeTitle = currentRecipe.nume || 'Rețetă pentru diabetici';
            
            // Format description by removing extra whitespace and limiting length
            let description = currentRecipe.descriere || '';
            description = description.trim().replace(/\s+/g, ' ').substring(0, 250);
            if (description.length === 250) description += '...';
            
            // Use copied text from clipboard if available, otherwise create share text
            let shareText;
            const lastCopiedRecipe = sessionStorage.getItem('lastCopiedRecipe');
            
            if (lastCopiedRecipe) {
                // User previously copied text, use that for sharing
                shareText = lastCopiedRecipe;
                console.log('Using previously copied recipe for Facebook sharing');
            } else {
                // Create a nicely formatted share text
                shareText = `Rețetă pentru diabetici - ${tipMasa}\n\n${recipeTitle}\n\n${description}\n\nGenerat cu HranaMea - www.hranamea.ro`;
            }
            
            // First try the modern Web Share API which works better on mobile
            if (navigator.share) {
                navigator.share({
                    title: `Rețetă pentru diabetici - ${recipeTitle}`,
                    text: shareText,
                    url: window.location.href
                })
                .then(() => console.log('Recipe shared successfully'))
                .catch(error => {
                    console.error('Error sharing:', error);
                    // Fall back to Facebook share dialog
                    openFacebookShareDialog(shareText);
                });
            } else {
                // Use traditional Facebook share dialog
                openFacebookShareDialog(shareText);
            }
        } catch (e) {
            console.error('Error in Facebook share:', e);
            alert('Eroare la partajare. Încercați din nou.');
        }
    }
    
    // Helper function to open Facebook share dialog
    function openFacebookShareDialog(shareText) {
        // Build the Facebook share URL with proper parameters
        const shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' +
                       encodeURIComponent(window.location.href) +
                       '&quote=' + encodeURIComponent(shareText) +
                       '&hashtag=' + encodeURIComponent('#Retete_Diabetici');
        
        // Open a popup window for Facebook sharing
        const width = 600, height = 400;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        
        // Copy to clipboard as a fallback (in case Facebook doesn't capture the text)
        try {
            navigator.clipboard.writeText(shareText).then(() => {
                console.log('Recipe text copied to clipboard for sharing');
            });
        } catch (clipboardErr) {
            console.warn('Could not copy to clipboard:', clipboardErr);
        }
        
        // Show alert to user that content is copied to clipboard too
        alert('Textul rețetei a fost copiat și în clipboard pentru partajare mai ușoară!');
        
        // Open the Facebook share dialog
        window.open(
            shareUrl,
            'sharer',
            `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
        );
    }
    
    // Save recipe locally function
    function saveRecipeLocally() {
        if (!currentRecipe) return;
        
        try {
            // Still save to localStorage for history/tracking
            const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
            const isDuplicate = savedRecipes.some(recipe => recipe.id === currentRecipe.id);
            
            if (!isDuplicate) {
                savedRecipes.push(currentRecipe);
                localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
            }
            
            // Create actual downloadable file
            const recipeName = currentRecipe.nume || 'Reteta Diabetici';
            // Use Romanian-friendly filename that preserves diacritics
            const safeFileName = recipeName.replace(/[\\/:*?"<>|]/g, '_');
            
            // Format recipe content for the file
            const recipeContent = formatRecipeForDownload(currentRecipe);
            
            // Try to use Web Share API for mobile devices if available
            if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                navigator.share({
                    title: recipeName,
                    text: recipeContent,
                    // We don't have a URL for individual recipes, so using the main site
                    url: window.location.href
                })
                .then(() => console.log('Recipe shared successfully'))
                .catch(error => {
                    console.error('Error sharing:', error);
                    // Fall back to download if sharing fails
                    downloadRecipeAsFile(recipeContent, safeFileName);
                });
            } else {
                // Desktop devices - use the simple direct download method
                // This improves compatibility especially on Windows
                directDownloadAsFile(recipeContent, safeFileName);
            }
        } catch (e) {
            console.error('Error saving recipe:', e);
            alert('Eroare la salvarea rețetei.');
        }
    }
    
    // Helper function to format recipe for download
    function formatRecipeForDownload(recipe) {
        const dateStr = new Date().toLocaleDateString('ro-RO');
        
        // Double-check that we have a meal type from either the recipe or the global variable
        const tipMasa = recipe.tip_masa || currentMealType || 'Nedefinit';
        
        // Log for debugging
        console.log('Formatting recipe with meal type:', tipMasa);
        
        return `REȚETĂ PENTRU DIABETICI - ${recipe.nume}
-----------------------------------
Generată pe: ${dateStr}
Tip masă: ${tipMasa}

${recipe.descriere}

-----------------------------------
Generat cu: Generator de Rețete pentru Diabetici
www.hranamea.com`;
    }
    
    // A new, simpler download function specifically for Windows and other desktop systems
    function directDownloadAsFile(content, fileName) {
        console.log('Starting download using direct method');
        
        try {
            // Add a BOM (Byte Order Mark) to the content to ensure UTF-8 encoding is recognized in Windows
            const BOM = '\uFEFF';
            const contentWithBOM = BOM + content;
            
            // Create blob with explicit UTF-8 encoding for Romanian diacritics
            const blob = new Blob([contentWithBOM], { type: 'text/plain;charset=UTF-8' });
            
            // For IE
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveBlob(blob, fileName + '.txt');
                console.log('Downloaded using msSaveBlob');
                alert('Rețeta a fost descărcată!');
                return;
            }
            
            // Create a download link
            const downloadLink = document.createElement('a');
            downloadLink.download = fileName + '.txt';
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.onclick = function(e) {
                // Release object URL after download
                setTimeout(function() {
                    window.URL.revokeObjectURL(downloadLink.href);
                }, 1500);
            };
            
            // Append to the body so it works in Firefox
            document.body.appendChild(downloadLink);
            
            // Trigger the download immediately - this is key for Windows
            downloadLink.click();
            
            // Remove the link
            document.body.removeChild(downloadLink);
            
            console.log('Downloaded using click method');
            alert('Rețeta a fost descărcată!');
        } catch (e) {
            console.error('Download error:', e);
            
            // Last resort: offer text copying to clipboard
            try {
                const textarea = document.createElement('textarea');
                textarea.value = content;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                alert('Nu s-a putut descărca fișierul. Rețeta a fost copiată în clipboard!');
            } catch (clipErr) {
                console.error('Clipboard error:', clipErr);
                alert('Eroare la descărcarea rețetei. Vă rugăm salvați manual textul de mai jos:\n\n' + content.substring(0, 150) + '...');
            }
        }
    }
    
    // Keep the original function for mobile devices
    function downloadRecipeAsFile(content, fileName) {
        try {
            // Add BOM for UTF-8 recognition
            const BOM = '\uFEFF';
            const contentWithBOM = BOM + content;
            
            // Create blob with explicit UTF-8 encoding
            const blob = new Blob([contentWithBOM], { type: 'text/plain;charset=UTF-8' });
            
            // For IE
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveBlob(blob, fileName + '.txt');
                alert('Rețeta a fost descărcată!');
                return;
            }
            
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.href = url;
            link.download = fileName + '.txt';
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                alert('Rețeta a fost descărcată!');
            }, 100);
        } catch (e) {
            console.error('Download error:', e);
            directDownloadAsFile(content, fileName); // Try the alternative method
        }
    }
    
    // Prevent overscroll/bounce on iOS
    document.body.addEventListener('touchmove', function(e) {
        if (e.target === document.body) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Add viewport height fix for mobile browsers (iOS Safari)
    function setVhProperty() {
        // Set the value of the --vh custom property to the correct viewport height
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Set the --vh value initially
    setVhProperty();
    
    // Update the --vh value when the window resizes
    window.addEventListener('resize', () => {
        setVhProperty();
    });
    
    // Handle orientation change on mobile
    window.addEventListener('orientationchange', () => {
        // Small delay to allow browser UI to settle
        setTimeout(() => {
            setVhProperty();
            
            // If recipe is visible, make sure it's in view
            if (recipeDisplay && recipeDisplay.style.display === 'block') {
                recipeDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    });
});