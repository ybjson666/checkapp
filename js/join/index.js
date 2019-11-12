var app=new Vue({
    el:"#app",
    data:{
        company:{},
        firm_id:"",
        team_id:"",
        part_type:""
    },
    methods: {
        fetchData(){
            var _this=this;
            var postParams={
                datas:{
                    firm_id:this.firm_id,
                    app_version:app_version,
                    port:port
                },
                url:"/user/FindFirmInfo"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.company=data.data;
                }else{
                    toggleModal(data.message);
                }
            })
        },
        join(){
            window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbdd972e0ddf558bf&redirect_uri=https://pc.scsxhsk.com/api/vc&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        }
    },
    created() {
        var params=getRequest();
        this.firm_id=params.firm_id;
        this.team_id=params.team_id;
        this.part_type=params.part_type;
        sessionStorage.setItem('firm_id',params.firm_id);
        sessionStorage.setItem('team_id',params.team_id);
        sessionStorage.setItem('part_type',params.part_type);
        this.fetchData();
    }
})