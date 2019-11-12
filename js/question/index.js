var app= new Vue({
    el:"#app",
    data:{
        questionList:[]
    },
    methods: {
        fetchData(){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port
                },
                url:"/msg/PuzzleList"
            }
            
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                   _this.questionList=data.data;
                }else{
                    toggleModal(data.message);
                }
            })
        },
        seekInfo(id){
            window.location.href="questionInfo.html?puzzleId="+id
        }
    },
    mounted() {
        this.fetchData();
    }
})