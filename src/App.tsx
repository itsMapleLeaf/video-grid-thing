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

  // we can get the ratio of the rect to the grid to scale it down,
  // then only use the smallest number to contain it within the viewport
  // (this is how "contain" scaling works)
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
      <div className="flex-1 p-4 min-h-0 bg-gray-800">
        <main ref={ref} className="h-full flex flex-col overflow-hidden">
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
                style={{
                  width: `calc(${100 / columnCount}% - ${
                    // this is fucking cursed
                    // we can't just subtract the gap because we need it to be minus one
                    // so we have to take a chip out of the gap that's like...
                    // the fraction of the whole thing???
                    gap * ((columnCount - 1) / columnCount)
                  }px)`,
                }}
                className="aspect-video border-2 border-gray-500 rounded-lg"
              />
            ))}
          </div>
        </main>
      </div>
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

  // if the grid can vertically fit within the viewport, then we're done, we have our column count
  if (gridHeight < viewportHeight) {
    return currentColumnCount
  }

  // if it cannot, the grid is too tall. we need to subtract another column to make it fit
  return getFittingColumnCountRecursive(
    cellCount,
    viewportWidth,
    viewportHeight,
    gap,
    currentColumnCount + 1,
  )
}
