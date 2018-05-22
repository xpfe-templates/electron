import axios from 'axios'
import store from 'xp-storage'
import loadjs from 'xp-loadjs'
import loadcss from 'xp-loadcss'

let apiUrl = 'http://47.98.246.207:8081/startgobusrt/iot/device/getDeviceInfo'
let timer = null // 重新获取资源timer

// 加载资源
export default function getAssets(params) {
  let now = Date.now()
  return axios({
    method: 'post',
    url: apiUrl,
    data: params,
    timeout: 5000
  })
    .then((resp) => resp.data)
    .then((res) => {
      if (res.code === 0) {
        let data = res.data
        let pageConfig
        try {
          pageConfig = JSON.parse(data.equipmentVo.setParam)
        } catch (err) {}
        // 只有正确获取到assets才停止，否则不断请求
        if (pageConfig) {
          // 需要给页面使用的配置，使用localstorage
          let combineOpts = Object.assign({}, pageConfig, {
            macAddr: params.macAddr,
            time: now
          })
          store.set('pageConfig', combineOpts)
          loadAssets(combineOpts)
          return Promise.resolve(data.mqttConfigVo)
        } else {
          console.log('err: 配置解析出错')
          refetchAseets(params)
        }
      }
    })
    .catch(() => {
      console.log('err: 接口出错')
      refetchAseets(params)
    })
}

// 重新获取资源
function refetchAseets(params) {
  clearTimeout(timer)
  timer = setTimeout(() => {
    getAssets(params)
  }, 5000)
}

// 实际加载函数
function loadAssets(options) {
  const ver = '?v=' + Date.now()
  const cssOpts = options.css + ver
  const jsOpts = options.js.map(item => {
    return {
      selector: document.querySelector('#script'),
      url: item + ver
    }
  })
  return Promise.all([loadcss(cssOpts), loadjs(jsOpts)])
    .then((res) => {
      console.log('shell: 加载完毕')
    })
    .catch(() => {
      console.log('err: 动态加载资源出错')
      clearTimeout(timer)
      timer = setTimeout(() => {
        loadAssets(options)
      }, 5000)
    })
}
