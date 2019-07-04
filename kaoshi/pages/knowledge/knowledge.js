// pages/knowledge/knowledge.js
const app = getApp()
const userApi = require('../../libraries/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacher:0,
    step:0,
    height:'100%',
    imgurl:'',
    timestart:'',
    timeend:'',
    rememberimg:'../../images/animation/1_00000.png',
    qrcode:''
  },
  analyseText: function (text) {
    let child_title = {};
    child_title.name = 'span';
    let attrs = "";
    if (text.size != '14') {
      attrs += 'font-size:' + text.size + 'px;';
    }

    if (text.unl != 0) {
      //attrs += 'text-decoration:underline;';
      attrs += 'padding-bottom:1px;border-bottom:1px solid #ff4a4a;';
      attrs += 'color:#ff4a4a;';
    } else {
      if (text.color != '#000000') {
        attrs += 'color:' + text.color + ';';
      }
    }
    if (attrs != "") {
      child_title.attrs = { style: attrs };
    } else {
      child_title.attrs = {};
    }
    child_title.children = [];
    child_title.children.push({ type: 'text', text: text.content });
    return child_title;
  },
  analyseImg: function (img) {
    let child_title = {};
    child_title.name = 'img';
    child_title.attrs = {};
    child_title.attrs.src = img.src;
    child_title.attrs.style = "width:100%;";
    return child_title;
  },
  analyseBr: function () {
    let child_title = {};
    child_title.name = 'br';
    return child_title;
  },
  analyseOneNode: function (items) {
    let arr_title = [];
    if (!items || !items.length) return arr_title;
    for (var ii = 0; ii < items.length; ii++) {
      if (items[ii].type == 'txt') {
        arr_title.push(this.analyseText(items[ii]));
      } else if (items[ii].type == 'img') {
        arr_title.push(this.analyseImg(items[ii]));
      } else if (items[ii].type == 'br') {
        arr_title.push(this.analyseBr());
      }
    }
    return arr_title;
  },
  //展示
  showQuestion: function (datas) {
    if (!datas) return;
    // console.log(datas);
    let that = this;
    var question = {};
    //题型
    question.id = datas.id;
    question.isremember = datas.isremember;
    //题目题干
    //解析 
    question.arr_questionanalysis = this.analyseOneNode(datas.content);
    question.arr_skill = this.analyseOneNode(datas.expound);
    question.fav = datas.fav;
    return question;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // let knowledge_id = 23227;
    var imgindex = 0;
    let knowledge_id = 0;
    if (options.id) {
      knowledge_id = options.id;
    }
    if (options.title) {
      wx.setNavigationBarTitle({
        title: options.title
      })
    }
    wx.showLoading({
      title: '正在加载',
    })
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/knowleage", { id: knowledge_id }, function (res) {
      if (res.data.code == 200) {
        var datas = that.showQuestion(res.data.data.data);
        console.log(datas);
        that.setData({
          datas: datas,
          isfav: res.data.data.isfav,
          qrcode: res.data.data.data.qrcode
        })
        wx.hideLoading({
          title: '正在加载',
        })
        var _imgurl = res.data.data.data.qrcode;
        that.imageDown(_imgurl);
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

  },

  //背题
  recite: function (e) {
    let that = this;
    let arrs = that.data.datas.arr_skill;
    let reply_list_str = 'datas.arr_skill';
    let reply_list_str_box = 'datas.reciteBox';
    if (arrs) {
      for (let j = 0; j < arrs.length; j++) {
        if (arrs[j].name == "span") {
          if (arrs[j].attrs.style && arrs[j].attrs.style.indexOf('border-bottom') >= 0) {
            //.get('text-decoration')
            //arrs[j].attrs.style.replace(/ff4a4a/g, "fff");
            arrs[j].attrs.style = "padding-bottom:1px;border-bottom:1px solid #333;color:#fcfcfc;";
          }
        }
      }
      that.setData({
        [reply_list_str]: arrs
      });

    }
  },

  //松开背题
  reciteEnd: function (e) {
    let that = this;
    let arrs = that.data.datas.arr_skill;
    let reply_list_str = 'datas.arr_skill';
    let reply_list_str_box = 'datas.reciteBox';
    
    if (arrs) {
      for (let j = 0; j < arrs.length; j++) {
        if (arrs[j].name == "span") {
          if (arrs[j].attrs.style && arrs[j].attrs.style.indexOf('border-bottom') >= 0) {
            //arrs[j].attrs.style.replace(/fff/g, "ff4a4a");
            arrs[j].attrs.style = "padding-bottom:1px;border-bottom:1px solid #ff4a4a;color:#ff4a4a;";
          }
        }
      }
      that.setData({
        [reply_list_str]: arrs
      });
    }
  },
  stepshow:function(){
    var that = this;
    if (that.data.step){
      that.setData({
        step: 0,
        height: '100%'
      })
    }else{
      that.setData({
        step: 1,
        height: '2100rpx'
      })
    }
  },
  maskhide:function(){
    var that = this;
    that.setData({
      teacher: 0,
    })
  },
  teacher:function(){
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
  },
  practice: function (e) {
    var that = this;

    wx.navigateTo({
      url: '../dailypractice/pages/practice/practice?id=' + that.data.datas.id+'&practietype=2',
    })
  },
  // 添加收藏
  collect: function (e) {
    let that = this;
    wx.getStorage({
      key: 'last_allid',
      success: function(res) {
        var allids = res.data;
        userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/fav_knowleage_add", { object: allids.interfaceid, chapter: allids.chapterid, section: allids.knowledgeListid, id: allids.knowledgeid }, function (res) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          if (res.data.code == 200) {
            that.setData({
              isfav: 1
            })
          }
          setTimeout(function () {
            wx.hideToast();
          }, 800)
        });
      },
    })
    
  },
  // 取消收藏
  canclefav: function (e) {
    let that = this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/fav_knowleage_del", { id: that.data.datas.id }, function (res) {
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
      if (res.data.code == 200) {
        that.setData({
          isfav: 0
        })
      }
      setTimeout(function () {
        wx.hideToast();
      }, 800)
    });
  }
})