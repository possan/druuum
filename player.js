(function(exports) {

	var Player = function() {
		this.bpm = 0;
		this.position = 0;
		this.pattern = null;
		this.sampler = null;
		this.delay = 0;
		this.interval = 1000;
		this.setBPM(120);
		this.timer = null;
		this.beattimer = 0;
		this.lasttime = 0;
	}

	Player.prototype.tick = function() {
		this.pattern.position = this.position;
		// console.log('Player tick', this.pattern.position);
		for(var i=0; i<this.pattern.tracks.length; i++) {
			var trk = this.pattern.tracks[i];
			if (trk.steps[this.position] == 1) {
				this.sampler.trigSlice(trk.slice);
			}
		}
		this.position ++;
		this.position %= 16;
	}

	Player.prototype.subtimer = function() {
		var t = (new Date()).getTime();
		if (this.lasttime == 0)
			this.lasttime = t;
		var dt = t - this.lasttime;
		this.lasttime = t;
		this.beattimer += dt;
		// console.log('subtimer', this.beattimer, dt);
		if (this.beattimer > this.interval) {
			this.tick();
			while(this.beattimer > this.interval) {
				this.beattimer -= this.interval;
			}
		}
	}

	Player.prototype.play = function() {
		if (this.timer == null) {
			console.log('bpm = '+ this.bpm);
			this.lasttime = 0;
			this.timer = setInterval(this.subtimer.bind(this), 25);
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
		this.interval = 1000.0 / (this.bpm * 4.0 / 60.0);
		console.log('set interval', this.interval);
	}

	exports.Player = Player;

})(window || this);
