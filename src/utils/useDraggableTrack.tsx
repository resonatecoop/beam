import React from "react";
import { useGlobalStateContext } from "contexts/globalState";

const useDraggableTrack = () => {
  const { dispatch } = useGlobalStateContext();
  const onDragStart = React.useCallback(
    (ev: React.DragEvent<HTMLElement>) => {
      dispatch({
        type: "setDraggingTrackId",
        draggingTrackId: ev.currentTarget.id,
      });
    },
    [dispatch]
  );

  const onDragEnd = React.useCallback(() => {
    dispatch({ type: "setDraggingTrackId", draggingTrackId: undefined });
  }, [dispatch]);

  return {
    onDragStart,
    onDragEnd,
  };
};

export default useDraggableTrack;
