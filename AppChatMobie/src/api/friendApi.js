import axiosClient from "./axiosClient";

const friendApi = {
  getListInvite: (uid) => {
    const url = `/friends/invites/${uid}`;
    return axiosClient.get(url);
  },
  deleteInvite: (userId, freId) => {
    return axiosClient.delete(`friends/deleteInvite/${freId}`, {
      data: { id: userId },
    });
  },
  acceptFriend: (id, inviteId) => {
    return axiosClient.post(`friends/${inviteId}`, {
      id: id,
    });
  },
  getListFriend: (id) => {
    const url = `friends/list/${id}`;
    return axiosClient.get(url);s
  },
};

export default friendApi;
