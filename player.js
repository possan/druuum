(function(exports) {

	var Player = function() {
		this.bpm = 0;
		this.position = 0;
		this.pattern = null;
		this.sampler = null;
		this.delay = 0;
		this.setBPM(120);
		this.timer = null;
	}

	Player.prototype.tick = function() {
		this.pattern.position = this.position;
		// console.log('Player tick', this.pattern.position);
		for(var i=0; i<this.pattern.tracks.length; i++) {
			var trk = this.pattern.tracks[i];
			if (trk.steps[this.position] == 1) {
				this.sampler.trig(trk.url, trk.offset, trk.decay);
			}
		}
		this.position ++;
		this.position %= 16;
	}

	Player.prototype.play = function() {
		if (this.timer == null) {
			var iv = 1000.0 / (this.bpm * 4.0 / 60.0);
			console.log('bpm = '+ this.bpm + ', interval=' + iv);
			this.timer = setInterval(this.tick.bind(this), iv);
		}
	}

	Player.prototype.stop = function() {
		if (this.timer != null) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}

	Player.prototype.setBPM = function(bpm) {
		console.log('set bpm', bpm);
		this.bpm = bpm;
	}

})(window || this);
