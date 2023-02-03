import "../chatfeed/ChatHeaderStyle.scss";
import * as React from "react";
import Avatar from "@mui/material/Avatar";

import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const AvatarUserOnline = ({ userChatting, isOnline, isFriend }) => {
  return (
    <div>
      {userChatting?.avatar ? (
        <React.Fragment>
          <div className="info_block">
            {
              isOnline && isFriend ? (
                <Stack direction="row" spacing={2}>
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar
                      className="avt"
                      src={userChatting?.avatar}
                      alt={userChatting?.first_name}
                      // onClick={() => handleShowInfo()}
                      //  style={{ backgroundColor: "#055E68" }}
                    />
                  </StyledBadge>
                </Stack>
              ) : (
                <Avatar
                  className="avt"
                  src={userChatting?.avatar}
                  alt={userChatting?.first_name}
                  // onClick={() => handleShowInfo()}
                  //style={{ backgroundColor: "#055E68" }}
                />
              )
              // {isOnline ? <div className="statusOnline"></div> : null}
            }
          </div>
        </React.Fragment>
      ) : (
        <>
          <div className="info_block">
            {isOnline && isFriend ? (
              <Stack direction="row" spacing={2}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar
                    className="avt"
                    style={{
                      textTransform: "capitalize",
                      backgroundColor: "#055E68",
                    }}
                    src={userChatting?.avatar}

                    //  onClick={() => handleShowInfo()}
                  >
                    {userChatting?.first_name[0]}
                  </Avatar>
                </StyledBadge>
              </Stack>
            ) : (
              <Avatar
                className="avt"
                style={{
                  textTransform: "capitalize",
                  backgroundColor: "#055E68",
                }}
                src={userChatting?.avatar}

                //  onClick={() => handleShowInfo()}
              >
                {userChatting?.first_name[0]}
              </Avatar>
            )}
            {/* {isFriend ? (
              <React.Fragment>
                {isOnline ? <div className="statusOnline"></div> : null}
              </React.Fragment>
            ) : null} */}
          </div>
        </>
      )}
    </div>
  );
};

export default AvatarUserOnline;
