import "./HomeComponentStyle.scss";
import br1 from "../../images/bn1.jpg";

import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { silderData } from "../../data/Data";

const HomeComponent = () => {
  return (
    <div className="home">
      <div className="home_title">
        <h6>
          Chào mừng bạn đến với <span>ZenChat PC!</span>
        </h6>
        <p>
          Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người{" "}
          <br /> thân, bạn bè được tối ưu hóa cho máy tính của bạn.
        </p>
      </div>

      <OwlCarousel items={1} className="owl-theme" loop autoplay={true}>
        {silderData.map((val, idx) => {
          return (
            <div className="home_content">
              <img alt="banner" src={val.img} />
              <p className="title">{val.title}</p>
              <p>{val.content}</p>
            </div>
          );
        })}
      </OwlCarousel>
    </div>
  );
};

export default HomeComponent;
