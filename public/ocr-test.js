/**
 * Temporary OCR Test Module
 * This module adds a test button to the glycemic tracker page for testing OCR with sample glucometer images.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add the test button to the UI
    const inputMethodSection = document.getElementById('input-method-section');
    const showReadingsBtn = document.getElementById('show-readings-btn');

    if (inputMethodSection && showReadingsBtn) {
        // Create test button with a different color to distinguish it
        const testButton = document.createElement('button');
        testButton.id = 'ocr-test-btn';
        testButton.textContent = 'Testare OCR Glucometre';
        testButton.style.backgroundColor = '#d35400'; // Different color to distinguish from other buttons
        testButton.style.margin = '15px auto 0';
        testButton.style.width = '100%';
        testButton.style.maxWidth = '400px';
        testButton.style.display = 'block';
        
        // Insert after the show readings button
        showReadingsBtn.parentNode.insertBefore(testButton, showReadingsBtn.nextSibling);
        
        // Add event listener
        testButton.addEventListener('click', openOcrTestModal);
    }

    // Create and add the test modal to the DOM
    const testModal = document.createElement('div');
    testModal.id = 'ocr-test-modal';
    testModal.className = 'ocr-test-modal';
    testModal.innerHTML = `
        <div class="ocr-test-container">
            <h2>Test Recunoaștere OCR Glucometre</h2>
            <div class="test-content">
                <div class="test-controls">
                    <button id="run-test-btn">Rulează testele</button>
                    <div class="test-status">Apasă butonul pentru a începe testele</div>
                </div>
                <div class="test-results">
                    <div class="test-item">
                        <h3>Glucometru 1 (107)</h3>
                        <div class="test-image-container">
                            <img id="test-image-1" src="/uploads/test-glucometers/glucometer1.jpg" alt="Glucometru 1">
                        </div>
                        <div class="test-result-details" id="result-1">
                            <div class="loading-spinner" style="display: none;"></div>
                            <div class="result-data"></div>
                        </div>
                    </div>
                    <div class="test-item">
                        <h3>Glucometru 2 (93)</h3>
                        <div class="test-image-container">
                            <img id="test-image-2" src="/uploads/test-glucometers/glucometer2.jpg" alt="Glucometru 2">
                        </div>
                        <div class="test-result-details" id="result-2">
                            <div class="loading-spinner" style="display: none;"></div>
                            <div class="result-data"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ocr-test-actions">
                <button id="close-test-modal">Închide</button>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .ocr-test-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            overflow-y: auto;
        }
        
        .ocr-test-container {
            width: 95%;
            max-width: 800px;
            background-color: #2a2a2a;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            margin: auto;
            max-height: 85vh;
            overflow-y: auto;
        }
        
        .ocr-test-container h2 {
            color: #db23e8;
            text-align: center;
            margin-top: 0;
            margin-bottom: 15px;
            border-bottom: 1px solid #444;
            padding-bottom: 10px;
        }
        
        .test-controls {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
            padding: 10px;
            background-color: #333;
            border-radius: 8px;
        }
        
        #run-test-btn {
            background-color: #d35400;
            padding: 12px 20px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            color: white;
            cursor: pointer;
            margin-bottom: 10px;
        }
        
        .test-status {
            font-size: 14px;
            color: #ccc;
            text-align: center;
        }
        
        .test-results {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .test-item {
            background-color: #333;
            border-radius: 8px;
            padding: 15px;
            border-left: 3px solid #db23e8;
        }
        
        .test-item h3 {
            color: #fff;
            margin-top: 0;
            font-size: 16px;
            margin-bottom: 10px;
        }
        
        .test-image-container {
            width: 100%;
            margin-bottom: 10px;
            text-align: center;
        }
        
        .test-image-container img {
            max-width: 100%;
            max-height: 200px;
            border-radius: 4px;
            border: 1px solid #444;
        }
        
        .test-result-details {
            background-color: #252525;
            border-radius: 5px;
            padding: 10px;
            margin-top: 10px;
            min-height: 50px;
        }
        
        .result-data {
            font-family: monospace;
            white-space: pre-wrap;
            font-size: 14px;
        }
        
        .result-success {
            color: #2ecc71;
            font-weight: bold;
        }
        
        .result-failure {
            color: #e74c3c;
            font-weight: bold;
        }
        
        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,.3);
            border-radius: 50%;
            border-top-color: #db23e8;
            animation: spin 1s ease-in-out infinite;
            margin: 10px auto;
        }
        
        .ocr-test-actions {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }
        
        .ocr-test-actions button {
            background-color: #666;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            color: white;
            cursor: pointer;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @media (max-width: 600px) {
            .ocr-test-container {
                padding: 10px;
            }
            
            .test-item {
                padding: 10px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(testModal);
    
    // Add event listeners
    const closeTestModalBtn = document.getElementById('close-test-modal');
    const runTestBtn = document.getElementById('run-test-btn');
    
    if (closeTestModalBtn) {
        closeTestModalBtn.addEventListener('click', closeOcrTestModal);
    }
    
    if (runTestBtn) {
        runTestBtn.addEventListener('click', runOcrTests);
    }
    
    // Function to open the test modal
    function openOcrTestModal() {
        const modal = document.getElementById('ocr-test-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }
    
    // Function to close the test modal
    function closeOcrTestModal() {
        const modal = document.getElementById('ocr-test-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
    
    // Function to run OCR tests
    function runOcrTests() {
        const statusElement = document.querySelector('.test-status');
        const result1Element = document.getElementById('result-1');
        const result2Element = document.getElementById('result-2');
        
        if (!result1Element || !result2Element) return;
        
        // Show loading spinners
        statusElement.textContent = 'Testarea este în curs...';
        const spinner1 = result1Element.querySelector('.loading-spinner');
        const spinner2 = result2Element.querySelector('.loading-spinner');
        const resultData1 = result1Element.querySelector('.result-data');
        const resultData2 = result2Element.querySelector('.result-data');
        
        spinner1.style.display = 'block';
        spinner2.style.display = 'block';
        resultData1.textContent = '';
        resultData2.textContent = '';
        
        // Disable run button during test
        runTestBtn.disabled = true;
        runTestBtn.textContent = 'Procesare...';
        
        // Function to run OCR on an image
        function processImage(imageId, resultElement, expectedValue) {
            const img = document.getElementById(imageId);
            if (!img || !img.src) return;
            
            // Convert image to base64
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
            
            // Send OCR request
            fetch('/api/glycemic-ocr/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64Image
                })
            })
            .then(response => response.json())
            .then(data => {
                const spinner = resultElement.querySelector('.loading-spinner');
                const resultData = resultElement.querySelector('.result-data');
                
                spinner.style.display = 'none';
                
                // Check if the OCR was successful
                if (data.success) {
                    const isCorrect = parseInt(data.value) === expectedValue;
                    const resultClass = isCorrect ? 'result-success' : 'result-failure';
                    
                    resultData.innerHTML = `
                        <div class="${resultClass}">
                            Valoare detectată: ${data.value} ${isCorrect ? '✓' : '✗'}
                        </div>
                        <div>Valoare așteptată: ${expectedValue}</div>
                        <div>Încredere: ${(data.confidence * 100).toFixed(1)}%</div>
                        <div>Timp de procesare: ${data.processingTime ? data.processingTime.toFixed(3) + 's' : 'N/A'}</div>
                    `;
                    
                    // Show the enhanced image if available
                    if (data.enhancedImage) {
                        const enhancedImg = document.createElement('img');
                        enhancedImg.src = data.enhancedImage;
                        enhancedImg.style.maxWidth = '100%';
                        enhancedImg.style.maxHeight = '150px';
                        enhancedImg.style.borderRadius = '4px';
                        enhancedImg.style.marginTop = '10px';
                        enhancedImg.style.border = '1px solid #555';
                        resultData.appendChild(enhancedImg);
                    }
                } else {
                    resultData.innerHTML = `
                        <div class="result-failure">
                            Eroare: ${data.error || 'Eroare necunoscută'}
                        </div>
                    `;
                }
            })
            .catch(error => {
                const spinner = resultElement.querySelector('.loading-spinner');
                const resultData = resultElement.querySelector('.result-data');
                
                spinner.style.display = 'none';
                resultData.innerHTML = `
                    <div class="result-failure">
                        Eroare de procesare: ${error.message}
                    </div>
                `;
            });
        }
        
        // Process both test images
        processImage('test-image-1', result1Element, 107);
        processImage('test-image-2', result2Element, 93);
        
        // Re-enable the run button after both tests should be complete
        setTimeout(() => {
            runTestBtn.disabled = false;
            runTestBtn.textContent = 'Rulează testele din nou';
            statusElement.textContent = 'Testele au fost finalizate';
        }, 5000);
    }
});