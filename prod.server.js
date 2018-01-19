const express = require('express')
const config = require('./config/index.js')
const axios = require('axios')
const port = process.env.PORT || config.dev.port
const app = express()
//歌单列表
app.get('/api/getDiscList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
});
//歌词列表
app.get('/api/getLyric', function (req, res) {
  var url = 'https://szc.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data;
    if (typeof ret === "string") {
      var reg = /^\w+\(({[^()]+})\)$/;
      var mathes = ret.match(reg);
      if (mathes) {
        ret = JSON.parse(mathes[1]);
      }
    }
    res.json(ret);
  }).catch((e) => {
    console.log(e)
  })
});
//歌单的歌曲列表
app.get('/api/getDiscSongList', function (req, res) {
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data;
    if (typeof ret === "string") {
      var reg = /^\w+\(({[^()]+})\)$/;
      var mathes = ret.match(reg);
      if (mathes) {
        ret = JSON.parse(mathes[1]);
      }
    }
    res.json(ret);
  }).catch((e) => {
    console.log(e)
  })
});
//排行榜歌曲列表
app.get('/api/getRankList', function (req, res) {
  var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
});
//获取热门搜索数据
app.get('/api/getHotSearchList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
});
app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
