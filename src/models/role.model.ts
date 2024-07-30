import { mongodb } from "../../server/deps";

interface Role {
  _id?: mongodb.ObjectId | string;
  name: string;
  is_active: boolean;
}

export default Role;
