// Chatbot Configuration
const CHATBOT_CONFIG = {
    dataUrl: 'chatbot-data.json',
    typingDelay: 800, // ms before bot responds
    suggestedQuestions: [
        "Tell me about your experience",
        "What are your main skills?",
        "What projects have you worked on?",
        "How can I contact you?"
    ]
};

// Chatbot Data
let chatbotData = null;

// DOM Elements
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');
const typingIndicator = document.getElementById('typing-indicator');

// Initialize Chatbot
async function initChatbot() {
    try {
        const response = await fetch(CHATBOT_CONFIG.dataUrl);
        chatbotData = await response.json();
        
        // Add greeting message
        addBotMessage(chatbotData.greeting);
        addSuggestedQuestions();
    } catch (error) {
        console.error('Failed to load chatbot data:', error);
        addBotMessage("Sorry, I'm having trouble loading my knowledge base. Please try refreshing the page.");
    }
}

// Toggle Chatbot
chatbotToggle.addEventListener('click', () => {
    chatbotContainer.classList.toggle('active');
    chatbotToggle.classList.toggle('active');
    
    if (chatbotContainer.classList.contains('active')) {
        chatbotInput.focus();
    }
});

chatbotClose.addEventListener('click', () => {
    chatbotContainer.classList.remove('active');
    chatbotToggle.classList.remove('active');
});

// Send Message
chatbotSend.addEventListener('click', sendMessage);
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = chatbotInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addUserMessage(message);
    chatbotInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Get bot response
    setTimeout(() => {
        hideTypingIndicator();
        const response = getBotResponse(message);
        addBotMessage(response);
    }, CHATBOT_CONFIG.typingDelay);
}

// Add Messages
function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    messageDiv.innerHTML = `
        <div class="message-avatar">👤</div>
        <div class="message-bubble">${escapeHtml(text)}</div>
    `;
    chatbotMessages.appendChild(messageDiv);
    scrollToBottom();
}

function addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <img src="files/image1.png" alt="Akhilesh" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
        </div>
        <div class="message-bubble">${escapeHtml(text)}</div>
    `;
    chatbotMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Typing Indicator
function showTypingIndicator() {
    typingIndicator.classList.add('active');
    scrollToBottom();
}

function hideTypingIndicator() {
    typingIndicator.classList.remove('active');
}

// Get Bot Response
function getBotResponse(userMessage) {
    if (!chatbotData) {
        return "I'm still learning. Please wait a moment.";
    }
    
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Search for matching Q&A
    for (const qa of chatbotData.qaPairs) {
        for (const keyword of qa.keywords) {
            if (lowercaseMessage.includes(keyword.toLowerCase())) {
                return qa.answer;
            }
        }
    }
    
    // No match found
    return chatbotData.fallback;
}

// Suggested Questions
function addSuggestedQuestions() {
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'message bot';
    
    let html = `
        <div class="message-avatar">
            <img src="files/image1.png" alt="Akhilesh" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
        </div>
        <div class="message-bubble">
            <div style="margin-bottom: 0.5rem; font-weight: 500;">Try asking:</div>
            <div class="suggested-questions">
    `;
    
    CHATBOT_CONFIG.suggestedQuestions.forEach(question => {
        html += `<div class="suggestion-chip" onclick="askQuestion('${escapeHtml(question)}')">${escapeHtml(question)}</div>`;
    });
    
    html += `
            </div>
        </div>
    `;
    
    suggestionsDiv.innerHTML = html;
    chatbotMessages.appendChild(suggestionsDiv);
    scrollToBottom();
}

// Ask Suggested Question
function askQuestion(question) {
    chatbotInput.value = question;
    sendMessage();
}

// Utility Functions
function scrollToBottom() {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initChatbot);
