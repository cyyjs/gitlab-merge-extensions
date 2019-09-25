const KEY = 'MockStorage'

export default class {
  set (obj, cb = () => {}) {
    let data = localStorage.getItem(KEY) || '{}'
    data = JSON.parse(data)
    for (let k in obj) {
      data[k] = obj[k]
    }
    localStorage.setItem(KEY, JSON.stringify(data))
    return cb(data)
  }
  get (key, cb = () => {}) {
    try {
      let data = localStorage.getItem(KEY) || '{}'
      data = JSON.parse(data)
      let result = {
        [key]: data[key]
      }
      return cb(result)
    } catch (e) {
      console.log(e)
      return {}
    }
  }
}
