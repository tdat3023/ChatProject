import * as React from "react";
import "./NotifyStyle.scss";
const NotifyComponent = ({ userName, text }) => {
  return (
    <div className="notify-block">
      <div className="notify-mess">
        <p className="notify-content">{text}</p>
      </div>
    </div>
  );
};

export default NotifyComponent;
