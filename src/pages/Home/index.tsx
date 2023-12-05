import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { mockData } from "../../utils/mock";
import { KanbanColumn } from "../../components/KanbanBoard";
import {
  KanbanColumnTypes,
  KanbanDataTypes,
  KanbanItemTypes,
} from "../../types";
import { useGetColumns, useGetKanbanTasks, useGetTasks } from "../../hooks";
import { generateKanbanData } from "../../utils/tasks";
import { useDispatch } from "react-redux";

import { setKanbanData } from "../../store/tasks";

const Home = () => {
  // const [project, setProject] = useState<KanbanDataTypes>(mockData);
  const dispatch = useDispatch();

  const [isNewModal, setIsNewModal] = useState(false);

  const tasks: KanbanItemTypes[] = useGetTasks();
  const columns: KanbanColumnTypes[] = useGetColumns();

  const kanbanTasks: KanbanDataTypes = useGetKanbanTasks();

  useEffect(() => {
    if (tasks.length && columns.length) {
      dispatch(setKanbanData(generateKanbanData(tasks, columns)));
    }
  }, [tasks, columns]);

  const handleNew = () => {
    setIsNewModal(true);
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;

    let destinationArray = Array.from(kanbanTasks[destination.droppableId]);
    let sourceArray = Array.from(kanbanTasks[source.droppableId]);
    let newProjectData = { ...kanbanTasks };

    const itemInserted = sourceArray[source.index];

    sourceArray.splice(source.index, 1);
    destinationArray.splice(
      destination.index ?? destinationArray.length + 1,
      0,
      itemInserted
    );
    newProjectData = {
      ...newProjectData,
      [source.droppableId]: sourceArray,
      [destination.droppableId]: destinationArray,
    };

    dispatch(setKanbanData(newProjectData));
  };

  return (
    <div className="bg-gray-100 w-full h-full">
      <div className="content p-4">
        <div className="flex justify-between">
          <form className="w-96">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search Tasks..."
                required
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Search
              </button>
            </div>
          </form>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleNew}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            New Task
          </button>
        </div>
        <div className="flex">
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.entries(kanbanTasks).map(([key, value], index) => {
              return (
                <KanbanColumn
                  text={key}
                  lists={value}
                  key={`kanban-row-${index}`}
                />
              );
            })}
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default Home;
