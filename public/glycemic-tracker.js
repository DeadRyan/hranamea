document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Sections
    const inputMethodSection = document.getElementById('input-method-section');
    const manualInputSection = document.getElementById('manual-input-section');
    const cameraInputSection = document.getElementById('camera-input-section');
    const mealTimingSection = document.getElementById('meal-timing-section');
    const mealTypeSection = document.getElementById('meal-type-section');
    const confirmationSection = document.getElementById('confirmation-section');
    
    // DOM Elements - Buttons
    const methodOptions = document.querySelectorAll('#input-method-section .option-card');
    const backToMethodBtn = document.getElementById('back-to-method');
    const backToMethodFromCameraBtn = document.getElementById('back-to-method-from-camera');
    const manualContinueBtn = document.getElementById('manual-continue');
    const openCameraBtn = document.getElementById('open-camera');
    const cameraContinueBtn = document.getElementById('camera-continue');
    const timingOptions = document.querySelectorAll('#meal-timing-section .option-card');
    const backFromTimingBtn = document.getElementById('back-from-timing');
    const timingContinueBtn = document.getElementById('timing-continue');
    const mealOptions = document.querySelectorAll('#meal-type-section .option-card');
    const backFromMealBtn = document.getElementById('back-from-meal');
    const mealContinueBtn = document.getElementById('meal-continue');
    const backFromConfirmBtn = document.getElementById('back-from-confirm');
    const saveReadingBtn = document.getElementById('save-reading');
    
    // Camera elements
    const cameraOverlay = document.getElementById('camera-overlay');
    const cameraVideo = document.getElementById('camera-video');
    const cameraCanvas = document.getElementById('camera-canvas');
    const capturePhotoBtn = document.getElementById('capture-photo');
    const closeCameraBtn = document.getElementById('close-camera');
    
    // Confirmation elements
    const confirmValue = document.getElementById('confirm-value');
    const confirmTiming = document.getElementById('confirm-timing');
    const confirmMeal = document.getElementById('confirm-meal');
    const confirmDatetime = document.getElementById('confirm-datetime');
    
    // Readings elements
    const showReadingsBtn = document.getElementById('show-readings-btn');
    const readingsOverlay = document.getElementById('readings-overlay');
    const readingsList = document.getElementById('readings-list');
    const saveReadingsLocalBtn = document.getElementById('save-readings-local');
    const closeReadingsBtn = document.getElementById('close-readings');
    
    // State variables
        let currentMethod = null;
        let currentValue = null;
        let currentImage = null;
        let currentProcessedImage = null;
        let currentTiming = null;
        let currentMeal = null;
        let cameraStream = null;
        
        // Make key functions available to the window scope
        window.hideAllSections = hideAllSections;
        window.goToMealTiming = function() { goToMealTiming(); };
    
    // Database key
    const DB_KEY = 'glycemic_readings';
    
    // Add API URL variable for easy adjustments
    const API_BASE_URL = location.hostname.includes('hranamea.ro') ?
                        'https://hranamea.ro/api' :
                        '/api';
    
    // Initialize the UI
    initializeUI();
    
    // Check if user ID is in URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userIdParam = urlParams.get('userId');
    if (userIdParam) {
        console.log('Found userId in URL params:', userIdParam);
        localStorage.setItem('userId', userIdParam);
    }
    
    // Check for unsynchronized readings and try to sync them
    attemptSyncQueue();
    
    // Fix viewport height for mobile browsers
    fixViewportHeight();
    // Re-apply on orientation change and resize
    window.addEventListener('resize', fixViewportHeight);
    window.addEventListener('orientationchange', fixViewportHeight);
    
    // Log initialization for debugging
    console.log('Glycemic tracker initialized with API base:', API_BASE_URL);
    
    // Initialize event listeners
    function initializeUI() {
        // Step 1: Input Method
        methodOptions.forEach(option => {
            option.addEventListener('click', function() {
                currentMethod = this.dataset.method;
                methodOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                if (currentMethod === 'manual') {
                    goToManualInput();
                } else if (currentMethod === 'camera') {
                    goToCameraInput();
                }
            });
        });
        
        // Create value validation section if it doesn't exist yet
        if (!document.getElementById('value-validation-section')) {
            window.GlucometerProcessing.createValueValidationSection();
        }
        
        // Back buttons
        backToMethodBtn.addEventListener('click', goToInputMethod);
        backToMethodFromCameraBtn.addEventListener('click', goToInputMethod);
        backFromTimingBtn.addEventListener('click', goBack);
        backFromMealBtn.addEventListener('click', goToMealTiming);
        backFromConfirmBtn.addEventListener('click', goToMealType);
        
        // Continue buttons
        manualContinueBtn.addEventListener('click', validateManualInput);
        openCameraBtn.addEventListener('click', openCamera);
        cameraContinueBtn.addEventListener('click', validateCameraInput);
        timingContinueBtn.addEventListener('click', validateTimingSelection);
        mealContinueBtn.addEventListener('click', validateMealSelection);
        saveReadingBtn.addEventListener('click', saveReading);
        
        // Readings-related event listeners - ensure proper connections and add debugging
        if (showReadingsBtn) {
            console.log('Setting up showReadingsBtn click listener');
            showReadingsBtn.addEventListener('click', function() {
                console.log('Show readings button clicked');
                showReadings();
            });
        } else {
            console.error('showReadingsBtn element not found!');
        }
        
        if (closeReadingsBtn) {
            closeReadingsBtn.addEventListener('click', closeReadings);
        } else {
            console.error('closeReadingsBtn element not found!');
        }
        
        if (saveReadingsLocalBtn) {
            saveReadingsLocalBtn.addEventListener('click', saveReadingsToLocal);
        } else {
            console.error('saveReadingsLocalBtn element not found!');
        }
        
        // Step 3: Meal Timing
        timingOptions.forEach(option => {
            option.addEventListener('click', function() {
                currentTiming = this.dataset.timing;
                timingOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
        
        // Step 4: Meal Type
        mealOptions.forEach(option => {
            option.addEventListener('click', function() {
                currentMeal = this.dataset.meal;
                mealOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
        
        // Camera actions
        capturePhotoBtn.addEventListener('click', capturePhoto);
        closeCameraBtn.addEventListener('click', closeCamera);
        
        // Improve mobile touch experience
        enhanceMobileTouchExperience();
    }
    
    // Function to fix viewport height issues on mobile
    function fixViewportHeight() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Adjust container height based on screen orientation
        const isLandscape = window.innerWidth > window.innerHeight;
        const trackerContainer = document.querySelector('.tracker-container');
        
        if (isLandscape && window.innerWidth < 900) {
            // In landscape on mobile, make container shorter to fit better
            trackerContainer.style.maxHeight = 'calc(var(--vh, 1vh) * 75)';
        } else {
            // In portrait or desktop, use default height
            trackerContainer.style.maxHeight = 'calc(var(--vh, 1vh) * 85)';
        }
    }
    
    // Function to enhance mobile touch experience
    function enhanceMobileTouchExperience() {
        // Add active state for buttons on mobile
        const allButtons = document.querySelectorAll('button, .button, .option-card');
        
        allButtons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
                this.style.opacity = '0.9';
            });
            
            button.addEventListener('touchend', function() {
                this.style.transform = '';
                this.style.opacity = '';
            });
            
            // Cancel active state if touch moves away
            button.addEventListener('touchmove', function() {
                this.style.transform = '';
                this.style.opacity = '';
            });
            
            // Cancel active state if touch is cancelled
            button.addEventListener('touchcancel', function() {
                this.style.transform = '';
                this.style.opacity = '';
            });
        });
    }
    
    // Navigation functions
    function goToInputMethod() {
        hideAllSections();
        inputMethodSection.classList.add('active');
        resetSelections();
    }
    
    function goToManualInput() {
        hideAllSections();
        manualInputSection.classList.add('active');
    }
    
    function goToCameraInput() {
        hideAllSections();
        cameraInputSection.classList.add('active');
    }
    
    function goToMealTiming() {
        hideAllSections();
        mealTimingSection.classList.add('active');
    }
    
    function goToMealType() {
        hideAllSections();
        mealTypeSection.classList.add('active');
    }
    
    function goToConfirmation() {
        hideAllSections();
        setupConfirmationDetails();
        confirmationSection.classList.add('active');
    }
    
    function goBack() {
        if (currentMethod === 'manual') {
            goToManualInput();
        } else {
            goToCameraInput();
        }
    }
    
    function hideAllSections() {
            inputMethodSection.classList.remove('active');
            manualInputSection.classList.remove('active');
            cameraInputSection.classList.remove('active');
            mealTimingSection.classList.remove('active');
            mealTypeSection.classList.remove('active');
            confirmationSection.classList.remove('active');
            
            // Hide value validation section if it exists
            const valueValidationSection = document.getElementById('value-validation-section');
            if (valueValidationSection) {
                valueValidationSection.classList.remove('active');
                valueValidationSection.style.display = 'none';
            }
            
            console.log('All sections hidden');
        }
    
    function resetSelections() {
        methodOptions.forEach(opt => opt.classList.remove('selected'));
        timingOptions.forEach(opt => opt.classList.remove('selected'));
        mealOptions.forEach(opt => opt.classList.remove('selected'));
        
        currentMethod = null;
        currentValue = null;
        window.currentValue = null; // Also clear window-scoped value
        currentImage = null;
        currentProcessedImage = null;
        currentTiming = null;
        currentMeal = null;
        
        const valueInput = document.getElementById('glycemic-value');
        if (valueInput) valueInput.value = '';
        
        const detectedValueInput = document.getElementById('detected-value');
        if (detectedValueInput) detectedValueInput.value = '';
        
        cameraContinueBtn.disabled = true;
    }
    
    // Validation functions
    function validateManualInput() {
        const valueInput = document.getElementById('glycemic-value');
        const value = valueInput.value.trim();
        
        if (!value) {
            alert('Te rugăm să introduci o valoare glicemică.');
            return;
        }
        
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 20 || numValue > 600) {
            alert('Te rugăm să introduci o valoare între 20 și 600 mg/dl.');
            return;
        }
        
        currentValue = numValue;
        goToMealTiming();
    }
    
    function validateCameraInput() {
            if (!currentImage) {
                alert('Te rugăm să captezi o imagine mai întâi.');
                return;
            }
            
            console.log('Starting image processing');
            
            // Make sure hideAllSections is accessible to the window scope
            window.hideAllSections = hideAllSections;
            
            // Process the image and try to detect the value
            window.GlucometerProcessing.processImageAndExtractValue(currentImage, (detectedValue, processedImage) => {
                console.log('Image processing complete, detected value:', detectedValue);
                
                // Store the processed image for later use in both places for redundancy
                currentProcessedImage = processedImage;
                window.currentProcessedImage = processedImage;
                
                try {
                    // Instead of going directly to the next step, go to the value validation screen
                    window.GlucometerProcessing.goToValueValidation(detectedValue);
                    console.log('Validation screen should now be visible');
                } catch (error) {
                    console.error('Error showing validation screen:', error);
                    alert('A apărut o eroare la afișarea rezultatelor. Te rugăm să încerci din nou.');
                    goToCameraInput(); // Return to camera input screen on error
                }
            });
        }
    
    function validateTimingSelection() {
        if (!currentTiming) {
            alert('Te rugăm să selectezi când ai efectuat testul.');
            return;
        }
        
        goToMealType();
    }
    
    function validateMealSelection() {
        if (!currentMeal) {
            alert('Te rugăm să selectezi pentru ce masă ai efectuat testul.');
            return;
        }
        
        goToConfirmation();
    }
    
    // Enhanced camera functions for mobile
    function openCamera() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Camera nu este disponibilă pe acest dispozitiv sau browser.');
            return;
        }
        
        // Lock screen orientation to portrait if supported
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('portrait').catch(err => {
                console.log('Orientation lock failed:', err);
            });
        }
        
        // Use better constraints for mobile
        const constraints = {
            video: {
                facingMode: 'environment', // Use back camera
                width: { ideal: window.innerWidth },
                height: { ideal: window.innerHeight },
                aspectRatio: { ideal: 4/3 }
            }
        };
        
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                cameraStream = stream;
                cameraVideo.srcObject = stream;
                cameraOverlay.style.display = 'flex';
                
                // Prevent body scrolling while camera is open
                document.body.style.overflow = 'hidden';
                
                // Add glucometer positioning overlay
                window.GlucometerProcessing.addGlucometerOverlay();
                
                // Focus camera better on mobile
                setTimeout(() => {
                    // Try to focus camera if supported
                    const track = stream.getVideoTracks()[0];
                    if (track.getCapabilities && track.getCapabilities().focusMode) {
                        track.applyConstraints({ advanced: [{ focusMode: "continuous" }] })
                            .catch(e => console.log('Focus mode not supported:', e));
                    }
                }, 500);
            })
            .catch(function(error) {
                console.error('Error accessing camera:', error);
                alert('Eroare la accesarea camerei. Te rugăm să verifici permisiunile.');
            });
    }
    
    function capturePhoto() {
        const context = cameraCanvas.getContext('2d');
        
        // Set canvas dimensions to match video
        cameraCanvas.width = cameraVideo.videoWidth;
        cameraCanvas.height = cameraVideo.videoHeight;
        
        // Draw video frame to canvas
        context.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);
        
        // Get image data
        currentImage = cameraCanvas.toDataURL('image/jpeg');
        
        // Close camera
        closeCamera();
        
        // Enable continue button
        cameraContinueBtn.disabled = false;
        
        // Show preview
        const preview = document.createElement('img');
        preview.src = currentImage;
        preview.style.maxWidth = '100%';
        preview.style.maxHeight = '200px';
        preview.style.display = 'block';
        preview.style.margin = '10px auto';
        preview.style.borderRadius = '8px';
        preview.style.border = '1px solid #444';
        
        // Remove any existing preview
        const existingPreview = cameraInputSection.querySelector('img');
        if (existingPreview) {
            existingPreview.remove();
        }
        
        // Add new preview before the button group
        const buttonGroup = cameraInputSection.querySelector('.button-group');
        cameraInputSection.insertBefore(preview, buttonGroup);
        
        // Add a helpful text explaining what happens next
        const helpText = document.createElement('p');
        helpText.textContent = 'Apasă pe "Continuă" pentru procesarea imaginii și extragerea valorii.';
        helpText.style.fontSize = '14px';
        helpText.style.color = '#aaa';
        helpText.style.margin = '10px 0';
        helpText.style.textAlign = 'center';
        
        // Remove any existing help text
        const existingHelpText = cameraInputSection.querySelector('p:not(:first-child)');
        if (existingHelpText) {
            existingHelpText.remove();
        }
        
        // Add help text before the button group
        cameraInputSection.insertBefore(helpText, buttonGroup);
    }
    
    function closeCamera() {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
        }
        
        cameraOverlay.style.display = 'none';
        
        // Restore body scrolling
        document.body.style.overflow = '';
        
        // Unlock screen orientation if it was locked
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
        
        // Remove the glucometer overlay
        const existingOverlay = document.getElementById('glucometer-guide');
        if (existingOverlay) {
            existingOverlay.remove();
        }
    }
    
    // Confirmation and saving functions
    function setupConfirmationDetails() {
        // Ensure we have the correct currentValue from any possible source
        // This consolidates all possible ways the value might be stored
        if (currentValue === null || isNaN(currentValue)) {
            if (window.currentValue !== undefined && !isNaN(window.currentValue)) {
                console.log('Using window.currentValue:', window.currentValue);
                currentValue = window.currentValue;
            } else {
                // Default to a placeholder value if all else fails
                console.log('No valid currentValue found, using placeholder');
                currentValue = 120;
            }
        }
        
        console.log('Setting up confirmation with value:', currentValue);
        confirmValue.textContent = `${currentValue} mg/dl`;
        
        const timingText = currentTiming === 'before' ? 'Înainte de masă' : 'După masă';
        confirmTiming.textContent = timingText;
        
        let mealText = 'Nedefinit';
        switch(currentMeal) {
            case 'breakfast': mealText = 'Mic Dejun'; break;
            case 'lunch': mealText = 'Prânz'; break;
            case 'dinner': mealText = 'Cină'; break;
            case 'snack': mealText = 'Gustare'; break;
        }
        confirmMeal.textContent = mealText;
        
        const now = new Date();
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        confirmDatetime.textContent = now.toLocaleDateString('ro-RO', dateOptions);
    }
    
    // Funcția îmbunătățită de salvare a datelor glicemice
    function saveReading() {
        const reading = {
            value: currentValue,
            timing: currentTiming,
            meal: currentMeal,
            datetime: new Date().toISOString(),
            image: currentMethod === 'camera' ? currentProcessedImage : currentImage
        };
        
        // Arată indicatorul de salvare
        saveReadingBtn.disabled = true;
        saveReadingBtn.textContent = 'Se salvează...';
        
        // Încearcă mai întâi să salvezi pe server pentru persistență maximă
        fetch(`${API_BASE_URL}/glycemic/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reading: reading
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log('Valoarea glicemică salvată cu succes în baza de date', data);
                
                // Salvează și în localStorage ca backup
                saveToLocalStorage(reading);
                
                // Afișează mesaj de succes elegant
                showSuccessMessage('Citirea glicemiei a fost salvată cu succes!');
                
                // Resetează și întoarce-te la începutul procesului după scurt delay
                // pentru a permite utilizatorului să vadă mesajul de succes
                setTimeout(() => {
                    goToInputMethod();
                }, 2000);
            } else {
                throw new Error('Eroare server: ' + (data.error || 'Eroare necunoscută'));
            }
        })
        .catch(error => {
            console.error('Eroare la salvarea în baza de date:', error);
            
            // În caz de eroare, salvează local
            saveToLocalStorage(reading);
            
            // Adaugă la coada de sincronizare pentru mai târziu
            addToSyncQueue(reading);
            
            // Afișează mesaj de salvare locală
            showWarningMessage('Valoarea a fost salvată local, dar nu s-a putut sincroniza cu baza de date. Se va sincroniza automat când conexiunea va fi restabilită.');
            
            // Resetează și întoarce-te la începutul procesului după delay
            setTimeout(() => {
                goToInputMethod();
            }, 3000); // Delay mai lung pentru a permite citirea mesajului
        })
        .finally(() => {
            // Resetează starea butonului
            saveReadingBtn.disabled = false;
            saveReadingBtn.textContent = 'Salvează';
        });
    }
    
    // Funcție ajutătoare pentru salvarea în localStorage
    function saveToLocalStorage(reading) {
        // Obține ID-ul utilizatorului
        const userId = localStorage.getItem('userId') || 'anonymous';
        
        // Obține înregistrările existente
        let readings = JSON.parse(localStorage.getItem(`${DB_KEY}_${userId}`) || '[]');
        
        // Adaugă noua înregistrare
        readings.push(reading);
        
        // Limitează numărul de înregistrări pentru a preveni umplerea localStorage
        if (readings.length > 100) {
            readings = readings.slice(-100);
        }
        
        // Salvează înapoi în localStorage
        localStorage.setItem(`${DB_KEY}_${userId}`, JSON.stringify(readings));
    }
    
    // Adaugă la coada de sincronizare pentru sincronizare ulterioară
    function addToSyncQueue(reading) {
        // Obține ID-ul utilizatorului
        const userId = localStorage.getItem('userId') || 'anonymous';
        
        // Obține coada de sincronizare existentă
        let syncQueue = JSON.parse(localStorage.getItem(`glycemic_sync_queue_${userId}`) || '[]');
        
        // Adaugă noua înregistrare la coadă
        syncQueue.push(reading);
        
        // Salvează înapoi în localStorage
        localStorage.setItem(`glycemic_sync_queue_${userId}`, JSON.stringify(syncQueue));
    }
    
    // Încearcă să sincronizezi coada de date
    function attemptSyncQueue() {
        // Obține ID-ul utilizatorului
        const userId = localStorage.getItem('userId') || 'anonymous';
        
        // Obține coada de sincronizare
        const syncQueue = JSON.parse(localStorage.getItem(`glycemic_sync_queue_${userId}`) || '[]');
        
        // Dacă coada este goală, nu facem nimic
        if (syncQueue.length === 0) {
            return;
        }
        
        console.log(`Încercare de sincronizare pentru ${syncQueue.length} înregistrări`);
        
        // Procesează fiecare element și creează promisiuni
        const newQueue = [...syncQueue]; // Copie coada pentru a o modifica în siguranță
        const promises = [];
        
        syncQueue.forEach((reading, index) => {
            const promise = fetch(`${API_BASE_URL}/glycemic/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    reading: reading
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to sync');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Înregistrare sincronizată cu succes, o eliminăm din coada nouă
                    newQueue.splice(newQueue.indexOf(reading), 1);
                    return true;
                } else {
                    throw new Error('Server error');
                }
            })
            .catch(error => {
                console.error('Error syncing reading:', error);
                return false;
            });
            
            promises.push(promise);
        });
        
        // Așteptăm ca toate încercările de sincronizare să se finalizeze
        Promise.all(promises)
            .then(() => {
                // Salvăm noua coadă (doar elementele eșuate)
                localStorage.setItem(`glycemic_sync_queue_${userId}`, JSON.stringify(newQueue));
                
                // Dacă am sincronizat unele elemente, afișăm o notificare
                if (syncQueue.length > newQueue.length) {
                    console.log(`S-au sincronizat ${syncQueue.length - newQueue.length} înregistrări cu baza de date`);
                }
            });
    }
    
    // Funcție pentru afișarea mesajului de succes
    function showSuccessMessage(message) {
        // Crează un element de notificare
        const notification = document.createElement('div');
        notification.classList.add('success-notification');
        notification.innerHTML = `
            <div class="success-icon">✓</div>
            <div class="success-message">${message}</div>
        `;
        
        // Stilizează notificarea
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = '#2a6b34';
        notification.style.color = 'white';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        notification.style.zIndex = '9999';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.maxWidth = '80%';
        notification.style.fontWeight = 'bold';
        
        // Stilizează iconița
        const successIcon = notification.querySelector('.success-icon');
        successIcon.style.marginRight = '10px';
        successIcon.style.fontSize = '24px';
        
        // Adaugă la document
        document.body.appendChild(notification);
        
        // Animație de intrare
        notification.animate(
            [
                { opacity: 0, transform: 'translate(-50%, -20px)' },
                { opacity: 1, transform: 'translate(-50%, 0)' }
            ],
            {
                duration: 300,
                easing: 'ease-out',
                fill: 'forwards'
            }
        );
        
        // Elimină după câteva secunde
        setTimeout(() => {
            notification.animate(
                [
                    { opacity: 1, transform: 'translate(-50%, 0)' },
                    { opacity: 0, transform: 'translate(-50%, -20px)' }
                ],
                {
                    duration: 300,
                    easing: 'ease-in',
                    fill: 'forwards'
                }
            );
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2500);
    }
    
    // Funcție pentru afișarea mesajului de avertizare
    function showWarningMessage(message) {
        // Crează un element de notificare
        const notification = document.createElement('div');
        notification.classList.add('warning-notification');
        notification.innerHTML = `
            <div class="warning-icon">⚠️</div>
            <div class="warning-message">${message}</div>
        `;
        
        // Stilizează notificarea
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = '#f39c12';
        notification.style.color = 'white';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        notification.style.zIndex = '9999';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.maxWidth = '80%';
        
        // Stilizează iconița
        const warningIcon = notification.querySelector('.warning-icon');
        warningIcon.style.marginRight = '10px';
        warningIcon.style.fontSize = '24px';
        
        // Adaugă la document
        document.body.appendChild(notification);
        
        // Animație de intrare
        notification.animate(
            [
                { opacity: 0, transform: 'translate(-50%, -20px)' },
                { opacity: 1, transform: 'translate(-50%, 0)' }
            ],
            {
                duration: 300,
                easing: 'ease-out',
                fill: 'forwards'
            }
        );
        
        // Elimină după câteva secunde
        setTimeout(() => {
            notification.animate(
                [
                    { opacity: 1, transform: 'translate(-50%, 0)' },
                    { opacity: 0, transform: 'translate(-50%, -20px)' }
                ],
                {
                    duration: 300,
                    easing: 'ease-in',
                    fill: 'forwards'
                }
            );
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3500);
    }
    
    // Improved mobile optimizations
    document.addEventListener('touchmove', function(e) {
        // Only prevent default if not in scrollable areas
        if (!e.target.closest('.tracker-container') && !e.target.closest('.camera-overlay')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Better input handling for mobile
    const numericInputs = document.querySelectorAll('input[type="number"]');
    numericInputs.forEach(input => {
        // Make numeric inputs better on mobile
        input.addEventListener('focus', function() {
            // On iOS, this helps ensure the numeric keyboard appears
            this.setAttribute('inputmode', 'numeric');
            
            // Scroll the form to ensure the input is visible
            setTimeout(() => {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
    
    // Prevent form submission on enter key (common on mobile)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName.toLowerCase() === 'input') {
            e.preventDefault();
        }
    });
    
    // Add fast click for iOS devices to remove 300ms delay
    document.addEventListener('DOMContentLoaded', function() {
        // Check if it's an iOS device
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) {
            // Add touch event listeners to all buttons to make them more responsive
            const buttons = document.querySelectorAll('button, .button, .option-card');
            buttons.forEach(button => {
                button.addEventListener('touchstart', function() {
                    // This empty handler helps make the buttons more responsive
                });
            });
        }
    });
    
    // ============= Readings Display Functions =============
    
    // Function to check if user is logged in - more permissive to allow users to view readings
    function isUserLoggedIn() {
        // Check for any of these authentication indicators
        const hasUserId = localStorage.getItem('userId');
        const hasSession = document.cookie.includes('connect.sid'); // Standard express session cookie
        const hasHranameaSession = document.cookie.includes('hranamea_session');
        const hasAuthToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        console.log('Auth check:', {
            hasUserId,
            hasSession,
            hasHranameaSession,
            hasAuthToken,
            cookies: document.cookie
        });
        
        // If any authentication method is present, consider the user logged in
        // Set the userId in localStorage if it's not already there
        if (hasUserId) {
            localStorage.setItem('userId', hasUserId);
        }
        
        return !!(hasUserId || hasSession || hasHranameaSession || hasAuthToken);
    }
    
    // Function to show the readings overlay and fetch data - without hard authentication requirement
    function showReadings() {
        console.log('showReadings called');
        
        // Display the overlay immediately to improve user experience
        readingsOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Clear previous content and show loading spinner
        readingsList.innerHTML = '<div class="loading-spinner"></div>';
        readingsList.innerHTML += '<div style="text-align: center; margin-top: 10px;">Se încarcă datele...</div>';
        
        // Optional soft check for authentication
        const isAuthenticated = isUserLoggedIn();
        console.log('Authentication check:', isAuthenticated);
        
        // Always try to get readings - the server will handle authorization
        checkServerAuthentication();
    }
    
    // Function to verify server authentication before fetching readings - with more fallbacks
    function checkServerAuthentication() {
        console.log('Checking server authentication...');
        
        // Get user ID from URL if available
        const urlParams = new URLSearchParams(window.location.search);
        const userIdParam = urlParams.get('userId');
        if (userIdParam) {
            console.log('Found userId in URL param:', userIdParam);
            localStorage.setItem('userId', userIdParam);
            // If we have a userId from URL, directly fetch readings
            fetchReadings();
            return;
        }
        
        // Try a status check first - this should be lightweight
        fetch(`${API_BASE_URL}/auth/status`, {
            method: 'GET',
            credentials: 'include' // Important for session cookies
        })
        .then(response => {
            if (!response.ok) {
                console.warn('Status check failed, trying alternate authentication method');
                return fetch(`${API_BASE_URL}/auth/check-session`, {
                    method: 'GET',
                    credentials: 'include'
                });
            }
            return response.json();
        })
        .then(data => {
            // If we got status data
            if (data && typeof data === 'object') {
                if (data.isLoggedIn || (data.authenticated && data.user)) {
                    console.log('User authenticated via status or check-session');
                    
                    // Store user ID if available
                    if (data.user && data.user.id) {
                        console.log('Setting userId in localStorage:', data.user.id);
                        localStorage.setItem('userId', data.user.id);
                    }
                    
                    // Proceed to fetch readings
                    fetchReadings();
                    return;
                } else if (data.userId) {
                    // Some APIs return userId directly
                    console.log('Setting userId from response:', data.userId);
                    localStorage.setItem('userId', data.userId);
                    fetchReadings();
                    return;
                }
            }
            
            // If we reach here, try to fetch readings directly
            console.log('Authentication uncertain, trying to fetch readings directly');
            fetchReadings();
        })
        .catch(error => {
            console.error('Authentication check failed:', error);
            
            // Instead of showing an error, try fetching readings directly
            // The glycemic API will return 401 if authentication fails
            console.log('Trying to fetch readings directly after auth check failure');
            fetchReadings();
        });
    }
    
    // Function to close the readings overlay
    function closeReadings() {
        readingsOverlay.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Function to fetch glycemic readings from the server with enhanced error handling
    function fetchReadings() {
        // Make sure we have the DOM element to update
        if (!readingsList) {
            console.error('readingsList element not found!');
            return;
        }
        
        // If the content is already a loading spinner, don't replace it
        if (!readingsList.querySelector('.loading-spinner')) {
            // Clear previous content and show loading spinner
            readingsList.innerHTML = '<div class="loading-spinner"></div>';
            readingsList.innerHTML += '<div style="text-align: center; margin-top: 10px;">Se încarcă datele...</div>';
        }
        
        // Log that we're making the request for debugging
        console.log('Fetching glycemic readings from API...');
        
        // Full URL for clarity in logs
        const apiUrl = `${API_BASE_URL}/glycemic/readings`;
        console.log('Request URL:', apiUrl);
        
        // Try to load local data first as a baseline
        const hasLocalData = tryLoadFromLocalStorage(false); // Don't display yet, just check
        
        // Get userId for the request
        const userId = localStorage.getItem('userId');
        
        // Make the request with more detailed logging
        fetch(apiUrl + (userId ? `?userId=${userId}` : ''), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-User-ID': userId || '' // Add userId as a header too for redundancy
            },
            credentials: 'include' // Important for session cookies
        })
            .then(response => {
                console.log('API response received, status:', response.status);
                
                // Log raw response for debugging
                console.log('Raw API response status:', response.status);
                
                // Handle authentication errors specially
                if (response.status === 401 || response.status === 403) {
                    console.log('Authentication error, using local data if available');
                    throw new Error('Autentificare necesară');
                }
                
                if (!response.ok) {
                    throw new Error(`Eroare de rețea: ${response.status}`);
                }
                
                return response.json();
            })
            .then(data => {
                console.log('Readings data received:', data);
                
                if (data.success && data.readings && data.readings.length > 0) {
                    console.log(`Found ${data.readings.length} readings to display`);
                    
                    // Log a sample reading to debug
                    console.log('Sample reading from server:', JSON.stringify(data.readings[0]));
                    
                    // Check if we received a fallback response which might have different structure
                    if (data.fallback) {
                        console.log('Processing fallback data format');
                    }
                    
                    // Make sure readings have all necessary properties in the correct format
                    const processedReadings = data.readings.map((r, index) => {
                        // Log each reading for debugging
                        console.log(`Processing reading ${index}:`, JSON.stringify(r));
                        
                        // Direct access to values with console logging for debugging
                        console.log(`Reading ${index} fields:`,
                            'id=', r.id,
                            'value=', r.value,
                            'timing=', r.timing,
                            'meal_type=', r.meal_type
                        );
                        
                        // Simple processing with minimal fallbacks - just what's needed
                        let value = 0;
                        if (r.value !== undefined && r.value !== null) {
                            value = typeof r.value === 'number' ? r.value : parseFloat(r.value);
                            if (isNaN(value)) value = 0;
                        }
                        
                        // Simple processing for other fields
                        const timing = r.timing || 'unknown';
                        const mealType = r.meal_type || r.meal || 'unknown';
                        
                        // Simple date handling
                        const readingTime = r.reading_time || new Date().toISOString();
                        
                        // Return a clean object with just the needed fields
                        return {
                            id: r.id || 0,
                            user_id: r.user_id || 0,
                            value: value,
                            timing: timing,
                            meal_type: mealType,
                            reading_time: readingTime,
                            created_at: r.created_at || new Date().toISOString()
                        };
                    });
                    
                    // Save to local storage for future use
                    const userId = localStorage.getItem('userId') || 'anonymous';
                    localStorage.setItem(`${DB_KEY}_${userId}`, JSON.stringify(processedReadings));
                    
                    // Display the processed server readings
                    displayReadings(processedReadings);
                } else {
                    console.log('No readings found or empty response:', data);
                    
                    // If we have local data, use it instead of showing empty message
                    if (!hasLocalData) {
                        // More detailed empty state message
                        showNoReadingsMessage(data.error || 'Nu există citiri disponibile');
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching readings:', error);
                
                // Only show error if we don't have local data
                if (!hasLocalData) {
                    // Determine if it's an auth error
                    let errorMessage = 'Nu s-au putut obține citirile. Verificați conexiunea la internet.';
                    if (error.message.includes('Autentificare')) {
                        errorMessage = 'Autentificarea este necesară pentru a vedea citirile de pe server. Se afișează citirile locale dacă există.';
                    }
                    
                    readingsList.innerHTML = `
                        <div class="no-readings">
                            <p>${errorMessage}</p>
                            <p style="color: #888; font-size: 12px; margin-top: 10px;">Detalii eroare: ${error.message}</p>
                        </div>
                    `;
                    
                    // Try loading from local storage again, but display this time
                    tryLoadFromLocalStorage(true);
                }
            });
    }
    
    // Function to try loading readings from local storage with optional display
    function tryLoadFromLocalStorage(shouldDisplay = true) {
        console.log('Trying to load readings from local storage, shouldDisplay:', shouldDisplay);
        
        // Try multiple user IDs to find any available data
        const userIds = [
            localStorage.getItem('userId'),
            sessionStorage.getItem('userId'),
            'anonymous'
        ].filter(id => id); // Remove null/undefined values
        
        // Look through all possible user IDs
        for (const userId of userIds) {
            // Try both regular and _full variants
            const localStorageKeys = [
                `${DB_KEY}_${userId}`,
                `${DB_KEY}_${userId}_full`
            ];
            
            for (const key of localStorageKeys) {
                const localReadings = localStorage.getItem(key);
                if (localReadings) {
                    try {
                        const readings = JSON.parse(localReadings);
                        
                        if (readings && readings.length > 0) {
                            console.log(`Found ${readings.length} readings in local storage under key "${key}"`);
                            console.log('Sample local reading:', JSON.stringify(readings[0]));
                            
                            if (shouldDisplay) {
                                // Format local readings for display
                                const formattedReadings = readings.map(reading => {
                                    // More comprehensive mapping with fallbacks
                                    return {
                                        id: reading.id || 0,
                                        user_id: reading.user_id || 0,
                                        value: reading.value !== undefined ? parseFloat(reading.value) : 0,
                                        timing: reading.timing || 'unknown',
                                        meal_type: reading.meal_type || reading.meal || 'unknown',
                                        reading_time: reading.reading_time || reading.datetime || new Date().toISOString(),
                                        created_at: reading.created_at || new Date().toISOString(),
                                        local: true
                                    };
                                });
                                
                                console.log('Formatted local readings:', JSON.stringify(formattedReadings[0]));
                                showWarningMessage('Afișăm citirile din memoria locală');
                                displayReadings(formattedReadings);
                            }
                            
                            return true;
                        }
                    } catch (e) {
                        console.error(`Error parsing local readings from key "${key}":`, e);
                    }
                }
            }
        }
        
        console.log('No readings found in local storage');
        return false;
    }
    
    // Helper function for proper Romanian formatting of numbers
    function formatRomanianNumber(number) {
        return new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 1 }).format(number);
    }
    
    // Helper function for proper Romanian date formatting
    function formatRomanianDate(dateString) {
            try {
                console.log('Formatting date string:', dateString);
                let date;
                
                // Handle various date formats
                if (typeof dateString === 'string') {
                    // Try to handle ISO format or MySQL datetime format
                    date = new Date(dateString);
                } else if (dateString instanceof Date) {
                    date = dateString;
                } else {
                    console.error('Invalid date format:', dateString);
                    return { date: 'Data necunoscută', time: 'Ora necunoscută' };
                }
                
                if (isNaN(date.getTime()) || date.getFullYear() <= 1970) {
                    console.error('Invalid date value:', dateString);
                    return { date: 'Data necunoscută', time: 'Ora necunoscută' };
                }
                
                // Get day, month, year with proper Romanian formatting
                const formattedDate = date.toLocaleDateString('ro-RO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                // Get time with proper Romanian formatting
                const formattedTime = date.toLocaleTimeString('ro-RO', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                return { date: formattedDate, time: formattedTime };
            } catch (e) {
                console.error('Error formatting date:', e, dateString);
                return { date: 'Data necunoscută', time: 'Ora necunoscută' };
            }
        }
    
    // Function to display the readings in the modal with improved data validation and Romanian formatting
    function displayReadings(readings) {
            console.log('Displaying readings:', readings);
            readingsList.innerHTML = '';
            
            // Add styles for reading items if not already present
            if (!document.getElementById('glycemic-readings-styles')) {
                const styles = document.createElement('style');
                styles.id = 'glycemic-readings-styles';
                styles.textContent = `
                    .reading-item {
                        background-color: #333;
                        border-radius: 8px;
                        padding: 15px;
                        margin-bottom: 12px;
                        border-left: 3px solid #8e44ad;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                    .reading-value {
                        font-size: 18px;
                        font-weight: bold;
                        color: white;
                        margin-bottom: 5px;
                    }
                    .value-high {
                        color: #e74c3c;
                    }
                    .value-normal {
                        color: #2ecc71;
                    }
                    .value-low {
                        color: #3498db;
                    }
                    .reading-meal {
                        color: #ddd;
                        margin-bottom: 5px;
                    }
                    .reading-details {
                        display: flex;
                        justify-content: space-between;
                        color: #999;
                        font-size: 12px;
                    }
                `;
                document.head.appendChild(styles);
            }
            
            // Sort readings by date, most recent first
            const sortedReadings = [...readings];
            try {
                sortedReadings.sort((a, b) => {
                    // Safely parse dates with fallbacks
                    const dateA = a && a.reading_time ? new Date(a.reading_time) : new Date(0);
                    const dateB = b && b.reading_time ? new Date(b.reading_time) : new Date(0);
                    
                    // Check for invalid dates
                    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                        return 0;
                    }
                    
                    return dateB - dateA;
                });
            } catch (e) {
                console.error('Error sorting readings:', e);
            }
            
            if (sortedReadings.length === 0) {
                showNoReadingsMessage();
                return;
            }
    
            // Log the first reading to help with debugging
            if (sortedReadings.length > 0) {
                console.log('First reading details:', JSON.stringify(sortedReadings[0]));
            }
            
            sortedReadings.forEach((reading, index) => {
                            try {
                                // Debug log
                                console.log(`Processing reading ${index}:`, reading);
                                
                                // Validate and extract reading value with safer processing
                                let value = 0;
                                try {
                                    if (reading.value !== undefined && reading.value !== null) {
                                        console.log(`Reading value for item ${index} (before parse):`, reading.value);
                                        console.log(`Reading value type:`, typeof reading.value);
                                        
                                        // If it's already a number, use it directly
                                        if (typeof reading.value === 'number') {
                                            value = reading.value;
                                        } else {
                                            value = parseFloat(reading.value);
                                            if (isNaN(value)) value = 0;
                                        }
                                        
                                        console.log(`Reading value for item ${index} (after parse):`, value);
                                    }
                                } catch (valueErr) {
                                    console.error(`Error parsing value for display item ${index}:`, valueErr);
                                }
                                
                                // Determine value class based on range
                                let valueClass = 'value-normal';
                                if (value > 180) {
                                    valueClass = 'value-high';
                                } else if (value < 70) {
                                    valueClass = 'value-low';
                                }
                                
                                // Debug log for date
                                if (reading.reading_time) {
                                    console.log(`Reading time format for item ${index}:`, reading.reading_time);
                                }
                                
                                // Validate and format date with error handling
                                let formattedDate = 'Data necunoscută';
                                let formattedTime = 'Ora necunoscută';
                                
                                if (reading.reading_time) {
                                    const readingDate = new Date(reading.reading_time);
                                    console.log(`Parsed date for item ${index}:`, readingDate);
                                    
                                    // Check if date is valid and not the epoch date
                                    if (!isNaN(readingDate.getTime()) && readingDate.getFullYear() > 1970) {
                                        try {
                                            formattedDate = readingDate.toLocaleDateString('ro-RO', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            });
                                            
                                            formattedTime = readingDate.toLocaleTimeString('ro-RO', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            });
                                        } catch (e) {
                                            console.error('Error formatting date:', e);
                                        }
                                    }
                                }
                                
                                // Determine timing text with validation and detailed logging
                                let timingText = 'Nedefinit';
                                console.log(`Timing value for item ${index}:`, reading.timing);
                                
                                if (reading.timing === 'before') {
                                    timingText = 'Înainte de masă';
                                } else if (reading.timing === 'after') {
                                    timingText = 'După masă';
                                } else if (reading.timing) {
                                    // Try to handle other possible values
                                    const timingLower = reading.timing.toLowerCase();
                                    if (timingLower.includes('before') || timingLower.includes('inainte')) {
                                        timingText = 'Înainte de masă';
                                    } else if (timingLower.includes('after') || timingLower.includes('dupa')) {
                                        timingText = 'După masă';
                                    }
                                }
                                
                                // Determine meal text with validation, detailed logging and enhanced fallbacks
                                let mealText = 'Nedefinit';
                                try {
                                    const mealType = reading.meal_type || reading.meal; // Try both property names
                                    console.log(`Meal type for item ${index}:`, mealType);
                                    
                                    if (mealType) {
                                        // First try direct mapping (case-sensitive exact matches)
                                        switch(mealType) {
                                            case 'breakfast': mealText = 'Mic Dejun'; break;
                                            case 'lunch': mealText = 'Prânz'; break;
                                            case 'dinner': mealText = 'Cină'; break;
                                            case 'snack': mealText = 'Gustare'; break;
                                            default:
                                                // If not a direct match, try case-insensitive comparisons
                                                const mealTypeLower = typeof mealType === 'string' ? mealType.toLowerCase() : '';
                                                
                                                if (mealTypeLower === 'breakfast' || mealTypeLower.includes('mic dejun')) {
                                                    mealText = 'Mic Dejun';
                                                } else if (mealTypeLower === 'lunch' || mealTypeLower.includes('pranz')) {
                                                    mealText = 'Prânz';
                                                } else if (mealTypeLower === 'dinner' || mealTypeLower.includes('cina')) {
                                                    mealText = 'Cină';
                                                } else if (mealTypeLower === 'snack' || mealTypeLower.includes('gustare')) {
                                                    mealText = 'Gustare';
                                                }
                                        }
                                    }
                                } catch (mealErr) {
                                    console.error(`Error processing meal type for display item ${index}:`, mealErr);
                                }
                    
                    // Create reading item with validated data
                    const readingItem = document.createElement('div');
                    readingItem.className = 'reading-item';
                    readingItem.innerHTML = `
                        <div class="reading-value ${valueClass}">${value} mg/dl</div>
                        <div class="reading-meal">${mealText} - ${timingText}</div>
                        <div class="reading-details">
                            <span>${formattedDate}</span>
                            <span>${formattedTime}</span>
                        </div>
                    `;
                    
                    readingsList.appendChild(readingItem);
                } catch (e) {
                    console.error('Error rendering reading:', e, reading);
                }
            });
        }
    
    // Function to show a message when no readings are available
    function showNoReadingsMessage(errorMessage = null) {
        readingsList.innerHTML = `
            <div class="no-readings">
                <p>Nu există încă înregistrări glicemice.</p>
                <p>Adăugați valori pentru a începe monitorizarea.</p>
                ${errorMessage ? `<p style="color: #888; font-size: 12px; margin-top: 10px;">${errorMessage}</p>` : ''}
            </div>
        `;
    }
    
    // Function to save all readings to local storage and download as a file
    // Îmbunătățită pentru compatibilitate cu toate browserele
    function saveReadingsToLocal() {
        console.log('Saving readings locally and preparing download...');
        
        // First check if user is logged in
        if (!isUserLoggedIn()) {
            alert('Trebuie să fiți autentificat pentru a salva citirile. Vă rugăm să vă autentificați.');
            return;
        }
        
        // Show loading indicator
        const originalButtonText = saveReadingsLocalBtn.textContent;
        saveReadingsLocalBtn.textContent = 'Se salvează...';
        saveReadingsLocalBtn.disabled = true;
        
        // Detectează browserul și dispozitivul pentru a furniza informații de debugging
        const userAgent = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(userAgent);
        const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        
        console.log('Device info for saving:', {
            userAgent: userAgent.substring(0, 100) + '...',
            isIOS,
            isSafari,
            isMobile
        });
        
        // Înainte de a face cererea API, încercăm să încărcăm datele locale
        // ca backup în caz că cererea API eșuează
        const userId = localStorage.getItem('userId') || 'anonymous';
        let localReadingsBackup = [];
        
        try {
            const storedReadings = localStorage.getItem(`${DB_KEY}_${userId}_full`) ||
                                  localStorage.getItem(`${DB_KEY}_${userId}`);
            if (storedReadings) {
                localReadingsBackup = JSON.parse(storedReadings);
                console.log(`Loaded ${localReadingsBackup.length} readings from local storage as backup`);
            }
        } catch (e) {
            console.error('Error loading local readings backup:', e);
        }
        
        // Facem cererea pentru a obține cele mai recente date de pe server
        fetch(`${API_BASE_URL}/glycemic/readings`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-User-ID': userId || '' // Adăugăm ID-ul utilizatorului în header pentru redundanță
            },
            credentials: 'include' // Important pentru cookie-uri de sesiune
        })
        .then(response => {
            console.log('Server response status:', response.status);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success && data.readings) {
                console.log(`Got ${data.readings.length} readings from server`);
                
                // Salvează în localStorage pentru uz offline
                localStorage.setItem(`${DB_KEY}_${userId}_full`, JSON.stringify(data.readings));
                
                // Afișează mesaj de succes pentru salvarea locală
                showSuccessMessage('Citirile glicemice au fost salvate local cu succes!');
                
                // Format readings for download
                const formattedContent = formatReadingsForDownload(data.readings);
                
                // Create a safe filename with date and time for uniqueness
                const now = new Date();
                const dateStr = now.getFullYear() + '-' +
                          String(now.getMonth() + 1).padStart(2, '0') + '-' +
                          String(now.getDate()).padStart(2, '0');
                const timeStr = String(now.getHours()).padStart(2, '0') +
                          String(now.getMinutes()).padStart(2, '0');
                const fileName = 'Citiri_Glicemice_' + dateStr + '_' + timeStr;
                
                // Download with enhanced compatibility
                try {
                    // For modern mobile devices, try Web Share API first (works on Android and some iOS)
                    if (navigator.share && isMobile) {
                        console.log('Trying Web Share API for mobile sharing');
                        
                        navigator.share({
                            title: 'Citirile mele glicemice',
                            text: formattedContent,
                            url: window.location.href
                        })
                        .then(() => console.log('Readings shared successfully'))
                        .catch(error => {
                            console.warn('Web Share API failed, falling back to direct download:', error);
                            // Fall back to our enhanced direct download
                            directDownloadAsFile(formattedContent, fileName);
                        });
                    } else {
                        // Use our enhanced cross-browser download function
                        console.log('Using cross-browser download function');
                        directDownloadAsFile(formattedContent, fileName);
                    }
                } catch (e) {
                    console.error('Error during file download process:', e);
                    
                    // Last chance fallback - copy to clipboard
                    if (copyToClipboard(formattedContent)) {
                        alert('Eroare la descărcarea fișierului. Conținutul a fost copiat în clipboard. Puteți copia și lipi într-un document text.');
                    } else {
                        alert('Nu s-a putut descărca fișierul. Verificați permisiunile browserului și încercați din nou.');
                    }
                }
            } else {
                console.warn('Server response did not contain valid readings:', data);
                throw new Error('Nu s-au obținut date valide de la server');
            }
        })
        .catch(error => {
            console.error('Error fetching readings from server:', error);
            
            // Dacă avem backup local, folosim acesta
            if (localReadingsBackup.length > 0) {
                console.log(`Using ${localReadingsBackup.length} local readings as fallback`);
                showWarningMessage('Nu s-a putut conecta la server. Folosim datele salvate local.');
                
                // Format local readings for download
                const formattedContent = formatReadingsForDownload(localReadingsBackup);
                const fileName = 'Citiri_Glicemice_Locale_' + new Date().toISOString().split('T')[0];
                
                try {
                    directDownloadAsFile(formattedContent, fileName);
                } catch (e) {
                    console.error('Fallback download failed:', e);
                    if (copyToClipboard(formattedContent)) {
                        alert('Eroare la descărcarea fișierului. Conținutul a fost copiat în clipboard.');
                    }
                }
            } else {
                // Afișează mesaj de eroare
                showWarningMessage('Nu s-au putut salva citirile. Verificați conexiunea la internet.');
            }
        })
        .finally(() => {
            // Resetează butonul indiferent de rezultat
            saveReadingsLocalBtn.textContent = originalButtonText;
            saveReadingsLocalBtn.disabled = false;
        });
    }
    
    // Helper function to format readings for download
    function formatReadingsForDownload(readings) {
        const dateStr = new Date().toLocaleDateString('ro-RO');
        let content = `ISTORICUL CITIRILOR GLICEMICE
-----------------------------------
Generate pe: ${dateStr}
Număr total citiri: ${readings.length}

`;

        // Sort readings by date, most recent first
        const sortedReadings = [...readings];
        try {
            sortedReadings.sort((a, b) => {
                const dateA = a && a.reading_time ? new Date(a.reading_time) : new Date(0);
                const dateB = b && b.reading_time ? new Date(b.reading_time) : new Date(0);
                return dateB - dateA;
            });
        } catch (e) {
            console.error('Error sorting readings:', e);
        }

        // Add each reading to the content
        sortedReadings.forEach((reading, index) => {
            try {
                // Extract and format data
                const value = reading.value !== undefined ? parseFloat(reading.value) : 0;
                
                // Format the meal type
                let mealText = 'Nedefinit';
                const mealType = reading.meal_type || reading.meal;
                if (mealType) {
                    switch(mealType) {
                        case 'breakfast': mealText = 'Mic Dejun'; break;
                        case 'lunch': mealText = 'Prânz'; break;
                        case 'dinner': mealText = 'Cină'; break;
                        case 'snack': mealText = 'Gustare'; break;
                    }
                }
                
                // Format the timing
                let timingText = 'Nedefinit';
                if (reading.timing === 'before') {
                    timingText = 'Înainte de masă';
                } else if (reading.timing === 'after') {
                    timingText = 'După masă';
                }
                
                // Format the date
                let dateText = 'Data necunoscută';
                let timeText = 'Ora necunoscută';
                
                if (reading.reading_time) {
                    const readingDate = new Date(reading.reading_time);
                    if (!isNaN(readingDate.getTime()) && readingDate.getFullYear() > 1970) {
                        try {
                            dateText = readingDate.toLocaleDateString('ro-RO', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });
                            
                            timeText = readingDate.toLocaleTimeString('ro-RO', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                        } catch (e) {
                            console.error('Error formatting date for download:', e);
                        }
                    }
                }
                
                // Add to content
                content += `CITIRE #${index + 1}
Valoare: ${value} mg/dl
Masă: ${mealText}
Moment: ${timingText}
Data: ${dateText}
Ora: ${timeText}
-----------------------------------
`;
            } catch (e) {
                console.error('Error processing reading for download:', e);
            }
        });
        
        content += `
Generat cu: Monitorizare Glicemie - Hrana Mea
www.hranamea.ro`;
        
        return content;
    }

    // Function to download content as a file with maximum cross-browser compatibility
    function directDownloadAsFile(content, fileName) {
        console.log('Starting cross-browser compatible download');
        
        try {
            // Add a BOM (Byte Order Mark) to the content to ensure UTF-8 encoding is recognized
            const BOM = '\uFEFF';
            const contentWithBOM = BOM + content;
            
            // Determine browser and environment compatibility
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            const isOldIE = typeof window.navigator.msSaveBlob !== 'undefined';
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            console.log('Detected device/browser:', { isIOS, isSafari, isOldIE, isMobile });
            
            // Create blob with explicit UTF-8 encoding for Romanian diacritics
            const blob = new Blob([contentWithBOM], { type: 'text/plain;charset=UTF-8' });
            
            // Special case for iOS Safari which can't download files directly
            if (isIOS && isSafari) {
                console.log('iOS Safari detected, using special handling');
                // For iOS Safari, open in a new tab/window
                const reader = new FileReader();
                reader.onload = function(e) {
                    const newWindow = window.open();
                    if (!newWindow) {
                        console.error('Popup blocked, using clipboard fallback');
                        copyToClipboard(content);
                        alert('Nu s-a putut deschide o fereastră nouă. Textul a fost copiat în clipboard. Salvați manual într-un document text.');
                        return;
                    }
                    
                    // Create a simple text interface in the new window
                    newWindow.document.write(`
                        <html>
                        <head>
                            <title>Citiri Glicemice</title>
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <style>
                                body { font-family: monospace; white-space: pre-wrap; padding: 20px; background: #f5f5f5; }
                                .header { position: fixed; top: 0; left: 0; right: 0; background: #fff; padding: 10px; border-bottom: 1px solid #ccc; text-align: center; z-index: 1000; }
                                .content { margin-top: 60px; }
                                button { background: #4CAF50; color: white; border: none; padding: 10px 15px; margin: 5px; border-radius: 4px; cursor: pointer; }
                                button:active { background: #3e8e41; }
                                #copy-message { display: none; color: green; margin-left: 10px; }
                            </style>
                        </head>
                        <body>
                            <div class="header">
                                <button onclick="copyAll()">Copiază Tot</button>
                                <button onclick="window.print()">Printează</button>
                                <span id="copy-message">Copiat!</span>
                            </div>
                            <div class="content">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                            <script>
                                function copyAll() {
                                    const textArea = document.createElement('textarea');
                                    textArea.value = ${JSON.stringify(content)};
                                    document.body.appendChild(textArea);
                                    textArea.select();
                                    document.execCommand('copy');
                                    document.body.removeChild(textArea);
                                    
                                    // Show copied message
                                    const msg = document.getElementById('copy-message');
                                    msg.style.display = 'inline';
                                    setTimeout(() => { msg.style.display = 'none'; }, 2000);
                                }
                            </script>
                        </body>
                        </html>
                    `);
                    newWindow.document.close();
                };
                reader.readAsText(blob);
                alert('Datele sunt pregătite. Folosiți opțiunea de copiere sau printare pentru a le salva.');
                return;
            }
            
            // For Internet Explorer
            if (isOldIE) {
                console.log('IE detected, using msSaveBlob');
                window.navigator.msSaveBlob(blob, fileName + '.txt');
                alert('Citirile glicemice au fost descărcate!');
                return;
            }

            // For mobile browsers that support download but might have issues
            if (isMobile) {
                try {
                    // Try the modern approach first
                    const url = URL.createObjectURL(blob);
                    const downloadLink = document.createElement('a');
                    downloadLink.href = url;
                    downloadLink.download = fileName + '.txt';
                    downloadLink.style.display = 'none';
                    
                    // Required for Firefox and mobile
                    document.body.appendChild(downloadLink);
                    
                    // Trigger click with a small delay for mobile
                    setTimeout(() => {
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                        window.URL.revokeObjectURL(url);
                    }, 100);
                    
                    alert('Citirile glicemice au fost descărcate!');
                    return;
                } catch (mobileErr) {
                    console.error('Mobile download error:', mobileErr);
                    // Fall through to data URL approach
                }
                
                // Alternative for older mobile browsers: try data URL approach
                try {
                    const reader = new FileReader();
                    reader.onload = function() {
                        const link = document.createElement('a');
                        link.href = reader.result;
                        link.download = fileName + '.txt';
                        link.style.display = 'none';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        alert('Citirile glicemice au fost descărcate!');
                    };
                    reader.readAsDataURL(blob);
                    return;
                } catch (dataUrlErr) {
                    console.error('Data URL approach failed:', dataUrlErr);
                    // Fall through to clipboard as last resort
                }
            }
            
            // Standard approach for modern desktop browsers
            console.log('Using standard download approach');
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = fileName + '.txt';
            downloadLink.style.display = 'none';
            
            // Required for Firefox
            document.body.appendChild(downloadLink);
            
            // Trigger click programmatically
            downloadLink.click();
            
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(downloadLink);
                window.URL.revokeObjectURL(url);
            }, 100);
            
            alert('Citirile glicemice au fost descărcate!');
        } catch (e) {
            console.error('Download error:', e);
            
            // Last resort: copy to clipboard
            if (copyToClipboard(content)) {
                alert('Nu s-a putut descărca fișierul. Conținutul a fost copiat în clipboard pentru a fi salvat manual.');
            } else {
                alert('Nu s-a putut descărca fișierul sau copia în clipboard. Verificați permisiunile browserului.');
            }
        }
    }
    
    // Helper function for clipboard copying that works across all browsers
    function copyToClipboard(text) {
        try {
            // Modern method with Clipboard API (works in newer browsers)
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text);
                return true;
            }
            
            // Fallback to older execCommand method (works in older browsers)
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        } catch (err) {
            console.error('Failed to copy: ', err);
            return false;
        }
    }
});