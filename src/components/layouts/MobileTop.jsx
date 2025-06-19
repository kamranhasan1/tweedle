import React, { useContext, useEffect } from "react";
import logo from "../../assets/images/logo.png";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const MobileTop = () => {
  const { buttonText, setButtonText, visible, setVisible } =
    useContext(AppContext);

  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast("Logged out", {
        icon: "😿",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };
  const navtoLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setButtonText(true);
        } else {
          setButtonText(false);
        }
      });
    } catch (err) {
      console.log(err.code);
    }

    if (location.pathname === "/login" || location.pathname === "/signup") {
      setVisible(false);
    }
  }, [visible]);
  return (
    <div>
      <section className="w-screen flex justify-between items-center border-b px-5 py-1 md:hidden">
        <div className="flex items-center gap-1">
          <img src={logo} className="w-12" />
          Tweedle
        </div>
        {visible && (
          <button
            onClick={buttonText ? logoutHandler : navtoLogin}
            className="px-4 py-2  bg-white text-black rounded-md"
          >
            {buttonText === false ? "Login" : "Logout"}
          </button>
        )}
      </section>
    </div>
  );
};

export default MobileTop;
