// components/hx-icon/index.js
Component({
  externalClasses: ['position'],
  /**
   * 组件的属性列表
   */
  properties: {
    bindData:{ //传递的数据
      type: String,
      optionalTypes:[Number,Array,Object]
    },
    type:{
      type: String,
      value: ''
    },
    size:{
      type: Number,
      value: 16
    },
    color: {
      type: String,
      value: 'info'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickIcon(){
      let that = this;
      that.triggerEvent("click",that.data.bindData);
    }
  }
})
