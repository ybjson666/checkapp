var app=new Vue({
    el:"#app",
    data:{
        news:{},
        newsId:""
    },
    methods: {
        fetchData(){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    news_id:this.newsId
                },
                url:"/news/newsInfo"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.news=data.data;
                }else{
                    toggleModal(data.message);
                }
            })
        }
    },
    created() {
        var params=getRequest();
        this.newsId=params.news_id;
        this.fetchData()
    },
})