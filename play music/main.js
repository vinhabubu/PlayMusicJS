        const $ = document.querySelector.bind(document);
        const $$ = document.querySelectorAll.bind(document);

        const PLAYER_STORAGE_KEY = 'vinh_PLAYER'

        const player = $(".player");
        const cd = $(".cd");
        const heading = $("header h2");
        const cdThumb = $(".cd-thumb");
        const audio = $("#audio");
        const playBtn = $(".btn-toggle-play");
        const progress = $("#progress")
        const nextBtn = $('.btn-next')
        const prevBtn = $('.btn-prev')
        const randomBtn = $('.btn-random')
        const repeatBtn = $('.btn-repeat')
        const playlist = $('.playlist')


        const app = {
            currentIndex: 0,
            isPlaying: false,
            isRandom: false,
            isRepeat: false,
            config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

            songs: [{
                    name: "Lạc trôi",
                    singer: "Sơn Tùng",
                    path: "Assets/LacTroi.mp3",
                    image: "https://i.ytimg.com/vi/DrY_K0mT-As/maxresdefault.jpg",
                },
                {
                    name: "Kill this love",
                    singer: "Black Pink",
                    path: "Assets/KillThisLove.mp3",
                    image: "https://photo-cms-nghenhinvietnam.zadn.vn/Uploaded/ngochai/2019_04_09/dims_1__RTKP.jpeg",
                },
                {
                    name: "Ice Cream",
                    singer: "Black Pink",
                    path: "Assets/IceCream.mp3",
                    image: "https://avatar-ex-swe.nixcdn.com/song/share/2020/08/28/1/8/2/e/1598588318733.jpg",
                },
                {
                    name: "Boy friend",
                    singer: "Justin Bieber",
                    path: "Assets/Boyfriend.mp3",
                    image: "https://i.ytimg.com/vi/4GuqB1BQVr4/maxresdefault.jpg",
                },
                {
                    name: "Hãy trao cho anh",
                    singer: "Sơn Tùng",
                    path: "Assets/HayTraoChoAnh.mp3",
                    image: "https://i.ytimg.com/vi/knW7-x7Y7RE/maxresdefault.jpg",
                },
                {
                    name: "Solo",
                    singer: "Jennie",
                    path: "Assets/Solo.mp3",
                    image: "https://media.vov.vn/sites/default/files/styles/large/public/2021-08/jennie-solo.jpeg",
                },
            ],

            setConfig: function(key, value) {
                this.config[key] = value
                localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
            },

            render: function() {
                const htmls = this.songs.map((song, index) => {
                    return `
                                      <div class="song ${ index === this.currentIndex ? "active" : ""}" data-index="${index}">
                                          <div class="thumb"
                                              style="background-image: url('${song.image}')">
                                          </div>
                                          <div class="body">
                                              <h3 class="title">${song.name}</h3>
                                              <p class="author">${song.singer}</p>
                                          </div>
                                          <div class="option">
                                              <i class="fas fa-ellipsis-h"></i>
                                          </div>
                                      </div>
                                  `;
                });
                playlist.innerHTML = htmls.join("");
            },

            defineProperties: function() {
                Object.defineProperty(this, "currentSong", {
                    get: function() {
                        return this.songs[this.currentIndex];
                    },
                });
            },

            handleEvents: function() {
                const _this = this;
                const cdWidth = cd.offsetWidth;

                //Xử lý CD quay và dừng
                const cdThumbAnimate = cdThumb.animate([
                    { transform: 'rotate(360deg)' }
                ], {
                    duration: 10000, //10s
                    iterations: Infinity

                })
                cdThumbAnimate.pause()


                //Xử lý phóng to thu nhỏ cd
                document.onscroll = function() {
                    const scrollTop = window.scrollY;
                    const newCdWidth = cdWidth - scrollTop;
                    cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
                };

                //Xử lý click play
                playBtn.onclick = function() {
                    if (_this.isPlaying) {
                        audio.pause();
                    } else {
                        audio.play();
                    }
                };

                //Khi song được play
                audio.onplay = function() {
                    _this.isPlaying = true;
                    player.classList.add("playing");
                    cdThumbAnimate.play()
                };

                //Khi song bị pause
                audio.onpause = function() {
                    _this.isPlaying = false;
                    player.classList.remove("playing");
                    cdThumbAnimate.pause()
                };

                //Xử lý cái thời gian chạy khi nhạc chạy
                audio.ontimeupdate = function() {
                    if (audio.duration) {
                        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                        progress.value = progressPercent
                    }
                };

                //Xử lý tua khi nhạc chạy
                progress.onchange = function(e) {
                    const seekTime = audio.duration / 100 * e.target.value
                    audio.currentTime = seekTime
                }

                //Khi next song
                nextBtn.onclick = function() {
                    if (_this.isRandom) {
                        _this.playRandomSong()
                    } else {
                        _this.nextSong()

                    }
                    audio.play()
                    _this.render()
                    _this.scrollToActiveSong()

                }

                //Xu ly preview
                prevBtn.onclick = function() {
                    if (_this.isRandom) {
                        _this.playRandomSong()
                    } else {
                        _this.prevSong()

                    }
                    audio.play()
                    _this.render()
                    _this.scrollToActiveSong()
                }


                //Xu ly bat tat random
                randomBtn.onclick = function(e) {
                    _this.isRandom = !_this.isRandom
                    _this.setConfig('isRandom', _this.isRandom)
                    randomBtn.classList.toggle('active', _this.isRandom)

                }

                //Xử lý lặp lại bài hát
                repeatBtn.onclick = function(e) {
                    _this.isRepeat = !_this.isRepeat
                    _this.setConfig('isRêpat', _this.isRepeat)
                    repeatBtn.classList.toggle('active', _this.isRepeat)
                }

                //Xử lý next song khi audio kết thúc
                audio.onended = function() {
                    if (_this.isRepeat) {
                        audio.play()
                    } else {
                        nextBtn.click()
                    }

                }

                //Xử lý click từng bài hát
                playlist.onclick = function(e) {
                    const songNode = e.target.closest('.song:not(.active)')
                    if (songNode || e.target.closest('.option')) {
                        if (songNode) {
                            _this.currentIndex = Number(songNode.dataset.index)
                            _this.loadCurrentSong()
                            _this.render()
                            audio.play()
                        }
                    }
                }
            },

            scrollToActiveSong: function() {
                setTimeout(() => {
                    $('.song.active').scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    })
                }, 300)
            },

            loadCurrentSong: function() {
                heading.textContent = this.currentSong.name;
                cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
                audio.src = this.currentSong.path;
            },

            loadConfig: function() {
                this.isRandom = this.config.isRandom
                this.isRepeat = this.config.isRepeat


            },

            nextSong: function() {
                this.currentIndex++
                    if (this.currentIndex >= this.songs.length) {
                        this.currentIndex = 0
                    }
                this.loadCurrentSong()
            },

            prevSong: function() {
                this.currentIndex--
                    if (this.currentIndex < 0) {
                        this.currentIndex = this.songs.length - 1
                    }
                this.loadCurrentSong()
            },

            playRandomSong: function() {
                let newIndex;
                do {
                    newIndex = Math.floor(Math.random() * this.songs.length);
                } while (newIndex === this.currentIndex);

                this.currentIndex = newIndex;
                this.loadCurrentSong();
            },

            start: function() {
                //Gán cấu hình từ config vào ứng dụng
                this.loadConfig();

                //Định nghĩa các thuộc tính cho object
                this.defineProperties();

                //Lắng nghe và xử lý các sự kiện
                this.handleEvents();

                //Tải thông tin bài hát đầu tiên vào ui khi chạy ứng dụng
                this.loadCurrentSong();

                //render danh sách bài hát
                this.render();

                // Hiển thị trạng thái ban đầu của button repeat & random
                // Display the initial state of the repeat & random button
                randomBtn.classList.toggle("active", this.isRandom);
                repeatBtn.classList.toggle("active", this.isRepeat);
            },
        };
        app.start();

        // https://media.w3.org/2010/07/bunny/04-Death_Becomes_Fur.mp4