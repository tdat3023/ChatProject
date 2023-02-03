import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import "./AlertNotification.scss";

export default function AlertNotification({
  openAlert,
  closeOpenAlert,
  handleSubmitChange,
  handleLogoutMain,
  title,
}) {
  const handleClose = () => {
    closeOpenAlert();
  };

  //handle login in here
  const handleSubmit = () => {
    //neu la update user
    if (title.status === "update") {
      handleSubmitChange();
      closeOpenAlert();
    } else if (title.status === "logout") {
      //log out
      handleLogoutMain();
      closeOpenAlert();
    }
  };

  console.log(title);
  return (
    <div>
      <Dialog
        open={openAlert}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        
      >
        <DialogTitle id="alert-dialog-title">{"Xác nhận"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {title.text}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ paddingBottom: "16px", paddingRight: "24px" }}>
          <Button variant="outlined" onClick={handleClose}>
            Không
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {title.status === "logout" ? "Đăng xuất" : "Có"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
