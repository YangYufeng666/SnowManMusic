<template>
  <transition name="slide">
    <m-music-list :title="title" :bgImage="bgImage" :songs="songs"></m-music-list>
  </transition>
</template>

<script>
  import musicList from "@/components/music-list/music-list"
  import {getSongList} from "@/api/recommend"
  import {mapGetters} from "vuex"
  import {ERR_OK} from "@/api/config"
  import {createSong} from "@/common/js/Song"

  export default {
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSongList();
    },
    components: {
      "m-music-list": musicList
    },
    computed: {
      ...mapGetters(["disc"]),
      title() {
        return this.disc.dissname;
      },
      bgImage() {
        return this.disc.imgurl;
      }
    },
    methods: {
      _getSongList() {
        if (!this.disc.dissid) {
          this.$router.push('/recommend');
          return;
        }
        getSongList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this.normalizeSongs(res.cdlist[0].songlist);
          }
        })
      },
      normalizeSongs(list) {
        let ret = [];
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        });
        return ret;
      }
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
