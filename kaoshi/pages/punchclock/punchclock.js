// pages/punchclock/punchclock.js
const app = getApp()
const userApi = require('../../libraries/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:{},
    content:{},
    id:0,
    is_clock:0,
    scrollHeight:0,
    clocktype:0,
    scroll:false
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/dk_index", {}, function (res) {
      var _id='';
      var _is_clock = '';
      for (var i = 0; i < res.data.data.times.length;i++){
        if(i == 3 ){
          _id = res.data.data.times[i].classid;
          _is_clock = res.data.data.times[i].type;
          res.data.data.times[i].active = 1;
        }else{
          res.data.data.times[i].active = 0;
        }
      }
      that.setData({
        datas:res.data.data,
        id: _id,
        is_clock: _is_clock
      })
      if (_is_clock){
        that.setData({
          scroll: true
        })
      }
      that.getcontent(_id);
      // that.getcontent(1057);
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
    let that = this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/dk_index", {}, function (res) {
      var _id = '';
      var _is_clock = '';
      for (var i = 0; i < res.data.data.times.length; i++) {
        if (i == 3) {
          _id = res.data.data.times[i].classid;
          _is_clock = res.data.data.times[i].type;
          res.data.data.times[i].active = 1;
        } else {
          res.data.data.times[i].active = 0;
        }
      }
      that.setData({
        datas: res.data.data,
        id: _id,
        is_clock: _is_clock
      })
      if (_is_clock) {
        that.setData({
          scroll: true
        })
      }
      that.getcontent(_id);
    }); 
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

  submitformid: function (e) {
    var that = this;
    userApi.requestAppApi_POST(app.globalData.mainQueryDomain + "XcxApi/matrix_formid", { formid: e.detail.formId, }, function (res) {
      that.addclock();
    });
  },
  
  getcontent:function(id){
    var that = this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/dk_details", { id: id}, function (res) {
      if(res.data.code == 200){
        var _content = that.analyseOneNode(res.data.data.data.content);
        console.log(res.data.data.data);
        that.setData({
          content: _content,
          details: res.data.data.data
        })
      }
    }); 
  },

  addclock:function(){
    var that =this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "LxzgzXcxApi/dk_add", { id: that.data.id }, function (res) {
      that.setData({
        is_clock:1,
        scrollHeight:300,
        scroll:true
      })
    }); 
  },

  //背题
  recite: function (e) {
    let that = this;
    let arrs = that.data.content;
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
        content: arrs
      });

    }
  },

  //松开背题
  reciteEnd: function (e) {
    let that = this;
    let arrs = that.data.content;

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
        content: arrs
      });
    }
  },

  practice:function(){
    var that = this;
    wx.navigateTo({
      url: '../dailypractice/pages/practice/practice?id=' + that.data.id +'&practietype=1',
    })
  },

  analysis:function(){
    var that = this;
    wx.navigateTo({
      url: '../examanalysis/examanalysis?id=' + that.data.id,
    })
  },
  change:function(e){
    var that = this;
    console.log(e);
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    let index = e.currentTarget.dataset.index;
    if (!id){
      wx.showToast({
        title: '该日期没有打卡任务',
        icon:'none'
      })
      return;
    }
    var _datas = that.data.datas;
    console.log(_datas.times);
    for (var i = 0; i < _datas.times.length;i++){
      _datas.times[i].active = 0;
      if (id == _datas.times[i].classid && id != 0){
        _datas.times[i].active = 1;
      }
    }
    
    that.setData({
      datas: _datas
    })
    that.getcontent(id);
    if (type == 0){
      that.setData({
        clocktype:1
      })
    }
  },
  learn: function (e) {
    var that = this;
    console.log(0)
    that.setData({
      is_clock: 1,
      scrollHeight: 300,
      scroll: true
    })
  },
  mineCalendar:function(){
    wx.navigateTo({
      url: '../datepicker/datepicker',
    })
  }
})