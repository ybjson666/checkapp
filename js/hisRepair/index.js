var app=new Vue({
    el:"#app",
    data:{
        scroller:null,
        btnGroups:[
            {
                name:"未完成",
                type:"1"
            },
            {
                name:"已完成",
                type:"3"
            },
            {
                name:"已撤销",
                type:"4"
            },
            {
                name:"待确认",
                type:"5" 
            }
        ],
        curIndex:0,
        status:"1",
        page:1,
        recordList:[],
        order_text:"升序",
        order_type:"2",
        loadingTxt:"加载更多",
        totalCount:0,
        logining:false,
        isLogin:false,
        token:token||"",
        isConfirm:false,
        repair_id:""
    },
    methods: {
        seleType(index,type){
            this.curIndex=index;
            this.status=type;
            this.page=1;
            this.recordList=[];
            this.fetchData(this.status,this.page,this.order_type,this.token);
        },
        changeOrder(){
            var orders=this.$refs.orders;
            if(this.order_type==='2'){
                this.order_text="降序";
                orders.style.transform="rotate(180deg)";
                this.order_type="1";
                this.page=1;
                this.recordList=[];
                this.fetchData(this.status,this.page,this.order_type,this.token);
            }else if(this.order_type==='1'){
                this.order_text="升序";
                orders.style.transform="rotate(0deg)";
                this.order_type="2";
                this.page=1;
                this.recordList=[];
                this.fetchData(this.status,this.page,this.order_type,this.token);
            }
        },
        fetchData(status,page,sort,token){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    type,
                    status,
                    page,
                    sort,
                    token:token,
                },
                url:"/repair/RepairList"
            }
            
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    if(data.data){
                        _this.totalCount=data.data.count;
                        _this.recordList=_this.recordList.concat(data.data.list);
                        setTimeout(function(){
                            _this.scroller.refresh();
                            _this.page++;
                        },500);
                    }
                   
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
        seekInfo(id){
            window.location.href='myRepair.html?rep_id='+id;
        },
        loginSuccess(data){
            this.logining=true;
            sessionStorage.setItem('open_id',data);
            this.logins(data);
        },
        logins(id){
            var _this=this;
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
                    _this.fetchData(_this.status,_this.page,_this.order_type,_this.token);
                    sessionStorage.setItem('token',data.data.token_web);
                    sessionStorage.setItem('realname',data.data.realname);
                    sessionStorage.setItem('firm_name',data.data.firm_name);
                    _this.logining=false;

                }
            })
        },
        confirmFunc(id){
            this.repair_id=id;
            this.isConfirm=true;
        },
        sureFunc(){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    type,
                    token:this.token,
                    types:'1',
                    re_id:this.repair_id
                },
                url:"/repair/Finish"
            }
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                    _this.isConfirm=false;
                    toggleModal("确认成功");
                    window.location.reload();
                    // this.page=1;
                    // this.recordList=[];
                    // this.fetchData(this.status,this.page,this.order_type,this.token);
                }else{
                    _this.isConfirm=false;
                    toggleModal(data.message);
                }
            })
        },
        cancelFunc(){
            this.isConfirm=false;
            this.repair_id="";
        }

    },
    created() {
        if(token){
            this.fetchData(this.status,this.page,this.order_type,this.token);
        }else{
            wxLogin(this.loginSuccess);
        }
    },
    mounted() {
        var _this=this;
        setTimeout(function(){
            _this.$nextTick(function(){
                var wrapper=document.querySelector('.refresh-wrapper');
                var h=_this.$refs.list.clientHeight;
                var H=_this.$refs.listWraper.clientHeight;
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
                // 滑动结束
                _this.scroller.on('touchend', function (position) {
                    if (position.y > 30) {
                        // that.scroller.refresh();
                    }else if(position.y < (this.maxScrollY - 30)) {
                        _this.loadingTxt = '加载中...';
                        setTimeout(function () {
                            _this.loadingTxt = '加载更多';
                            _this.fetchData(_this.status,_this.page,_this.order_type)
                            _this.scroller.refresh();
                        }, 1000);
                    }
                });
            }); 
        },500)
    }
})