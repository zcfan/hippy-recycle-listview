import {
  LayoutChangeEvent,
  ScrollEvent,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from '@hippy/react'
import { forwardRef, ReactNode, useRef, useState } from 'react'

import { Api, useExposeApi, useListViewHeight } from './hooks'
import useRecycle from './use-recycle'
import useVisibleRange from './use-visible-range'

interface Props {
  style?: StyleProp<ViewStyle>
  scrollEventThrottle?: number
  numberOfRows: number
  rowHeight: number
  renderRow: (index: number) => ReactNode
  getRowType: (index: number) => string
  onLayout?: (event: LayoutChangeEvent) => void
  onScrollBeginDrag?: (e: ScrollEvent) => void
  onScrollEndDrag?: (e: ScrollEvent) => void
  onScroll?: (e: ScrollEvent) => void
  onVisibleRangeChange?: (range: number[]) => void
}

const HippyRecycleListView = forwardRef<Api, Props>(
  function HippyRecycleListView(
    {
      rowHeight,
      numberOfRows,
      renderRow,
      getRowType,
      onLayout,
      onScroll,
      ...restProps
    },
    apiRef,
  ) {
    const ref = useRef<ScrollView>(null)
    const totalHeight = numberOfRows * rowHeight

    useExposeApi(ref, apiRef, rowHeight)
    const [visibleRowIndexes, updateYOffset, updateScrollViewHeight] = useVisibleRange({ numberOfRows, rowHeight})
    const recycleRowItems = useRecycle(visibleRowIndexes, getRowType)

    const handleLayout = (event: LayoutChangeEvent) => {
      updateScrollViewHeight(event.layout.height)
      onLayout?.(event)
    }

    const handleScroll = (event: ScrollEvent) => {
      updateYOffset(event.contentOffset.y)
      onScroll?.(event)
    }

    return (
      <ScrollView
        ref={ref}
        onLayout={handleLayout}
        onScroll={handleScroll}
        contentContainerStyle={{ height: totalHeight }}
        {...restProps}
      >
        {recycleRowItems.map(({ index, key, isReleased }) => (
          <View
            key={key}
            style={{
              ...styles.row,
              // 待复用的 JSX Element 放在不可见的地方
              top: isReleased ? -99999 : index * rowHeight,
              zIndex: index,
            }}
          >
            {renderRow(index)}
          </View>
        ))}
      </ScrollView>
    )
  },
)

export default HippyRecycleListView

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
})
