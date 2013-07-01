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
        self._initAudio();
        self._render();
        self._getElements();
        self._bindHandlers();

        self._setVolumeLevel(0.75);

    },
    _initVars: function () {
        var self = this;
        self.src = self.el.src;
        self.artist = self.options.artist;
        self.title = self.options.title;
        self.id = self.el.id;
    },
    _initAudio: function () {
        var self = this;
        self.audio = new Audio();
        self.audio.setAttribute('src', self.src);
//        self.audio.setAttribute('type', 'audio/mpeg');
        self.audio.setAttribute('preload', true);
//        self.audio.load();
    },
    _render: function () {
        var self = this;
        var templ = '<div class="player" id="player' + self.id + '">' +
                    '   <div class="ctrl play-btn" id="play' + self.id + '">' +
                    '       <div>' + A.S.l + '</div>' +
                    '       <div id="play-symbol' + self.id + '">' + A.S.p + '</div>' +
                    '       <div>' + A.S.r + '</div>' +
                    '   </div>' +
                    '   <div class="separator">' + A.S.s + '</div>' +
                    '   <div class="ctrl progress">' +
                    '       <div>' + A.S.l + '</div>' +
                    '       <div id="progress' + self.id + '">' + self._renderProgress(20) + '</div>' +
                    '       <div>' + A.S.r + '</div>' +
                    '       <div id="time' + self.id + '">88:88</div>' +
                    '   </div>' +
                    '   <div class="separator">' + A.S.s + '</div>' +
                    '   <div class="tip">Vol.:</div>' +
                    '   <div class="ctrl volume">' +
                    '       <div>' + A.S.l + '</div>' +
                    '       <div id="volume' + self.id + '">' + self._renderVolume(5) + '</div>' +
                    '       <div>' + A.S.r + '</div>' +
                    '       <div id="level' + self.id + '">88%</div>' +
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
        self.timeNode.innerHTML = time;
    },
    _setVolumeLevel: function (volumeLevel) {
        var self = this;
        volumeLevel = volumeLevel;
        self._setVolumePimpa(volumeLevel);

        self.audio.volume = volumeLevel;
        volumeLevel = (volumeLevel*100) + '%';
        self.levelNode.innerHTML = volumeLevel;
    },
    _setVolumePimpa: function (volumeLevel) {
        var self = this;

        var length = self.vols.length;
        var vols = self.vols.nodes;

        var num = Math.floor((length-1)*volumeLevel);

        vols[num].innerHTML = A.S.o;
        vols[num].className = 'vol active';
    },

    _setProgressPosition: function (secs) {
        var self = this;
        self._setProgressPimpa(secs);

//        self.audio.currentTime = secs;
//        self.timeNode.innerHTML = self._timeFormat(secs);
    },
    _setProgressPimpa: function (secs) {
        var self = this;

        var length = self.progs.length;
        var progs = self.progs.nodes;

        var num = Math.floor(((length-1)*secs)/self.audio.duration);

        for (;length--;) {
            progs[length].innerHTML = A.S.u;
            progs[length].className = 'prog';
        }
        progs[num].innerHTML = A.S.o;
        progs[num].className = 'prog active';
    },
    _getElements: function () {
        var self = this,
            d = document;
        self.playerNode = d.getElementById('player' + self.id);
        self.playNode = d.getElementById('play' + self.id);
        self.playSymbolNode = d.getElementById('play-symbol' + self.id);
        self.timeNode = d.getElementById('time' + self.id);
        self.levelNode = d.getElementById('level' + self.id);

        self.progressNode = d.getElementById('progress' + self.id);
        self.volumeNode = d.getElementById('volume' + self.id);

//        self.playerNode.appendChild(self.audio);

        self._getVols();
        self._getProgs();
    },
    _getVols: function () {
        var self = this;
        var vols = self.volumeNode.childNodes;
        var len = vols.length;
        self.vols = {
            nodes: vols,
            length: len
        };
    },
    _getProgs: function () {
        var self = this;
        var progs = self.progressNode.childNodes;
        var len = progs.length;
        self.progs = {
            nodes: progs,
            length: len
        };
    },
    _bindHandlers: function () {
        var self = this;
        self.playNode.addEventListener('click', function () {
            self._play();
        }, false);


        self.volumeNode.addEventListener('mousedown', function (e) {
            self._changeVolume(e.target);
        }, false);

        self.progressNode.addEventListener('mousedown', function (e) {
            self._changeProgress(e.target);
        }, false);


        self.audio.addEventListener('durationchange', function () {
            self._setTime();
        }, false);
        self.audio.addEventListener('timeupdate', function () {
            self._setTime();
            self._setProgressPosition(self.audio.currentTime);
        }, false);


    },
    _changeVolume: function (clickedNode) {
        var self = this;
        var length = self.vols.length;
        var vols = self.vols.nodes;

        var unit = 1/(length-1);
        for (var i = 0; i < length; i += 1) {
            if (vols[i].className === 'vol active') {
                vols[i].innerHTML = A.S.u;
                vols[i].className = 'vol';
            }
            if (vols[i] === clickedNode) {
                vols[i].className = 'vol active';

                self._setVolumeLevel(i*unit);
            }
        }
    },
    _changeProgress: function (clickedNode) {
        var self = this;
//        var length = self.vols.length;
//        var vols = self.vols.nodes;
//
//        var unit = 1/(length-1);
//        for (var i = 0; i < length; i += 1) {
//            if (vols[i].className === 'vol active') {
//                vols[i].innerHTML = A.S.u;
//                vols[i].className = 'vol';
//            }
//            if (vols[i] === clickedNode) {
//                vols[i].className = 'vol active';
//
//                self._setVolumeLevel(i*unit);
//            }
//        }
    },
    _play: function () {
        var self = this;
        if (self.audio.paused) {
            self.audio.play();
            self.playSymbolNode.innerHTML = A.S.q;
        } else {
            self.audio.pause();
            self.playSymbolNode.innerHTML = A.S.p;
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
    _renderVolume: function (total) {
        var self = this;
        var volume = [];
        for (var i = 0; i < total; i += 1) {
            var percent = Math.floor(100/(total-1) * i);
            volume.push('<div class="vol" title="' + percent + '%">' + A.S.u + '</div>');
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