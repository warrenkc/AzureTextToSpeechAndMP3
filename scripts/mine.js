var keyInput = document.getElementById("key");
var regionInput = document.getElementById("region");
var languageInput = document.getElementById("language");
var voiceInput = document.getElementById("voice");
var textInput = document.getElementById("text");
var startButton = document.getElementById("start");
var stripButton = document.getElementById("strip");

loadLastUsedParameters();

keyInput.addEventListener("input", () => {
    rememberLastUsedParameters();
});
regionInput.addEventListener("input", () => {
    rememberLastUsedParameters();
});
languageInput.addEventListener("input", () => {
    rememberLastUsedParameters();
});
voiceInput.addEventListener("input", () => {
    rememberLastUsedParameters();
});
textInput.addEventListener("input", () => {
    rememberLastUsedParameters();
});
startButton.addEventListener("click", () => {
    // Start the text to speech operation.
    synthesizeSpeech();
});
stripButton.addEventListener("click", () => {    
    stripVerseNumbers();
});

function rememberLastUsedParameters() {
    if (typeof (Storage) !== "undefined") {
        localStorage.azureKey = keyInput.value;
        localStorage.azureRegion = regionInput.value;
        localStorage.language = languageInput.value;
        localStorage.voice = voiceInput.value;
        localStorage.text = textInput.value;
    }
}

function loadLastUsedParameters() {
    if (typeof (Storage) !== "undefined") {
        if (localStorage.azureKey) {
            keyInput.value = localStorage.azureKey;
        }

        if (localStorage.azureRegion) {
            regionInput.value = localStorage.azureRegion;
        }

        if (localStorage.language) {
            languageInput.value = localStorage.language;
        }
        if (localStorage.voice) {
            voiceInput.value = localStorage.voice;
        }
        if (localStorage.text) {
            textInput.value = localStorage.text;
        }
    }
}

// TODO: ADD TRIM STRING.

var player = new SpeechSDK.SpeakerAudioDestination();

function synthesizeSpeech() {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(keyInput.value, regionInput.value);
    //const audioConfig = SpeechSDK.AudioConfig.fromAudioFileOutput("path-to-file.wav");
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput(player);

    // Set the output format
    speechConfig.SpeechSynthesisOutputFormat = SpeechSDK.SpeechSynthesisOutputFormat.Audio24Khz96KBitRateMonoMp3;


    // Note: if only language is set, the default voice of that language is chosen.
    speechConfig.speechSynthesisLanguage = languageInput.value; // e.g. "de-DE"
    // The voice setting will overwrite language setting.
    // The voice setting will not overwrite the voice element in input SSML.
    speechConfig.speechSynthesisVoiceName = voiceInput.value;

    // const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);



    synthesizer.speakTextAsync(
        textInput.value,
        result => {
            synthesizer.close();
            if (result) {
                downloadFile(result.audioData);
                return result.audioData;
                // return result as stream
                //return fs.createReadStream("path-to-file.wav");
            }
        },
        error => {
            console.log(error);
            synthesizer.close();
        });
}

function downloadFile(data) {
    try {
        blob = new Blob([data], { type: "audio/mpeg" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        if (link.download !== undefined) { // feature detection
            link.setAttribute('href', url);
            link.setAttribute('download', "data.mp3");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    } catch (e) {
        console.error('BlobToSaveAs error', e);
    }
}

// Strip verse number from text. The issue is if there are numbers in the verse such as: Biarpun aku mempunyai 60 orang permaisuri Dan 80 orang gundik

function stripVerseNumbers() {
    // Try to remove digits that have a symbol in front of them. 
    textInput.value = textInput.value.replace(/([,“”".;?!])\d+/g, "$1");    
    //textInput.value = textInput.value.replace(/(\.\s)\d+/g, "$1");    
    // Try to remove digits that have a symbol then a space preceding them.
    textInput.value = textInput.value.replace(/([,“”".;?!]\s)\d+/g, "$1");    
    

}