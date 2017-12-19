// Create new windows to begin testing

let masterWindow = null;
let slaveWindow = null;
const USE_TRANSFERABLE = true;


chrome.app.window.create('./master.html', {
    'id': 'master-window',
    'bounds': {
        'width': 200,
        'height': 200
    },
    'minWidth': 200,
    'minHeight': 200
}, function(createdMasterWindow) {
    masterWindow = createdMasterWindow;

    chrome.app.window.create('./slave.html', {
        'id': 'slave-window',
        'bounds': {
            'width': 200,
            'height': 200
        },
        'minWidth': 200,
        'minHeight': 200
    }, function(createdSlaveWindow) {
        slaveWindow = createdSlaveWindow;

        slaveWindow.contentWindow.addEventListener('load', function() {
            console.log(masterWindow);
            masterWindow.contentWindow.beginTest(USE_TRANSFERABLE);
        });
    });
});




