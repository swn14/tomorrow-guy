export interface ITodo {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  dueDate: Date;
  createdDate?: Date;
  updatedDate?: Date;
}
