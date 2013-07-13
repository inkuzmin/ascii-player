/**
 * Created by JetBrains PhpStorm.
 * User: inkuzmin
 * Date: 7/1/13
 * Time: 3:27 AM
 */


if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

L = {
    onInit: function () {
        this.position = 0;
        this.paused = true;
    },
    onUpdate:function () {
//        document.getElementById("info_playing").innerHTML = this.isPlaying;
//        document.getElementById("info_url").innerHTML = this.url;
//        document.getElementById("info_volume").innerHTML = this.volume;
//        document.getElementById("info_position").innerHTML = this.position;
//        document.getElementById("info_duration").innerHTML = this.duration;
//        document.getElementById("info_bytes").innerHTML = this.bytesLoaded + "/" + this.bytesTotal + " (" + this.bytesPercent + "%)";
//
//        var isPlaying = (this.isPlaying == "true");
//        document.getElementById("playerplay").style.display = (isPlaying)?"none":"block";
//        document.getElementById("playerpause").style.display = (isPlaying)?"block":"none";
//
//        var timelineWidth = 160;
//        var sliderWidth = 40;
//        var sliderPositionMin = 40;
//        var sliderPositionMax = sliderPositionMin + timelineWidth - sliderWidth;
//        var sliderPosition = sliderPositionMin + Math.round((timelineWidth - sliderWidth) * this.position / this.duration);
//
//        if (sliderPosition < sliderPositionMin) {
//            sliderPosition = sliderPositionMin;
//        }
//        if (sliderPosition > sliderPositionMax) {
//            sliderPosition = sliderPositionMax;
//        }
//
//        document.getElementById("playerslider").style.left = sliderPosition+"px";
    },
    getFlashObject:function () {
        return document.getElementById("myFlashFF");
    },
    play:function () {
        if (this.position == 0) {
            this.getFlashObject().SetVariable("method:setUrl", this.src);
        }
        this.getFlashObject().SetVariable("method:play", "");
        this.getFlashObject().SetVariable("enabled", "true");

        this.paused = false;
    },
    pause:function () {
        this.getFlashObject().SetVariable("method:pause", "");

        this.paused = true;
    },
    setPosition:function () {
        var position = document.getElementById("inputPosition").value;
        this.getFlashObject().SetVariable("method:setPosition", position);
    },
    setVolume:function () {
        var volume = document.getElementById("inputVolume").value;
        this.getFlashObject().SetVariable("method:setVolume", volume);
    }
};

A = ASCIIPlayer = function (el, options) {
    var self = this;
    self.el = el;
    self._obtainOptions(options);
    self._init();
}
A.prototype = {
    constructor:ASCIIPlayer,
    _obtainOptions:function (options) {
        var self = this;
        self.options = {};
        for (var param in options) {
            if (options.hasOwnProperty(param))
                self.options[param] = options[param];
        }
    },
    _init:function () {
        var self = this;

        self._initVars();
        self._render();
        self._initAudio();
        self._getElements();

        self._bindHandlers();

//        self._setVolumeLevel(self.initVolume);

    },
    _initVars:function () {
        var self = this;
        self.src = self.el.title;
        self.artist = self.options.artist || 'Artist';
        self.title = self.options.title || 'Title';
        self.preload = self.options.preload || false;
        self.initVolume = self.options.volume || 0.75;
        self.id = self.el.id;

        self.n = A.N++;
    },
    _initAudio:function () {
        var self = this;

        if (self._isAudioSuppored()) {
            self.audio = new Audio();
            self.audio.setAttribute('src', self.src + '?rand=' + Math.random());

            if (self.preload) {
                self.audio.load();
            } else {
                self.audio.setAttribute('preload', 'none');
            }
        } else {
            window['myListener' + self.n] = Object.create(L);

            self.audio = window['myListener' + self.n];
            self.audio.src = self.src;


        }

    },
    _isAudioSuppored:function () {
        return false;
        return !!new Audio().canPlayType('audio/mpeg') && (navigator.userAgent.match(/Chromium\/\d+/) === null);
    },
    _render:function () {
        var self = this;
        var flashAudio = ''

        if (!self._isAudioSuppored()) {
            flashAudio = '<object class="playerpreview" id="myFlashFF" type="application/x-shockwave-flash" data="' + A.baseUrl + '/player_mp3_js.swf" width="0" height="0">' +
                '<param name="movie" value="' + A.baseUrl + '/player_mp3_js.swf">' +
                '<param name="AllowScriptAccess" value="always">' +
                '<param name="FlashVars" value="listener=myListener' + self.n + '&amp;interval=500">' +
                '<PARAM NAME="BASE" VALUE="' + A.baseUrl + '">' +
//                '<embed src="' + A.baseUrl + '/flash/player_mp3_js.swf" height="0" width="0" allowscriptaccess="always" id="myFlashFF" flashvars="listener=myListener' + self.n + '&amp;interval=500" PLUGINSPAGE="http://www.macromedia.com/go/getflashplayer">' +
//                '</embed>';
                '</object>';
        }
        var templ = flashAudio +
            '<div class="player" id="player' + self.id + '">' +
            '   <div class="ctrl play-btn" id="play' + self.id + '">' +
            '       <div>' + A.S.l + '</div>' +
            '       <div class="play" id="play-symbol' + self.id + '">' + A.S.p + '</div>' +
            '       <div>' + A.S.r + '</div>' +
            '   </div>' +
            '   <div class="ctrl progress">' +
            '       <div class="separator">' + A.S.s + '</div>' +
            '       <div>' + A.S.l + '</div>' +
            '       <div id="progress' + self.id + '">' + self._renderProgress(20) + '</div>' +
            '       <div id="time' + self.id + '">00:00</div>' +
            '       <div>' + A.S.r + '</div>' +
            '   </div>' +
            '   <div class="ctrl volume">' +
            '       <div class="separator">' + A.S.s + '</div>' +
            '       <div class="tip">Vol.:</div>' +
            '       <div>' + A.S.l + '</div>' +
            '       <div id="volume' + self.id + '">' + self._renderVolume(5) + '</div>' +
            '       <div id="level' + self.id + '">88%</div>' +
            '       <div>' + A.S.r + '</div>' +
            '   </div>' +
            '   <div class="tip">' +
            '       <div class="separator">' + A.S.s + '</div>' +
            '       <div class="artist">' + self.artist + '</div>' +
            '       <div class="delimiter">' + A.S.d + '</div>' +
            '       <div class="title">' + self.title + '</div>' +
            '   </div>' +
            '</div>';
        var container = document.createElement('p');
        container.className = 'player-container';
        container.innerHTML = templ;
        self._replaceElement(self.el, container);
    },
    _setTime:function () {
        var self = this;
        var time = self._timeFormat(self.audio.duration - self.audio.currentTime);
        self.timeNode.innerHTML = time;
    },
    _setVolumeLevel:function (volumeLevel) {
        var self = this;
        volumeLevel = volumeLevel;
        self._setVolumePimpa(volumeLevel);

        self.audio.volume = volumeLevel;
        if (volumeLevel === 1) {
            volumeLevel = 'max';
        }
        else if (volumeLevel === 0) {
            volumeLevel = 'min';
        }
        else {
            volumeLevel = Math.floor(volumeLevel * 100) + '%';
        }
        self.levelNode.innerHTML = volumeLevel;
    },
    _setVolumePimpa:function (volumeLevel) {
        var self = this;

        var length = self.vols.length;
        var vols = self.vols.nodes;

        var num = Math.floor((length - 1) * volumeLevel);

        vols[num].innerHTML = A.S.o;
        self._addClass(vols[num], 'active');
    },

    _setProgressPosition:function (secs) {
        var self = this;
        self._setProgressPimpa(secs);

//        self.audio.currentTime = secs;
//        self.timeNode.innerHTML = self._timeFormat(secs);
    },
    _setProgressPimpa:function (secs) {
        var self = this;

        var length = self.progs.length;
        var progs = self.progs.nodes;

        var num = Math.floor(((length) * secs) / self.audio.duration);

        for (; length--;) {
            progs[length].innerHTML = A.S.u;
            self._removeClass(progs[length], 'active');

        }
        if (num !== self.progs.length) {
            progs[num].innerHTML = A.S.o;
            self._addClass(progs[num], 'active');
        }
        else {
            self._play();
            self._play();
        }

    },
    _getElements:function () {
        var self = this,
            d = document;
        self.playerNode = d.getElementById('player' + self.id);
        self.playNode = d.getElementById('play' + self.id);
        self.playSymbolNode = d.getElementById('play-symbol' + self.id);
        self.timeNode = d.getElementById('time' + self.id);
        self.levelNode = d.getElementById('level' + self.id);

        self.progressNode = d.getElementById('progress' + self.id);
        self.volumeNode = d.getElementById('volume' + self.id);

        self._getVols();
        self._getProgs();

    },

    _getVols:function () {
        var self = this;
        var vols = self.volumeNode.childNodes;
        var len = vols.length;
        self.vols = {
            nodes:vols,
            length:len
        };
    },
    _getProgs:function () {
        var self = this;
        var progs = self.progressNode.childNodes;
        var len = progs.length;
        self.progs = {
            nodes:progs,
            length:len
        };
    },
    _bindHandlers:function () {
        var self = this;


        self.playNode.addEventListener('click', function () {
            self._play();
        }, false);


//        self.volumeNode.addEventListener('mousedown', function (e) {
//            self._changeVolume(e.target);
//        }, false);
//
//        self.progressNode.addEventListener('mousedown', function (e) {
//            self._changeProgress(e.target);
//        }, false);
//
//
//        if (self._isAudioSuppored()) {
//            self.audio.addEventListener('canplay', function () {
//                if (self.preload) {
//                    self._play();
//                    self._play();
//                }
//                self._bufferisation();
//            }, false);
//            self.audio.addEventListener('timeupdate', function () {
//                self._setTime();
//                self._setProgressPosition(self.audio.currentTime);
//            }, false);
//
//            self.audio.addEventListener('pause', function () {
//            }, false);
//        }


    },
    _bufferisation:function () {
        var self = this;
        var interval = setInterval(function () {
            if (self._wasBuffered()) {
                clearInterval(interval);
            }
            self._paintProgressBar();
        }, 1000);

    },
    _wasBuffered:function () {
        var self = this;
        return self.audio.buffered.end(0) === self.audio.duration;
    },
    _paintProgressBar:function () {
        var self = this;
        var d = self.audio.duration,
            b = self.audio.buffered.end(0),
            p = b / d,
            l = self.progs.length,
            c = Math.floor(l * p),
            i;
        for (i = 0; i < c; i += 1) {
            self._addClass(self.progs.nodes[i], 'buff');
        }
        self.buff = c;
    },
    _changeVolume:function (clickedNode) {
        var self = this;
        var length = self.vols.length;
        var vols = self.vols.nodes;

        var unit = 1 / (length - 1);
        for (var i = 0; i < length; i += 1) {
            if (self._hasClass(vols[i], 'active')) {
                vols[i].innerHTML = A.S.u;
                self._removeClass(vols[i], 'active');
            }
            if (vols[i] === clickedNode) {
                self._addClass(vols[i], 'active');
                self._setVolumeLevel(i * unit);
            }
        }
    },
    _changeProgress:function (clickedNode) {
        var self = this;
        try {
            var length = self.progs.length;
            var progs = self.progs.nodes;
            var current;

            var unit = self.audio.duration / (length);
            for (var i = 0; i < length; i += 1) {
                if (progs[i] === clickedNode) {
                    if (i > self.buff) {
                        return;
                    }
                    else {
                        current = i;
                        self._addClass(progs[i], 'active');
                        self.audio.currentTime = i * unit + 0.1;
                    }
                }


            }
        } catch (err) {
            console.log('Does not loaded!');
        }
    },
    _play:function () {
        var self = this;
        if (self.audio.paused) {
            self.audio.play();
            self.playSymbolNode.innerHTML = A.S.q;
        } else {
            self.audio.pause();
            self.playSymbolNode.innerHTML = A.S.p;
        }

    },
    _timeFormat:function (secs) {
        var hr = Math.floor(secs / 3600);
        var min = Math.floor((secs - (hr * 3600)) / 60);
        var sec = Math.floor(secs - (hr * 3600) - (min * 60));

        if (min < 10) {
            min = "0" + min;
        }
        if (sec < 10) {
            sec = "0" + sec;
        }

        return min + ':' + sec;
    },
    _renderVolume:function (total) {
        var self = this;
        var volume = [];
        for (var i = 0; i < total; i += 1) {
            var percent = Math.floor(100 / (total - 1) * i);
            volume.push('<div class="vol" title="' + percent + '%">' + A.S.u + '</div>');
        }
        return volume.join('');
    },
    _renderProgress:function (l) {
        var self = this;
        var progress = [];
        for (; l--;) {
            progress.push('<div class="prog">' + A.S.u + '</div>');
        }
        return progress.join('');
    },
    _replaceElement:function (oldEl, newEl) {
        var self = this;
        oldEl.parentNode.replaceChild(newEl, oldEl);
    },
    _addClass:function (el, cl) {
        if (!this._hasClass(el, cl))
            el.className += ' ' + cl;
    },
    _removeClass:function (el, cl) {
        var i, r = [],
            c = el.className.split(' ');
        for (i = 0; i < c.length; i += 1) {
            if (c[i] !== cl) {
                r.push(c[i]);
            }
        }
        el.className = r.join(' ');
    },
    _hasClass:function (el, cl) {
        if (el.className.indexOf(cl) > -1) {
            return true;
        }
        return false;
    }
};

A.S = {
    l:'[', // left border
    r:']', // right border
    p:'>', // play
    q:'#', // pause
    u:'-', // ordinary unit
    w:'–', // before buffered
    s:'|', // separator
    d:'&nbsp;&mdash;&nbsp;', // artist delimiter
    o:'o' // pimpa
};
A.baseUrl = '//inkuzmin.ru/~inkuzmin/ascii-player/flash';
A.N = 0;