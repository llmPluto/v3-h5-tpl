import axios from 'axios'

const serve = axios.create({
  baseURL:
    import.meta.env.MODE == 'development'
      ? '/proxy'
      : API_CONFIG.AIM_ENV === 'prod'
        ? 'https://tqgm.taoqiyouxi.com'
        : 'https://tqgm.taoqi.games',
  headers: {
    Authorization: localStorage.getItem('token') ? 'Bearer ' + localStorage.getItem('token') : '',
  },
})

// const router = useRouter()

const setHeaderToken = () => {
  serve.defaults.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token')
}

serve.interceptors.response.use(
  function (response) {
    if (window.location.pathname.endsWith('/login')) {
      //如果是登录页面的错误接口，走这里
      if (response?.data?.code !== 0) {
        // 如果是登录接口，不需要在这里进行统一弹窗提示处理
        return Promise.reject(response)
      }
    }

    switch (response?.data?.code) {
      case -1001:
        // message.error('登录状态已过期')
        notification.warning({
          message: '登录错误',
          description: '登录状态已过期',
        })
        setTimeout(() => {
          localStorage.clear()
          location.reload()
        }, 2000)
        return
      case -1:
        // 暂时不需要这个提示
        // notification.warning({
        //   message: '接口错误',
        //   description: response.data.msg,
        // })
        break
    }
    if (response?.data?.code == 0) {
      return response.data?.data || ''
    } else {
      if (response?.data) {
        message.error(response.data.msg)
        console.group('业务逻辑错误')
        console.warn(`请求接口：${response.config.url}`)
        if (response.config.params) {
          console.warn(`请求参数：${JSON.stringify(response.config.params)}`)
        }
        console.warn(`错误描述：${response.data.msg}`)
        console.warn(`错误码：${response.data.code}`)
        console.groupEnd()
        return Promise.reject(response)
      }
    }
  },
  function (error) {
    message.error('网络错误')
    return Promise.reject(error)
  },
)
export default serve
export { setHeaderToken }
