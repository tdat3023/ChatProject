import axiosClient from "./axiosClient";

const conversationApi = {
  // GET: /conversation?senderID=Ix7UVDUIrmRYOB6uGFc715drn24&receiverID=ztpYIbpqoiYVDVsf0h9Clzg7QgW2
  //res: false or conversationID
  getConversation: (senderID, receiverID) => {
    //console.log(id);
    const url = `/conversation?senderID=${senderID}&receiverID=${receiverID}`;
    return axiosClient.get(url);
  },

  //[GET] get details of the conversation
  //https://13.212.137.7/conversation/individuals/new?senderID=dP2GR6FMv1fJG40SK9CXeZlbLCo2&receiverID=HiIaKOEh8qTzOfTF1Va0Z6z61Qz2
  //param: senderID, receiverID
  //respone: a converstion

   getConversationDetails: (senderID, receiverID) => {
    //console.log(id);
    const url = `/conversation/individuals/new?senderID=${senderID}&receiverID=${receiverID}`;
    return axiosClient.get(url);
  },
  
  // GET:
  getConversations: (id, page, size) => {
    //console.log(id);
    const url = `/conversation/user/${id}?page=${page}&size=${size}`;
    // console.log(url);
    return axiosClient.get(url);
  },

  //[POST] /individuals/:userId`: Tạo cuộc trò chuyện cá nhân
  // -params:userId.
  // -body:userFriendId:(Ix7UVDUIrmRYOB6uGFc715drn2H3)

  createConversation: (meId, userFriendId) => {
    return axiosClient.post(`conversation/individuals/${meId}`, {
      userFriendId: userFriendId,
    });
  },

  getListMember: (idConversation) => {
    return axiosClient.get(`conversation/members/${idConversation}`);
  },

  // [POST] /coversation/groups
  createConversationGroup: (temp) => {
    return axiosClient.post("conversation/groups", temp);
  },

  // [DELETE] /coversation/groups
  kickUserOutGroup: (idConversation, idLeader, idUserKicked) => {
    console.log("idCOnversiot:", idConversation);
    console.log("idLeader:", idLeader);
    console.log("idUserKicked:", idUserKicked);
    return axiosClient.delete(
      `conversation/members/${idConversation}/${idUserKicked}`,
      {
        data: { userId: idLeader },
      }
    );
  },

  //[POST] add member into group
  addMember: (idConversation, idUserAdd, listMember) => {
    return axiosClient.post(`conversation/members/${idConversation}`, {
      userId: idUserAdd,
      members: listMember,
    });
  },
  leaveGroup: (idConversation, idUser) => {
    console.log("idCOnversiot:", idUser);
    return axiosClient.delete(`conversation/leave/${idConversation}`, {
      data: { userId: idUser },
    });
  },

  deleteAllMess: (idConversation, idUser) => {
    return axiosClient.delete(`conversation/${idConversation}/messages`, {
      data: { userId: idUser },
    });
  },

  deleteGroup: (idConversation) => {
    return axiosClient.delete(`conversation/groups/${idConversation}`);
  },
};

export default conversationApi;
