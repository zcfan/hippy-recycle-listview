import { ScrollView } from '@hippy/react'
import { ForwardedRef, RefObject, useImperativeHandle, useState } from 'react'

/**
 * 用于同步 scrollView 的高度变化
 */
export function useListViewHeight() {
  return useState(0)
}

export type ScrollToIndex = ({ yIndex, animated }: {
  yIndex: number,
  animated: boolean
}) => void

export type ScrollToContentOffset = ({
  yOffset,
  animated,
}: {
  yOffset: number,
  animated: boolean
}) => void

export interface Api {
  scrollToIndex: ScrollToIndex
  scrollToContentOffset: ScrollToContentOffset
}

/**
 * 实现并提供 scrollTo 系列 api
 */
export function useExposeApi(
  ref: RefObject<ScrollView>,
  apiRef: ForwardedRef<Api>,
  rowHeight: number,
) {
  const scrollToIndex: ScrollToIndex = ({ yIndex, animated }) => {
    const y = yIndex * rowHeight
    scrollToContentOffset({ yOffset: y, animated })
  }

  const scrollToContentOffset: ScrollToContentOffset = ({
    yOffset,
    animated,
  }) => {
    ref.current?.scrollTo({
      x: 0,
      y: yOffset,
      animated,
    })
  }

  useImperativeHandle(apiRef, () => ({
    scrollToIndex,
    scrollToContentOffset,
  }))
}
