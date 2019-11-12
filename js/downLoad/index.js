var app=new Vue({
    el:"#app",
    data:{
        isShow:false
    },
    methods: {
        shareAndroid(){
            if(this.isWeiXin()){
                this.isShow=true;
            }else{
                alert('去下载app');
            }
        },
        close(){
            this.isShow=false;
        },
        isWeiXin(){
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                return true;
            }else{
                return false;
            }
        },
        shareIos(){
            alert("去appstore下载app");
        }
    }
   
})