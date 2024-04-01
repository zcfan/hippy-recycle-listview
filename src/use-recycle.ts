import { useMemo, useRef } from 'react'

type RecycleItem = {
  /**
   * 重用 key
   */
  key: string
  /**
   * 是否是被释放的 key（依然需要渲染，避免频繁销毁重建 View，但要放到不可见区域）
   */
  isReleased: boolean
  /**
   * 行号
   * 没用到的时候，要保持之前的行号，以维持稳定的视图树，避免后续重用时视图树变化太大影响重用效果
   */
  index: number
}

/**
 * 重用赛道 Row 视图的逻辑
 *
 * 这里的图太多了，滑动时频繁创建销毁会导致卡顿，而且会频繁触发 GC 导致一会出现一次 APP 完全卡住
 * 但因为 Hippy 原生的 ListView、WaterfallView 行、列之间会发生裁剪，导致无法实现本业务的设计稿，所以只能前端实现视图重用了
 *
 * 大致方法是渲染一批视图，通过稳定的 key 实现重用而非销毁重建。
 * 如果有视图暂时没用上，比如 pool 有 10 个，但当前可见范围只有 9 行，则多出来的一个定位到不可见区域
 *
 * Row 组件的 props 发生变化时，尽量避免子树发生较大变化，否则就会影响重用效率。
 *
 * 所以我的考虑是用不同的飞行器类型来作为 row type 的值，这样重用时，最主要的一批图片就不会有变化
 * - 飞行器基础图（大）
 * - 飞行器带尾焰图（大）
 * - 头像框
 * 会发生变化的有
 * - 宠物形象图片（也可能不变）
 * - 头像
 * - 家族名、里程数等文本信息（仅文本内容变化）
 */
export default function useRecycle(
  /**
   * 接下来要渲染的行序号
   */
  indexes: number[],
  getRowType: (index: number) => string,
): RecycleItem[] {
  const prevIndexesRef = useRef<number[]>([])
  const searchTableRef = useRef<Record<string, number | string>>({})
  const pool = useMemo(() => new KeysPool(), [])

  const newKeys: string[] = []
  const bothIndexes = new Set([...prevIndexesRef.current, ...indexes])
  for (const i of bothIndexes) {
    const type = getRowType(i)
    if (!indexes.includes(i)) {
      // 不再可见的 index
      const key = searchTableRef.current[i]
      pool.freeKey(key as string)
    } else if (!prevIndexesRef.current.includes(i)) {
      // 新增加的 index
      const key = pool.getKey(type)
      searchTableRef.current[i] = key
      searchTableRef.current[key] = i
      newKeys.push(key)
    }
    // else {
    //   // 不变的 index
    // }
  }
  prevIndexesRef.current = indexes

  const items = pool.getKeys().map(([key, isReleased]) => {
    const isNewKey = newKeys.includes(key)
    return {
      key,
      isNewKey,
      isReleased,
      index: searchTableRef.current[key],
    } as RecycleItem
  })

  return items
}

/**
 * 简单实现一个 key 池，只增不减，在飞车业务中没有问题。
 */
class KeysPool {
  private keys = new Set<string>()
  private freeKeys = new Set<string>()
  private incId = 0

  /**
   * 获取一个指定 type 的 key
   * 可能是复用的，如果没有可以复用的 key 则创建新的
   */
  public getKey(type: string) {
    const freeKey = this.findFirstFreeKey(type) || this.createNewKey(type)
    this.freeKeys.delete(freeKey)
    return freeKey
  }

  /**
   * 释放不再使用的 key
   */
  public freeKey(key: string) {
    if (this.keys.has(key)) this.freeKeys.add(key)
  }

  /**
   * 获取所有 key，用于渲染
   */
  public getKeys() {
    return [...this.keys].map((key) => [key, this.freeKeys.has(key)] as const)
  }

  private createNewKey(type: string) {
    const key = `${type}_${this.incId++}`
    this.keys.add(key)
    this.freeKeys.add(key)
    return key
  }

  private findFirstFreeKey(type: string) {
    for (const key of this.freeKeys) {
      if (key.indexOf(`${type}_`) === 0) return key
    }
  }
}
