<template>
  <!--歌手-->
  <div class="singer" ref="singer">
    <m-listview v-if="singers.length>0" ref="singerList" :singersdata="singers" @select="selectSinger"></m-listview>
    <!--点击歌手项，路由歌手详情这-->
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList} from "@/api/singer"
  import {ERR_OK} from 'api/config'
  import Singer from "@/common/js/Singer"
  import listview from "@/base/listview/listview"
  import {mapMutations} from "vuex"
  import {playlistMixin} from "@/common/js/mixin"

  const HOT_NAME = "热门";
  const HOT_SINGER_LENGTH = 10;
  export default {
    data() {
      return {
        singers: []
      }
    },
    mixins: [playlistMixin],
    components: {
      "m-listview": listview
    },
    created() {
      this._getSingerList()
    },
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      handlerPlaylist(playList) {
        if (this.singers.length > 0) {
          const bottom = playList.length > 0 ? '60px' : "";
          this.$refs.singer.style.bottom = bottom;
          this.$refs.singerList.refresh();
        }
      },
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normallizeSinger(res.data.list);
          }
        })
      },
      _normallizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          //热门歌手数据
          if (index < HOT_SINGER_LENGTH) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          const key = item.Findex;
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        });
        //转换成有序列表
        let hot = [];
        let ret = [];
        for (let key in map) {
          let val = map[key];
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val);
          } else if (val.title === HOT_NAME) {
            hot.push(val);
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });
        return hot.concat(ret);
      }
    }
  }

</script>

<style scoped lang="stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width 100%
</style>
