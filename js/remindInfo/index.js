var app=new Vue({
    el:"#app",
    data:{
        remind:{},
        rep_id:"",
        upPic:[]
    },
    methods: {
        fetchData(){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    token,
                    re_id:this.rep_id,
                    type,
                },
                url:"/repair/ReminderInfo"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.remind=data.data;
                    data.data.device_img.indexOf(',')==-1?_this.upPic.push(data.data.device_img):_this.upPic=data.data.device_img.split(',');
                }else{
                    toggleModal(data.message);
                }
            })
        }
    },
    mounted() {
        var params=getRequest();
        this.rep_id=params.rep_id;
        this.fetchData();
    }
})