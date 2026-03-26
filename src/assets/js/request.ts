import { config, HTTP_STATUS, BUSINESS_CODE, isApiDomainAllowed } from './config'
import { getToken, removeToken, refreshToken } from './api/user'
import { decryptPayload, encryptPayload, shouldEncryptRequest } from './crypto'

const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url)
// 请求拦截器
const requestInterceptor = (config: any) => {
  const token = getToken()
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    }
  }

  // 设置超时时间
  config.timeout = 20000

  const method = (config.method || 'GET').toUpperCase()
  const forceEncrypt = config.encrypt === true
  const disableEncrypt = config.encrypt === false

  const needEncrypt = !disableEncrypt && shouldEncryptRequest(config.security, {
    method,
    force: forceEncrypt
  })

  if (needEncrypt) {
    config.data = encryptPayload(config.data, config.security, {
      method,
      force: forceEncrypt
    })

    config.header = {
      ...config.header,
      'X-Encrypted': '1',
      'X-Encrypt-Alg': 'XOR-BASE64'
    }
  }

  return config
}

// 响应拦截器
const responseInterceptor = (response: any) => {
  const { statusCode, data } = response

  // HTTP状态码检查
  if (statusCode !== HTTP_STATUS.SUCCESS && statusCode !== HTTP_STATUS.CREATED && statusCode !== HTTP_STATUS.UNAUTHORIZED) {
    throw new Error(`HTTP错误: ${statusCode}`)
  }
  console.log(data)

  // 服务端返回加密包时自动解密
  const decrypted = decryptPayload(data, config.security)
  // 业务状态码检查
  // if (data.code !== BUSINESS_CODE.SUCCESS) {
  //   throw new Error(data.message || '请求失败')
  // }

  return decrypted
}

// 错误处理
const errorHandler = async (error: any) => {
  console.error('请求错误:', error)

  // 如果是401错误，尝试刷新token
  if (error.statusCode === HTTP_STATUS.UNAUTHORIZED) {
    try {
      const newToken = await refreshToken()
      if (newToken) {
        // 重新发起请求
        // 这里可以实现重试机制
        throw new Error('请重新登录')
      }
    } catch (refreshError) {
      // 刷新失败，清除token并跳转登录页
      removeToken()
      uni.showToast({
        title: '登录已过期，请重新登录',
        icon: 'none'
      })

      // 跳转到登录页
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/login/index'
        })
      }, 1500)
    }
  }

  // 显示错误信息
  uni.showToast({
    title: error.message || '网络请求失败',
    icon: 'none'
  })

  throw error
}

// 封装uni.request
export const request = (options: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const requestUrl = isAbsoluteUrl(options.url)
      ? options.url
      : `${config.baseURL}${config.apiVersion}${options.url}`

    if (!isApiDomainAllowed(requestUrl)) {
      reject(new Error(`请求域名不在白名单中: ${requestUrl}`))
      return
    }

    // 应用请求拦截器
    const interceptedOptions = requestInterceptor({
      ...options,
      security: config.security,
      url: requestUrl,
      header: {
        'Content-Type': 'application/json',
        ...options.header
      }
    })

    uni.request({
      ...interceptedOptions,
      success: (response: any) => {
        try {
          const result = responseInterceptor(response)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      },
      fail: (error: any) => {
        reject(error)
      }
    })
  }).catch(errorHandler)
}

// 导出常用的请求方法
export const get = (url: string, params?: any, options?: any) => {
  return request({
    url,
    method: 'GET',
    data: params,
    ...options
  })
}

export const post = (url: string, data?: any, options?: any) => {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  })
}

export const put = (url: string, data?: any, options?: any) => {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  })
}

export const del = (url: string, options?: any) => {
  return request({
    url,
    method: 'DELETE',
    ...options
  })
}

export const patch = (url: string, data?: any, options?: any) => {
  return request({
    url,
    method: 'PATCH',
    data,
    ...options
  })
} 