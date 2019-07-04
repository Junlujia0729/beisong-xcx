// pages/putquestion/putquestion.js
const app = getApp()
const userApi = require('../../libraries/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['单选题', '多选题', '判断题'], //下拉列表的数据
    type: 0, //选择的下拉列 表下标,
    comment_img_url: [],
    comment_img_count:[],
    showresult:false,
    uptoken:'',
    upurl: app.globalData.mainDomain + 'Homework/upload_qiniu?fieldname=file&token=',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that  = this;
   
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/upload_token", {}, function (res) {
      that.setData({
        uptoken: res.data.data.uptoken,
        upurl: app.globalData.mainDomain + 'XcxApi/upload_qiniu?fieldname=file&token=' + res.data.data.uptoken
      });
    });
    
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

  },

  selectTap() {
    this.setData({
      show: !this.data.show,
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },

  selectImg: function (e) {
    var that = this;
    var comment_img_url = that.data.comment_img_url;
    var comment_img_count = that.data.comment_img_count;
    if (comment_img_count < 3) {
      wx.chooseImage({
        count: 3 - comment_img_count, // 默认9，这里显示一次选择相册的图片数量
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFiles = res.tempFiles
          //循环把图片加入上传列表
          for (var i in tempFiles) {
            comment_img_url.push(tempFiles[i].path);
            comment_img_count++;
          }
          that.setData({
            comment_img_url: comment_img_url,
            comment_img_count: comment_img_count
          });
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '最多选择三张图片',
      })
    }
  },
  deleteImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var that = this;
    var comment_img_url = [];
    var comment_img_count = 0;
    for (var i = 0; i < that.data.comment_img_url.length; i++) {
      if (i != index) {
        comment_img_url.push(that.data.comment_img_url[i]);
        comment_img_count++;
      }
    }
    this.setData({
      comment_img_url: comment_img_url,
      comment_img_count: comment_img_count
    });
  },

  submitQuestion: function (e) {

    console.log(e);
    var that = this;
    let type = that.data.type;
    let title = e.detail.value.title;
    let item_a = e.detail.value.A;
    let item_b = e.detail.value.B;
    let item_c = e.detail.value.C;
    let item_d = e.detail.value.D;
    let item_e = e.detail.value.E;
    let item_f = e.detail.value.F;
    if (!type) {
      wx.showModal({
        title: '提示',
        content: '请选择题型',
        showCancel: false
      })
      return false;
    }
    if (!title) {
      wx.showModal({
        title: '提示',
        content: '请输入题干',
        showCancel: false
      })
      return false;
    }
    var upload_pic_list = [];
    console.log(that.data.comment_img_url);
    if (that.data.comment_img_url.length > 0) {
      for (var ii = 0; ii < that.data.comment_img_url.length; ii++) {
        upload_pic_list.push({
          path: that.data.comment_img_url[ii],
          tp: 'img',
          dur: 0,
          upload_percent: 0,
          path_server: ''
        });
      }
    }
    
    var proc = 0;
    var total = upload_pic_list.length;
    if (upload_pic_list.length){
      that.setData({
        upload_picture_list: upload_pic_list,
      })
      // 有图片
      userApi.upload_file_server(that, that.data.upurl, upload_pic_list, proc, total, function () {
        var strImgUrl = "";
        for (var i = 0; i < upload_pic_list.length; i++) {
          if (upload_pic_list[i].path_server != undefined && upload_pic_list[i].path_server != "") {
            if (upload_pic_list[i].tp == "img") {
              strImgUrl += (upload_pic_list[i].path_server + ",");
            } else {
              audioUrl = upload_pic_list[i].path_server;
              audioDur = upload_pic_list[i].dur;
            }
          }
        }
        if (strImgUrl.length) {
          strImgUrl = strImgUrl.substring(0, strImgUrl.length - 1);
        }
        userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/addqa", {
          type: type, title: title, item_a: item_a, item_b: item_b, item_c: item_c,
          item_d: item_d, item_e: item_e, item_f: item_f, pics: strImgUrl
        }, function (res) {
          console.log(res);
          if (res.data.code == 200) {
            that.setData({
              showresult: true
            })
          }

        });
      });
    }else{
      userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/addqa", {
        type: type, title: title, item_a: item_a, item_b: item_b, item_c: item_c,
        item_d: item_d, item_e: item_e, item_f: item_f, pics: strImgUrl
      }, function (res) {
        console.log(res);
        if (res.data.code == 200) {
          that.setData({
            showresult: true
          })
        }

      });  
    }
  },
  tomineques:function(){
    wx.redirectTo({
      url: '../answerarea/answerarea',
    })
  },
  select:function(e){
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      type: Index,
    });
  }
  
})