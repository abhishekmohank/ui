from flask import Flask, request, jsonify, render_template, send_from_directory
from gradio_client import Client
import os
import shutil
from pathlib import Path


app = Flask(__name__)

client = Client("http://localhost:7897/")

model_path_maps ={
    "Mohanlal" : "a10.pth",
    "Latina_egirl" : "Latina_egirl.pth",
    "Taylor_Swift" : "TaylorSwift_2024_e375_s16125.pth",
    "Melissa":"malayalam-tts.pth"
}

audio_file_path = Path(f"C:\Users\devcb\audio_conversion\Mangio-RVC-v23.7.0_INFER_TRAIN\Mangio-RVC-v23.7.0\audios\somegirl.mp3")


print("Loading default model...")
try:
    result = client.predict(
            model_path_maps["Mohanlal"],	
            0,	
            0,
            fn_index=12
    )
    print(result)
    print("Model loaded")
except Exception as e:
    print("Error loading model", str(e))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/load-model/<audio_name>', methods=['POST'])
def predict(audio_name):
    try:
        print("Loading model for", audio_name)
        result = client.predict(
                model_path_maps[audio_name],
                0,	
                0,
                fn_index=12
        )
        print(result)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    audio_file = request.files['audio']
    if audio_file:
        # Save the audio file to the saved_audios directory
        file_path = os.path.join("C:/Users/devcb/audio_conversion/ui/saved_audios", audio_file.filename)
        os.makedirs('saved_audios', exist_ok=True)
        audio_file.save(file_path)
        print("Audio saved to:", file_path)
        audio_file_path = Path(file_path)
        return jsonify({'message': 'Audio uploaded successfully', 'audio_path': file_path})
    else:
        return jsonify({'error': 'No audio file provided'}), 400
    



@app.route('/generate_audio/<audio_file_path>', methods=['POST'])
def generate_audio(audio_file_path):
    try:
        result = client.predict(
            0,	# int | float (numeric value between 0 and 2333) in 'Select Speaker/Singer ID:' Slider component
            audio_file_path,	# str  in 'Add audio's name to the path to the audio file to be processed (default is the correct format example) Remove the path to use an audio from the dropdown list:' Textbox component
            "audios/abz.opus",	# str (Option from: ['audios/abz.opus', 'audios/omu.opus', 'audios/somegirl.mp3', 'audios/someguy.mp3']) in 'Auto detect audio path and select from the dropdown:' Dropdown component
            5,	# int | float  in 'Transpose (integer, number of semitones, raise by an octave: 12, lower by an octave: -12):' Number component
            "C:/Users/devcb/audio_conversion/Mangio-RVC-v23.7.0_INFER_TRAIN/Mangio-RVC-v23.7.0/sample_file.pdf",	# str (filepath or URL to file) in 'F0 curve file (optional). One pitch per line. Replaces the default F0 and pitch modulation:' File component
            "pm",	# str  in 'Select the pitch extraction algorithm ('pm': faster extraction but lower-quality speech; 'harvest': better bass but extremely slow; 'crepe': better quality but GPU intensive):' Radio component
            "",	# str  in 'Path to the feature index file. Leave blank to use the selected result from the dropdown:' Textbox component
            "./logs/a10/added_IVF1442_Flat_nprobe_1_a10_v2.index",	# str (Option from: []) in '3. Path to your added.index file (if it didn't automatically find it.)' Dropdown component
            0,	# int | float (numeric value between 0 and 1) in 'Search feature ratio:' Slider component
            0,	# int | float (numeric value between 0 and 7) in 'If >=3: apply median filtering to the harvested pitch results. The value represents the filter radius and can reduce breathiness.' Slider component
            0,	# int | float (numeric value between 0 and 48000) in 'Resample the output audio in post-processing to the final sample rate. Set to 0 for no resampling:' Slider component
            0,	# int | float (numeric value between 0 and 1) in 'Use the volume envelope of the input to replace or mix with the volume envelope of the output. The closer the ratio is to 1, the more the output envelope is used:' Slider component
            0,	# int | float (numeric value between 0 and 0.5) in 'Protect voiceless consonants and breath sounds to prevent artifacts such as tearing in electronic music. Set to 0.5 to disable. Decrease the value to increase protection, but it may reduce indexing accuracy:' Slider component
            1,	# int | float (numeric value between 1 and 512) in 'Mangio-Crepe Hop Length (Only applies to mangio-crepe): Hop length refers to the time it takes for the speaker to jump to a dramatic pitch. Lower hop lengths take more time to infer but are more pitch accurate.' Slider component
            fn_index=8
        )

        print(result)
        conv_audio_path = result[1]
        # Save the audio file to the saved_audios directory
        os.makedirs('converted_audios', exist_ok=True)
        # Move the converted audio to the converted_audios directory
        audio_name = conv_audio_path.split('/')[-1]
        print("AUDio name", audio_name)
        audio_path = os.path.join('converted_audios',"lat.wav")
        audio_name = "lat.wav"
        shutil.move(conv_audio_path, audio_path)

        result = {
            "audio_path": audio_name
        }
        print("Audio converted and saved to:", audio_path)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/converted_audios/<filename>')
def saved_audio(filename):
    print("Sending audio file:", filename)
    # Replace 'saved_audios' with the directory path where your audio files are stored
    return send_from_directory('converted_audios', filename)

if __name__ == '__main__':
    app.run(debug=True)





# print(result)