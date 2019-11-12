var app=new Vue({
    el:"#app",
    data:{
        reminder_text:"",
        rep_id:"",
        isUse:false
    },
    methods: {
        goBack(){
            window.history.go(-1);
        },
        goReminder(){
            var _this=this;
            if(!this.reminder_text){
                toggleModal("请输入催单内容");
                return;
            }
            var postParams={
                datas:{
                    app_version,
                    port,
                    token,
                    id:this.rep_id,
                    type,
                    content:this.reminder_text
                },
                url:"/repair/Reminder"
            }
            this.isUse=true;
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    toggleModal(data.message);
                    _this.isUse=false;
                    setTimeout(function(){
                        window.location.href="remindInfo.html?rep_id="+_this.rep_id;
                    },2000)
                }else{
                    toggleModal(data.message);
                    _this.isUse=false;
                }
            })
            
        }
    },
    mounted() {
        var params=getRequest();
        this.rep_id=params.rep_id;
    }
})