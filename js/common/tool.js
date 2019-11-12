function getRequest(){
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
        }

    }
    return theRequest;
}
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function formatTime(date) {
    var time = new Date(date*1000);
    var month = time.getMonth() + 1;
    var strDate = time.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    //获取日期对象 time 的年、月、日，并拼接为字符串 yyyy-mm-dd ,再返回
    return time.getFullYear() + "-" + month + "-" + strDate;
}

function wxLogin(callback) {
    var appId = 'wxbdd972e0ddf558bf';
    var oauth_url = common_url+'/vo';
    var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + location.href.split('#')[0] + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
    var code = getUrlParam("code");
    if (!code) {
        window.location = url;

    } else {
        $.ajax({
            type: 'GET',
            url: oauth_url,
            dataType: 'json',
            data: {
                code: code
            },
            success: function (data) {
                if (data.code === 200) {
                    console.log(data)
                    var oid=data.oid;
                    localStorage.setItem("oid",oid);
                    callback(data.openid)
                }
            },
            error: function (error) {
                throw new Error(error)
            }
        })
    }
}