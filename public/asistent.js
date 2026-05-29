document.addEventListener('DOMContentLoaded', function() {
    // Get references to elements
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const fileInput = document.getElementById('file-input');
    const btnPhoto = document.getElementById('btn-photo');
    const btnData = document.getElementById('btn-data');
    const btnGoal = document.getElementById('btn-goal');
    
    // User management (client-side only)
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user_' + Date.now();
        localStorage.setItem('userId', userId);
    }
    
    // Conversation management
    let conversationId = null;
    const messageQueue = [];
    let isProcessingQueue = false;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000; // ms
    
    // Initialize conversation
    initializeConversation();
    
    // Add event listeners with passive option
    sendBtn.addEventListener('click', sendMessage, { passive: false });
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }, { passive: true });
    
    fileInput.addEventListener('change', handleFileUpload, { passive: true });
    
    // Add multiple event listeners for cross-browser compatibility
    function addMultipleListeners(element, events, handler) {
        if (!element) return;
        events.forEach(event => {
            element.addEventListener(event, handler, { passive: false });
        });
    }
    
    addMultipleListeners(btnPhoto, ['click', 'touchend'], function(e) {
        e.preventDefault();
        promptPhotoUpload(e);
        return false;
    });
    
    addMultipleListeners(btnData, ['click', 'touchend'], function(e) {
        e.preventDefault();
        promptForData(e);
        return false;
    });
    
    addMultipleListeners(btnGoal, ['click', 'touchend'], function(e) {
        e.preventDefault();
        promptForGoal(e);
        return false;
    });

    // Prevent ghost clicks on mobile
    document.addEventListener('touchend', function(e) {
        if (!e.target.closest('input, select')) {
            const now = Date.now();
            const DOUBLE_TAP_THRESHOLD = 300;
            const lastTouch = window.lastTouch || now + 1;
            const delta = now - lastTouch;
            
            if (delta < DOUBLE_TAP_THRESHOLD && delta > 0) {
                e.preventDefault();
                return false;
            }
            window.lastTouch = now;
        }
    }, false);
    
    // Fallback responses
    const fallbackResponses = {
        general: [
            "Bună! Gestionarea diabetului e ca o plimbare în parc – uneori mai complicată, dar mereu mai ușoară cu un prieten alături. 😊 Ce te preocupă astăzi? Poate o rețetă cu mămăligă sau o întrebare despre glicemie?",
            "Știai că o plimbare de 30 de minute pe zi poate face minuni pentru glicemia ta? 😅 Hai să povestim – ce mai faci ca să te simți bine? Îți place să gătești ceva românesc sau preferi altceva?",
            "Diabetul e o provocare, dar tu ești mai tare decât crezi! 😊 Ce zici, vorbim despre ce mănânci de obicei sau despre altceva care te stresează?"
        ],
        error: "Hopa, se pare că serverul e un pic ocupat! 😅 Nu-ți face griji, mesajul tău e în siguranță. Hai să încercăm din nou în câteva secunde. Ce voiai să discutăm între timp?",
        rateLimit: "Wow, se pare că suntem super populari astăzi! 😊 Mesajul tău e în așteptare și o să-l procesăm imediat ce putem. Până atunci, ce mai faci ca să-ți ții glicemia sub control?"
    };
    
    // System prompt
    function getSystemPrompt(userProfile) {
        const profile = userProfile || {};
        const diabetesType = profile.diabetesType || 'necunoscut';
        const bmi = profile.height && profile.weight ? 
            (profile.weight / Math.pow(profile.height/100, 2)).toFixed(1) : 'necunoscut';
        const goal = profile.goal || 'managementul general al diabetului';
        
        return `
Ești un asistent virtual pentru persoanele cu diabet, vorbind exclusiv în română cu un ton cald, prietenos și conversațional, ca un bun prieten care te ascultă și te încurajează. Scopul tău e să creezi o experiență relaxantă și captivantă, mai ales că utilizatorii pot fi stresați sau îngrijorați. Folosește expresii precum „Hai să vorbim despre...”, „Știai că...?” sau „Ce zici de...?” pentru a face conversația vie și reconfortantă. Adaptează-te la cultura românească, recomandând alimente și produse disponibile în România (ex. mămăligă, ciorbă, hrișcă, iaurt Miliția), mărci locale (ex. Dacia Plant, Biofarm) și ținând cont de preferințele culinare românești.

Obiectivele tale:
1. Oferă răspunsuri detaliate și personalizate despre diabet, dietă, exerciții și medicație, folosind unități metrice și scara românească a indicelui glicemic (0-100, aliniată cu standardele europene).
2. Pentru întrebări despre medicamente, oferă informații generale (ex. producător, utilizare comună, proces de fabricație) și fapte interesante (ex. „Știai că metformina a fost descoperită datorită unei plante folosite în medicina tradițională?”), dar subliniază că utilizatorul trebuie să urmeze sfatul medicului.
3. Pentru diagnostice, include date statistice (ex. „Aproximativ 11% din români au diabet de tip 2”) și detalii captivante, fără a contesta diagnosticul medicului.
4. Include fapte despre alimente fără gluten (ex. procesul de producție al făinii de hrișcă) și alternative sănătoase disponibile în România (ex. quinoa, năut).
5. Propune planuri săptămânale sau lunare pentru dietă, exerciții și monitorizarea glicemiei, adaptate preferințelor utilizatorului.
6. Pune 1-2 întrebări deschise pentru a menține conversația (ex. „Îți place să gătești rețete tradiționale românești?” sau „Ce mai faci ca să te relaxezi?”).

Informații utilizator:
- Tip diabet: ${diabetesType}
- IMC: ${bmi}
- Scop: ${goal}
- Detalii: ${JSON.stringify(profile)}

Instrucțiuni:
- Evită termeni medicali complicați sau explică-i simplu.
- Nu oferi sfaturi medicale directe; recomandă consultarea medicului.
- Încurajează utilizatorul cu mesaje pozitive (ex. „Ești pe drumul cel bun!”).
- Dacă utilizatorul e nesigur, sugerează stabilirea unui obiectiv clar și oferă exemple practice.

Exemplu de răspuns:
„Bună! Gestionarea diabetului poate fi ca o rețetă nouă – la început pare complicată, dar cu puțină practică, o să-ți iasă perfect! 😊 Hai să vorbim despre ce mănânci de obicei. De exemplu, o ciorbă de legume cu hrișcă e grozavă pentru glicemie. Știai că hrișca e cultivată și în România, mai ales în Maramureș? Aș putea să-ți fac un meniu săptămânal cu rețete românești. Ce fel de mâncare îți place cel mai mult? Ai timp să gătești acasă?”
        `;
    }
    
    // Initialize conversation
    function initializeConversation() {
        // First, try to load profile from server (if user is authenticated)
        fetch('/api/ai/profile')
            .then(response => {
                if (!response.ok) return null; // not authenticated, skip
                return response.json();
            })
            .then(data => {
                if (data && data.profile) {
                    // Merge server profile into localStorage
                    const localProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                    const serverProfile = {
                        height: data.profile.height,
                        weight: data.profile.weight,
                        age: data.profile.age,
                        diabetesType: data.profile.diabetesType,
                        dietPreferences: data.profile.dietPreferences,
                        healthGoals: data.profile.healthGoals,
                        allergies: data.profile.allergies
                    };
                    // Server data takes precedence, but keep any local-only fields
                    const merged = { ...localProfile, ...serverProfile };
                    localStorage.setItem('userProfile', JSON.stringify(merged));
                    console.log("Profile loaded from server and merged:", merged);
                }
            })
            .catch(err => console.log('Could not load server profile (may not be logged in):', err.message))
            .finally(() => {
                // Always proceed with conversation init after profile attempt
                startConversation();
            });
    }
    
    function startConversation() {
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        console.log("Loaded user profile:", userProfile);
        
        fetchWithRetry('/api/ai/conversation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                systemPrompt: getSystemPrompt(userProfile)
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Conversation created:", data);
            conversationId = data.conversationId;
            
            // Clear previous messages if any
            while (chatMessages.firstChild) {
                chatMessages.removeChild(chatMessages.firstChild);
            }
            
            // Add welcome message with action buttons
            addMessageToChat("Bună! Sunt asistentul tău virtual și sunt aici ca să te ajut cu tot ce ține de diabet. Putem să vorbim despre ce mănânci, despre medicamente pentru diabet sau pur și simplu poate vrei sa afli noutati in domeniu?", "ai");
            processMessageQueue();
        })
        .catch(error => {
            console.error('Error creating conversation:', error);
            
            // Clear previous messages if any
            while (chatMessages.firstChild) {
                chatMessages.removeChild(chatMessages.firstChild);
            }
            
            // Add error message with action buttons
            addMessageToChat("Bună! Se pare că am avut o mică pană de curent, dar sunt aici pentru tine! Putem să vorbim despre ce mănânci, despre medicamente pentru diabet sau poate vrei sa afli noutati in domeniu?", "ai");
        });
    }
    
    // Add event listener to send button
    addMultipleListeners(sendBtn, ['click', 'touchend'], function(e) {
        e.preventDefault();
        sendMessage();
        return false;
    });
    
    // Function to send a message to the AI
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;
        
        addMessageToChat(message, 'user');
        chatInput.value = '';
        showTypingIndicator();
        
        messageQueue.push({ type: 'text', content: message, retries: 0 });
        processMessageQueue();
    }
    
    // Function to fetch with retry logic
    async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    if (response.status === 429) { // Rate limit
                        throw new Error('RateLimit');
                    }
                    throw new Error('Network response was not ok');
                }
                return response;
            } catch (error) {
                if (error.message === 'RateLimit' || i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)));
                    continue;
                }
                throw error;
            }
        }
    }
    
    // Process message queue
    async function processMessageQueue() {
        if (isProcessingQueue || messageQueue.length === 0) return;
        
        isProcessingQueue = true;
        const messageItem = messageQueue[0];
        
        try {
            if (!conversationId) {
                const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                const response = await fetchWithRetry('/api/ai/conversation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        userId: userId,
                        systemPrompt: getSystemPrompt(userProfile)
                    })
                });
                const data = await response.json();
                conversationId = data.conversationId;
            }
            
            if (messageItem.type === 'text') {
                await sendMessageToAI(messageItem.content, messageItem.retries);
            } else if (messageItem.type === 'image') {
                await uploadImageForAnalysis(messageItem.content, messageItem.retries);
            }
            
            messageQueue.shift();
        } catch (error) {
            console.error('Error processing queue item:', error);
            messageItem.retries++;
            if (messageItem.retries >= MAX_RETRIES) {
                hideTypingIndicator();
                addMessageToChat(error.message === 'RateLimit' ? fallbackResponses.rateLimit : fallbackResponses.error, 'ai');
                messageQueue.shift();
            }
        } finally {
            isProcessingQueue = false;
            if (messageQueue.length > 0) {
                processMessageQueue();
            } else {
                hideTypingIndicator();
            }
        }
    }
    
    // Function to send the message to the AI API
    async function sendMessageToAI(message, retries = 0) {
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        
        try {
            const response = await fetchWithRetry('/api/ai/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    conversationId: conversationId,
                    systemPrompt: getSystemPrompt(userProfile)
                })
            });
            const data = await response.json();
            addMessageToChat(data.response, 'ai');
        } catch (error) {
            throw error;
        }
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        if (document.getElementById('typing-indicator')) return;
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'ai-message', 'typing-indicator');
        typingIndicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        typingIndicator.id = 'typing-indicator';
        chatMessages.appendChild(typingIndicator);
        scrollChatToBottom();
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Function to add a message to the chat
    function addMessageToChat(message, sender) {
        console.log("Adding message to chat:", sender, message.substring(0, 30) + "...");
        
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
        
        // Create message content container
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        
        if (message.includes('\n')) {
            const formattedMessage = message.split('\n').map(line => {
                if (/^\d+[\.\)\:]/.test(line.trim())) {
                    return `<li>${line.trim()}</li>`;
                } else if (line.trim() === '') {
                    return '<br>';
                } else {
                    return `<p>${line.trim()}</p>`;
                }
            }).join('');
            
            if (formattedMessage.includes('<li>')) {
                messageContent.innerHTML = formattedMessage.replace(/<li>/g, '<ul><li>').replace(/<\/li>/g, '</li></ul>');
                messageContent.innerHTML = messageContent.innerHTML.replace(/<\/ul><ul>/g, '');
            } else {
                messageContent.innerHTML = formattedMessage;
            }
        } else {
            messageContent.textContent = message;
        }
        
        messageElement.appendChild(messageContent);
        
        // Add action buttons for AI messages
        if (sender === 'ai') {
            console.log("Adding action buttons to AI message");
            
            const actionButtons = document.createElement('div');
            actionButtons.classList.add('message-actions');
            actionButtons.innerHTML = `
                <button class="action-like" title="Apreciez răspunsul">👍 Like</button>
                <button class="action-save" title="Salvează răspunsul">💾 Salvează Local</button>
            `;
            messageElement.appendChild(actionButtons);
            
            // Add event listeners to the buttons
            const likeButton = actionButtons.querySelector('.action-like');
            const saveButton = actionButtons.querySelector('.action-save');
            
            if (likeButton) {
                likeButton.addEventListener('click', function() {
                    likeFeedback(message);
                    this.classList.add('liked');
                    this.innerHTML = '👍 Apreciat';
                    this.disabled = true;
                });
            }
            
            if (saveButton) {
                saveButton.addEventListener('click', function() {
                    saveMessageLocally(message);
                });
            }
        }
        
        chatMessages.appendChild(messageElement);
        scrollChatToBottom();
    }
    
    // Function to send like feedback to server
    function likeFeedback(message) {
        if (!conversationId) return;
        
        console.log('Sending like feedback for message');
        
        fetch('/api/ai/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversationId: conversationId,
                message: message,
                rating: 'positive',
                userId: userId
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Feedback sent successfully:', data);
        })
        .catch(error => {
            console.error('Error sending feedback:', error);
        });
    }
    
    // Function to save message locally
    function saveMessageLocally(message) {
        try {
            // Create a filename with date and time
            const now = new Date();
            const dateStr = now.toLocaleDateString('ro-RO').replace(/\//g, '-');
            const timeStr = now.toLocaleTimeString('ro-RO').replace(/:/g, '-');
            const fileName = `Sfat_Diabet_${dateStr}_${timeStr}`;
            
            // Format the content with header and footer
            const content = `SFAT PENTRU DIABET
------------------------------------------
Data: ${now.toLocaleDateString('ro-RO')} ${now.toLocaleTimeString('ro-RO')}

${message}

------------------------------------------
Generat de: Asistentul Virtual Hrana Mea
www.hranamea.ro`;
            
            // Create a download link
            const BOM = '\uFEFF'; // UTF-8 BOM for Windows compatibility
            const blob = new Blob([BOM + content], {type: 'text/plain;charset=UTF-8'});
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `${fileName}.txt`;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
                URL.revokeObjectURL(url);
                document.body.removeChild(link);
                alert('Răspunsul a fost salvat pe dispozitivul tău!');
            }, 100);
        } catch (error) {
            console.error('Error saving message:', error);
            alert('Nu am putut salva răspunsul. Încearcă să copiezi textul manual.');
        }
    }
    
    // Function to handle photo button click
    function promptPhotoUpload() {
        addMessageToChat("Hai să aruncăm o privire la ce mănânci sau ce medicament folosești! 😊 Te rog să încarci o poză cu mâncarea sau eticheta medicamentului.", "ai");
        
        setTimeout(() => {
            fileInput.click();
        }, 500);
    }
    
    // Function to handle file upload
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
            addMessageToChat("Ups, te rog să încarci doar imagini JPEG sau PNG, ca să pot analiza mai bine! 😅", "ai");
            return;
        }
        
        // First check authentication status
        fetch('/api/auth/status')
            .then(response => response.json())
            .then(data => {
                if (data.isLoggedIn && data.user && data.user.hasFullAccess) {
                    // User is logged in and has full access
                    addMessageToChat(`Grozav, am primit poza: ${file.name}!`, "user");
                    showTypingIndicator();
                    
                    messageQueue.push({ type: 'image', content: file, retries: 0 });
                    processMessageQueue();
                } else if (data.isLoggedIn) {
                    // User is logged in but doesn't have full access
                    addMessageToChat(`Pentru a putea analiza imagini, este necesară activarea abonamentului. Contul tău are acces doar la conversațiile text. Te rog să continui cu întrebări text despre diabet și nutriție.`, "ai");
                } else {
                    // User is not logged in
                    addMessageToChat(`Pentru a putea analiza imagini, trebuie să te autentifici. Utilizatorii înregistrați au acces la această funcție. Te rog să te autentifici și să încerci din nou.`, "ai");
                }
            })
            .catch(error => {
                console.error('Error checking auth status:', error);
                addMessageToChat(`Nu pot procesa această imagine momentan. Te rog să încerci din nou mai târziu.`, "ai");
            });
        
        fileInput.value = '';
    }
    
    // Function to upload image for AI analysis
    async function uploadImageForAnalysis(file, retries = 0) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('conversationId', conversationId);
        formData.append('prompt', 'Analizează această imagine cu mâncare sau eticheta unui medicament. Pentru mâncare, estimează conținutul nutrițional (calorii, proteine, carbohidrați, grăsimi) și sugerează dacă e potrivită pentru o dietă de diabet, recomandând alternative românești (ex. hrișcă, legume locale). Pentru medicamente, oferă detalii generale (ex. producător, utilizare) și fapte interesante (ex. „Știai că acest medicament e produs de Biofarm în București?”), dar subliniază consultarea medicului. Pune 1-2 întrebări (ex. „E o masă obișnuită pentru tine?” sau „De cât timp folosești acest medicament?”).');
        
        try {
            const response = await fetchWithRetry('/api/ai/analyze-image', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            addMessageToChat(data.response, 'ai');
        } catch (error) {
            throw error;
        }
    }
    
    // Function to handle data button click
    function promptForData() {
        addMessageToChat("Hai să aflăm mai multe despre tine ca să te pot ajuta și mai bine! 😊 Te rog să completezi câteva date de bază:", "ai");
        
        setTimeout(() => {
            const formElement = document.createElement('div');
            formElement.classList.add('message', 'ai-message', 'form-container');
            formElement.innerHTML = `
                <style>
                    .form-container {
                        padding: 15px;
                        background-color: #333;
                        border-radius: 10px;
                    }
                    .input-group {
                        margin-bottom: 12px;
                    }
                    .input-group label {
                        display: block;
                        margin-bottom: 5px;
                        font-weight: bold;
                    }
                    .input-group input, .input-group select {
                        width: 100%;
                        padding: 8px;
                        border-radius: 5px;
                        border: 1px solid #555;
                        background-color: #222;
                        color: white;
                    }
                    .form-submit {
                        background-color: #db23e8;
                        color: white;
                        border: none;
                        padding: 10px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                        width: 100%;
                        margin-top: 10px;
                    }
                    .form-submit:hover {
                        background-color: #c31fcb;
                    }
                </style>
                <div class="input-group">
                    <label for="height">Înălțime (cm)</label>
                    <input type="number" id="height" min="100" max="250" placeholder="175">
                </div>
                <div class="input-group">
                    <label for="weight">Greutate (kg)</label>
                    <input type="number" id="weight" min="30" max="250" placeholder="70">
                </div>
                <div class="input-group">
                    <label for="age">Vârstă (ani)</label>
                    <input type="number" id="age" min="18" max="120" placeholder="45">
                </div>
                <div class="input-group">
                    <label for="diabetes-type">Tip diabet</label>
                    <select id="diabetes-type">
                        <option value="Type 1">Tip 1</option>
                        <option value="Type 2" selected>Tip 2</option>
                        <option value="Gestational">Gestațional</option>
                        <option value="Other">Altul</option>
                        <option value="None">Nu am diabet încă, doar verificare</option>
                    </select>
                </div>
                <button id="submit-data" class="form-submit" type="button">Salvează datele</button>
            `;
            
            chatMessages.appendChild(formElement);
            scrollChatToBottom();
            
            // Use direct onclick + addEventListener for maximum compatibility
            const submitBtn = document.getElementById('submit-data');
            console.log("Submit button found:", !!submitBtn);
            
            if (!submitBtn) {
                console.error("CRITICAL: submit-data button not found in DOM!");
                return;
            }
            
            // Direct onclick as primary (most reliable)
            submitBtn.onclick = function(e) {
                e.preventDefault();
                console.log("Save button clicked via onclick");
                submitProfileData();
                return false;
            };
            
            // Also add event listener as backup
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("Save button clicked via addEventListener");
                submitProfileData();
                return false;
            });
            
            function submitProfileData() {
                console.log("submitProfileData called");
                const height = document.getElementById('height').value;
                const weight = document.getElementById('weight').value;
                const age = document.getElementById('age').value;
                const diabetesType = document.getElementById('diabetes-type').value;
                console.log("Form values:", { height, weight, age, diabetesType });
                
                if (!height || !weight || !age) {
                    alert('Vă rugăm completați toate câmpurile.');
                    return;
                }
                
                formElement.remove();
                addMessageToChat(`Am înălțimea ${height} cm, greutatea ${weight} kg, vârsta ${age} ani, diabet ${diabetesType}.`, 'user');
                showTypingIndicator();
                
                try {
                    const userData = {
                        height: parseFloat(height),
                        weight: parseFloat(weight),
                        age: parseInt(age),
                        diabetesType: diabetesType,
                        lastUpdated: new Date().toISOString()
                    };
                    
                    let userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                    userProfile = {...userProfile, ...userData};
                    localStorage.setItem('userProfile', JSON.stringify(userProfile));
                    console.log("Profile saved locally:", userProfile);
                    
                    // Send to server — session cookie handles authentication, no userId needed
                    fetch('/api/ai/update-profile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            dietPreferences: userProfile.dietPreferences || '',
                            healthGoals: userProfile.healthGoals || '',
                            allergies: userProfile.allergies || '',
                            userData: JSON.stringify(userData)
                        })
                    })
                    .then(r => {
                        if (!r.ok) {
                            if (r.status === 401) {
                                throw new Error('NOT_LOGGED_IN');
                            }
                            throw new Error('Server error: ' + r.status);
                        }
                        return r.json();
                    })
                    .then(data => {
                        console.log("Profile saved to server:", data);
                        // Show confirmation to user
                        const confirmMsg = document.createElement('div');
                        confirmMsg.classList.add('message', 'ai-message');
                        confirmMsg.style.cssText = 'background:#2d4a2d; border-left: 3px solid #4caf50; padding:10px; border-radius:8px;';
                        confirmMsg.textContent = '✅ Datele tale au fost salvate în baza de date!';
                        chatMessages.appendChild(confirmMsg);
                        scrollChatToBottom();
                    })
                    .catch(error => {
                        console.error('Error updating profile on server:', error);
                        const errMsg = document.createElement('div');
                        errMsg.classList.add('message', 'ai-message');
                        if (error.message === 'NOT_LOGGED_IN') {
                            errMsg.style.cssText = 'background:#4a2d2d; border-left: 3px solid #f44336; padding:10px; border-radius:8px;';
                            errMsg.innerHTML = '⚠️ Trebuie să fii <a href="login.html" style="color:#ff6b6b;">autentificat</a> pentru a salva datele în contul tău. Datele au fost salvate local în acest browser.';
                        } else {
                            errMsg.style.cssText = 'background:#4a3520; border-left: 3px solid #ff9800; padding:10px; border-radius:8px;';
                            errMsg.textContent = '⚠️ Nu s-a putut salva pe server (' + error.message + '). Datele au fost salvate local în acest browser.';
                        }
                        chatMessages.appendChild(errMsg);
                        scrollChatToBottom();
                    });
                } catch (e) {
                    console.error("Error saving profile:", e);
                }
                
                if (conversationId) {
                    const bmi = (parseFloat(weight) / Math.pow(parseFloat(height)/100, 2)).toFixed(1);
                    const dataMessage = `Datele mele: înălțime ${height}cm, greutate ${weight}kg, vârsta ${age} ani, diabet ${diabetesType}. IMC calculat: ${bmi}. Hai să analizăm împreună aceste date și să-ți fac un plan personalizat, poate un meniu săptămânal cu rețete românești sau un program de mișcare. Ce zici? 😊`;
                    messageQueue.push({ type: 'text', content: dataMessage, retries: 0 });
                    processMessageQueue();
                } else {
                    setTimeout(() => {
                        hideTypingIndicator();
                        const bmi = (parseFloat(weight) / Math.pow(parseFloat(height)/100, 2)).toFixed(1);
                        let bmiCategory = "";
                        
                        if (bmi < 18.5) bmiCategory = "subponderal";
                        else if (bmi < 25) bmiCategory = "normal";
                        else if (bmi < 30) bmiCategory = "supraponderal";
                        else bmiCategory = "obezitate";
                        
                        let response = `Am calculat IMC-ul tău: ${bmi}, adică o greutate ${bmiCategory}. 😊\n\n`;
                        
                        if (bmi >= 25) {
                            response += "Se pare că o mică scădere în greutate te-ar putea ajuta să ții glicemia sub control. Știai că o pierdere de doar 5-10% din greutate poate face o diferență mare? Hai să vorbim despre ce mănânci de obicei – poate înlocuim niște pâine albă cu una integrală de la Vel Pitar?\n\n";
                        } else {
                            response += "Greutatea ta e în regulă, ceea ce e super pentru gestionarea diabetului! Hai să ne focusăm pe menținerea asta cu niște rețete gustoase, ca o salată de vinete cu hrișcă. 😋\n\n";
                        }
                        
                        response += "Ce zici de câteva idei pentru un stil de viață sănătos?\n" +
                            "1. Încearcă o ciorbă de legume – e plină de fibre și bună pentru glicemie\n" +
                            "2. O plimbare de 30 de minute pe zi, poate prin parc\n" +
                            "3. Măsoară glicemia așa cum ți-a zis medicul\n" +
                            "4. Ia medicamentele la timp\n" +
                            "5. Mergi la control regulat\n\n" +
                            "Ce mai faci ca să ai grijă de tine? Îți place să gătești sau preferi ceva rapid?";
                        
                        addMessageToChat(response, 'ai');
                    }, 2000);
                }
            } // close submitProfileData function
        }, 500);
    }
    
    // Function to handle goal button click
    function promptForGoal() {
        addMessageToChat("Hai să stabilim un obiectiv care să te motiveze! 😊 Ce ți-ai dori să îmbunătățești legat de diabet?", "ai");
        
        setTimeout(() => {
            const goalOptions = document.createElement('div');
            goalOptions.classList.add('message', 'ai-message', 'goal-options');
            goalOptions.innerHTML = `
                <style>
                    .goal-options {
                        padding: 10px;
                        background-color: #333;
                        border-radius: 10px;
                    }
                    .goal-option {
                        padding: 10px;
                        margin-bottom: 8px;
                        background-color: #444;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: background-color 0.2s;
                    }
                    .goal-option:hover {
                        background-color: #555;
                    }
                    .goal-option:last-child {
                        margin-bottom: 0;
                    }
                </style>
                <div class="goal-option" data-goal="control-glycemic"><a href="glycemic-tracker.html" style="color: white; text-decoration: none; display: block; width: 100%; height: 100%;">Control mai bun al glicemiei</a></div>
                <div class="goal-option" data-goal="weight-loss">Pierdere în greutate</div>
                <div class="goal-option" data-goal="diet">Îmbunătățirea dietei</div>
                <div class="goal-option" data-goal="exercise">Creșterea activității fizice</div>
                <div class="goal-option" data-goal="smoking">Vreau să mă las de fumat</div>
                <div class="goal-option" data-goal="custom">Alt scop (personalizat)</div>
            `;
            
            chatMessages.appendChild(goalOptions);
            scrollChatToBottom();
            
            document.querySelectorAll('.goal-option').forEach(option => {
                addMultipleListeners(option, ['click', 'touchend'], function(e) {
                    // Pentru butonul de control glicemic folosim o abordare dublă de siguranță
                    if (this.getAttribute('data-goal') === 'control-glycemic') {
                        console.log("Butonul Control glicemic a fost apăsat");
                        
                        // Metoda 1: Lansăm redirecționarea manual
                        window.location.href = 'glycemic-tracker.html';
                        
                        // Nu oprim propagarea sau prevenirea comportamentului implicit
                        // pentru a permite și metodei 2 (link direct) să funcționeze dacă prima eșuează
                        return;
                    }
                    
                    // Pentru celelalte butoane, prevenim comportamentul implicit
                    e.preventDefault();
                    
                    const goalType = this.getAttribute('data-goal');
                    let goalText = this.textContent;
                    
                    goalOptions.remove();
                    
                    // Redirect to glycemic tracker for "control-glycemic" option
                    if (goalType === 'control-glycemic') {
                        console.log("Control glicemic button clicked - redirecting to glycemic tracker");
                        
                        // Show message before redirecting
                        addMessageToChat("Te redirecționez către pagina de monitorizare a glicemiei...", "ai");
                        
                        // Redirect after a short delay to allow the message to be displayed
                        setTimeout(() => {
                            // Redirect directly instead of checking login status first
                            // The glycemic-tracker.html page will handle authentication
                            window.location.href = "glycemic-tracker.html";
                        }, 500);
                        return;
                    }
                    
                    if (goalType === 'custom') {
                        chatInput.focus();
                        chatInput.placeholder = "Spune-mi ce obiectiv ai în minte...";
                        addMessageToChat("Super, hai să personalizăm! 😊 Ce obiectiv ai în cap pentru gestionarea diabetului?", "ai");
                        return;
                    }
                    
                    addMessageToChat(`Obiectivul meu este: ${goalText}`, 'user');
                    showTypingIndicator();
                    
                    try {
                        let userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                        userProfile.goal = goalText;
                        userProfile.goalDate = new Date().toISOString();
                        localStorage.setItem('userProfile', JSON.stringify(userProfile));
                        console.log("Goal saved locally:", userProfile);
                        
                        if (conversationId) {
                            fetch('/api/ai/update-profile', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    userId: userId,
                                    dietPreferences: userProfile.dietPreferences || '',
                                    healthGoals: goalText,
                                    allergies: userProfile.allergies || ''
                                })
                            })
                            .catch(error => console.error('Error updating profile:', error));
                        }
                    } catch (e) {
                        console.error("Error saving goal:", e);
                    }
                    
                    if (conversationId) {
                        const goalMessage = `Obiectivul meu principal este: ${goalText}. Hai să facem un plan ca să-l atingem! 😊 Te rog să-mi dai idei concrete și poate un program săptămânal sau lunar, cu rețete sau activități potrivite pentru mine.`;
                        messageQueue.push({ type: 'text', content: goalMessage, retries: 0 });
                        processMessageQueue();
                    } else {
                        setTimeout(() => {
                            hideTypingIndicator();
                            let response = `Wow, ce obiectiv fain: ${goalText}! 😊 E un pas mare spre un stil de viață mai sănătos. Hai să-l facem să se întâmple cu pași mici:\n\n` +
                                "1. Stabilește ținte clare – de ex., „o să mănânc mai multe legume”\n" +
                                "2. Începe cu schimbări mici, ca o plimbare zilnică\n" +
                                "3. Urmărește progresul – poate cu un jurnal\n" +
                                "4. Bucură-te de fiecare reușită!\n" +
                                "5. Vorbește cu medicul să te asiguri că e ok\n\n" +
                                "Ce zici, vrei un plan cu rețete românești sau idei de mișcare? Ce-ți place să faci în timpul liber?";
                            
                            addMessageToChat(response, 'ai');
                        }, 2000);
                    }
                });
            });
        }, 500);
    }
    
    // Add CSS for typing indicator and message actions
    const style = document.createElement('style');
    style.textContent = `
        .typing-indicator {
            padding: 10px 15px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }
        
        .typing-indicator .dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: white;
            margin-right: 4px;
            animation: typing-bounce 1.4s infinite ease-in-out both;
        }
        
        .typing-indicator .dot:nth-child(1) {
            animation-delay: 0s;
        }
        
        .typing-indicator .dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-indicator .dot:nth-child(3) {
            animation-delay: 0.4s;
            margin-right: 0;
        }
        
        @keyframes typing-bounce {
            0%, 80%, 100% { transform: scale(0.6); }
            40% { transform: scale(1); }
        }
        
        /* Message actions styling */
        .message-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 8px;
            padding-top: 5px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .message-actions button {
            background-color: #444;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
        }
        
        .message-actions button:hover {
            background-color: #555;
        }
        
        .message-actions .action-like.liked {
            background-color: #2a6b34;
        }
        
        .message-content {
            margin-bottom: 5px;
        }
    `;
    document.head.appendChild(style);
    
    // Touch handling improvements
    document.addEventListener('touchmove', function(e) {
        if (!e.target.closest('.chat-messages')) {
            if (document.body.scrollTop === 0 && e.touches[0].screenY > 0) {
                e.preventDefault();
            }
        }
    }, { passive: false });
    
    // Improved mobile scrolling
    const chatMessagesEl = document.querySelector('.chat-messages');
    
    function improveScrolling() {
        if (chatMessagesEl) {
            chatMessagesEl.style.webkitOverflowScrolling = 'touch';
            
            chatMessagesEl.addEventListener('touchmove', function(e) {
                const isAtTop = chatMessagesEl.scrollTop === 0;
                const isAtBottom = chatMessagesEl.scrollHeight - chatMessagesEl.scrollTop === chatMessagesEl.clientHeight;
                
                if ((isAtTop && e.touches[0].clientY > 0) ||
                    (isAtBottom && e.touches[0].clientY < 0)) {
                    e.stopPropagation();
                }
            }, { passive: true });
        }
    }
    
    improveScrolling();
    
    function scrollChatToBottom() {
        if (chatMessagesEl) {
            chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
            setTimeout(() => {
                chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
            }, 100);
        }
    }
    
    function updateViewportHeight() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        scrollChatToBottom();
    }
    
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', function() {
        setTimeout(updateViewportHeight, 200);
    });
    window.addEventListener('pageshow', updateViewportHeight);
    window.addEventListener('load', updateViewportHeight);
    
    updateViewportHeight();
    
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchstart', function(){}, { passive: true });
    
    // Apply action buttons to any existing AI messages
    function addActionButtonsToExistingMessages() {
        console.log("Adding action buttons to existing messages");
        const aiMessages = document.querySelectorAll('.ai-message');
        
        aiMessages.forEach(message => {
            // Skip if it already has action buttons
            if (message.querySelector('.message-actions')) {
                return;
            }
            
            console.log("Adding action buttons to existing message");
            
            // Get the message text
            let messageText = '';
            const messageContent = message.querySelector('.message-content');
            
            if (messageContent) {
                messageText = messageContent.textContent;
            } else {
                // Legacy format - message text is directly in the message element
                messageText = message.textContent;
                
                // Create a content container and move the content there
                const newContent = document.createElement('div');
                newContent.classList.add('message-content');
                newContent.innerHTML = message.innerHTML;
                message.innerHTML = '';
                message.appendChild(newContent);
            }
            
            // Create action buttons
            const actionButtons = document.createElement('div');
            actionButtons.classList.add('message-actions');
            actionButtons.innerHTML = `
                <button class="action-like" title="Apreciez răspunsul">👍 Like</button>
                <button class="action-save" title="Salvează răspunsul">💾 Salvează Local</button>
            `;
            message.appendChild(actionButtons);
            
            // Add event listeners
            const likeButton = actionButtons.querySelector('.action-like');
            const saveButton = actionButtons.querySelector('.action-save');
            
            if (likeButton) {
                likeButton.addEventListener('click', function() {
                    likeFeedback(messageText);
                    this.classList.add('liked');
                    this.innerHTML = '👍 Apreciat';
                    this.disabled = true;
                });
            }
            
            if (saveButton) {
                saveButton.addEventListener('click', function() {
                    saveMessageLocally(messageText);
                });
            }
        });
    }
    
    // Call this after a short delay to make sure DOM is fully loaded
    setTimeout(addActionButtonsToExistingMessages, 1000);
    
    // Refresh action buttons when new content is added
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                // If new nodes were added, check if we need to add action buttons
                setTimeout(addActionButtonsToExistingMessages, 100);
            }
        });
    });
    
    // Start observing the chat container for changes
    if (chatMessages) {
        observer.observe(chatMessages, { childList: true, subtree: true });
    }
});
