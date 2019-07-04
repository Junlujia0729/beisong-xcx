// pages/addcomment/addcomment.js
const app = getApp()
const userApi = require('../../libraries/user.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dynid:0,    //文章id
    replyid:0,  //回复的评论id
    to_user:'', //展示用回复给谁
    comment_img_url : [],
    comment_img_count : 0,
    comment_words_count : 0,
    const_com_text : '',
    uptoken: '',
    upurl: app.globalData.mainDomain + 'Homework/upload_qiniu?fieldname=file&token=',
    upload_picture_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.id){
      that.setData({ dynid: options.id});
    }
    if (options.rid) {
      that.setData({
        replyid: options.rid,
        to_user:options.to
      });
    }
    userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/upload_token", {}, function (res) {
      that.setData({
        uptoken: res.data.data.uptoken,
        upurl: app.globalData.mainDomain + 'ZpXcxApi/upload_qiniu?fieldname=file&token=' + res.data.data.uptoken
      });
    });
  },

  textAreaInput: function (e) {
    this.setData({
      const_com_text: e.detail.value,
      comment_words_count: e.detail.value.length
    });
  },
  submitComment: function (e) {
    var that = this;
    var suburl = app.globalData.mainDomain + "LxzgzXcxApi/addqareply";

    //先上报formid
    // userApi.requestAppApi_POST(app.globalData.mainQueryDomain + "ApiNlpgbg/xcx_formidByUid", { formid: e.detail.formId, openid: app.globalData.openId, unionid: app.globalData.unionId, token: app.globalData.wx_ltk }, function (res) {
    // });
    
    //e.detail.formId
    if (e.detail.value.com_text != "" || that.data.comment_words_count) {
      wx.showLoading({
        title: '正在发送',
        mask: true,
      });
      var com_text = e.detail.value.com_text;

      //upload_picture_list 元素定义 path:本地路径 path_server:上传后的路径(上传回调处理)
      var upload_picture_list_ = [];
      if (that.data.comment_img_url.length > 0){
        for (var ii = 0; ii < that.data.comment_img_url.length; ii++) {
          upload_picture_list_.push({
            path: that.data.comment_img_url[ii] ,
            tp: 'img',
            dur: 0,
            upload_percent: 0,
            path_server: ''
          });
        }
      }

      if (upload_picture_list_.length) {
        //上传图片和音频并且发送
        that.setData({
          upload_picture_list: upload_picture_list_,
        })
        
        var proc = 0;
        var total = upload_picture_list_.length;
        userApi.upload_file_server(that, that.data.upurl, upload_picture_list_, proc, total, function () {
          subComment_pic(suburl, that.data.dynid, that.data.replyid, com_text, that.data.upload_picture_list);
        });
      } else {
        //直接发送
        subComment(suburl, that.data.dynid, that.data.replyid, com_text, '','',0);
      }
    } else {
      console.log("showCmtImg");
      //底部按钮，只隐藏
      that.setData({
        showCmtImg: false
      });
    }
  },
  selectImg: function (e) {
    var that = this;
    var comment_img_url = that.data.comment_img_url;
    var comment_img_count = that.data.comment_img_count;
    if (comment_img_count < 3){
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
    }else{
      wx.showModal({
        title: '提示',
        showCancel:false,
        content: '最多选择三张图片',
      })
    }
  },
  deleteImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var that = this;
    var comment_img_url = [];
    var comment_img_count = 0;
    for (var i = 0; i < that.data.comment_img_url.length;i++){
      if (i != index){
        comment_img_url.push(that.data.comment_img_url[i]);
        comment_img_count ++;
      }
    }
    this.setData({
      comment_img_url: comment_img_url,
      comment_img_count: comment_img_count
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

  cancelComment:function(e){
    wx.navigateBack({
      
    });
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

  
})

// 上传图片和语音
function subComment_pic(suburl, dynid, replyid, com_text, upload_pic_list){
  var strImgUrl = "";
  var audioUrl = "";
  var audioDur = 0;
  for (var i = 0; i < upload_pic_list.length;i++){
    if (upload_pic_list[i].path_server != undefined && upload_pic_list[i].path_server != ""){
      if (upload_pic_list[i].tp == "img"){
        strImgUrl += (upload_pic_list[i].path_server + ",");
      }else{
        audioUrl = upload_pic_list[i].path_server;
        audioDur = upload_pic_list[i].dur;
      }
    }
  }
  if (strImgUrl.length){
    strImgUrl = strImgUrl.substring(0, strImgUrl.length - 1);
  }
  subComment(suburl, dynid, replyid, com_text, strImgUrl, audioUrl, audioDur);
}

function subComment(suburl, dynid, replyid, com_text, strImgUrl, url, duration){
  var pages = getCurrentPages();
  var currPage = pages[pages.length - 1];   //当前页面
  var prevPage = pages[pages.length - 2];  //上一个页面
  var columnPage = null;
  if (pages.length >= 3){
    var columnPage = pages[pages.length - 3];  //上一个页面
  }

  var subdatas = {
    content : com_text,
    images: strImgUrl
  };
  subdatas.qaid = dynid;
  // replyid > 0 是回复 ；
  if (replyid > 0){
    subdatas.replyid = replyid;
  }
  userApi.requestAppApi_POST(suburl, subdatas, function (res) {
    if (res.data.code != 200){
      wx.showModal({
        title: '错误',
        showCancel: false,
        content: res.data.msg,
      })
      return;
    }
    console.log(res);
    var commenta = res.data.data; 
    prevPage.updateReplyData(commenta);
    //todo 提交到列表页
    wx.hideLoading();
    wx.navigateBack({
      
    });
  })
}

function initial(duration, that) {
  // 秒数  
  var second = duration;

  // 分钟位  
  var min = Math.floor((second) / 60);
  var minStr = min.toString();
  if (minStr.length == 1) minStr = '0' + minStr;

  // 秒位  
  var sec = second - min * 60;
  var secStr = sec.toString();
  if (secStr.length == 1) secStr = '0' + secStr;
  that.setData({
    play_countDownMinute: minStr,
    play_countDownSecond: secStr
  })
}

function formatTime(seconds) {
  var min = ~~(seconds / 60)
  var sec = parseInt(seconds - min * 60)
  return ('00' + min).substr(-2) + ':' + ('00' + sec).substr(-2)
}

