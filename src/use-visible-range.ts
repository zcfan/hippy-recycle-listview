import { useState } from "react"

export default function useVisibleRange(
  {rowHeight, numberOfRows}: {
    rowHeight: number
    numberOfRows: number
  },
) {
  const [scrollViewHeight, updateScrollViewHeight] = useState(0)
  const [yOffset, updateYOffset] = useState(0)

  if (scrollViewHeight <= 0) return []

  const up = Math.max(0, yOffset)
  const down = Math.max(0, yOffset + scrollViewHeight)

  // 可见区域上边、下边的下标
  const upIndex = Math.floor(up / rowHeight)
  const downIndex = Math.min(numberOfRows, Math.floor(down / rowHeight))

  // 所有可见行的序号，便于编写 jsx
  const visibleRange = new Array(downIndex + 1 - upIndex)
    .fill(0)
    .map((_, index) => index + upIndex)

  return [visibleRange, updateYOffset, updateScrollViewHeight] as const
}