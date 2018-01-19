import {commonParams, options} from "./config"
import axios from 'axios'
import jsonp from '@/common/js/jsonp'

//获取排行榜数据
export function getRankList() {
  const url = '/api/getRankList';
  const data = Object.assign({}, commonParams, {
    g_tk: "5381",
    uin: "0",
    format: "json",
    inCharset: "utf-8",
    outCharset: "utf-8",
    notice: "0",
    platform: "h5",
    needNewCode: "1"
  });
  //不用jsop请求，使用ajax
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getMusicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    platform: "h5",
    needNewCode: 1,
    tpl: 3,
    page: "detail",
    type: "top",
    topid: topid,
    _: 1515987380881
  });
  return jsonp(url, data, options);
}

