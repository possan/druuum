(function(exports) {

	var Search = function() {
	}

	Search.prototype.searchTracks = function(query, callback) {
		var url = 'https://api.spotify.com/v1/search?type=track&q='+encodeURIComponent(query);
		$.ajax(url, {
			dataType: 'json',
			success: function(r) {
				console.log('got tracks', r);
				callback(r.tracks.items);
			}
		});
	}

	var Track = function() {
	}

	Track.prototype.load = function(id, callback) {
		var url = 'https://api.spotify.com/v1/tracks/'+encodeURIComponent(id);
		$.ajax(url, {
			dataType: 'json',
			success: function(r) {
				console.log('got track', r);
				callback(r);
			}
		});
	}

	var Login = function() {
		this.client_id = '';
		this.access_token = '';
		this.redirect = '';
	}

	Login.prototype.getAccessToken = function() {
		return localStorage.getItem('access_token') || '';
	}

	Login.prototype.setAccessToken = function(access_token) {
		localStorage.setItem('access_token', access_token);
	}

	Login.prototype.getUsername = function() {
		return localStorage.getItem('username') || '';
	}

	Login.prototype.setUsername = function(username) {
		localStorage.setItem('username', username);
	}

	Login.prototype.setClientId = function(client_id) {
		this.client_id = client_id;
	}

	Login.prototype.getClientId = function() {
		return this.client_id;
	}

	Login.prototype.setRedirect = function(redirect) {
		this.redirect = redirect;
	}

	Login.prototype.getRedirect = function() {
		return this.redirect;
	}

	Login.prototype.getLoginURL = function(scopes, state) {
		return 'https://accounts.spotify.com/authorize?client_id=' + this.client_id
			+ '&redirect_uri=' + encodeURIComponent(this.redirect)
			+ '&scope=' + encodeURIComponent(scopes.join(' '))
			+ '&response_type=token';
	}

	Login.prototype.openLogin = function(oldstate) {
		var url = this.getLoginURL(['playlist-read-private','user-read-private'], oldstate);
		location = url;
		// window.open(url);
	}

	Login.prototype.getAuthHeader = function() {
		return 'Bearer ' + this.getAccessToken();
	}

	Login.prototype.getUserInfo = function(callback) {
		var url = 'https://api.spotify.com/v1/me';
		$.ajax(url, {
			dataType: 'json',
			headers: {
				'Authorization': this.getAuthHeader()
			},
			success: function(r) {
				console.log('userinfo', r);
				callback(r);
			}
		});
	}

	var Playlists = function(login) {
		this.login = login;
	}

	Playlists.prototype.getRootlist = function(callback) {
		// x
		var url = 'https://api.spotify.com/v1/users/' + encodeURIComponent(this.login.getUsername()) + '/playlists';
		$.ajax(url, {
			dataType: 'json',
			headers: {
				'Authorization': this.login.getAuthHeader()
			},
			success: function(r) {
				console.log('rootlist', r);
				callback(r);
			}
		});
	}

	Playlists.prototype.getPlaylist = function(user, playlist, callback) {
		// x
		var url = 'https://api.spotify.com/v1/users/' + encodeURIComponent(user) + '/playlists/' + encodeURIComponent(playlist) + '/tracks?limit=500';
		$.ajax(url, {
			dataType: 'json',
			headers: {
				'Authorization': this.login.getAuthHeader()
			},
			success: function(r) {
				console.log('playlist', r);
				callback(r);
			}
		});
	}

	var SpotifyAPI = function() {
		this.Search = new Search();
		this.Track = new Track();
		this.Login = new Login();
		this.Playlists = new Playlists(this.Login);
	}

	exports.SpotifyAPI = SpotifyAPI;

})(window || this);
