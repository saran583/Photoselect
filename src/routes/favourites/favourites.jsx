import { Dialog } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Slider from "react-slick";
import xml2js from "xml2js";
import "./favourites.css";
import creds from "../../utils/config.json";

const Favourites = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [errRedirect, setErrRedirect] = useState(false);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    const customerId = localStorage.getItem("customerId");
    const bookingPath = localStorage.getItem("bookingPath");

    const data = `<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\r\n  <soap12:Body>\r\n    <GetRawImagesPS xmlns="http://tempuri.org/">\r\n      <strCustomerId>${customerId}</strCustomerId>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n      <strBookingPath>${bookingPath}</strBookingPath>\r\n    </GetRawImagesPS>\r\n  </soap12:Body>\r\n</soap12:Envelope>`;
    const config = {
      method: "post",
      url: creds.serviceurl,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
      },
      data: data,
    };

    axios(config)
      .then((res) => {
        console.log(res.data);
        const parser = new xml2js.Parser();
        const str = res.data
          .split('<GetRawImagesPSResponse xmlns="http://tempuri.org/">')[1]
          .split("</GetRawImagesPSResponse>")[0];
        parser.parseString(str, function (err, result) {
          const favourite = [];
          result.GetRawImagesPSResult.images[0].string.forEach((ele, i) => {
            if (typeof ele == "string") {
              favourite[i] = { selected: false };
              favourite[i].image = ele;
            }
          });
          result.GetRawImagesPSResult.imagesId[0].string.forEach((ele, i) => {
            if (typeof ele == "string") {
              favourite[i].id = ele;
            }
          });
          if (favourite.length) {
            setFavourites(favourite);
          } else {
            setErrRedirect(true);
          }
        });
      })
      .catch((err) => console.log(err));
    console.log(favourites);
    window.scrollTo(0,0);
  }, []);
  return (
    <div className="favourites_container">
      {redirect && <Redirect to="/selected" />}
      {errRedirect && <Redirect to="/error" />}
      <div className="head">
        <Link to="/persional-info">
          <span>
            <i className="fas fa-chevron-left"></i>&nbsp;Back
          </span>
        </Link>
        <h5>Select your Favourite pictures</h5>
        <div></div>
      </div>
      <div className="body">
        <div className="images_cont">
          {favourites.map((e, i) => (
            <div key={i} className="image">
              <div className="photo">
                <img src={"data:image/jpeg;base64," + e.image} />
              </div>
              {/* <img className="photo" src={e.img} /> */}
              <p>{e.id}</p>
              <span
                onClick={() => {
                  const fav = [...favourites];
                  fav[i].selected = !fav[i].selected;
                  setFavourites(fav);
                  const _fav = favourites.filter((e) => e.selected);
                  if (_fav.length > 0) setIsDisabled(false);
                  else setIsDisabled(true);
                }}
              >
                {e.selected && (
                  <img
                    src="/images/heart_fill.svg"
                    width="30"
                    height="26"
                    alt="like"
                  />
                )}
                {!e.selected && (
                  <img
                    src="/images/heart.svg"
                    width="30"
                    height="26"
                    alt="like"
                  />
                )}
              </span>
              <span className="add" onClick={() => setIsCarouselOpen(true)}>
                <i className="fas fa-plus"></i>
              </span>
            </div>
          ))}
        </div>
        <br />
        <button
          disabled={isDisabled}
          onClick={() => {
            const data = favourites.filter((e) => e.selected);
            localStorage.setItem("selectedData", JSON.stringify(data));
            setRedirect(true);
          }}
        >
          Continue&nbsp;<i className="fas fa-chevron-right"></i>
          <i className="fas fa-chevron-right"></i>
        </button>
        <div className="cropping">
          <div className="img">
            <img src="/images/cropping.png" alt="crop" />
          </div>
          <div className="details">
            <h6>Cropping & Color correction</h6>
            <p>
              Your photo is color corrected, cropped and lightly retouched to
              ensure a consistent look for the composite.
            </p>
            <a onClick={() => setIsOpen(true)}>CLICK TO LEARN MORE</a>
          </div>
        </div>
        <Dialog
          className="dialog full_screen"
          fullScreen
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div className="dialog_container">
            <span onClick={() => setIsOpen(false)} style={{ zIndex: 1 }}>
              <i className="fas fa-times"></i>
            </span>
            <img src="/images/dialog_content.png" alt="image" />
          </div>
        </Dialog>
        <Dialog
          className="dialog carousel"
          open={isCarouselOpen}
          onClose={() => setIsCarouselOpen(false)}
        >
          <div className="dialog_container">
            <span
              onClick={() => setIsCarouselOpen(false)}
              style={{
                zIndex: 1,
                height: "24px",
                background: "#fff",
                borderRadius: "50%",
              }}
            >
              <i className="far fa-times-circle"></i>
            </span>
            <Slider {...settings}>
              {favourites.map((e, i) => (
                <div key={i} className="image">
                  <div className="photo full">
                    <img src={"data:image/jpeg;base64," + e.image} />
                  </div>
                  <p>{e.id}</p>
                  <span
                    onClick={() => {
                      const fav = [...favourites];
                      fav[i].selected = !fav[i].selected;
                      setFavourites(fav);
                      const _fav = favourites.filter((e) => e.selected);
                      if (_fav.length > 0) setIsDisabled(false);
                      else setIsDisabled(true);
                    }}
                  >
                    {e.selected && (
                      <img
                        src="/images/heart_fill.svg"
                        width="30"
                        height="26"
                        alt="like"
                      />
                    )}
                    {!e.selected && (
                      <img
                        src="/images/heart.svg"
                        width="30"
                        height="26"
                        alt="like"
                      />
                    )}
                  </span>
                  <span className="add" onClick={() => setIsCarouselOpen(true)}>
                    <i className="fas fa-plus"></i>
                  </span>
                </div>
              ))}
            </Slider>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Favourites;
