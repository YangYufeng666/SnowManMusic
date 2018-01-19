<template>
  <!--搜索-->
  <div class="search">
    <div class="search-box-wrapper">
      <m-search-box ref="searchBox" @query="changeQuery"></m-search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <m-scroll class="shortcut" :data="shortcut" ref="shortcut" :refreshDelay="refreshDelay">
        <div>
          <!--热门搜索-->
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" @click="addQuery(item.k)" v-for="item in hotkey">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <!--搜索历史-->
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
            </h1>
            <!--历史记录列表-->
            <m-search-list :searches="searchHistory" @select="addQuery" @delete="deleteOne"></m-search-list>
          </div>
        </div>
      </m-scroll>
    </div>
    <!--检索结果-->
    <div class="search-result" v-show="query" ref="searchResult">
      <m-suggest ref="suggestContent" v-show="isShow" @searchNoResult="searchNoResult" :query="query"
                 @select="saveSearch" @listScroll="blurInput"></m-suggest>
      <m-no-result v-show="!isShow" :title="noResultText"></m-no-result>
    </div>
    <m-confirm ref="confirm" @confirmClearAll="deleteAll" :text="confirmText"
               :confirmBtnText="confirmBtnText"></m-confirm>
    <router-view></router-view>
  </div>
</template>

<script>
  import SearchBox from "@/base/search-box/search-box"
  import {getHotSearchList} from "@/api/hotSearch"
  import {ERR_OK} from "@/api/config"
  import Suggest from "@/components/suggest/suggest"
  import {mapActions} from "vuex"
  import SearchList from "@/base/search-list/search-list"
  import Confirm from "@/base/confirm/confirm"
  import scroll from "@/base/scroll/scroll"
  import {playlistMixin, searchMixin} from "@/common/js/mixin"
  import NoResult from "@/base/no-result/no-result"

  export default {
    data() {
      return {
        hotkey: [],
        confirmText: "是否清空所有记录？",
        confirmBtnText: "清空",
        isShow: false,
        noResultText: "暂无搜索结果"
      }
    },
    mixins: [playlistMixin, searchMixin],
    components: {
      "m-search-box": SearchBox,
      "m-suggest": Suggest,
      "m-search-list": SearchList,
      "m-confirm": Confirm,
      "m-scroll": scroll,
      "m-no-result": NoResult
    },
    created() {
      this._getHotSearchList();
    },
    computed: {
      shortcut() {
        return this.hotkey.concat(this.searchHistory);
      }
    },
    methods: {
      ...mapActions(['clearSearchHistory']),
      handlerPlaylist(playList) {
        if (this.shortcut.length > 0) {
          const bottom = playList.length > 0 ? '60px' : "";
          this.$refs.shortcutWrapper.style.bottom = bottom;
          this.$refs.searchResult.style.bottom = bottom;
          this.$refs.shortcut.refresh();
          this.$refs.suggestContent.refresh();
        }
      },
      deleteAll() {
        this.clearSearchHistory();
      },
      showConfirm() {
        this.$refs.confirm.show();
      },
      _getHotSearchList() {
        getHotSearchList().then((res) => {
          if (res.code === ERR_OK) {
            this.hotkey = res.data.hotkey.slice(0, 10);
          }
        })
      },
      searchNoResult(flag) {
        this.isShow = flag;
      }
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh();
          }, 20)
        }
      }
    }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
