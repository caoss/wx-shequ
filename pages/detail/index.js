const observer = require("../../libs/wechat-weapp-mobx/observer").observer;
// pages/home.js
Page(observer({
    props: {
        homeStore: require("../../store/index.js").homeStore,
    },
    data: {
        loadStatus: 'loading',
        scrollTop:0,
        id:'',
        isShare:false,
    },
    onShareAppMessage() {
        let title ='虾皮社区';
        const {
            homeStore
        } = this.props
        return {
            title:title,
            path:'/pages/detail/index?id='+homeStore.videoDetail.id
        }
    },
    /* 页面渲染完成钩子 */
    onLoad(data) {
        console.log(data);
        const {
            homeStore
        } = this.props
        let id = data.id;
        let share = data.share;
        let self = this;
        this.setData({
            isShare:share?true:false
        })
        setTimeout(function(){
            self.setData({
                isShare:false
            })
        },1500)
        this.setData({
            id:id
        })
        homeStore.getVideoDetail({id}).then(result=>{
            wx.hideLoading();
        });
        homeStore.getVideoRelative({id}).then(result=>{
            wx.hideLoading();
        });
    },
    /* 页面卸载钩子 */
    onUnload() {},
    _toDetail(e) {
        const {
            homeStore
        } = this.props
        let id = e.currentTarget.dataset.id;
        homeStore.getVideoDetail({id}).then(result=>{
            wx.hideLoading();
        });
        homeStore.getVideoRelative({id}).then(result=>{
            wx.hideLoading();
        });
        this.setData({
            scrollTop:0
        })
    },
    redirect_neets(){
        wx.navigateToMiniProgram({
            appId:'wxf3f963b724069c29',
            success(){
                console.log('打开成功')
            }
        })
    },
    onshow(){
        const {
            homeStore
        } = this.props
        homeStore.getVideoDetail({id:this.data.id}).then(result=>{
            wx.hideLoading();
        });
        homeStore.getVideoRelative({id:this.data.id}).then(result=>{
            wx.hideLoading();
        });
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
                            self.onshow();
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
                            self.onshow();
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
                            self.onshow();
                        })
                    }
                })
            }
        })
    },
    _tapPreview(e) {
        let {url} = e.currentTarget.dataset;
        wx.previewImage({
            urls: [ url ]
        })
    },
}))