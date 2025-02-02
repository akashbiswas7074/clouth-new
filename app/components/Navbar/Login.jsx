import React, { useState } from "react";
import {
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Typography,
} from "@material-tailwind/react";

const COUNTRIES = [
  "INDIA (+91)",
  "France (+33)",
  "Germany (+49)",
  "Spain (+34)",
  "USA (+1)",
];
const CODES = ["+91", "+49", "+34", "+1", "+33"];

const Login = ({ login, setLogin }) => {
  const [country, setCountry] = useState(0);
  const [activeTab, setActiveTab] = useState("signIn");

  // State for signIn form
  const [signInName, setSignInName] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPhone, setSignInPhone] = useState("");

  // State for signUp form
  const [signUpFirstName, setSignUpFirstName] = useState("");
  const [signUpLastName, setSignUpLastName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpZipCode, setSignUpZipCode] = useState("");
  const [signUpCountry, setSignUpCountry] = useState("");
  const [signUpWhatsApp, setSignUpWhatsApp] = useState("");

  return (
    <div className="bg-white h-[70vh] w-[50vw] transform translate-y-[60%] rounded-3xl relative text-black flex overflow-hidden">
      <span
        onClick={() => {
          setActiveTab("signIn");
        }}
        className={`w-[50%] h-[15%] text-black flex justify-center p-2 font-bold ${
          activeTab === "signIn"
            ? `bg-slate-900 text-white rounded-t-3xl`
            : "bg-white text-black rounded-none"
        }`}
      >
        SignIn
      </span>
      <span
        onClick={() => {
          setActiveTab("signUp");
        }}
        className={`w-[50%] h-[15%] text-black flex justify-center p-2 font-bold border-white ${
          activeTab === "signUp"
            ? `bg-slate-900 text-white rounded-t-3xl`
            : "bg-white text-black rounded-none"
        }`}
      >
        SignUp
      </span>

      <div
        className="h-[90%] w-full absolute pb-4 bottom-0 bg-[#b6aaaa] flex flex-col justify-center items-center rounded-t-3xl overflow-scroll overflow-x-hidden"
        style={{
          scrollbarWidth: "2px",
        }}
      >
        {activeTab === "signIn" ? (
          <form className="flex flex-col gap-6 w-full justify-center items-start p-4">
            <div className="flex gap-4 w-full">
              <label htmlFor="signInName" className="font-bold text-xl">
                Name
              </label>
              <input
                type="text"
                id="signInName"
                value={signInName}
                onChange={(e) => setSignInName(e.target.value)}
                placeholder="Name"
                className="bg-white px-4 p-1 rounded-lg w-3/4"
              />
            </div>
            <div className="flex  justify-evenly w-full">
              <label htmlFor="signInEmail" className="font-bold text-xl">
                Email
              </label>
              <input
                type="text"
                id="signInEmail"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                placeholder="Email"
                className="bg-white px-4 p-1 rounded-lg w-3/4"
              />
            </div>

            <div className="flex gap-4 w-full">
              <label htmlFor="signInPhone" className="font-bold text-xl">
                Phone
              </label>
              <input
                type="text"
                id="signInPhone"
                value={signInPhone}
                onChange={(e) => setSignInPhone(e.target.value)}
                placeholder="87990xxxx"
                className="bg-white px-4 p-1 rounded-lg w-3/4"
              />
            </div>

            <div className="flex flex-col w-full justify-center items-center">
              <p className="text-lg font-bold">Login with Gmail</p>
              <span>
                <img
                  className="w-[40px]"
                  src="https://img.icons8.com/color/48/000000/google-logo.png"
                />
              </span>
            </div>

            <div className="flex justify-center items-center w-full gap-5">
              <button className="bg-slate-950 text-white px-12 p-1 rounded-xl">
                Sign In
              </button>
              <button
                onClick={() => {
                  setLogin(false);
                }}
                className="bg-white border-black border-2 text-black px-12 p-1 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form className="flex flex-col gap-2 w-full justify-center items-start pl-4">
            <div className="flex gap-4 w-full">
              <span className="flex flex-col w-full">
                <label htmlFor="signUpFirstName" className="font-bold text-md">
                  First Name
                </label>
                <input
                  type="text"
                  id="signUpFirstName"
                  value={signUpFirstName}
                  onChange={(e) => setSignUpFirstName(e.target.value)}
                  placeholder="First Name"
                  className="bg-white px-4 p-1 rounded-lg w-3/4"
                />
              </span>
              <span className="flex flex-col w-full">
                <label htmlFor="signUpLastName" className="font-bold text-md">
                  Last Name
                </label>
                <input
                  type="text"
                  id="signUpLastName"
                  value={signUpLastName}
                  onChange={(e) => setSignUpLastName(e.target.value)}
                  placeholder="Last Name"
                  className="bg-white px-4 p-1 rounded-lg w-3/4"
                />
              </span>
            </div>
            <div className="flex gap-4 w-full">
              <label htmlFor="signUpEmail" className="font-bold text-xl">
                Email
              </label>
              <input
                type="text"
                id="signUpEmail"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                placeholder="Email"
                className="bg-white px-4 p-1 rounded-lg w-3/4"
              />
            </div>

            <div className="w-full justify-evenly flex gap-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-1 font-bold text-xl"
              >
                Phone
              </Typography>
              <div className="relative flex w-full">
                <Menu placement="bottom-start">
                  <MenuHandler>
                    <Button
                      ripple={false}
                      variant="text"
                      color="blue-gray"
                      className="h-10 w-14 shrink-0  border border-r-0 border-blue-gray-200 bg-transparent px-3 bg-white"
                    >
                      {CODES[country]}
                    </Button>
                  </MenuHandler>
                  <MenuList className="max-h-[20rem] max-w-[18rem] z-50">
                    {COUNTRIES.map((country, index) => {
                      return (
                        <MenuItem
                          key={country}
                          value={country}
                          onClick={() => setCountry(index)}
                        >
                          {country}
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </Menu>
                <input
                  type="tel"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={12}
                  placeholder="324-456-2323"
                  value={signUpPhone}
                  onChange={(e) => setSignUpPhone(e.target.value)}
                  className="bg-white border-none px-4 rounded-lg w-3/4"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <span className="flex  items-center justify-evenly w-full">
                <label htmlFor="signUpZipCode" className="font-bold text-md">
                  Zip Code
                </label>
                <input
                  type="text"
                  id="signUpZipCode"
                  value={signUpZipCode}
                  onChange={(e) => setSignUpZipCode(e.target.value)}
                  placeholder="Zip Code"
                  className="bg-white px-4 p-1 rounded-lg w-3/4"
                />
              </span>
              <span className="flex justify-evenly w-full">
                <label htmlFor="signUpCountry" className="font-bold text-md">
                  Country
                </label>
                <input
                  type="text"
                  id="signUpCountry"
                  value={signUpCountry}
                  onChange={(e) => setSignUpCountry(e.target.value)}
                  placeholder="Country"
                  className="bg-white px-4 p-1 rounded-lg w-3/4"
                />
              </span>
            </div>

            <div className="flex  justify-evenly w-full">
              <label htmlFor="signUpWhatsApp" className="font-bold text-md">
                WhatsApp
              </label>
              <input
                type="text"
                id="signUpWhatsApp"
                value={signUpWhatsApp}
                onChange={(e) => setSignUpWhatsApp(e.target.value)}
                placeholder="333-333-3334"
                className="bg-white px-4 p-1 rounded-lg w-3/4"
              />
            </div>

            <div className="flex flex-col w-full mt-4 justify-center items-center">
              <p className="text-lg font-bold">Login with Gmail</p>
              <span>
                <img
                  className="w-[40px]"
                  src="https://img.icons8.com/color/48/000000/google-logo.png"
                />
              </span>
            </div>

            <div className="flex justify-center items-center w-full gap-5">
              <button className="bg-slate-950 text-white px-12 p-1 rounded-xl">
                Sign Up
              </button>
              <button
                onClick={() => {
                  setLogin(false);
                }}
                className="bg-white border-black border-2 text-black px-12 p-1 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;