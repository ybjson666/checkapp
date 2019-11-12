var app=new Vue({
    el:"#app",
    data:{
        appId:"",
        nonceStr:"",
        signature:"",
        timestamp:"",
        title:"",
        link:"",
        share_pic:"http://pc.scsxhsk.com/backstage/dist/style/res/dd_logo.png",
        token:token||"",
        code_pic:""
    },
    methods: {
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
                    _this.realname=data.data.realname;
                    _this.firm_name=data.data.firm_name;
                    _this.token=data.data.token_web;
                    _this.getCode();
                    sessionStorage.setItem('token',data.data.token_web);
                    sessionStorage.setItem('realname',data.data.realname);
                    sessionStorage.setItem('firm_name',data.data.firm_name);
                    _this.logining=false;
                }
            })
        },
        getCode(){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    type,
                    token:this.token,
                },
                url:"/team/Invitation"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.code_pic=data.data.code1;
                    _this.link=data.data.url2;
                    setTimeout(function(){
                        wx.config({
                            debug: false,
                            appId: _this.appId,
                            timestamp: _this.timestamp,
                            nonceStr: _this.nonceStr,
                            signature: _this.signature,
                            jsApiList: [
                                'onMenuShareTimeline',    
                                'onMenuShareAppMessage' 
                            ]
                        });
                
                        wx.ready(function(){
                            wx.onMenuShareTimeline({
                                title: '邀请您加入内部报修平台',
                                link: _this.link,
                                desc:"新的方式，新的体验",
                                imgUrl: _this.share_pic,
                                success: function () { 
                                    
                                },
                                cancel: function () { 
                                    
                                }
                            });
                            wx.onMenuShareAppMessage({
                                    title: '邀请您加入内部报修平台',
                                    link: _this.link,
                                    desc:"新的方式，新的体验",
                                    imgUrl: _this.share_pic,
                                    success: function (res) {
                                        //alert('分享给朋友成功');
                                    },
                                    cancel: function (res) {
                                    //alert('你没有分享给朋友');
                                    },
                                    fail: function (res) {
                                    
                                    }
                
                            })
                        })
                    },500)
                }else if(data.code==401){
                    toggleModal(data.message);
                    setTimeout(function(){
                        wxLogin(_this.loginSuccess);
                    },2500);
                }else{
                    toggleModal(data.message);
                }
            })
        }
    },
    created() {
        this.getParams();
        if(!token){
            wxLogin(this.loginSuccess);
        }else{
            this.getCode();
        }
    }
})
     

