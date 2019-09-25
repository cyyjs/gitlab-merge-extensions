import MockStorage from './mockStorage'
import { Array } from 'core-js'

/**
 * 数据存储
 */
class DB {
  constructor (key) {
    this.key = key
    try {
      this.storage = chrome.storage.sync
    } catch (e) {
      this.storage = new MockStorage()
    }
  }

  getList () {
    return new Promise((resolve, reject) => {
      this.storage.get(this.key, (data) => {
        resolve(data[this.key] || [])
      })
    })
  }

  async save (v) {
    let list = await this.getList(this.key)
    list.push(v)
    let result = await this.saveList(list)
    return result
  }

  async saveList (list) {
    return new Promise((resolve) => {
      this.storage.set({ [this.key]: list }, function () {
        resolve(list)
      })
    })
  }

  async remove (index) {
    let list = await this.getList(this.key)
    list.splice(index, 1)
    let result = await this.saveList(list)
    return result
  }

  async update (index, v) {
    let list = await this.getList(this.key)
    if (Array.isArray(list)) {
      list.splice(index, 1, v)
      let result = await this.saveList(list)
      return result
    } else {
      return 0
    }
  }
}

export default DB
