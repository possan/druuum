(function(exports) {

	var Slice = function() {
		this.url = '';
		this.offset = 0;
		this.decay = 2000;
		this.gain = 1.0;
		this.pitch = 1.0;
	}


	var Sampler = function() {
		var contextObject = window.AudioContext || window.webkitAudioContext || null;
		if (contextObject === null) {
			throw new Error('AudioContext not supported. :(');
		}
		this.context =  new contextObject();
		this.samples = {};
		this.comp = this.context.createDynamicsCompressor();
		this.comp.threshold = -20;
		this.maxsamples = 44100 * 10;
		this.comp.ratio = 10;
		this.comp.connect(this.context.destination);
		this.mixer = this.context.createGain();
		this.mixer.connect(this.comp);
	}

	Sampler.prototype.getSamples = function(url) {
		if (url) {
			if (typeof(this.samples[url]) != 'undefined') {
				if (this.samples[url].state == 'ready') {
					return this.samples[url].buffer.getChannelData(0);
				}
			}
		}
		return null;
	}

	Sampler.prototype.preload = function(url, callback) {
		var _this = this;
		if (url) {
			if (typeof(this.samples[url]) != 'undefined') {
				if (this.samples[url].state == 'loading') {
					if (callback) {
						this.samples[url].callbacks.push(callback);
					}
					return;
				}
				if (this.samples[url].state == 'ready') {
					if (callback) {
						callback(_this);
					}
					return;
				}
			}

			console.log('Sampler preload url: ' + url);

			var obj = {
				state: 'loading',
				url: url,
				buffer: null,
				element: null,
				callbacks: callback ? [callback] : []
			}

			var proxyurl = 'http://lab.possan.se:1234/' + url.replace('http://', '').replace('https://', '');
			console.log('proxy url', proxyurl);

			var request = new XMLHttpRequest();
			request.open("GET", proxyurl, true);
			request.responseType = "arraybuffer";
			request.onload = function() {
				var audioData = request.response;
				console.log('audio onload', audioData);
				_this.context.decodeAudioData(audioData, function(tmpbuffer) {
					var monobuffer = tmpbuffer.getChannelData(0);
					console.log('monobuffer', monobuffer.length);
					var maxlength = _this.maxsamples;
					var newlength = Math.min(maxlength, monobuffer.length);
					console.log('newlength', newlength);
					var tmpbuffer2 = _this.context.createBuffer(1, maxlength, 44100);
					var audioData2 = tmpbuffer2.getChannelData(0)
					// var audioData2 = new Float32Array(newlength);
					for(var i=0; i<newlength; i++) {
						audioData2[i] = monobuffer[i];
					}
					// tmpbuffer.getChannelData(0).set(audioData2);
					obj.buffer = tmpbuffer2;// _this.context.createBuffer(tmpbuffer, true);
					obj.state = 'ready';
					obj.callbacks.forEach(function(cb) {
						cb(obj);
					});
				}, function() {});

			};
			request.send();

			this.samples[url] = obj;
		}
	}

	Sampler.prototype.trigSlice = function(slice) {
		this._trig(slice.url, slice.offset, slice.decay, slice.gain, slice.pitch);
	}

	Sampler.prototype._trig = function(url, starttime, decay, gain, pitch) {
		if (url) {
			var samp = this.samples[url];
			if (typeof(samp) == 'undefined') {
				this.preload(url);
			}

			samp = this.samples[url];
			if (samp.state == 'ready') {
				// console.log('starting ' + url + ', offset=' + starttime+ ', decay='+decay+', gain='+gain+', pitch='+pitch);
				var tmpgain = this.context.createGain();
				tmpgain.gain.value = gain;
				// tmpgain.gain.linearRampToValueAtTime(this.context.currentTime + decay / 1000.0 * 0.00, gain || 1.00);
				tmpgain.gain.linearRampToValueAtTime(gain, this.context.currentTime + decay / 1000.0 * 0.75);
				tmpgain.gain.linearRampToValueAtTime(0.00, this.context.currentTime + decay / 1000.0 * 1.00);
				tmpgain.connect(this.mixer);
				var tmpsource = this.context.createBufferSource();
				// console.log(tmpsource);
				tmpsource.buffer = samp.buffer;
				tmpsource.connect(tmpgain);
				tmpsource.playbackRate.value = pitch || 1.0;
				tmpsource.start(0, starttime / 1000.0, decay / 1000.0);
			}

			if (samp.state == 'loading') {
				console.log('not playing ' + url + ', still loading...');
				// this.samples[url].play();
				// do something.
			}
		}
	}

	exports.Slice = Slice;
	exports.Sampler = Sampler;

})(window || this);
