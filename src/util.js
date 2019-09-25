export default class Util {
  static isNumber (data) {
    return Object.prototype.toString.call(data) === '[object Number]'
  }
}
