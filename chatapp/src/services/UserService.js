import firebase from "../firebase";
import "firebase/compat/firestore";
const db = firebase.firestore().collection("/users");
const getById = (id) => {
  return db.doc(id).get();
};

const getUserByEmail = (email) => {
  return db.where("email", "==", email).get();
};

const create = (data, id) => {
  return db.doc(id).set(data);
};
const update = (id, value) => {
  return db.doc(id).update(value);
};
const remove = (id) => {
  return db.doc(id).delete();
};
const UserService = {
  getById,
  getUserByEmail,
  create,
  update,
  remove,
};
export default UserService;
