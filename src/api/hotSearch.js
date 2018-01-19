import {commonParams, options} from "./config"
import axios from 'axios'

//获取热门搜索数据
export function getHotSearchList() {
  const url = '/api/getHotSearchList';
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: "json",
    platform: "h5",
    needNewCode: 1,
    _: 1515997065271
  });
  //不用jsop请求，使用ajax
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
