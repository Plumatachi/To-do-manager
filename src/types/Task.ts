import { Status } from "./Status";

export interface Task {
    id: string;
    title: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
    subtasks: Task[];
}
