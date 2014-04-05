(function(exports) {

	var Search = function() {
	}

	Search.prototype.searchTracks = function(query, callback) {

		var url = 'https://api.spotify.com/v1/search?type=Track&q='+encodeURIComponent(query);
		$.ajax(url, {
			dataType: 'json',
			success: function(r) {
				console.log('got tracks', r);
				callback(r.tracks);
			}
		})
	}

	var Track = function() {
	}

	Track.load = function(id, callback) {
	}

	var SpotifyAPI = function() {
		this.Search = new Search();
		this.Track = new Track();
	}

	exports.SpotifyAPI = SpotifyAPI;

})(window || this);
