import { webFrame, remote } from 'electron'
import getMac from './utils/macAddr'
import getAssets from './utils/assets'

// 禁止缩放
webFrame.setZoomFactor(1) // 重置为100%
webFrame.setVisualZoomLevelLimits(1, 1)
webFrame.setLayoutZoomLevelLimits(0, 0)

function startMqtt(options) {
  const mqttService = remote.getGlobal('services').mqtt
  let client = mqttService.createClient(options)
  client.on('connect', () => {
    console.log('mqtt connected')
    client.subscribe(`/${options.productKey}/${options.deviceName}/get`, { qos: 1 })
  })
  client.on('message', (topic, message) => {
    console.log('message arrived')
    if (window.onBridgeCall) {
      window.onBridgeCall('mqtt', { msg: message.toString(), topic })
    }
  })
  client.on('error', (err) => {
    console.log(err)
    // client.end()
    // startMqtt(options) // 重启mqtt
  })
}

getMac().then(macAddr => {
  // macAddr = '4444444'
  window.macAddr = macAddr // 暴露到window
  getAssets({ macAddr }).then(mqttConf => {
    if (!mqttConf) return
    startMqtt(mqttConf)
  })
})
