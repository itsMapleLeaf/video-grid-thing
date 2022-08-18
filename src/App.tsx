import { useState } from "react"
import useMeasure from "react-use-measure"

export default function App() {
  const [cellCount, setCellCount] = useState(1)
  const [ref, rect] = useMeasure()
  const gap = 16

  const columnCount = getFittingColumnCount(
    cellCount,
    rect.width,
    rect.height,
    gap,
  )

  const rowCount = Math.ceil(cellCount / columnCount)

  const gridWidth = rect.width

  const cellWidth = (gridWidth - gap * (columnCount - 1)) / columnCount
  const cellHeight = cellWidth * (9 / 16)
  const gridHeight = cellHeight * rowCount + gap * (rowCount - 1)

  const containScale = Math.min(
    rect.width / gridWidth,
    rect.height / gridHeight,
  )

  return (
    <div className="absolute inset-0 flex flex-col">
      <header className="flex p-3 gap-3">
        <button
          className="bg-green-600 py-2 px-4 leading-none rounded-md"
          onClick={() => setCellCount(Math.max(cellCount - 1, 1))}
        >
          -
        </button>
        <button
          className="bg-green-600 py-2 px-4 leading-none rounded-md"
          onClick={() => setCellCount(cellCount + 1)}
        >
          +
        </button>
      </header>
      <main
        ref={ref}
        className="flex-1 flex flex-col bg-gray-800 overflow-hidden"
      >
        <div
          className="m-auto flex flex-wrap items-start content-start justify-center"
          style={{
            gap,
            width: gridWidth * containScale,
            height: gridHeight * containScale,
          }}
        >
          {Array.from({ length: cellCount }, (_, i) => (
            <div
              key={i}
              style={{ width: `calc(${100 / columnCount}% - ${gap}px)` }}
              className="aspect-video border-2 border-gray-500 rounded-lg"
            />
          ))}
        </div>
      </main>
    </div>
  )
}

function getFittingColumnCount(
  cellCount: number,
  viewportWidth: number,
  viewportHeight: number,
  gap: number,
) {
  return getFittingColumnCountRecursive(
    cellCount,
    viewportWidth,
    viewportHeight,
    gap,
    1,
  )
}

function getFittingColumnCountRecursive(
  cellCount: number,
  viewportWidth: number,
  viewportHeight: number,
  gap: number,
  currentColumnCount: number,
): number {
  // should't have more columns than cells (also prevents infinite loop)
  if (currentColumnCount > cellCount) {
    return cellCount
  }

  const cellHeight = (viewportWidth / currentColumnCount) * (9 / 16)
  const rowCount = Math.ceil(cellCount / currentColumnCount)
  const gridHeight = rowCount * cellHeight + (rowCount - 1) * gap

  if (gridHeight < viewportHeight) {
    return currentColumnCount
  }

  return getFittingColumnCountRecursive(
    cellCount,
    viewportWidth,
    viewportHeight,
    gap,
    currentColumnCount + 1,
  )
}
