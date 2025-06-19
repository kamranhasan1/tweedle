import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { AppContext } from "../../context/AppContext";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import home from "../../assets/svgs/home.svg";
import search from "../../assets/svgs/search.svg";
import activity from "../../assets/svgs/heart.svg";
import newpost from "../../assets/svgs/create.svg";
import user from "../../assets/svgs/user.svg";

const LeftAside = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { visible, setVisible, buttonText, setButtonText } =
    useContext(AppContext);
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
    visible && (
      <div>
        <section className=" sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-start gap-3 overflow-auto border-r px-10 pb-5 pt-28 max-md:hidden">
          <div className="flex items-center gap-2">
            <img src={logo} className="w-12 ml-5 " />
            <h2 className="text-3xl">Tweedle</h2>
          </div>
          <div className="px-3 text-xl">
            <div
              onClick={() => {
                navigate("/");
              }}
              className="flex p-4 cursor-pointer rounded-full w-40 items-center gap-3 hover:bg-zinc-800 "
            >
              <img src={home} />
              <p className="max-md:hidden">Home</p>
            </div>
            <div
              onClick={() => {
                navigate("/search");
              }}
              className="flex p-4 cursor-pointer rounded-full w-40 items-center gap-3 hover:bg-zinc-800 "
            >
              <img src={search} />
              <p className="max-md:hidden">Search</p>
            </div>
            <div
              onClick={() => {
                navigate("/activity");
              }}
              className="flex p-4 cursor-pointer rounded-full w-40 items-center gap-3 hover:bg-zinc-800 "
            >
              <img src={activity} />
              <p className="max-md:hidden">Activity</p>
            </div>
            <div
              onClick={() => {
                navigate("/new-post");
              }}
              className="flex p-4 cursor-pointer rounded-full w-40 items-center gap-3 hover:bg-zinc-800 "
            >
              <img src={newpost} />
              <p className="max-md:hidden">New Post</p>
            </div>
            <div
              onClick={() => {
                navigate("/profile");
              }}
              className="flex p-4 cursor-pointer rounded-full w-40 items-center gap-3 hover:bg-zinc-800 "
            >
              <img src={user} />
              <p className="max-md:hidden">Profile</p>
            </div>
            <button
              onClick={buttonText ? logoutHandler : navtoLogin}
              className="p-3 mt-10 w-full bg-white text-black rounded-full"
            >
              {buttonText === false ? "Login" : "Logout"}
            </button>
          </div>
        </section>
        <section className="md:hidden fixed bottom-0 border-t bg-black">
          <div className="px-3 flex w-screen justify-evenly">
            <div
              onClick={() => {
                navigate("/");
              }}
              className="flex p-4 cursor-pointer rounded-full items-center gap-3 "
            >
              <img src={home} />
            </div>
            <div
              onClick={() => {
                navigate("/search");
              }}
              className="flex p-4 cursor-pointer rounded-full items-center gap-3 "
            >
              <img src={search} />
            </div>
            <div
              onClick={() => {
                navigate("/activity");
              }}
              className="flex p-4 cursor-pointer rounded-full items-center gap-3 "
            >
              <img src={activity} />
            </div>
            <div
              onClick={() => {
                navigate("/new-post");
              }}
              className="flex p-4 cursor-pointer rounded-full items-center gap-3 "
            >
              <img src={newpost} />
            </div>
            <div
              onClick={() => {
                navigate("/profile");
              }}
              className="flex p-4 cursor-pointer rounded-full items-center gap-3 "
            >
              <img src={user} />
            </div>
          </div>
        </section>
      </div>
    )
  );
};

export default LeftAside;
