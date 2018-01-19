import {getMusicVkey} from "@/api/getMusicVkey"
import {ERR_OK} from "@/api/config"

export const singer = state => state.singer;
export const playing = state => state.playing;
export const fullScreen = state => state.fullScreen;
export const playList = state => state.playList;
export const sequenceList = state => state.sequenceList;
export const mode = state => state.mode;
export const currentIndex = state => state.currentIndex;
export const currentSong = (state) => {
  let item = state.playList[state.currentIndex] || {};
  if (JSON.stringify(item) !== "{}") {
    if (item.url === "") {
      let guid = Math.round(2147483647 * Math.random()) * (new Date).getUTCMilliseconds() % Number("1e10");
      let songmid = item.mid;
      let filename = 'C400' + songmid + '.m4a';
      getMusicVkey(songmid, filename, guid).then((res) => {
        if (res.code === ERR_OK) {
          let vkey = res.data.items[0].vkey;
          item.url = `http://dl.stream.qqmusic.qq.com/${filename}?vkey=${vkey}&guid=${guid}&uin=0&fromtag=66`;
          return item;
        }
      });
    }
  }
  return item;
};
export const disc = state => state.disc;
export const topList = state => state.topList;
export const searchHistory = state => state.searchHistory;
export const playHistory = state => state.playHistory;
export const favoriteList = state => state.favoriteList;
