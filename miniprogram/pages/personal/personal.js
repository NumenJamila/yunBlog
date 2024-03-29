const storage = require('../../lib/storage');
const apis = require('../../lib/apis');
const util = require('../../lib/util');

const app = getApp();

Page({
  data: {
    version: app.version,
    userInfo: null, // 用户信息
    collections: [], // 收藏列表

    hasAuthorization: false, // 用户是否授权允许获取用户信息
    showPopup: false,
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo")
  },
  onShareAppMessage(res) {
    return {
      title: 'CNode社区好文推荐',
      path: '/pages/artical/list?tab=good',
      imageUrl: 'http://static.xiaoqiang365.com/wechat/cnode/card_fun.jpg'
    }
  },
  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    let that = this;
    app.checkUserInfo(function (userInfo, isLogin) {
      if (!isLogin) {
        that.setData({
          showPopup: true
        })
      } else {
        that.setData({
          userInfo: userInfo,
          hasUserInfo: true
        });
      }
    });
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        showPopup: !this.data.showPopup,
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
    } else {
      wx.switchTab({
        url: '../artical/list'
      })
    }
  },

  // 辅助操作
  handleOperate(e) {
    const { type } = e.currentTarget.dataset;
    if (type === 'reLaunch') {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate((res) => {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate);
        if (!res.hasUpdate) {
          wx.showToast({
            title: '当前已经是最新版本',
            icon: 'none'
          })
        }
      })

      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          }
        })
      })

      updateManager.onUpdateFailed(() => {
        // 新版本下载失败
        wx.showToast({
          title: '新版本下载失败',
          icon: 'none'
        })
      })
    } else if (type === 'cache') {
      wx.clearStorageSync();
      wx.reLaunch({
        url: '/pages/artical/list'
      });
    }
  },

  // 点击跳转页面
  navigatePage(e) {
    const { target } = e.currentTarget.dataset;
    let url = '/pages/index/index';
    if (target === 'about') {
      url = '/pages/about/about';
    }
    wx.safeNavigateTo({ url });
  }
})
