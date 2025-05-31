// Function to extract IMDb ID from the page
function extractIMDbId() {
    const reviewsSection = document.querySelector('div[data-attrid="kc:/film/film:reviews"]');
    if (!reviewsSection) return null;

    const imdbLink = reviewsSection.querySelector('a[href*="imdb.com/title/tt"]');
    if (imdbLink) {
        const match = imdbLink.href.match(/tt\d+/);
        return match ? match[0] : null;
    }
    return null;
}

// Function to add stream icon to reviews section
function addStreamIconToReviews(imdbId) {
    const reviewsSection = document.querySelector('div[data-attrid="kc:/film/film:reviews"]');
    if (!reviewsSection) return;
    const existingLink = reviewsSection.querySelector('a');
    if (!existingLink) return;
    const reviewsContainer = existingLink.closest('div');
    if (!reviewsContainer) return;
    if (reviewsContainer.querySelector('a[href*="stream.hemantapkh.com"]')) {
        return;
    }
    const streamLink = document.createElement('a');
    streamLink.href = `https://stream.hemantapkh.com?id=${imdbId}`;
    streamLink.className = existingLink.className;
    streamLink.setAttribute('role', 'link');
    const existingSpans = existingLink.querySelectorAll('span');
    const iconSpan = existingSpans[0];
    const textSpan = existingSpans[1];
    const contentDiv = existingLink.querySelector('div');
    // Icon span
    const iconSpanElem = document.createElement('span');
    iconSpanElem.className = iconSpan.className;
    iconSpanElem.setAttribute('aria-hidden', 'true');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.style.height = '20px';
    svg.style.width = '20px';
    svg.style.verticalAlign = 'middle';
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M8 5v14l11-7z');
    path.setAttribute('fill', '#4285f4');
    svg.appendChild(path);
    iconSpanElem.appendChild(svg);
    streamLink.appendChild(iconSpanElem);
    // Text span
    const textSpanElem = document.createElement('span');
    textSpanElem.className = textSpan.className;
    textSpanElem.setAttribute('title', 'Stream Now');
    textSpanElem.setAttribute('aria-hidden', 'true');
    textSpanElem.textContent = 'Stream';
    streamLink.appendChild(textSpanElem);
    // Content div
    const contentDivElem = document.createElement('div');
    contentDivElem.className = contentDiv.className;
    const innerDiv = document.createElement('div');
    innerDiv.className = contentDiv.firstElementChild.className;
    const innerSpan = document.createElement('span');
    innerSpan.textContent = 'Stream Now';
    innerDiv.appendChild(innerSpan);
    contentDivElem.appendChild(innerDiv);
    streamLink.appendChild(contentDivElem);
    reviewsContainer.appendChild(streamLink);
}

// Function to inject the streaming option
function injectStreamingOption() {
    const imdbId = extractIMDbId();
    if (!imdbId) return;
    addStreamIconToReviews(imdbId);
}

// Initialize the extension
function initialize() {
    injectStreamingOption();

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.querySelector('div[data-attrid="kc:/film/film:reviews"]') || 
                            node.getAttribute('data-attrid') === 'kc:/film/film:reviews') {
                            injectStreamingOption();
                            break;
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    document.addEventListener('DOMContentLoaded', injectStreamingOption);
}

// Start the extension
initialize(); 