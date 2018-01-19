import {commonParams} from "./config"
import axios from 'axios'
export function getSongLyric(mid) {
  const url = '/api/getLyric';
  const data = Object.assign({}, commonParams, {
    pcachetime: +new Date(),
    songmid: mid,
    g_tk: 5381,
    hostUin: 0,
    needNewCode: 0,
    format: "json",
    platform: "yqq"
  });
  //不用jsop请求，使用ajax
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
