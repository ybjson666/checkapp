var app=new Vue({
    el:"#app",
    data:{
        user:{},
        modifyUser:false,
        modifyPhone:false,
        picture_code:"",
        uuid:"",
        change_phone:"",
        change_code:"",
        phone_code:"",
        isUse:false,
        code_txt:"获取",
        appId:"",
        nonceStr:"",
        signature:"",
        timestamp:"",
        catchUrl:"",
        loading:false,
        change_name:"",
        logining:false,
        token:token||""
    },
    methods: {
        changeUser(){
            this.modifyUser=true;
        },
        closeUser(){
            this.modifyUser=false;
        },
        clearUser(){
            this.change_name="";
        },
        changePhone(){
            this.modifyPhone=true;
        },
        closePhone(){
            this.modifyPhone=false;
        },
        iOSKeyboardFixer(){
            reCalHeight();
        },
        fetchUserInfo(token){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    token:token,
                    type
                },
                url:"/usersetup/UserInfo"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.user=data.data;
                }else if(data.code==401){
                    toggleModal(data.message);
                    setTimeout(function(){
                        wxLogin(_this.loginSuccess);
                    },2500);
                }else{
                    toggleModal(data.message);
                }
            })
        },
        subChangeName(){
            var _this=this;
            if(!this.change_name){
                toggleModal("请输入姓名");
                return;
            }
            var postParams={
                datas:{
                    app_version,
                    port,
                    token:this.token,
                    type,
                    set_up:'2',
                    val:this.change_name
                },
                url:"/usersetup/UserSetInfo"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.user.realname=_this.change_name;
                    toggleModal(data.message);
                    _this.modifyUser=false;
                }else{
                    toggleModal(data.message);
                }
            })
        },
        getPicture(){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port
                },
                url:"/user/ImageCode"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.uuid=data.data.uuid;
                    _this.picture_code=data.data.img;
                }else{
                    toggleModal(data.message);
                }
            })
        },
        getPictureCode(){
            this.getPicture();
        },
        getPhoneCode(){
            var _this=this;
            if(!this.change_phone){
                toggleModal("请输入新电话号码");
                return false;
            }else if(!this.change_code){
                toggleModal("请输入图形验证码");
                return false;
            }
            var postParams={
                datas:{
                    app_version,
                    port,
                    phone:this.change_phone,
                    captcha:this.change_code,
                    uuid:this.uuid
                },
                url:"/user/EnrollSms"
            }
            this.isUse=true;
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    toggleModal(data.message);
                    setTimeout(function(){
                        var sec=60;
                        var timer=setInterval(function(){
                            sec--;
                            _this.code_txt=sec+'s';
                            if(sec<1){
                                clearInterval(timer);
                                _this.code_txt="重新发送";
                                _this.isUse=false;
                                sec=60;
                            }
                        },1000);
                    },500);
                    
                }else{
                    toggleModal(data.message);
                    _this.isUse=false;
                }
            })
        },
        subChangePhone(){
            var _this=this;
            if(!this.change_phone){
                toggleModal("请输入新手机号");
                return;
            }else if(!this.change_code){
                toggleModal("请输入图形验证码");
                return;
            }else if(!this.phone_code){
                toggleModal("请输入短信验证码");
                return;
            }
            var postParams={
                datas:{
                    app_version,
                    port,
                    token:this.token,
                    type,
                    set_up:'3',
                    val:this.change_phone,
                    oldphone:this.user.phone
                },
                url:"/usersetup/UserSetInfo"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    toggleModal(data.message);
                    _this.user.phone=_this.change_phone;
                    _this.modifyPhone=false;
                }else{
                    toggleModal(data.message);
                }
            })
        },
        getParams(){
            var _this=this;
            var curUrl=window.location.href.split('#')[0];
            var postParams={
                datas:{
                    app_version,
                    port,
                    url:curUrl
                },
                url:"/wx/JsWxInfo"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                  _this.appId=data.data.appId;
                  _this.nonceStr=data.data.nonceStr;
                  _this.signature=data.data.signature;
                  _this.timestamp=data.data.timestamp;
                }else{
                    toggleModal('获取微信配置参数失败');
                }
            })
        },
        getConfig(){
            var _this=this;
            wx.config({
                debug: false,
                appId: _this.appId,
                timestamp: _this.timestamp,
                nonceStr: _this.nonceStr,
                signature: _this.signature,
                jsApiList: [
                    'uploadVoice',
                    'chooseImage',
                    'uploadImage',
                    'downloadImage',
                    'startRecord',
                    'stopRecord',
                    'onVoiceRecordEnd',
                    'playVoice',
                    'pauseVoice',
                    'stopVoice',
                    'onVoicePlayEnd'
                ]
            });
        },
        modifyAvata(){
            var _this=this;
            _this.getConfig();
            wx.ready(function(){
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original','compressed'], 
                    sourceType:['camera','album'], 
                    success: function (res) {
                    var localIds = res.localIds;
                    _this.catchUrl=localIds;
                    _this.loading=true;
                    _this.uploadImageurl(localIds);
                    }
                });
            })
        },
        uploadImageurl (localIds){
            var _this=this;
            _this.getConfig();
            wx.uploadImage({
                localId: localIds.toString(), 
                isShowProgressTips: 0, 
                success: function (res) {
                    var serverId = res.serverId;
                        var postParams={
                            datas:{
                                app_version,
                                port,
                                media:serverId
                            },
                            url:"/wx/JsWxMedia"
                        }
                        requestFunc(postParams).then(function(data){
                            if(data.code==200){
                                var return_img=data.data.img;
                                _this.upPicUrl(return_img);
                            }
                        })
                    
                    }
                });
        },
        upPicUrl(img_url){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    type,
                    token:this.token,
                    set_up:1,
                    val:img_url
                },
                url:"/usersetup/UserSetInfo"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.loading=false;
                    toggleModal(data.message);
                    setTimeout(function(){
                        _this.user.pic_head=_this.catchUrl;
                    },1000);
                }
            })
        },
        loginSuccess(data){
            this.logining=true;
            sessionStorage.setItem('open_id',data);
            this.logins(data);
        },
        logins(id){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    login_type:'2',
                    openid:id
                },
                url:"/user/DoLogin"
            }
            requestFunc(postParams).then(function(data){
                if(data.code!==200){
                    window.location.href="register.html?openid="+id;
                }else{
                    _this.token=data.data.token_web;
                    sessionStorage.setItem('token',data.data.token_web);
                    sessionStorage.setItem('realname',data.data.realname);
                    sessionStorage.setItem('firm_name',data.data.firm_name);
                    _this.logining=false;
                    _this.fetchUserInfo(data.data.token_web);
                    _this.getPicture();
                }
            })
        }
    },
    created() {
        this.getParams();
        this.getPicture();
        if(!token){
            wxLogin(this.loginSuccess);
        }else{
            this.fetchUserInfo(this.token);
        }
    },
})