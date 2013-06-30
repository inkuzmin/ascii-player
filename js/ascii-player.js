/**
 * Created by JetBrains PhpStorm.
 * User: inkuzmin
 * Date: 7/1/13
 * Time: 3:27 AM
 */

A = ASCIIPlayer = function (el, options) {
    var self = this;
    self.el = el;
    self._obtainOptions(options);
    self._init();
}
A.prototype = {
    constructor: ASCIIPlayer,
    _obtainOptions: function (options) {
        var self = this;
        self.options = {};
        for (var param in options) {
            if (options.hasOwnProperty(param))
                self.options[param] = options[param];
        }
    },
    _init: function () {
        var self = this;

        self._initVars();
        self._render();
        self._getElements();
        self._bindHandlers();

    },
    _initVars: function () {
        var self = this;
        self.src = self.el.src;
        self.artist = self.options.artist;
        self.title = self.options.title;
        self.id = self.el.id;
    },
    _render: function () {
        var self = this;
        var templ = '<div class="player" id="player' + self.id + '">' +
                    '   <audio src="' + self.src + '" id="audio' + self.id + '">' + '</audio>' +
                    '   <div class="ctrl play-btn" id="play' + self.id + '">' +
                    '       <div>' + A.S.l + '</div>' +
                    '       <div id="play-symbol' + self.id + '">' + A.S.p + '</div>' +
                    '       <div>' + A.S.r + '</div>' +
                    '   </div>' +
                    '   <div class="separator">' + A.S.s + '</div>' +
                    '   <div class="ctrl progress">' +
                    '       <div>' + A.S.l + '</div>' +
                            self._renderProgress(10) +
                    '       <div>' + A.S.r + '</div>' +
                    '       <div id="time' + self.id + '">00:00</div>' +
                    '   </div>' +
                    '   <div class="separator">' + A.S.s + '</div>' +
                    '   <div class="tip">Громк.:</div>' +
                    '   <div class="ctrl volume">' +
                    '       <div>' + A.S.l + '</div>' +
                            self._renderVolume(5) +
                    '       <div>' + A.S.r + '</div>' +
                    '   </div>' +
                    '   <div class="separator">' + A.S.s + '</div>' +
                    '   <div class="tip">' +
                    '       <div>' + self.artist + '</div>' +
                    '       <div>' + A.S.d + '</div>' +
                    '       <div>' + self.title + '</div>' +
                    '   </div>' +
                    '</div>';
        var container = document.createElement('div');
        container.innerHTML = templ;
        self._replaceElement(self.el, container);
    },
    _setTime: function () {
        var self = this;
        var time = self._timeFormat(self.audio.duration - self.audio.currentTime);
        self.time.innerHTML = time;
    },
    _getElements: function () {
        var self = this,
            d = document;
        self.player = d.getElementById('player' + self.id);
        self.audio = d.getElementById('audio' + self.id);
        self.play = d.getElementById('play' + self.id);
        self.playSymbol = d.getElementById('play-symbol' + self.id);
        self.time = d.getElementById('time' + self.id);

    },
    _bindHandlers: function () {
        var self = this;
        self.play.addEventListener('click', function () {
            self._play();
        }, false);

        self.audio.addEventListener('durationchange', function () {
            self._setTime();
        }, false);
        self.audio.addEventListener('timeupdate', function () {
            self._setTime();
        }, false);
    },
    _play: function () {
        var self = this;
        if (self.audio.paused) {
            self.audio.play();
            self.playSymbol.innerHTML = A.S.q;
        } else {
            self.audio.pause();
            self.playSymbol.innerHTML = A.S.p;
        }

    },
    _timeFormat: function (secs) {
        var hr  = Math.floor(secs / 3600);
        var min = Math.floor((secs - (hr * 3600))/60);
        var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

        if (min < 10){
          min = "0" + min;
        }
        if (sec < 10){
          sec  = "0" + sec;
        }

        return min + ':' + sec;
    },
    _renderVolume: function (l) {
        var self = this;
        var volume = [];
        for (;l--;) {
            volume.push('<div class="vol">' + A.S.u + '</div>');
        }
        return volume.join('');
    },
    _renderProgress: function (l) {
        var self = this;
        var progress = [];
        for (;l--;) {
            progress.push('<div class="prog">' + A.S.u + '</div>');
        }
        return progress.join('');
    },
    _replaceElement: function (oldEl, newEl) {
        var self = this;
        oldEl.parentNode.replaceChild(newEl, oldEl);
    }
};

A.S = {
    l: '[', // left border
    r: ']', // right border
    p: '>', // play
    q: '#', // pause
    u: '-', // ordinary unit
    w: '–', // before buffered
    s: '|', // separator
    d: '&nbsp;—&nbsp;', // artist delimiter
    o: 'o' // pimpa
};