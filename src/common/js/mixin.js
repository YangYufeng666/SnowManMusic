import {mapGetters, mapMutations, mapActions} from "vuex"
import {playMode} from "@/common/js/config"
import {shuffle} from "@/common/js/utils"
//组件共用钩子hock
export const playlistMixin = {
  mounted() {
    this.handlerPlaylist(this.playList)
  },
  activated() {
    this.handlerPlaylist(this.playList)
  },
  computed: {
    ...mapGetters(['playList'])
  },
  watch: {
    playList(newVal) {
      this.handlerPlaylist(newVal);
    }
  },
  methods: {
    handlerPlaylist() {
      throw new Error("components must implement handlerPlaylist methods")
    }
  }
};
export const playerMixin = {
  computed: {
    ...mapGetters(["fullScreen", "playList", "currentSong", "playing", "currentIndex", "mode", "sequenceList", "favoriteList"]),
    iconMode() {
      return this.mode === playMode.sequence ? "icon-sequence" : this.mode === playMode.loop ? "icon-loop" : "icon-random";
    },
  },
  methods: {
    ...mapActions(['saveFavoriteList', 'deleteFavoriteList']),
    getFavoriteIcon(song) {
      if (this.isFavoriteIcon(song)) {
        return 'icon-favorite';
      }
      return "icon-not-favorite";
    },
    toggleFavorite(song) {
      if (this.isFavoriteIcon(song)) {
        this.deleteFavoriteList(song);
      } else {
        this.saveFavoriteList(song);
      }
    },
    isFavoriteIcon(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id;
      });
      return index > -1;
    },
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      //随机播放模式
      if (mode === playMode.random) {
        //打乱播放列表
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      if (list.length > 0) {
        this.resetCurrentIndex(list);
        this.setPlayList(list);
      }
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST"
    })
  }
};
export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  methods: {
    deleteOne(item) {
      this.deleteSearchHistory(item);
    },
    //保存搜索结果
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    blurInput() {
      this.$refs.searchBox.blur();
    },
    changeQuery(query) {
      this.query = query;
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    ...mapActions(['saveSearchHistory', 'deleteSearchHistory']),
  },
  computed: {
    ...mapGetters(['searchHistory'])
  }
};
