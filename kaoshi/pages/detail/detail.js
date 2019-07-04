// pages/detail/detail.js
const app = getApp()
const userApi = require('../../libraries/user.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    clientHeight:0,
    fixedHeight:44 + 49,
    questions:[],
    questions_num: 0,
    dones:[],
    dones_num:0,
    is_loadingmore: 0,
    loadingmore_text: '正在加载',
    reciteBox:'',
    curSwiperItem0:0,
    curSwiperItem1:0,
    q_type:1,
    is_loaded:0
  },
  variables:{
    curIndex: 0,
    lastTabIndex: 0,
    taskid: 2,
    questionTypes:{
      1 : "单选题",
      2 : "多选题",
      3 : "判断题",
      4 : "辨析题",
      5 : "简答题",
      6 : "作文题",
      7 : "单选挖空版",
      8 : "不定项材料分析题",
      9 : "活动设计题",
      10 : "名词解释",
      11 : "材料分析题",
      12 : "论述题",
      13 : "不定项选择题",
      14 : "公文改错题",
      15 : "教学设计题",
      16 : '判断简析题',
      17 : '结构化问答',
      18 : '试讲答辩',
      19 : '说课答辩',
      20 : '专业技能测试'
    },
    replyOptions:[]
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
  analyseBlank: function (orders) {
    let child_title = {};
    child_title.name = 'span';
    child_title.attrs = {};
    child_title.children = [];
    child_title.children.push({ type: 'text', text: orders + '.' });
    return child_title;
  },
  analyseQuType: function (qutype_text) {
    let child_title = {};
    child_title.name = 'span';
    let attr = 'padding:3px 4px;color: #3eccb3;border: 1px solid #3eccb3;font-size:12px;margin-right:10px;border-radius:3px;';
    child_title.attrs = { style: attr};
    child_title.children = [];
    child_title.children.push({ type: 'text', text: qutype_text });
    return child_title;
  },
  //展示一道题
  showQuestion: function (datas) {
    if (!datas) return;
    // console.log(datas);
    let that = this;
    var question = {};
    //题型
    question.id = datas.id;
    question.type = datas.type;
    question.orders = datas.orders;
    question.isremember = datas.isremember;
    //题目题干
    let arr_title = this.analyseOneNode(datas.title);
    arr_title.unshift(this.analyseBlank(datas.orders));
    arr_title.unshift(this.analyseQuType(question.type in that.variables.questionTypes ? that.variables.questionTypes[question.type] : '未知' ) );
    
    question.arr_title = arr_title;
    
    //答案
    question.answer = datas.answer;
    question.arr_item_a = this.analyseOneNode(datas.item_a);
    question.arr_item_b = this.analyseOneNode(datas.item_b);
    question.arr_item_c = this.analyseOneNode(datas.item_c);
    question.arr_item_d = this.analyseOneNode(datas.item_d);
    question.arr_item_e = this.analyseOneNode(datas.item_e);
    question.arr_questionanalysis = this.analyseOneNode(datas.questionanalysis);
    question.arr_skill = this.analyseOneNode(datas.skill);
    question.fav = datas.fav;
    question.article_id = datas.map_article_id;
    question.comments = [];
    question.max_comment_id = 0;
    question.loaded_comments = 0;
    question.reciteBox = '';
    //collect_icon: '../../images/zgzbd/or_collect.png'
    //collect_icon: '../../images/zgzbd/collect.png'
    // console.log(question);
    return question;
  },
  getQuestionComments(t, cur){
    let that = this;
    if (t == 0){
      //未背过
      if (that.data.questions[cur]) {
        that.setData({
          q_type: that.data.questions[cur].type
        })
        that.variables.curIndex = cur;
        if (that.data.questions[cur].loaded_comments == 0) {
          userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/article_comments", { article_id: that.data.questions[cur].article_id, inf_id: 0 }, function (res) {
            if (res.data.data && res.data.data.length){
              var reply_list_str = 'questions[' + cur + '].comments';
              var loaded_list_str = 'questions[' + cur + '].loaded_comments';
              let max_list_str = 'questions[' + cur + '].max_comment_id';
              that.setData({
                [reply_list_str]: res.data.data,
                [loaded_list_str]: 1,
                [max_list_str]: res.data.data[res.data.data.length - 1].id,
              });
            }
          });
        }
      }
    }else{
      //已背过
      if (that.data.dones[cur]) {
        that.setData({
          q_type: that.data.dones[cur].type
        })
        that.variables.curIndex = cur;
        if (that.data.dones[cur].loaded_comments == 0) {
          userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/article_comments", { article_id: that.data.dones[cur].article_id, inf_id: 0 }, function (res) {
            if (res.data.data && res.data.data.length) {
              var reply_list_str = 'dones[' + cur + '].comments';
              var loaded_list_str = 'dones[' + cur + '].loaded_comments';
              let max_list_str = 'dones[' + cur + '].max_comment_id';
              that.setData({
                [reply_list_str]: res.data.data,
                [loaded_list_str]: 1,
                [max_list_str]: res.data.data[res.data.data.length - 1].id,
              });
            }
          });
        }
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.id) {
      that.variables.taskid = options.id;
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
         clientHeight: res.windowHeight - that.data.fixedHeight
        });
      }
    });
    wx.showLoading({
      title: '正在加载',
    })
    userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/recite_taks_questions", { taskid: that.variables.taskid }, function (res) {
      if (res.data.data.dones && res.data.data.dones.length){
        let ids1 = [];
        for (let m = 0; m < res.data.data.dones.length;m++){
          ids1.push(res.data.data.dones[m].questionid);
        }
        userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/recite_questions", { taskid: that.variables.taskid,ids: ids1.join(',') }, function (res1) {
          let qus = [];
          let loop = 0;
          for (let j in res1.data.data) {
            res1.data.data[j].isremember=1;
            res1.data.data[j].orders = res.data.data.dones[loop].orders;
            let qu = that.showQuestion(res1.data.data[j]);
            loop++;
            qus.push(qu);
          }
          that.setData({
            dones: qus,
            dones_num: qus.length
          });
        });
      }
      if (res.data.data.ids && res.data.data.ids.length) {
        let ids2 = [];
        let task_questions = res.data.data.ids;
        for (let n = 0; n < task_questions.length; n++) {
          ids2.push(task_questions[n].questionid);
        }
        userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/recite_questions", { taskid: that.variables.taskid,ids: ids2.join(',') }, function (res2) {
          let qus = [];
          let loop = 0;
          for (let j in res2.data.data){
            res2.data.data[j].isremember = 0;
            res2.data.data[j].orders = task_questions[loop].orders;
            let qu = that.showQuestion(res2.data.data[j]);
            loop ++;
            qus.push(qu);
          }
          that.setData({
            questions: qus,
            questions_num: qus.length,
            is_loaded: 1
          },function(){
            wx.hideLoading({});
            that.getQuestionComments(0, 0);
          });
        });
      }else{
        wx.hideLoading({});
        that.setData({
          is_loaded: 1
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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
  },
  onLower: function (e) {
    var that = this;
    that.setData({
      is_loadingmore: 1,
      loadingmore_text: '正在加载'
    });
    let t = that.data.currentTab;
    let cur = that.variables.curIndex;
    if (t == 0) {
      //未背过
      if (that.data.questions[cur]) {
        let comments = that.data.questions[cur].comments;
        let inf_id = that.data.questions[cur].max_comment_id;
        userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/article_comments", { article_id: that.data.questions[cur].article_id, inf_id: inf_id }, function (res) {
          if (res.data.data && res.data.data.length) {
            if (!comments){
              comments = [];
            }
            for (let j = 0; j < res.data.data.length;j++){
              comments.push(res.data.data[j]);
            }
            var reply_list_str = 'questions[' + cur + '].comments';
            let max_list_str = 'questions[' + cur + '].max_comment_id';
            that.setData({
              [reply_list_str]: comments,
              [max_list_str]: res.data.data[res.data.data.length - 1].id,
              is_loadingmore: 0,
              loadingmore_text: '加载完成'
            });
          }else{
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
      }
    }else{
      if (that.data.dones[cur]) {
        let comments = that.data.dones[cur].comments;
        let inf_id = that.data.dones[cur].max_comment_id;
        userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/article_comments", { article_id: that.data.dones[cur].article_id, inf_id: inf_id }, function (res) {
          if (res.data.data && res.data.data.length) {
            if (!comments) {
              comments = [];
            }
            for (let j = 0; j < res.data.data.length; j++) {
              comments.push(res.data.data[j]);
            }
            var reply_list_str = 'dones[' + cur + '].comments';
            let max_list_str = 'dones[' + cur + '].max_comment_id';
            that.setData({
              [reply_list_str]: comments,
              [max_list_str]: res.data.data[res.data.data.length - 1].id,
              is_loadingmore: 0,
              loadingmore_text: '加载完成'
            });
          }else{
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
      }
    }
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
      title: '教师招聘笔试？先这儿背题看看',
      path: '/pages/home/home',
      success: function (res1) {
        var scene = 10007;
        if (res1.shareTickets != undefined) {
          scene = 10044;
        }
        // userApi.requestAppApi_POST(app.globalData.mainDomain + "/ApiNlpgbg/xcx_share_stat", {
        //   scene: app.globalData.scene, openid: app.globalData.openId
        // }, function (shres) {

        // });
        // 转发成功,通过res1.shareTickets[0]获取转发ticket
      },
      fail: function (res1) {
        // 转发失败
        //console.log(res1);
      }
    }
  },
  //点击切换
  changeToTab:function(toTab){
    var that = this;
    if (that.data.currentTab === toTab) {
      return false;
    } else {
      that.setData({
        currentTab: toTab
      })
    }

    //当前的和上一个的
    let last = that.variables.lastTabIndex;
    that.variables.lastTabIndex = that.variables.curIndex;  //记录下上一个
    if (last == 0){
      this.getQuestionComments(toTab, 0);
    }else{
      that.variables.curIndex = last;
    }
  },
  clickTab: function (e) {
    let toTab = e.target.dataset.current;
    this.changeToTab(toTab);
  },
  swiperTab1: function (e) {
    this.getQuestionComments(0, e.detail.current);
    this.data.curSwiperItem0 = e.detail.current;
  },
  swiperTab2:function(e){
    this.getQuestionComments(1, e.detail.current);
    this.data.curSwiperItem1 = e.detail.current;
  },
  recite: function (e) {
    let that = this;
    let t = that.data.currentTab;
    let cur = that.variables.curIndex;
    let arrs = false;
    let reply_list_str = '';
    let reply_list_str_box = '';
    let questionid = 0;
    let _type =0;
    
    if (t == 0){
      if (that.data.questions[cur]) {
        if (that.data.questions[cur].arr_questionanalysis.length){
          arrs = that.data.questions[cur].arr_questionanalysis;
          reply_list_str = 'questions[' + cur + '].arr_questionanalysis';
          reply_list_str_box = 'questions[' + cur + '].reciteBox';
          questionid = that.data.questions[cur].id;
        }
        _type = that.data.questions[cur].type;
      }
    }else{
      if (that.data.dones[cur]) {
        if (that.data.dones[cur].arr_questionanalysis.length) {
          arrs = that.data.dones[cur].arr_questionanalysis;
          reply_list_str = 'dones[' + cur + '].arr_questionanalysis';
          reply_list_str_box = 'dones[' + cur + '].reciteBox';
          questionid = that.data.dones[cur].id;
        }
        _type = that.data.dones[cur].type;
      }
    }
    console.log(arrs);
    if (arrs){
      for (let j = 0; j < arrs.length; j++) {
        if (arrs[j].name == "span") {
          if (arrs[j].attrs.style && arrs[j].attrs.style.indexOf('border-bottom') >= 0) {
            //.get('text-decoration')
            //arrs[j].attrs.style.replace(/ff4a4a/g, "fff");
            arrs[j].attrs.style = "padding-bottom:1px;border-bottom:1px solid #333;color:#fcfcfc;";
          }
        }
      }
      if (_type == 7){
        that.setData({
          [reply_list_str]: arrs,
          [reply_list_str_box]: 0,
        });
      }else{
        that.setData({
          [reply_list_str]: arrs
        });
      }
      
    }
  },
  reciteEnd: function (e) {
    let that = this;
    let t = that.data.currentTab;
    let cur = that.variables.curIndex;
    let arrs = false;
    let reply_list_str = '';
    let reply_list_str_box = '';
    let questionid = 0;
    if (t == 0) {
      if (that.data.questions[cur]) {
        if (that.data.questions[cur].arr_questionanalysis.length) {
          arrs = that.data.questions[cur].arr_questionanalysis;
          reply_list_str = 'questions[' + cur + '].arr_questionanalysis';
          reply_list_str_box = 'questions[' + cur + '].reciteBox';
          questionid = that.data.questions[cur].id;
        }
      }
    } else {
      if (that.data.dones[cur]) {
        if (that.data.dones[cur].arr_questionanalysis.length) {
          arrs = that.data.dones[cur].arr_questionanalysis;
          reply_list_str = 'dones[' + cur + '].arr_questionanalysis';
          reply_list_str_box = 'dones[' + cur + '].reciteBox';
          questionid = that.data.dones[cur].id;
        }
      }
    }
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
        [reply_list_str]: arrs,
        //[reply_list_str_box]: '',
      });
    }
  },
  jumpnext: function (e) {
    let that = this;
    let t = that.data.currentTab;
    let cur = that.variables.curIndex;
    if (t == 0) {
      if (that.data.questions.length > cur+1){
        //that.getQuestionComments(0, cur + 1);
        //that.variables.curIndex = cur + 1;
        that.setData({
          curSwiperItem0: cur + 1
        });
      }else{
        wx.showModal({
          title: '提示',
          content: '已经是最后一题，继续看未背题目吗？',
          showCancel: true,
          success: function (res) {
            if (res.confirm) {
              that.setData({
                curSwiperItem0: 0
              })
              that.variables.curIndex = 0;
            }
          }
        });
      }
    }else{
      if (that.data.dones.length > cur + 1) {
        //that.getQuestionComments(1, cur + 1);
        //that.variables.curIndex = cur + 1;
        that.setData({
          curSwiperItem1: cur + 1
        });
      } else {
        wx.showModal({
          title: '提示',
          content: '已经是最后一题，返回吗？',
          showCancel: true,
          success: function (res) {
            if (res.confirm) {
              if (res.confirm) {
                that.setData({
                  curSwiperItem1: 0
                })
                that.variables.curIndex = 0;
              }
            }
          }
        });
      }
    }
  },
  remember: function (e) {
    let that = this;
    let t = that.data.currentTab;
    let cur = that.variables.curIndex;
    if (t == 0){
      if (that.data.questions[cur]) {
        let questionid = that.data.questions[cur].id;
        //调用后台的成功
        userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/recite_question_ok", { taskid: that.variables.taskid, id: questionid }, function (res1) {
        });
        
        that.data.questions[cur].isremember = 1;
        let _dones = that.data.dones;
        let _questions = that.data.questions;
        _dones.push(that.data.questions[cur]);
        _questions.splice([cur],1);
        let _dones_num = that.data.dones_num +1;
        let _questions_num = that.data.questions_num -1;
        if (cur < that.data.questions.length - 1){
          that.setData({
            curSwiperItem0: cur,
            dones: _dones,
            questions: _questions,
            dones_num: _dones_num,
            questions_num: _questions_num
          });
        }else{
          if (_questions_num == 0){
            wx.showModal({
              title: '提示',
              content: '题目已背完，返回吗？',
              showCancel: true,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({

                  });
                }
              }
            });
          }else{
            wx.showModal({
              title: '提示',
              content: '已经是最后一题，继续看未背题目吗？',
              showCancel: true,
              success: function (res) {
                if (res.confirm) {
                  that.setData({
                    curSwiperItem0:0
                  })
                  that.variables.curIndex = 0;
                }
              }
            });
          }
          
        }
      }
    }
  },
  gotoWbg: function(e){
    this.changeToTab(0);
  },
  gotoYbg: function (e) {
    this.changeToTab(1);
  },
  //获取昵称后去评论
  redirectToReplay: function(){
    let options = this.variables.replyOptions;
    wx.redirectTo({
      url: '../addcomment/addcomment?id=' + options.articleid + '&rid=' + options.replyid + '&to=' + options.to,
    });
  },
  //跳转到去评论的窗口
  gotoReply: function(options) {
    this.variables.replyOptions = options;
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
  updateReplyData: function(comment) {
    let that = this;
    let t = that.data.currentTab;
    let cur = that.variables.curIndex;
    let commentlist = [];
    let maxcomment_text = '';
    let comment_text = '';
    if (t == 0) {
      comment_text = 'questions[' + cur + '].comments';
      maxcomment_text = 'questions[' + cur + '].max_comment_id';
      commentlist = that.data.questions[cur].comments;
    } else {
      comment_text = 'dones[' + cur + '].comments';
      maxcomment_text = 'dones[' + cur + '].max_comment_id';
      commentlist = that.data.dones[cur].comments;
    }
    if (commentlist == undefined || commentlist.length == 0) {
      commentlist = [];
    }
    commentlist.unshift(comment);
    that.setData({
      [comment_text]: commentlist,
      [maxcomment_text]: comment.id,
    });
  },
  addcomment:function(e){
    let that = this;
    let t = that.data.currentTab;
    let cur = that.variables.curIndex;
    let articleid = 0;
    if (t == 0) {
      if (that.data.questions[cur]) {
        articleid = that.data.questions[cur].article_id;
      }
    } else {
      if (that.data.dones[cur]) {
        articleid = that.data.dones[cur].article_id;
      }
    }
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
    let t = that.data.currentTab;
    let cur = that.variables.curIndex;
    let articleid = 0;
    
    if (t == 0){
      if (that.data.questions[cur]){
        articleid = that.data.questions[cur].article_id;
      }
    }else{
      if (that.data.dones[cur]) {
        articleid = that.data.dones[cur].article_id;
      }
    }
  
    if(articleid > 0){
      this.gotoReply({
        articleid: articleid,
        replyid: e.detail.id,
        to: e.detail.uname
      });
    }
  },
  onDianzanEvent: function (e) {
    var that = this;
    var like = e.detail.like;
    var likes = e.detail.likes;
    var cindex = e.detail.cindex;
    var cid = e.detail.id;

    let t = that.data.currentTab;
    let cur = that.variables.curIndex;
    let isliked_text = '';
    let likes_text = '';
    if (t == 0) {
      isliked_text = 'questions[' + cur + '].comments[' + cindex + '].isliked';
      likes_text = 'questions[' + cur + '].comments[' + cindex + '].likes';
    }else{
      isliked_text = 'dones[' + cur + '].comments[' + cindex + '].isliked';
      likes_text = 'dones[' + cur + '].comments[' + cindex + '].likes';
    }
    
    if (like > 0) {
      userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/article_like_del", { comment_id: cid }, function (res) {
        that.setData({
          [isliked_text]: 0,
          [likes_text]: --likes
        });
      });
    } else {
      userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/article_like_add", { comment_id: cid }, function (res) {
        that.setData({
          [isliked_text]: 1,
          [likes_text]: ++likes
        });
      });
    }
  },
  // 添加收藏
  collect: function (e) {
    let that = this;
    let id = 0;
    let t = that.data.currentTab;
    let cur = that.variables.curIndex;
    if(t==0){
      id = that.data.questions[cur].id;
    }else{
      id = that.data.dones[cur].id;
    }
    userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/fav_questions", {
      id: id
    }, function (res) {
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
      if (res.data.code == 200) {
        let _fav;
        if (t == 0) {
          _fav = 'questions[' + cur + '].fav'; 
        } else {
          _fav = 'dones[' + cur + '].fav'; 
        }
        that.setData({
          [_fav]: 1
        })
      }
      setTimeout(function () {
        wx.hideToast();
      }, 800)
    });
  },
  // 取消收藏
  canclefav: function (e) {
    let that = this;
    let id = 0;
    let t = that.data.currentTab;
    let cur = that.variables.curIndex;
    if (t == 0) {
      id = that.data.questions[cur].id;
    } else {
      id = that.data.dones[cur].id;
    }
    userApi.requestAppApi_POST(app.globalData.mainDomain + "ZpXcxApi/cancel_fav_question", {
      id: id
    }, function (res) {
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
      if (res.data.code == 200) {
        let _fav;
        if (t == 0) {
          _fav = 'questions[' + cur + '].fav';
        } else {
          _fav = 'dones[' + cur + '].fav';
        }
        that.setData({
          [_fav]: 0
        })
      }
      setTimeout(function () {
        wx.hideToast();
      }, 800)
    });
  },
})