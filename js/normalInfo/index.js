var app=new Vue({
    el:"#app",
    data:{
        check:{},
        list:[],
        rt_id:"",
        token:token||""
    },
    methods: {
        goBack(){
            window.history.go(-1);
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
    },
})