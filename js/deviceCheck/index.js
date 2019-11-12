var app=new Vue({
    el:"#app",
    data:{
        scroller:null,
        device:{},
        taskList:[],
        loadingTxt:"加载更多",
        isStop:false,
        isSkip:false,
        appId:"",
        nonceStr:"",
        signature:"",
        timestamp:"",
        rt_id:"1"
    },
    methods: {
        stopWorking(){
            this.isStop=true;
        },
        cancleStop(){
            this.isStop=false;
        },
        skipDevice(){
            this.isSkip=true;
        },
        cancleSkip(){
            this.isSkip=false;
        },
        takePhoto(){
            var _this=this;
            _this.getConfig();
            wx.ready(function(){
                wx.chooseImage({
                    count:1, // 默认9
                    sizeType: ['original','compressed'], 
                    sourceType:['camera','album'], 
                    success: function (res) {
                    var localIds = res.localIds;
            
                    }
                });
            })
        },
        getParams(){
            var _this=this;
            var curUrl=window.location.href.split('#')[0];
            var postParams={
                datas:{
                    app_version,
                    port,
                    url:curUrl
                },
                url:"/wx/JsWxInfo"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                  _this.appId=data.data.appId;
                  _this.nonceStr=data.data.nonceStr;
                  _this.signature=data.data.signature;
                  _this.timestamp=data.data.timestamp;
                }else{
                    toggleModal(data.message);
                }
            })
        },
        getConfig(){
            var _this=this;
            wx.config({
                debug: true,
                appId: _this.appId,
                timestamp: _this.timestamp,
                nonceStr: _this.nonceStr,
                signature: _this.signature,
                jsApiList: [
                    'uploadVoice',
                    'chooseImage',
                    'uploadImage',
                    'downloadImage',
                    'startRecord',
                    'stopRecord',
                    'onVoiceRecordEnd',
                    'playVoice',
                    'pauseVoice',
                    'stopVoice',
                    'onVoicePlayEnd'
                ]
            });
        },
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
                    _this.taskList=data.data.back;
                }else{
                    toggleModal(data.message);
                }
            })
        }
    },
    mounted() {
         // var params=getRequest();
        // this.rt_id=params.rt_id;
        this.fetchData();
        this.getParams();
        var wrapper=document.querySelector('.refresh-wrapper');
        var that=this;
        setTimeout(function(){
            var H=that.$refs.contents.clientHeight;
            var h=that.$refs.list.clientHeight;
            if(h<H){
                that.loadingTxt="暂无更多数据";
            }else{
                that.loadingTxt="加载更多";
            }

            that.scroller= new BScroll(wrapper,{
                probeType: 3,
                click:false,
                tap:'click'
            });
            // 滑动结束
            that.scroller.on('touchend', function (position) {
                if (position.y > 30) {
                    // that.scroller.refresh();
                }else if(position.y < (this.maxScrollY - 30)) {
                    that.loadingTxt = '加载中...';
                    setTimeout(function () {
                        that.loadingTxt = '加载更多';
                        that.scroller.refresh();
                    }, 1000);
                }
            });
        },500)
        
    }   
})