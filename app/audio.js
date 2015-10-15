'use strict';

var soundStarted = 0,
	isLaunch = 0,
	countEnd = 0,
	oldAverage = 0,
	textIntro = document.getElementById('text-intro'),
	isEnded = 0;

function Audio() {
	this.analyserNode;
	this.buffer;
	this.context;
	this.frequencyData;
	this.source;
	this.init();
}


Audio.prototype.init = function() {
	try {
    	// Fix up for prefixing
    	window.AudioContext = window.AudioContext||window.webkitAudioContext;
    	this.context = new AudioContext();
  	}
  	catch(e) {
    	alert('Web Audio API is not supported in this browser');
  	}
}
/** Chargement du son **/
Audio.prototype.loadSound = function(url) {
	var that = this;
	this.context.decodeAudioData(url, function(buffer) {
		that.buffer = buffer;
		that.playSound();
	}, that.onError);
}
/** Lancement du Son **/
Audio.prototype.playSound = function() {
	this.source = this.context.createBufferSource();
	this.source.buffer = this.buffer;
	this.source.connect(this.context.destination);
	this.analyserNode = this.context.createAnalyser();
	this.source.connect(this.analyserNode);
	this.analyserNode.connect(this.context.destination);
	this.source.start(0);
	this.frequencyData = new Uint8Array(this.analyserNode.frequencyBinCount);
	this.update();
}
/** Mets à jour la fréquence moyenne et la retourne **/
Audio.prototype.update = function() {
	if (this.analyserNode == undefined) {
		return 0;
	} else {
		if (isEnded == 0) {
			isLaunch = 1;
		}
		
		this.analyserNode.getByteFrequencyData(this.frequencyData);
		var averageAudio = 0;
		var values = 0;
		var frequencyLength = this.frequencyData.length;

		for (var i = 0; i < frequencyLength; i++) {
			values += this.frequencyData[i];
		};


		if (countEnd <= 100 && isLaunch == 1) {
			averageAudio = values / frequencyLength;
		}	

		if (oldAverage == averageAudio && soundStarted == 1 && isEnded == 0) {
			countEnd ++;
		}

		if (countEnd >= 5 && averageAudio == 0 && soundStarted == 1 && isEnded == 0) {
			soundStarted = 0;
			document.getElementById('container').classList.remove('leave');
			document.getElementById('begin').classList.remove('leave');
	        document.getElementById('form-music').classList.remove('inc');
			textIntro.textContent = 'Retry the experiment';
			isLaunch = 0;
			averageAudio = null;
			isEnded = 1;
			countEnd = 0;
		}

		oldAverage = averageAudio;
		
		if (averageAudio != 0 && averageAudio != null) {	
	    	soundStarted = 1;
	    }

		return averageAudio;
	}
}
/** Message d'erreur **/
Audio.prototype.onError = function() {
	alert('Impossible de décoder la musique');
}