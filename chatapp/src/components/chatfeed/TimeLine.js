import * as React from "react";
import "./TimeLineStyle.scss";
import Divider from "@mui/material/Divider";
const TimeLine = () => {
  return (
    <div className="timeLine">
      <Divider className="line_dive" />
      <span className="timeLine_content">15:56 27/08/2022</span>
      <Divider className="line_dive" />
    </div>
  );
};

export default TimeLine;
