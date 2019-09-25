<template>
  <div class="content">
    <div class="box">
      <div class="tip">
        <h4>变量提示</h4>
        <ul>
          <li v-for="item in tips" :key="item.name"><span>{{item.name}}</span>{{item.title}}</li>
        </ul>
      </div>
      <div class="msg">
        <h4>消息模板</h4>
        <Input v-model="msg" type="textarea" :rows="5" placeholder="请输入模板" />
        <div class="save">
          <Button type="primary"  :loading="loading" @click="save">保存</Button>
        </div>
        <h4>示例预览</h4>
        <pre class="privew">{{privew}}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { Template } from '@/api'
const defaultTemplate = `项目: __project__
【__branch__】__issue__  __title__
__url__`

export default {
  name: 'home',
  data () {
    return {
      loading: false,
      msg: '',
      tips: [{
        name: '__project__',
        title: '项目名'
      }, {
        name: '__branch__',
        title: '分支名称'
      }, {
        name: '__issue__',
        title: '问题ID'
      }, {
        name: '__title__',
        title: '标题'
      }, {
        name: '__description__',
        title: '内容描述'
      }, {
        name: '__url__',
        title: 'MR地址'
      }]
    }
  },
  computed: {
    privew () {
      return this.msg.replace('__project__', 'frontend/bee/frontend')
        .replace('__branch__', 'master')
        .replace('__issue__', 'issue#1')
        .replace('__title__', '提交标题')
        .replace('__url__', 'https://git.shuiditech.com/frontend/bee/frontend/merge_requests/106')
        .replace('__description__', '内容描述') + '\n提交者：张三\n审核人：\n@李思'
    }
  },
  methods: {
    async fetchData () {
      let list = await Template.getList()
      this.msg = list[0] || defaultTemplate
    },
    async save () {
      await Template.update(0, this.msg)
      this.fetchData()
      this.$Message.success('保存成功')
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>
<style lang="less" scoped>
.box{
  display: flex;
}
h4{
  margin-bottom: 10px;
}
.tip{
  width: 320px;
  margin-right: 20px;
  border-right: 1px solid #eee;
  &>ul {
    font-size: 14px;
    list-style: none;
    &>li {
      margin-bottom: 5px;
    }
    & span{
      background-color: #eee;
      border-radius: 5px;
      margin-right: 10px;
      display: inline-block;
      width: 110px;
      padding: 0 5px;
    }
  }
}
.msg{
  width: 100%;
}
.save {
  text-align: right;
  margin-top: 10px;
}
.privew{
  margin: 0;
  font-size: 14px;
  background-color: #eee;
  padding: 10px;
  border-radius: 5px;
}
</style>
