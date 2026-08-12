if ('serviceWorker' in navigator) { navigator.serviceWorker.register('./sw.js'); }
let activeBT;

function sync() {
    document.getElementById('prevNama').innerText = document.getElementById('nama').value || "-";
    document.getElementById('prevTelp').innerText = document.getElementById('telp').value || "-";
    document.getElementById('prevAlamat').innerText = document.getElementById('alamat').value || "-";
    JsBarcode("#barcode", document.getElementById('telp').value || "123456789", { format: "CODE128", width: 2, height: 40 });
}

function updatePaperSize() { document.getElementById('printArea').className = document.getElementById('sizeSelect').value; }

async function pasteAndParse() {
    const text = await navigator.clipboard.readText();
    const lines = text.split('\n');
    document.getElementById('nama').value = lines[0] || "";
    document.getElementById('telp').value = text.match(/\d{10,14}/)?.[0] || "";
    document.getElementById('alamat').value = lines.slice(2).join(" ");
    sync();
}

async function connectBT() {
    const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true, optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb'] });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
    activeBT = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');
    alert("Printer Terhubung!");
}

async function printLabel() {
    const encoder = new TextEncoder();
    const cmd = "\x1B\x40\x1B\x33\x00" + document.getElementById('labelPreview').innerText + "\n\n\n\x1D\x56\x01";
    await activeBT.writeValue(encoder.encode(cmd));
}
