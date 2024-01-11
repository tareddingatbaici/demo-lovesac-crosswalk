// eslint-disable-next-line import/no-cycle
import { fetchPlaceholders, sampleRUM } from './lib-franklin.js';

const placeholders = await fetchPlaceholders();

// Core Web Vitals RUM collection
sampleRUM('cwv');

function loadCookieBot() {
    // Add cookie consent banner on all pages
    const { cookiebotid } = placeholders;
    if (cookiebotid) {
        loadScript('https://consent.cookiebot.com/uc.js', {
            type: 'text/javascript',
            id: 'Cookiebot',
            'data-cbid': `${cookiebotid}`,
            'data-blockingmode': 'auto',
        });
    }

    // Check if the element with data-cookie-declaration exists in the DOM
    const cookieContainer = document.querySelector('[data-cookie-declaration]');
    if (
        // eslint-disable-next-line operator-linebreak
        cookieContainer &&
        // eslint-disable-next-line operator-linebreak
        cookiebotid &&
        !window.location.host.startsWith('localhost')
    ) {
        const cookieDeclarationScript = loadScript(
            `https://consent.cookiebot.com/${cookiebotid}/cd.js`,
            {
                type: 'text/javascript',
                id: 'CookieDeclaration',
                async: true,
            },
        );

        cookieContainer.append(cookieDeclarationScript);
    }
}

// add more delayed functionality here
loadCookieBot();
