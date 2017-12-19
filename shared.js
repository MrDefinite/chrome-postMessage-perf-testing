const USE_TRANSFERABLE = true;
const USE_LONG_LIVED_CONNECTION = false;
const SIZE = 1024 * 1024 * 32; // 32MB
let arrayBuffer = null;
let uInt8View = null;
let originalLength = null;


function setupArray(source) {
    arrayBuffer = new ArrayBuffer(SIZE);
    uInt8View = new Uint8Array(arrayBuffer);
    originalLength = uInt8View.length;

    for (let i = 0; i < originalLength; ++i) {
        uInt8View[i] = i;
    }

    console.log(source + ': filled ' + toMB(originalLength) + ' MB buffer');
}

function time() {
    let now = new Date();
    let time = /(\d+:\d+:\d+)/.exec(now)[0] + ':';
    let ms, i;
    for (ms = String(now.getMilliseconds()), i = ms.length - 3; i < 0; ++i) {
        time += '0';
    }
    return time + ms;
}

function seconds(since) {
    return (new Date() - since) / 1000.0;
}

function toMB(bytes) {
    return Math.round(bytes / 1024 / 1024);
}
