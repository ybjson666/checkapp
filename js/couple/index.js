var app=new Vue({
    el:"#app",
    data:{
        couple_type:"",
        isDele:false,
        isUse:false,
        loading:false,
        timeOutEvent:0,
        couples:"",
        couple_pic:"",
        token:token||""
    },
    methods: {
        touched(){
            var _this=this;
            window.event? window.event.returnValue = false : e.preventDefault();
            clearTimeout(_this.timeOutEvent);
            _this.timeOutEvent=0;
            _this.timeOutEvent=setTimeout(function(){
                _this.isDele=true;
            },400);
        },
        touchEnded(){
            var _this=this;
            clearTimeout(_this.timeOutEvent);
        },
        sureDele(){
            this.couple_pic="";
            this.isDele=false;
        },
        cancleDele(){
            this.isDele=false;
        },
        selePic(){
            var _this=this;
            _this.getConfig();
            wx.ready(function(){
                wx.chooseImage({
                    count:1, // 默认9
                    sizeType: ['original','compressed'], 
                    sourceType:['camera','album'], 
                    success: function (res) {
                    var localIds = res.localIds[0];
                    _this.loading=true;
                    _this.syncUpload(localIds);
                    }
                });
            })
            
        },
        syncUpload(localIds){
            var arr=[];
            var _this=this;
            this.getConfig();
            wx.uploadImage({
                localId:localIds,
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
                            _this.loading=false;
                            var return_img=data.data.img;
                            _this.couple_pic=return_img;
                            toggleModal("上传成功");  
                        }
                    })
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
                    toggleModal(data.message);
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
        subParam(){
            var _this=this;
            if(!this.couple_type){
                toggleModal("请选择反馈问题类型");
                return;
            }
            var postParams={
                datas:{
                    app_version,
                    port,
                    token:this.token,
                    type,
                    back_type:this.couple_type,
                    msg_pic:this.couple_pic,
                    msg:this.couples
                },
                url:"/usersetup/UserBack"
            }
            this.isUse=true;
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.isUse=false;
                   toggleModal("反馈成功");
                   setTimeout(function(){
                    WeixinJSBridge.call("closeWindow");
                   },2000)
                }else if(data.code==401){
                    _this.isUse=false;
                    toggleModal(data.message);
                    setTimeout(function(){
                        wxLogin(_this.loginSuccess);
                    },2500);
                }else{
                    _this.isUse=false;
                   toggleModal(data.message);
                   _this.devicePicList=[];
                   _this.couple_type="";
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
                }
            })
        }
    },
    created() {
        this.getParams();
        if(!token){
            wxLogin(this.loginSuccess);
        }
    }
})