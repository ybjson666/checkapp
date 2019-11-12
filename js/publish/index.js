var app=new Vue({
    el:"#app",
    data:{
        notice:{
            title:"",
            contents:"",
            upPic:[]
        },
        picList:[],
        curindex:null,
        token:"",
        loading:false,
        timeOutEvent:0,
        isDele:false,
        isUse:false
    },
    methods: {
        addPic(){
            this.$refs.files.dispatchEvent(new MouseEvent('click'));
            this.loading=true;
        },
        chooseImage(e){
            var _this=this;
            if(this.picList.length<3){
                var file = e.target.files[0];
                var fr=new FileReader();
                var fmData=new FormData();
                fr.readAsDataURL(file)
                fr.onload= function(e){
                    _this.picList.push(this.result);
                }
                fmData.append("file",file);
                fmData.append('app_version',app_version);
                fmData.append('port',port);
                this.upLoadPic(fmData);
            }else{
                toggleModal("最多只能上传3张图片");
                return false;
            }
            
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
                        var return_pic=data.data;
                        _this.notice.upPic.push(return_pic);
                        _this.loading=false;
                        setTimeout(function(){
                            toggleModal(data.message);
                        },1000);
                        
                    }else{
                        _this.loading=false;
                        setTimeout(function(){
                            toggleModal(data.message);
                        },1000);
                    }
                }
            })
        },
        touched(index){
            var _this=this;
            window.event? window.event.returnValue = false : e.preventDefault();
            clearTimeout(_this.timeOutEvent);
            _this.timeOutEvent=0;
            _this.timeOutEvent=setTimeout(function(){
                _this.isDele=true;
                _this.curindex=index;
            },400);
        },
        touchEnded(){
            var _this=this;
            clearTimeout(_this.timeOutEvent);
        },
        sureDele(){
            this.picList.splice(this.curindex,1);
            this.notice.upPic.splice(this.curindex,1);
            this.isDele=false;
        },
        cancleDele(){
            this.isDele=false;
        },
        publishing(){
            var _this=this;
            if(!this.notice.title){
                toggleModal("请输入标题");
                return false;
            }else if(!this.notice.contents){
                toggleModal("请输入公告内容");
                return false;
            }
            this.isUse=true;
            
            var postParams={
                datas:{
                    app_version,
                    port:'2',
                    type:'1',
                    token:this.token,
                    title:this.notice.title,
                    content:this.notice.contents,
                    img:this.notice.upPic.join(',')
                },
                url:"/msg/ReleaseBulletin"
            }
            
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.isUse=false;
                    toggleModal("发布成功");
                    setTimeout(function(){
                        window.location.reload();
                    },2000)
                }else{
                    _this.isUse=false;
                    toggleModal(data.message);
                }
            })

        }
    },
    created() {
        var params=getRequest();
        this.token=params.token;
    }
})