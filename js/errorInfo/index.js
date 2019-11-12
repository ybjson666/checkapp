var app=new Vue({
    el:"#app",
    data:{
        check:{},
        list:[],
        isPlay:false,
        rt_id:"",
        token:token||"",
        player:null
    },
    methods: {
        goBack(){
            window.history.go(-1);
        },
        plays(){
            var _this=this;
            this.isPlay=true;
            this.player=new Audio();
            this.player.src=this.check.back_voice;
            this.player.play();
            this.player.addEventListener('ended', function () { 
                _this.isPlay=false;
            })
        },
        pauses(){
            this.isPlay=false;
            this.player.pause();
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
                    _this.token=data.data.token_web;
                    sessionStorage.setItem('token',data.data.token_web);
                    sessionStorage.setItem('realname',data.data.realname);
                    sessionStorage.setItem('firm_name',data.data.firm_name);
                    _this.fetchData(_this.token);
                    _this.fetchInfo(_this.token);
                }
            })
        },
        fetchInfo(token){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    type,
                    token:token,
                    rt_id:this.rt_id
                },
                url:"/timeRepair/TimeRepairInfo"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.check=data.data;
                    _this.check.couple_pics=[];
                    if(data.data.back_img){
                        data.data.back_img.indexOf(',')==-1?_this.check.couple_pics.push(data.data.back_img):_this.check.couple_pics=data.data.back_img.split(',');
                    }
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
        fetchData(token){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    type,
                    token:token,
                    rt_id:this.rt_id
                },
                url:"/timeRepair/TimeRepairContent"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.list=data.data;
                }else{
                    toggleModal(data.message);
                }
            })
        }

    },
    created() {
        var params=getRequest();
        this.rt_id=params.rt_id;
        if(!token){
            wxLogin(this.loginSuccess);
        }else{
            this.fetchData(this.token);
            this.fetchInfo(this.token);
        }
    }
})