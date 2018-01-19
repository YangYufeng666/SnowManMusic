<template>
  <!--推荐-->
  <div class="recommend" ref="recommend">
    <m-scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <m-slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </m-slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="item in discList" class="item">
              <div class="icon">
                <img width="60" height="40" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name">{{item.creator.name}}</h2>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <m-loading class="loading-container" v-show="!discList.length"></m-loading>
    </m-scroll>
    <router-view></router-view>
  </div>
</template>
<script>
  import loading from '@/base/loading/loading'
  import scroll from '@/base/scroll/scroll'
  import slider from '@/base/slider/slider'
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {playlistMixin} from "@/common/js/mixin"
  import {mapMutations} from "vuex"

  export default {
    data() {
      return {
        recommends: [],
        discList: [],
        checkLoaded: false
      }
    },
    mixins: [playlistMixin],
    components: {
      "m-slider": slider,
      "m-scroll": scroll,
      "m-loading": loading
    },
    created() {
      this._getRecommend();
      this._getDiscList();
    },
    methods: {
      ...mapMutations({
        setDisc: "SET_DISC"
      }),
      selectItem(item) {
        this.$router.push({path: `/recommend/${item.dissid}`});
        this.setDisc(item);
      },
      handlerPlaylist(playList) {
        if (this.recommends.length > 0) {
          const bottom = playList.length > 0 ? '60px' : "";
          this.$refs.recommend.style.bottom = bottom;
          this.$refs.scroll.refresh();
        }
      },
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider;
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list;
          }
        })
      },
      loadImage() {
        if (!this.checkLoaded) {
          this.$refs.scroll.refresh();
          this.checkLoaded = !this.checkLoaded;
        }
      }
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
