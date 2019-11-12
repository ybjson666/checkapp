var app=new Vue({
    el:"#app",
    data:{
        taskTypes:[
            {
                type:"0",
                name:"点检正常"
            },
            {
                type:"1",
                name:"点检异常"
            }
        ],
        checkList:[],
        status:"0",
        curIndex:0,
        page:1,
        loadingTxt:"加载更多",
        scroller:null,
        token:token||""
    },
    methods: {
        goBack(){
            window.history.go(-1);
        },
        seleType(index,type){
            this.status=type;
            this.curIndex=index;
            this.checkList=[];
            this.page=1;
            this.fetchData(this.token);
        },
        fetchData(token){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    token:token,
                    type,
                    page:this.page,
                    status:this.status
                },
                url:"/timeRepair/TimeRepairTaskList"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.checkList=_this.checkList.concat(data.data);
                    _this.page++;
                    setTimeout(function(){
                        _this.scroller.refresh();
                    },500);
                    
                }else if(data.code==401){
                    toggleModal(data.message);
                    setTimeout(function(){
                        wxLogin(_this.loginSuccess);
                    },2500);
                }else{
                    toggleModal(data.message);
                }
            })
        },
        loginSuccess(data){
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
                    sessionStorage.setItem('token',data.data.token_web);
                    sessionStorage.setItem('realname',data.data.realname);
                    sessionStorage.setItem('firm_name',data.data.firm_name);
                    _this.fetchData(_this.token);
                }
            })
        },
        seekInfo(item){
            if(item.status=='0'){
                window.location.href="normalInfo.html?rt_id="+item.rt_id;
            }else{
                window.location.href="errorInfo.html?rt_id="+item.rt_id;
            }  
        }
    },
    created() {
        if(!token){
            wxLogin(this.loginSuccess);
        }else{
            this.fetchData(this.token);
        }
        
    },
    mounted() {
        var _this=this;
        setTimeout(function(){
            _this.$nextTick(function(){
                var wrapper=document.querySelector('.refresh-wrapper');
                var alerts = document.querySelector('.alert-hook');
                var topTip = document.querySelector('.refresh-hook');
                var tags=false;

                var H=_this.$refs.list_wraper.clientHeight;
                var h=_this.$refs.list.clientHeight;
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
                    if(position.y > 30) {
                        topTip.innerText = '释放立即刷新';
                    }
                });
                // 滑动结束
                _this.scroller.on('touchend', function (position) {
                    if (position.y > 30) {
                        tags=true;
                        setTimeout(function () {
                            topTip.innerText = '下拉刷新';
                            if(tags){
                                refreshAlert('刷新成功');
                            }
                            scroll.refresh();
                        }, 1000);
                    }else if(position.y < (this.maxScrollY - 30)) {
                        _this.loadingTxt = '加载中...';
                        setTimeout(function () {
                            _this.loadingTxt = '加载更多';
                            _this.fetchData();
                            _this.scroller.refresh();
                        }, 1000);
                    }

                    function refreshAlert(text) {
                        text = text || '操作成功';
                        alerts.innerHtml = text;
                        alerts.style.display = 'block';
                        setTimeout(function(){
                            alerts.style.display = 'none';
                            _this.taskList=[];
                            _this.page=1;
                            _this.fetchData();
                        },1000);
                    }

                });
            
            })
        },500)
        
    },
})