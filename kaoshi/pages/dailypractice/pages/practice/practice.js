// pages/practice/practice/index.js
const app = getApp();
const userApi = require('../../../../libraries/user.js');
var otherans = '';
var interval;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    interval: 3000,
    duration: 500,
    current: 0, //主动设置swiper页面
    swpIndex: 0, //记录实际的当前swiper页面
    jobid: 0,
    items : [],
    itemsSelected : [],
    answers:[],
    correct_answer:[],
    allpage:0,
    answerpage:0,
    starttime:'',
    countDownHour: 0,
    countDownMinute: '00',
    countDownSecond: '00',
    winWidth: 0,
    winHeight: 0,
    scrollHeight:0,
    SDKVersion:'1.5.0',
    cart_hide: 'cart_hide',
    result:'',
    correct_rate:'',
    examanalysis:{},
    practietype:1,
    result_tip:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    var newids = [];
    var jobid = 0;
    jobid = options.id;
    var practietype = '';
    if (options.practietype){
      practietype = options.practietype;
    }
    
    // jobid = 8;
    that.setData({
      winWidth: app.globalData.systemInfo.windowWidth,
      winHeight: app.globalData.systemInfo.windowHeight,
      scrollHeight: app.globalData.systemInfo.windowHeight - 100,
      SDKVersion: app.globalData.systemInfo.SDKVersion,
      jobid: jobid,
      practietype: practietype
    });
    
    wx.setNavigationBarTitle({
      title: '诊断'
    })
    // 试卷中题目ID
    // var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1];   //当前页面
    // var prevPage = pages[pages.length - 2];  //上一个页面
    // var questionids = prevPage.data.details.questionids.split(',');
    // console.log(questionids);
    // var ids = new Array(questionids.length);
    // for (var i = 0; i < questionids.length; i++) {
    //   ids[i] = { id: questionids[i], ques: [], ans: [0, 0, 0, 0, 0, 0], ans_txt: '' };
    // }
    // that.setData({
    //   items: ids,
    //   allpage: ids.length
    // }, function () {
      
    // });
    that.start();
    that.getQuestions();
  },
  getQuestions: function() {
    var that = this;
    
    wx.showLoading({
      title: '正在加载题目',
    });
    var url = ''
    if (that.data.practietype == 1){
      url = 'LxzgzXcxApi/dk_question';
    } else if (that.data.practietype == 2){
      url = 'LxzgzXcxApi/konwleage_diagnose'
    }
    
    // 获取题
    userApi.requestAppApi_POST(app.globalData.mainDomain + url,
      { id: that.data.jobid },
      function (res) {
        console.log(res.data.data);
        if (that.data.practietype == 1) {
          var datas = res.data.data;
        } else if (that.data.practietype == 2) {
          var datas = res.data.data.data;
        }
        
        var ids = new Array(datas.length);
        for (var i = 0; i < datas.length; i++) {
          ids[i] = { id: datas[i].id, ques: [], ans: [0, 0, 0, 0, 0, 0], ans_txt: '' };
        }
        that.setData({
          items: ids,
          allpage: ids.length
        });
        var _items = that.data.items;
        let _allpage = that.data.allpage;
        for (let il = 0; il < datas.length; il++) {
          // 题目题干
          var arr_title=[];
          for (var ii = 0; ii < datas[il].title.length; ii++){
            var child_title = {};
            if (datas[il].title[ii].type == 'txt') {
              child_title.name = 'span';
              if (datas[il].title[ii].size != '14' || datas[il].title[ii].color != '#000000'){
                child_title.attrs = { style: 'font-size:' + datas[il].title[ii].size + 'px;color:' + datas[il].title[ii].color };
              }else{
                child_title.attrs = {};
              }
              child_title.children = [];
              child_title.children.push({ type: 'text', text: datas[il].title[ii].content });
            } else if (datas[il].title[ii].type == 'img') {
              child_title.name = 'img';
              child_title.attrs = {};
              child_title.attrs.src = datas[il].title[ii].src;
              child_title.attrs.style = "width:100%;";
            } else if (datas[il].title[ii].type == 'br'){
              child_title.name = 'br';
            } 
            arr_title.push(child_title);
          }
          
          datas[il].arr_title = arr_title;

          if (datas[il].item_a) {
            // 答案A
            var arr_item_a = [];
            var child_item_a = {};
            if (datas[il].item_a[0].type == 'txt') {
              child_item_a.name = 'span';
              child_item_a.attrs = {};
              child_item_a.children = [];
              child_item_a.children.push({ type: 'text', text: datas[il].item_a[0].content });
            } else if (datas[il].item_a[0].type == 'img') {
              child_item_a.name = 'img';
              child_item_a.attrs = {};
              child_item_a.attrs.src = datas[il].item_a[0].src;
              child_item_a.attrs.style = "width:100%;";
            }
            arr_item_a.push(child_item_a);
            datas[il].arr_item_a = arr_item_a;
          }

          if (datas[il].item_b) {
            // 答案B
            var arr_item_b = [];
            var child_item_b = {};
            if (datas[il].item_b[0].type == 'txt') {
              child_item_b.name = 'span';
              child_item_b.attrs = {};
              child_item_b.children = [];
              child_item_b.children.push({ type: 'text', text: datas[il].item_b[0].content });
            } else if (datas[il].item_b[0].type == 'img') {
              child_item_b.name = 'img';
              child_item_b.attrs = {};
              child_item_b.attrs.src = datas[il].item_b[0].src;
              child_item_b.attrs.style = "width:100%;";
            }
            arr_item_b.push(child_item_b);
            datas[il].arr_item_b = arr_item_b;
          }

          if (datas[il].item_c) {
            // 答案C
            var arr_item_c = [];
            var child_item_c = {};
            if (datas[il].item_c[0].type == 'txt') {
              child_item_c.name = 'span';
              child_item_c.attrs = {};
              child_item_c.children = [];
              child_item_c.children.push({ type: 'text', text: datas[il].item_c[0].content });
            } else if (datas[il].item_c[0].type == 'img') {
              child_item_c.name = 'img';
              child_item_c.attrs = {};
              child_item_c.attrs.src = datas[il].item_c[0].src;
              child_item_c.attrs.style = "width:100%;";
            }
            arr_item_c.push(child_item_c);
            datas[il].arr_item_c = arr_item_c;
          }

          if (datas[il].item_d) {
            // 答案D
            var arr_item_d = [];
            var child_item_d = {};
            if (datas[il].item_d[0].type == 'txt') {
              child_item_d.name = 'span';
              child_item_d.attrs = {};
              child_item_d.children = [];
              child_item_d.children.push({ type: 'text', text: datas[il].item_d[0].content });
            } else if (datas[il].item_d[0].type == 'img') {
              child_item_d.name = 'img';
              child_item_d.attrs = {};
              child_item_d.attrs.src = datas[il].item_d[0].src;
              child_item_d.attrs.style = "width:100%;";
            }
            arr_item_d.push(child_item_d);
            datas[il].arr_item_d = arr_item_d;
          }

          if (datas[il].item_e) {
            // 答案e
            var arr_item_e = [];
            var child_item_e = {};
            if (datas[il].item_e[0].type == 'txt') {
              child_item_e.name = 'span';
              child_item_e.attrs = {};
              child_item_e.children = [];
              child_item_e.children.push({ type: 'text', text: datas[il].item_e[0].content });
            } else if (datas[il].item_d[0].type == 'img') {
              child_item_e.name = 'img';
              child_item_e.attrs = {};
              child_item_e.attrs.src = datas[il].item_e[0].src;
              child_item_e.attrs.style = "width:100%;";
            }
            arr_item_e.push(child_item_e);
            datas[il].arr_item_e = arr_item_e;
          }

          if (datas[il].item_f) {
            // 答案f
            var arr_item_f = [];
            var child_item_f = {};
            if (datas[il].item_f[0].type == 'txt') {
              child_item_f.name = 'span';
              child_item_f.attrs = {};
              child_item_f.children = [];
              child_item_f.children.push({ type: 'text', text: datas[il].item_f[0].content });
            } else if (datas[il].item_f[0].type == 'img') {
              child_item_f.name = 'img';
              child_item_f.attrs = {};
              child_item_f.attrs.src = datas[il].item_f[0].src;
              child_item_f.attrs.style = "width:100%;";
            }
            arr_item_f.push(child_item_f);
            datas[il].arr_item_f = arr_item_f;    
          }

          if (datas[il].questionanalysis) {
            // 解析
            var arr_questionanalysis = [];
            var child_questionanalysis = {};
            if (datas[il].questionanalysis[0].type == 'txt') {
              child_questionanalysis.name = 'span';
              child_questionanalysis.attrs = {};
              child_questionanalysis.children = [];
              child_questionanalysis.children.push({ type: 'text', text: datas[il].questionanalysis[0].content });
            } else if (datas[il].questionanalysis[0].type == 'img') {
              child_questionanalysis.name = 'img';
              child_questionanalysis.attrs = {};
              child_questionanalysis.attrs.src = datas[il].questionanalysis[0].src;
              child_questionanalysis.attrs.style = "width:100%;";
            }
            arr_questionanalysis.push(child_questionanalysis);
            datas[il].arr_questionanalysis = arr_questionanalysis;
          }
          _items[il].ques = datas[il];
        }
        console.log(_items);
        that.setData({
          items: _items
        });
        wx.hideLoading();
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
  * 用户点击右上角分享
  */
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: that.data.description.title,
      path: '/pages/exam/examdetail/examdetail?id=' + that.data.examid,
      success: function (res1) {
        var scene = 10007;
        if (res1.shareTickets != undefined) {
          scene = 10044;
        }
       
        // 转发成功,通过res1.shareTickets[0]获取转发ticket
      },
      fail: function (res1) {
        // 转发失败
        //console.log(res1);
      }
    }
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
   * 答题点击事件
   */
  swipclick: function (e) {
    var that = this;
    let _ai = e.currentTarget.dataset.anindex;
    let _i = e.currentTarget.dataset.index;
    let ans = that.data.items[_i].ans;
    let datastr = 'items[' + _i + '].ans';
    let selectans = e.currentTarget.dataset.answer;
    let _selectedans = 'items[' + _i + '].ans_txt';
    let _answerpage = that.data.answerpage;
    let _type = e.currentTarget.dataset.type;
    if (_type == 1 || _type == 3){
      if (ans[_ai] > 0) {
        //取消选中
        ans[_ai] = 0;
        _answerpage--;
        that.setData({
          [datastr]: ans,
          answerpage: _answerpage,
          [_selectedans]: ''
        });
      } else {
        //选择答案
        ans = [0, 0, 0, 0, 0, 0];
        ans[_ai] = 1;
        _answerpage++;
        console.log(that.data.SDKVersion);
        if (that.data.SDKVersion >= '1.5.0') {
          that.setData({
            [datastr]: ans,
            answerpage: _answerpage,
            [_selectedans]: selectans
          }, function () {
            setTimeout(function () {
              that.setData({
                current: _i + 1,
                swpIndex: _i + 1
              });
            }, 200);
          });
        } else {
          that.setData({
            [datastr]: ans,
            answerpage: _answerpage,
            [_selectedans]: selectans,
            current: _i + 1,
            swpIndex: _i + 1
          });
        }
      }
    } else if (_type == 2){
      //多项选择题选择答案
      if (that.data.items[_i].ans_txt){
        otherans = that.data.items[_i].ans_txt;
      }
      if (ans[_ai]) {
        ans[_ai] = 0;
        otherans = otherans.replace(selectans, '');
      } else {
        ans[_ai] = 1;
        otherans += selectans;
      }
      console.log(otherans);
      that.setData({
        [datastr]: ans,
        [_selectedans]: otherans
      })
    }
    
  },
  /**
   * 处理滚动事件处理
   */
  listenSwiper: function (e) {
    var that = this;
    let cr = e.detail.current;
    that.setData({
      swpIndex: e.detail.current,
    });
    if (otherans){
      otherans = '';
    }
  },
  /**
   * 提交结果
   */
  submitresult:function(e){
    var that = this;
    var message = {};

    wx.showModal({
      title: '确认',
      content: '确认交卷吗？',
      success: function (modres){
        if (modres.confirm){
          message.starttime = that.data.starttime;
          message.edu_id = '';
          message.jobid = that.data.jobid;
          message.score = 0;
          message.result = [];

          for (var i = 0; i < that.data.items.length; i++) {
            var result_json = {};
            result_json.score = 0;
            result_json.orders = i;
            result_json.questionid = that.data.items[i].ques.id;
            result_json.answer = that.data.items[i].ans_txt;
            if (that.data.items[i].ans_txt == that.data.items[i].ques.answer) {
              result_json.result = 1;
              result_json.score++;
            } else {
              result_json.result = 2;
            }
            message.result.push(result_json);
          }
          for (var j = 0; j < message.result.length; j++) {
            message.score = parseInt(message.score + message.result[j].score);
          }
          wx.showLoading({
            title: '交卷中，请稍后',
          });
          console.log(message);
          let _examanalysis = {};
          _examanalysis.items = that.data.items;
          for (var i = 0; i < _examanalysis.items.length;i++){
            _examanalysis.items[i].result = message.result[i].result;
          }
          that.setData({
            result: message,
            examanalysis: _examanalysis
          })
          clearInterval(interval);
          if (that.data.practietype == 1) {
            wx.hideLoading();
            wx.navigateTo({
              url: '../result/result?id=' + that.data.examid,
            })
          } else if (that.data.practietype == 2) {
            var objectid = ''
            wx.getStorage({
              key: 'last_allid',
              success: function(res) {
                objectid = res.data.interfaceid;
                userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/konwleage_diagnose_sub", { id: that.data.jobid, objectid: objectid, corrent: message.score, total: that.data.items.length }, function (res) {
                  console.log(res.data);
                  if(res.data.code == 200){
                    wx.hideLoading();
                    that.setData({
                      result_tip: res.data.data.data
                    })
                    if (res.data.data.get){
                      wx.getStorage({
                        key: 'masterjson',
                        success: function(res) {
                          var masterjson = res.data;
                          for (var i = 0; i < masterjson.length;i++){
                            for (var j = 0; j < masterjson[i].ids.length;j++){
                              if (that.data.jobid == masterjson[i].ids[j]){
                                masterjson[i].num++;
                              }
                            }
                          }

                          wx.setStorage({
                            key: 'masterjson',
                            data: masterjson,
                          })
                        },
                      })
                      wx.getStorage({
                        key: 'last_allid',
                        success: function (res) {
                          var last_allid = res.data;
                          var last_interfaceid = last_allid.interfaceid;
                          wx.getStorage({
                            key: 'chapterdatasArr',
                            success: function (res) {
                              var chapterdatasArr = res.data;
                              for (var i = 0; i < chapterdatasArr.length; i++) {
                                if (last_interfaceid == chapterdatasArr[i].id) {
                                  chapterdatasArr[i].knowledgeNum++;
                                }
                              }

                              wx.setStorage({
                                key: 'chapterdatasArr',
                                data: chapterdatasArr,
                              })
                            },
                          })
                          wx.setStorage({
                            key: 'masterjson',
                            data: masterjson,
                          })
                        },
                      })
                    }
                    wx.navigateTo({
                      url: '../resultnew/resultnew',
                    })
                  }
                  
                });
              },
            })
            
          }
          
        }
      }
    });
  },
  hidecard:function(e){
    this.setData({
      cart_hide: 'cart_hide'
    }) 
  },
  ckeckcard:function(e){
    this.setData({
      cart_hide: ''
    })  
  },
  // 查看某一道题
  checkitem: function (e) {
    const that = this;
    const index = e.currentTarget.dataset.index;
    that.setData({
      current: index,
      cart_hide: 'cart_hide'
    })  
  },
  start: function () {
    const that = this;
    if (that.data.starttime != '') {
      return;
    }
    var myDate = new Date();
    var year = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    var month = myDate.getMonth() + 1;       //获取当前月份(0-11,0代表1月)
    var day = myDate.getDate();        //获取当前日(1-31)
    var Hours = myDate.getHours(); //获取当前小时数(0-23)
    var Minutes = myDate.getMinutes(); //获取当前分钟数(0-59)
    var Seconds = myDate.getSeconds(); //获取当前秒数(0-59)
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (day >= 1 && day <= 9) {
      day = "0" + day;
    }
    if (Hours >= 1 && Hours <= 9) {
      Hours = "0" + Hours;
    }
    if (Minutes >= 1 && Minutes <= 9) {
      Minutes = "0" + Minutes;
    }
    if (Seconds >= 1 && Seconds <= 9) {
      Seconds = "0" + Seconds;
    }
    var starttime = year + '-' + month + '-' + day + ' ' + Hours + ':' + Minutes + ':' + Seconds;

    //倒计时
    var totalSecond = 0;

    interval = setInterval(function () {
      // 秒数  
      var second = totalSecond;
      // 分钟位  
      var min = Math.floor((second) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位  
      var sec = second - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      that.setData({
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond++;
      if (totalSecond < 0) {
        clearInterval(interval);
        //设置结束
        that.setData({
          countDownMinute: '00',
          countDownSecond: '00',
        });
      }
    }.bind(this), 1000);  
    that.setData({
      starttime: starttime
    });
  },
})