import "./ChatHeaderStyle.scss";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import { BsLayoutSidebarReverse } from "react-icons/bs";
import { BsCameraVideo } from "react-icons/bs";
import Context from "../../store/Context";
import { SetShowTabInfo } from "../../store/Actions";
import ModelDetailUser from "../model/ModelDetailUser";
import love from "../../images/love.jpg";
import { format } from "timeago.js";
import { FaRegUser } from "react-icons/fa";
import avtGroup from "../../images/avtgroup.jpg";

const ChatHeaderGroup = ({ socket }) => {
  const { state, depatch } = React.useContext(Context);
  const [openModelUser, setOpenModelUser] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(false);
  const [lastLogin, setLastLogin] = React.useState("");

  //detructering...
  const { showTabInfo, idConversation, user, groupChatting } = state;

  const handleShowTabInfo = () => {
    depatch(SetShowTabInfo(!showTabInfo));
  };

  const handleShowInfo = (params) => {
    setOpenModelUser(true);
  };

  return (
    <div className="chat_header">
      <div className="chat_header-info">
        <div className="info_block">
          <Avatar
            className="avt"
            src={avtGroup}
            style={{ textTransform: "capitalize" }}
          ></Avatar>
        </div>

        <div className="info_text">
          <span className="info_name">{groupChatting?.name}</span>
          <span style={{ fontSize: "12px", color: "#333", paddingTop: "4px" }}>
            <span style={{ marginRight: "4px" }}>
              <FaRegUser />
            </span>
            {groupChatting.userInfo.length} thành viên
          </span>
        </div>
      </div>
      <ModelDetailUser
        openModelUser={openModelUser}
        setOpenModelUser={setOpenModelUser}
        friend
      />

      <div className="block_icon">
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

export default ChatHeaderGroup;
