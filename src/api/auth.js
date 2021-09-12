import axios from "axios";
import xml2js from "xml2js";
import creds from "../utils/config.json";

let data =
  `<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\r\n  <soap12:Header>\r\n    <AuthHeader xmlns="http://tempuri.org/">\r\n      <LoginToken>WRHVXBDY</LoginToken>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n    </AuthHeader>\r\n  </soap12:Header>\r\n  <soap12:Body>\r\n    <LoginByToken3 xmlns="http://tempuri.org/" />\r\n  </soap12:Body>\r\n</soap12:Envelope>`;

let config = {
  method: "post",
  url: creds.serviceurl,
  headers: {
    "Content-Type": "text/xml; charset=utf-8",
  },
  data: data,
};
const login = async () => {
  await axios(config)
    .then((response) => {
      console.log(`${response.data}`);
      let parser = new xml2js.Parser();
      parser.parseString(`${response.data}`, function (err, result) {
        const resultData =
          result["soap:Envelope"]["soap:Body"][0]["LoginByToken3Response"][0][
            "LoginByToken3Result"
          ][0];
        const ObjectKeys = Object.keys(resultData);
        let data = {};
        ObjectKeys.forEach((e) => {
          data[e] = resultData[e][0];
        });
        return data;
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export { login };
