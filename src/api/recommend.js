import jsonp from '@/common/js/jsonp'
import {commonParams, options} from "./config"
import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });
  return jsonp(url, data, options);
}

//获取歌单数据
export function getDiscList() {
  const url = '/api/getDiscList';
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  });
  //不用jsop请求，使用ajax
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

//获取歌单歌曲列表
export function getSongList(disstid) {
  const url = '/api/getDiscSongList';
  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: disstid,
    format: "json",
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    inCharset: "utf8",
    outCharset: "utf-8",
    notice: 0,
    platform: "yqq",
    needNewCode: 0
  });
  //不用jsop请求，使用ajax
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
