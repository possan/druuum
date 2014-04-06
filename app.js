(function(exports) {

	var samplepresets = [
		{
			name: "Oizo Glitch Snare",
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/2bcb0f4c8a9d44a6ee5b357b1c9c9d7d0d61b0a1',
			offset: 1370,
			decay: 465
		},
		{
			name: 'Oizo Glitch Beep',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/2bcb0f4c8a9d44a6ee5b357b1c9c9d7d0d61b0a1',
			offset: 6250,
			decay: 400
		},
		{
			name: 'Oizo Tap',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/f3a25ffd7a41cc43bf999a75f7015689d54d6f2a',
			offset: 3380,
			decay: 245
		},
		{
			name: 'Oizo Bass',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/2bcb0f4c8a9d44a6ee5b357b1c9c9d7d0d61b0a1',
			offset: 2080,
			decay: 465
		},
		{
			name: '909 Kick',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/80977913b0113c6262d9315569089d5ed5d7cf8e',
			offset: 25,
			decay: 1500
		},
		{
			name: 'Daft Primitive',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/a9e4e5d4b60706b45ae12188b19797eb06328361',
			offset: 4060,
			decay: 500
		},
		{
			name: 'Voice: Nine',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/4c45d849156647c2a736bc2b0fe7e2fde64cea19',
			offset: 1620,
			decay: 900
		},
		{
			name: 'Average brushy hat',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/369de4c8d0ae1da72a7bfc56031c8b51d420c617',
			offset: 20,
			decay: 200
		},
		{
			name: 'Closed hat',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/911e76f1691a4b0d3429dcafd0d593bce80cca94',
			offset: 40,
			decay: 150
		},
		{
			name: 'Chip music stab',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/6caec03ceea0e6eab2fa058b9f830d623dcafcef',
			offset: 4505,
			decay: 345
		},
		{
			name: 'Dist synth stab',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/ee942142637df559bdff7bd50aafa8c336f60296',
			offset: 3580,
			decay: 250
		},
		{
			name: 'Dist synth stab',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/ee942142637df559bdff7bd50aafa8c336f60296',
			offset: 3475,
			decay: 340
		},
		{
			name: 'Dubmood snare',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/4fb74bba93db264b413041741f89e5ee74f57ab2',
			offset: 7130,
			decay: 230
		},
		{
			name: 'Jarre Synth 1',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/47b49bcdae0e104d50ff1e217b4137a67b98ef38',
			offset: 4395,
			decay: 365
		},
		{
			name: 'Broken note stab',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/6be6a45f7f376f6a9646df5162ef7402c3085c28',
			offset: 5095,
			decay: 350
		},
		{
			name: 'Broken note stab 2',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/6be6a45f7f376f6a9646df5162ef7402c3085c28',
			offset: 6270,
			decay: 350
		},
		{
			name: 'Broken note stab 3',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/6be6a45f7f376f6a9646df5162ef7402c3085c28',
			offset: 5470,
			decay: 440
		},
		{
			name: 'Lullaby choir',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/d9d8686acc79916d2db76abdaa2c18a594fed332',
			offset: 4840,
			decay: 935
		},
		{
			name: 'Tilliander kick',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/812604d13bc31f2583bb18ea24e18ed302b42065',
			offset: 2045,
			decay: 320
		},
		{
			name: 'Tilliander stab',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/812604d13bc31f2583bb18ea24e18ed302b42065',
			offset: 4855,
			decay: 235
		},
		{
			name: 'Terje stab',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/6a0945bbb0a446ba5c0e909010b4f42e1d780893',
			offset: 5335,
			decay: 365
		},
		{
			name: 'Abba stab',
			url: 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/012502941161f69d6dc62d1b0f29bf9df88dbbb7',
			offset: 5060,
			decay: 175
		}
	];

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

	TableSequencer.prototype.savevolume = function(t, e) {
		console.log('assign volume', t, e);
		var v = (0+$(e.target).val()) / 100.0;
		console.log(v);
		this.pattern.tracks[t].slice.gain = v;
	}

	TableSequencer.prototype.savepitch = function(t, e) {
		console.log('assign pitch', t, e);
		var v = (0+$(e.target).val()) / 100.0;
		console.log(v);
		this.pattern.tracks[t].slice.pitch = v;
	}

	TableSequencer.prototype.draw = function() {
		var _this = this;
		this.element.html('');
		for(var i=0; i<this.pattern.tracks.length; i++) {
			var trk = this.pattern.tracks[i];
			var tr = $('<tr>');
			if (i == this.selectedtrack) tr.addClass('selected');
			var td1 = $('<th>');
			td1.text('Track '+(1+i));
			td1.click(this.assigntrack.bind(this, i));
			tr.append(td1);
			for(var j=0; j<this.pattern.numsteps; j++) {
				var td = $('<td>');
				td.addClass('c' + j);
				if (trk.steps[j] == 1) td.addClass('on');
				td.html('<span></span>');
				// td.text(trk.steps[j] + '_');
				td.click(this.toggle.bind(this, i, j));
				tr.append(td);
			}
			var td2 = $('<th>');
			var ra1 = $('<input type=\"range\" min=0 max=200 step=10 />');
			ra1.val(Math.round(trk.slice.gain * 100));
			td2.append(ra1);
			ra1.change(this.savevolume.bind(this, i));
			tr.append(td2);
			td2 = $('<th>');
			var ra2 = $('<input type=\"range\" min=0 max=200 step=10 />');
			ra2.val(Math.round(trk.slice.pitch * 100));
			td2.append(ra2);
			ra2.change(this.savepitch.bind(this, i));
			tr.append(td2);
			this.element.append(tr);
		}
	}

	TableSequencer.prototype.tick = function() {
		this.element[0].className = 'c' + this.pattern.position;
	}



	var SliceEditor = function(sampler) {
		this.wf = new Waveformer('waveformeditor');
		this.wf.sampler = sampler;
		this.sampler = sampler;
		this.onUpdate = null;
		this.wf.offset = 50;
		this.wf.decay = 250;
		this.onPreview = null;

		var _this = this;
		// wf.reload('http://d318706lgtcm8e.cloudfront.net/mp3-preview/8f1b97e018fa23643e05abace8305e4e25ec4be6');

		this.wf.onUpdateSlice = function(slice) {
			$('#offset').val('' + slice.offset);
			$('#decay').val('' + slice.decay);
			$('#url').val(slice.url);
			// doAssign();
			if (_this.onUpdate) _this.onUpdate(slice);
		}

		this.wf.onPreview = function(slice) {
			_this.sampler.trigSlice(slice);
			if (_this.onPreview) _this.onPreview(slice);
		}

		this.wf.draw();

		function doTry() { }

		$('#try').click(function(e) {
			// doTry();
		});

		var el = $('#samplepresets');
		samplepresets.forEach(function(r) {
			var el2 = $('<button />');
			el2.click(_this.loadPreset.bind(_this, r));
			el2.text(r.name);
			el.append(el2);
		});
	}

	SliceEditor.prototype.loadPreset = function(slice) {
		this.setSlice(slice);
		if (this.onUpdate) this.onUpdate(this.getSlice());
	}

	SliceEditor.prototype.setSlice = function(slice) {
		if (slice) {
			$('#url').val('' + slice.url);
			$('#offset').val('' + slice.offset);
			$('#decay').val('' + slice.decay);
			this.wf.setSlice(slice);
		}
		this.wf.draw();
	}

	SliceEditor.prototype.draw = function() {
		this.wf.draw();
	}

	SliceEditor.prototype.setUrl = function(url) {
		$('#url').val(url);
		this.wf.setSlice(this.getSlice());
		$('#url').val(url);
		if (this.onUpdate) this.onUpdate(this.getSlice());
		this.wf.draw();
	}

	SliceEditor.prototype.getSlice = function() {
		var url = $('#url').val();
		var offset = parseFloat($('#offset').val());
		var decay = parseFloat($('#decay').val());
		var tmpslice = new Slice();
		tmpslice.url = url;
		tmpslice.offset = offset;
		tmpslice.decay = decay;
		return tmpslice;
	}















	window.addEventListener('load', function() {
		var pat = new Pattern();

		function persist() {
			var json = pat.toJson();
			// console.log('persisting json', json);
			location.hash = window.btoa(json);
		}

		var ts = new TableSequencer();
		ts.create('seq');
		ts.pattern = pat;
		ts.onSelectTrack = function(trk) {
			var trkobj = pat.tracks[trk];
			se.setSlice(trkobj.slice);
		}

		var sampler = new Sampler();

		var se = new SliceEditor(sampler);
		se.setSlice(null);
		se.onUpdate = function(slice) {
			if (ts.selectedtrack != -1) {
				pat.tracks[ts.selectedtrack].slice = slice;
				persist();
			}
		}
		se.onPreview = function(slice) {
			sampler.trigSlice(slice);
		}

		var player = new Player();
		player.pattern = pat;
		player.sampler = sampler;
		player.setBPM(125);

		setInterval(function() {
			ts.tick();
		}, 100);

		setInterval(function() {
			persist();
		}, 2000);

		$('#play').click(function(e) {
			player.play();
		});

		$('#stop').click(function(e) {
			player.stop();
		});

		$('#bpm').change(function(e) {
			var bpm = $('#bpm').val();
			player.setBPM(bpm);
			persist();
		});

		function doAssign() {
			if (this.ts.selectedtrack != -1) {
				pat.tracks[ts.selectedtrack].slice = se.getSlice();
			}
		}

		$('#assign').click(function(e) {
			doAssign();
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
						return '<li hit-mp3="' + r.mp3 + '">' + r.name + ' - ' + r.artist + ' - ' + r.album + '</li>';
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
				$('#searchview').hide();
				$('#sampleview').show();
				$('#trackview').hide();
				se.setUrl(mp3);
				se.draw();
			}
		});

		$('#startsearch').click(function(e) {
			$('#searchview').show();
			$('#sampleview').show();
			$('#trackview').hide();
		});

		$('#menutrack').click(function(e) {
			$('#searchview').hide();
			$('#sampleview').hide();
			$('#trackview').show();
		});

		$('#menusample').click(function(e) {
			$('#searchview').hide();
			$('#sampleview').show();
			$('#trackview').hide();
			se.draw();
		});
		
		$('#menusearch').click(function(e) {
			$('#searchview').show();
			$('#sampleview').hide();
			$('#trackview').hide();
		});
		
		// set up defaults

		// 808 kick spotify:track:52VO7qzwlCnGiwnQ1oy5TF http://d318706lgtcm8e.cloudfront.net/mp3-preview/8f1b97e018fa23643e05abace8305e4e25ec4be6
		// cowbell spotify:track:10sAexk1noOsnohztZT7bm http://d318706lgtcm8e.cloudfront.net/mp3-preview/a91dfd60b674cb149c2cf12d423c3c97b44da0cc
		// snare spotify:track:4cd2hrkQiQnXRiqFzdbRHQ http://d318706lgtcm8e.cloudfront.net/mp3-preview/c759211748200d4ac89708687db0807b8af0c8da
		// woodblock spotify:track:5lkdoxB1uwJWtq6DKIy0Qj http://d318706lgtcm8e.cloudfront.net/mp3-preview/3cac6948426ec5636077b8dc375add78c41567c0
		// example spotify:track:4juVieLuIMVYHwSSfR03ey

		// http://d318706lgtcm8e.cloudfront.net/mp3-preview/c662f5b77b16c7d7ba5a0d418dd30fe4e9ff279b

		pat.tracks[0].slice.url = 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/8f1b97e018fa23643e05abace8305e4e25ec4be6';
		pat.tracks[1].slice.url = 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/c759211748200d4ac89708687db0807b8af0c8da';
		pat.tracks[2].slice.url = 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/a91dfd60b674cb149c2cf12d423c3c97b44da0cc';
		pat.tracks[3].slice.url = 'http://d318706lgtcm8e.cloudfront.net/mp3-preview/3cac6948426ec5636077b8dc375add78c41567c0';

		pat.tracks[0].slice.decay = 2000;
		pat.tracks[1].slice.decay = 500;
		pat.tracks[2].slice.decay = 500;
		pat.tracks[3].slice.decay = 500;

		pat.tracks[0].slice.offset = 0;
		pat.tracks[1].slice.offset = 0;
		pat.tracks[2].slice.offset = 0;
		pat.tracks[3].slice.offset = 0;

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

		$('#search').val('909');

		doSearch();

		function checkForLoadSong() {
			console.log('checkForLoadSong', location);
			var data = location.hash.replace(/#/g, '');
			if (data.length > 0) {
				try {
					var json = window.atob(data);
					console.log('loading json', json);
					pat.parseJson(json);
				} catch(e) {
					console.error(e);
				}
			}
		}

		checkForLoadSong();
		ts.draw();

		player.play();
	});

})(window || this);
