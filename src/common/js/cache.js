//存储缓存
import storage from 'good-storage'

const SERACH_KEY = '__search__';
const SEARCH_MAX_LENGTH = 15;
const PLAY_KEY = '__play__';
const PLAY_MAX_LENGTH = 200;
const FAVORITE_KEY = '__favorite__';
const FAVORITE_MAX_LENGTH = 200;

//数据新增操作
function insertArray(arr, val, compare, maxlen) {
  const index = arr.findIndex(compare);
  if (index === 0) {
    return;
  }
  if (index > 0) {
    arr.splice(index, 1);
  }
  arr.unshift(val);
  if (maxlen && arr.length > maxlen) {
    arr.pop();
  }
}

//数据删除操作
function deleteFromArray(arr, cpmpare) {
  const index = arr.findIndex(cpmpare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

//保存搜索记录
export function saveSearch(query) {
  let serches = storage.get(SERACH_KEY, []);
  insertArray(serches, query, (item) => {
    return item === query;
  }, SEARCH_MAX_LENGTH)
  storage.set(SERACH_KEY, serches);
  return serches;
}

//删除搜索记录
export function deleteSearch(query) {
  let searches = storage.get(SERACH_KEY, []);
  deleteFromArray(searches, (item) => {
    return item === query;
  });
  storage.set(SERACH_KEY, searches);
  return searches;
}

//初始化搜索记录
export function loadSearch() {
  return storage.get(SERACH_KEY, []);
}

//清除所有搜索纪录
export function clearSearch() {
  storage.remove(SERACH_KEY);
  return [];
}

//保存播放记录
export function savePlay(song) {
  //获取缓存数据，没有则为[]
  let songs = storage.get(PLAY_KEY, []);
  insertArray(songs, song, (item) => {
    return item.id === song.id;
  }, PLAY_MAX_LENGTH);
  storage.set(PLAY_KEY, songs);
  return songs;
}

//初始化播放记录
export function loadPlay() {
  return storage.get(PLAY_KEY, []);
}

//保存收藏记录
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, []);
  insertArray(songs, song, (item) => {
    return item.id === song.id;
  }, FAVORITE_MAX_LENGTH);
  storage.set(FAVORITE_KEY, songs);
  return songs;
}

//删除收藏记录
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, []);
  deleteFromArray(songs, (item) => {
    return item.id === song.id;
  });
  storage.set(FAVORITE_KEY, songs);
  return songs;
}

//初始化收藏记录
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, []);
}
