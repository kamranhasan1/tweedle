import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { BsGoogle } from "react-icons/bs";
import { AppContext } from "../../context/AppContext";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase/firebase";
import { toast } from "react-hot-toast";

const Signup = () => {
  const { visible, setVisible } = useContext(AppContext);
  const navigate = useNavigate();
  const [signupEntries, setSignupEntries] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    if (location.pathname === "/login" || location === "/signup") {
      setVisible(!visible);
    }
  }, []);

  const signupSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(
        auth,
        signupEntries.email,
        signupEntries.password
      );
      toast(`Logged in.`, {
        icon: "🎀",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setVisible(true);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        toast("Account already exists. Log in");
        navigate("/login");
      } else if (err.code === "auth/invalid-email") {
        toast("Enter valid email id");
      } else if (err.code === "auth/weak-password") {
        toast("Stronger password needed");
      } else {
        console.log(err.code);
      }
    }
  };

  const submitGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast(`Logged in.`, {
        icon: "🎀",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setVisible(true);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/network-request-failed") {
        toast("Looks like you're disconnected");
      } else {
        console.log(err);
      }
    }
  };
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div>
        <h2 className="text-3xl font-extrabold flex justify-center items-center">
          <img src={logo} className="w-16" />
          Tweedle
        </h2>
        <h2 className="text-3xl text-center font-bold underline">Sign Up</h2>
        <form
          className="flex flex-col items-center gap-3 my-3"
          onSubmit={signupSubmitHandler}
        >
          <input
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setSignupEntries((prev) => ({ ...prev, email: e.target.value }))
            }
            required
            className="bg-zinc-900 rounded-md  placeholder:text-slate-100 text-slate-100  text-2xl px-2 py-1"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setSignupEntries((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            required
            className="bg-zinc-900 rounded-md  placeholder:text-slate-100 text-slate-100  text-2xl px-2 py-1"
          />
          <button className="bg-white  text-black dark:text-darkorange px-5 text-xl py-1 mt-3 rounded-md w-full">
            Sign Up
          </button>
        </form>

        <div className="border w-full border-white rounded-full mb-2"></div>

        <button
          onClick={submitGoogle}
          className="hidden lg:flex justify-center items-center gap-2 bg-white text-black w-full px-5 text-xl py-1 rounded-md"
        >
          <BsGoogle />
          Sign Up with Google
        </button>

        <p className="mb-2 mt-4 text-lg text-center">
          Already have an account?
          <span
            className="underline cursor-pointer pl-1"
            onClick={() => navigate("/login")}
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
