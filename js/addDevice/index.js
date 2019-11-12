var app=new Vue({
    el:"#app",
    data:{
        device_name:"",
        device_number:"",
        device_types:"",
        device_company:"",
        device_addr:"",
        device_style:"",
        device_provider:"",
        device_dutor:"",
        device_remark:"",
        upPic:[],
        isDele:false,
        loading:false,
        appId:"",
        nonceStr:"",
        signature:"",
        timestamp:"",
        isAble:false,
        token:token||""
    },
    methods: {
        goBack(){
            window.history.go(-1);
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
        publish(){
            var _this=this;
            if(!this.device_name){
                toggleModal("请输入设备名称");
                return false;
            }else if(!this.device_number){
                toggleModal("请输入设备编号");
                return false;
            }else if(!this.device_types){
                toggleModal("请输入控制系统型号");
                return false;
            }else if(!this.device_company){
                toggleModal("请输入设备单位");
                return false;
            }else if(!this.device_addr){
                toggleModal("请输入设备详细地址");
                return false;
            }else if(!this.device_style){
                toggleModal("请输入设备型号");
                return false;
            }else if(!this.device_provider){
                toggleModal("请输入设备厂家");
                return false;
            }else if(!this.device_dutor){
                toggleModal("请输入责任人");
                return false;
            }

            this.isAble=true;

            var postParams={
                datas:{
                    app_version,
                    port,
                    type,
                    token:this.token,
                    number:this.device_number,
                    name:this.device_name,
                    city:this.device_company,
                    system_num:this.device_types,
                    address:this.device_addr,
                    model:this.device_style,
                    vender:this.device_provider,
                    director:this.device_dutor,
                    note:this.device_remark,
                    img:this.upPic.join(",")
                },
                url:"/device/AddDevice"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    toggleModal("添加成功");
                    setTimeout(function(){
                        window.history.go(-1);
                    },2500);
                }else{
                    toggleModal(data.message);
                    _this.isAble=false;
                }
            })

        }
    },
    created() {
        var params=getRequest();
        this.token=params.token;
        this.getParams();
    }
})