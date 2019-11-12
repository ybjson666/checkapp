var app=new Vue({
    el:'#app',
    data:{
        check:{
            number:'',
            device_name:deviceName||"",
            device_id:deviceId||"",
            send_person:groupName||"",
            person_id:groupId||"",
            check_date:formatTime((new Date().getTime())/1000),
            check_person:realname
        },
        couples:"",
        appId:"",
        nonceStr:"",
        signature:"",
        timestamp:"",
        speakTxt:"按住说话",
        isSpeak:true,
        recVoice:"",
        hasVoice:false,
        timer:null,
        upPic:[],
        loading:false,
        curIndex:null,
        isDele:false,
        timeOutEvent:0,
        device_voice:"",
        start_time:"",
        end_time:"",
        rec_time:"",
        isAbled:false,
        preUrl:"",
        confgList:[],
        hasError:false,
        token:token||""
    },
    methods: {
        chooseDevice(){
            window.location.href="deviceList.html"
        },
        choosePerson(){
            window.location.href="groupList.html"
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
                    // alert(serverId)
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
                                                    _this.device_voice=data.data.img;
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
                                        // _this.sourceId=serverId;
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
                                                _this.device_voice=data.data.img;
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
        subPrarms(){
            var _this=this;
            if(!this.check.device_id){
                toggleModal("请选择设备");
                return false;
            }else{
                this.confgList.map(function(item){
                    if(!item.status){
                        toggleModal("请将详情每一项状态勾选完成");
                         return false;
                    }
                })
            }
            if(this.hasError){
                if(!this.couples){
                    toggleModal("请填写异常反馈内容");
                    return false;
                }else if(!this.upPic.length){
                    toggleModal("请上传反馈图片");0
                    return false;
                }
            }
            var postParams={
                datas:{
                    token,
                    app_version,
                    port,
                    type,
                    oid,
                    de_id:this.check.device_id,
                    rt_num:this.check.number,
                    person_iable:this.check.person_id,
                    content:JSON.stringify(this.confgList),
                    back_note:this.hasError?this.couples:"",
                    back_img:this.hasError?this.upPic.join(','):"",
                    back_voice:this.device_voice||""
                },
                url:"/timeRepair/ReleaseTask"
            }
           
            this.isAbled=true;
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    toggleModal(data.message);
                    setTimeout(function(){
                        WeixinJSBridge.call("closeWindow");
                    },2000);
                }else{
                    _this.isAbled=true;
                    toggleModal(data.message);
                }
            })

        },
        loginSuccess(data){
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
                    _this.realname=data.data.realname;
                    _this.firm_name=data.data.firm_name;
                    _this.token=data.data.token_web;
                    sessionStorage.setItem('token',data.data.token_web);
                    sessionStorage.setItem('realname',data.data.realname);
                    sessionStorage.setItem('firm_name',data.data.firm_name);
                    _this.getNumbers(_this.token);
                    _this.getConfigList(_this.token);
                }
            })
        },
        getNumbers(token){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    type,
                    token:token
                },
                url:"/timeRepair/TimeRepairNum"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.check.number=data.data.de_num;
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
        getConfigList(token){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    type,
                    token
                },
                url:"/timeRepair/TroubleConfig"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    var arr=data.data;
                    arr.map(function(item){
                        item.status='0';
                    })
                    _this.confgList=arr;
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
            this.getNumbers(this.token);
            this.getConfigList(this.token);
        }
    },
    watch: {
        confgList:{
           handler(newvalue){
               var arr=[];
                newvalue.map(function(item){
                    if(item.status&&item.status=='1'){
                        arr.push(item)
                    }
                });
                if(arr.length){
                    this.hasError=true;
                }else{
                    this.hasError=false;
                }
           },
           deep:true
            
        }
    },
})