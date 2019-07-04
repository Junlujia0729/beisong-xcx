const app = getApp();
const userApi = require('../../../../libraries/user.js');
var utilComment = require('../../../common/commentlist.js');
// 创建一个页面对象用于控制页面的逻辑
Page({
  data: {
    correct_rate:0,
    examanalysis:{},
    current:'',
    num:0,
    clientHeight: 0,
    showcard:0
  },
  onLoad(params) {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    if (1 == 0 && wx.showShareMenu) {
      wx.showShareMenu({
        withShareTicket: true
      });
    }
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    var questions = prevPage.data.result;
    var correct_rate = parseInt((questions.score / questions.result.length)*100);
    that.setData({
      questions: prevPage.data.result.result,
      correct_rate: correct_rate,
      examanalysis: prevPage.data.examanalysis,
      num: questions.result.length,
      score: questions.score
    })
    var title = params.title;

    // 加载图片
    setTimeout(function () {
      let _imgurl = app.globalData.mainDomain + 'LxzgzXcxApi/dk_koi?token=' + app.globalData.userToken
      that.setData({
        imgurl: _imgurl
      })
      that.imageDown(_imgurl);
    }, 1000);
  },
  
  onReady: function () {
    const that = this;
    // 页面渲染完成  
    var cxt_arc = wx.createCanvasContext('canvasArc');//创建并返回绘图上下文context对象。  
    cxt_arc.setLineWidth(6);
    cxt_arc.setStrokeStyle('#ffffff');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath();//开始一个新的路径  
    cxt_arc.arc(106, 106, 73, 0, 2 * Math.PI, false);//设置一个原点(106,106)，半径为100的圆的路径到当前路径  
    cxt_arc.stroke();//对当前路径进行描边  

    cxt_arc.setLineWidth(6);
    cxt_arc.setStrokeStyle('#3eccb3');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath();//开始一个新的路径  
    cxt_arc.arc(106, 106, 73, -Math.PI * 0.5, Math.PI * (that.data.correct_rate/100*2-0.5), false);
    cxt_arc.stroke();//对当前路径进行描边  

    cxt_arc.draw();

  },  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
     
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const that = this;
    
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },
  
  analysis:function(){
    wx.navigateTo({
      url: '../examanalysis/examanalysis',
    })
  },

  toclock:function(){
    wx.redirectTo({
      url: '../../../punchclock/punchclock',
    })
  },

  checkitem: function (e) {
    const that = this;
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../examanalysis/examanalysis?index='+ index,
    })
  },
  //图片加载完毕
  imgload: function (e) {
    let that = this;
    that.setData({
      showsection1: 1
    })
  },
  startdraw: function (e) {
    let that = this;
    that.setData({
      showsection2: 1
    })
  },
  saveimg: function (e) {
    let that = this;
    let fileimg = that.data.imgurl
    wx.getSetting({
      success(ss) {
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
                    content: '保存成功，赶快晒朋友圈吧！',
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
                content: '保存成功，赶快晒朋友圈吧！',
                showCancel: false
              })
            }
          })
        }
      }
    })
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

  creatcard:function(){
    let that = this;
    that.setData({
      showcard:1
    })
  },
  hidecard:function(){
    let that = this;
    that.setData({
      showcard: 0
    })
  }
}) 
