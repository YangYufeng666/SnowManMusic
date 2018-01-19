<template>
  <!--歌手详情页-->
  <transition name="slide">
    <!--歌曲列表-->
    <m-music-list :songs="songs" :bg-image="bgImage" :title="title"></m-music-list>
  </transition>

</template>

<script>
  import {mapGetters} from "vuex"
  import {getSingerDetail} from "@/api/singer"
  import {ERR_OK} from "@/api/config"
  import {createSong} from "@/common/js/Song"
  import musicList from "@/components/music-list/music-list"

  export default {
    data() {
      return {
        songs: []
      }
    },
    components: {
      "m-music-list": musicList
    },
    computed: {
      title() {
        return this.singer.name;
      },
      bgImage() {
        return this.singer.avatar;
      },
      ...mapGetters(["singer"]
      )
    },
    created() {
      this._getDetail();
    },
    methods: {
      _getDetail() {
        if (!this.singer.id) {
          this.$router.push("/singer");
          return;
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list);
          }
        })
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach((item) => {
          let {musicData} = item;
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        });
        return ret;
      }
    }
  }


</script>

<style scoped lang="stylus">
  @import "~@/common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    bottom: 0
    right: 0
    left: 0
    background: $color-background
</style>
