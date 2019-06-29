//获取应用实例

const util = require('../../lib/util.js');
const app = getApp()

Page({
  data: {
    hasUserInfo: false,
    dataMsg: '',
    statusMsg: '',
    fileID: null,
    coverImage: '',
    tempFilePath: '',
    content: '',
    oldList: []
  },
  onLoad: function () {
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formateDate(new Date());
    console.log(time)
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time
    });
  },
  /*
   * 上传文件
   */
  uploadFile: function() {
    wx.chooseImage({
      success: dRes => {
        this.setData({
          statusMsg: '开始上传文件'
        })

        wx.showLoading({
          title: '加载中',
        });

        const uploadTask = wx.cloud.uploadFile({
          cloudPath: `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}.png`,
          filePath: dRes.tempFilePaths[0],
          success: res => {
            if (res.statusCode < 300) {
              this.setData({
                fileID: res.fileID,
              }, () => {
                this.getTempFileURL();
              });
            }
          },
          fail: err => {
            wx.hideLoading();
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            });
          },
        })
      },
      fail: console.error,
    })
  },

  /**
   * 获取图片链接
   */
  getTempFileURL: function() {
    wx.cloud.getTempFileURL({
      fileList: [{
        fileID: this.data.fileID,
      }],
    }).then(res => {
      console.log('获取成功', res)
      let files = res.fileList;

      if (files.length) {
        this.setData({
          coverImage: files[0].tempFileURL
        });
      }

      wx.hideLoading();
    }).catch(err => {
      console.error('获取失败', err)
      wx.showToast({
        title: '获取图片链接失败',
        icon: 'none'
      });
      wx.hideLoading();
    })
  },

  //监听input失去焦点
  titleInput: function (e) {
    console.log(e)
    this.setData({
      title: e.detail.value
    })
  },

  saveData(e) {
    console.log(e.detail);
    let that = this

    if (!this.data.title) {
      return wx.showToast({
        title: '封面、标题或文章内容不能为空',
        icon: 'none'
      });
    }
    var tempContent = ''
    if (e.detail.length == 0) {
      return wx.showToast({
        title: '文章内容不能为空',
        icon: 'none'
      });
    }
    e.detail.forEach(function(item, index) {
      console.log(item)
      if (item.type === 1) {
        tempContent += `![](` + item.info + `)`
      } else {
        tempContent += item.info
      }
    })
    that.setData({
      content: tempContent
    })

    wx.showLoading({
      title: '发布中',
    });

    const db = wx.cloud.database()//打开数据库连接
    db.collection("blog").add({
      data: {
        title: this.data.title,
        content: this.data.content,
        time: this.data.time
      }, success: res => {
        console.log(res)
        wx.showToast({
          title: '新增记录成功',
        })
       wx.navigateTo({
        url: '../artical/detail?id=' + res._id
      });
      }, fail: err => {
        wx.showToast({
          title: '新增失败',
        })
      }
    })
      wx.hideLoading();
  }
})