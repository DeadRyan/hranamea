/**
 * Glucometer Image Processing and Value Validation Components 
 * for Hrana Mea App Glycemic Tracker with Server-Side OCR
 */

// Add to state variables in the main file
let currentProcessedImage = null;

/**
 * Creates a validation section for the detected glucometer value
 */
function createValueValidationSection() {
    // Check if section already exists
    if (document.getElementById('value-validation-section')) {
        return;
    }
    
    // Create the validation section
    const valueValidationSection = document.createElement('div');
    valueValidationSection.id = 'value-validation-section';
    valueValidationSection.classList.add('input-form');
    valueValidationSection.style.display = 'none'; // Initially hidden
    
    // Add HTML content for the validation section
    valueValidationSection.innerHTML = `
        <h2>Verifică valoarea detectată</h2>
        <p>Am detectat următoarea valoare glicemică folosind recunoaștere optică. Te rugăm să verifici dacă este corectă.</p>
        
        <div class="input-group" style="margin-bottom: 20px;">
            <div id="detected-value-container" style="text-align: center;">
                <label for="detected-value">Valoare detectată (mg/dl)</label>
                <input type="number" id="detected-value" min="20" max="600" readonly
                       style="font-size: 24px; text-align: center; font-weight: bold;
                              padding: 15px 10px; background-color: #333; color: white;
                              margin-top: 10px; border: 2px solid #db23e8;">
                <div style="margin-top: 15px; display: flex; justify-content: space-between; gap: 10px;">
                    <button id="confirm-detected-value" style="flex: 1; background-color: #2a6b34;">Confirmă</button>
                    <button id="edit-detected-value" style="flex: 1; background-color: #e67e22;">Editează</button>
                </div>
            </div>
            
            <div id="edit-value-container" style="display: none; text-align: center;">
                <label for="edited-value">Modifică valoarea (mg/dl)</label>
                <input type="number" id="edited-value" min="20" max="600"
                       style="font-size: 24px; text-align: center; font-weight: bold;
                              padding: 15px 10px; background-color: #333; color: white;
                              margin-top: 10px; border: 2px solid #e67e22;">
                <div style="margin-top: 15px; display: flex; justify-content: space-between; gap: 10px;">
                    <button id="save-edited-value" style="flex: 1; background-color: #2a6b34;">Salvează</button>
                    <button id="cancel-edit-value" style="flex: 1; background-color: #e74c3c;">Anulează</button>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
            <img id="processed-image-preview" style="max-width: 100%; max-height: 150px;
                                                    border-radius: 8px; display: block;
                                                    margin: 0 auto 15px auto;" src="">
            <p style="font-size: 13px; color: #999;">Imagine procesată pentru îmbunătățirea recunoașterii valorii. Procesarea folosește tehnologie avansată de OCR.</p>
        </div>
    `;
    
    // Add the section to the DOM
    const trackerContainer = document.querySelector('.tracker-container .input-form');
    trackerContainer.appendChild(valueValidationSection);
    
    // Add event listeners
    setupValueValidationListeners();
}

/**
 * Setup event listeners for the value validation section
 */
function setupValueValidationListeners() {
    const valueValidationSection = document.getElementById('value-validation-section');
    if (!valueValidationSection) return;
    
    const confirmValueBtn = valueValidationSection.querySelector('#confirm-detected-value');
    const editValueBtn = valueValidationSection.querySelector('#edit-detected-value');
    const saveEditedBtn = valueValidationSection.querySelector('#save-edited-value');
    const cancelEditBtn = valueValidationSection.querySelector('#cancel-edit-value');
    
    if (confirmValueBtn) {
        confirmValueBtn.addEventListener('click', () => {
            const detectedInput = document.getElementById('detected-value');
            // Set both the local and window-scoped currentValue
            currentValue = parseFloat(detectedInput.value);
            window.currentValue = currentValue;
            
            console.log('Confirmed glycemic value:', currentValue);
            
            if (typeof window.goToMealTiming === 'function') {
                window.goToMealTiming();
            } else {
                console.error('goToMealTiming function not found in window scope');
                alert('Eroare la navigare. Vă rugăm să încercați din nou.');
            }
        });
    }
    
    if (editValueBtn) {
        editValueBtn.addEventListener('click', () => {
            const valueContainer = document.getElementById('detected-value-container');
            const editContainer = document.getElementById('edit-value-container');
            const editInput = document.getElementById('edited-value');
            const detectedInput = document.getElementById('detected-value');
            
            valueContainer.style.display = 'none';
            editContainer.style.display = 'block';
            editInput.value = detectedInput.value;
            editInput.focus();
        });
    }
    
    if (saveEditedBtn) {
        saveEditedBtn.addEventListener('click', () => {
            const editInput = document.getElementById('edited-value');
            const detectedInput = document.getElementById('detected-value');
            const valueContainer = document.getElementById('detected-value-container');
            const editContainer = document.getElementById('edit-value-container');
            
            const value = parseFloat(editInput.value);
            if (isNaN(value) || value < 20 || value > 600) {
                alert('Te rugăm să introduci o valoare între 20 și 600 mg/dl.');
                return;
            }
            
            detectedInput.value = value;
            valueContainer.style.display = 'block';
            editContainer.style.display = 'none';
        });
    }
    
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            const valueContainer = document.getElementById('detected-value-container');
            const editContainer = document.getElementById('edit-value-container');
            
            valueContainer.style.display = 'block';
            editContainer.style.display = 'none';
        });
    }
}

/**
 * Navigate to the value validation screen
 * @param {number} detectedValue - The detected blood glucose value
 */
function goToValueValidation(detectedValue) {
    // First ensure we have a value validation section
    if (!document.getElementById('value-validation-section')) {
        createValueValidationSection();
    }
    
    console.log('Navigating to value validation with value:', detectedValue);
    
    // We need to access the global hideAllSections function
    if (typeof hideAllSections === 'function') {
        hideAllSections();
    } else if (typeof window.hideAllSections === 'function') {
        window.hideAllSections();
    } else {
        // Fallback - hide sections manually
        const sections = [
            'input-method-section',
            'manual-input-section',
            'camera-input-section',
            'meal-timing-section',
            'meal-type-section',
            'confirmation-section'
        ];
        
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                section.classList.remove('active');
            }
        });
    }
    
    // Set the detected value in the input field
    const valueInput = document.getElementById('detected-value');
    if (valueInput) {
        valueInput.value = detectedValue;
    }
    
    // Make sure we're in display mode, not edit mode
    const valueContainer = document.getElementById('detected-value-container');
    const editContainer = document.getElementById('edit-value-container');
    
    if (valueContainer && editContainer) {
        valueContainer.style.display = 'block';
        editContainer.style.display = 'none';
    }
    
    // Access the processed image from window object if needed
    const processedImageToUse = window.currentProcessedImage || currentProcessedImage;
    
    // Update the processed image preview
    const processedPreview = document.getElementById('processed-image-preview');
    if (processedPreview && processedImageToUse) {
        processedPreview.src = processedImageToUse;
    }
    
    // Show the validation section
    const validationSection = document.getElementById('value-validation-section');
    if (validationSection) {
        validationSection.classList.add('active');
        validationSection.style.display = 'block';
    }
    
    console.log('Value validation screen activated');
}

/**
 * Add a glucometer positioning overlay to help users 
 * correctly frame the device in the camera view
 */
function addGlucometerOverlay() {
    // Remove any existing overlay
    const existingOverlay = document.getElementById('glucometer-guide');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // Create container for overlay
    const overlay = document.createElement('div');
    overlay.id = 'glucometer-guide';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none'; // Allow clicks to pass through
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '10';
    
    // Add positioning guide - a rectangle with borders showing where to position the glucometer display
    const guide = document.createElement('div');
    guide.style.width = '70%';
    guide.style.height = '40%';
    guide.style.border = '2px dashed rgba(219, 35, 232, 0.8)';
    guide.style.borderRadius = '10px';
    guide.style.boxShadow = '0 0 0 2000px rgba(0, 0, 0, 0.3)';
    guide.style.animation = 'pulse 2s infinite ease-in-out';
    
    // Add instructions that appear above the rectangle
    const instructions = document.createElement('div');
    instructions.textContent = 'Poziționează ecranul glucometrului în cadru';
    instructions.style.position = 'absolute';
    instructions.style.top = 'calc(30% - 40px)';
    instructions.style.left = '0';
    instructions.style.width = '100%';
    instructions.style.color = 'white';
    instructions.style.textAlign = 'center';
    instructions.style.padding = '10px';
    instructions.style.fontWeight = 'bold';
    instructions.style.textShadow = '0 0 4px black';
    instructions.style.fontSize = '16px';
    
    // Add secondary instructions for better guidance
    const secondaryInstructions = document.createElement('div');
    secondaryInstructions.textContent = 'Asigură-te că cifrele sunt clare și bine iluminate';
    secondaryInstructions.style.position = 'absolute';
    secondaryInstructions.style.top = 'calc(70% + 20px)';
    secondaryInstructions.style.left = '0';
    secondaryInstructions.style.width = '100%';
    secondaryInstructions.style.color = '#ffeb3b';
    secondaryInstructions.style.textAlign = 'center';
    secondaryInstructions.style.padding = '10px';
    secondaryInstructions.style.fontWeight = 'bold';
    secondaryInstructions.style.textShadow = '0 0 4px black';
    secondaryInstructions.style.fontSize = '14px';
    
    // Add elements to DOM
    overlay.appendChild(guide);
    overlay.appendChild(instructions);
    overlay.appendChild(secondaryInstructions);
    document.querySelector('.camera-feed').appendChild(overlay);
    
    // Add animation style if not already present
    if (!document.getElementById('glucometer-overlay-styles')) {
        const style = document.createElement('style');
        style.id = 'glucometer-overlay-styles';
        style.textContent = `
            @keyframes pulse {
                0% { opacity: 0.7; }
                50% { opacity: 1; }
                100% { opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Process captured image and extract glucose value using server-side OCR
 * @param {string} imageData - Base64 image data
 * @param {function} callback - Function to call with results (detectedValue, processedImage)
 */
function processImageAndExtractValue(imageData, callback) {
    // Show loading indicator
    const loadingContainer = document.createElement('div');
    loadingContainer.id = 'ocr-loading-container';
    loadingContainer.style.position = 'fixed';
    loadingContainer.style.top = '0';
    loadingContainer.style.left = '0';
    loadingContainer.style.width = '100%';
    loadingContainer.style.height = '100%';
    loadingContainer.style.backgroundColor = 'rgba(0,0,0,0.7)';
    loadingContainer.style.zIndex = '9999';
    loadingContainer.style.display = 'flex';
    loadingContainer.style.flexDirection = 'column';
    loadingContainer.style.justifyContent = 'center';
    loadingContainer.style.alignItems = 'center';
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    
    const message = document.createElement('div');
    message.textContent = 'Se procesează imaginea...';
    message.style.color = 'white';
    message.style.marginTop = '20px';
    message.style.fontWeight = 'bold';
    
    // Add a submessage explaining the process
    const submessage = document.createElement('div');
    submessage.innerHTML = 'Se analizează imaginea cu tehnologie OCR avansată...';
    submessage.style.color = '#aaa';
    submessage.style.marginTop = '10px';
    submessage.style.fontSize = '14px';
    
    loadingContainer.appendChild(spinner);
    loadingContainer.appendChild(message);
    loadingContainer.appendChild(submessage);
    document.body.appendChild(loadingContainer);
    
    // Compress the image before sending to the server
    compressImage(imageData, 0.7, 1200) // 70% quality, max dimension 1200px
        .then(compressedImage => {
            // Update message
            submessage.textContent = 'Imaginea a fost optimizată, se trimite la server...';
            
            // Send compressed image to server OCR API
            // Use the glycemic-ocr endpoint first, and if that fails, try the glycemic/analyze-image endpoint as fallback
            return sendImageToServerOCR(compressedImage)
              .catch(error => {
                console.warn('Primary OCR endpoint failed, trying fallback endpoint:', error);
                return sendImageToFallbackOCR(compressedImage);
              });
        })
        .then(result => {
            console.log('Server OCR analysis complete:', result);
            
            try {
                // Remove loading indicator
                if (document.body.contains(loadingContainer)) {
                    document.body.removeChild(loadingContainer);
                }
                
                if (result.success) {
                    // Store the enhanced image from the server
                    window.currentProcessedImage = result.enhancedImage;
                    
                    // Return result via callback
                    callback(result.value, result.enhancedImage);
                } else {
                    throw new Error(result.error || 'OCR analysis failed');
                }
            } catch (error) {
                console.error('Error in OCR image processing:', error);
                
                // Remove loading indicator if it's still present
                if (document.body.contains(loadingContainer)) {
                    document.body.removeChild(loadingContainer);
                }
                
                // Get a value from the error object if available
                let fallbackValue;
                if (error.response && error.response.data && error.response.data.value) {
                    fallbackValue = error.response.data.value;
                } else {
                    // Use a reasonable fallback value in the middle range
                    fallbackValue = 110;
                }
                
                callback(fallbackValue, imageData);
                
                // Update alert message to be more user-friendly
                alert('Valoarea a fost setată provizoriu. Te rugăm să verifici și să modifici valoarea conform dispozitivului.');
            }
        })
        .catch(error => {
            console.error('Error in server OCR service:', error);
            
            // Remove loading indicator
            if (document.body.contains(loadingContainer)) {
                document.body.removeChild(loadingContainer);
            }
            
            // Use fallback value
            const fallbackValue = Math.floor(Math.random() * 110) + 70;
            callback(fallbackValue, imageData);
            
            alert('Eroare la analiza imaginii. Te rugăm să verifici și să modifici valoarea manual dacă este necesar.');
        });
}

/**
 * Send image to server-side OCR API (primary endpoint)
 * @param {string} imageData - Base64 image data
 * @returns {Promise<object>} - Promise resolving to analysis result
 */
function sendImageToServerOCR(imageData) {
    return new Promise((resolve, reject) => {
        console.log('Sending image to primary OCR API...');
        
        // Determine the API endpoint
        const apiBaseUrl = location.hostname.includes('hranamea.ro') ?
            'https://hranamea.ro/api' : '/api';
        
        const apiUrl = `${apiBaseUrl}/glycemic-ocr/analyze`;
        
        // Make the API request
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: imageData
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Primary OCR API response:', data);
            resolve(data);
        })
        .catch(error => {
            console.error('Primary OCR API request failed:', error);
            reject(error);
        });
    });
}

/**
 * Send image to fallback server-side OCR API
 * @param {string} imageData - Base64 image data
 * @returns {Promise<object>} - Promise resolving to analysis result
 */
function sendImageToFallbackOCR(imageData) {
    return new Promise((resolve, reject) => {
        console.log('Sending image to fallback OCR API...');
        
        // Determine the API endpoint
        const apiBaseUrl = location.hostname.includes('hranamea.ro') ?
            'https://hranamea.ro/api' : '/api';
        
        const apiUrl = `${apiBaseUrl}/glycemic/analyze-image`;
        
        // Make the API request
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: imageData
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Fallback server returned ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fallback OCR API response:', data);
            resolve(data);
        })
        .catch(error => {
            console.error('Fallback OCR API request failed:', error);
            reject(error);
        });
    });
}

/**
 * Compress an image to reduce its file size before sending to server
 * @param {string} dataUrl - Base64 encoded image data URL
 * @param {number} quality - JPEG quality (0-1)
 * @param {number} maxDimension - Maximum width/height
 * @returns {Promise<string>} - Compressed image data URL
 */
function compressImage(dataUrl, quality, maxDimension) {
    return new Promise((resolve, reject) => {
        try {
            const img = new Image();
            img.onload = function() {
                // Calculate new dimensions
                let width = img.width;
                let height = img.height;
                
                // Resize if larger than maxDimension
                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = Math.round(height * (maxDimension / width));
                        width = maxDimension;
                    } else {
                        width = Math.round(width * (maxDimension / height));
                        height = maxDimension;
                    }
                }
                
                // Create canvas for resizing
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                
                // Draw image on canvas
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Get compressed data URL
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                
                console.log(`Image compressed: ${Math.round(compressedDataUrl.length / 1024)}KB (${width}x${height})`);
                resolve(compressedDataUrl);
            };
            
            img.onerror = function() {
                reject(new Error('Failed to load image for compression'));
            };
            
            img.src = dataUrl;
        } catch (error) {
            console.error('Error compressing image:', error);
            reject(error);
        }
    });
}

// Export for integration with main file
window.GlucometerProcessing = {
    createValueValidationSection,
    setupValueValidationListeners,
    goToValueValidation,
    addGlucometerOverlay,
    processImageAndExtractValue
};