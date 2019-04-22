const mobx = require('../libs/wechat-weapp-mobx/mobx')
const extendObservable = mobx.extendObservable
const http = require('../utils/http.js')
const EvnConst = require('../configs/EvnConst.js')
const ApiConst = require('../configs/ApiConst.js')
const mData = require('../common/data.js')

const DOMAIN = EvnConst.default.apiHost
const UCHOST = EvnConst.default.ucHost

const homeStore = function() {
    extendObservable(this, {
        tabs:[],
        cmtyListDatas:{
            list: [],
            total: 0,
            more: true,
            pageNo: 1,
            orderBy:'',
            sortType:''
        },
        collectListDatas:{
            list: [],
            total: 0,
            more: true,
            pageNo: 1,
        },
        videoRelative:[],
        videoDetail:{},
        getCmtyList(params = {}) {
            // wx.showLoading({
            //     title: '',
            //     mask: true
            // });
            let {
                pageNo=this.cmtyListDatas.pageNo, pageSize=10
            } = params

            let orderBy='',sortType='';
            if(pageNo>1){
                orderBy = this.cmtyListDatas.orderBy;
                sortType = this.cmtyListDatas.sortType;
            }

            let timestamp = Date.parse(new Date())
            return new Promise((r, j) => {
                http.get(DOMAIN + ApiConst.default.CMTY_LIST,{pageNo,pageSize,timestamp,orderBy,sortType}).then(result => {
                    console.log('列表数据--------',result);
                    if (pageNo === 1) {
                        this.cmtyListDatas = {
                            list:result.list,
                            total: result.total,
                            more: result.more,
                            pageNo: pageNo + 1,
                            orderBy:result.orderBy,
                            sortType:result.sortType
                        }
                    }else{
                        this.cmtyListDatas.list =  this.cmtyListDatas.list.concat(result.list);
                        this.cmtyListDatas.total = result.total;
                        this.cmtyListDatas.more = result.more;
                        this.cmtyListDatas.pageNo = pageNo + 1;
                        this.cmtyListDatas.orderBy = result.orderBy;
                        this.cmtyListDatas.sortType = result.sortType;
                    }
                    r(result);
                });
            })
           
        },
        
        getVideoDetail(params = {}) {
            let {
                id 
            } = params
            wx.showLoading({
                title: '',
                mask: true
            });
            return new Promise((r, j) => {
                http.get(DOMAIN + ApiConst.default.VIDEOS_DETAIL,{ id:id } ).then(result => {
                    console.log(result);
                    this.videoDetail = result;
                    r(result);
                });
            })
        },
        getVideoRelative(params = {}) {
            let {
                id 
            } = params
            wx.showLoading({
                title: '',
                mask: true
            });
            return new Promise((r, j) => {
                http.get(DOMAIN + ApiConst.default.VIDEOS_RELATIVE,{ id:id } ).then(result => {
                    this.videoRelative = result;
                    r(result);
                });
            })
        },
        getCollectData(params = {}) {
            let { pageNo= this.collectListDatas.pageNo , pageSize=10 } =  params;
            wx.showLoading({
                title: '',
                mask: true
            });
            return new Promise((r, j) => {
                http.get(DOMAIN + ApiConst.default.COLLECT_DATA,{pageNo,pageSize}).then(result => {
                    console.log(result);
                    if (pageNo === 1) {
                        this.collectListDatas = {
                            list:result.list,
                            total: result.total,
                            more: result.more,
                            pageNo: pageNo + 1,
                            orderBy:result.orderBy,
                            sortType:result.sortType
                        }
                    }else{
                        this.collectListDatas.list =  this.collectListDatas.list.concat(result.list);
                        this.collectListDatas.total = result.total;
                        this.collectListDatas.more = result.more;
                        this.collectListDatas.pageNo = pageNo + 1;
                    }

                    wx.hideLoading();
                    r(result);
                });
            })
        },
        loginStep( params = {} ){

            return new Promise((r, j) => {
                wx.login({
                    success(res) {
                        http.post(UCHOST + ApiConst.default.LOGIN_STEP1,{ "code":res.code,miniType:'2' } ).then(result => {
                            let { thirdSessionKey } = result;
                            let { rawData,signature,encryptedData,iv } = params;
                            http.post(UCHOST + ApiConst.default.LOGIN_STEP2,{ rawData,signature,encryptedData,iv,thirdSessionKey,miniType:'2' } ).then(response => {
                                http.setHeader({'Authorization':'userId=' + response.aliasId });
                                wx.setStorage({
                                    key: 'userInfo',
                                    data: response
                                })
                                r(response);
                            });
                        });
                    }
                })
            })

        },
        like( params = {}  ){
            let {
                id , liked
            } = params
            wx.showLoading({
                title: '',
                mask: true
            });
            return new Promise((r, j) => {
                let url = '';
                if(liked){
                    url = DOMAIN + ApiConst.default.CANCEL_LIKE
                }else{
                    url = DOMAIN + ApiConst.default.LIKE
                }
                http.post(url,{ id } ).then(result => {
                    console.log(result);
                    this.cmtyListDatas.list.forEach(element => {
                        if(element.id == id){
                            if(liked){
                                element.likeCount = element.likeCount-1;
                            }else{
                                element.likeCount = element.likeCount-0+1;
                            }
                            element.liked = !element.liked;
                        }
                    });
                    if( id ==  this.videoDetail.id ){
                        if(liked){
                            this.videoDetail.likeCount = this.videoDetail.likeCount-1;
                        }else{
                            this.videoDetail.likeCount = this.videoDetail.likeCount-0+1;
                        }
                        this.videoDetail.liked = !this.videoDetail.liked;
                    }
                    wx.hideLoading();
                    r(!liked);
                });
            })
        },
        dislike( params = {}  ){
            let {
                id , disliked
            } = params
            wx.showLoading({
                title: '',
                mask: true
            });

            console.log('disliked----',disliked);
            return new Promise((r, j) => {
                let url = '';
                if(disliked){
                    url = DOMAIN + ApiConst.default.CANCEL_DIS_LIKE
                }else{
                    url = DOMAIN + ApiConst.default.DIS_LIKE
                }
                http.post(url,{ id } ).then(result => {
                    console.log(result);
                    this.cmtyListDatas.list.forEach(element => {
                        if(element.id == id){
                            if(disliked){
                                element.dislikeCount = element.dislikeCount-1;
                            }else{
                                element.dislikeCount = element.dislikeCount-0+1;
                            }
                            element.disliked = !element.disliked;
                        }
                    });
                    if( id ==  this.videoDetail.id ){
                        if(disliked){
                            this.videoDetail.dislikeCount = this.videoDetail.dislikeCount-1;
                        }else{
                            this.videoDetail.dislikeCount = this.videoDetail.dislikeCount-0+1;
                        }
                        this.videoDetail.disliked = !this.videoDetail.disliked;
                    }
                    wx.hideLoading();
                    r(!disliked);
                });
            })
        },
        collect(params = {}){
            let {
                id , collected
            } = params
            wx.showLoading({
                title: '',
                mask: true
            });
            return new Promise((r, j) => {
                let url = '';
                if(collected){
                    url = DOMAIN + ApiConst.default.CANCEL_COLLECT
                }else{
                    url = DOMAIN + ApiConst.default.COLLECT
                }
                http.post(url,{ id:id } ).then(result => {

                    this.cmtyListDatas.list.forEach(element => {
                        if(element.id == id){
                            if(collected){
                                element.collectCount = element.collectCount-1;
                            }else{
                                element.collectCount = element.collectCount-0+1;
                            }
                            element.collected = !element.collected;
                        }
                    });
                    if( id ==  this.videoDetail.id ){
                        if(collected){
                            this.videoDetail.collectCount = this.videoDetail.collectCount-1;
                        }else{
                            this.videoDetail.collectCount = this.videoDetail.collectCount-0+1;
                        }
                        this.videoDetail.collected = !this.videoDetail.collected;
                    }
                    wx.hideLoading();
                    r(!collected);
                });
            })
        }
        
    })
}

module.exports = homeStore