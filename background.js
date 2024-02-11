function fetchBTCPrice() {
    fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
        .then(response => response.json())
        .then(data => {
            const btcToSatoshiRate = 1e8 / data.price;
            chrome.storage.local.set({btcToSatoshiRate}, () => {
                console.log('BTC price:', data.price);
                console.log('BTC to Satoshi rate updated:', btcToSatoshiRate);
            });
        })
        .catch(console.error);
}

fetchBTCPrice();
setInterval(fetchBTCPrice, 1000 * 60 * 5);
