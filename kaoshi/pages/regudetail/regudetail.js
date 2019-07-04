// pages/regudetail/regudetail.js
var px2rpx = 2, windowWidth = 375;
const app = getApp()
const userApi = require('../../libraries/user.js')
var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],
    fromcity:0,
    regudata:[],
    moreButtonsShow:0,
    filelistShow: 0,
    imageSize: [],
    cmtImageSize: [],
    showCmtImg: false,
    article:'',
    wxcode: '6',
    maskshow: false,
    tabitems:[],
    gohome: 0,
    teacher: 0,
    step: 0,
    height: '100%',
    imgurl: '',
    timestart: '',
    timeend: '',
    qrcode: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    var pages = getCurrentPages().length;
    if (pages < 2) {
      that.setData({
        gohome: 1
      })
    }
    if (options.cityid){
      that.setData({
        fromcity: options.cityid
      });
    }
    var reguid;
    if (options.scene && options.scene != "") {
      let scene = decodeURIComponent(options.scene);
      reguid = scene;
    } else {
      reguid = options.id
    }
    if (reguid){
      userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/regudetails", { id: options.id }, function (res) {
        that.setData({
          regudata: res.data.data.regu,
          tabitems: res.data.data.column
        });
        wx.setNavigationBarTitle({ title: res.data.data.regu.title });
        WxParse.wxParse('article', 'html', that.data.regudata.content, that, 5);
        for (var i = 0; i < res.data.data.column.length;i++){
          if (res.data.data.column[i].qrcode){
            var _imgurl = res.data.data.column[i].qrcode;
            that.imageDown(_imgurl);
            that.setData({
              qrcode: _imgurl,
            });
          }
        }
        
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.regudata.title,
      path: '/pages/regudetail/regudetail?id=' + that.data.regudata.id,
      success: function (res1) {
        var scene = 10007;
        if (res1.shareTickets != undefined) {
          scene = 10044;
        }
        userApi.requestAppApi_POST(app.globalData.mainDomain + "/ApiNlpgbg/xcx_share_stat", {
          scene: scene, openid: app.globalData.openId
        }, function (shres) {

        });
        // 转发成功,通过res1.shareTickets[0]获取转发ticket
      },
      fail: function (res1) {
        // 转发失败
        //console.log(res1);
      }
    }
  },
  openFile : function(e){
    wx.showLoading({
      title: '正在下载',
    })
    var uuu = app.globalData.mainDomain + 'Xcx/download_file?url=' + encodeURI(e.currentTarget.dataset.url);
    var ftype = e.currentTarget.dataset.type;
    wx.downloadFile({
      url: uuu,
      success: function (res) {
        var filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
          fileType: ftype,
          success: function (res) {
            
          },
          fail:function(err){
            wx.showModal({
              title: '提示',
              content: err.errMsg,
            })
          }
        })
      },
      complete:function(res){
        wx.hideLoading();
      }
    })
  },
  changeMoreButtonShow : function(e){
    var ms = this.data.moreButtonsShow;
    this.setData({
      moreButtonsShow : !ms
    });
  },
  changeFilelistShow: function (e) {
    var ms = this.data.filelistShow;
    this.setData({
      filelistShow: !ms
    });
  },
  gotoUrl : function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },

  //
  askteacher: function () {
    let that = this;
    that.setData({
      maskshow: true
    })
  },
  // 复制微信号
  copy: function () {
    let that = this;
    wx.setClipboardData({
      data: that.data.wxcode,
      success(res) {
        wx.getClipboardData({
          success(res) {

          }
        })
      }
    })
  },

  // 关闭
  close: function () {
    let that = this;
    that.setData({
      maskshow: false
    })
  },
  toClass:function(e){
    let that = this;
    let _id = e.currentTarget.dataset.classid;
    wx.navigateTo({
      url: '../classx/classx?id='+_id,
    })
  },

  //回到首页
  retuen: function () {
    wx.navigateTo({
      url: '../home/home',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
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
        height: '3500rpx'
      })
    }
  },
  maskhide: function () {
    var that = this;
    that.setData({
      teacher: 0,
    })
  },
  teacher: function () {
    var that = this;
    that.setData({
      teacher: 1,
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
                      content: '保存成功，赶快扫码加老师微信吧！',
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
                  content: '保存成功，赶快扫码加老师微信吧！',
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