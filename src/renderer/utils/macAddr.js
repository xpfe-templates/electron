import getmac from 'getmac'

export default function getMac() {
  return new Promise((resolve, reject) => {
    getmac.getMac((err, macAddr) => {
      if (err) {
        reject(err)
      }
      resolve(macAddr)
    })
  })
}
