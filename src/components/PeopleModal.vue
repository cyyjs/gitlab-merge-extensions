<template>
  <Modal
    v-model="visible"
    :title="title"
    :loading="loading">
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem label="名称" prop="name">
          <Input v-model="form.name" placeholder="请输入人员名称"/>
      </FormItem>
      <FormItem label="手机号" prop="tel">
          <Input v-model="form.tel" placeholder="请输入企业微信中的手机号"/>
      </FormItem>
    </Form>
    <div slot="footer">
        <Button :loading="loading" @click="visible = false">取消</Button>
        <Button type="primary"  :loading="loading" @click="save">保存</Button>
    </div>
  </Modal>
</template>
<script>
import { People } from '@/api'
import Util from '@/util'

export default {
  data () {
    const validateTel = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入企业微信中的手机号'))
      } else if (!(/^1[3456789]\d{9}$/.test(value))) {
        callback(new Error('请输入正确的手机号'))
      }
      callback()
    }

    return {
      visible: false,
      loading: false,
      peopleList: [],
      id: '',
      form: {
        name: '',
        tel: ''
      },
      rules: {
        name: { required: true, message: '请输入人员名称', trigger: 'blur' },
        tel: { required: true, validator: validateTel, trigger: 'blur' }
      }
    }
  },
  computed: {
    title () {
      return Util.isNumber(this.id) ? '修改' : '新增'
    }
  },
  methods: {
    async show (data = {}, id) {
      this.id = id
      this.form.name = data.name
      this.form.tel = data.tel
      this.visible = true
      this.loading = false
    },
    save () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true
          if (Util.isNumber(this.id)) {
            await People.update(this.id, this.form)
          } else {
            await People.save(this.form)
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
