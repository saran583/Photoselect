import { Dialog } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Slider from "react-slick";
import "./selected.css";
import xml2js from "xml2js";
import creds from "../../utils/config.json"

const Selected = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [imageSelectionNo, setImageSelectionNo] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const customerId = localStorage.getItem("customerId");
  const bookingId = localStorage.getItem("strBookingPkid");
  var reqData = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\r\n  <soap:Body>\r\n    <GetSuppliersPS xmlns="http://tempuri.org/">\r\n      <strCustomerId>${customerId}</strCustomerId>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n      <strFkBookingId>${bookingId}</strFkBookingId>\r\n    </GetSuppliersPS>\r\n  </soap:Body>\r\n</soap:Envelope>`;

  var config = {
    method: "post",
    url: "https://www.aussieschoolphoto.com/pixeladminWS/service1.asmx",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
    },
    data: reqData,
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  useEffect(() => {
    localStorage.removeItem("selectedImages");
    const data = JSON.parse(localStorage.getItem("selectedData"));

    console.log(data);
    data.forEach((ele) => {
      ele.c = false;
      ele.p = false;
    });
    setSelectedData(data);
    axios(config)
      .then(function (response) {
        const str = response.data
          .split(
            `<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"><soap:Body><GetSuppliersPSResponse xmlns=\"http://tempuri.org/\">`
          )[1]
          .split("</GetSuppliersPSResponse>")[0];
        const parser = new xml2js.Parser();
        parser.parseString(String(str), function (err, result) {
          console.log(result);
          setImageSelectionNo(
            result.GetSuppliersPSResult.nRawImageSelectionNo[0]
          );
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    setTimeout(() => {
      setIsOpen(true);
    }, 1000);
    setTimeout(() => {
      setIsOpen(false);
    }, 3500);

    window.scrollTo(0,0);
  }, []);

  const submitSelectedImages = () => {
    let reqData;
    let cid;
    let pid;
    const selectedImages = [];
    if (Number(imageSelectionNo) > 1) {
      const cData = selectedData.filter((e) => e.c)[0];
      const pData = selectedData.filter((e) => e.p)[0];
      selectedImages.push(cData);
      selectedImages.push(pData);
      cid = cData.id;
      pid = pData.id;
      reqData = `<?xml version="1.0" encoding="utf-8"?>\r\n<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\r\n  <soap:Body>\r\n   <AddUserSelectedImages_DPC xmlns="http://tempuri.org/">\r\n      <strFkRegisterId>${data.strPkid}</strFkRegisterId>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n      <strUserId>${customerId}</strUserId>\r\n      <listImageIds>\r\n        <string>${cid}</string>\r\n        <string>${pid}</string>\r\n      </listImageIds>\r\n      <nNoOfImages>${imageSelectionNo}</nNoOfImages>\r\n    </AddUserSelectedImages_DPC>\r\n  </soap:Body>\r\n</soap:Envelope>`;
    } else {
      const cData = selectedData.filter((e) => e.c)[0];
      selectedImages.push(cData);
      cid = cData.id;
      reqData = `<?xml version="1.0" encoding="utf-8"?>\r\n<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\r\n  <soap:Body>\r\n   <AddUserSelectedImages_DPC xmlns="http://tempuri.org/">\r\n      <strFkRegisterId>${data.strPkid}</strFkRegisterId>\r\n      <strUserId>${customerId}</strUserId>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n      <listImageIds>\r\n        <string>${cid}</string>\r\n      </listImageIds>\r\n      <nNoOfImages>${imageSelectionNo}</nNoOfImages>\r\n    </AddUserSelectedImages_DPC>\r\n  </soap:Body>\r\n</soap:Envelope>`;
    }
    localStorage.setItem("selectedImages", JSON.stringify(selectedImages));
    var config = {
      method: "post",
      url: creds.serviceurl,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
      },
      data: reqData,
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setRedirect(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onCClick = (index) => {
    const data = [...selectedData];
    data.forEach((e, i) => {
      if (i == index) {
        e.c = true;
      } else {
        e.c = false;
      }
    });
    setSelectedData(data);
    if (imageSelectionNo > 1) {
      const _sData = selectedData.filter((e) => e.p);
      if (_sData.length > 0) setIsDisabled(false);
      else setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  };

  const onPClick = (index) => {
    const data = [...selectedData];
    data.forEach((e, i) => {
      if (i == index) {
        e.p = true;
      } else {
        e.p = false;
      }
    });
    setSelectedData(data);
    const _sData = selectedData.filter((e) => e.c);
    if (_sData.length > 0) setIsDisabled(false);
    else setIsDisabled(true);
  };

  const showInfo = () => {
    setIsOpen(true);
  };
  return (
    <div className="selected_container">
      {redirect && <Redirect to="/forward" />}
      <div className="head">
        <Link to="/favourites">
          <span className="back">
            <i className="fas fa-chevron-left"></i>&nbsp;Back
          </span>
        </Link>
        <h5>Finalize Your Selection</h5>
        <div></div>
        <div className="info" onClick={() => showInfo()}>
          <span>?</span>
        </div>
      </div>
      <div className="body">
        <div className="images_cont">
          {selectedData.map((e, i) => (
            <div key={e.name} className="image">
              <div className="photo">
                <img src={"data:image/jpeg;base64," + e.image} />
              </div>
              <p>{e.id}</p>
              <div
                className={e.c ? "comp_port active" : "comp_port"}
                onClick={() => {
                  onCClick(i);
                }}
              >
                <span>C</span>
              </div>
              {Number(imageSelectionNo) > 1 && (
                <div
                  className={
                    e.p ? "comp_port reverse active" : "comp_port reverse"
                  }
                  onClick={() => {
                    onPClick(i);
                  }}
                >
                  <span>p</span>
                </div>
              )}
              <span className="add" onClick={() => setIsCarouselOpen(true)}>
                <i className="fas fa-plus"></i>
              </span>
            </div>
          ))}
        </div>
        <br />
        <button onClick={() => submitSelectedImages()} disabled={isDisabled}>
          Continue&nbsp;<i className="fas fa-chevron-right"></i>
          <i className="fas fa-chevron-right"></i>
        </button>
        {/* <Link to="/forward">
        </Link> */}
        {/* <p style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}>
          Click here to simulate payment <br /> flag set
        </p> */}
        <Dialog
          className="dialog select"
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div className="dialog_cont">
            <div className="close" onClick={() => setIsOpen(false)}>
              <span>X</span>
            </div>
            <h5>Selecting Poses</h5>
            {Number(imageSelectionNo) > 1 && (
              <p>
                Select the pose you want for your <strong>Portait</strong> and{" "}
                <strong>Composite</strong> using the button.
              </p>
            )}
            {Number(imageSelectionNo) == 1 && (
              <p>
                Select the pose you want for your <strong>Composite</strong>{" "}
                using the button.
              </p>
            )}
            <div className="com_por">
              <div className="com">
                <p className="letter">C</p>
                <h6>Composite</h6>
                <p className="desc">Appears on group composite</p>
              </div>
              {Number(imageSelectionNo) > 1 && (
                <div className="por">
                  <p className="letter">P</p>
                  <h6>Portrait</h6>
                  <p className="desc">Available online for ordering</p>
                </div>
              )}
            </div>
          </div>
        </Dialog>
        <Dialog
          className="dialog carousel"
          open={isCarouselOpen}
          onClose={() => setIsCarouselOpen(false)}
        >
          <div className="dialog_conta">
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
              {selectedData.map((e, i) => (
                <div className="image" key="e.id">
                  <div className="photo full">
                    <img src={"data:image/jpeg;base64," + e.image} />
                  </div>
                  <p>{e.id}</p>
                  <div
                    className={e.c ? "comp_port active" : "comp_port"}
                    onClick={() => {
                      onCClick(i);
                    }}
                  >
                    <span>C</span>
                  </div>
                  {Number(imageSelectionNo) > 1 && (
                    <div
                      className={
                        e.p ? "comp_port reverse active" : "comp_port reverse"
                      }
                      onClick={() => {
                        onPClick(i);
                      }}
                    >
                      <span>p</span>
                    </div>
                  )}
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

export default Selected;
