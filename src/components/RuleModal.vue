<template>
  <Modal
    v-model="visible"
    :title="title"
    :loading="loading">
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem label="匹配项目" prop="reg">
          <Input v-model="form.reg" placeholder="请输入匹配项目正则"/>
      </FormItem>
      <FormItem label="通知地址" prop="url">
          <Input v-model="form.url" placeholder="请输入微信机器人地址"/>
      </FormItem>
      <FormItem label="提醒人员" prop="people" placeholder="请选择消息提醒人员">
        <Select multiple v-model="form.people" style="width: 320px; margin-right:10px;">
          <Option v-for="(p, index) in selectList" :key="index" :value="p.tel">{{p.name}}</Option>
        </Select>
        <a class="add" href="javascript:;" @click="addPeople">添加人员</a>
      </FormItem>
    </Form>
    <div slot="footer">
        <Button :loading="loading" @click="visible = false">取消</Button>
        <Button type="primary"  :loading="loading" @click="save">保存</Button>
    </div>
  </Modal>
</template>
<script>
import { People, Rules } from '@/api'
import Util from '@/util'

export default {
  data () {
    return {
      visible: false,
      loading: false,
      peopleList: [],
      id: '',
      form: {
        reg: '',
        url: '',
        people: []
      },
      rules: {
        reg: { required: true, message: '请输入匹配项目正则', trigger: 'blur' },
        url: [{
          required: true, message: '请输入微信机器人地址', trigger: 'blur'
        }, {
          type: 'url', message: '请输入正确的url地址', trigger: 'blur'
        }],
        people: { required: true, type: 'array', message: '请选择要提醒的人员', trigger: 'change' }
      }
    }
  },
  computed: {
    title () {
      return Util.isNumber(this.id) ? '修改' : '新增'
    },
    selectList () {
      return [{
        name: '@all',
        tel: '@all'
      }, ...this.peopleList]
    }
  },
  methods: {
    async show (data = {}, id) {
      this.id = id
      this.form.reg = data.reg
      this.form.url = data.url
      this.form.people = data.people
      this.peopleList = await People.getList()
      this.visible = true
      this.loading = false
    },
    addPeople () {
      this.visible = false
      this.$router.push('/people')
    },
    save () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true
          if (Util.isNumber(this.id)) {
            await Rules.update(this.id, this.form)
          } else {
            await Rules.save(this.form)
          }
          this.loading = false
          this.visible = false
          this.$Message.success('保存成功!')
          this.$emit('finsh')
        }
      })
    }
  }
}
</script>
