const app = getApp()
const userApi = require('../../libraries/user.js')

Page({
  data: {
    boards: [
      { route: 'favdetailsnew/favdetailsnew', id: '', name: '我的收藏', icon: 'http://imgs.52jiaoshi.com/1513740919.png' },
      { route: 'bind/bind', id: '', name: '绑定账号', icon:'http://imgs.52jiaoshi.com/1513740919.png' },
      { route: 'discount/discount', id: '', name: '我爱教师APP下载', icon: 'http://imgs.52jiaoshi.com/1513740817.png' },

    ],
    nickname:'',
    headimgurl:'',
    height: '100%',
    imgurl: '',
    step:0,
    timestart: '',
    timeend: '',
    appload:''
  },
  onLoad(params) {
    var that=this;
    that.setData({
      nickname: app.globalData.nickname,
      headimgurl: app.globalData.avatar,
      mobile: app.globalData.mobile
    });
    var _imgurl = 'https://api.52jiaoshi.com/Public/images/app_new.png';
    that.imageDown(_imgurl);
  },
  selectcolumn: function (e) {
    wx.navigateTo({
      url: '../columndetail/columndetail?id=' + e.currentTarget.dataset.id,
    })
  },
  getinfo:function(e){
    const that =this;
    //微信登录
    wx.login({
      success: function (res) {
        console.log('success');
        app.globalData.login_session_code = res.code;
        const wxlogincode = res.code;
        if (res.code) {
          //获取个人信息
          wx.getUserInfo({
            success: function (res1) {
              console.log('getUserInfo');
              console.log(res1);
              var nickName = res1.userInfo.nickName;
              var headimgurl = res1.userInfo.avatarUrl;
              app.globalData.nickname = nickName;
              app.globalData.avatar = headimgurl;
              that.setData({
                nickname: nickName,
                headimgurl: headimgurl
              });
              userApi.requestAppApi_POST(app.globalData.mainDomain + "ApiNlpgbg/xcx_setuinfo",
                {
                  miniprog: 1,
                  encryptedData: res1.encryptedData,
                  iv: res1.iv,
                  code: wxlogincode,
                  nickname: res1.userInfo.nickName,
                  headimgurl: res1.userInfo.avatarUrl
                }, 
                function (resSetInfo) {
                  //主要是重新获取用户的unionid了
                  if (resSetInfo.data.code == 200) {
                    app.globalData.unionId = resSetInfo.data.data.unionid;
                  }  
                });
            }, fail: function () {
              //获取失败，调起客户端小程序设置界面
              wx.openSetting({
                success: function (suc_data) {
                  if (suc_data) {
                    if (suc_data.authSetting["scope.userInfo"] == true) {
                      app.globalData.rejectinfo = 0;
                    }
                  }
                },
                fail: function () {
                  console.info("设置失败返回数据");
                }
              });
            }
          }) 
        } else {
          wx.showModal({
            title: 'wx.login失败',
            content: 'wx.login失败',
          })
        }
      }
    }); 

  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo);
    const that = this;
    app.globalData.nickname = e.detail.userInfo.nickName;
    app.globalData.avatar = e.detail.userInfo.avatarUrl;
    that.setData({
      nickname: e.detail.userInfo.nickName,
      headimgurl: e.detail.userInfo.avatarUrl
    });
    var encryptedData = e.detail.encryptedData;
    var iv = e.detail.iv;
    wx.login({
      success: function (res) {
        console.log('success');
        app.globalData.login_session_code = res.code;
        const wxlogincode = res.code;
        if (res.code) {
          //获取个人信息
          userApi.requestAppApi_POST(app.globalData.mainDomain + "ApiNlpgbg/xcx_setuinfo",
            {
              miniprog: 1,
              encryptedData: encryptedData,
              iv: iv,
              code: wxlogincode,
              nickname: app.globalData.nickname,
              headimgurl: app.globalData.avatar
            },
            function (resSetInfo) {
              //主要是重新获取用户的unionid了
              if (resSetInfo.data.code == 200) {
                app.globalData.unionId = resSetInfo.data.data.unionid;
              }
            });
        } else {
          wx.showModal({
            title: 'wx.login失败',
            content: 'wx.login失败',
          })
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const that = this
    that.setData({
      nickname: app.globalData.nickname,
      headimgurl: app.globalData.avatar,
      mobile: app.globalData.mobile
    });
    wx.stopPullDownRefresh();
  },

  onShow: function () {
    const that = this
    that.setData({
      nickname: app.globalData.nickname,
      headimgurl: app.globalData.avatar,
      mobile: app.globalData.mobile
    });
  },
  stepshow: function () {
    var that = this;
    if (that.data.step) {
      that.setData({
        step: 0,
        height: '100%'
      })
    } else {
      that.setData({
        step: 1,
        height: '2100rpx'
      })
    }
  },
  maskhide: function () {
    var that = this;
    that.setData({
      appload: 0,
    })
  },
  appload: function () {
    var that = this;
    that.setData({
      appload: 1,
    })
  },
  timestart: function (e) {
    var _this = this;
    _this.setData({ timestart: e.timeStamp });
    console.log(e.timeStamp);
  },
  //点击结束的时间
  timeend: function (e) {
    var _this = this;
    _this.setData({ timeend: e.timeStamp });
    console.log(e.timeStamp);
  },
  saveimg: function (e) {
    let that = this;
    let fileimg = that.data.imgurl
    var times = that.data.timeend - that.data.timestart;
    console.log(times);
    if (times > 300) {
      console.log("长按");
      wx.getSetting({
        success(ss) {
          console.log(ss);
          if (!ss.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                wx.saveImageToPhotosAlbum({
                  filePath: fileimg,
                  success(ires) {
                    wx.showModal({
                      title: '提示',
                      content: '保存成功，赶快扫码下载APP吧！',
                      showCancel: false
                    })
                  }
                })
              }
            })
          } else {
            wx.saveImageToPhotosAlbum({
              filePath: fileimg,
              success(ires) {
                wx.showModal({
                  title: '提示',
                  content: '保存成功，赶快扫码下载APP吧！',
                  showCancel: false
                })
              }
            })
          }
        }
      })
    }

  },
  imageDown: function (url) {
    var that = this;
    var fileimg = '';
    wx.downloadFile({
      url: url, //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        fileimg = res.tempFilePath;
        that.setData({
          imgurl: fileimg
        })

      }, fail: function () {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '下载图片失败',
        })
      }
    })
  },
})





