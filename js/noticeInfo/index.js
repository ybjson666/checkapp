var app=new Vue({
    el:"#app",
    data:{
        noticeInfo:{},
        noticeId:""
    },
    methods: {
        goBack(){
            window.history.go(-1);
        },
        fetchData(){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    bulletin_id:this.noticeId
                },
                url:"/msg/BulletinData"
            }
            
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.noticeInfo=data.data;
                }else{
                    toggleModal(data.message);
                }
            })
        }
    },
    mounted() {
        var params=getRequest();
        this.noticeId=params.noticeId;
        this.fetchData();
    }
})