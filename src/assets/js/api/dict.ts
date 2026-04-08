// 数据字典
import { get , post} from '../request'
import type { reqStatus } from '@/types/api/dict'

/**
 * 获取消息跳转类型分类
 */
export const getDictJumpType = async (params: reqStatus) => {
    return post('/app/dict/info/data', params)
}