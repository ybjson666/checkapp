var app=new Vue({
    el:"#app",
    data:{
        device:{},
        rt_id:"1"
    },
    methods: {
        fetchData(){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    token,
                    type,
                    rt_id:this.rt_id,
                },
                url:"/timeRepair/RepairDevice"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.device=data.data.device;
                }else{
                    toggleModal(data.message);
                }
            })
        }
    },
    mounted() {
        var params=getRequest();
        this.rt_id=params.rt_id;
        this.fetchData();
    },
})