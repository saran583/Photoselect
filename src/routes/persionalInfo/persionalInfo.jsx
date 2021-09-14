import { Dialog } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Redirect } from "react-router-dom";
import xml2js from "xml2js";
import "./persionalInfo.css";
import * as data from "../../utils/config.json";
import creds from "../../utils/config.json";

const terms = { ...data };

let bookingPath = "";
let bookingId = "";
let strBookingPkid = "";

const PersionalInfo = ({ data }) => {
  const [discountChecked, setDiscountChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [dDiscountChecked, setDDiscountChecked] = useState(false);
  const [dTermsChecked, setDTermsChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [dontRedirect, setDontRedirect] = useState(false);
  const [offerName, setOfferName] = useState("");
  const [termsOpen, setTermsOpen] = useState(false);
  const [showemailerr, setshowemailerr] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
    setValue,
    getValues,
    setError,
    clearErrors,
  } = useForm({
    // mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {},
    resolver: undefined,
    context: undefined,
    criteriaMode: "firstError",
    shouldFocusError: true,
    shouldUnregister: true,
  });

  function getyear() {
    var result = [];
    var date = new Date();
    for (var i = 5; i >= 0; i--) {
      result.push(
        <option value={date.getFullYear() - i}>{date.getFullYear() - i}</option>
      );
    }
    return result;
  }

  function checkvemail(event) {
    if (event.target.value === "") {
      setFocus("mobile");
    }
  }

  function onHandleTelephoneChange(e) {
    let telephone = e.target.value;
    let regexp = /^[0-9\b]+$/;

    // if value is not blank, then test the regex
    if (telephone === "" || regexp.test(telephone)) {
      this.setState({ [e.target.name]: telephone });
    }
  }

  function updatediscount(enrolled) {
    const customerId = localStorage.getItem("customerId");
    let discountdata = `<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
      <DPC_SetIsDiscounts xmlns="http://tempuri.org/">
        <strNameId>${customerId}</strNameId>
        <strBookingPath>${bookingPath}</strBookingPath>
        <IsDiscounts>${enrolled}</IsDiscounts>
      </DPC_SetIsDiscounts>
    </soap12:Body>
  </soap12:Envelope>`;
    let discountConfig = {
      method: "post",
      url: creds.serviceurl,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
      },
      data: discountdata,
    };
    axios(discountConfig).then(function (response) {
      console.log("Printing the testing part", response);
    });
  }

  useEffect(async () => {
    const customerId = localStorage.getItem("customerId");
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setValue("firstName", userData.firstName);
      setValue("lastName", userData.lastName);
      setValue("email", userData.email);
      setValue("alternateEmail", userData.alternateEmail);
      setValue("verifyEmail", userData.verifyEmail);
      setValue("mobile", userData.mobile);
      setValue("address", userData.address);
      setValue("city", userData.city);
      setValue("state", userData.state);
      setValue("zipCode", userData.zipCode);
    } else {
      if (data) {
        setValue("firstName", data.strFirstName);
        setValue("lastName", data.strLastName);
        setValue("email", data.strEmail);
        setValue("mobile", data.strMobileNo);
      }

      let addData = `<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\r\n  <soap12:Body>\r\n    <GetAccountAddress_DPC xmlns="http://tempuri.org/">\r\n      <strNameId>${customerId}</strNameId>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n    </GetAccountAddress_DPC>\r\n  </soap12:Body>\r\n</soap12:Envelope>`;
      let addConfig = {
        method: "post",
        url: creds.serviceurl,
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
        },
        data: addData,
      };
      axios(addConfig)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          const str = response.data
            .split(
              `<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"><soap:Body>`
            )[1]
            .split(`</soap:Body>`)[0];
          let parser = new xml2js.Parser();
          parser.parseString(String(str), function (err, result) {
            console.log(result);
            const data = result.GetAccountAddress_DPCResponse;
            setValue("address", data.strAddress[0]);
            setValue("city", data.strCity[0]);
            setValue("state", data.strState[0]);
            setValue("zipCode", data.strZip[0]);
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    let getdiscount = `<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\r\n  <soap12:Body>\r\n    <DPC_GetIsDiscounts xmlns="http://tempuri.org/">\r\n      <strNameId>${customerId}</strNameId>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n    </DPC_GetIsDiscounts>\r\n  </soap12:Body>\r\n</soap12:Envelope>`;

    let getConfig = {
      method: "post",
      url: creds.serviceurl,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
      },
      data: getdiscount,
    };
    axios(getConfig)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        const str = response.data
          .split(
            `<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"><soap:Body>`
          )[1]
          .split(`</soap:Body>`)[0];
        let parser = new xml2js.Parser();
        parser.parseString(String(str), function (err, result) {
          const data = result.DPC_GetIsDiscountsResponse;
          console.log("this is the value", data.DPC_GetIsDiscountsResult[0]);
          setDiscountChecked(
            data.DPC_GetIsDiscountsResult[0] === "true" ? true : false
          );
          setDDiscountChecked(
            data.DPC_GetIsDiscountsResult[0] === "true" ? true : false
          );
          // setValue("address", data.DPC_GetIsDiscountsResult[0]);
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    let bData = `<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\r\n  <soap12:Body>\r\n    <GetBookingInfoPS xmlns="http://tempuri.org/">\r\n      <strCustomerId>${customerId}</strCustomerId>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n    </GetBookingInfoPS>\r\n  </soap12:Body>\r\n</soap12:Envelope>`;
    let bConfig = {
      method: "post",
      url: creds.serviceurl,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
      },
      data: bData,
    };
    await axios(bConfig)
      .then((res) => {
        const str = res.data
          .split(
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><GetBookingInfoPSResponse xmlns="http://tempuri.org/">'
          )[1]
          .split("</GetBookingInfoPSResponse>")[0];
        let parser = new xml2js.Parser();
        parser.parseString(String(str), function (err, result) {
          bookingPath = result.GetBookingInfoPSResult.strBookingPath[0];
          bookingId = result.GetBookingInfoPSResult.strBookingID[0];
          strBookingPkid = result.GetBookingInfoPSResult.strBookingPkid[0];
          localStorage.setItem("bookingPath", bookingPath);
          localStorage.setItem("bookingId", bookingId);
          localStorage.setItem("strBookingPkid", strBookingPkid);
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // const customerId = localStorage.getItem("customerId");
    var reqData = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\r\n  <soap:Body>\r\n    <GetSuppliersPS xmlns="http://tempuri.org/">\r\n      <strCustomerId>${customerId}</strCustomerId>\r\n      <strFkBookingId>${strBookingPkid}</strFkBookingId>\r\n    </GetSuppliersPS>\r\n  </soap:Body>\r\n</soap:Envelope>`;

    var config = {
      method: "post",
      url: "https://www.aussieschoolphoto.com/pixeladminWS/service1.asmx",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
      },
      data: reqData,
    };

    await axios(config)
      .then(function (response) {
        const str = response.data
          .split(
            `<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"><soap:Body><GetSuppliersPSResponse xmlns=\"http://tempuri.org/\">`
          )[1]
          .split("</GetSuppliersPSResponse>")[0];
        const parser = new xml2js.Parser();
        parser.parseString(String(str), function (err, result) {
          const offerName =
            result.GetSuppliersPSResult.strOfferName[0].split(" ")[0];
          console.log(offerName);
          setOfferName(offerName);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [data]);

  const verifyEmailCheck = (value) => {
    const email = getValues("email");
    const verifyEmail = getValues("verifyEmail");
    if (email && verifyEmail != email && !showemailerr) {
      setError("verifyEmail", {
        type: "manual",
        message: "Email and Verify email should be same",
      });
    } else {
      clearErrors("verifyEmail");
      console.log("this is verify email");
    }
  };

  
  return (
    <div className="info_container">
      {redirect && <Redirect to="/favourites" />}
      {dontRedirect && <Redirect to="/dont-agree" />}
      <div className="head">
        <Link to="/check-details">
          <span>
            <i className="fas fa-chevron-left"></i>&nbsp;Back
          </span>
        </Link>
        <h5>Your Information</h5>
        <div></div>
      </div>
      <div className="body">
        <h6>
          Please review the following personal information, make any edits, and
          continue to save.
        </h6>
        <p>* Required information</p>
        <form
          onSubmit={handleSubmit(async (data) => {
            // setFocus("email");
            // return;
            console.log("Thi is email", data.email);
            console.log("Thi is verify email", data);
            if (data.email !== data.verifyEmail) {
              setshowemailerr(true);
              window.scrollTo(0, 300);
              setFocus("verifyEmail");
              return;
            }
            localStorage.setItem("userData", JSON.stringify(data));
            if (!termsChecked) {
              setTermsOpen(true);
              return;
            }
            localStorage.setItem("userData", JSON.stringify(data));
            const token = localStorage.getItem("token");
            const customerId = localStorage.getItem("customerId");
            const organization = localStorage.getItem("organization");

            let aData = `<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\r\n  <soap12:Body>\r\n    <DPC_UpdateAddress xmlns="http://tempuri.org/">\r\n      <strNameId>${customerId}</strNameId>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n      <strAddress>${data.address}</strAddress>\r\n      <strCity>${data.city}</strCity>\r\n      <strZip>${data.zipCode}</strZip>\r\n      <strState>${data.state}</strState>\r\n      <strBookingPath>${data.strBookingPath}</strBookingPath>\r\n    </DPC_UpdateAddress>\r\n  </soap12:Body>\r\n</soap12:Envelope>`;
            let uData = `<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\r\n  <soap12:Body>\r\n    <DPC_UpdateAccountWeb xmlns="http://tempuri.org/">\r\n      <accountUpdate>\r\n        <strFirstName>${data.firstName}</strFirstName>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n        <strLastName2>${data.lastName}</strLastName2>\r\n        <strStudentId>${customerId}</strStudentId>\r\n        <strGroup>${organization}</strGroup>\r\n        <strEmail>${data.email}</strEmail>\r\n        <strCellPhoneNo>${data.mobile}</strCellPhoneNo>\r\n        <strBookingPath>${data.strBookingPath}</strBookingPath>\r\n        <strBookingId>${bookingId}</strBookingId>\r\n        <strSqlUpdate>string</strSqlUpdate>\r\n        <strMasterBookingUpdate>string</strMasterBookingUpdate>\r\n        <IsAttached>true</IsAttached>\r\n        <strNotes>string</strNotes>\r\n      </accountUpdate>\r\n    </DPC_UpdateAccountWeb>\r\n  </soap12:Body>\r\n</soap12:Envelope>`;
            let aConfig = {
              method: "post",
              url: creds.serviceurl,
              headers: {
                "Content-Type": "text/xml; charset=utf-8",
              },
              data: aData,
            };
            let uConfig = {
              method: "post",
              url: creds.serviceurl,
              headers: {
                "Content-Type": "text/xml; charset=utf-8",
              },
              data: uData,
            };
            axios(aConfig)
              .then(function (response) {
                console.log(JSON.stringify(response.data));
              })
              .catch(function (error) {
                console.log(error);
              });
            axios(uConfig)
              .then(function (response) {
                console.log(JSON.stringify(response.data));
              })
              .catch(function (error) {
                console.log(error);
              });
            // localStorage.removeItem("userData");
            setRedirect(true);
          })}
        >
          <div className="name">
            <h6>Name</h6>
            <p>This is EXACTLY how your Name will appear on the Composite.</p>
            <div className="form_field">
              <label htmlFor="f_name">
                First Name <sup>*</sup>
              </label>
              <div className="input_err">
                <input
                  type="text"
                  id="f_name"
                  {...register("firstName", {
                    required: "First Name is required",
                  })}
                />
                {errors.firstName && (
                  <span className="error">{errors.firstName.message}</span>
                )}
              </div>
            </div>
            <div className="form_field">
              <label htmlFor="l_name">
                Last Name <sup>*</sup>
              </label>
              <div className="input_err">
                <input
                  type="text"
                  id="l_name"
                  {...register("lastName", {
                    required: "Last Name is required",
                  })}
                />
                {errors.lastName && (
                  <span className="error">{errors.lastName.message}</span>
                )}
              </div>
            </div>
          </div>
          <div className="contact">
            <h6>Contact</h6>
            <p>
              Receive SMS notifications and emails to view and order your
              photos.
            </p>
            <div className="form_field">
              <label htmlFor="mobile">
                Cell Phone <sup>*</sup>
              </label>
              <div className="input_err">
                <input
                  type="text"
                  maxLength="10"
                  id="mobile"
                  {...register("mobile", {
                    required: "Phone Number is required",
                    maxLength: {
                      value: 10,
                      message: "Phone number must not exceed 10 digits",
                    },
                    minLength: {
                      value: 10,
                      message: "Phone number must be atleast 10 digits",
                    }, 
                    pattern: {
                      value: /^[0-9]+$/,
                                        
                      message: "Phone number should contain numbers only",
                    },
                  })}
                />
                {errors.mobile && (
                  <span className="error">{errors.mobile.message}</span>
                )}
              </div>
            </div>
            <div className="form_field">
              <label htmlFor="email">
                Email <sup>*</sup>
              </label>
              <div className="input_err">
                <input
                  type="text"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Not a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <span className="error">{errors.email.message}</span>
                )}
              </div>
            </div>
            <div className="form_field">
              <label htmlFor="v_email">
                Verify Email<sup>*</sup>
              </label>
              <div className="input_err">
                <input
                  type="text"
                  id="v_email"
                  onKeyUp={($event) => verifyEmailCheck($event.target.value)}
                  {...register("verifyEmail", {
                    required: "Verify Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Not a valid email",
                    },
                  })}
                />
                {errors.verifyEmail && (
                  <span className="error">{errors.verifyEmail.message}</span>
                )}
                {showemailerr === true ? (
                  <span className="error">
                    Email and Verify email should be same
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="form_field">
              <label htmlFor="a_email">Alt Email</label>
              <div className="input_err">
                <input
                  type="text"
                  id="a_email"
                  {...register("alternateEmail", {
                    // required: "Alternate Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Not a valid email",
                    },
                  })}
                />
                {errors.alternateEmail && (
                  <span className="error">{errors.alternateEmail.message}</span>
                )}
              </div>
            </div>
          </div>
          <div className="address">
            <h6>Address</h6>
            <p>
              Provide your permanent home address. School address is not
              accepted.
            </p>
            <div className="form_field">
              <label htmlFor="add">
                Address <sup>*</sup>
              </label>
              <div className="input_err">
                <input
                  type="text"
                  id="add"
                  {...register("address", { required: "Address is required" })}
                />
                {errors.address && (
                  <span className="error">{errors.address.message}</span>
                )}
              </div>
            </div>
            <div className="form_field">
              <label htmlFor="city">
                City <sup>*</sup>
              </label>
              <div className="input_err">
                <input
                  type="text"
                  id="city"
                  {...register("city", { required: "City is required" })}
                />
                {errors.city && (
                  <span className="error">{errors.city.message}</span>
                )}
              </div>
            </div>
            <div className="form_field">
              <label htmlFor="state">
                State <sup>*</sup>
              </label>
              <div
                className="state"
                style={{
                  width: "370px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  className="input_err"
                  style={{ flex: 1, maxWidth: "160px" }}
                >
                  <select
                    style={{
                      marginRight: "10px",
                      minWidth: "150px",
                      width: "calc(100% - 10px)",
                    }}
                    {...register("state", { required: "State is required" })}
                  >
                    <option value="">Select</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telengana">Telengana</option>
                    <option value="Tamilnadu">Tamilnadu</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                  </select>
                  {errors.func && (
                    <span className="error"> {errors.func.message}</span>
                  )}
                  {errors.state && (
                    <span className="error">{errors.state.message}</span>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <label htmlFor="zip" style={{ marginLeft: 0, width: "87px" }}>
                    Zip Code <sup>*</sup>
                  </label>
                  <div className="input_err">
                    <input
                      type="text"
                      maxLength="5"
                      onChange={onHandleTelephoneChange}
                      style={{ width: "100px", marginLeft: "10px" }}
                      {...register("zipCode", {
                        required: "Zipcode is required",
                        maxLength: {
                          value: 5,
                          message: "Zipcode must be 5 characters",
                        },
                        minLength: {
                          value: 5,
                          message: "Zipcode must be 5 characters",
                        },
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Zipcode should contain numbers only",
                        },
                      })}
                    />
                    {errors.zipCode && (
                      <span className="error">{errors.zipCode.message}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {offerName && offerName == "Greek" && (
            <div className="contact">
              <h6>Chapter Information</h6>
              <p>
                Tell us your school year, initiation semester, and initiation
                year.
              </p>
              <div className="form_field">
                <label htmlFor="s_year">
                  Current School Year <sup>*</sup>
                </label>
                <div className="input_err">
                  <select
                    {...register("curSchoolYear", {
                      required: "Current School Year is required",
                    })}
                  >
                    <option value="">Select</option>
                    <option value="freshman">Freshman</option>
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                    <option alue="other">OTHER</option>
                  </select>
                  {errors.curSchoolYear && (
                    <span className="error">
                      {errors.curSchoolYear.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="form_field">
                <label htmlFor="i_sem">
                  Initiation Semester <sup>*</sup>
                </label>
                <div className="input_err">
                  <select
                    {...register("initiationSem", {
                      required: "Initiation Semister is required",
                    })}
                  >
                    <option value="">Select</option>
                    <option value="spring">Spring</option>
                    <option value="fall">Fall</option>
                    <option value="winter">Winter</option>
                    <option value="n/a">N/A</option>
                  </select>
                  {errors.initiationSem && (
                    <span className="error">
                      {errors.initiationSem.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="form_field">
                <label htmlFor="i_year">Initiation Year</label>
                <div className="input_err">
                  <select {...register("initiationYear", {})}>
                    <option value="">Select</option>
                    {getyear()}
                  </select>
                  {errors.initiationYear && (
                    <span className="error">
                      {errors.initiationYear.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="discount">
            <span>!</span>
            <img
              src={
                discountChecked
                  ? "/images/box_checked1.svg"
                  : "/images/box1.svg"
              }
              width="23"
              height="23"
              alt="check"
              onClick={() => {
                updatediscount(!discountChecked);
                setDiscountChecked(!discountChecked);
              }}
            />
            Get discounts! Sign up now and receive an exclusive coupon when your
            proof is ready.
          </div>
          <div className="terms">
            <span>!</span>
            <img
              src={
                termsChecked ? "/images/box_checked2.svg" : "/images/box2.svg"
              }
              width="23"
              height="23"
              alt="checked"
              onClick={() => setTermsChecked(!termsChecked)}
            />
            <p>
              I accept the&nbsp;{" "}
              <a onClick={() => setIsOpen(true)}>Terms & Conditions</a>&nbsp; to
              choose my pose and appear on the composite.
            </p>
          </div>
          <br />
          <button type="submit">
            Continue&nbsp;<i className="fas fa-chevron-right"></i>
            <i className="fas fa-chevron-right"></i>
          </button>
        </form>
        <Dialog
          className="dialog"
          open={isOpen}
          onClose={() => setIsOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div className="dialog_contaa">
            <h5>Terms and Conditions</h5>
            <p>{terms.default.TC_text}</p>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </Dialog>
        <Dialog
          className="dialog terms-dialog"
          open={termsOpen}
          onClose={() => setTermsOpen(false)}
        >
          <div className="info_dialog_container">
            <p>
              <span>!</span>
            </p>
            <h5>Oops, please review the following options.</h5>
            <br />
            <br />
            <div className="check_option">
              <img
                src={
                  dDiscountChecked
                    ? "/images/checked_black.svg"
                    : "/images/not_checked_black.svg"
                }
                width="18"
                alt=""
                onClick={() => {
                  updatediscount(!dDiscountChecked);
                  setDDiscountChecked(!dDiscountChecked);
                }}
              />
              <strong>Yes!</strong>&nbsp;&nbsp; I would like to receive
              exclusive discounts and offers.
            </div>
            <div className="check_option">
              <img
                src={
                  dTermsChecked
                    ? "/images/checked_black.svg"
                    : "/images/not_checked_black.svg"
                }
                width="18"
                alt=""
                onClick={() => setDTermsChecked(!dTermsChecked)}
              />
              <strong>Yes!</strong>&nbsp;&nbsp; I agree to the &nbsp;
              <a
                onClick={() => {
                  setTermsOpen(false);
                  setIsOpen(true);
                }}
              >
                Terms & Conditions.
              </a>{" "}
              *
            </div>
            <div className="info">
              <small>
                * If you do not accept the terms and conditions, you cannot
                proceed to pose selection and will not appear on the composite.
              </small>
            </div>
            <br />
            {/* <Link to="/dont-agree">
              <a className="simulate">`Simulate I Don't agree`</a>
            </Link> */}
            <button
              onClick={handleSubmit(async (data) => {
                localStorage.getItem("userData", JSON.stringify(data));
                if (!dTermsChecked) {
                  setDontRedirect(true);
                  return;
                }
                const customerId = localStorage.getItem("customerId");
                const organization = localStorage.getItem("organization");

                let aData = `<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\r\n  <soap12:Body>\r\n    <DPC_UpdateAddress xmlns="http://tempuri.org/">\r\n      <strNameId>${customerId}</strNameId>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n      <strAddress>${data.address}</strAddress>\r\n      <strCity>${data.city}</strCity>\r\n      <strZip>${data.zipCode}</strZip>\r\n      <strState>${data.state}</strState>\r\n      <strBookingPath>${data.strBookingPath}</strBookingPath>\r\n    </DPC_UpdateAddress>\r\n  </soap12:Body>\r\n</soap12:Envelope>`;
                let uData = `<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\r\n  <soap12:Body>\r\n    <DPC_UpdateAccountWeb xmlns="http://tempuri.org/">\r\n      <accountUpdate>\r\n        <strFirstName>${data.firstName}</strFirstName>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n        <strLastName2>${data.lastName}</strLastName2>\r\n        <strStudentId>${customerId}</strStudentId>\r\n        <strGroup>${organization}</strGroup>\r\n        <strEmail>${data.email}</strEmail>\r\n        <strCellPhoneNo>${data.mobile}</strCellPhoneNo>\r\n        <strBookingPath>${data.strBookingPath}</strBookingPath>\r\n        <strBookingId>${bookingId}</strBookingId>\r\n        <strSqlUpdate>string</strSqlUpdate>\r\n        <strMasterBookingUpdate>string</strMasterBookingUpdate>\r\n        <IsAttached>true</IsAttached>\r\n        <strNotes>string</strNotes>\r\n      </accountUpdate>\r\n    </DPC_UpdateAccountWeb>\r\n  </soap12:Body>\r\n</soap12:Envelope>`;
                let aConfig = {
                  method: "post",
                  url: creds.serviceurl,
                  headers: {
                    "Content-Type": "text/xml; charset=utf-8",
                  },
                  data: aData,
                };
                let uConfig = {
                  method: "post",
                  url: creds.serviceurl,
                  headers: {
                    "Content-Type": "text/xml; charset=utf-8",
                  },
                  data: uData,
                };
                axios(aConfig)
                  .then(function (response) {
                    console.log(JSON.stringify(response.data));
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
                axios(uConfig)
                  .then(function (response) {
                    console.log(JSON.stringify(response.data));
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
                // localStorage.removeItem("userData");
                setRedirect(true);
              })}
            >
              Continue&nbsp;<i className="fas fa-chevron-right"></i>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default PersionalInfo;
