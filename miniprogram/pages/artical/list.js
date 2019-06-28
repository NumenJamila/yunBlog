const apis = require('../../lib/apis');
const util = require('../../lib/util');
const storage = require('../../lib/storage');
const { barTitleHeight, windowHeight } = util.getNavigationData();

const app = getApp();

Page({
  data: {
    navName: '文章列表',
    list: [], // 内容列表
    loadingStatus: true, // loading状态

  },
  onShareAppMessage() {
    return {
      title: '【CNode社区热帖】',
      path: `/pages/artical/list`,
      imageUrl: 'http://static.xiaoqiang365.com/wechat/cnode/card_posts.jpg'
    }
  },
  onLoad(option) {
    this.getLists();
    this.clickedAdCount = 0;
    const {
      homeToPage,
      tab
    } = option;
    // // 分享页重定向跳转: path需要 encode !!!
    if (homeToPage) {
      wx.navigateTo({
        url: decodeURIComponent(homeToPage)
      })
    }
  },
   
  // 获取列表数据
  getLists(callback) {
    const db = wx.cloud.database()
    db.collection("blog").get({
      success: res => {
        console.log(res)
        const length = this.data.list.length;
        const resObj = {};

        res.data.forEach((item, i) => {
          // item.date = util.transformDateTime(new Date(item.create_at));
          item.summary = `摘要: ${item.content.split('\r')[0]}...`;
          resObj[`list[${length + i}]`] = item;
        });
        // console.log(resObj);
        this.setData(resObj);
        if (callback && typeof callback === 'function') {
          callback();
        }
      }, fail: err => {
        wx.showToast({
          icon: "none",
          title: '查询记录失败',
        })
      }
    })
      
  },
  // 跳转详情
  toDetail(event) {
    const {
      item
    } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/artical/detail?id=${item._id}`
    })
  },
  // // 更新页面分享参数
  // updateShareMessage(shareInfo) {
  //   this.onShareAppMessage = () => shareInfo;
  // },
  // 新建博客
  toNew() {
    wx.navigateTo({
      url: `/pages/edit/index`
    })
  }
})
