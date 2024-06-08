import { Lesson } from "./lesson";

export interface User {
  userId: string;
  isAdmin: boolean;
  username: string;
  password: string;
  pickedLesson: Lesson[];
}
