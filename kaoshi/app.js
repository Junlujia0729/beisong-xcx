// 创建应用程序对象
function MySleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
App({
  // ========== 全局数据对象（整个应用程序共享） ==========
  globalData: {
    // mainDomain:"https://api.52jiaoshi.com/",
    // mainQueryDomain: "https://api.52jiaoshi.com/",
    mainDomain:"https://api.bornedu.com/",
    mainQueryDomain: "https://api.bornedu.com/",
    // mainDomain: "https://ceshi.bornedu.com/",
    // mainQueryDomain: "https://ceshi.bornedu.com/",
    //用户信息
    userToken: "",
    openId:"",
    unionId:"",
    mobile:"",
    nickname:"",
    avatar:'',
    userInfo:{},
    //用户扩展信息
    subject:0,
    level:0,
    //app信息
    appid: "125",
    appversion:"1.1.0",
    scene:0,
    dbyStore: {},
    systemInfo: {},
    //渠道统计
    channel:'',
    activityUrl: '',
    activityTitle: ''
  },
  // ========== 应用程序全局方法 ==========
  // fetchApi (url, callback) {
  //   // return callback(null, top250)
  //   wx.request({
  //     url,
  //     data: {},
  //     header: { 'Content-Type': 'application/json' },
  //     success (res) {
  //       callback(null, res.data)
  //     },
  //     fail (e) {
  //       console.error(e)
  //       callback(e)
  //     }
  //   })
  // },

  // ========== 生命周期方法 ==========

  onLaunch (options) {
    // 应用程序启动时触发一次
    // console.log('App Launch')
    let that = this;
    that.globalData.scene = options.scene;

    wx.getSystemInfo({
      success: function (res) {
        that.globalData.systemInfo = res;
      }
    });

    //只登录一次？
    wx.login({  //调用微信登录
      success(res_wxlogin) {
        console.log(res_wxlogin);
        that.globalData.login_session_code = res_wxlogin.code;
        //login_session_code
        var loginObj = { code: res_wxlogin.code, os: that.globalData.systemInfo.platform, appid: that.globalData.appid, scene: that.globalData.scene}
        wx.request({
          url: that.globalData.mainDomain + "LxzgzXcxApi/matrix_login",
          data: loginObj,
          method: "POST",
          header: { 'content-type': 'application/x-www-form-urlencoded', 'Version': that.globalData.appversion },
          dataType: 'json',
          success: function (res) {
            console.log("send matrix_login success");
            
            var wxlogincode = res_wxlogin.code;
            if (res.data.code == 200) {
              that.globalData.userToken = res.data.data.user.token;
              that.globalData.mobile = res.data.data.user.mobile;
              that.globalData.nickname = res.data.data.user.nickname;
              that.globalData.avatar = res.data.data.user.avatar;
              //扩展用户信息
              if (res.data.data.ext && res.data.data.ext.level){
                that.globalData.level = res.data.data.ext.level;
                that.globalData.subject = res.data.data.ext.subject;
              }
            } else {
              wx.showModal({
                title: '登录失败',
                content: res.data.msg,
              })
            }
          },
          fail: function (fres) {
            console.log(fres);
            wx.showModal({
              title: '登录失败',
              content: '请确认网络正常后重新打开',
            })
          }
        })
      },
      fail() {
        wx.showModal({
          title: '登录失败了',
          content: '请确认网络正常后重新打开',
        })
      }
    })
  },

  onShow (options) {

  },

  onHide () {
    // 当应用程序进入后台状态时触发
  }
})
