/**
 * @author YM
 */
const ApiConst = {
    CMTY_LIST: 'jokes/feed', // 列表
    VIDEOS_DETAIL: 'jokes/${id}', // 详情
    VIDEOS_RELATIVE: 'jokes/${id}/related-list',//相关

    LOGIN_STEP1: 'uc-wechat-callback/miniapp',//相关
    LOGIN_STEP2: 'uc-wechat-callback/mini-userinfo',//相关
    
    LIKE: 'jokes/${id}/like',//点赞相关
    CANCEL_LIKE: 'jokes/${id}/cancel-like',//取消点赞

    DIS_LIKE:'jokes/${id}/dislike',//不喜欢
    CANCEL_DIS_LIKE:'jokes/${id}/cancel-dislike',//不喜欢

    SHARE:'jokes/{id}/share',//分享

    COLLECT: 'jokes/${id}/collect',//收藏
    CANCEL_COLLECT: 'jokes/${id}/cancel-collect',//取消收藏
    COLLECT_DATA: 'jokes/collect-list',//收藏列表
}

export default ApiConst