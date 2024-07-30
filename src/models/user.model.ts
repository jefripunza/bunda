import { mongodb } from "../../server/deps";

interface User {
  _id?: mongodb.ObjectId | string;
  name: string;
  username: string;
  password: string;
  role: mongodb.ObjectId | string;
}

export default User;
