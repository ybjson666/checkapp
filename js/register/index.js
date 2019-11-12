var app=new Vue({
    el:"#app",
    data:{
        company_name:"",
        user_name:"",
        user_pwd:"",
        user_pwd_again:"",
        uuid:"",
        firm_id:"",
        user_phone:"",
        pic_codes:"",
        info_code:"",
        picture_code:"",
        code_txt:"获取验证码",
        isUse:false,
        isFlag:false,
        isRecommen:false,
        oppen_id:"",
        errors:"",
        isError:false,
        recommen_type:"",
        oid:oid||""
    },
    methods: {
        register(){/**注册 */
            var _this=this;
            if(!this.company_name){
                toggleModal("请输入公司名字");
                return;
            }else if(!this.user_name){
                toggleModal("请输入您的姓名");
                return;
            }else if(!this.user_pwd){
                toggleModal("请输入密码");
                return;
            }else if(!reg_pwd.test(this.user_pwd)){
                toggleModal("密码格式错误，请输入正确的密码格式");
                return;
            }else if(!this.user_pwd_again){
                toggleModal("请再次输入密码");
                return;
            }else if(!reg_pwd.test(this.user_pwd_again)){
                toggleModal("密码格式错误，请输入正确的密码格式");
                return;
            }else if(this.user_pwd_again!==this.user_pwd){
                toggleModal("两次的密码不一致");
                return;
            }
            var postParams={
                url:"/user/UserPhoneProof",
                datas:{
                    app_version,
                    port,
                    uuid:this.uuid,
                    phone:this.user_phone,
                    code:this.info_code,
                }
            }
            this.isFlag=true;
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.registe_func();
                }else{
                    _this.isFlag=false;
                    toggleModal(data.message);
                }
            })
            
        },
        registe_func(){
            var _this=this;
            var postParams={
                url:"/user/UserEnroll",
                datas:{
                    app_version,
                    port,
                    uuid:this.uuid,
                    name:this.user_name,
                    firm_name:this.company_name,
                    pwd:this.user_pwd,
                    repeat_pwd:this.user_pwd_again,
                    into_type:1,
                    openId:this.oppen_id,
                    into_type:"1",
                    firm_id:this.recommen_type=='2'?firm_id:"",
                    team_id:this.recommen_type=='2'?team_id:"",
                    part_type,
                    oid:this.oid
                }
            }
            
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    toggleModal(data.message);
                    _this.isFlag=false;
                    sessionStorage.setItem('token',data.data.token_web);
                    sessionStorage.setItem('realname',data.data.realname);
                    sessionStorage.setItem('firm_name',data.data.firm_name);
                    setTimeout(function(){
                        window.location="regDown.html";
                    },2000);
                }else{
                    toggleModal(data.message);
                    setTimeout(function(){
                        _this.isFlag=false;
                    },2000);
                }
            })
        },
        getPictureCode(){
            this.getPicture();
        },
        getPicture(){/**获取图形验证码 */
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port
                },
                url:"/user/ImageCode"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.uuid=data.data.uuid;
                    _this.picture_code=data.data.img;
                }else{
                    toggleModal(data.message);
                }
            })
        },
        getCodes(){/**获取验证码 */
            var _this=this;
            if(!this.user_phone){
                toggleModal("请输入电话号码");
                return false;
            }else if(!this.pic_codes){
                toggleModal("请输入图形验证码");
                return false;
            }
            var postParams={
                datas:{
                    app_version,
                    port,
                    phone:this.user_phone,
                    captcha:this.pic_codes,
                    uuid:this.uuid
                },
                url:"/user/EnrollSms"
            }
            this.isUse=true;
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    toggleModal(data.message);
                    setTimeout(function(){
                        var sec=60;
                        var timer=setInterval(function(){
                            sec--;
                            _this.code_txt=sec+'s';
                            if(sec<1){
                                clearInterval(timer);
                                _this.code_txt="重新发送";
                                _this.isUse=false;
                                sec=60;
                            }
                        },1000);
                    },500);
                    
                }else{
                    toggleModal(data.message);
                    _this.isUse=false;
                }
            })
        },
        getInfo(){/**获取公司信息 */
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    firm_id:firm_id
                },
                url:"/user/FindFirmInfo"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.company_name=data.data.firm_name;
                }else{
                    toggleModal(data.message);
                }
            })
        },
        isJoin(){/**判断用户是否已加入该公司 */
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    firm_id:firm_id,
                    team_id:team_id,
                    openid:this.oppen_id,
                    part_type:part_type
                },
                url:"/user/TeamHaveU"
            }
        
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    if(data.data=='1'){
                        _this.isRecommen=true;
                        _this.getInfo();
                    }else{
                        window.location.href='warn.html?warn='+data.message;
                    }
                   
                }else{
                    window.location.href='warn.html?warn='+data.message;
                }
            })
        }
    },
    created() {
        var params=getRequest();
        this.oppen_id=params.openid;
        if(params.oid){
            this.oid=params.oid;
        }
        if(team_id){
            this.recommen_type='2';
            this.isJoin();
        }else{
            this.recommen_type='1';
        }
        this.getPicture();
    }
})