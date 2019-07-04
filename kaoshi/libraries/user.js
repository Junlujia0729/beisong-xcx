const app = getApp();
import { navigate } from "./router.js"
module.exports = {
  xcx_login_new(callback){
    console.log("xcx_login_new");
    if (app.globalData.userToken == "") {
      wx.login({  //调用微信登录
        success(res_wxlogin) {
          var loginObj = { code: res_wxlogin.code, os: app.globalData.systemInfo.platform, appid: app.globalData.appid}
          wx.request({
            url: app.globalData.mainDomain + "XcxApi/matrix_login",
            data: loginObj,
            method: "POST",
            header: { 'content-type': 'application/x-www-form-urlencoded', 'Version': app.globalData.appversion},
            dataType: 'json',
            success: function (res) {
              console.log("send matrix_login success");
              console.log(res);
              var wxlogincode = res_wxlogin.code;
              if (res.data.code == 200) {
                app.globalData.userToken = res.data.data.user.token;
                app.globalData.mobile = res.data.data.user.mobile;
                app.globalData.nickname = res.data.data.user.nickname;
                app.globalData.avatar = res.data.data.user.avatar;

                //扩展用户信息
                if (res.data.data.ext && res.data.data.ext.level) {
                  app.globalData.level = res.data.data.ext.level;
                  app.globalData.subject = res.data.data.ext.subject;
                }
                callback();
              }else{
                
              }
            },
            fail: function (fres) {
              console.log(fres);
              wx.showModal({
                title: '登录失败',
                content: '请确认网络正常后重新打开',
              })
             }
          })
        },
        fail() {
          wx.showModal({
            title: '登录失败了',
            content: '请确认网络正常后重新打开',
          })
        }
      })
    }else{
      callback();
    }
  },
  xcx_check_mobile_empty(){
    if (app.globalData.mobile == "") {
      navigate({
        path: "pages/getphone/getphone"
      });
      return false;
    }else{
      return true;
    }
  },
  
  xcxbind(){

  },
  json2Form :function(json) {
    var str = [];
    for (var p in json) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
    }
    return str.join("&");
  },

  requestAppApi_GET(url, params, funcback) { 
    let interval = setInterval(() => {
      if (app.globalData.userToken != "") { // 判断已经有token了
        clearInterval(interval) // 清理定时器   
        var params1 = Object.assign({ appid: app.globalData.appid }, params);
        wx.request({
          url: url,
          data: params1,
          method: "GET",
          header: {
            'content-type': 'application/x-www-form-urlencode',
            'Authorization': app.globalData.userToken,
            'Version': app.globalData.appversion
          },
          dataType: 'json',
          success: function (res) { funcback(res) },
          fail: function (res) { }
        })
      }
    }, 10);
  },
  
  requestAppApi_POST(url, params, funcback) {
    let interval = setInterval(() => {
      if (app.globalData.userToken != "") { // 判断已经有token了
        clearInterval(interval) // 清理定时器

        var params1 = Object.assign({ appid: app.globalData.appid }, params);
        wx.request({
          url: url,
          data: params1,
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded', 'Version': app.globalData.appversion, 'Authorization': app.globalData.userToken
          },
          dataType: 'json',
          success: function (res) {
            funcback(res);
          },
          fail: function (res) { }
        })
      }
    }, 10);
  },
  genWebPageUrl: function (url) {
    //跳转，拼接用户的token，然后跳转
    var u = url;
    if (u.indexOf("?") == -1) {
      u += "?miniprogram=1&token=" + app.globalData.userToken;
    } else {
      u += "&miniprogram=1&token=" + app.globalData.userToken;
    }
    return u;
  },
  gotoActivityPage: function (path, title, open_type, callback) {
    if (path.indexOf("http://") == -1 && path.indexOf("https://") == -1) {
      if (open_type == "switchTab"){
        wx.switchTab({
          url: '../' + path,
          success: function () {
            if (callback) {
              callback();
            }
          }
        });
      }else{
        wx.navigateTo({
          url: '../' + path,
          success: function () {
            if (callback) {
              callback();
            }
          }
        })
      }
    } else {
      app.globalData.activityUrl = path;
      app.globalData.activityTitle = title;
      wx.navigateTo({
        url: '../activity/activity',
        success : function(){
          if (callback) {
            callback();
          }
        }
      })
    }
  },
  //多张图片上传
  //pictures 需要上传的数组 path 是本地路径  path_server 是远程路径
  upload_file_server(that, upurl, pictures, proc, total, callback) {
    var _that = that;
    var upload_task = wx.uploadFile({
      url: upurl, //需要用HTTPS，同时在微信公众平台后台添加服务器地址
      filePath: pictures[proc].path,//上传的文件本地地址
      name: 'file',
      formData: { 'path': 'wxchat' },//附近数据，这里为路径
      success: function (res) {
        var data = JSON.parse(res.data) //字符串转化为JSON
        var path_server_str = 'upload_picture_list[' + proc + '].path_server';
        _that.setData({
          [path_server_str]: data.data.key
        });
        proc++;
        if (proc == total) {
          callback();
        } else {
          module.exports.upload_file_server(_that, upurl, pictures, proc, total, callback);
        }
      }
    })
    upload_task.onProgressUpdate((res) => {
      console.log('上传进度', res.progress)
      // console.log('已经上传的数据长度', res.totalBytesSent)
      // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      // var upload_percent_str = 'upload_picture_list[' + proc + '].upload_percent';
      // _that.setData({
      //   [upload_percent_str]: res.progress
      // })
    })
  }
}