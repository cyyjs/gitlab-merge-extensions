<template>
  <div class="content">
    <Alert type="warning">提醒：项目匹配，从上到下依次匹配，成功匹配到立即返回。</Alert>
    <div class="add">
      <Button type="primary" icon="md-add" @click="$refs.ruleModal.show()">添加规则</Button>
    </div>
    <Table stripe :columns="columns" :data="list">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="info" size="small" style="margin-right: 5px" icon="md-create" @click="$refs.ruleModal.show(row, index)"></Button>
        <Button type="error" size="small" icon="md-close" @click="remove(index)"></Button>
      </template>
    </Table>
    <RuleModal ref="ruleModal" @finsh="fetchData"></RuleModal>
  </div>
</template>

<script>
import { Rules, People } from '@/api'
import RuleModal from '@/components/RuleModal.vue'

export default {
  name: 'home',
  components: { RuleModal },
  data () {
    return {
      peopleList: [],
      list: [],
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '匹配项目',
          key: 'reg',
          align: 'center'
        },
        {
          title: '机器人地址',
          key: 'url',
          align: 'center'
        },
        {
          title: '通知人列表',
          key: 'people',
          align: 'center',
          render: (h, params) => {
            let tags = params.row.people.map(p => {
              let name = this.peopleMap[p] || p
              return <Tag>{name}</Tag>
            })
            return tags
          }
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
  computed: {
    peopleMap () {
      let map = {}
      this.peopleList.forEach(item => {
        map[item.tel] = item.name
      })
      return map
    }
  },
  methods: {
    async fetchData () {
      this.list = await Rules.getList()
      this.peopleList = await People.getList()
    },
    remove (index) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认要删除吗?',
        onOk: async () => {
          await Rules.remove(index)
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
