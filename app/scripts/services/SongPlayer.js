(function() {
  function SongPlayer($rootScope, Fixtures) {
    var SongPlayer = {};

    var currentAlbum = Fixtures.getAlbum();

    /**
     * @desc Buzz object audio file
     * @type {Object}
     */
    var currentBuzzObject = null;

    /**
     * @function setSong
     * @desc Stops currently playing song and loads new audio file as currentBuzzObject
     * @param {Object} song
     */
    var setSong = function(song) {
      if (currentBuzzObject) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      };

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentBuzzObject.bind('timeupdate', function() {
        $rootScope.$apply(function() {
          SongPlayer.currentTime = currentBuzzObject.getTime();
        });
      });

      SongPlayer.currentSong = song;
    };

    var playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
    }

    /**
     * @function stopSong
     * @desc stops currentBuzzObject and set playing property to null
     * @param {Object} song
     */
    var stopSong = function(song) {
      currentBuzzObject.stop();
      song.playing = null;
    }

    /**
     *@function getSongIndex
     * @desc returns the song with index of the song parameter
     * @param {Object} song
     */
    var getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    };

    /**
     * @desc Active song object from list of songs
     * @type {Object}
     */
    SongPlayer.currentSong = null;
    /**
     * @desc Current playback time (in seconds) of currently playing song
     * @type {Number}
     */
    SongPlayer.currentTime = null;

    /**
    * @desc current volume of playing song
    * @type {Number}
    */
    SongPlayer.volume = 35;

    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
        setSong(song);
        playSong(song);
      } else if (SongPlayer.currentSong === song) {

        if (currentBuzzObject.isPaused()) {
          playSong(song);
        }
      }
    };

    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

    /**
     * @function SongPlayer.previous
     * @desc changes currently playing song to the previous song on album
     */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
        if (currentBuzzObject !== null) {

          currentBuzzObject.stop();
          SongPlayer.currentSong.playing = null;

        }
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;
      var song = currentAlbum.songs[currentSongIndex];
      if (currentSongIndex > currentAlbum.songs.length - 1) {
        if (currentBuzzObject !== null) {

          currentBuzzObject.stop();
          SongPlayer.currentSong.playing = null;

        }
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;

      } else {

        setSong(song);
        playSong(song);
      }
    };
    /**
     * @function setCurrentTime
     * @desc Set current time (in seconds) of currently playing song
     * @param {Number} time
     */
    SongPlayer.setCurrentTime = function(time) {
      if (currentBuzzObject) {
        currentBuzzObject.setTime(time);
      }
    };

    SongPlayer.setVolume = function(volume) {
      if (currentBuzzObject) {
        currentBuzzObject.setVolume(volume);
      }
    };

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
