import { mongodb } from "../../server/deps";

interface Revoke {
  _id?: mongodb.ObjectId | string;
  user_id: mongodb.ObjectId | string;
  jwt_id: `${string}-${string}-${string}-${string}-${string}`;
  login_at: Date;
  expired_at: Date;
}

export default Revoke;
