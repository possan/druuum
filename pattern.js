(function(exports) {

	var Pattern = function() {
		this.position = 0;
		this.numtracks = 8;
		this.numsteps = 16;
		this.tracks = [];
		for(var i=0; i<this.numtracks; i++) {
			this.tracks.push(new Track(this.numsteps));
		}
	}

	Pattern.prototype.set = function(r, c, v) {
		this.tracks[r].steps[c] = v;
	}

	Pattern.prototype.get = function(r, c) {
		return this.tracks[r].steps[c];
	}

	Pattern.prototype.toggle = function(r, c) {
		var v = this.get(r, c);
		this.set(r, c, 1 - v);
	}

	Pattern.prototype.toJson = function() {
		var ret = [];
		for(var i=0; i<this.tracks.length; i++) {
			var trkin = this.tracks[i];
			var steps = trkin.steps.join('');
			var trkout = {
				u: trkin.slice.url,
				o: trkin.slice.offset,
				d: trkin.slice.decay,
				g: trkin.slice.gain,
				p: trkin.slice.pitch,
				t: steps
			}
			ret.push(trkout);
		}
		return JSON.stringify(ret);
	}

	Pattern.prototype.parseJson = function(json) {
		var obj = JSON.parse(json);
		if (obj) {
			for(var i=0; i<obj.length; i++) {
				var trkin = obj[i];
				var trkout = this.tracks[i];
				var steps = (trkin.t || '0000000000000000').split('').map(function(r) { return parseInt(r, 10); });
				trkout.slice.url = trkin.u || '';
				trkout.slice.offset = trkin.o;
				trkout.slice.decay = trkin.d;
				trkout.slice.gain = trkin.g;
				trkout.slice.pitch = trkin.p;
				trkout.steps = steps;
			}
		}
	}

	exports.Pattern = Pattern;

})(window || this);
