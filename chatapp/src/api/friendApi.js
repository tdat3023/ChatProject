import axiosClient from "./axiosClient";
import axios from "axios";

const friendApi = {
  getListFriend: (id) => {
    const url = `friends/list/${id}`;
    return axiosClient.get(url);
  },

  getListRequest: (id) => {
    const url = `friends/invites/${id}`;
    return axiosClient.get(url);
  },

  acceptFriend: (id, freId) => {
    return axiosClient.post(`friends/${freId}`, {
      id: id,
    });
  },

  sendInvite: (id, freId) => {
    return axiosClient.post(`friends/invites/me/${freId}`, {
      id: id,
    });
  },
  checkStatus: (id, freId) => {
    return axiosClient.get(`friends/check?userId=${id}&friendId=${freId}`);
  },

  deleteInvite: (userId, freId) => {
    // return axiosClient.delete(`friends/invites/${freId}`, {
    //     data: { id: userId },
    // });
    return axiosClient.delete(`friends/deleteInvite/${userId}`, {
      data: { id: freId },
    });
  },
};

export default friendApi;
