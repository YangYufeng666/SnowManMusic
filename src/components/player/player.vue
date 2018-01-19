<template>
  <div class="player" v-show="playList.length>0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave">
      <!--全屏播放器-->
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" width="100%" height="100%">
        </div>
        <!--播放器的顶部-->
        <div class="top">
          <div class="back" @click.stop.prevent="back">
            <i class="icon-back"></i>
          </div>
          <!--标题-->
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!--播放器的中间部分-->
        <div class="middle" @touchstart.prevent="middleTouchstart"
             @touchmove.prevent="middleTouchmove"
             @touchend.prevent="middleTouchend">
          <!--cd图片-->
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdClass">
                <img :src="currentSong.image" class="image">
              </div>
            </div>
            <!--歌词-->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!--歌词展示-->
          <m-lyric-scroll :data="currentLyric&&currentLyric.lines" class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" :class="{'current':index===currentLineNum}"
                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
              <div v-if="!currentLyric">
                <p class="text no-lyric">暂无歌词</p>
              </div>
            </div>
          </m-lyric-scroll>
        </div>
        <!--播放器的底部-->
        <div class="bottom">
          <!--切换-->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <!--进度条-->
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <!--进度条-->
              <m-progress-bar :percent="percent" @percentChange="onProgressBarChange"></m-progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <!--按钮组-->
          <div class="operators">
            <!--左侧-->
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableClass">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <!--中间-->
            <div class="icon i-center" :class="[disablePlayClass]">
              <i :class="playIcon" @click.stop.prevent="togglePlay"></i>
            </div>
            <!--右侧-->
            <div class="icon i-right" :class="disableClass">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <!--迷你播放器-->
      <div class="mini-player" v-show="!fullScreen">
        <!--音乐图标-->
        <div class="icon" @click.stop.prevent="open">
          <img :src="currentSong.image" width="40" height="40" :class="cdClass">
        </div>
        <!--歌曲信息-->
        <div class="text" @click.stop.prevent="open">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <!--进度条-->
        <div class="control">
          <m-progress-circle :radius="radius" :percent="percent">
            <i :class="miniPlayIcon" class="icon-mini" @click="togglePlay"></i>
          </m-progress-circle>
        </div>
        <div class="control" @click="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <m-playlist ref="playlist"></m-playlist>
    <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime"
           @ended="end"></audio>
  </div>
</template>

<script>
  import {mapActions} from "vuex"
  import animations from "create-keyframe-animation"
  import {prefixStyle} from "@/common/js/dom"
  import {getMusicVkey} from "@/api/getMusicVkey"
  import {ERR_OK} from "@/api/config"
  import ProgressBar from "@/base/progress-bar/progress-bar"
  import progressCircle from "@/base/progress-circle/progress-circle"
  import {playMode} from "@/common/js/config"
  import {shuffle} from "@/common/js/utils"
  import Lyric from "lyric-parser"
  import scroll from "@/base/scroll/scroll"
  import playlist from "@/components/playlist/playlist"
  import {playerMixin} from "@/common/js/mixin"

  const transform = prefixStyle("transform");
  const transition = prefixStyle("transition");
  const transitionDuration = prefixStyle("transitionDuration");
  const animation = prefixStyle("animation");
  export default {
    data() {
      return {
        songReady: false,
        currentTime: 0,
        radius: 32,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: ""
      }
    },
    mixins: [playerMixin],
    created() {
      this.touch = {};
    },
    components: {
      "m-progress-bar": ProgressBar,
      "m-progress-circle": progressCircle,
      "m-lyric-scroll": scroll,
      "m-playlist": playlist
    },
    computed: {
      percent() {
        return this.currentTime / this.currentSong.duration;
      },
      playIcon() {
        return this.playing ? "icon-pause" : "icon-play";
      },
      miniPlayIcon() {
        return this.playing ? "icon-pause-mini" : "icon-play-mini";
      },
      cdClass() {
        return this.playing ? "play" : "play pause";
      },
      disableClass() {
        let disClass = "";
        if (!this.songReady) {
          disClass = "disable";
        } else {
          if (this.mode === playMode.loop) {
            disClass = "disable";
          }
        }
        return disClass;
      },
      disablePlayClass() {
        return this.songReady ? "" : "disable";
      },
    },
    methods: {
      ...mapActions(['savePlayHistory', 'saveFavoriteList', 'deleteFavoriteList']),
      showPlayList() {
        this.$refs.playlist.show();
      },
      middleTouchstart(e) {
        //手指触摸了屏幕
        this.touch.initiated = true;
        //手指的触摸点
        const touch = e.touches[0];
        //触摸点的x,y坐标
        this.touch.startX = touch.pageX;
        this.touch.startY = touch.pageY;
      },
      middleTouchmove(e) {
        //手指触摸了屏幕没有
        if (!this.touch.initiated) {
          return;
        }
        //触摸了屏幕拿到手指的触摸点
        const touch = e.touches[0];
        //手指的触摸点的x,y坐标的变化
        const deltaX = touch.pageX - this.touch.startX;
        const deltaY = touch.pageY - this.touch.startY;
        //手指垂直划过的距离大于手指水平划过的距离，判定为垂直滚动，不是做切换
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return;
        }
        const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
        this.$refs.lyricList.$el.style[transitionDuration] = 0;
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.middleL.style[transitionDuration] = 0;
        this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      },
      middleTouchend(e) {
        let offsetWidth, opacity;
        if (this.currentShow === "cd") {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth;
            opacity = 0;
            this.currentShow = 'lyric';
          } else {
            offsetWidth = 0;
            opacity = 1;
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0;
            this.currentShow = 'cd';
            opacity = 1;
          } else {
            offsetWidth = -window.innerWidth;
            opacity = 0;
          }
        }
        const time = 300;
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.middleL.style[transitionDuration] = `${time}ms`;
        this.$refs.middleL.style.opacity = opacity;
      },
      getLyric() {
        this.currentSong.getLyric().then((lyric) => {
          //切换歌词时
          if (this.currentSong.lyric !== lyric) return;
          this.currentLyric = new Lyric(lyric, this.handlerLyric);
          if (this.playing) {
            this.currentLyric.play();
          }
        }).catch(() => {
          this.currentLyric = null;
          this.playingLyric = "";
          this.currentLineNum = 0;
        });
      },
      handlerLyric({lineNum, txt}) {
        this.currentLineNum = lineNum;
        if (this.currentLineNum > 5) {
          let lineEl = this.$refs.lyricLine[this.currentLineNum - 5];
          this.$refs.lyricList.scrollToElement(lineEl, 1000);
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000);
        }
        this.playingLyric = txt;
      },
      onProgressBarChange(percent) {
        const currentTime = this.currentSong.duration * percent;
        this.$refs.audio.currentTime = this.currentSong.duration * percent;
        if (!this.playing) {
          this.togglePlay();
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime;
      },
      format(interval) {
        interval = interval | 0;
        const minute = interval / 60 | 0;
        const second = this._pad(interval % 60);
        return `${minute}:${second}`
      },
      _pad(num, n = 2) {
        let len = num.toString().length;
        while (len < n) {
          num = "0" + num;
          len++;
        }
        return num;
      },
      ready() {
        this.songReady = true;
        this.savePlayHistory(this.currentSong)
      },
      error() {
        this.songReady = true;
      },
      togglePlay() {
        if (!this.songReady) {
          return;
        }
        clearTimeout(this.timer_2);
        this.timer_2 = setTimeout(() => {
          this.setPlayingState(!this.playing);
          if (this.currentLyric) {
            this.currentLyric.togglePlay();
          }
        }, 600);

      },
      prev() {
        if (!this.songReady) {
          return;
        } else {
          if (this.mode === playMode.loop) {
            return;
          }
        }
        if (this.playList.length === 1) {
          this.loop();
          return;
        } else {
          let index = this.currentIndex - 1;
          if (index === -1) {
            index = this.playList.length - 1;
          }
          this.setCurrentIndex(index);
          if (!this.playing) {
            this.togglePlay();
          }
        }
        this.songReady = false;
      },
      next() {
        if (!this.songReady) {
          return;
        } else {
          if (this.mode === playMode.loop) {
            return;
          }
        }
        if (this.playList.length === 1) {
          this.loop();
          return;
        } else {
          let index = this.currentIndex + 1;
          if (index === this.playList.length) {
            index = 0;
          }
          this.setCurrentIndex(index);
          if (!this.playing) {
            this.togglePlay();
          }
        }
        this.songReady = false;
      },
      end() {
        if (this.mode === playMode.loop) {
          this.loop();
        } else {
          this.next();
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        if (this.currentLyric) {
          this.currentLyric.seek(0);
        }
      },
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale();
        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        };
        //注册动画
        animations.registerAnimation({
          name: "move",
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        });
        //执行动画
        animations.runAnimation(this.$refs.cdWrapper, 'move', done);
      },
      afterEnter() {
        animations.unregisterAnimation("move");
        this.$refs.cdWrapper.style[animation] = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style[transition] = "all .4s";
        const {x, y, scale} = this._getPosAndScale();
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
        this.$refs.cdWrapper.addEventListener("transitionend", done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style[transition] = "";
        this.$refs.cdWrapper.style[transform] = "";
      },
      _getPosAndScale() {
        //小cd图的宽度
        const targetWidth = 40;
        const paddingLeft = 40;
        const paddingTop = 80;
        const paddingBottom = 30;
        //大cd图的宽度
        const width = window.innerWidth * 0.8;
        //小的cd图的缩放比例
        const scale = targetWidth / width;
        //最终的x坐标
        const x = -(window.innerWidth / 2 - paddingLeft);
        //最终的y坐标
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
        return {
          x, y, scale
        }
      },
      back() {
        this.setFullScreen(false);
      },
      open() {
        this.setFullScreen(true);
      }
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (!newSong.id) return;
        if (newSong.id === oldSong.id) return;
        if (this.currentLyric) {
          this.currentLyric.stop();
          this.currentTime = 0;
          this.playingLyric = '';
          this.currentLineNum = 0;
        }
        clearTimeout(this.timer_1);
        this.timer_1 = setTimeout(() => {
          this.$refs.audio.play();
          this.getLyric();
        }, 300)
      },
      playing(newPlaying) {
        this.$nextTick(() => {
          const audio = this.$refs.audio;
          newPlaying ? audio.play() : audio.pause();
        });
      }
    }
  }

</script>

<style scoped lang="stylus">
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 1.8rem auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          position: relative
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            height: 100%
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
            .no-lyric
              position: absolute
              left: 0
              top: 50%
              width: 100%
              margin-top: -16px
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
