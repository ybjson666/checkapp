var app=new Vue({
    el:"#app",
    data:{
        user_phone:"",
        picture_code:"",
        pic_codes:"",
        info_code:"",
        isError:false,
        errors:"",
        code_txt:"获取验证码",
        isUse:false,
        uuid:""
    },
    methods: {
        goNext(){
            var _this=this;
            if(!this.user_phone){
                toggleModal("请输入电话号码");
                return false;
            }else if(!reg_phone.test(this.user_phone)){
                toggleModal("请输入正确的电话号码");
                return false;
            }
            else if(!this.pic_codes){
                toggleModal("请输入图形验证码");
                closeModal();
                return false;
            }
            else if(!this.info_code){
                toggleModal("请输入短信验证码");
                return false;
            }
            
            var postParams={
                datas:{
                    app_version:app_version,
                    port:port,
                    uuid:this.uuid,
                    code:this.info_code,
                    phone:this.user_phone,
                    captcha:this.pic_codes
                },
                url:"/user/UserPhoneProof"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    window.location="register.html?uuid="+_this.uuid;
                }else{
                    toggleModal(data.message);
                }
            })
        },
        getCodes(){
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
        getPictureCode(){
            this.getPicture();
        },
        getPicture(){
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
        }
    },
    mounted() {
       this.getPicture();
    }
})