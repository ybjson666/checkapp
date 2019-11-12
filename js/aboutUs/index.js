var app=new Vue({
    el:"#app",
    methods: {
        knows(){
            WeixinJSBridge.call("closeWindow");
        }
    },
})