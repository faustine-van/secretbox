
import { useDrag, useDrop } from 'react-dnd';

export function useDragAndDrop({
  item,
  onDrop,
}: {
  item: { id: string; type: string };
  onDrop: (item: { id: string; type: string }) => void;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: item.type,
    item: { id: item.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: item.type,
    drop: () => onDrop(item),
  }));

  return { isDragging, drag, drop };
}
