const app = getApp()
const userApi = require('../../libraries/user.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    id: 0,
    items:'',
    components:''
  },
  onLoad(params) {
    var that=this;
    console.log(params);
    var id = params.id;
    
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/regudetails", { id: id }, function (res) {
      console.log(res.data);
      that.setData({
        items: res.data.data,
        components: res.data.data.components
      });
      var article = res.data.data.content;
      WxParse.wxParse('article', 'html', article, that, 5);
    });
    
  },  

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const that = this
    
    wx.stopPullDownRefresh();
  },

  onShow: function () {
    const that = this
    
  },

  // 下载附件
  openFile: function (e) {
    wx.showLoading({
      title: '正在下载',
    })
    var url = e.currentTarget.dataset.url;
    var newurl ='';
    var index = url.lastIndexOf("\.");
    var filetype = url.substring(index + 1, url.length);  
    newurl = app.globalData.mainDomain + 'Xcx/download_file?getsource=1&url=' + encodeURI(url);
    wx.downloadFile({
      url: newurl,
      success: function (res) {
        console.log(res);
        var filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
          fileType: filetype,
          success: function (res) {
            console.log('成功');
          },
          fail: function (err) {
            wx.showModal({
              title: '提示',
              content: err.errMsg,
            })
          }
        })
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  }

})





