// components/component-tag-name.js
const App = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        data: {
            type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: {
            }// 属性初始值（可选），如果未指定则会根据类型选择一个
        },
    },
    /**
     * 组件的初始数据
     */
    data: {
        isOpen:false,
        imgUrls: [
            '../img/pro1.png',//壁纸
            '../img/pro2.png',//GIF
            '../img/pro3.png',//头像
            '../img/pro4.png',//符
            // '../img/pro5.png',//韩剧
            // '../img/pro6.png',//虾皮
        ],
        indicatorDots: false,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        circular:true
    },
    /**
     * 组件的方法列表
     */
    methods: {
        _open(){
            this.setData({
                isOpen:true
            })
        },
        _redirect(e){
            console.log('3333',e);
            let current = e.currentTarget.dataset.index;
            wx.navigateToMiniProgram({
                appId:App.globalData.appIds[current],
                success(){
                    console.log('打开成功')
                }
            })
        },
    }
})