import * as React from "react";
import Avatar from "@mui/material/Avatar";
import "./UserSearchCardStyle.scss";
import "./ChatCardStyle.scss";
import Contex from "../../store/Context";
import {
  SetIdConversation,
  SetSearchedUser,
  SetSearchingStatus,
  SetShowTabHistorySearch,
  SetUserChatting,
} from "../../store/Actions";
import UserSearchedService from "../../services/UserSearchedService";
import conversationApi from "../../api/conversationApi";

const UserSearchCard = ({ u }) => {

  const { state, depatch } = React.useContext(Contex);
  //detructering...
  const {
    userChatting,
    searchingStatus,
    user,
    showTabHistorySearch,
    searchedUsers,
    idConversation,
  } = state;
  //console.log(userChatting);
  //delete user out the history search
  const handleCancel = () => {
    // alert(u.uid);
    //khong phai trang thai tim kiem
    if (!searchingStatus) {
      UserSearchedService.getById(user.uid).then(function (snapshot) {
        const { users } = snapshot.data();
        // console.log(snapshot.data());

        //xoa user co theo id khoi array
        const newUsers = users.filter((val, idx) => {
          return val.email !== u.email;
        });
        //console.log(newUsers);
        const object = {
          users: newUsers,
        };

        UserSearchedService.create(user.uid, object).then(function (snapshot) {
          console.log("2-succesfully!!!");
          depatch(SetSearchedUser(newUsers));
        });
      });
    }
  };

  //click -> chat

  //10/11/2022 - 10:17 am
  //auth: Anh Nguyen
  const handleChat = () => {
   // console.log(u);
    //có 2 trường hợp:
    //TH1: click vào user dang tìm kiếm -> add user đó vào lịch sử tìm kiếm -> mở cuộc hội thoại
    //đang tìm kiếm: searchingStatus = true
    if (searchingStatus) {
      //thêm user đang tìm kiếm vào lịch sử tìm kiếm
      UserSearchedService.getById(user.uid).then(function (snapshot) {
        //console.log(snapshot.data());
        if (!snapshot.data()) {
          const object = {
            users: [u],
          };

          UserSearchedService.create(user.uid, object).then(function (
            snapshot
          ) {
            console.log("1-succesfully!!!");
            depatch(SetIdConversation(null));
          });
        } else {
          const { users } = snapshot.data();
          // console.log(snapshot.data());
          const USERS = [...users, u];
          // console.log(USERS);
          //loc nhung user trung nhau

          const newUsers = USERS.filter((val, idx) => {
            return idx === USERS.findIndex((v) => val.email === v.email);
          });
          //console.log(newUsers);
          const object = {
            users: newUsers,
          };

          UserSearchedService.create(user.uid, object).then(function (
            snapshot
          ) {
            console.log("2-succesfully!!!");
           // depatch(SetIdConversation(null));
          });
        }
      });

      depatch(SetSearchingStatus(false));
    }

    //featch id conversation with id sender: user and receiver : u
    const featchConversation = async () => {
      try {
        const response = await conversationApi.getConversation(user.uid, u.uid);
        console.log(response);
        if (response.data === false) {
          console.log("chua co ");
          depatch(SetIdConversation(null));
        } else {
          depatch(SetIdConversation(response));
        }

        //set userChangting = user currently clicked
        depatch(SetUserChatting(u));
      } catch (error) {
        console.log("Failed to fetch conversation id: ", error);
      }
    };

    featchConversation();

    //đóng tab tìm kiếm
    // depatch(SetShowTabHistorySearch(false));
    // console.log("Click user card");
  };

  return (
    <div className="card_chat" key={u?.email}>
      <div
        className="card_group"
        style={{ alignItems: "normal" }}
        onClick={() => handleChat()}
      >
        {u?.avatar ? (
          <Avatar className="avatar" src={u?.avatar} alt={u?.first_name} />
        ) : (
          <Avatar
            className="avatar"
            style={{ textTransform: "capitalize" }}
            src={u?.avatar}
          >
            {u?.last_name[0]}
          </Avatar>
        )}

        <div className="card_name" style={{ marginLeft: "0" }}>
          <p style={{ textTransform: "capitalize" }}>
            {u?.last_name + " " + u?.first_name}
          </p>
        </div>
      </div>
      <div className="cancel_icon" onClick={() => handleCancel()}>
        x
      </div>
    </div>
  );
};

export default UserSearchCard;
