var app=new Vue({
    el:"#app",
    data:{
        repair:{},
        isUse:false,
        rep_id:"",
        isDele:false,
        curIndex:null,
        appId:"",
        nonceStr:"",
        signature:"",
        timestamp:"",
        upPic:[],
        loading:false,
        player:null,
        isPlay:false,
        isSpeak:false,
        hasVoice:false,
        speakTxt:"按住说话",
        start_time:"",
        end_time:"",
        rec_time:"",
        isPress:false
    },
    methods: {
        goBack(){
            window.history.go(-1);
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
        touchStr(index){
            var _this=this;
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
        plays(){
            var _this=this;
            this.isPlay=true;
            this.player=new Audio();
            this.player.src=this.repair.describe_voice;
            this.player.play();
            this.player.addEventListener('ended', function () { 
                _this.isPlay=false;
            })
        },
        pauses(){
            this.isPlay=false;
            this.player.pause();
        },
        fetchData(){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    token,
                    re_id:this.rep_id,
                    type
                },
                url:"/repair/RepairInfo"
            }

            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.repair=data.data;
                    if(data.data.device_img){
                        data.data.device_img.indexOf(',')==-1?_this.upPic.push(data.data.device_img):_this.upPic=data.data.device_img.split(',');
                    }
                    
                }else{
                    toggleModal(data.message);
                }
            })
        },
        subModify(){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    token,
                    id:this.rep_id,
                    type,
                    describe:this.repair.describe,
                    img:this.upPic.join(','),
                    voice:this.repair.voice
                },
                url:"/repair/ModifyRepair"
            }

            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    toggleModal(data.message);
                    setTimeout(function(){
                        _this.isUse=false;
                        WeixinJSBridge.call("closeWindow");
                    }, 2000);
                }else{
                    toggleModal(data.message);
                    _this.isUse=false;
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
            _this.start_time= new Date().getTime();
                _this.getConfig();
                wx.ready(function(){
                    wx.startRecord({
                        success:function(){
                            wx.onVoiceRecordEnd({
                                complete:function(res){
                                    toggleModal("最多只能录制一分钟");
                                    var localId = res.localId;
                                    _this.recVoice=localId;
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
                                                    _this.device.device_voice=data.data.img;
                                                }
                                            })
                                        }
                                    })
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
                                                _this.repair.voice=data.data.img;
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
        scanImg(curImg) {
            var _this=this;
            WeixinJSBridge.invoke("imagePreview", {
                "urls": _this.upPic,
                "current": curImg
            });
        }
    },
    created() {
        var params=getRequest();
        this.rep_id=params.rep_id;
        this.fetchData();
        this.getParams();
    }
    
})