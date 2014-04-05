(function(exports) {

	var Track = function(numsteps) {
		this.steps = [];
		this.decay = 1000;
		this.offset = 0;
		this.slice = new Slice();
		this.url = '';
		this.numsteps = numsteps;
		for(var i=0; i<this.numsteps; i++) {
			this.steps.push(0);
		}
	}

	exports.Track = Track;

})(window || this);