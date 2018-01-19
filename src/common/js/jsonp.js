//封装jsonp
import orginJSONP from "jsonp"
export default  function jsonp(url,data,option) {
  url+=(url.indexOf('?')<0?'?':'&')+param(data);
  return new Promise((resolve,reject)=>{
    orginJSONP(url,option,(err,data)=>{
      if(!err){
        resolve(data);
      }else {
        reject(err);
      }
    })
  })
}
function param(data) {
  let url='';
  for(var k in data){
    let value=data[k]!==undefined?data[k]:'';
    //拼接地址栏路径
    url+=`&${k}=${encodeURIComponent(value)}`;
  }
  return url?url.substring(1):'';
}
