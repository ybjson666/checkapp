var app=new Vue({
    el:"#app",
    data:{
        personList:[]
    },
    methods: {
        selePerson(item){
            sessionStorage.setItem('personName',item.realname);
            sessionStorage.setItem('personId',item.id);
            window.history.go(-1);
        },
        goBack(){
           window.history.go(-1);
        },
        fetchData(){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    type,
                    token,
                    keep_type:'2'
                },
                url:"/team/KeepUserList"
            }
            
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                   _this.personList=data.data;
                }else if(data.code==401){
                    toggleModal(data.message);
                    setTimeout(function(){
                        wxLogin(_this.loginSuccess);
                    },2500);
                }
                else{
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
                    sessionStorage.setItem('token',data.data.token_web);
                    sessionStorage.setItem('realname',data.data.realname);
                    sessionStorage.setItem('firm_name',data.data.firm_name);
                }
            })
        }
    },
    created() {
        if(token){
            this.fetchData();
        }else{
            wxLogin(this.loginSuccess);
        }
        
    }   
})