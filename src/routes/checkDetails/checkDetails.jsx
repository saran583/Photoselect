import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import "./checkDetails.css";
import creds from "../../utils/config.json";
import xml2js from "xml2js";

const CheckDetails = ({ data }) => {
  const [orgMember, setOrgMember] = useState(null);
  const [organization, setOrganzation] = useState(null);
  const [organizationManual, setOrganzationManual] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [groups, setGroups] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const orgname = localStorage.getItem("organization");

  useEffect(() => {
    const customerId = localStorage.getItem("customerId");
    
    let bookingPath = "";
    let bData = `<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\r\n  <soap12:Body>\r\n    <GetBookingInfoPS xmlns="http://tempuri.org/">\r\n      <strCustomerId>${customerId}</strCustomerId>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n    </GetBookingInfoPS>\r\n  </soap12:Body>\r\n</soap12:Envelope>`;
    let config = {
      method: "post",
      url: creds.serviceurl,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
      },
      data: bData,
    };
    axios(config)
      .then((res) => {
        const str = res.data
          .split(
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><GetBookingInfoPSResponse xmlns="http://tempuri.org/">'
          )[1]
          .split("</GetBookingInfoPSResponse>")[0];
        let parser = new xml2js.Parser();
        parser.parseString(String(str), function (err, result) {
          bookingPath = result.GetBookingInfoPSResult.strBookingPath[0];
          getOrganizations(bookingPath);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const getOrganizations = (path) => {
    const reqData = `<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\n  <soap12:Body>\n    <GetGroupName_SP xmlns="http://tempuri.org/">\n      <strBookingPath>${path}</strBookingPath>\n    </GetGroupName_SP>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\n  </soap12:Body>\n</soap12:Envelope>`;

    const config = {
      method: "post",
      url: creds.serviceurl,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
      },
      data: reqData,
    };
    axios(config)
      .then(function (response) {
        const res = response.data
          .split(
            '<diffgr:diffgram xmlns:msdata="urn:schemas-microsoft-com:xml-msdata" xmlns:diffgr="urn:schemas-microsoft-com:xml-diffgram-v1">'
          )[1]
          .split("</diffgr:diffgram>")[0];
        console.log(res);
        const parser = new xml2js.Parser();
        parser.parseString(String(res), function (err, result) {
          let _groups = [];
          console.log(result.NewDataSet.pdGroups);
          result.NewDataSet.pdGroups.forEach((e) => {
            const obj = { label: e["Name"][0], value: e["$"]["diffgr:id"] };
            _groups.push(obj);
          });
          setGroups(_groups);
          console.log(groups);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const onOrgChange = (event) => {
    setOrgMember(event.target.value);
    setOrganzation(null);
    if (event.target.value === "Yes") {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };
  const orgManualChange = (event) => {
    console.log(event.target.value);
    setOrganzationManual(event.target.value);
    if (event.target.value) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };
  const onOrganizationSelect = (event) => {
    if (event.target.value) {
      setOrganzation(event.target.value);
      if (event.target.value === "notHere") {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }
  };

  return (
    <div className="details_container">
      {redirect && <Redirect to="/persional-info" />}
      <div className="head">
        <Link to="/">
          <span>
            <i className="fas fa-chevron-left"></i>&nbsp;Back
          </span>
        </Link>
        <h5>Group Information</h5>
        <div></div>
      </div>
      <div className="body">
        <h6>Organization</h6>
        <p>Are you a member of the following Organization</p>
        <p className="default">{orgname.length>1?orgname:data.strGroupName}</p>
        <form>
          <label htmlFor="org_yes">
            <input
              type="radio"
              id="org_yes"
              name="organization"
              value="Yes"
              onChange={($event) => onOrgChange($event)}
            />
            <span></span>
            Yes, this is my group
          </label>
          <br />
          <label htmlFor="org_no">
            <input
              type="radio"
              id="org_no"
              name="organization"
              value="No"
              onChange={($event) => onOrgChange($event)}
            />
            <span></span>
            No, I’m a member of a different group
          </label>
          {orgMember === "No" ? (
            <div className="select_manually">
              <h6>Select Your Organization</h6>
              {organization !== "notHere" ? (
                <select
                  name="organization"
                  onChange={($event) => onOrganizationSelect($event)}
                >
                  <option>Select Your Organization</option>
                  {groups.map((e) => (
                    <option key={e.value} value={e.label}>
                      {e.label}
                    </option>
                  ))}
                  <option value="notHere">My Organization isn't here</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={organizationManual}
                  placeholder="Enter Organization"
                  onChange={($event) => orgManualChange($event)}
                />
              )}
            </div>
          ) : (
            ""
          )}
          <br />
          {/* <Link to="/persional-info"> */}
          <button
            disabled={isDisabled}
            onClick={() => {
              const org =
                orgMember == "Yes"
                  ? orgname.length>1?orgname:data.strGroupName
                  : organization != "notHere"
                  ? organization
                  : organizationManual;
              localStorage.setItem("organization", org);
              setRedirect(true);
            }}
          >
            Continue&nbsp;<i className="fas fa-chevron-right"></i>
            <i className="fas fa-chevron-right"></i>
          </button>
          {/* </Link> */}
        </form>
      </div>
    </div>
  );
};

export default CheckDetails;
