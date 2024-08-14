document.getElementById('mic-button').addEventListener('click', () => {
    const welcomeMessage = "Welcome Mr. Prince Keshri, I am your personal assistant Jon. How may I help you? Do you want to create a static or dynamic QR code?";
    
    // Speak the welcome message
    const utterance = new SpeechSynthesisUtterance(welcomeMessage);
    utterance.onend = function() {
        askQrType();
    };
    window.speechSynthesis.speak(utterance);
});

function askQrType() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.start();

    recognition.onresult = function(event) {
        const qrType = event.results[0][0].transcript.trim().toLowerCase();
        console.log(`You said: ${qrType}`);

        if (qrType === 'static' || qrType === 'dynamic') {
            handleQrType(qrType);
        } else {
            const errorUtterance = new SpeechSynthesisUtterance("Sorry, I could not understand your input. Please say 'static' or 'dynamic'.");
            errorUtterance.onend = askQrType;
            window.speechSynthesis.speak(errorUtterance);
        }
    };

    recognition.onerror = function(event) {
        console.error(event.error);
        alert('Error occurred in recognition: ' + event.error);
    };
}

function handleQrType(qrType) {
    if (qrType === 'static') {
        let upiId = prompt('Please enter your UPI ID:');
        generateQRCode(upiId);
    } else if (qrType === 'dynamic') {
        let upiId = prompt('Please enter your UPI ID:');
        let amount = prompt('Please enter the amount:');
        generateQRCode(upiId, amount);
    }
}

function generateQRCode(upiId, amount = '') {
    if (/^\d{10}$/.test(upiId)) {
        upiId += "@paytm";
    }

    let paymentQrUrl = `upi://pay?pa=${upiId}&pn=Recipient%20Name&mc=1234`;
    if (amount) {
        paymentQrUrl += `&am=${amount}`;
    }

    let qrCode = qrcode(4, 'L');
    qrCode.addData(paymentQrUrl);
    qrCode.make();

    document.getElementById('qr-container').innerHTML = qrCode.createImgTag();
}
