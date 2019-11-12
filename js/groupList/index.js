var app=new Vue({
    el:"#app",
    data:{
        groupList:[],
        groupName:"",
        groupId:"",
        token:token||""
    },
    methods: {
        seleGroup(item){
            this.groupName=item.class_name;
            this.groupId=item.class_id;
            sessionStorage.setItem('groupName',item.class_name);
            sessionStorage.setItem('groupId',item.class_id);
            window.history.go(-1);
        },
        goBack(){
            window.history.go(-1);
        },
        getGroupList(){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    type,
                    token:this.token,
                    class_type:"2"
                },
                url:"/team/ClassList"
            }
            
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                   _this.groupList=data.data;
                   var groupObj={
                        class_id:"",
                        class_name:"所有检修人"
                   };
                   _this.groupList.push(groupObj);
                   
                 
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
                    _this.getGroupList();
                    sessionStorage.setItem('token',data.data.token_web);
                    sessionStorage.setItem('realname',data.data.realname);
                    sessionStorage.setItem('firm_name',data.data.firm_name);
                }
            })
        }
    },
    created() {
        if(token){
            this.getGroupList();
        }else{
            wxLogin(this.loginSuccess);
        }
        
    }
})