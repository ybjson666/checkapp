var app=new Vue({
    el:"#app",
    data:{
        company:{}
    },
    methods: {
        fetChData(){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port
                },
                url:"/msg/TerraceInfo"
            }
            
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                   _this.company=data.data;
                }else{
                    toggleModal(data.message);
                }
            })
        }
    },
    mounted() {
        this.fetChData();
    }
})