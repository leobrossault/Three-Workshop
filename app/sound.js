
  var pathSound = 'app/sound/Fakear_Neptune.mp3',
      frequencys,
      average;


  if (! window.AudioContext) {
    if (! window.webkitAudioContext) {
        alert('no audiocontext found');
    }
    window.AudioContext = window.webkitAudioContext;
  }

  var context = new AudioContext(),
      audioBuffer,
      sourceNode = context.createBufferSource(),
      analyser = context.createAnalyser(),
      arrayData =  new Uint8Array(analyser.frequencyBinCount),
      javascriptNode;
   
  // load the sound
  setupAudioNodes();
  loadSound(pathSound);

  function loadSound(url) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
   
      request.onload = function() {
          context.decodeAudioData(request.response, function(buffer) {
              playSound(buffer);
          });
      }
      request.send();
  }
   
  function playSound (buffer) {
      sourceNode.buffer = buffer;
      sourceNode.start(0);
  }


  function setupAudioNodes() {
      javascriptNode = context.createScriptProcessor(2048, 1, 1);
      javascriptNode.connect(context.destination);
   
      // setup a analyzer
      analyser = context.createAnalyser();
      analyser.smoothingTimeConstant = 0.1;
      analyser.fftSize = 1024;
   
      sourceNode = context.createBufferSource();
   
      sourceNode.connect(analyser);
   
      analyser.connect(javascriptNode);
   
      sourceNode.connect(context.destination);
  }

  javascriptNode.onaudioprocess = function() {
      var array =  new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      average = getAverageVolume(array);
      frequencys = array;
  }
   
  function getAverageVolume(array) {
      var values = 0;
      var average;
   
      var length = array.length;
      for (var i = 0; i < length; i++) {
          values += array[i];
      }
   
      average = values / length;
      return average;
  }

 
