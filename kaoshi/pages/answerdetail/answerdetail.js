// pages/answerdetail/answerdetail.js
const app = getApp()
const userApi = require('../../libraries/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:'',
    nickname:'',
    replyOptions: [],
    qaid:'',
    inf_id:0,
    clientHeight:'',
    last_index:0,
    cmtImages:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let id = options.id;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/qadetails", {id:id}, function (res) {
      if (res.data.code == 200) {
        if (res.data.data.like_type) {
          res.data.data.likeimg = 'http://imgs.52jiaoshi.com/1559804927.png'
        } else {
          res.data.data.likeimg = 'http://imgs.52jiaoshi.com/1559636218.png'
        }
        var imgarr = res.data.data.pics.split(',');
        res.data.data.imgarr = imgarr;
        that.setData({
          datas: res.data.data,
          qaid: res.data.data.id
        })
      }
    });
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/qareply", { qaid: id,inf_id:0 }, function (res) {
      var _floor = that.data.last_index;
      if (res.data.code == 200) {
        if (res.data.data.length && res.data.data.length>0){
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].like_type) {
              res.data.data[i].likeimg = 'http://imgs.52jiaoshi.com/1559804927.png'
            } else {
              res.data.data[i].likeimg = 'http://imgs.52jiaoshi.com/1559636218.png'
            }
            res.data.data[i].floor = ++_floor;
          }

          // 先存入父评论楼层，再循环对比id存子评论楼层
          for (var i = 0; i < res.data.data.length; i++) {

            if (res.data.data[i].replyid > 0) {
              console.log(res.data.data[i].replyid);
              var rid = res.data.data[i].replyid;
              for (var j = 0; j < res.data.data.length; j++) {
                if (rid == res.data.data[j].id) {
                  res.data.data[i].reply.floor = res.data.data[j].floor
                }
              }
            }
          }
          that.setData({
            comments: res.data.data,
            inf_id: res.data.data[res.data.data.length - 1].id,
            last_index: _floor
          })
        }
        
      }
    });

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight - 50
        });
      }
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

  addcomment: function (e) {
    let that = this;
    let articleid = that.data.datas.id;
    if (articleid > 0) {
      this.gotoReply({
        articleid: articleid,
        replyid: 0,
        to: ''
      });
    }

  },
  onReplyEvent: function (e) {
    let that = this;
    let articleid = that.data.datas.id;

    if (articleid > 0) {
      this.gotoReply({
        articleid: articleid,
        replyid: e.detail.id,
        to: e.detail.uname
      });
    }
  },

  //获取昵称后去评论
  redirectToReplay: function () {
    let that = this;
    let options = that.data.replyOptions;
    wx.redirectTo({
      url: '../addcomment/addcomment?id=' + options.articleid + '&rid=' + options.replyid + '&to=' + options.to,
    });
  },
  //跳转到去评论的窗口
  gotoReply: function (options) {
    let that = this;
    that.data.replyOptions = options;
    if (app.globalData.avatar == '' || app.globalData.nickname == '') {
      wx.navigateTo({
        url: '../getuserinfo/getuserinfo',
      })
    } else {
      wx.navigateTo({
        url: '../addcomment/addcomment?id=' + options.articleid + '&rid=' + options.replyid + '&to=' + options.to
      })
    }
  },

  //更新评论内容
  updateReplyData: function (comment) {
    let that = this;
    let commentlist = [];
    commentlist = that.data.comments;
    if (commentlist == undefined || commentlist.length == 0) {
      commentlist = [];
    }
    commentlist.unshift(comment);
    that.setData({
      comments: commentlist,
      inf_id: comment.id,
    });
  },

  //点赞
  onDianzanEvent: function (e) {
    console.log(e);
    let that = this;
    let id = e.detail.id;
    let index = e.detail.index;
    let _likenum = e.detail.likes;
    let _like = e.detail.like;
    if (_like == 1){
      return;
    }
    let likestr = 'comments[' + index + '].likeimg';
    let likesnum = 'comments[' + index + '].likenum';
    let isliked_text = 'comments[' + index + '].like_type';
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/qalike", { id: that.data.qaid, replyid: id }, function (res) {
      that.setData({
        [likestr]: 'http://imgs.52jiaoshi.com/1559804927.png',
        [likesnum]: ++_likenum,
        [isliked_text]:1
      })
      console.log(that.data.datas)
    });
  },
  todetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../answerdetail/answerdetail?id=' + id,
    })
  },

  onLower:function(){
    var that = this;
    that.setData({
      is_loadingmore: 1,
      loadingmore_text: '正在加载'
    });
    let comments = that.data.comments;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/qareply", { qaid: that.data.qaid, inf_id: that.data.inf_id }, function (res) {
      if (res.data.data && res.data.data.length) {
        if (!comments) {
          comments = [];
        }
        var _floor = that.data.last_index;
        for (let j = 0; j < res.data.data.length; j++) {
          comments.push(res.data.data[j]);
          res.data.data[j].floor = ++_floor;
        }
        // 先存入父评论楼层，再循环对比id存子评论楼层
        for (var i = 0; i < res.data.data.length; i++) {

          if (res.data.data[i].replyid > 0) {
            console.log(res.data.data[i].replyid);
            var rid = res.data.data[i].replyid;
            for (var j = 0; j < comments.length; j++) {
              if (rid == comments[j].id) {
                res.data.data[i].reply.floor = comments[j].floor
              }
            }
          }
        }
        that.setData({
          comments: comments,
          inf_id: res.data.data[res.data.data.length - 1].id,
          is_loadingmore: 0,
          loadingmore_text: '加载完成',
          last_index: _floor
        });
      } else {
        that.setData({
          loadingmore_text: '没有更多了'
        });
        setTimeout(function () {
          that.setData({
            is_loadingmore: 0
          });
        }, 3000);
      }
    });
  },
  clickCmtImage: function (e) {
    var that = this;
    var images = that.data.datas.imgarr;
    var current = e.currentTarget.dataset.ori;
    wx.previewImage({
      current: current,
      urls: images,//内部的地址为绝对路径
      fail: function () {
      },
      complete: function () {
      },
    })
  }
})