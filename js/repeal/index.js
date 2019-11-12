var app=new Vue({
    el:"#app",
    data:{
        repair:{},
        reason:"",
        reason_remark:"",
        rep_id:"",
        isUse:false,
        isPlay:false,
        player:null,
        upPic:[]
    },
    methods: {
        goBack(){
            window.history.go(-1);
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
        subRepeal(){
            var _this=this;
            if(!this.reason){
                toggleModal("请选择撤销报单原因");
                return;
            }

            var postParams={
                datas:{
                    app_version,
                    port,
                    token,
                    re_id:this.rep_id,
                    type,
                    reason:this.reason,
                    reason_note:this.reason_remark
                },
                url:"/repair/CancelRepair"
            }
            this.isUse=true;
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
        plays(){
            var _this=this;
            this.isPlay=true;
            this.player=this.$refs.players;
            this.player.play();
            this.player.addEventListener('ended', function () { 
                _this.isPlay=false;
            })
        },
        pauses(){
            this.isPlay=false;
            this.player.pause();
        },
        scanImg(curImg) {
            var _this=this;
            WeixinJSBridge.invoke("imagePreview", {
                "urls": _this.upPic,
                "current": curImg
            });
        }
    },
    mounted() {
        var params=getRequest();
        this.rep_id=params.rep_id;
        this.fetchData();
    }
})