(function(exports) {

	var Pattern = function() {
		this.position = 0;
		this.numtracks = 4;
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

	exports.Pattern = Pattern;

})(window || this);
