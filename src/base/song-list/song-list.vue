<template>
  <!--歌手歌曲列表组件-->
  <div class="song-list">
    <ul>
      <!--点击歌曲跳转到播放器页面-->
      <li v-for="(song,index) in songs" class="item" @click="selectItem(song,index)">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {getMusicVkey} from "@/api/getMusicVkey"
  import {ERR_OK} from "@/api/config"

  export default {
    props: {
      songs: {
        type: Array,
        default() {
          return [];
        }
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      getRankCls(index) {
        if (index <= 2) {
          return `icon icon${index}`
        } else {
          return 'text'
        }
      },
      getRankText(index) {
        if (index > 2) {
          return index + 1;
        }
      },
      getDesc(song) {
        return `${song.singer}-${song.album}`
      },
      selectItem(item, index) {
        let t = (new Date).getUTCMilliseconds();
        let _guid = Math.round(2147483647 * Math.random()) * t % Number("1e10");
        let songmid = item.mid;
        let filename = 'C400' + songmid + '.m4a';
        let guid = _guid;
        let url = "";
        let vkey = "";
        getMusicVkey(songmid, filename, guid).then((res) => {
          if (res.code === ERR_OK) {
            vkey = res.data.items[0].vkey;
            url = `http://dl.stream.qqmusic.qq.com/${filename}?vkey=${vkey}&guid=${guid}&uin=0&fromtag=66`;
            item.url = url;
            //触发app组件中的播放器组件显示，在music-list中执行
            this.$emit("select", item, index);
          }
        });

      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"
  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>
