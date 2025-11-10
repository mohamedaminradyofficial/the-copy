"use client";

import React, { useRef, useEffect, useState } from "react";
import { FixedSizeGrid } from "react-window";

interface VirtualizedGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  columnCount?: number;
  itemHeight?: number;
  itemWidth?: number;
  gap?: number;
  className?: string;
  overscanRowCount?: number;
}

export function VirtualizedGrid<T>({
  items,
  renderItem,
  columnCount = 3,
  itemHeight = 400,
  itemWidth = 350,
  gap = 16,
  className = "",
  overscanRowCount = 2,
}: VirtualizedGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 1200,
    height: 800,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = Math.min(
          window.innerHeight - 200,
          Math.max(600, window.innerHeight * 0.7)
        );
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // حساب عدد الأعمدة بناءً على عرض الحاوية
  const dynamicColumnCount = Math.max(
    1,
    Math.floor((dimensions.width - gap) / (itemWidth + gap))
  );

  const actualColumnCount = Math.min(columnCount, dynamicColumnCount);
  const rowCount = Math.ceil(items.length / actualColumnCount);

  // دالة عرض الخلية
  const Cell = ({
    columnIndex,
    rowIndex,
    style,
  }: {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
  }) => {
    const index = rowIndex * actualColumnCount + columnIndex;
    if (index >= items.length) return null;

    const item = items[index];

    return (
      <div
        style={{
          ...style,
          left: Number(style.left) + gap / 2,
          top: Number(style.top) + gap / 2,
          width: Number(style.width) - gap,
          height: Number(style.height) - gap,
        }}
      >
        {renderItem(item, index)}
      </div>
    );
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className={className} style={{ width: "100%" }}>
      <FixedSizeGrid
        columnCount={actualColumnCount}
        columnWidth={itemWidth + gap}
        height={dimensions.height}
        rowCount={rowCount}
        rowHeight={itemHeight + gap}
        width={dimensions.width}
        overscanRowCount={overscanRowCount}
        style={{ direction: "rtl" }}
      >
        {Cell}
      </FixedSizeGrid>
    </div>
  );
}
