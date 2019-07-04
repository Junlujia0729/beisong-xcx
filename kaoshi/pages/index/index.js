// pages/index/index.js
const app = getApp()
const userApi = require('../../libraries/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:[],
    height: '100%',
    imgurl: '',
    step: 0,
    timestart: '',
    timeend: '',
    level: '',
    subject: '',
    province: '',
    swiperHeight: '250rpx',
    autoplay: true,
    interval: 3000,
    duration: 1000,
    imgUrls:[],
    routers: []
  },

  isDataLoaded: 0,
  getphone: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onload')
    var that = this;
    //  身份
    try {
      var identity = JSON.parse(wx.getStorageSync('identity'))
      if (identity) {
        that.initdata(); 
        userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/recite_params", {

        }, function (res) {
          var level = [];
          for (var i in res.data.data.level) {
            var item = {};
            item.id = i;
            item.name = res.data.data.level[i];
            level.push(item);
          }
          var subject = [];
          for (var i in res.data.data.subject) {
            var item = {};
            item.id = i;
            item.name = res.data.data.subject[i];
            if (identity.subject == i) {
              item.type = 1
            } else {
              item.type = 0;
            }
            subject.push(item);
          }
          var province = [];
          for (var i in res.data.data.province) {
            var item = {};
            item.id = i;
            item.name = res.data.data.province[i];
            province.push(item);
          }
          var _level = '';
          for (var i = 0; i < level.length; i++) {
            if (identity.level == level[i].id) {
              _level = level[i].name
            }
          }
          var _subject = '';
          for (var i = 0; i < subject.length; i++) {
            if (identity.subject == subject[i].id) {
              console.log()
              _subject = subject[i].name
            }
          }
          var _province = '';     
          for (var i = 0; i < province.length; i++) {
            if (identity.province == province[i].id) {
              
              _province = province[i].name
            }
          }
          that.setData({
            level: _level,
            subject: _subject,
            province: _province,
          })

        });
      }else{
        wx.navigateTo({
          url: '../identity/identity',
        }) 
        var identityjson = {};
        identityjson.province = '24';
        identityjson.level = '1';
        identityjson.subject = '0';

        var _identity = JSON.stringify(identityjson);
        console.log(_identity);
        wx.setStorage({
          key: 'identity',
          data: _identity,
          success: function () {
            console.log('存储成功')
          }
        })
      }
    } catch (e) {
      // Do something when catch error
      //没有定义时
      console.log('去设置身份')
      wx.navigateTo({
        url: '../identity/identity',
      }) 
      var identityjson = {};
      identityjson.province = '24';
      identityjson.level = '1';
      identityjson.subject = '0';

      var _identity = JSON.stringify(identityjson);
      console.log(_identity);
      wx.setStorage({
        key: 'identity',
        data: _identity,
        success: function () {
          console.log('存储成功')
        }
      })
    }
    var _imgurl = 'https://api.52jiaoshi.com/Public/images/app_new.png';
    
    that.imageDown(_imgurl);
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
    var that = this;
    if (that.isDataLoaded == 0){
      try {
        var identity = JSON.parse(wx.getStorageSync('identity'))
        if (identity) {
          that.initdata(); 
          userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/recite_params", {

          }, function (res) {
            var level = [];
            for (var i in res.data.data.level) {
              var item = {};
              item.id = i;
              item.name = res.data.data.level[i];
              level.push(item);
            }
            var subject = [];
            for (var i in res.data.data.subject) {
              var item = {};
              item.id = i;
              item.name = res.data.data.subject[i];
              if (identity.subject == i) {
                item.type = 1
              } else {
                item.type = 0;
              }
              subject.push(item);
            }
            var province = [];
            for (var i in res.data.data.province) {
              var item = {};
              item.id = i;
              item.name = res.data.data.province[i];
              province.push(item);
            }
            var _level = '';
            for (var i = 0; i < level.length; i++) {
              if (identity.level == level[i].id) {
                _level = level[i].name
              }
            }
            var _subject = '';
            for (var i = 0; i < subject.length; i++) {
              if (identity.subject == subject[i].id) {
                _subject = subject[i].name
              } 
            }
            var _province = '';
            console.log(identity);
            console.log(identity['province']);

            for (var i = 0; i < province.length; i++) {
              if (identity.province == province[i].id) {

                _province = province[i].name
              }
            }
            that.setData({
              level: _level,
              subject: _subject,
              province: _province,
            })

          });
        } else {

        }
      } catch (e) {
        // Do something when catch error
        //没有定义时
      }
    }
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
    var that = this;
    that.initdata(); 
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

  videolist:function(){
    wx.navigateTo({
      url: '../videolist/videolist',
    })
  },
  change:function(){
    this.isDataLoaded = 0;
    wx.navigateTo({
      url: '../identity/identity',
    })
  },

  gotochapter:function(e){
    console.log(e);
    var that = this;
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var lock = e.currentTarget.dataset.lock;
    if (lock == 1){
      wx.navigateTo({
        url: '../vip/vip',
      })
      return;
    }
    wx.getStorage({
      key: 'last_allid',
      success(res) {
        var last_allid = res.data;
        last_allid.interfaceid = id;
        wx.setStorage({
          key: 'last_allid',
          data: last_allid,
          success: function () {
          }
        })
      },
      fail: function (e) {
        
      }
    })
    wx.navigateTo({
      url: '../chapter/chapter?id='+id+'&title='+name,
    })
  },

  answer:function(){
    wx.navigateTo({
      url: '../answerarea/answerarea',
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
        height: '3000rpx'
      })
    }
  },
  maskhide: function () {
    var that = this;
    that.setData({
      teacher: 0,
    })
  },
  downloadapp: function () {
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
  initdata:function(){
    var that = this;
    that.isDataLoaded = 1;
    wx.showLoading({
      title: '正在加载',
    })
    // 福利课
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/ke_homelist", {}, function (res) {
      if (res.data.data){
        that.setData({
          classlist: res.data.data
        })
      }
    })
    // banner
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/banner", {}, function (res) {
      if (res.data.data.adv && res.data.data.adv.length) {
        //banner
        that.setData({
          imgUrls: res.data.data.adv,
          swiperHeight: '500rpx'
        });
      } else {
        if (res.data.data.banner && res.data.data.banner.length) {
          that.setData({
            imgUrls: res.data.data.banner
          });
        }
      }
    });
    // 首页练习
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/practice_interface", {}, function (res) {
      if (res.data.code == 200) {
        
        console.log(res);
        var _list = res.data.data.list;

        var chapterdatasArr = []; // 章节知识点总数
        var last_allid = {};  //上次练习所有id（学科，章节，知识点）

        // 第一次打开获取本地存储，对比是否有知识点更新
        // 获取失败则表明第一次打开，即在本地存储一次
        wx.getStorage({
          key: 'chapterdatasArr',
          success(res) {
            chapterdatasArr = res.data;
            var newChapterdatasArr = [];
            for (var i = 0; i < _list.length; i++) {
              _list[i].new = 0;
              for (var j = 0; j < chapterdatasArr.length;j++){
                if (_list[i].id == chapterdatasArr[j].id){
                  if (chapterdatasArr[j].dot_count < _list[i].dot_count){
                    _list[i].new = 1;
                    chapterdatasArr[j].dot_count = _list[i].dot_count;
                  }
                  _list[i].knowledgeNum = chapterdatasArr[j].knowledgeNum
                }
              }
              newChapterdatasArr.push({
                'id': _list[i].id,
                'dot_count': _list[i].dot_count,
                'knowledgeNum': _list[i].knowledgeNum
              });
            }

            wx.setStorage({
              key: 'chapterdatasArr',
              data: newChapterdatasArr,
              success: function () {
              }
            })
          },
          fail: function (e) {
            var newChapterdatasArr = [];
            for (var i = 0; i < _list.length; i++) {
              _list[i].new = 0;
              newChapterdatasArr.push({
                'id': _list[i].id,
                'dot_count': _list[i].dot_count,
                'knowledgeNum':0
              });
            }
            wx.setStorage({
              key: 'chapterdatasArr',
              data: newChapterdatasArr,
              success: function () {
              }
            })
          }
        })

        //获取上次练习的所有id
        wx.getStorage({
          key: 'last_allid',
          success(res) {
            last_allid = res.data;
            console.log(last_allid.interfaceid);
            for (var i = 0; i < _list.length; i++) {
              if (last_allid.interfaceid != 0 && last_allid.interfaceid == _list[i].id) {
                _list[i].lastpractice = 1;
              } else {
                _list[i].lastpractice = 0;
              }
            }
          },
          fail: function (e) {
            last_allid.interfaceid = 0;
            last_allid.chapterid = 0;
            last_allid.knowledgeListid = 0;
            last_allid.knowledgeid = 0;
            wx.setStorage({
              key: 'last_allid',
              data: last_allid,
              success: function () {
              }
            })
          }
        })

        //获取每个科目所掌握的知识点数
        wx.getStorage({
          key: 'knowledgeNumArr',
          success(res) {
            var knowledgeNumArr = res.data;
            for (var i = 0; i < _list.length; i++) {
              for (var j = 0; j < knowledgeNumArr.length;j++){
                if (_list[i].id == knowledgeNumArr[j].id){
                  _list[i].knowledgeNum = knowledgeNumArr[j].knowledgeNum;
                }else{
                  _list[i].knowledgeNum = 0;
                }
              }
            }
          },
          fail: function (e) {
            for (var i = 0; i < _list.length; i++) {
              _list[i].knowledgeNum = 0;
            }
          }
        })
        wx.hideLoading({
          title: '正在加载',
        })
        setTimeout(function () {
          console.log(_list);
          that.setData({
            datas: _list
          })}, 200)
      }
    }); 
  },

  //点击banner
  clickBanner: function (e) {
    var that = this;
    if (that.data.imgUrls[e.currentTarget.dataset.index].getphone == 1 && app.globalData.mobile == "") {
      that.getphone.path = that.data.imgUrls[e.currentTarget.dataset.index].path;
      that.getphone.title = that.data.imgUrls[e.currentTarget.dataset.index].title;
      that.getphone.open_type = that.data.imgUrls[e.currentTarget.dataset.index].open_type;
      //未设置电话号码
      wx.navigateTo({
        url: '../getphone/getphone?popid=3',
      })
    } else {
      userApi.gotoActivityPage(that.data.imgUrls[e.currentTarget.dataset.index].path, that.data.imgUrls[e.currentTarget.dataset.index].title, that.data.imgUrls[e.currentTarget.dataset.index].open_type, function () {

      });
    }
  },
  // 关闭弹窗
  TopublicActivityCall: function (e) {
    var that = this;
    that.setData({
      mask_defult: 0
    });
  },
  // 需要设置手机号的公共活动页
  TopublicActivity: function () {
    var that = this;
    if (that.getphone.path.indexOf("http://") == -1 && that.getphone.path.indexOf("https://") == -1) {
      if (that.getphone.open_type == "switchTab") {
        wx.switchTab({
          url: '../' + that.getphone.path,
          success: function () {
            that.TopublicActivityCall();
          }
        });
      } else {
        wx.redirectTo({
          url: '../' + that.getphone.path,
          success: function () {
            that.TopublicActivityCall();
          }
        })
      }
    } else {
      app.globalData.activityUrl = that.getphone.path;
      app.globalData.activityTitle = that.getphone.title;
      wx.redirectTo({
        url: '../activity/activity',
        success: function () {
          that.TopublicActivityCall();
        }
      })
    }
  },
  toclass:function(e){
    console.log(e);
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;

    if (type == 1){
      wx.navigateTo({
        url: '../classx/classx?id='+id,
      })
    }else{
      wx.navigateTo({
        url: '../classlist/classlist?id=' + id,
      })
    }
  }
})