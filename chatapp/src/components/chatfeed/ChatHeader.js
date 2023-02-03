import "./ChatHeaderStyle.scss";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import { BsLayoutSidebarReverse } from "react-icons/bs";
import { BsCameraVideo } from "react-icons/bs";
import { FiUserPlus } from "react-icons/fi";
import { FiUserX } from "react-icons/fi";
import friendApi from "../../api/friendApi";
import { FiUserCheck } from "react-icons/fi";

import Context from "../../store/Context";
import { SetShowTabInfo } from "../../store/Actions";
import ModelDetailUser from "../model/ModelDetailUser";
import love from "../../images/love.jpg";
import { format } from "timeago.js";

import useFriendHook from "../../hooks/useFriendHook";

import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import AvatarUserOnline from "../avatar/AvatarUserOnline";

const ChatHeader = ({ userChatting, socket }) => {
  const { featchAddFriend } = useFriendHook();

  const { state, depatch } = React.useContext(Context);
  const [openModelUser, setOpenModelUser] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(false);
  const [lastLogin, setLastLogin] = React.useState("");
  const [reqFriend, setReqFriend] = React.useState(false);
  const [isCheck, setIsCheck] = React.useState(false);
  const [isFriend, setIsFriend] = React.useState(false);

  //detructering...
  const { showTabInfo, idConversation, user, groupChatting } = state;

  const handleShowTabInfo = () => {
    depatch(SetShowTabInfo(!showTabInfo));
  };
  const handleShowInfo = (params) => {
    setOpenModelUser(true);
  };

  const handleAddFriend = (params) => {
    console.log("add friend");

    // setReqFriend(true);
    const featchAddFriend = async (userId, freId) => {
      try {
        const response = await friendApi.sendInvite(userId, freId);
        console.log("stat::", response);
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    };

    featchAddFriend(user.uid, userChatting.uid).then((res) => {
      socket?.current.emit("handle-request-friend", {
        idUser: user.uid,
        idFriend: userChatting.uid,
        idCon: idConversation,
      });
    });
  };

  const handleCancleFriend = (params) => {
    const featchDeleteInvite = async (userId, freId) => {
      try {
        const response = await friendApi.deleteInvite(userId, freId);
        console.log("re:::", response);
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    };

    featchDeleteInvite(user.uid, userChatting.uid);
    console.log("cancle friend");
    socket?.current.emit("handle-request-friend", {
      idUser: user.uid,
      idFriend: userChatting.uid,
      idCon: idConversation,
    });
  };

  const handleAcceptFriend = () => {
    // setIsCheck(false);
    // setReqFriend(false);
    // setIsFriend(true);
    const featchAcceptInvite = async (userId, freId) => {
      try {
        const response = await friendApi.acceptFriend(userId, freId);
        // console.log("re:::",response);
        return response;
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    };

    featchAcceptInvite(user.uid, userChatting.uid).then((res) => {
      console.log("res::", res.message);
      socket?.current.emit("handle-request-friend", {
        idUser: user.uid,
        idFriend: userChatting.uid,
        idCon: idConversation,
        message: res.message,
      });
    });
    console.log("accept friend");
  };

  React.useEffect(() => {
    if (idConversation) {
      socket?.current.emit(
        "get-user-online",
        userChatting.uid,
        ({ isOnline, lastLogin }) => {
          setIsOnline(isOnline);
          setLastLogin(lastLogin);
          console.log(userChatting.uid, isOnline, lastLogin);
        }
      );

      socket?.current.on("update-status", ({ idUser, idFriend }) => {
        console.log("update-status", idUser, idFriend);
        const checkStatus = async (userId, freId) => {
          try {
            const response = await friendApi.checkStatus(userId, freId);
            console.log("res:::", response);
            if (response !== "friend" && response !== "none") {
              if (response.receiverId === user.uid) {
                setIsCheck(true);
                console.log("friend receiver ");
              } else if (response.senderId === user.uid) {
                setIsFriend(false);
                setIsCheck(false);
                setReqFriend(true);
              }
            } else if (response === "friend") {
              setIsCheck(false);
              setIsFriend(true);
            } else {
              setIsCheck(false);
              setReqFriend(false);
              setIsFriend(false);
            }
          } catch (error) {
            console.log("Failed to fetch conversation list: ", error);
          }
        };
        checkStatus(idUser, idFriend);
      });
    }
  }, [idConversation]);

  React.useEffect(() => {
    const checkStatus = async (userId, freId) => {
      try {
        const response = await friendApi.checkStatus(userId, freId);
        console.log("res:::", response);
        if (response !== "friend" && response !== "none") {
          if (response.receiverId === user.uid) {
            setIsCheck(true);
            // setReqFriend(true);
            console.log("friend receiver ");
          } else if (response.senderId === user.uid) {
            setIsFriend(false);
            setIsCheck(false);
            setReqFriend(true);
          }
        } else if (response === "friend") {
          setIsCheck(false);
          setIsFriend(true);
          // setIsCheck(false);
          // setReqFriend(false);
        } else {
          setIsCheck(false);
          setReqFriend(false);
          setIsFriend(false);
        }
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    };
    checkStatus(user.uid, userChatting.uid);
  }, [idConversation]);

  const paseDate = format(lastLogin, "vi_VN");
  //console.log(paseDate);

  return (
    <div className="chat_header">
      <div className="chat_header-info">
        {/* {userChatting?.avatar ? (
          <React.Fragment>
            <div className="info_block">
              <Avatar
                className="avt"
                src={userChatting?.avatar}
                alt={userChatting?.first_name}
                onClick={() => handleShowInfo()}
                style={{ backgroundColor: "#e7f0ce" }}
              />
              {isOnline ? <div className="statusOnline"></div> : null}
            </div>
          </React.Fragment>
        ) : (
          <div className="info_block">
            <Avatar
              className="avt"
              style={{ textTransform: "capitalize" }}
              src={userChatting?.avatar}
              onClick={() => handleShowInfo()}
            >
              {userChatting?.last_name[0]}
            </Avatar>
            {isFriend ? (
              <React.Fragment>
                {isOnline ? <div className="statusOnline"></div> : null}
              </React.Fragment>
            ) : null}
          </div>
        )} */}

        <AvatarUserOnline
          userChatting={userChatting}
          isOnline={isOnline}
          isFriend={isFriend}
        />

        <div className="info_text">
          <span className="info_name">
            {userChatting?.first_name + " " + userChatting?.last_name}
          </span>
          {/* // <span className="info_online">{isOnline ? "0" : "1"}</span> */}

          {isFriend ? (
            <span className="info_hour">
              {isOnline ? "Vừa truy cập" : "" + paseDate}
            </span>
          ) : (
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "2px 6px",
                marginTop: "4px",
                borderRadius: "6px",
                backgroundColor: "#abb4bc",
                color: "#fff",
                textTransform: "capitalize",
                fontSize: "10px",
              }}
            >
              Người lạ
            </span>
          )}
        </div>
      </div>
      <ModelDetailUser
        openModelUser={openModelUser}
        setOpenModelUser={setOpenModelUser}
        friend
      />

      <div className="block_icon">
        {isCheck ? (
          <span className="icon">
            <FiUserCheck
              title="Chấp nhận lời mời kết bạn"
              onClick={() => handleAcceptFriend()}
            />
          </span>
        ) : isFriend ? null : (
          <span className="icon">
            {reqFriend ? (
              <FiUserX
                title="Hủy lời mời"
                onClick={() => handleCancleFriend()}
              />
            ) : (
              <FiUserPlus
                title="Gửi lời mời kết bạn"
                onClick={() => handleAddFriend()}
              />
            )}
          </span>
        )}
        <span className="icon" title="Cuộc gọi video">
          <BsCameraVideo />
        </span>
        <span
          className={showTabInfo ? "icon choise" : "icon"}
          title="Thông tin hội thoại"
          onClick={() => handleShowTabInfo()}
        >
          <BsLayoutSidebarReverse />
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;
