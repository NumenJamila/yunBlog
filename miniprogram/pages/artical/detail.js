const apis = require('../../lib/apis');
const util = require('../../lib/util');
const storage = require('../../lib/storage');

Page({
  data: {
    navTitle: '话题详情',
    detail: null,
    content: '',
    detailId: null
  },
  onShareAppMessage() {
    return {
      title: 'Node随心阅',
      path: '/pages/artical/list'
    }
  },
  /**
   * 获取文章详情
   */
  getBlogDetail(id) {
    // let id = '6dfb26295d14892f01ca2ef1246c8380';
    // 初始化db
    const db = wx.cloud.database({});
    // let blogId = this.data.detailId;
    db.collection("blog").where({
      _id: id
    }).get({
      success: res => {
        console.log(res)
        this.setData({
          content: res.data[0].content//返回的是一个数组，取第一个
        })
      }, fail: err => {
        console.log(err)
      }
    })
  },
  onLoad(option) {
    console.log(option)
    this.getBlogDetail(option.id)
    // this.setData({
    //   detailId: option.id
    // })
    // const {
    //   id
    // } = option;
    // if (id) {
    //   this.detailId = id; // 文章id
    //   this.getDetail(id).then(res => {
    //     const detail = res.data;
    //     detail.replies.forEach(reply => {
    //       reply.createTime = util.transformDateTime(new Date(reply.create_at));
    //     })
    //     detail.createTime = util.formateDate(new Date(detail.create_at)); // 发布时间
    //     detail.lastReplyTime = util.formateDate(new Date(detail.last_reply_at)); // 最后回复时间
    //     this.setData({
    //       detail
    //     });

    //     // 读取缓存文章位置，并自动滚动到目标位置
    //     storage.get(storage.keys.readLoc).then(storeRead => {
    //       if (storeRead && storeRead.id === this.detailId) {
    //         wx.pageScrollTo({
    //           scrollTop: storeRead.top || 0,
    //           duration: 300
    //         });
    //       }
    //     })

    //     // 设置分享参数
    //     this.updateShareMessage({
    //       title: `${detail.title}`,
    //       path: `/pages/artical/list?tab=${detail.tab || 'all'}&homeToPage=${encodeURIComponent(`/pages/artical/detail?id=${id}`)}`
    //     });
    //     // this.setData({ navTitle: detail.title }); // 设置页面标题
    //   });
    // } else {
    //   wx.reLaunch({
    //     url: '/pages/artical/list'
    //   })
    // }
  },
  // 页面滚动记录滚动位置
  // onPageScroll(obj) {
  //   if (this.isScrolling) {
  //     clearTimeout(this.scrollTimer);
  //     return this.setScrollTimer();
  //   }
  //   this.isScrolling = true;
  //   this.setScrollTimer();
  //   if (this.detailId) {
  //     console.log(obj.scrollTop);
  //     storage.set(storage.keys.readLoc, {
  //       id: this.detailId,
  //       top: obj.scrollTop
  //     })
  //   }
  // },
  // setScrollTimer() {
  //   this.scrollTimer = setTimeout(() => {
  //     this.isScrolling = false;
  //   }, 50);
  // },
  // // 获取帖子详情
  // getDetail(id) {
  //   if (!id) return;
  //   const accesstoken = storage.get(storage.keys.accessToken, true);
  //   const fetchData = {
  //     mdrender: false
  //   };
  //   if (accesstoken) {
  //     Object.assign(fetchData, { accesstoken });
  //   }

  //   return wx.fetch({
  //     url: `${apis.topicDetail}/${id}`,
  //     data: fetchData
  //   })
  // },

  // // 图片预览
  // previewImage(event) {
  //   const {
  //     url
  //   } = event.currentTarget.dataset;
  //   wx.previewImage({
  //     current: url,
  //     urls: [url]
  //   })
  // },
  // // 更新页面分享参数
  // updateShareMessage(shareInfo) {
  //   this.onShareAppMessage = () => shareInfo;
  // },
  // // 收藏/取消收藏
  // toggleCollect() {
  //   const accesstoken = storage.get(storage.keys.accessToken, true);
  //   if (!accesstoken) {
  //     wx.showModal({
  //       title: '登录提示',
  //       content: '收藏前必须登录, 是否立即登录?',
  //       success(res) {
  //         if (res.confirm) {
  //           wx.safeNavigateTo({
  //             url: '/pages/personal/personal'
  //           })
  //         } else if (res.cancel) {
  //           // console.log('用户点击取消');
  //         }
  //       }
  //     })
  //     return;
  //   }
  //   const {
  //     is_collect: isCollect,
  //     id
  //   } = this.data.detail;
  //   let fetchUrl = apis.topicCollectAdd;
  //   if (isCollect) {
  //     fetchUrl = apis.topicCollectDel;
  //   }
  //   wx.fetch({
  //     url: fetchUrl,
  //     method: 'POST',
  //     data: {
  //       topic_id: id,
  //       accesstoken
  //     }
  //   }).then(res => {
  //     if (res.success) {
  //       this.setData({
  //         ['detail.is_collect']: !isCollect
  //       });
  //       wx.showToast({
  //         title: isCollect ? '已取消收藏' : '已收藏'
  //       })
  //     } else {
  //       wx.showToast({
  //         title: isCollect ? '文章已取消收藏' : '文章已收藏'
  //       })
  //     }
  //   })
  // },
})
