import axiosClient from "./axiosClient";
import axios from "axios";

const messageApi = {
  //conversation/634c48221a479239b4810cb6?receiverId=ztpYIbpqoiYVDVsf0h9Clzg7QgW2
  // GET: /conversation/:idConersation?receiverId
  //id: id conversation
  //uid: receiverId
  //res: list mess
  getMess: (id, uid, page, size) => {
    //console.log(id);
    const url = `/conversation/${id}?receiverId=${uid}&page=${page}&size=${size}`;
    return axiosClient.get(url);
  },

  addTextMess: (mess) => {
    const url = `/messages/text`;
    return axiosClient.post(url, mess);
  },

  addFileMess: (mess) => {
    const url = `/messages/files`;
    return axiosClient.post(url, mess);
  },

  //delete a message
  deleteMessage: (idMessage, idUser) => {
    const url = `/messages/deleteMessage`;
    return axiosClient.post(url, {
      idMessage: idMessage,
      userId: idUser,
    });
  },

  reMess: (id) => {
    const url = `/messages/reMessage`;
    return axiosClient.post(url, {
      idMessage: id,
    });
  },

  //reaction the meessage
  addReaction: (messId, urlIcon, userId, nameUser) => {
    const url = `/messages/addReact`;
    return axiosClient.post(url, {
      messId: messId,
      icon: urlIcon,
      userId: userId,
      nameUser: nameUser,
    });
  },

  //[GET] messages/getMessageByType/:idConversation/:type
  getMessWithType: (id, type) => {
    //console.log(id);
    const url = `/messages/getMessageByType/${id}/${type}`;
    return axiosClient.get(url);
  },
};
export default messageApi;
