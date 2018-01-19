<template>
  <transition nmae="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <m-search-box ref="searchBox" @query="search" placeholder="搜索歌曲"></m-search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <m-witches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></m-witches>
        <div class="list-wrapper">
          <m-scroll ref="songList" class="list-scroll" v-if="currentIndex===0" :data="playHistory">
            <div class="list-inner">
              <m-song-list :songs="playHistory" @select="selectSong"></m-song-list>
            </div>
          </m-scroll>
          <m-scroll :refreshDelay="refreshDelay" ref="searchList" class="list-scroll" v-if="currentIndex===1" :data="searchHistory">
            <div class="list-inner">
              <m-search-list :searches="searchHistory" @select="addQuery" @delete="deleteOne"></m-search-list>
            </div>
          </m-scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <m-suggest @listScroll="blurInput" :showSinger="showSinger" :query="query" @select="selectSuggest"></m-suggest>
      </div>
      <m-top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表中！</span>
        </div>
      </m-top-tip>
    </div>
  </transition>
</template>

<script>
  import SearchBox from "@/base/search-box/search-box"
  import Suggest from "@/components/suggest/suggest"
  import {searchMixin} from "@/common/js/mixin"
  import Switches from "@/base/switchs/switchs"
  import Scroll from "@/base/scroll/scroll"
  import {mapGetters, mapActions} from "vuex"
  import SongList from "@/base/song-list/song-list"
  import SearchList from "@/base/search-list/search-list"
  import Song from "@/common/js/Song"
  import topTip from "@/base/top-tip/top-tip"

  export default {
    data() {
      return {
        showFlag: false,
        showSinger: false,
        currentIndex: 0,
        switches: [
          {name: '最近播放'},
          {name: '最近搜索'}
        ]
      }
    },
    mixins: [searchMixin],
    components: {
      "m-search-box": SearchBox,
      "m-suggest": Suggest,
      "m-witches": Switches,
      "m-scroll": Scroll,
      "m-song-list": SongList,
      "m-search-list": SearchList,
      "m-top-tip": topTip
    },
    computed: {
      ...mapGetters(['playHistory', 'searchHistory'])

    },
    methods: {
      //在songList组件中选择了歌曲
      selectSong(song, index) {
        //拿到了song还要将其转成为Song的实例
        if (index !== 0) {
          this.insertSong(new Song(song));
          this.showTopTip();
        }
      },
      //在搜索历史中选择了歌曲
      selectSuggest() {
        this.saveSearch();
        this.showTopTip();
      },
      show() {
        this.showFlag = true;
        setTimeout(() => {
          this.currentIndex === 0 ? this.$refs.songList.refresh() : this.$refs.searchList.refresh();
        }, 20)
      },
      hide() {
        this.showFlag = false;
      },
      search(query) {
        this.query = query;
      },
      switchItem(index) {
        this.currentIndex = index;
      },
      showTopTip() {
        this.$refs.topTip.show();
      },
      ...mapActions(['insertSong'])
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme
    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
