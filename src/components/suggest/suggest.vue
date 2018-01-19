<template>
  <!--检索组件-->
  <scroll ref="suggest" :beforeScroll="beforeScroll" @beforeScroll="listScroll" :data="result" :pullup="pullup"
          class="suggest" @scrollToEnd="searchMore">
    <ul class="suggest-list">
      <li class="suggest-item" @click="selectItem(item)" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" :title="title"></loading>
    </ul>
  </scroll>

</template>

<script>
  import {search} from "@/api/search"
  import {ERR_OK} from "@/api/config"
  import {filterSinger} from "@/common/js/Song"
  import {createSong} from "@/common/js/Song"
  import Scroll from "@/base/scroll/scroll"
  import Loading from "@/base/loading/loading"
  import Singer from "@/common/js/Singer"
  import {mapMutations} from "vuex"
  import {mapActions} from "vuex"

  const PER_PAGE = 20
  const TYPE_SINGER = "singer"
  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true,
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        beforeScroll: true,
        title: '正在加载更多',
        pullup: true,
        hasMore: true
      }
    },
    watch: {
      query() {
        this._search();
      }
    },
    components: {
      "scroll": Scroll,
      "loading": Loading
    },
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions(['insertSong']),
      refresh() {
        this.$refs.suggest.refresh();
      },
      listScroll() {
        this.$emit('listScroll')
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          //如果是歌手
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          });
          this.$router.push({
            path: `/search/${singer.id}`
          });
          this.setSinger(singer);
        } else {
          //如果是歌曲
          this.insertSong(item);
        }
        this.$emit('select')
      },
      getIconCls(item) {
        //搜索歌手
        if (item.type === TYPE_SINGER) {
          return 'icon-mine';
        } else {
          //搜索歌曲
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername;
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      //检索接口
      _search() {
        this.page = 1;
        this.hasMore = true;
        this.$refs.suggest.scrollTo(0, 0);
        search(this.query, this.page, this.showSinger, PER_PAGE).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data);
            this._checkMore(res.data);
            const flag = this.result.length > 0;
            this.$emit("searchNoResult", flag);
          }
        });
      },
      //判断是否还有更多数据
      _checkMore(data) {
        const song = data.song;
        if (!song.list.length || (song.curnum + song.curpage * PER_PAGE) >= song.totalnum) {
          this.hasMore = false;
        }
      },
      searchMore() {
        if (!this.hasMore) {
          return;
        }
        this.page++;
        search(this.query, this.page, this.showSinger, PER_PAGE).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data));
            this._checkMore(res.data)
          }
        })
      },
      _genResult(data) {
        let ret = [];
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list));
        }
        return ret;
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach((musicData) => {
          if (musicData.albumid && musicData.songid) {
            ret.push(createSong(musicData));
          }
        });
        return ret;
      }
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
