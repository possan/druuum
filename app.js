(function(exports) {

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
