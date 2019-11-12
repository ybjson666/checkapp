var storage=window.sessionStorage;
var common_url="https://pc.scsxhsk.com/api";
var storage2=window.localStorage;
// var common_url="http://192.168.0.104/repair/public/api";

var app_version='1.0';
var port = "1";
var type=2;
var token = storage.getItem("token");
var realname = storage.getItem("realname");
var firm_name = storage.getItem("firm_name");
var firm_id = storage.getItem("firm_id");
var team_id = storage.getItem("team_id");
var open_id=storage.getItem("open_id");
var oid=storage2.getItem("oid");
var part_type=storage.getItem("part_type");
var deviceName=storage.getItem("deviceName");
var deviceId=storage.getItem("deviceId");
var deviceAddr=storage.getItem("deviceAddr");
var personName=storage.getItem("personName");
var personId=storage.getItem("personId");
var groupName=storage.getItem("groupName");
var groupId=storage.getItem("groupId");

//手机正则
var reg_phone = /^(1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8})$/;
//密码正则
var reg_pwd = /^(?![a-zA-Z]+$)(?!\d+$)(?![\W_]+$)\S{6,20}$/;
//邮箱正则
var reg_email=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
//银行卡正则
var reg_card=/^[0-9]{16,19}$/;
//身份证正则
var reg_idCard=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/;

// contentType: false, 
// processData:false,

//定位城市
var locationCity = sessionStorage.getItem("locationCity");

 
/**
 *请求接口方法
 */
function requestFunc(param){
    return new Promise(function(resolve,reject){
        $.ajax({
            url:common_url+param.url,
            data:param.datas,
            type:param.types?param.types:'post',
            dataType:"json",
            success:function(data){
                resolve(data);
            },
            error:function(error){
                reject(error);
            }
        })
    })
}

// function requestFunc(param){
//     return new Promise((resolve, reject) => {
//         let request = new XMLHttpRequest()
//             //设置向服务器提交的方式
//         request.open(param.types?param.types:'post', common_url+param.url, true)
//         request.responseType = 'json'
//         request.setRequestHeader("Accept", "application/json");
//         request.onreadystatechange = function handlerRequest() {
//             //readyState为4的时候，代表请求操作已经完成，这意味着数据传输已经彻底完成或失败。
//             if (this.readyState === 4) {
//                 //请求成功
//                 if (this.status === 200) {
//                     resolve(this.response)
//                 } else {
//                     reject(new Error(this.statusText));
//                 }
//             }
//         }
//         //发送 HTTP 请求,默认异步请求
//         request.send();
//     })
// }



/**
 * 模态框开关切换
*/
function toggleModal(msg){
    var modal=document.createElement("div");
    modal.className="error-block";
    var child=document.createElement("span");
    child.className="error-txt";
    modal.appendChild(child);
    child.innerHTML=msg;
    document.body.appendChild(modal);
    modal.style.opacity="1";
    setTimeout(function(){
        child.innerHTML="";
        modal.style.opacity="0";
        setTimeout(function(){
            document.body.removeChild(modal);
        },500);
    },1000);
}

/**
 * ios 软键盘bug, dom高度重计算
 */
function reCalHeight(){
    setTimeout(function (){
       var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
       window.scrollTo(0, Math.max(scrollHeight - 1, 0));
    }, 100);
}

