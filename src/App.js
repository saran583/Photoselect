import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/header/header";
import Welcome from "./routes/welcome/welcome";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import CheckDetails from "./routes/checkDetails/checkDetails";
import PersionalInfo from "./routes/persionalInfo/persionalInfo";
import DontAgree from "./routes/dontAgree/dontAgree";
import Favourites from "./routes/favourites/favourites";
import Selected from "./routes/selected/selected";
import ForwardToPayment from "./routes/forwardToPayment/forwardToPayment";
import Completed from "./routes/completed/completed";
import axios from "axios";
import xml2js from "xml2js";
import LoginError from "./routes/loginError/loginError";
import creds from "./utils/config.json";

const token = localStorage.getItem("token");

function App() {
  const [data, setData] = useState({});
  const [errRedirect, setErrRedirect] = useState(false);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (!query.get("token")) {
      setErrRedirect(true);
      return;
    }

    axios
      .get(
        "https://firestore.googleapis.com/v1/projects/capestone-945f7/databases/(default)/documents/test/test"
      )
      .then((res) => {
        if (res.data.fields.test.booleanValue) {
        } else {
          setErrRedirect(true);
          return;
        }
      });

    let data = `<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\r\n  <soap12:Header>\r\n    <AuthHeader xmlns="http://tempuri.org/">\r\n      <LoginToken>${
      query.get("token") || token
    }</LoginToken>\r\n      <Username>${
      creds.username
    }</Username>\r\n      <Password>${
      creds.password
    }</Password>\r\n    </AuthHeader>\r\n  </soap12:Header>\r\n  <soap12:Body>\r\n    <LoginByToken3 xmlns="http://tempuri.org/" />\r\n  </soap12:Body>\r\n</soap12:Envelope>`;
    let config = {
      method: "post",
      url: creds.serviceurl,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        let parser = new xml2js.Parser();
        parser.parseString(`${response.data}`, function (err, result) {
          const resultData =
            result["soap:Envelope"]["soap:Body"][0]["LoginByToken3Response"][0][
              "LoginByToken3Result"
            ][0];
          const ObjectKeys = Object.keys(resultData);
          let _data = {};
          ObjectKeys.forEach((e) => {
            _data[e] = resultData[e][0];
          });
          setData(_data);
          localStorage.setItem("token", _data.strToken);
          localStorage.setItem("customerId", _data.strCustomerId);
          console.log(_data);
        });
      })
      .catch((error) => {
        console.log(error);
        setErrRedirect(true);
      });
  }, []);

  return (
    <Router>
      {errRedirect && <Redirect to="/error" />}
      <div className="App">
        <div className="header">
          <Header />
        </div>
        <div className="body">
          <Route path="/" exact>
            <Welcome data={data} />
          </Route>
          <Route path="/check-details" exact>
            <CheckDetails data={data} />
          </Route>
          <Route path="/persional-info" exact>
            <PersionalInfo data={data} />
          </Route>
          <Route path="/dont-agree" exact>
            <DontAgree data={data} />
          </Route>
          <Route exact path="/favourites">
            <Favourites data={data} />
          </Route>
          <Route exact path="/selected">
            <Selected data={data} />
          </Route>
          <Route exact path="/forward">
            <ForwardToPayment data={data} />
          </Route>
          <Route exact path="/completed">
            <Completed data={data} />
          </Route>
          <Route exact path="/error" component={LoginError}></Route>
        </div>
      </div>
    </Router>
  );
}

export default App;
