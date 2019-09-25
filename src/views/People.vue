<template>
  <div class="content">
    <Alert type="warning">提醒：微信机器人@某人，需要提供手机号。</Alert>
    <div class="add">
      <Button type="primary" icon="md-add" @click="$refs.peopleModal.show()">添加人员</Button>
    </div>
    <Table stripe :columns="columns" :data="peopleList">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="info" size="small" style="margin-right: 5px" icon="md-create" @click="$refs.peopleModal.show(row, index)"></Button>
        <Button type="error" size="small" icon="md-close" @click="remove(index)"></Button>
      </template>
    </Table>
    <PeopleModal ref="peopleModal" @finsh="fetchData"></PeopleModal>
  </div>
</template>

<script>
import { People } from '@/api'
import PeopleModal from '@/components/PeopleModal.vue'

export default {
  name: 'home',
  components: { PeopleModal },
  data () {
    return {
      peopleList: [],
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '手机号',
          key: 'tel',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 100,
          align: 'center'
        }
      ]
    }
  },
  methods: {
    async fetchData () {
      this.peopleList = await People.getList()
    },
    remove (index) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认要删除吗?',
        onOk: async () => {
          await People.remove(index)
          this.fetchData()
          this.$Message.success('删除成功')
        }
      })
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>
<style scoped>
.add{
  text-align: right;
  margin-bottom: 10px;
}
</style>
