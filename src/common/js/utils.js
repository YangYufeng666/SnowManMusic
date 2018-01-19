export function shuffle(arr) {
  //拷贝一份arr
  let _arr=arr.slice();
  for(let i=0;i<_arr.length;i++){
    let j=getRandomInt(0,i);
    let t=_arr[i];
    _arr[i]=_arr[j];
    _arr[j]=t;
  }
  //返回随机播放音乐列表
  return _arr;
}
function getRandomInt(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}
