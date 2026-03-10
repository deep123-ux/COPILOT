const params = new URLSearchParams(window.location.search);
const botId = params.get("id");
const bots = JSON.parse(localStorage.getItem("bots")) || [];
const bot = bots.find(b => b.id == botId);

document.getElementById("botTitle").innerText = bot.name;
document.getElementById("botScenario").innerText = bot.scenario;
document.getElementById("botAvatar").src = bot.image;

function addMessage(content, isUser = false) {
    const chatBox = document.getElementById("chatBox");
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;

    const avatar = document.createElement("img");
    avatar.className = "message-avatar";
    avatar.src = isUser ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MzY2ZjEiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTggMjAgMjAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=" : bot.image;

    const messageContent = document.createElement("div");
    messageContent.className = "message-content";
    messageContent.innerText = content;

    if (isUser) {
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(avatar);
    } else {
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById("userMessage");
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, true);
    input.value = "";

    // Show typing indicator
    const typingIndicator = document.getElementById("typingIndicator");
    typingIndicator.style.display = "flex";

    try {
        const reply = await askGemini(bot.scenario, bot.metadata, message);
        typingIndicator.style.display = "none";
        addMessage(reply, false);
    } catch (error) {
        typingIndicator.style.display = "none";
        addMessage("Sorry, I encountered an error. Please try again.", false);
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// Add welcome message
addMessage(`Hello! I'm ${bot.name}. How can I help you with ${bot.scenario.toLowerCase()}?`, false);