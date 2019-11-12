var app=new Vue({
    el:"#app",
    data:{
        couple_type:"",
        isDele:false,
        isUse:false,
        loading:false,
        timeOutEvent:0,
        couples:"",
        couple_pic:"",
        upfile:""
    },
    methods: {
        touched(){
            var _this=this;
            window.event? window.event.returnValue = false : e.preventDefault();
            clearTimeout(_this.timeOutEvent);
            _this.timeOutEvent=0;
            _this.timeOutEvent=setTimeout(function(){
                _this.isDele=true;
            },400);
        },
        touchEnded(){
            var _this=this;
            clearTimeout(_this.timeOutEvent);
        },
        sureDele(){
            this.couple_pic="";
            this.upfile="";
            this.isDele=false;
        },
        cancleDele(){
            this.isDele=false;
        },
        selePic(){
            this.$refs.files.dispatchEvent(new MouseEvent('click'));
            $(".loading-block").fadeIn(300); 
        },
        changeImage(){
            var _this=this;
            var file = document.getElementById("file").files[0];
            var fr=new FileReader();
            var fmData=new FormData();
            fr.readAsDataURL(file)
            fr.onload= function(e){
                _this.couple_pic = this.result;
            }
            fmData.append("file",file);
            fmData.append('app_version',app_version);
            fmData.append('port',port);
            this.upLoadPic(fmData);
        },
        subParam(){
            var _this=this;
            if(!this.couple_type){
                toggleModal("请选择反馈问题类型");
                return;
            }
            var postParams={
                datas:{
                    app_version,
                    port,
                    token:this.token,
                    type:"1",
                    back_type:this.couple_type,
                    msg_pic:this.couple_pic,
                    msg:this.couples
                },
                url:"/usersetup/UserBack"
            }
            this.isUse=true;
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.isUse=false;
                   toggleModal("反馈成功");
                   setTimeout(function(){
                    window.location.reload();
                   },2000)
                }else if(data.code==401){
                    _this.isUse=false;
                    toggleModal(data.message);
                }else{
                    _this.isUse=false;
                   toggleModal(data.message);
                   _this.devicePicList=[];
                   _this.couple_type="";
                }
            })
        },
        upLoadPic(files){
            var _this=this;
            $.ajax({
                url:common_url+'/qiniu',
                type:"post",
                data:files,
                dataType:'json',
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success:function(data){
                    if(data.code==200){
                        _this.upfile=data.data;
                        $(".loading-block").fadeOut(300);
                        setTimeout(function(){
                            toggleModal(data.message);
                        },1000);
                        
                    }else{
                        $(".loading-block").fadeOut(300);
                        setTimeout(function(){
                            toggleModal(data.message);
                        },1000);
                    }
                }
            })
         
        }
        
    },
    created() {
        var params=getRequest();
        this.token=params.token;
    },
})