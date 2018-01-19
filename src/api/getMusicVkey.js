import jsonp from '@/common/js/jsonp'
import {commonParams, options} from "./config"
import axios from 'axios'
export function getMusicVkey(songmid, filename, guid) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';
  const data = Object.assign({}, commonParams,{
    cid: 205361747,
    uin: 0,
    loginUin: 0,
    hostUin: 0,
    format: "json",
    callback:"QQ_MUSIC",
    songmid: songmid,
    filename: filename,
    guid: guid,
    platform: "yqq",
    needNewCode: 0,
    g_tk: 5381,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0
  });
  return jsonp(url, data, options);
}

