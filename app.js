//app.js
const observer = require('./libs/wechat-weapp-mobx/observer').observer
const http = require('./utils/http.js')

App(
    observer({
        props: {
            homeStore: require('./store/index.js').homeStore
        },
        onLaunch: function() {
            const {
                homeStore
            } = this.props
            const self = this
            wx.getStorage({
                key: 'userInfo',
                success(res) {
                    http.setHeader({'Authorization':'userId=' + res.data.aliasId});
                },
            })
            const sysInfo = wx.getSystemInfo({
                success(res) {
                    let statusBarHeight = res.statusBarHeight
                    let totalTopHeight = 68
                    if (res.model.indexOf('iPhone X') !== -1) {
                        totalTopHeight = 88
                    } else if (res.model.indexOf('iPhone') !== -1) {
                        totalTopHeight = 64
                    }
                    let navgationHeight = totalTopHeight - statusBarHeight
                    self.globalData = Object.assign({}, self.globalData, {
                        statusBarHeight,
                        navgationHeight,
                        ...res
                    })
                },
                fail(err) {
                    console.log('err-----------------------', err)
                    self.globalData = Object.assign({}, self.globalData, {
                        statusBarHeight: 0,
                        navgationHeight: 0
                    })
                }
            })
        },
        userData: {
            loading: true
        },
        globalData: {
            appIds:[
                "wxf3f963b724069c29",//壁纸
                "wx5862aca4afa95ef4",//GIF
                "wx835231fcea421e75",//新年头像
                "wx77cf03d4e4fdfa13",//符
                "wxeb643ff612c21033",//韩剧
            ],
            shareTits:[
                '每次不知道吃啥，我就去看看奥妙',
                '男生如何变得成熟',
                '如何用一句话证明你很穷',
                '哇，，，这就是爱情',
                '一句话翻转剧情',
                '这就是2019年现状',
                '这就是我的极限运动了',
                '这就是我为啥不买这种茶的原因',
                '这些图告诉你原来这么东西这么大'
            ],
            shareImgs:[
                '../../images/shareImgs/1.jpg',
                '../../images/shareImgs/2.jpg',
                '../../images/shareImgs/3.jpg',
                '../../images/shareImgs/4.jpg',
                '../../images/shareImgs/5.jpg',
                '../../images/shareImgs/6.jpg',
                '../../images/shareImgs/7.jpg',
                '../../images/shareImgs/8.jpg',
                '../../images/shareImgs/9.jpg',
            ]
        }
    })
)