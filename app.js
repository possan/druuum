(function(exports) {

	var Waveformer = function(element) {
		this.element = document.getElementById(element);
		this.offset = 0;
		this.decay = 0;
		this.url = '';
		this.sampler = null;
		this.samples = new Float32Array(0);
		this.onUpdate = null;
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
			var t = Math.round(1000.0 * x / w * dur);

			if (dragpoint == 1) {
				_this.offset = t;
			}
			if (dragpoint == 2) {
				_this.decay = Math.max(20, t - _this.offset);
			}

			if (_this.onUpdate) _this.onUpdate(_this.url, _this.offset, _this.decay);
			_this.draw();
		}

		this.element.addEventListener('mousedown', function(e) {
			// console.log('mousedown', e);
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
			// console.log('mouseup', e);
			dragpoint = 0;
		});

		this.element.addEventListener('mousemove', function(e) {
			// console.log('mouseup', e);
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

	Waveformer.prototype.draw = function() {
		var w = this.element.offsetWidth;
		var h = this.element.offsetHeight;
		var dur = this.samples.length / 44100.0;
		this.context.clearRect(0, 0, w, h);
		this.context.fillStyle = '#020';
		this.context.fillRect(0, 0, w, h);
		this.context.fillStyle = '#080';
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

	var Track = function(stp) {
		this.steps = [];
		this.decay = 1000;
		this.offset = 0;
		this.url = '';
		this.numsteps = stp;
		for(var i=0; i<this.numsteps; i++) {
			this.steps.push(0);
		}
	}

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

	var TableSequencer = function() {
		this.selectedtrack = -1;
		this.onSelectTrack = null;
	}

	TableSequencer.prototype.create = function(id) {
		this.pattern = null;
		this.element = $('#'+id);
	}

	TableSequencer.prototype.toggle = function(r, c) {
		console.log('toggle', r, c);
		this.pattern.toggle(r, c);
		this.draw();
	}

	TableSequencer.prototype.assigntrack = function(t) {
		console.log('assign track', t);
		if (t == this.selectedtrack) {
			this.selectedtrack = -1;
			this.draw();
			if (this.onSelectTrack) this.onSelectTrack(this.selectedtrack);
		}
		else {
			this.selectedtrack = t;
			this.draw();
			if (this.onSelectTrack) this.onSelectTrack(this.selectedtrack);
		}
	}

	TableSequencer.prototype.draw = function() {
		var _this = this;
		this.element.html('');
		for(var i=0; i<this.pattern.tracks.length; i++) {
			var trk = this.pattern.tracks[i];
			var tr = $('<tr>');
			if (i == this.selectedtrack) tr.addClass('selected');
			var td1 = $('<th>');
			td1.text('track #'+i);
			td1.click(this.assigntrack.bind(this, i));
			tr.append(td1);
			for(var j=0; j<this.pattern.numsteps; j++) {
				var td = $('<td>');
				if (trk.steps[j] == 1) td.addClass('on');
				if (j == this.pattern.position) td.addClass('cursor');
				if ((j % 4) == 0) td.addClass('beat');
				td.text(trk.steps[j] + '_');
				td.click(this.toggle.bind(this, i, j));
				tr.append(td);
			}
			this.element.append(tr);
		}
	}

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

	window.addEventListener('load', function() {
		var pat = new Pattern();
		pat.set(0, 0, 1);
		pat.set(0, 4, 1);
		pat.set(0, 8, 1);
		pat.set(0, 12, 1);
		pat.set(1, 4, 1);
		pat.set(1, 11, 1);
		pat.set(1, 14, 1);
		pat.set(2, 6, 1);
		pat.set(2, 10, 1);
		pat.set(3, 0, 1);

		var ts = new TableSequencer();
		ts.create('seq');
		ts.pattern = pat;
		ts.onSelectTrack = function(trk) {
			var trkobj = pat.tracks[trk];
			wf.offset = trkobj.offset;
			wf.decay = trkobj.decay;
			$('#url').val(trkobj.url);
			$('#offset').val(''+trkobj.offset);
			$('#decay').val(''+trkobj.decay);
			wf.reload(trkobj.url);
		}
		ts.draw();

		var sampler = new Sampler();
		sampler.preload('');

		var player = new Player();
		player.pattern = pat;
		player.sampler = sampler;
		player.setBPM(125);

		setInterval(function() {
			ts.draw();
		}, 500);

		var wf = new Waveformer('waveformeditor');

		$('#play').click(function(e) {
			player.play();
		});

		$('#stop').click(function(e) {
			player.stop();
		});

		$('#bpm').change(function(e) {
			var bpm = $('#bpm').val();
			player.setBPM(bpm);
		});

		function doAssign() {
			var url = $('#url').val();
			var offset = parseInt($('#offset').val(), 10);
			var decay = parseInt($('#decay').val(), 10);
			sampler.preload(url);
			if (ts.selectedtrack != -1) {
				pat.tracks[ts.selectedtrack].url = url;
				pat.tracks[ts.selectedtrack].offset = offset;
				pat.tracks[ts.selectedtrack].decay = decay;
			}
		}

		$('#assign').click(function(e) {
			doAssign();
		});

		function doTry() {
			var url = $('#url').val();
			var offset = parseInt($('#offset').val(), 10);
			var decay = parseInt($('#decay').val(), 10);
			sampler.preload(url, function() {
				sampler.trig(url, offset, decay);
				wf.reload(url);
				wf.offset = offset;
				wf.decay = decay;
				wf.draw();
			});

			if (ts.selectedtrack != -1) {
				pat.tracks[ts.selectedtrack].url = url;
				pat.tracks[ts.selectedtrack].offset = offset;
				pat.tracks[ts.selectedtrack].decay = decay;
			}
		}

		$('#try').click(function(e) {
			doTry();
		});

		var api = new SpotifyAPI();

		var doSearch = function() {
			var q = $('#search').val();
			if (q != '') {
				console.log('search for', q);
				api.Search.searchTracks(q, function(r) {
					var filt = r.map(function(item) {
						return {
							name: item.name,
							album: item.album.name,
							artist: item.artists[0].name,
							id: item.id,
							mp3: item.preview_url
						}
					});
					console.log(r);
					var ht = filt.map(function(r) {
						return '<li hit-mp3="' + r.mp3 + '">' + JSON.stringify(r, null, 2) + '</li>';
					});
					$('#searchresults').html(ht.join(''));
				})
			} else {
				$('#searchresults').html('');
			}
		}

		$('#search').keyup(function(e) {
			doSearch();
		});

		$('#searchresults').click(function(e) {
			console.log('click searchresult', e);
			var targ = $(e.target);
			var mp3 = targ.attr('hit-mp3');
			console.log('mp3 link', mp3);
			if (mp3 != '') {
				$('#url').val(mp3);
				doTry();
			}
		});

		// 808 kick spotify:track:52VO7qzwlCnGiwnQ1oy5TF http://d318706lgtcm8e.cloudfront.net/mp3-preview/8f1b97e018fa23643e05abace8305e4e25ec4be6
		// cowbell spotify:track:10sAexk1noOsnohztZT7bm http://d318706lgtcm8e.cloudfront.net/mp3-preview/a91dfd60b674cb149c2cf12d423c3c97b44da0cc
		// snare spotify:track:4cd2hrkQiQnXRiqFzdbRHQ http://d318706lgtcm8e.cloudfront.net/mp3-preview/c759211748200d4ac89708687db0807b8af0c8da
		// woodblock spotify:track:5lkdoxB1uwJWtq6DKIy0Qj http://d318706lgtcm8e.cloudfront.net/mp3-preview/3cac6948426ec5636077b8dc375add78c41567c0
		// example spotify:track:4juVieLuIMVYHwSSfR03ey

		pat.tracks[0].url = 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/8f1b97e018fa23643e05abace8305e4e25ec4be6';
		pat.tracks[1].url = 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/c759211748200d4ac89708687db0807b8af0c8da';
		pat.tracks[2].url = 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/a91dfd60b674cb149c2cf12d423c3c97b44da0cc';
		pat.tracks[3].url = 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/3cac6948426ec5636077b8dc375add78c41567c0';

		pat.tracks[0].decay = 2000;
		pat.tracks[1].decay = 500;
		pat.tracks[2].decay = 500;
		pat.tracks[3].decay = 500;

		pat.tracks[0].offset = 0;
		pat.tracks[1].offset = 0;
		pat.tracks[2].offset = 0;
		pat.tracks[3].offset = 0;

		wf.offset = 50;
		wf.sampler = sampler;
		wf.decay = 250;
		wf.reload('http://d318706lgtcm8e.cloudfront.net/mp3-preview/8f1b97e018fa23643e05abace8305e4e25ec4be6');
		wf.onUpdate = function(url, o, d) {
			$('#offset').val(''+o);
			$('#decay').val(''+d);
			doAssign();
		}
		wf.draw();

		$('#search').val('909 kick');

		doTry();
		doSearch();

		// player.play();
	});

})(window || this);