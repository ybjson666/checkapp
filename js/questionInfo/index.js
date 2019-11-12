var app=new Vue({
    el:"#app",
    data:{
        puzzleId:"",
        question:{}
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
                    puzzle_id:this.puzzleId
                },
                url:"/msg/PuzzleInfo"
            }
            
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                   _this.question=data.data;
                }else{
                    toggleModal(data.message);
                }
            })
        }
    },
    mounted() {
        var params=getRequest();
        this.puzzleId=params.puzzleId;
        this.fetchData();
    }
})