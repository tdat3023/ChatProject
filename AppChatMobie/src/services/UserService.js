import { db } from "../firebase/firebaseDB";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore/lite";
import Contex from "../store/Context";
import React from "react";
import { SetUserSearched } from "../store/Actions";

// const users = collection(db, "users");

const getById = async (id) => {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // return docSnap.data();
    console.log("Document data:", docSnap.data());
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
};

const getUserByEmail = async (email) => {
  const { state, depatch } = React.useContext(Contex);
  const { user, userSearched, idConversation, userChatting } = state;
  const newArr = [];

  const q = query(collection(db, "users"), where("email", "==", email));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    //console.log(doc.id, " => ", doc.data());
    newArr.push(doc.data());
  });
  console.log(newArr);
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
