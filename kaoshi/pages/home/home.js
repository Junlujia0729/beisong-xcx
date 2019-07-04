// pages/home/home.js
const app = getApp()
const userApi = require('../../libraries/user.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    level_word: '',
    subject_word: '',
    mask:0,
    mask_defult:0,
    fav_count:0,
    rank:0,
    tasks:{},
    total:0,
    all_questions:[], //所有题目ID
    collect_total:0, //收藏题目总数
    collect_questions:[],//所有收藏题ID
    last_taskid:0,  //记录任务ID
    channel:0,
    imgUrls:[],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    swiperHeight: '250rpx',
    routers: [],
    receive:'',
    animationMiddleHeaderItem: {},
    gol_task:0,
    maskdata:[],
    videoes:[]
  },
  last_level: 0, //用来判断是否需要重新刷新
  last_object: 0, //用来判断是否需要重新刷新
  last_taskid:0, //用来记录当前背的题任务
  last_taskindex:0, //
  _index: 0, //用来记录当前复习的题任务
  is_loaded:0,
  getphone:{},
  //是否设置了身份
  ifNotSetIdentify: function(){
    if (app.globalData.level == 0) {
      //未设置身份
      wx.navigateTo({
        url: '../guide/guide',
      })
      return false;
    }
    return true;
  },
  initTasks:function(){
    const that = this;
    let interval = setInterval(() => {
      if (app.globalData.userToken != "") { // 判断已经有token了
        clearInterval(interval) // 清理定时器 
        if (app.globalData.level == 0) {
          //未设置身份，展示几个固定值
          that.setData({
            level_word: '暂未设置报考科目'
          });
        }
        console.log('首页111')
        that.last_level = app.globalData.level;
        that.last_subject = app.globalData.subject;
        that.is_loaded = 1;
        userApi.requestAppApi_GET(app.globalData.mainDomain + "ZpXcxApi/recite_tasks", { level: app.globalData.level > 0 ? app.globalData.level : 1, subject: app.globalData.subject > 0 ? app.globalData.subject : 11 }, function (res) {
          let tasks = res.data.data.tasks;
          console.log(tasks);
          let all_questions = [];
          for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].process_questionids.length){
              for (let j = 0; j < tasks[i].process_questionids.length; j++) {
                all_questions.push(tasks[i].process_questionids[j])
              }
            }
            if (tasks[i].questionids.length){
              for (let m = 0; m < tasks[i].questionids.length; m++) {
                all_questions.push(tasks[i].questionids[m])
              }
            }
          }
          that.setData({
            tasks: tasks,
            all_questions: all_questions,
          });
        });
        userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/query_score_bomb", { scene: app.globalData.scene }, function (res) {
          console.log(res.data.data)
          if (res.data.data.bomb) {
            that.setData({
              mask: 1
            });
          }
        });
        userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/banner", {}, function (res) {
          if (res.data.data.adv && res.data.data.adv.length) {
            //banner
            that.setData({
              imgUrls: res.data.data.adv,
              swiperHeight:'500rpx'
            });
          }else{
            if (res.data.data.banner && res.data.data.banner.length) {
              that.setData({
                imgUrls: res.data.data.banner
              });
            }
          }
          if (res.data.data.navigation && res.data.data.navigation.length) {
            //route
            var _l = 0;
            var _routers = [];
            var length = res.data.data.navigation.length;
            _routers[0] = new Array();
            for (var ii = 1; ii <= length; ii++) {
              _routers[_l].push(res.data.data.navigation[ii - 1]);
              if (ii % 4 == 0 && ii != length) {
                _routers[++_l] = new Array();
              }
            }
            console.log(_routers);
            that.setData({
              routers: _routers
            });
          }
        });
        userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/bomb_box", { scene: app.globalData.scene_type }, function (res) {
          console.log(res.data);
          if (res.data.data.id) {
            that.setData({
              maskdata: res.data.data,
              mask_defult:2
            });
          }
        });

        userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/recite_inter_tasks", {}, function (res) {
          console.log(res.data);
          if (res.data.data.trial){
            that.setData({
              struct: res.data.data.struct,
              videoes: res.data.data.trial
            })
          }else{
            that.setData({
              struct: res.data.data.struct
            })
          }
          
        })
      }
    }, 10);

    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if (options.scene && options.scene != "") {
      let channel = decodeURIComponent(options.scene);
      that.setData({
        channel: channel,
      });
      userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/channel", {
        channel: channel
      }, function (res) {
      });
    }
    that.initTasks();
    console.log('首页')
    
    // 
    var circleCount = 0;
    // 心跳的外框动画        
    this.animationMiddleHeaderItem = wx.createAnimation({
      duration: 1000, // 以毫秒为单位         
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function (res) { }
    });

    setInterval(function () {
      if (circleCount % 2 == 0) {
        this.animationMiddleHeaderItem.scale(1.12).step();
      } else { this.animationMiddleHeaderItem.scale(1.0).step(); } this.setData({
        animationMiddleHeaderItem: this.animationMiddleHeaderItem.export()  //输出动画       
      });

      circleCount++;
      if (circleCount == 1000) {
        circleCount = 0;
      }
    }.bind(this), 1000);  
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
    const that = this;
    if (that.is_loaded == 1){
      if (that.last_level != app.globalData.level || that.last_subject != app.globalData.subject) {
        that.last_level = app.globalData.level;
        that.last_subject = app.globalData.subject;
        that.initTasks();
      }
    }
  },
  gotoClass: function (e) {
    
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
    const that = this;
    that.initTasks();
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
    return {
      title: '教师招聘考试宝典',
      path: '/pages/home/home',
      success: function (res1) {
        var scene = 10007;
        if (res1.shareTickets != undefined) {
          scene = 10044;
        }
        
        // 转发成功,通过res1.shareTickets[0]获取转发ticket
        //console.log(res1.shareTickets[0]);
      },
      fail: function (res1) {
        // 转发失败
        //console.log(res1);
      }
    }
  },
  // gotoDetail: function (e) {
  //   let that = this;
  //   that.gotoTaskDetail(e.currentTarget.dataset.task);
  // },
  gotoTaskDetail: function (task) {
    let that = this;
    let _gol_task = task;
    that.setData({
      gol_task: _gol_task
    })
    if (app.globalData.mobile == "") {
      //未设置电话号码
      wx.navigateTo({
        url: '../getphone/getphone',
      })
    } else {
      wx.navigateTo({
        url: '../detail/detail?id=' + task
      })
    }
  },
  redirectToresult: function () {
    var that = this;
    wx.redirectTo({
      url: '../receiveresult/receiveresult?channel=' + that.data.channel,
    })
    that.setData({
      mask: 0,
      mask_defult: 0
    });
  },
  redirectToDetail: function () {
    let task = this.data.gol_task;
    wx.redirectTo({
      url: '../detail/detail?id=' + task,
    });
  },
  Todetails:function(e){
    let that = this;
    if (this.ifNotSetIdentify()){
      that.last_taskid = e.currentTarget.dataset.task;
      for(let jj = 0;jj < that.data.tasks.length; jj ++){
        if (that.data.tasks[jj].id == that.last_taskid){
          that.last_taskindex = jj;
          break;
        }
      }
      console.log(that.data.tasks[that.last_taskindex].questionids)
      if (that.data.tasks[that.last_taskindex].questionids.length){
        wx.navigateTo({
          url: '../details/details?id=' + that.data.tasks[that.last_taskindex].questionids[0].questionid
        })
      }
      that.setData({
        total: e.currentTarget.dataset.total,
        last_taskid: e.currentTarget.dataset.task
      })
    }
  },
  Toreview:function(e){
    let that = this;
    that.last_taskid = e.currentTarget.dataset.task;
    let comps = that.data.tasks[that.last_taskindex].process_questionids;
    that.setData({
      total: e.currentTarget.dataset.total,
      last_taskid: e.currentTarget.dataset.task
    })
    wx.navigateTo({
      url: '../review/review?id=' + comps[0].questionid
    })
  },
  Tofavdetails:function(e){
    let that = this;
    console.log(that.data.collect_questions);
    if (that.data.collect_questions && that.data.collect_questions.length > 0){
      // 根据题id 获取当前题号
      let collect_questions = that.data.collect_questions;
      that.last_taskid = collect_questions[0].taskid;
      that.setData({
        last_taskid: collect_questions[0].taskid
      })
      wx.navigateTo({
        url: '../favdetails/favdetails?id=' + that.data.collect_questions[0].questionid
      })
    }else{
      wx.showToast({
        title: '暂无收藏',
        icon: 'none'
      })
      setTimeout(function () {
        wx.hideToast();
      }, 800)
    } 
  },
  Toranking:function(e){
    let that = this;
    // wx.getUserInfo({
    //   success: function (res) {
    //     app.globalData.userInfo = res.userInfo
    //   }
    // })
    if (that.data.rankings == 0){
      wx.showToast({
        title: '暂无排行',
        icon: 'none'
      })
      setTimeout(function () {
        wx.hideToast();
      }, 800)
    }else{
      wx.navigateTo({
        url: '../ranking/ranking'
      })
    }
    
  },
  switchsubject:function(e){
    if (this.ifNotSetIdentify()){
      wx.navigateTo({
        url: '../guide/guide',
      })
    }
  },
  getQuestionId: function (questionid,callback){
    let that = this;
    //获取需要背诵的id
    //已经记录了 taskid 到 last_taskid
    //直接调用后台接口返回
    //todo 前端缓存下来一部分题目，直接从缓存返回
    userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/recite_questions", { ids: questionid, taskid: that.data.last_taskid }, function (res1) {
      if (questionid in res1.data.data){
        callback(res1.data.data[questionid]);
      }else{
        callback(false);
      }
    });
  },
  completeQuestionId:function(questionid,callback){
    //完成背题
    let that = this;
    let questionids = that.data.tasks[that.last_taskindex].questionids;
    let process_num = that.data.tasks[that.last_taskindex].process_num;
    let comps = that.data.tasks[that.last_taskindex].process_questionids;
    let len = questionids.length;
    let ind = -1;
    for(let i=0;i<len;i++){
      if (questionids[i].questionid == questionid){
        ind = i;
        break;
      }
    }
    
    if (ind >= 0){
      let bakup_questionid = questionids[ind];
      questionids.splice(ind,1);
      if (!comps){
        comps = [];
      }
      comps.push(bakup_questionid);
      process_num++;
      var questionids_str = 'tasks[' + that.last_taskindex + '].questionids';
      var process_questionids_str = 'tasks[' + that.last_taskindex + '].process_questionids';
      var process_num_str = 'tasks[' + that.last_taskindex + '].process_num';
      
      that.setData({
        [questionids_str]: questionids,
        [process_num_str]: process_num,
        [process_questionids_str]: comps,
      });
      //调用后台的成功
      userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/recite_question_ok", { taskid: that.last_taskid, id: questionid}, function (res1) {
      });
      
      //返回下一个题目详情
      if (ind < questionids.length){
        return that.getQuestionId(questionids[ind].questionid, callback);
      }
    }
    callback(false);
  },
  ignoreQuestionId: function (questionid, callback){
    //跳过一道题
    let that = this;
    let questionids = that.data.tasks[that.last_taskindex].questionids;
    let len = questionids.length;
    let ind = -1;
    for (let i = 0; i < len; i++) {
      if (questionids[i].questionid == questionid) {
        ind = i;
        break;
      }
    }
    if (ind == len - 1) {
      wx.showToast({
        title: '已经是最后一题了',
        icon:'none'
      })
      setTimeout(function () {
        wx.hideToast();
      }, 800)
      return;
    }
    if (ind >= 0 && ind < len - 1) {
      return that.getQuestionId(questionids[ind + 1].questionid, callback);
    }
    callback(false);
  },

  // 复习已背下一道
  ignoreCompleteId: function (questionid, callback) {
    //跳过一道题
    let that = this;
    let comps = that.data.tasks[that.last_taskindex].process_questionids;
    let len = comps.length;
    let ind = -1;
    for (let i = 0; i < len; i++) {
      if (comps[i].questionid == questionid) {
        ind = i;
        break;
      }
    }
    if (ind == len - 1) {
      wx.showToast({
        title: '已经是最后一题了',
        icon: 'none'
      })
      setTimeout(function () {
        wx.hideToast();
      }, 800)
      return;
    }
    if (ind >= 0 && ind < len - 1) {
      return that.getQuestionId(comps[ind + 1].questionid,callback);
    } 
    callback(false);
    
  },

  // 复习已背上一道
  prevCompleteId: function (questionid, callback) {
    //跳过一道题
    let that = this;
    let comps = that.data.tasks[that.last_taskindex].process_questionids;
    let len = comps.length;
    let ind = -1;
    for (let i = 0; i < len; i++) {
      if (comps[i].questionid == questionid) {
        ind = i;
        break;
      }
    }
    if (ind == 0) {
      wx.showToast({
        title: '已经是第一道题了',
        icon: 'none'
      })
      setTimeout(function () {
        wx.hideToast();
      }, 800)
      return;
    }
    if (ind >= 0 && ind < len) {
      return that.getQuestionId(comps[ind - 1].questionid, callback);
    }
    callback(false);

  },

  // 收藏下一道
  favnextId: function (questionid, callback) {
    //跳过一道题
    let that = this;
    let questionids = that.data.collect_questions;
    let len = questionids.length;
    let ind = -1;
    for (let i = 0; i < len; i++) {
      if (questionids[i].questionid == questionid) {
        ind = i;
        break;
      }
    }
    if (ind == len - 1) {
      wx.showToast({
        title: '已经是最后一题了',
        icon: 'none'
      })
      setTimeout(function () {
        wx.hideToast();
      }, 800)
      return;
    }
    if (ind >= 0 && ind < len - 1) {
      that.setData({
        last_taskid: questionids[ind + 1].taskid
      })
      return that.getQuestionId(questionids[ind + 1].questionid, callback);
    }
    callback(false);
  },
  // 复习已背上一道
  favprevId: function (questionid, callback) {
    //跳过一道题
    let that = this;
    let questionids = that.data.collect_questions;
    let len = questionids.length;
    let ind = -1;
    for (let i = 0; i < len; i++) {
      if (questionids[i].questionid == questionid) {
        ind = i;
        break;
      }
    }
    if (ind == 0) {
      wx.showToast({
        title: '已经是第一道题了',
        icon: 'none'
      })
      setTimeout(function () {
        wx.hideToast();
      }, 800)
      return;
    }
    if (ind >= 0 && ind < len) {
      that.setData({
        last_taskid: questionids[ind - 1].taskid
      })
      return that.getQuestionId(questionids[ind - 1].questionid, callback);
    }
    callback(false);
  },

  //点击大礼包
  clickBomb: function (e) {
    var that = this;
    if (app.globalData.mobile == "") {
      //未设置电话号码
      wx.navigateTo({
        url: '../getphone/getphone?popid=1',
      }) 
    }else{
      wx.navigateTo({
        url: '../receiveresult/receiveresult?channel=' + that.data.channel,
      })
      that.setData({
        mask: 0,
        mask_defult: 0
      });
    }
  },
  // 点击领取现金
  clickReceive: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../receiveresult/receiveresult?channel=' + that.data.channel+"&receive=1",
    })
  },
  //点击默认弹窗
  clickBombdefult: function (e) {
    var that = this;
    if (that.data.maskdata.path == 'draw/draw'){
      that.Todraw();
    }
    if (that.data.maskdata.getphone == 1 && app.globalData.mobile == "") {
      that.getphone.path = that.data.maskdata.path;
      that.getphone.title = that.data.maskdata.title;
      that.getphone.open_type = that.data.maskdata.open_type;
      //未设置电话号码
      wx.navigateTo({
        url: '../getphone/getphone?popid=3',
      })
    } else {
      userApi.gotoActivityPage(that.data.maskdata.path, that.data.maskdata.title, that.data.maskdata.open_type, function () {
        that.setData({
          mask: 0,
          mask_defult: 0
        });
      });
    }
    
  },
  // 关闭弹窗
  close_mask: function () {
    var that = this;
    that.setData({
      mask: 0,
      mask_defult: 0
    });
  },
  //点击banner
  clickBanner: function (e) {
    var that = this;
    if (that.data.imgUrls[e.currentTarget.dataset.index].getphone == 1 && app.globalData.mobile == ""){
      that.getphone.path = that.data.imgUrls[e.currentTarget.dataset.index].path;
      that.getphone.title = that.data.imgUrls[e.currentTarget.dataset.index].title;
      that.getphone.open_type = that.data.imgUrls[e.currentTarget.dataset.index].open_type;
      //未设置电话号码
      wx.navigateTo({
        url: '../getphone/getphone?popid=3', 
      }) 
    }else{
      userApi.gotoActivityPage(that.data.imgUrls[e.currentTarget.dataset.index].path, that.data.imgUrls[e.currentTarget.dataset.index].title, that.data.imgUrls[e.currentTarget.dataset.index].open_type, function () {

      });
    }
  },
  // 点击模块
  clickRouter: function (e) {
    var that = this;
    if (that.data.routers[e.currentTarget.dataset.pindex][e.currentTarget.dataset.index].getphone == 1 && app.globalData.mobile == "") {
      that.getphone.path = that.data.routers[e.currentTarget.dataset.pindex][e.currentTarget.dataset.index].path;
      that.getphone.title = that.data.routers[e.currentTarget.dataset.pindex][e.currentTarget.dataset.index].title;
      that.getphone.open_type = that.data.routers[e.currentTarget.dataset.pindex][e.currentTarget.dataset.index].open_type;
      //未设置电话号码
      wx.navigateTo({
        url: '../getphone/getphone?popid=3',
      })
    } else {
      userApi.gotoActivityPage(that.data.routers[e.currentTarget.dataset.pindex][e.currentTarget.dataset.index].path, that.data.routers[e.currentTarget.dataset.pindex][e.currentTarget.dataset.index].title, that.data.routers[e.currentTarget.dataset.pindex][e.currentTarget.dataset.index].open_type, function () {

      });
    }
    
  },

  submitformid:function(e){
    var that = this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/matrix_formid", {
      formid: e.detail.formId
    }, function (res) {
      that.gotoTaskDetail(e.detail.value.task);
    });
  },

  // 锦鲤送祝福
  Todraw:function(e){
    var that = this;
    if (app.globalData.nickname == "" || app.globalData.avatar == "") {
      //未设置电话号码
      wx.navigateTo({
        url: '../getuserinfo/getuserinfo?id=1',
      })
    } else {
      wx.navigateTo({
        url: '../draw/draw',
      })
      that.setData({
        mask_defult: 0,
        mask:0
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
  redirectTodraw: function () {
    wx.redirectTo({
      url: '../draw/draw',
    });
    that.setData({
      mask_defult: 0,
      mask: 0
    });
  },
  playvideo:function(e){
    wx.navigateTo({
      url: '../videoplay/videoplay?index=' + e.currentTarget.dataset.index,
    })
  },
  moreques:function(e){
    wx.navigateTo({
      url: '../moreques/moreques?levelid=' + e.currentTarget.dataset.levelid,
    })  
  }
})