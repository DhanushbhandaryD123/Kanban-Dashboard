import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column";

export default function Board({
  columns,
  tasks,
  setTasks,
  onMove,
  onAddTask,
  onOpenTask,
}) {

  const tasksByColumn = (columnId) => {
    return tasks
      .filter((task) => (task.column?._id || task.column) === columnId)
      .sort((a, b) => a.order - b.order);
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const movedTask = tasks.find((task) => task._id === draggableId);

    if (!movedTask) return;

    const remaining = tasks.filter((task) => task._id !== draggableId);

    const destinationTasks = remaining
      .filter(
        (task) =>
          (task.column?._id || task.column) === destination.droppableId
      )
      .sort((a, b) => a.order - b.order);

    const updatedTask = {
      ...movedTask,
      column: destination.droppableId,
    };

    destinationTasks.splice(destination.index, 0, updatedTask);

    const reordered = destinationTasks.map((task, index) => ({
      ...task,
      order: index,
    }));

    const otherTasks = remaining.filter(
      (task) =>
        (task.column?._id || task.column) !== destination.droppableId
    );

    setTasks([...otherTasks, ...reordered]);

    if (onMove) {
      onMove({
        taskId: draggableId,
        toColumn: destination.droppableId,
        orderedIds: reordered.map((task) => task._id),
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-5 h-full overflow-x-auto pb-4 px-5 md:px-8">
        {columns.map((column) => (
          <Column
            key={column._id}
            column={column}
            tasks={tasksByColumn(column._id)}
            onAddTask={onAddTask}
            onOpenTask={onOpenTask}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
