var app=new Vue({
    el:"#app",
    data:{
        task:{},
        btnGroups:[
            {
                name:"正常",
                type:0
            },
            {
                name:"异常",
                type:1
            }
        ],
        cur_index:0,
        record:"",
        descp:"",
        rt_id:"",
        hasVoice:false,
        appId:"",
        nonceStr:"",
        signature:"",
        timestamp:"",
        speakTxt:"按住说话",
        isSpeak:false,
        upPic:[],
        loading:false,
        record_type:0,
        curIndex:null,
        isDele:false,
        rtf_id:"",
        record_voice:"",
        start_time:"",
        end_time:"",
        rec_time:"",
        recVoice:""
    },
    methods: {
        goBack(){
            window.history.go(-1);
        },
        seleType(type,index){
            this.cur_index=index;
            this.record_type=type;
            this.isSpeak=false;
        },
        touchStr(index){
            var _this=this;
            window.event? window.event.returnValue = false : e.preventDefault();
            clearTimeout(_this.timeOutEvent);
            _this.timeOutEvent=0;
            _this.timeOutEvent=setTimeout(function(){
                _this.curIndex=index;
                _this.isDele=true;
            },400);
        },
        touchEnded(){
            var _this=this;
            clearTimeout(_this.timeOutEvent);
        },
        sureDele(){
            var index=this.curIndex;
            this.upPic.splice(index,1);
            this.isDele=false;
        },
        cancleDele(){
            this.curIndex=null;
            this.isDele=false;
        },
        fetchData(){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    token,
                    type,
                    rt_id:this.rt_id,
                },
                url:"/timeRepair/TimeRepairInfo"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.task=data.data;
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
        recordVoice(){
            this.isSpeak=!this.isSpeak;
            this.recVoice="";
            this.hasVoice=false;
        },
        speaking(e){
            e.preventDefault();
            var _this=this;
            _this.speakTxt="松开结束";
            _this.getConfig();
            wx.ready(function(){
                wx.startRecord({
                    success:function(){
                        _this.start_time= new Date().getTime();
                        wx.onVoiceRecordEnd({
                            complete:function(res){
                                toggleModal("最多只能录制一分钟");
                                _this.recVoice=res.localId;
                            }
                        })  
                    }
                });
            })
        },
        speakingEnd(e){
            e.preventDefault();
            var _this=this;
            _this.speakTxt="按住说话";
            _this.getConfig();
            wx.ready(function(){
                _this.end_time=new Date().getTime();
                _this.rec_time=_this.end_time-_this.start_time;
                if(_this.rec_time<2000){
                    _this.start_time=0;
                    _this.end_time=0;
                    _this.rec_time=0;
                    toggleModal("录音时间不能少于2秒");
                    wx.stopRecord({});
                    return false;
                }else{
                    if(_this.start_time){
                        wx.stopRecord({
                            success: function (res) {
                            var localId = res.localId;
                            _this.recVoice=localId;
                            _this.rec_time=Math.ceil(_this.rec_time/1000);
                            wx.uploadVoice({
                                localId: localId, 
                                isShowProgressTips: 0, // 默认为1，显示进度提示
                                success: function (data) {
                                    var serverId = data.serverId; 
                                    var postParams={
                                        datas:{
                                            app_version,
                                            port,
                                            media:serverId,
                                            class:'2'
                                        },
                                        url:"/wx/JsWxMedia"
                                    }
                                    requestFunc(postParams).then(function(data){
                                        if(data.code==200){
                                            _this.record_voice=data.data.img;
                                        }
                                    })
                                }
                            })
                            
                                _this.hasVoice=true;
                                _this.isSpeak=false;
                            }
                        })
                    }
                }
            })
        },
        playVoice(){
            var _this=this;
            _this.getConfig();
            wx.ready(function(){
                wx.playVoice({
                    localId: _this.recVoice
                })                    
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
        choosePicture(){
            var _this=this;
            if(_this.upPic.length>=3){
                toggleModal("最多选择三张图片");
            }else{
                _this.getConfig();
                wx.ready(function(){
                    _this.showFlag=false;
                    wx.chooseImage({
                        count: _this.upPic.length?(3-_this.upPic.length):3, // 默认9
                        sizeType: ['original','compressed'], 
                        sourceType:['camera','album'], 
                        success: function (res) {
                        var localIds = res.localIds;
                        _this.loading=true;
                        _this.syncUpload(localIds);
                        }
                    });
                })
            }
        },
        syncUpload(localIds){
            var _this=this;
            this.getConfig();
            var localId = localIds.pop();
            wx.uploadImage({
                localId: localId.toString(),
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
                            if(_this.upPic.length<3){
                                var return_img=data.data.img;
                                _this.upPic.push(return_img);
                            }
                        }
                    })
                    if(localIds.length > 0 &&_this.upPic.length<=3){
                        setTimeout(function(){
                            _this.syncUpload(localIds);
                        },100);
                    }else{
                        setTimeout(function(){
                            _this.loading=false;
                            toggleModal("上传成功");
                        },2000);
                        
                    }
                }
            })
        },
        publish(){
            var _this=this;
            if(this.record_type==1){
                if(!this.record){
                    toggleModal("请输入缺陷描述");
                    return;
                }
            }
            var postParams={
                datas:{
                    app_version,
                    port,
                    token,
                    type,
                    rt_id:this.rt_id,
                    rtf_id:this.rtf_id,
                    voice:this.record_voice,
                    img:this.upPic.join(","),
                    status:this.record_type,
                    note:this.record
                },
                url:"/timeRepair/TimeRepairBack"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    toggleModal(data.message);
                    setTimeout(function(){
                        // WeixinJSBridge.call("closeWindow");
                        window.history.go(-1);
                    }, 2000);
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
            var url=location.href;
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
                    sessionStorage.setItem('token',data.data.token_web);
                    sessionStorage.setItem('realname',data.data.realname);
                    sessionStorage.setItem('firm_name',data.data.firm_name);
                    _this.logining=false;

                }
            })
        }
    },
    created() {
        var params=getRequest();
            this.rt_id=params.rt_id;
            this.rtf_id=params.rtf_id;
            this.getParams();
        if(token){
            this.fetchData();
        }else{
            wxLogin(this.loginSuccess)
        }
    }
    
})