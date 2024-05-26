let classifier;
let webcam;
let modelLoaded = false;

document.addEventListener("DOMContentLoaded", function() {
    const webcamElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('canvas');
    const feedbackElement = document.getElementById('model-feedback');
    const capturedFrameElement = document.getElementById('captured-frame');
    const snapSoundElement = document.createElement('audio');
    const captureButton = document.getElementById('capture-button');
    const retryButton = document.getElementById('retry-button');

    
    webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);
    webcam.start()
        .then(() => {
            console.log("Webcam started");
        })
        .catch(err => {
            console.error("Error starting webcam: ", err);
            feedbackElement.textContent = "Error starting webcam";
            feedbackElement.style.display = 'block';
        });

    
    classifier = ml5.imageClassifier('MobileNet', modelReady);

    
    captureButton.addEventListener('click', classifyImage);
    retryButton.addEventListener('click', retry);

    
    captureButton.disabled = true;
});

function modelReady() {
    modelLoaded = true;
    document.getElementById("model-feedback").textContent = "Model loaded";
    document.getElementById('capture-button').disabled = false;
}

function classifyImage() {
    if (modelLoaded) {
       
        const imageSrc = webcam.snap();

        
        const capturedFrameElement = document.getElementById('captured-frame');
        capturedFrameElement.src = imageSrc;
        capturedFrameElement.style.display = 'block';
        document.getElementById('webcam').style.display = 'none';

        
        const feedbackElement = document.getElementById('model-feedback');
        feedbackElement.innerHTML = '<div class="loading-spinner"></div>';
        feedbackElement.style.display = 'block';

        
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.getElementById('canvas');
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            classifier.classify(canvas, gotResult);
        };

        
        document.getElementById('capture-button').style.display = 'none';
        document.getElementById('retry-button').style.display = 'block';
    }
}

function gotResult(err, results) {
    const feedbackElement = document.getElementById('model-feedback');
    if (err) {
        console.error(err);
        feedbackElement.textContent = "Error classifying image";
        feedbackElement.classList.remove('loading-spinner');
        feedbackElement.style.display = 'block';
        return;
    }

    let label = results[0].label;

    feedbackElement.textContent = `Detected: ${label}`;
    feedbackElement.classList.remove('loading-spinner');
    feedbackElement.classList.add('fade-in');
    feedbackElement.style.display = 'block';
}

function retry() {
    
    const capturedFrameElement = document.getElementById('captured-frame');
    capturedFrameElement.style.display = 'none';
    document.getElementById('model-feedback').style.display = 'none';

    
    document.getElementById('webcam').style.display = 'block';

    
    document.getElementById('capture-button').style.display = 'block';
    document.getElementById('retry-button').style.display = 'none';
}
