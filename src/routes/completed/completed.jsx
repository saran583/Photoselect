import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import xml2js from "xml2js";
import "./completed.css";



const Completed = ({ data }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  // console.log("This is the selected Images data",_selectedImages);
  const [imageSelectionNo, setImageSelectionNo] = useState(1);

  const customerId = localStorage.getItem("customerId");
  const bookingId = localStorage.getItem("strBookingPkid");
  var reqData = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\r\n  <soap:Body>\r\n    <GetSuppliersPS xmlns="http://tempuri.org/">\r\n      <strCustomerId>${customerId}</strCustomerId>\r\n      <strFkBookingId>${bookingId}</strFkBookingId>\r\n    </GetSuppliersPS>\r\n  </soap:Body>\r\n</soap:Envelope>`;

  var config = {
    method: "post",
    url: "https://www.aussieschoolphoto.com/pixeladminWS/service1.asmx",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
    },
    data: reqData,
  };

  useEffect(() => {
    const _selectedImages = JSON.parse(localStorage.getItem("selectedImages"));
    setSelectedImages(_selectedImages);
    axios(config)
      .then(function (response) {
        const str = response.data
          .split(
            `<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"><soap:Body><GetSuppliersPSResponse xmlns=\"http://tempuri.org/\">`
          )[1]
          .split("</GetSuppliersPSResponse>")[0];
        const parser = new xml2js.Parser();
        parser.parseString(String(str), function (err, result) {
          console.log(result.GetSuppliersPSResult.nRawImageSelectionNo[0]);
          setImageSelectionNo(
            result.GetSuppliersPSResult.nRawImageSelectionNo[0]
          );
        });
      })
      .catch(function (error) {
        console.log(error);
      });
      window.scrollTo(0,0);
  }, []);

  return (
    <div className="completed_container">
      <div className="head">
        <h5>Thank You!</h5>
      </div>
      <div className="body">
        <p className="have_que">
          Have a question? Contact us at (815) 363-2800 or www.dpcpix.com
        </p>
        <div className="cp_container">
          <div className="comp">
            <div className="details">
              <div className="content">
                Your chosen <br />
                <span style={{ color: "#82ca78" }}>composite pose</span> will
                appear on the group composite.
              </div>
              <br />
              <img src="/images/arrow_green.svg" alt="arrow" />
            </div>
            <div className="image">
              <img src={"data:image/jpeg;base64," + selectedImages[0]?.image} />
              <span>C</span>
              <p>{selectedImages[0]?.id}</p>
            </div>
          </div>
          {Number(imageSelectionNo) > 1 && (
            <div className="port">
              <div className="image">
                <img
                  src={"data:image/jpeg;base64," + selectedImages[1]?.image}
                />
                <span>P</span>
                <p>{selectedImages[1]?.id}</p>
              </div>
              <div className="details">
                <img
                  src="/images/arrow_blue.svg"
                  alt="arrow"
                  style={{ alignSelf: "flex-start", height: "110px" }}
                />
                <br />
                <div className="content">
                  In 2-4 weeks you’ll receive an e-mail to order your
                  chosen&nbsp;
                  <span style={{ color: "#7cbddd" }}>portrait pose</span>{" "}
                  online.
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="cropping">
          <div className="img">
            <img src="/images/camera.png" alt="camera" />
          </div>
          <div className="details">
            <h6>We will take it from here</h6>
            <p>
              Our expert team will get to work retouching and color correcting
              your photo so you look your best.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Completed;
