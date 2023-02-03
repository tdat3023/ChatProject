import "./MemberCardStyle.scss";
import * as React from "react";
import Contex from "../../store/Context";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { BsThreeDots } from "react-icons/bs";
import conversationApi from "../../api/conversationApi";
const MemberCard = ({ u, socket, modelAdd,leaderId }) => {
  console.log("leaderId",leaderId);
  //material ui
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { state, depatch } = React.useContext(Contex);

  const { userChatting, groupChatting, user, idConversation, idLeaderGroup } =
    state;

  const handleKickUser = () => {
    console.log("user kick id ", u);

    //close model
    handleClose();

    //cal api kick user
    //get list image in the conversation
    const kickUser = async () => {
      try {
        const response = await conversationApi.kickUserOutGroup(
          idConversation,
          user.uid,
          u.userId
        );
        console.log(response);
      } catch (error) {
        console.log("Failed to kick member: ", error);
      }
    };
    //neu user hien tai dang nhap la leader (moi co giao dien thuc hien chuc nang kick user)
    //=> idLeader = user.uid
    kickUser();

    //emit socket kick user
    if (socket.current) {
      socket.current.emit("kickUser", {
        idConversation: idConversation,
        idLeader: user.uid,
        idUserKick: u.userId,
      });
    }
  };
  return (
    <div
      className="users_member"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "8px",
          cursor: "pointer",
        }}
      >
        {u?.avaUser ? (
          <Avatar
            className="avatar"
            src={u?.avaUser}
            alt={u?.userLastName}
            style={{ width: "36px", height: "36px" }}
          />
        ) : (
          <Avatar
            className="avatar"
            style={{
              textTransform: "capitalize",
              width: "36px",
              height: "36px",
            }}
            src={u?.avaUser}
          >
            {u?.userLastName[0]}
          </Avatar>
        )}
        <div style={{ marginLeft: "8px", textAlign: "start" }}>
          <p
            style={{
              textTransform: "capitalize",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {u?.userFistName + " " + u?.userLastName}
          </p>
          {leaderId === u.userId && !modelAdd ? (
            <p
              style={{
                textTransform: "capitalize",
                fontSize: "12px",
              }}
            >
              Trưởng nhóm
            </p>
          ) : null}
          {modelAdd ? (
            <p
              style={{
                textTransform: "capitalize",
                fontSize: "10px",
              }}
            >
              joined
            </p>
          ) : null}
        </div>
      </div>
      {/* modelAdd duoc truyen xuong tu model tadd member */}
      {modelAdd ? null : (
        <React.Fragment>
          {leaderId === user.uid && user.uid !== u.userId ? (
            <span
              className="threeDots"
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <BsThreeDots />
            </span>
          ) : null}
        </React.Fragment>
      )}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => handleKickUser()}>Xóa khỏi nhóm</MenuItem>
      </Menu>
    </div>
  );
};

export default MemberCard;
