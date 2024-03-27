export interface ITodo {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  createdDate?: Date;
  updatedDate?: Date;
}
