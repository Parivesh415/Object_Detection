let model;
const canvas = document.getElementById('outputCanvas');
const context = canvas.getContext('2d');

// Load the COCO-SSD model
async function loadModel() {
    try {
        model = await cocoSsd.load();
        console.log("Model loaded.");
    } catch (error) {
        console.error("Error loading the model:", error);
    }
}

// Handle image input change
document.getElementById('imageInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
        console.error("Please select a valid image file.");
        return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
        console.log("Image loaded.");
        
        // Set canvas size to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Clear the canvas and draw the image
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);

        // Perform object detection
        try {
            const predictions = await model.detect(img);
            drawPredictions(predictions);
        } catch (error) {
            console.error("Error during object detection:", error);
        }

        // Clean up the object URL after the image has loaded
        URL.revokeObjectURL(img.src);
    };

    img.onerror = (error) => {
        console.error("Error loading image:", error);
    };
});

// Function to draw predictions on the canvas
function drawPredictions(predictions) {
    predictions.forEach(prediction => {
        context.beginPath();
        context.rect(...prediction.bbox);
        context.lineWidth = 3;
        context.strokeStyle = 'red';
        context.fillStyle = 'red';
        context.stroke();
        context.font = '20px comic Sans MS'
        context.fillText(`${prediction.class} (${Math.round(prediction.score * 100)}%)`, prediction.bbox[0], prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10);
    });
}

// Load the model when the script is loaded
loadModel();