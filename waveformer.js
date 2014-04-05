(function(exports) {

	var Waveformer = function(element) {
		this.element = document.getElementById(element);
		this.offset = 0;
		this.decay = 0;
		this.url = '';
		this.sampler = null;
		this.samples = new Float32Array(0);
		this.onUpdate = null;
		this.onUpdateSlice = null;
		this.onPreview = null;
		this.context = this.element.getContext('2d');

		var _this = this;

		this.element.addEventListener('resize', function() {
			_this.draw();
		});

		var dragpoint = 0;

		function dragX(x) {
			if (dragpoint == 0)
				return;
			var dur = _this.samples.length / 44100.0;
			var w = _this.element.offsetWidth;
			var t = 1000.0 * x / w * dur;

			if (dragpoint == 1) {
				_this.offset = t;
			}
			if (dragpoint == 2) {
				_this.decay = Math.max(20, t - _this.offset);
			}

			if (_this.onUpdate) {
				_this.onUpdate(_this.url, _this.offset, _this.decay);
			}

			if (_this.onUpdateSlice) {
				var tmpslice = new Slice();
				tmpslice.url = _this.url;
				tmpslice.offset = _this.offset;
				tmpslice.decay = _this.decay;
				 _this.onUpdateSlice(tmpslice);
			}
			_this.draw();
		}

		this.element.addEventListener('mousedown', function(e) {
			var h = _this.element.offsetHeight;

			if (e.offsetY < 50) {
				dragpoint = 1;
 				dragX(e.offsetX);
 			}

			if (e.offsetY > h - 50) {
 				dragpoint = 2;
 				dragX(e.offsetX);
 			}
		});

		this.element.addEventListener('mouseup', function(e) {
			dragpoint = 0;

			if (_this.onPreview) {
				var tmpslice = new Slice();
				tmpslice.url = _this.url;
				tmpslice.offset = _this.offset;
				tmpslice.decay = _this.decay;
				_this.onPreview(tmpslice);
			}
		});

		this.element.addEventListener('mousemove', function(e) {
			dragX(e.offsetX);
		});
	}

	Waveformer.prototype.reload = function(url) {
		console.log('reload waveformer', url);
		this.url = url;
		var _this = this;
		this.sampler.preload(url, function() {
			var tmp = _this.sampler.getSamples(url);
			if (tmp) {
				_this.samples = tmp;
			} else {
				_this.samples = new Float32Array(0);
			}
			console.log('got samples:', _this.samples.length);
			_this.draw();
		});
	}

	Waveformer.prototype.setSlice = function(slice) {
		if (slice) {
			this.reload(slice.url);
			this.offset = slice.offset;
			this.decay = slice.decay;
		}
		this.draw();
	}

	Waveformer.prototype.draw = function() {
		var w = this.element.offsetWidth;
		var h = this.element.offsetHeight;
		var dur = this.samples.length / 44100.0;
		// console.log('draw',w,h,dur);
		this.context.clearRect(0, 0, w, h);
		this.context.fillStyle = '#010';
		this.context.fillRect(0, 0, w, h);
		this.context.fillStyle = '#070';
		var selx = w * this.offset / 1000 / dur;
		var selw = w * this.decay / 1000 / dur;
		this.context.fillRect(selx, 0, selw, h);
		this.context.fillStyle = '#0f0';
		for(var i=0; i<w; i++) {
			var o = Math.floor(i * this.samples.length / w);
			var f = this.samples[o];
			var fh = h * f / 1.0;
			this.context.fillRect(i, h/2-fh/2, 1, fh);
		}
	}

	exports.Waveformer = Waveformer;

})(window || this);
