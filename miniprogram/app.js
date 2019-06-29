//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'test-numen'
      })
    }
    // 展示本地存储能力
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.systemInfo = res;
      },
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log(res)
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.globalData.openId = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
    checkUserInfo: function(cb) {
      let that = this
      if (that.globalData.userInfo) {
        typeof cb == "function" && cb(that.globalData.userInfo, true);
      } else {
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function (res) {
                  that.globalData.userInfo = JSON.parse(res.rawData);
                  typeof cb == "function" && cb(that.globalData.userInfo, true);
                }
              })
            } else {
              typeof cb == "function" && cb(that.globalData.userInfo, false);
            }
          }
        })
      }
    },
  globalData: {
    userInfo: null,
    systemInfo: null,
    openId: ''
  }
})
