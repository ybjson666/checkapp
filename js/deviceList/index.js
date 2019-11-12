var app=new Vue({
    el:"#app",
    data:{
        deviceList:[],
        deviceName:"",
        deviceId:"",
        loadingTxt:"加载更多",
        scroller:null,
        page:1,
        token:token||"",
        device_type:"1",
        tags:true,
        type_text:"我使用过的设备",
        types:"my"
    },
    methods: {
        seleDevice(item){
            this.deviceName=item.name;
            this.deviceId=item.de_id;
            this.deviceAddr=item.address
            sessionStorage.setItem('deviceName',item.name);
            sessionStorage.setItem('deviceId',item.de_id);
            sessionStorage.setItem('deviceAddr',item.address);
            window.history.go(-1);
        },
        seleTypes(){
            if(this.tags){
                this.type_text="所有设备";
                this.tags=false;
                this.types="all";
            }else{
                this.type_text="我使用过的设备";
                this.tags=true;
                this.types="my";
            }
            this.page=1;
            this.deviceList=[];
            this.getDeviceList();
        },
        goBack(){
            window.history.go(-1);
        },
        getDeviceList(){
            var _this=this;
            var postParams={};
            if(this.types=="all"){
                 postParams={
                    datas:{
                        app_version,
                        port,
                        type:2,
                        token:this.token,
                        page:this.page,
                        sort:2,
                        devicetype:this.device_type
                    },
                    url:"/device/DeviceList"
                }
                
            }else if(this.types=="my"){
                 postParams={
                    datas:{
                        app_version,
                        port,
                        type:2,
                        token:this.token,
                        page:this.page
                    },
                    url:"/device/UseDeviceList"
                }
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.deviceList=_this.deviceList.concat(data.data.list);
                    setTimeout(function(){
                     _this.scroller.refresh();
                     _this.page++;
                    },500)
                 }else if(data.code==401){
                     toggleModal(data.message);
                     setTimeout(function(){
                         wxLogin(_this.loginSuccess);
                     },2500);
                 }
                 else{
                     toggleModal(data.message);
                 }
            })
            
        },
        loginSuccess(data){
            this.logining=true;
            sessionStorage.setItem('open_id',data);
            this.logins(data);
        },
        logins(id){
            var _this=this;
            var url=location.href;
            var postParams={
                datas:{
                    app_version,
                    port,
                    login_type:'2',
                    openid:id
                },
                url:"/user/DoLogin"
            }
            requestFunc(postParams).then(function(data){
                if(data.code!==200){
                    window.location.href="register.html?openid="+id;
                }else{
                    _this.token=data.data.token_web;
                    _this.getDeviceList(_this.page);
                    sessionStorage.setItem('token',data.data.token_web);
                    sessionStorage.setItem('realname',data.data.realname);
                    sessionStorage.setItem('firm_name',data.data.firm_name);
                    _this.logining=false;
                }
            })
        },
        addDevices(){
            window.location.href="addDevice.html?token="+this.token;
        }
    },
    created() {
        if(token){
            this.getDeviceList();
        }else{
            wxLogin(this.loginSuccess);
        }
        
    },
    mounted() {
        var _this=this;
        setTimeout(function(){
            _this.$nextTick(function(){
                var wrapper=document.querySelector('.refresh-wrapper');
                var H=_this.$refs.device_block.clientHeight;
                var h=_this.$refs.device_list.clientHeight;
                if(h<H){
                    _this.loadingTxt="暂无更多数据";
                }else{
                    _this.loadingTxt="加载更多";
                }
                
                _this.scroller= new BScroll(wrapper,{
                    probeType: 3,
                    click:false,
                    tap:'click'
                });
                _this.scroller.on('scroll', function (position) {
                    // _this.scroller.refresh();
                });
                // 滑动结束
                _this.scroller.on('touchend', function (position) {
                    if (position.y > 30) {
                    }else if(position.y < (this.maxScrollY - 30)) {
                        _this.loadingTxt = '加载中...';
                        setTimeout(function () {
                            _this.loadingTxt = '加载更多';
                            _this.getDeviceList(_this.page);
                            _this.scroller.refresh();
                        }, 1000);
                    }
                });
            })
        },500)  
        
    }
})