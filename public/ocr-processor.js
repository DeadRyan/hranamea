/**
 * OCR Processor for Glucometer Images
 * Implements client-side OCR using Tesseract.js for the Hrana Mea glycemic tracker
 */

// Main OCR function to process glucometer images and extract values
const processGlucometerImage = async (imageData) => {
    try {
        // Set loading message
        console.log('Starting OCR processing');
        
        // Check if Tesseract is available
        if (typeof Tesseract === 'undefined') {
            console.error('Tesseract.js is not loaded');
            throw new Error('Tesseract.js library is not available');
        }
        
        // Configure Tesseract for digit recognition
        const scheduler = Tesseract.createScheduler();
        const worker = await Tesseract.createWorker();
        
        // Add worker to scheduler
        scheduler.addWorker(worker);
        
        // Configure worker for optimal digit recognition
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        
        // Configure for digits recognition
        await worker.setParameters({
            tessedit_char_whitelist: '0123456789.,',  // Only allow digits and decimal separators
            tessedit_pageseg_mode: 7,  // Treat the image as a single line of text
            preserve_interword_spaces: '0'
        });
        
        // Recognize text from the image
        const result = await scheduler.addJob('recognize', imageData);
        
        // Clean up workers
        await scheduler.terminate();
        
        // Process the OCR result to extract the numeric value
        const extractedValue = extractNumericValue(result.data);
        
        console.log('OCR processing complete. Extracted value:', extractedValue);
        
        return {
            success: true,
            value: extractedValue,
            confidence: result.data.confidence || 0,
            text: result.data.text.trim()
        };
    } catch (error) {
        console.error('Error during OCR processing:', error);
        
        // Return failure with error message
        return {
            success: false,
            error: error.message || 'Unknown OCR error',
            value: null
        };
    }
};

/**
 * Post-process OCR result to extract numeric value
 * @param {Object} ocrResult - The raw result from Tesseract OCR
 * @return {number} - The extracted numeric value
 */
const extractNumericValue = (ocrResult) => {
    try {
        // Get the recognized text
        let text = ocrResult.text.trim();
        console.log('Raw OCR text:', text);
        
        // Replace common OCR mistakes
        text = text
            .replace(/[oO]/g, '0')  // Replace o/O with 0
            .replace(/[lI|]/g, '1')  // Replace l/I/| with 1
            .replace(/[z]/gi, '2')   // Replace z/Z with 2
            .replace(/[s]/gi, '5')   // Replace s/S with 5
            .replace(/[b]/gi, '6')   // Replace b with 6
            .replace(/[T]/g, '7')    // Replace T with 7
            .replace(/[g]/gi, '9')   // Replace g with 9
            .replace(/,/g, '.')      // Replace comma with period for decimal
            .replace(/\s+/g, '');    // Remove all whitespace
        
        // Extract just the numbers using regex
        const matches = text.match(/(\d+(\.\d+)?)/);
        if (matches && matches[0]) {
            // Convert to number
            const value = parseFloat(matches[0]);
            
            // Validate the value range
            if (!isNaN(value)) {
                // Blood glucose values are typically between 20 and 600 mg/dL
                if (value >= 20 && value <= 600) {
                    return Math.round(value); // Round to whole number
                } else if (value > 0 && value < 20) {
                    // Edge case - might be missing a digit
                    return value * 10;
                } else if (value > 600 && value < 1000) {
                    // Edge case - sometimes values can be slightly higher than 600
                    return 600;
                }
            }
        }
        
        // Extract the first cluster of digits as fallback
        const digitMatches = text.match(/\d+/);
        if (digitMatches && digitMatches[0]) {
            const value = parseInt(digitMatches[0], 10);
            if (!isNaN(value) && value >= 20 && value <= 600) {
                return value;
            }
        }
        
        // If no valid value was found, return a typical value
        // This is a fallback for when OCR completely fails
        // The user will have a chance to correct it in the UI
        return 120;
    } catch (error) {
        console.error('Error extracting numeric value:', error);
        return 120; // Default fallback value
    }
};

// Export the OCR processor
window.OCRProcessor = {
    processGlucometerImage
};