/**
 * @author xiaoping
 * @email edwardhjp@gmail.com
 * @create date 2018-03-22 02:39:21
 * @modify date 2018-03-22 02:39:21
 * @desc [mqtt service]
 */

import Mqtt from 'aliyun-iot-mqtt'

let client

export function createClient(options) {
  if (client) client.end()
  client = Mqtt.getAliyunIotMqttClient({
    productKey: options.productKey,
    deviceName: options.deviceName,
    deviceSecret: options.secret,
    regionId: options.iotRegionId,
    keepAlive: 120,
    clean: false
  })
  return client
}

export function closeClient() {
  client && client.end()
}

export function mqttInstance() {
  return client
}
