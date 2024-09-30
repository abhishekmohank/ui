let mediaRecorder;
let audioChunks = [];
let audioBlob;
let audioUrl;
let audio = new Audio();
let isRecording = false;
let audio_path = '';

// async function toggleRecording() {
//     const recordButton = document.getElementById('recordButton');
    
//     if (!isRecording) {
//         if (!navigator.mediaDevices) {
//             alert('Media Device access is not supported by your browser. Try Chrome or Firefox.');
//             return;
//         }
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder = new MediaRecorder(stream);
//             mediaRecorder.start();
//             mediaRecorder.ondataavailable = (event) => {
//                 audioChunks.push(event.data);
//             };
//             mediaRecorder.onstop = async () => {
//                 audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
//                 audioUrl = URL.createObjectURL(audioBlob);
//                 audio.src = audioUrl;
//                 audioChunks = [];
//                 await sendAudioToServer(audioBlob);
//             };
//             recordButton.textContent = 'Stop Recording'; // Change button text to 'Stop Recording'
//             isRecording = true;
//         } catch (err) {
//             console.error('Error accessing audio devices.', err);
//         }
//     } else {
//         mediaRecorder.stop();
//         recordButton.textContent = 'Record'; // Change button text back to 'Record'
//         isRecording = false;
//     }
// }

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];
        let startTime;
        let interval;
        loadingImage.style.display = 'none';  // Hide the loading image
        const updateTimer = async() => {
            const elapsedTime = Date.now() - startTime;
            const seconds = Math.floor((elapsedTime / 1000) % 60).toString().padStart(2, '0');
            const minutes = Math.floor((elapsedTime / 1000 / 60) % 60).toString().padStart(2, '0');
            document.getElementById('timer').textContent = `${minutes}:${seconds}`;
        };

        document.getElementById('startBtn').addEventListener('click', () => {
            mediaRecorder.start();
            startTime = Date.now();
            interval = setInterval(updateTimer, 1000);
            document.getElementById('recordStatus').textContent = 'Recording...';
            document.getElementById('startBtn').disabled = true;
            document.getElementById('stopBtn').disabled = false;
        });



        document.getElementById('stopBtn').addEventListener('click', async () => {
            mediaRecorder.stop();
            clearInterval(interval);
            document.getElementById('timer').textContent = '00:00';
            document.getElementById('recordStatus').textContent = 'Recording stopped.';
            document.getElementById('startBtn').disabled = false;
            document.getElementById('stopBtn').disabled = true;
            // Call the function to send the audio to the server
        });

        mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener('stop', async () => {
            console.log('Audio recording stopped.');
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.src = audioUrl;
            // Clear the chunks array for the next recording
            audioChunks.splice(0, audioChunks.length);
            loadingImage.style.display = 'inline';  // Show the loading image
            await sendAudioToServer(audioBlob); 
            loadingImage.style.display = 'none';  // Hide the loading image
        });
    })
    .catch(error => console.error('Error accessing media devices.', error));


async function sendAudioToServer(blob) {
    console.log('Sending audio to the server...');
    const formData = new FormData();
    formData.append('audio', blob, 'recording.mp3');
    console.log('Sending audio to the server...');

    try {
        const response = await fetch('/upload_audio', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        audio_path = result.audio_path;
        console.log('Audio stored at:', result.audio_path);
    } catch (error) {
        console.error('Failed to send the audio', error);
    }
}

// navigator.mediaDevices.getUserMedia({ audio: true })
//     .then(stream => {
//         const mediaRecorder = new MediaRecorder(stream);
//         const audioChunks = [];

//         document.getElementById('startBtn').addEventListener('click', () => {
//             mediaRecorder.start();
//             document.getElementById('audioDetails').textContent = 'Recording...';
//         });

//         document.getElementById('stopBtn').addEventListener('click', () => {
//             mediaRecorder.stop();
//         });

//         mediaRecorder.addEventListener('dataavailable', event => {
//             audioChunks.push(event.data);
//         });

//         mediaRecorder.addEventListener('stop', () => {
//             const audioBlob = new Blob(audioChunks);
//             const audioUrl = URL.createObjectURL(audioBlob);
//             const audioPlayer = document.getElementById('audioPlayer');
//             const audioDetails = document.getElementById('audioDetails');
//             const playBtn = document.getElementById('playBtn');

//             audioPlayer.src = audioUrl;
//             audioDetails.textContent = 'Recording complete. Click play to listen.';
//             playBtn.disabled = false;

//             audioChunks.splice(0, audioChunks.length); // Clear the chunks array for the next recording
//         });

//         document.getElementById('playBtn').addEventListener('click', () => {
//             const audioPlayer = document.getElementById('audioPlayer');
//             audioPlayer.play();
//         });
//     })
//     .catch(error => console.error('Error accessing media devices.', error));


function uploadAudio() {
    if (audioBlob) {
        const formData = new FormData();
        formData.append('file', audioBlob);
        // Implement your upload code here, e.g., an AJAX request to your server.
        console.log('Upload function needs to be implemented.');
    } else {
        alert('No audio to upload. Please record something first.');
    }
}


document.getElementById('voiceSelect').addEventListener('change', function() {
    const selectedVoice = this.value;
    loadModel(selectedVoice);
});


function loadModel(audio_name) {
    const loadingImage = document.getElementById('loadingImage');
    loadingImage.style.display = 'inline';  // Show the loading image

    fetch(`/load-model/${audio_name}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log('Model loaded successfully:', data);
        loadingImage.style.display = 'none';  // Hide the loading image
    })
    .catch((error) => {
        console.error('Error loading model:', error);
        loadingImage.style.display = 'none';  // Hide the loading image
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.querySelector('.generate-btn');
    generateBtn.addEventListener('click', function() {
        generateSpeech();
    });
});

function generateSpeech() {
    console.log('Generating speech...'); 
    const loadingImage = document.getElementById('loadingImage');
    loadingImage.style.display = 'inline';  // Show the loading image


}


// function playconvAudio() {
//     const playButton = document.getElementById('playButton');
//     const audio = document.getElementById('audio-player');
    
//     // Replace this with the actual filename of the recorded/converted audio
//     const filename = audio_path;

//     console.log('Playing the audio:', filename);

//     if (filename) {
//         const audio_path = `/converted_audios/${filename}`;
//         audio.src = audio_path;
//         audio.play().catch(error => {
//             console.error("Error playing the audio:", error);
//             alert("Could not play the audio. Make sure the file exists on the server.");
//         });
//     }
//     else {
//         alert('No audio converted. Please record something first.');
//     }
// }
// document.addEventListener('DOMContentLoaded', async function() {
//     const audioPlayer = document.getElementById('audioPlayer');
//     const loadAudioButton = document.getElementById('loadAudio');
    
//     const response = await fetch('/upload-audio', {
//         method: 'POST',
//         body: formData
//     });
//     loadAudioButton.addEventListener('click', function() {
//         // The path to the audio file - this should be a route that Flask handles

//         audioPlayer.src = audio_path; // Modify as needed based on your actual file path
//         audioPlayer.play();
//     });
// });



// function deleteAudio() {
//     if (audioUrl) {
//         URL.revokeObjectURL(audioUrl);
//         audio.src = '';
//         console.log('Audio deleted.');
//     } else {
//         alert('No audio to delete.');
//     }
// }
