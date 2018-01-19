import {playMode} from "@/common/js/config"
import {loadSearch, loadPlay, loadFavorite} from "../common/js/cache"

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  //如果为[]刷新后置空，应该在缓存中获取值
  searchHistory: loadSearch(),
  playHistory: loadPlay(),
  favoriteList: loadFavorite(),
};
export default state;
