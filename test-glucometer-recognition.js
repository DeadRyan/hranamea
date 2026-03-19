/**
 * Test script for evaluating glucometer LCD recognition
 * This script helps train and test the lcd-segment-recognition module
 * on specific glucometer images
 */

const fs = require('fs');
const path = require('path');
const lcdSegmentRecognition = require('./lcd-segment-recognition');

// Path to test images
const TEST_IMAGES_DIR = path.join(__dirname, 'uploads', 'test-glucometers');

// Function to process a single image
async function processImage(imagePath, expectedValue) {
  console.log(`\n=== Testing image: ${path.basename(imagePath)} ===`);
  console.log(`Expected value: ${expectedValue}`);
  
  try {
    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Process using our LCD recognition
    const startTime = process.hrtime();
    const result = await lcdSegmentRecognition.processGlucometerImage(imageBuffer);
    const hrTime = process.hrtime(startTime);
    const processingTime = hrTime[0] + hrTime[1] / 1000000000;
    
    // Log results
    console.log(`Detected value: ${result.value}`);
    console.log(`Confidence: ${result.confidence.toFixed(2)}`);
    console.log(`Processing time: ${processingTime.toFixed(3)}s`);
    console.log(`Success: ${result.value == expectedValue ? 'YES ✓' : 'NO ✗'}`);
    
    if (result.value != expectedValue) {
      console.log('Digit positions:', result.digitPositions);
    }
    
    return {
      imagePath,
      expectedValue,
      detectedValue: result.value,
      confidence: result.confidence,
      success: result.value == expectedValue,
      processingTime
    };
  } catch (error) {
    console.error(`Error processing ${path.basename(imagePath)}:`, error.message);
    return {
      imagePath,
      expectedValue,
      error: error.message,
      success: false
    };
  }
}

// Main function to run tests
async function runTests() {
  // Test cases - image filename and expected value
  const testCases = [
    { image: 'glucometer1.jpg', expectedValue: 107 },
    { image: 'glucometer2.jpg', expectedValue: 93 },
  ];
  
  console.log(`LCD Recognition Module Version: ${lcdSegmentRecognition.version}`);
  console.log(`Testing ${testCases.length} images from ${TEST_IMAGES_DIR}\n`);
  
  const results = [];
  
  // Process each test case
  for (const testCase of testCases) {
    const imagePath = path.join(TEST_IMAGES_DIR, testCase.image);
    
    // Check if image exists
    if (!fs.existsSync(imagePath)) {
      console.error(`Image does not exist: ${imagePath}`);
      continue;
    }
    
    const result = await processImage(imagePath, testCase.expectedValue);
    results.push(result);
  }
  
  // Output summary
  console.log('\n=== Summary ===');
  const successCount = results.filter(r => r.success).length;
  console.log(`Success rate: ${successCount}/${results.length} (${(successCount/results.length*100).toFixed(0)}%)`);
}

// Run tests
runTests().catch(err => {
  console.error('Test execution error:', err);
});