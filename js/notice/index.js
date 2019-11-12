var app=new Vue({
    el:"#app",
    data:{
        noticeList:[],
        loadingTxt:"加载更多",
        scroller:null,
        page:1,
        token:""
    },
    methods: {
        lookInfo(id){
            window.location.href="noticeInfo.html?noticeId="+id;
        },
        fetchData(page){
            var _this=this;
            var postParams={
                datas:{
                    app_version,
                    port,
                    type:1,
                    token:this.token,
                    page
                },
                url:"/msg/BulletinList"
            }
            
            requestFunc(postParams).then(function(data){
                if(data.code==200){
                   _this.noticeList=_this.noticeList.concat(data.data.data);
                   setTimeout(function(){
                    _this.scroller.refresh();
                    _this.page++;
                   },500)
                }else{
                    toggleModal(data.message);
                }
            })
        }
    },
    mounted() {
        var params=getRequest();
        this.token=params.token;
        var _this=this;
        var wrapper=document.querySelector('.refresh-wrapper');
        new Promise(function(resolve,reject){
            resolve( _this.fetchData(_this.page));
        }).then(function(){
            setTimeout(function(){
                var H=_this.$refs.notice_block.clientHeight;
                var h=_this.$refs.notice_list.clientHeight;
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
                            _this.fetchData(_this.page);
                            _this.scroller.refresh();
                        }, 1000);
                    }
                });
            },500)
                
        })
    }
})