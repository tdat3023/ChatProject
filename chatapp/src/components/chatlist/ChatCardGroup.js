import * as React from "react";
import Avatar from "@mui/material/Avatar";
import avt from "../../images/av.jpg";
import "./ChatCardStyle.scss";
import { BsThreeDots } from "react-icons/bs";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { RiArrowRightSLine } from "react-icons/ri";
import AvatarGroup from "@mui/material/AvatarGroup";
import {
  SetGroupChatting,
  SetIdConversation,
  SetIdLeaderGroup,
  SetReplyMess,
  SetUserChatting,
} from "../../store/Actions";
import Contex from "../../store/Context";
import useDateLogic from "../../hooks/useDateLogic";
import useCheckFile from "../../hooks/useCheckFile";
import avatGroup from "../../images/avtgroup.jpg";
import { useEffect } from "react";
const ChatCardGroup = ({ status, conversation, socket }) => {
  const { state, depatch } = React.useContext(Contex);
  const {
    groupChatting,
    userChatting,
    user,
    idConversation,
    idLeaderGroup,
    replyMess,
  } = state;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { checkUrlIsImage, checkUrlIsDocx, checkUrlIsVideo } = useCheckFile();
  const open = Boolean(anchorEl);

  //custom hook
  const { handleDate } = useDateLogic();

  const { inFo, conversations } = conversation;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleShowOption = () => {
    alert("updating...");
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("notifi-kickUser", (data) => {
        console.log("kick user", data);
        depatch(SetIdConversation(data));
      });
    }
  }, [groupChatting]);

  const handleGroupChat = () => {
    //delete user chatting
    if (userChatting) {
      depatch(SetUserChatting(null));
    }
    if (replyMess) {
      depatch(SetReplyMess(null));
    }
    depatch(SetGroupChatting(inFo));
    depatch(SetIdConversation(inFo.idCon));

    //set leader current of group
    depatch(SetIdLeaderGroup(conversations?.leaderId));

    socket.current?.emit("join-room", {
      idCon: inFo.idCon,
      // isNew:false
    });
  };

  return (
    <div className="card_chat" onClick={() => handleGroupChat()}>
      <div className="card_group">
        {inFo.avatar.length === 1 && inFo?.avatar[0]?.avaUser === undefined ? (
          <Avatar
            className="avt group_avatar"
            alt="Remy Sharp"
            src={inFo?.avatar[0]}
          />
        ) : (
          <Avatar
            className="avt group_avatar"
            alt="Remy Sharp"
            src={avatGroup}
          />
        )}

        <div className="card_name">
          <h6 className="">{inFo?.name}</h6>
          <p>
            <span>
              {conversations?.lastMessage[0]?.userId === user?.uid
                ? "Bạn: "
                : inFo?.userInfo?.map((u) => {
                    if (conversations?.lastMessage[0]?.userId === u?.userId) {
                      return u?.userFistName + " " + u?.userLastName + ": ";
                    }
                  })}
            </span>
            <span className={conversations?.mb.numberUnread ? "active" : ""}>
              {conversations?.lastMessage[0]?.content.includes(
                "https://img.stipop.io"
              ) ? (
                "Sticker"
              ) : (
                <>
                  {checkUrlIsImage(conversations?.lastMessage[0]?.content) ? (
                    "hình ảnh"
                  ) : (
                    <>
                      {checkUrlIsVideo(
                        conversations?.lastMessage[0]?.content
                      ) ? (
                        "Video"
                      ) : (
                        <>
                          {checkUrlIsDocx(
                            conversations?.lastMessage[0]?.content
                          ) ? (
                            "File"
                          ) : (
                            <>
                              {conversations?.lastMessage[0]?.content.length >
                              20
                                ? conversations?.lastMessage[0]?.content.slice(
                                    0,
                                    10
                                  ) + "..."
                                : conversations?.lastMessage[0]?.content}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </span>
          </p>
        </div>
      </div>

      <div className="group_right">
        <div className="card_time">
          {" "}
          {handleDate(
            new Date(),
            new Date(
              `${conversations.lastMessage[0].updatedAt}`.toLocaleString(
                "en-US",
                { timeZone: "Asia/Ho_Chi_Minh" }
              )
            )
          )}
        </div>

        {conversations?.mb?.numberUnread > 0 ? (
          <span className="numberNotification">
            {conversations?.mb?.numberUnread}
          </span>
        ) : null}
        <span
          className="threeDot"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <BsThreeDots />
        </span>
      </div>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          style={{ display: "flex", justifyContent: "space-between" }}
          onClick={handleClose}
        >
          Phân loại <RiArrowRightSLine />
        </MenuItem>
        <MenuItem onClick={handleClose}>Thêm vào nhóm</MenuItem>
        <MenuItem onClick={handleClose}>Ẩn trò chuyện</MenuItem>
        <Divider />
        <MenuItem style={{ color: "#E64848" }} onClick={handleClose}>
          Xóa hội thoại
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ChatCardGroup;
