/* LOAD EXISTING BOTS */

function loadBots() {
    const bots = JSON.parse(localStorage.getItem("bots")) || [];
    const container = document.getElementById("botContainer");
    const emptyState = document.getElementById("emptyState");

    container.innerHTML = "";

    if (bots.length === 0) {
        emptyState.style.display = "block";
        return;
    }

    emptyState.style.display = "none";

    bots.forEach((bot, index) => {
        const card = document.createElement("div");
        card.className = "bot-card";
        card.style.animationDelay = `${index * 0.1}s`;

        // Format date
        const createdDate = new Date(bot.id).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        card.innerHTML = `
            <div class="bot-image-container">
                <img src="${bot.image}" alt="${bot.name}" onerror="this.src='images/default.png'">
                <div class="bot-overlay"></div>
            </div>
            <div class="bot-info">
                <h3 class="bot-name">
                    <i class="fas fa-robot"></i>
                    ${bot.name}
                </h3>
                <p class="bot-scenario">${bot.scenario}</p>
                <div class="bot-meta">
                    <span class="bot-date">
                        <i class="fas fa-calendar"></i>
                        ${createdDate}
                    </span>
                </div>
            </div>
        `;

        card.onclick = () => {
            window.location.href = `chat.html?id=${bot.id}`;
        };

        container.appendChild(card);
    });
}

/* IMAGE PREVIEW VARIABLES */
const botNameInput = document.getElementById("botName");
const scenarioInput = document.getElementById("scenario");
const metadataInput = document.getElementById("metadata");
const imageUrlInput = document.getElementById("imageUrl");
const previewImage = document.getElementById("previewImage");
const previewName = document.getElementById("previewName");
const previewScenario = document.getElementById("previewScenario");

/* UPDATE IMAGE PREVIEW */
function updatePreview() {
    const text = (scenarioInput.value + " " + metadataInput.value).toLowerCase();
    let image = "images/default.png";

    // Smart image selection based on keywords
    if (text.includes("travel") || text.includes("trip") || text.includes("tour") || text.includes("vacation") || text.includes("journey")) {
        image = "images/travel.png";
    } else if (text.includes("food") || text.includes("restaurant") || text.includes("cooking") || text.includes("recipe") || text.includes("dining")) {
        image = "images/food.png";
    } else if (text.includes("career") || text.includes("job") || text.includes("work") || text.includes("professional") || text.includes("business")) {
        image = "images/career.png";
    } else if (text.includes("fitness") || text.includes("workout") || text.includes("exercise") || text.includes("gym") || text.includes("health")) {
        image = "images/fitness.png";
    } else if (text.includes("study") || text.includes("education") || text.includes("learning") || text.includes("school") || text.includes("academic")) {
        image = "images/study.png";
    } else if (text.includes("medical") || text.includes("health") || text.includes("doctor") || text.includes("clinic") || text.includes("wellness")) {
        image = "images/medical.png";
    }

    // Check for custom image URL
    if (imageUrlInput.value.trim()) {
        image = imageUrlInput.value.trim();
    }

    previewImage.src = image;

    // Update preview text
    const name = botNameInput.value.trim() || "Your Assistant Name";
    const scenario = scenarioInput.value.trim() || "Your scenario description will appear here";

    previewName.textContent = name;
    previewScenario.textContent = scenario;
}

/* CREATE BOT FUNCTION */
function createBot() {
    const name = botNameInput.value.trim();
    const scenario = scenarioInput.value.trim();
    const metadata = metadataInput.value.trim();

    // Validation
    if (!name) {
        showNotification("Please enter an assistant name", "error");
        botNameInput.focus();
        return;
    }

    if (!scenario) {
        showNotification("Please enter a scenario", "error");
        scenarioInput.focus();
        return;
    }

    if (!metadata) {
        showNotification("Please enter a description", "error");
        metadataInput.focus();
        return;
    }

    // Get final image
    let image = previewImage.src;

    // If custom URL was provided but invalid, fall back to auto-selected
    if (imageUrlInput.value.trim() && !isValidUrl(imageUrlInput.value.trim())) {
        image = getAutoImage(scenario + " " + metadata);
        showNotification("Invalid image URL, using auto-selected image", "warning");
    }

    const bots = JSON.parse(localStorage.getItem("bots")) || [];

    const bot = {
        id: Date.now(),
        name: name,
        scenario: scenario,
        metadata: metadata,
        image: image,
        createdAt: new Date().toISOString()
    };

    bots.push(bot);
    localStorage.setItem("bots", JSON.stringify(bots));

    // Clear inputs
    botNameInput.value = "";
    scenarioInput.value = "";
    metadataInput.value = "";
    imageUrlInput.value = "";

    // Reset preview
    updatePreview();

    // Show success message
    showNotification("AI Assistant created successfully!", "success");

    // Reload bots with animation
    setTimeout(() => {
        loadBots();
    }, 100);
}

/* HELPER FUNCTIONS */
function getAutoImage(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("travel") || lowerText.includes("trip") || lowerText.includes("tour")) {
        return "images/travel.png";
    } else if (lowerText.includes("food") || lowerText.includes("restaurant")) {
        return "images/food.png";
    } else if (lowerText.includes("career") || lowerText.includes("job")) {
        return "images/career.png";
    } else if (lowerText.includes("fitness") || lowerText.includes("workout")) {
        return "images/fitness.png";
    } else if (lowerText.includes("study") || lowerText.includes("education")) {
        return "images/study.png";
    } else if (lowerText.includes("medical") || lowerText.includes("health")) {
        return "images/medical.png";
    }
    return "images/default.png";
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icon = type === 'success' ? 'check-circle' :
                 type === 'error' ? 'exclamation-circle' :
                 type === 'warning' ? 'exclamation-triangle' : 'info-circle';

    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

/* EVENT LISTENERS */
botNameInput.addEventListener("input", updatePreview);
scenarioInput.addEventListener("input", updatePreview);
metadataInput.addEventListener("input", updatePreview);
imageUrlInput.addEventListener("input", updatePreview);

// Add enter key support for form submission
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        createBot();
    }
});

/* INITIAL LOAD */
document.addEventListener("DOMContentLoaded", function() {
    loadBots();
    updatePreview();
});