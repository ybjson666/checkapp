var app=new Vue({
    el:"#app",
    data:{
        warns:""
    },
    created() {
        var params=getRequest();
        this.warns=decodeURI(params.warn);
    }
})