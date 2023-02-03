import Avatar from "@mui/material/Avatar";
import * as React from "react";
import "./ModelShowListImage.scss";
import { AiOutlineDownload, AiOutlineClose } from "react-icons/ai";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { fakeImages } from "../../data/Data";
const ModelShowListImage = () => {
  return (
    <div className="model_images">
      <div className="model_images-header">
        <span className="headaer_name">Anh Nguyen</span>
        <span className="header_close">
          <AiOutlineClose />
        </span>
      </div>
      <div className="model_images-body">
        {fakeImages.map((val, idx) => {
          return (
            <div className="block_image">
              <img alt="banner" src={val.image} />
            </div>
          );
        })}
      </div>
      <div className="model_images-footer">
        <div className="footer_info">
          <div className="block_left">
            <Avatar className="avatar" />
            <div className="info_details">
              <p>Anh nguyen</p>
              <div>
                <span>14/10/2000</span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer_options">
          <span>
            <AiOutlineDownload />
          </span>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default ModelShowListImage;
