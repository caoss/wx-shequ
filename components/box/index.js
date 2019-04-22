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
            '../img/pro11.png',//壁纸
            '../img/pro22.png',//GIF
            '../img/pro33.png',//头像
            '../img/pro44.png',//符
            // '../img/pro55.png',//韩剧
            // '../img/pro66.png',//虾皮
        ],
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
        _close(){
            this.setData({
                isOpen:false
            })
        },
        _redirect(e){
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