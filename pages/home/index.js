//index.js
//获取应用实例
var app = getApp();
const observer = require("../../libs/wechat-weapp-mobx/observer").observer;
const idParse = ['A','B','C','D','E'];
Page(observer({
    props: {
        homeStore: require("../../store/index.js").homeStore,
    },
    data: {
        loadStatus:'loading',
        index:0,
        isLogin:false,
        canRun:true,
    },

    onLoad: function () {
        const {
            homeStore
        } = this.props
        let that = this;
        homeStore.getCmtyList();
        wx.getStorage({
            key: 'userInfo',
            success(res) {
                that.setData({
                    isLogin:true,
                })
            }
        })
    },
 
    onshow(){
        let self = this;
        wx.getStorage({
            key: 'userInfo',
            success(res) {
                if(self.data.isLogin){
                    return;
                }else{
                    const {
                        homeStore
                    } = self.props
                    self.setData({
                        isLogin:true,
                    })
                    homeStore.getCmtyList({ pageNo:1 });
                }
            }
        })
    },
    _toDetail(e){
        const id =  e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../detail/index?id=' + id
        })
    },
    _toDetailShare(e){
        const id =  e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../detail/index?id=' + id +'&share='+1
        })
    },
    _like(e){
        let {liked,id} = e.currentTarget.dataset;
        console.log('eeee',id);
        const {
            homeStore
        } = this.props
        let self = this;
        wx.getStorage({
            key: 'userInfo',
            success(res) {
                console.log('已登录');
                homeStore.like({id,liked });
            },
            fail(){
                //未登录的时候，-登录->
                wx.getUserInfo({
                    success(res){
                        homeStore.loginStep(res).then(result=>{
                            // self.onshow();
                        })
                    }
                })
            }
        })
    },
    _dislike(e){
        let {disliked,id} = e.currentTarget.dataset;
        console.log('eeee',id);
        const {
            homeStore
        } = this.props
        let self = this;
        wx.getStorage({
            key: 'userInfo',
            success(res) {
                console.log('已登录');
                homeStore.dislike({id,disliked });
            },
            fail(){
                //未登录的时候，-登录->
                wx.getUserInfo({
                    success(res){
                        homeStore.loginStep(res).then(result=>{
                            // self.onshow();
                        })
                    }
                })
            }
        })
    },
    _collect(e){
        let {collected,id} = e.currentTarget.dataset;
        console.log('eeee',id);
        const {
            homeStore
        } = this.props
        let self = this;
        wx.getStorage({
            key: 'userInfo',
            success(res) {
                console.log('已登录');
                homeStore.collect({id,collected });
            },
            fail(){
                //未登录的时候，-登录->
                wx.getUserInfo({
                    success(res){
                        homeStore.loginStep(res).then(result=>{
                            // self.onshow();
                        })
                    }
                })
            }
        })
    },
    onShareAppMessage() {
        let n =0;
        let m =8;
        let a =  Math.floor(Math.random() * (m - n)) + n;
        console.log(a);
        let title =app.globalData.shareTits[a];
        let image = app.globalData.shareImgs[a];
        return {
            title:title,
            imageUrl: image,
            path:'/pages/home/index'
        }
    },
    onPullDownRefresh: function () {
        console.log("下拉");
        const {
           homeStore
        } = this.props
        homeStore.getCmtyList({ pageNo:1 }).then(result=>{
            wx.stopPullDownRefresh();
        })
    },

    _tapPreview(e) {
        // let {url} = e.currentTarget.dataset;
        // wx.previewImage({
        //     urls: [ url ]
        // })
    },

    onReachBottom: function () {
        wx.showLoading({
            title: '',
            mask: true
        });
        const {
            homeStore
        } = this.props
        if(!this.data.canRun){
            // 判断是否已空闲，如果在执行中，则直接return
            return;
        }
        let _this = this;
        this.data.canRun = false;
        homeStore.getCmtyList().then(result=>{
            if(!result.more){
                this.setData({
                    loadStatus:'noMore'//根据TABID-来判断
                })
            }else{
                this.setData({
                    loadStatus:'loading'//根据TABID-来判断
                })
            }
        });
        setTimeout(function(){
            _this.data.canRun = true;
            wx.hideLoading();
        }, 1000);
    }
}))

     
