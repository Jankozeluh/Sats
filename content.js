const priceRegexMap = {
//    'USD': /\$(\d+(?:\.\d{1,2})?)/g,
//    'CZK': /(\d+[\s,]?\d+)\sCZK/g,
//    'EUR': /(\d+[\s,]?\d+)\s€/g,
//    'EUR': /\€(\d+[\s,]?\d+)\s/g,
    'USD': /\$[ ]?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/g,
//    'CZK': /(\d{1,3}(?:[.,]\d{3})*)(?:[ ]?CZK)/g,
//    'EUR': /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)[ ]?€/g,
};
function convertPricesToSatoshi(btcToSatoshiRate) {
    const convertToSatoshi = (price, rate) => {
        price = price.replace(/,/g, '').replace(/\./g, '');
        return (parseFloat(price) / 100 * rate).toLocaleString(); // Convert to Satoshi
    };

    Object.entries(priceRegexMap).forEach(([currency, regex]) => {
        document.querySelectorAll('body *').forEach(node => {
            if (node.children.length === 0 && node.textContent.match(regex)) {
                node.textContent = node.textContent.replace(regex, (match, price) => {
                    return `${convertToSatoshi(price, btcToSatoshiRate)} Sats`;
                });
            }
        });
    });
}

function handleConversion() {
    chrome.storage.local.get(['btcToSatoshiRate'], function(data) {
        if (data.btcToSatoshiRate) {
            convertPricesToSatoshi(data.btcToSatoshiRate);
        } else {
            console.error('BTC to Satoshi rate not found.');
        }
    });
}

window.addEventListener('load', handleConversion);

const observer = new MutationObserver((mutations) => {
    handleConversion();
});
observer.observe(document.body, { childList: true, subtree: true });
