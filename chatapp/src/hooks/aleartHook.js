import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const aleartHook = () => {
  const notify = () =>
    toast("User đã tham gia nhóm!", {
      backgroundColor: "#72abff",
      color: "#ffffff",
    });

  const notifyAddFriend = () =>
    toast("Đã gửi lời mời kết bạn!", {
      backgroundColor: "#72abff",
      color: "#ffffff",
    });
  return {
    notify: notify,
    notifyAddFriend: notifyAddFriend,
  };
};

export default aleartHook;
