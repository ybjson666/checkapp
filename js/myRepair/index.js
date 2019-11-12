
var app=new Vue({
    el:"#app",
    data:{
        repair:{},
        rep_id:"",
        upPic:[],
        isPlay:false,
        player:null,
        token:token||"",
        loading:false,
        recepitor:{},
        recordList:[],
        palyTags:false,
        isPlaying:false,
        curVoice:"",
        player_voice:null,
        isConfirm:false
    },
    methods: {
        goBack(){
            window.history.go(-1);
        },
        goReminder(){
            window.location.href="reminder.html?rep_id="+this.rep_id;
        },
        goRepeal(){
            window.location.href="repeal.html?rep_id="+this.rep_id; 
        },
        goEdit(){
            window.location.href="modiRepair.html?rep_id="+this.rep_id;
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
                    token:this.token,
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
                    _this.loading=false;
                }else{
                    toggleModal(data.message);
                }
            })
        },
        getData(){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    token:this.token,
                    re_id:this.rep_id,
                    type
                },
                url:"/repair/AcceptanceInfo"
            }

            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.recepitor=data.data.assign;
                    _this.recordList=data.data.feedback;
                }
            })
        },
        scanImg(curImg) {
          var _this=this;
            WeixinJSBridge.invoke("imagePreview", {
                "urls": _this.upPic,
                "current": curImg
            });
        },
        scanImg2(curImg) {
            var img_src=[];
            if(curImg.indexOf(",")==-1){
                img_src.push(curImg)
            }else{
                img_src=curImg.split(",");
            }
              WeixinJSBridge.invoke("imagePreview", {
                  "urls": img_src,
                  "current": img_src[0]
              });
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
                    _this.token=data.data.token_web;
                    _this.fetchData();
                    _this.getData();
                    sessionStorage.setItem('token',data.data.token_web);
                }
            })
        },
        goPlay(voice){
            this.palyTags=true;
            this.curVoice=voice;
        },
        playVoice(){
            var _this=this;
            this.isPlaying=true;
            this.player_voice=new Audio();
            this.player_voice.src=this.curVoice
            this.player_voice.play();
            this.player_voice.addEventListener('ended', function () { 
                _this.isPlaying=false;
                _this.palyTags=false;
            })
        },
        pauseVoice(){
            this.isPlaying=false;
            this.player_voice.pause();
        },
        hideVoice(){
            this.isPlaying=false;
            this.palyTags=false;
            if(this.player_voice){
                this.player_voice.pause();
            }
        },
        confirmFunc(){
            this.isConfirm=true;
        },
        sureFunc(){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    type,
                    token:this.token,
                    types:'1',
                    re_id:this.rep_id
                },
                url:"/repair/Finish"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.isConfirm=false;
                    toggleModal("确认成功");
                    setTimeout(function(){
                        window.history.go(-1);
                    },1500)
                    
    
                }else{
                    _this.isConfirm=false;
                    toggleModal(data.message);
                }
            })
        },
        cancelFunc(){
            this.isConfirm=false;
        }
    },
    created() {
        var params=getRequest();
        this.rep_id=params.rep_id;
        if(token){
            this.fetchData();
            this.getData();
        }else{
            this.loading=true;
            wxLogin(this.loginSuccess);
        }
        
    }
})