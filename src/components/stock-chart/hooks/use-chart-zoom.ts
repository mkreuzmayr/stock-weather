import { useCallback, useState } from 'react';
import { ChartDataPoint } from '../hooks/use-chart-data';

export type ZoomEventProps = {
  activeLabel?: string;
  activeCoordinate?: { x: number; y: number };
  activePayload?: { payload: ChartDataPoint }[];
  chartX?: number;
  chartY?: number;
};

export const useChartZoom = (fullChartData: ChartDataPoint[]) => {
  const [zoomState, setZoomState] = useState<{
    refAreaLeft: number | null;
    refAreaRight: number | null;
    zooming: boolean;
  }>({ refAreaLeft: null, refAreaRight: null, zooming: false });

  const handleZoomStart = useCallback((e: ZoomEventProps) => {
    if (!e || !e.activePayload?.[0]?.payload?.timestamp) return;
    const timestamp = e.activePayload[0].payload.timestamp;

    setZoomState({
      refAreaLeft: timestamp,
      refAreaRight: null,
      zooming: true,
    });
  }, []);

  const handleZoomMove = useCallback(
    (e: ZoomEventProps) => {
      if (!zoomState.zooming || !e || !e.activePayload?.[0]?.payload?.timestamp)
        return;
      const timestamp = e.activePayload[0].payload.timestamp;

      setZoomState((prev) => ({
        ...prev,
        refAreaRight: timestamp,
      }));
    },
    [zoomState.zooming]
  );

  const handleZoomEnd = useCallback(() => {
    if (
      !zoomState.zooming ||
      !zoomState.refAreaLeft ||
      !zoomState.refAreaRight
    ) {
      setZoomState({ refAreaLeft: null, refAreaRight: null, zooming: false });
      return;
    }

    const { refAreaLeft, refAreaRight } = zoomState;
    const startIndex = fullChartData.findIndex(
      (item) => item.timestamp >= Math.min(refAreaLeft, refAreaRight)
    );
    let endIndex = fullChartData.findIndex(
      (item) => item.timestamp > Math.max(refAreaLeft, refAreaRight)
    );
    if (endIndex === -1) endIndex = fullChartData.length;

    if (startIndex !== -1 && endIndex !== -1 && endIndex - startIndex >= 2) {
      return fullChartData.slice(startIndex, endIndex);
    }

    setZoomState({ refAreaLeft: null, refAreaRight: null, zooming: false });
    return null;
  }, [zoomState, fullChartData]);

  const resetZoom = useCallback(() => {
    setZoomState({ refAreaLeft: null, refAreaRight: null, zooming: false });
    return fullChartData;
  }, [fullChartData]);

  return {
    zoomState,
    handleZoomStart,
    handleZoomMove,
    handleZoomEnd,
    resetZoom,
  };
};
