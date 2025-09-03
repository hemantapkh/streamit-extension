// Function to extract IMDb ID from the URL
function extractIMDbId() {
    const match = window.location.pathname.match(/\/title\/(tt\d+)/);
    return match ? match[1] : null;
}

// Function to create stream button
function createStreamButton(existingButton) {
    const streamButton = document.createElement('button');
    streamButton.className = existingButton.className;
    streamButton.setAttribute('tabindex', '0');
    streamButton.setAttribute('aria-disabled', 'false');

    const existingIcon = existingButton.querySelector('.ipc-icon');
    const existingText = existingButton.querySelector('.ipc-btn__text');
    if (!existingIcon || !existingText || !existingText.firstElementChild) {
        return null;
    }

    // SVG icon
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('role', 'presentation');
    svg.setAttribute('class', existingIcon.className);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M8 5v14l11-7z');
    path.setAttribute('fill', '#4285f4');
    svg.appendChild(path);
    streamButton.appendChild(svg);

    // Text container
    const textDiv = document.createElement('div');
    textDiv.className = existingText.className;
    const innerDiv = document.createElement('div');
    innerDiv.className = existingText.firstElementChild.className;
    innerDiv.textContent = 'Stream It';
    textDiv.appendChild(innerDiv);
    streamButton.appendChild(textDiv);

    streamButton.addEventListener('click', () => {
        const imdbId = extractIMDbId();
        if (imdbId) {
            window.location.href = `https://streamit.streamitplayer.com?id=${imdbId}`;
        }
    });
    return streamButton;
}

// Function to add stream button to the page
function addStreamButton() {
    // Find the watchlist button container
    const watchlistButton = document.querySelector('[data-testid="tm-box-wl-button"]');
    if (!watchlistButton) return;

    // Get the parent container that contains both buttons
    const buttonContainer = watchlistButton.closest('div[class*="sc-"]');
    if (!buttonContainer) return;

    // Check if stream button already exists
    if (buttonContainer.parentElement.querySelector('[data-testid="stream-button"]')) {
        return;
    }

    // Create stream button container
    const streamButtonContainer = document.createElement('div');
    streamButtonContainer.className = watchlistButton.parentElement.className;
    streamButtonContainer.style.marginBottom = '8px';
    
    // Add stream button to container
    const streamButton = createStreamButton(watchlistButton);
    if (!streamButton) return;
    streamButton.setAttribute('data-testid', 'stream-button');
    streamButtonContainer.appendChild(streamButton);

    // Insert stream button container before the button container
    buttonContainer.parentElement.insertBefore(streamButtonContainer, buttonContainer);
}

// Function to wait for an element to be present in the DOM
function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Timeout waiting for element: ${selector}`));
        }, timeout);
    });
}

// Function to handle page changes
async function handlePageChange() {
    try {
        await waitForElement('[data-testid="tm-box-wl-button"]');
        addStreamButton();
    } catch (error) {
        // Silent fail - the element might not be present on all pages
    }
}

// Function to initialize the extension
function initialize() {
    // Handle initial page load
    handlePageChange();

    // Handle navigation events
    window.addEventListener('popstate', handlePageChange);
    
    // Handle dynamic content changes
    const observer = new MutationObserver(handlePageChange);
    observer.observe(document.body, { childList: true, subtree: true });

    // Also run when the page content changes
    document.addEventListener('DOMContentLoaded', handlePageChange);
}

// Start the extension
initialize(); 
