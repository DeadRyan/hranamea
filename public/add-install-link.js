/**
 * Direct Install Link Script
 * This script adds a direct link to the installation page in the footer
 * without modifying the original HTML
 */

// Run when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Adding direct install link to footer');
  
  // Find the footer element
  const footer = document.querySelector('footer');
  
  if (footer) {
    console.log('Footer found, adding install link');
    
    // Find the existing link to add after
    const existingLink = footer.querySelector('a.terms-link');
    
    // Create the install link
    const installLink = document.createElement('a');
    installLink.href = 'instaleaza-app.html';
    installLink.textContent = 'Instalează Aplicația';
    installLink.style.color = '#db23e8';
    installLink.style.textDecoration = 'none';
    installLink.style.marginLeft = '10px';
    
    // Add the link to the footer
    if (existingLink) {
      // Insert after the existing link
      existingLink.insertAdjacentText('afterend', ' | ');
      existingLink.insertAdjacentElement('afterend', installLink);
      console.log('Install link added after terms-link');
    } else {
      // Add at the beginning of the footer
      footer.prepend(installLink);
      footer.prepend(document.createTextNode(' | '));
      console.log('Install link added to beginning of footer');
    }
  } else {
    console.log('Footer not found');
  }
});