/**
 * 获取存储数据
 * @param {String} k key
 * @param {Function} cb 回调函数
 */
function getStorageData (k, cb = () => {}) {
  chrome.storage.sync.get(k, function (data) {
    let list = data[k] || []
    return cb(list)
  })
}

/**
 * 获取匹配的配置信息
 * @param {Function} cb 回调函数
 */
function getConfig (cb = () => { }) {
  let url = location.href
  getStorageData('rules', (list) => {
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      let reg = new RegExp(item.reg)
      if (reg.test(url)) {
        return cb(item)
      }
    }
    // eslint-disable-next-line standard/no-callback-literal
    return cb({})
  })
}

/**
 * 获取获取消息模板
 * @param {Function} cb 回调函数
 */
function getTemplate (cb = () => {}) {
  const defaultTemplate = `项目: __project__
【__branch__】__issue__  __title__
__url__`
  getStorageData('template', (list) => {
    return cb(list[0] || defaultTemplate)
  })
}

/**
 * 模板替换
 * @param {String} template 模板字符串
 * @param {Object} data 数据
 */
function renderTemplate (template = '', data) {
  return template.replace('__project__', data.project)
    .replace('__branch__', data.branch)
    .replace('__issue__', data.issue)
    .replace('__title__', data.title)
    .replace('__url__', data.url)
    .replace('__description__', data.description)
}

/**
 * 模板替换
 * @param {String} template 模板字符串
 * @param {Object} data 数据
 */
function getPeopleMap (cb = () => {}) {
  getStorageData('people', (list = []) => {
    let map = {}
    list.forEach(item => {
      map[item.name] = item.tel
    })
    return cb(map)
  })
}

/**
 * 向微信发送通知
 * @param {Object} data 数据
 * @param {Boolean} done 是否为merged
 */
function sendNotify ({ msg, data }, done) {
  let config = data.config
  if (!config || !config.url) {
    return
  }

  let xhr = new XMLHttpRequest()
  xhr.open('post', config.url, true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  let body = {
    msgtype: 'text',
    text: {
      content: msg
    }
  }
  if (!done) {
    body.text.mentioned_mobile_list = config.people
    body.text.content += `\n提交者：${data.currentUser}\n审核人：`
  } else {
    body.text.mentioned_mobile_list = [data.authorTel]
    body.text.content = body.text.content + `\n提交者：${data.author}\n审核人：${data.currentUser}\nDone`
  }
  xhr.send(JSON.stringify(body))
}

$(function () {
  function getMessage (callback) {
    let currentUser = $('.user-name').text().trim()
    let author = $('.issuable-meta .author:first').text().trim()
    let issue = $('.js-source-branch').text().trim()
    let branch = $('.js-target-branch').text().trim()
    let title = $('.detail-page-description>.title').text().trim()
    let description = $('.description textarea').text().trim()

    let url = location.href
    let project = url.match(/.com\/(.+)\/merge_requests/)[1]
    getConfig(config => {
      let data = {
        project,
        currentUser,
        author,
        branch,
        issue,
        title,
        url,
        description,
        config
      }
      getTemplate(template => {
        let msg = renderTemplate(template, data)
        getPeopleMap(map => {
          data.authorTel = map[author] || author
          let result = {
            msg,
            data
          }
          return callback(result)
        })
      })
    })
  }

  let button = $('<button title="复制merge request消息" id="copymr" class="copymr" name="button" type="button">复制MR消息</button>')
  let sendButton = $('<button title="发送merge request消息到微信" class="copymr sendwx" name="button" type="button">MR</button>')
  let doneButton = $('<button title="发送merged消息到微信" class="copymr mrdone" name="button" type="button">Merged</button>')

  button.click(function () {
    getMessage(data => {
      let message = data.msg
      let copy = function (e) {
        e.clipboardData.setData('text/plain', message)
        e.preventDefault()
      }
      document.addEventListener('copy', copy)
      alert(message)
      document.execCommand('copy')
      document.removeEventListener('copy', copy)
    })
  })
  sendButton.click(() => {
    getMessage(data => {
      sendNotify(data)
    })
  })
  doneButton.click(() => {
    getMessage(data => {
      sendNotify(data, true)
    })
  })
  $('.breadcrumbs-container').append(button)
  $('.breadcrumbs-container').append(sendButton)
  $('.breadcrumbs-container').append(doneButton)
})
