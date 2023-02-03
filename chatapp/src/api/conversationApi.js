import axiosClient from "./axiosClient";

const conversationApi = {
  // GET: /conversation?senderID=Ix7UVDUIrmRYOB6uGFc715drn24&receiverID=ztpYIbpqoiYVDVsf0h9Clzg7QgW2
  //res: false or conversationID
  getConversation: (senderID, receiverID) => {
    //console.log(id);
    const url = `/conversation?senderID=${senderID}&receiverID=${receiverID}`;
    return axiosClient.get(url);
  },

  // GET:
  getConversations: (id, page, size) => {
    //console.log(id);
    const url = `/conversation/user/${id}?page=${page}&size=${size}`;
    return axiosClient.get(url);
    // return axiosClient.get(
    //   `http://13.228.206.211:3005/conversation/user/${id}`
    // );
    //http://13.228.206.211:3005/conversation/634c48221a479239b4810cb6
  },

  //[POST] /individuals/:userId`: Tạo cuộc trò chuyện cá nhân
  // -params:userId.
  // -body:userFriendId:(Ix7UVDUIrmRYOB6uGFc715drn2H3)

  createConversationIndividual: (meId, userFriendId) => {
    return axiosClient.post(`conversation/individuals/${meId}`, {
      userFriendId: userFriendId,
    });
  },

  // [POST] /coversation/groups
  createConversation: (temp) => {
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

  getListMember: (idConversation) => {
    return axiosClient.get(`conversation/members/${idConversation}`);
  },


  leaveGroup: (idConversation,idUser) => {
    console.log("idCOnversiot:", idUser);
    return axiosClient.delete(`conversation/leave/${idConversation}`,
    {
      data: { userId: idUser },
    }
    )
  },

  deleteAllMess: (idConversation,idUser) => {
    return axiosClient.delete(`conversation/${idConversation}/messages`,
    {
      data: { userId: idUser },
    }
    );
  },

  deleteGroup: (idConversation) => {
    return axiosClient.delete(`conversation/groups/${idConversation}`);
  },


  //[POST] add member into group
  addMember: (idConversation, idUserAdd, listMember) => {
    return axiosClient.post(`conversation/members/${idConversation}`, {
      userId: idUserAdd,
      members: listMember,
    });
  },

};

export default conversationApi;
