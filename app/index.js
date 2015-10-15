'use strict';

import domready from 'domready';
import Webgl from './Webgl';
import raf from 'raf';
import dat from 'dat-gui'; 
import 'gsap';

let webgl,
    gui,
    pathSound = 'app/assets/sound/Fakear_Neptune.mp3',
    frequencys,
    average,
    isLaunch = 0,
    soundStarted = 0,
    defaultLaunch,
    customLaunch,
    begin,
    formMusic,
    inputFile,
    audio,
    file,
    textIntro;

domready(() => {
  webgl = new Webgl(window.innerWidth, window.innerHeight);
  document.body.appendChild(webgl.renderer.domElement);

  window.onresize = resizeHandler;

  defaultLaunch = document.getElementById('default-music');
  customLaunch = document.getElementById('custom-music');
  begin = document.getElementById('begin');
  formMusic = document.getElementById('form-music');
  inputFile = document.getElementById('file');
  textIntro = document.getElementById('text-intro');

  defaultLaunch.addEventListener('click', defaultMusicLaunch);
  customLaunch.addEventListener('click', customMusicLaunch);

  inputFile.addEventListener('change', handleFileSelect);
  animate ();
});

function resizeHandler () {
  webgl.resize(window.innerWidth, window.innerHeight);
}

function defaultMusicLaunch () {
  setupAudioNodes();
  loadSound(pathSound);
  audio = null;
  document.getElementById('container').classList.add('leave');
  isLaunch = 1;
}

function customMusicLaunch () {
  begin.classList.add('leave');
  formMusic.classList.add('inc');
}

function animate () {
  raf(animate);
  webgl.render(average, frequencys, isLaunch, audio);
}


if (! window.AudioContext) {
  if (! window.webkitAudioContext) {
      alert('no audiocontext found');
  }
  window.AudioContext = window.webkitAudioContext;
}

let context = new AudioContext(),
    audioBuffer,
    sourceNode = context.createBufferSource(),
    analyser = context.createAnalyser(),
    arrayData =  new Uint8Array(analyser.frequencyBinCount),
    javascriptNode;

function loadSound (url) {
    let request = new XMLHttpRequest();
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


function setupAudioNodes () {
    javascriptNode = context.createScriptProcessor(2048, 1, 1);
    javascriptNode.connect(context.destination);
   
    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.1;
    analyser.fftSize = 1024;
   
    sourceNode = context.createBufferSource();
   
    sourceNode.connect(analyser);
   
    analyser.connect(javascriptNode);
   
    sourceNode.connect(context.destination);

    javascriptNode.onaudioprocess = function() {
      let array =  new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      average = getAverageVolume(array);
      frequencys = array;

      if (average != 0) {
        soundStarted = 1;
      }

      if (soundStarted == 1 && average == 0) {
        soundStarted = 0;
        document.getElementById('container').classList.remove('leave');
        begin.classList.remove('leave');
        formMusic.classList.remove('inc');
        textIntro.textContent = 'Retry the experiment';
        isLaunch = 0;
      }
    }
}

   
function getAverageVolume (array) {
    let values = 0;
    let average;
   
    let length = array.length;
    for (let i = 0; i < length; i++) {
        values += array[i];
    }
   
    average = values / length;
    return average;
}

function handleFileSelect (evt) {
    let files = evt.srcElement.files;
    let reader = new FileReader();

    if (files[0].type.match('audio.*')) {
      reader.onload = (function(file) {
        return function (e) {
          audio = new Audio();
          audio.loadSound(e.target.result);
        }
      })(files[0]);

      isLaunch = 1;

      reader.readAsArrayBuffer(files[0]);
    }

    document.getElementById('container').classList.add('leave');
    average = 0;
}

 
