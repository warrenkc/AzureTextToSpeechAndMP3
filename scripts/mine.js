
 $(document).ready(function () {
    var keyInput = document.getElementById("key");
    var regionInput = document.getElementById("region");
    var languageInput = document.getElementById("language");
    var voiceInput = document.getElementById("voice");
    var textInput = document.getElementById("text");
    var createMp3btn = document.getElementById("createMp3btn");
    var stripButton = document.getElementById("strip");
    var playBtn = document.getElementById("playbtn");
    var stopBtn = document.getElementById("stopbtn");
    var player = null;
    
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
    createMp3btn.addEventListener("click", () => {
        // Start the text to speech operation.
        synthesizeSpeech(true);
    });
    stripButton.addEventListener("click", () => {
        stripVerseNumbers();
    });
    playBtn.addEventListener("click", () => {
        // Start the text to speech operation.
        synthesizeSpeech(false);
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
        
    function synthesizeSpeech(createMP3) {
        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(keyInput.value, regionInput.value);
        //const audioConfig = SpeechSDK.AudioConfig.fromAudioFileOutput("path-to-file.wav");
        player = new SpeechSDK.SpeakerAudioDestination();
                    player.onAudioEnd = function () {
                        // stopli.hidden = true;
                        // playli.hidden = false;
                    };
    
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
                    if  (createMP3 === true)
                    {
                        downloadFile(result.audioData);
                    }
                    //downloadFile(result.audioData);
                    //return result.audioData;
                    // return result as stream
                    //return fs.createReadStream("path-to-file.wav");
                }
            },
            error => {
                console.log(error);
                synthesizer.close();
            });
            synthesizer.synthesisCompleted = function () {
                synthesizer.close();
                synthesizer = null;
            };
    
            synthesizer.SynthesisCanceled = function (s, e) {
                // var details;
                // stopli.hidden = true;
                // playli.hidden = false;
                // details = SpeechSDK.CancellationDetails.fromResult(e);
                // if (details.reason === SpeechSDK.CancellationReason.Error) {
                //     status.innerText = localizedResources.srTryAgain;
                // }
            };
            
    }
    stopBtn.onclick = function () {
        console.log('Stop clicked.');
        console.log(player);
        // playli.hidden = false;
        // stopli.hidden = true;
    
        if (player !== null) {
            player.pause();
            
        }
    
        player = null;
    };
    
    function downloadFile(data) {
        try {
            blob = new Blob([data], { type: "audio/mpeg" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            if (link.download !== undefined) { // feature detection
                link.setAttribute('href', url);
                link.setAttribute('download', "text-to-speech-audio.mp3");
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
    
    
    const speechKey = keyInput.value;
    const speechRegion = regionInput.value;
    
    function getAuthTokenForAzure() {
    
        var params = {
            // Request parameters
        };
    
        $.ajax({
            url: "https://eastasia.api.cognitive.microsoft.com/sts/v1.0/issueToken?" + $.param(params),
            beforeSend: function (xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", speechKey);
            },
            type: "POST",
            // Request body
            data: "{body}",
        })
            .done(function (data) {
                var token = JSON.stringify(data)
                loadLanguageList(token);
                // alert(JSON.stringify(data));
            })
            .fail(function () {
                alert("error");
            });
    
    
    
    
    
    
    
    
    
    
    
    
    }
    var voiceList = {},
    language = document.getElementById('languageselect'),
    text = document.getElementById('text'),
    voice = document.getElementById('voiceselect'),
    voicestyle = document.getElementById('voicestyleselect'),
    styleList = {},
    rolePlayList = {},
    secondaryLocaleList = {};
    
    
    
    function loadLanguageList(token) {
        $.ajax({
            url: 'https://' + speechRegion + '.tts.speech.microsoft.com/cognitiveservices/voices/list',
            type: 'GET',
            //beforeSend: function textToSpeechVoiceListBeforeAjaxSend(xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + token); },
            beforeSend: function textToSpeechVoiceListBeforeAjaxSend(xhr) { 
                xhr.setRequestHeader("Ocp-Apim-Subscription-Key", speechKey);
             },
    
            // Request headers
          
    
            success: function textToSpeechVoiceListAjaxSuccess(data) {
                // put neural voices in front.
                var sorted = data.sort(function (a, b) {
                    return a.VoiceType.localeCompare(b.VoiceType);
                });
                $.each(sorted, function (_index, element) {
                    var displayName = element.DisplayName;
                    if (element.Status === 'Deprecated') {
                        // Don't show deprecated voices.
                        return;
                    }
                    if (!voiceList[element.Locale]) {
                        voiceList[element.Locale] = '';
                    }
                    if (element.VoiceType === 'Neural') {
                        displayName += ' (Neural)';
                    }
                    if (element.LocalName !== element.DisplayName) {
                        displayName += ' - ' + element.LocalName;
                    }
                    if (element.Status === 'Preview') {
                        displayName += ' - ' + 'Preview';
                    }
                    voiceList[element.Locale] += '<option value="' + element.ShortName + '">' + displayName + '</option>';
                    styleList[element.ShortName] = element.StyleList;
                    rolePlayList[element.ShortName] = element.RolePlayList;
                    secondaryLocaleList[element.ShortName] = element.SecondaryLocaleList;
                });
                //language.onchange();
            },
            error: function textToSpeechVoiceListAjaxError(_jqXHR, _textStatus, error) {
                console.log('A Text To Speech voice list API Ajax error occurred: ' + error);
            }
        });
    }
 });