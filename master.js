const TEST_NUMBER = 10000;
let count = 0;
let startTime;

function beginTest() {

    if (USE_LONG_LIVED_CONNECTION) {
        let port = chrome.runtime.connect({
            name: 'master'
        });

        port.onMessage.addListener(msg => {
            // console.log(msg);
            if (msg.status === 'ready') {
                setupArray('master');
                startTime = new Date();

                postDataToSlave(port);
            } else if (msg.status === 'received' && count < TEST_NUMBER) {
                postDataToSlave(port);
            } else if (count >= TEST_NUMBER) {
                // End testing
                console.log('Testing done');
                getStatistics();
            }
        });
    } else {
        let receiveCallback = function(response) {
            if (response.status === 'received') {
                count++;
                if (count >= TEST_NUMBER) {
                    // End testing
                    console.log('Testing done');
                    getStatistics();
                    return;
                }

                postDataToSlaveForOneTime(receiveCallback);
            }
        };

        chrome.runtime.onMessage.addListener(
            function(msg, sender, sendResponse) {
                if (!sender.url.endsWith('/slave.html')) {
                    return;
                }

                if (msg.status === 'ready') {
                    setupArray('master');
                    startTime = new Date();

                    postDataToSlaveForOneTime(receiveCallback);
                }
            });
    }

}

function postDataToSlaveForOneTime(callback) {
    chrome.runtime.sendMessage({
        name: 'test',
        data: uInt8View.buffer
    }, function(response) {
        callback(response);
    });
}

function postDataToSlave(port) {
    if (USE_TRANSFERABLE) {
        port.postMessage(uInt8View.buffer, [uInt8View.buffer]);
    } else {
        // port.postMessage(uInt8View.buffer);
        port.postMessage({
            name: 'test',
            data: uInt8View.buffer
        });
    }
    count++;
}

function getStatistics() {
    let elapsed = seconds(startTime);
    let rate = Math.round(toMB(SIZE * TEST_NUMBER) / elapsed);

    console.log('master postMessage roundtrip took: ' + (elapsed * 1000) + ' ms');
    console.log('master postMessage roundtrip rate: ' + rate + ' MB/s');
}
