const app = getApp()
const userApi = require('../../libraries/user.js')
var WxParse = require('../../wxParse/wxParse.js');
// 创建一个页面对象用于控制页面的逻辑
Page({
  data: {
    /** 
        * 页面配置 
        */
    userInfo: [],
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    classid:0,
    page: 1,
    items: [] ,
    time: [],
    classlist:[],
    teacherlist:[],
    nodes:[],
    nodes1: [],
    flag:false,
    play:0,
    received:0,
    show: true,
    cancle: false,
    on_load:0,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    system:'',
    platform:'',
    platform_ios:0,
    height: '100%',
    imgurl: '',
    step: 0,
    timestart: '',
    timeend: '',
    appload: ''
  },
  onLoad(options) {
    console.log(options);
    if (1 == 0 && wx.showShareMenu) {
      wx.showShareMenu({
        withShareTicket: true
      });
    }
    
    let that = this;
    that.setData({
      platform: app.globalData.systemInfo.platform,
      platform_ios: app.globalData.systemInfo.platform ? (app.globalData.systemInfo.platform.toLowerCase() == "ios" || app.globalData.systemInfo.platform.toLowerCase() == "devtools") : 0
    })
    // options.id = 11967;
    // options.tjuid = 1173129;
    var theclassid = 0;
    if (options.scene && options.scene != ""){
      let scene = decodeURIComponent(options.scene);
      let scparams = scene.split("#");
      theclassid = scparams[0];
      that.setData({
        classid: scparams[0],
        tjuid: scparams.length > 1 ? scparams[1] : 0,
      });
    }else{
      theclassid = options.id;
      that.setData({
        classid: theclassid,
      });
      
      if (options.share) {
        that.setData({
          share: options.share,
        });
      } 
    }
      that.setData({
        userInfo: {
          nickname: app.globalData.nickname,
          headimgurl: app.globalData.headimgurl,
          userToken: app.globalData.userToken,
        }
      });
    var options11 = { id: theclassid};
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/ke_classx", options11, function (res) {
        console.log(res.data.data);
        res.data.data.begintime = res.data.data.begintime.substr(0, 10);
        that.setData({
          datas: res.data.data,
          on_load: 1
        });
        wx.setNavigationBarTitle({ title: res.data.data.classname});
      }); 

      //课程详情
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/ke_webdetail", {
        classid: theclassid
      }, function (res) {
        // console.log(res.data.data);
        var article = res.data.data.detail;
        WxParse.wxParse('article', 'html', article, that, 5);
      });
    var _imgurl = 'https://api.52jiaoshi.com/Public/images/app_new.png';
      that.imageDown(_imgurl);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  //领取优惠券
  get_coupons:function(e){
    var that = this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "Weekly/coupon", {
      id: e.currentTarget.dataset.id,
    }, function (res) {
      if (res.data.code==200){
        console.log(res.data);
        that.data.datas.discount.unshift(res.data.data);
        that.setData({
          received:1
        });
        wx.showModal({
          title: '恭喜您',
          content: '领取成功',
          showCancel: false,
          success: function (res) {  
          }
        })
      }else{
        wx.showModal({
          title: '抱歉',
          content: '领取失败',
          showCancel: false,
          success: function (res) {

          }
        })
      }
    });
  },
  //立即购买
  buy:function(){
    var that = this;
    if (!userApi.xcx_check_mobile_empty()) {
      return;
    }
    wx.navigateTo({
      url: '../order/order?id=' + that.data.datas.classid + '&tjuid=' + that.data.tjuid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    }); 
  },

  //拼课购买
  spell: function (e) {
    var that = this;
    if (!userApi.xcx_check_mobile_empty()) {
      return;
    }
    wx.navigateTo({
      url: '../order/order?id=' + that.data.datas.classid + '&group=1&groupid=' + that.data.groupid + '&tjuid=' + that.data.tjuid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
  },

   /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: that.data.sharedatas.title,
      path: that.data.sharedatas.path,
      success: function (res1) {
        var scene = 10007;
        if (res1.shareTickets != undefined) {
          scene = 10044;
        }
        userApi.requestAppApi_POST(app.globalData.mainDomain + "/ApiNlpgbg/xcx_share_stat", {
          scene: scene, openid: app.globalData.openId
        }, function (shres) {

        });
        // that.setData({
        //   isshare: 1
        // })
        // 转发成功,通过res1.shareTickets[0]获取转发ticket
      },
      fail: function (res1) {
        // 转发失败
        //console.log(res1);
      }
    }
  },

  spelling:function(e){
    var that=this;
    wx.navigateTo({
      url: '../groupclass/groupclass?groupid=' + e.currentTarget.dataset.id + '&tjuid=' + that.data.tjuid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })  
  },

  go_spell:function(e) {
    var that = this;
    wx.navigateTo({
      url: '../sharegroup/sharegroup?groupid=' + e.currentTarget.dataset.groupid + '&tjuid=' + that.data.tjuid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  rule:function(){
    wx.navigateTo({
      url: '../grouprule/grouprule',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })   
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function (options) {
    const that = this
    var options11 = { classid: that.data.classid };
    if (that.data.groupid) {
      options11 = Object.assign({ groupid: that.data.groupid }, options11);
    }
    userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/isPay", options11, function (res) {
      res.data.data.begintime = res.data.data.begintime.substr(0, 10);
      that.setData({
        datas: res.data.data,
        on_load: 1
      });
      if (res.data.data.group_rule && res.data.data.group_rule.groupid) {
        //循环已加入用户
        that.setData({
          groupid: res.data.data.group_rule.groupid
        });
      }
      wx.setNavigationBarTitle({ title: res.data.data.classname });
    }); 
    wx.stopPullDownRefresh();
  },

  play: function (e) {
    var that = this;
    that.setData({
      play: 1
    });
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        if (res.networkType != "wifi") {
          wx.showModal({
            title: '流量提醒',
            content: '您当前不是在wifi网络下，将消耗约18M流量，继续吗？',
            success: function (res) {
              if (res.confirm) {
                var videoContext = wx.createVideoContext('myVideo');
                videoContext.play();
              } else if (res.cancel) {
                that.setData({
                  play: 0
                });
              }
            }, fail: function (res) {
              var videoContext = wx.createVideoContext('myVideo');
              videoContext.play();
            }
          })
        } else {
          var videoContext = wx.createVideoContext('myVideo');
          videoContext.play();
        }
      }, fail: function (res) {
        var videoContext = wx.createVideoContext('myVideo');
        videoContext.play();
      }
    })
  }, 

  // 关闭公众号二维码
  closeMask:function(){
    const that = this;
    that.setData({
      isshare:0
    })
  },
 

  //立即购买 非0元课
  buyclass: function (e) {
    var that = this;
    console.log(e.detail.formId);
    userApi.requestAppApi_POST(app.globalData.mainQueryDomain + "ZpXcxApi/matrix_formid", { formid: e.detail.formId}, function (res) {
      if (that.data.datas.need_agreement){
        wx.navigateTo({
          url: '../agreement/agreement?id=' + that.data.datas.classid + '&tjuid=' + that.data.tjuid,
        })
      }else{
        that.buy();
      }
      
    });
  },

  //立即购买 0元课
  buyfreeclass: function (e) {
    var that = this;
    userApi.requestAppApi_POST(app.globalData.mainQueryDomain + "ZpXcxApi/matrix_formid", { formid: e.detail.formId }, function (res) {
      that.look();
    });
  },

  //拼课购买 0元课
  spellclass: function (e) {
    var that = this;
    that.setData({
      groupid: e.detail.value.id
    })
    userApi.requestAppApi_POST(app.globalData.mainQueryDomain + "ZpXcxApi/matrix_formid", { formid: e.detail.formId }, function (res) {
      if (that.data.datas.need_agreement) {
        wx.navigateTo({
          url: '../agreement/agreement?id=' + that.data.datas.classid + '&group=1&groupid=' + that.data.groupid + '&tjuid=' + that.data.tjuid,
        })
      } else {
        that.spell();
      }
      
    });
  },

  //回到首页
  retuen: function () {
    wx.switchTab({
      url: '../home/home',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 引导APP
  guideApp:function(){
    const that = this;
    that.setData({
      guideApp:1
    }) 
  },

  closeguideApp:function() {
    const that = this;
    that.setData({
      guideApp: 0
    })
  },
  redirectToDetail: function () {
    wx.navigateBack({ })
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
        height: '10000rpx'
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
  }
})  
