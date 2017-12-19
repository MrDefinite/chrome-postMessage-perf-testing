

if (USE_LONG_LIVED_CONNECTION) {
    chrome.runtime.onConnect.addListener(msgPort => {
        if (msgPort.name !== 'master') {
            return;
        }

        console.info(msgPort);
        msgPort.postMessage({
            status: 'ready'
        });

        msgPort.onMessage.addListener(msg => {
            msgPort.postMessage({
                status: 'received'
            });
        });
    });

} else {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (!sender.url.endsWith('/master.html')) {
                return;
            }

            sendResponse({status: "received"});
        });
    chrome.runtime.sendMessage({
        status: 'ready'
    });
}
