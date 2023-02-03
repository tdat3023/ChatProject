import "./index.scss";

import * as React from "react";
import Contex from "../../store/Context";
import { useContext } from "react";
import Avatar from "@mui/material/Avatar";
import {
  SetGroupChatting,
  SetIdConversation,
  SetShowListRequestFriend,
  SetUserChatting,
} from "../../store/Actions";
import conversationApi from "../../api/conversationApi";
import UserService from "../../services/UserService";

const FriendCard = (item) => {
  const { state, depatch } = React.useContext(Contex);
  //detructering...
  const { userChatting, user, showListRequestFriend } = state;

  const handleChat = () => {
    // console.log(item?.item?.userId);
    //featch id conversation with id sender: user and receiver : u
    //delete groupChitting
    depatch(SetGroupChatting(null));

    const featchConversation = async () => {
      try {
        const response = await conversationApi.getConversation(
          user.uid,
          item?.item?.userId
        );
        console.log(response);
        if (response.data === false) {
          console.log("chua co ");
          depatch(SetIdConversation(null));
        } else {
          depatch(SetIdConversation(response));
        }

        //featch user by id
        UserService.getById(item?.item?.userId)
          .then(function (snapshot) {
            // const { users } = snapshot.data();
            // console.log(snapshot.data());

            //set state
            depatch(SetUserChatting(snapshot.data()));
            depatch(SetShowListRequestFriend(false));
          })
          .catch((err) => {
            console.log(err.message);
          });
      } catch (error) {
        console.log("Failed to fetch conversation id: ", error);
      }
    };

    featchConversation();
  };
  // console.log(item);
  return (
    <div
      className="f_card"
      onClick={() => handleChat()}
      key={item?.item?.userId}
    >
      {item?.item?.avaUser ? (
        <Avatar
          className="avt"
          src={item?.item?.avaUser}
          alt="image"
          style={{
            width: "46px",
            height: "46px",
          }}
        />
      ) : (
        <Avatar
          className="avt"
          style={{
            textTransform: "capitalize",
            backgroundColor: "#055E68",
            width: "46px",
            height: "46px",
          }}
          src={item?.item?.avaUser}
        >
          {item?.item?.userLastName[0]}
        </Avatar>
      )}
      <p>{item?.item?.userFistName + " " + item?.item?.userLastName}</p>
    </div>
  );
};

export default FriendCard;
