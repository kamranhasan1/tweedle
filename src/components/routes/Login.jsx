import React, { useContext, useEffect, useState } from "react";
import { BsGoogle } from "react-icons/bs";
import logo from "../../assets/images/logo.png";
import { auth, provider } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { AppContext } from "../../context/AppContext";

const Login = () => {
  const { setVisible } = useContext(AppContext);
  const navigate = useNavigate();

  const [formEntries, setFormEntries] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (location.pathname === "/login" || location === "/signup") {
      setVisible(false);
    }
  }, []);

  const loginSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(
        auth,
        formEntries.email,
        formEntries.password
      );
      localStorage.setItem("isLoggedIn", true);
      setVisible(true);
      toast(`Logged in.`, {
        icon: "🎀",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      navigate("/");
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        toast("Invalid Credentials", {
          icon: "🐱‍👤",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else if (err.code === "auth/user-not-found") {
        toast("Need to sign up first", {
          icon: "👽",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        navigate("/signup");
      } else if (err.code === "auth/network-request-failed") {
        toast("Looks like you're disconnected", {
          icon: "🕸",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        console.log(err.code);
      }
    }
  };

  const submitGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      setVisible(true);
      toast(`Logged in.`, {
        icon: "🎀",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      localStorage.setItem("isLoggedIn", true);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/network-request-failed") {
        toast("Looks like you're disconnected", {
          icon: "🕸",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        console.log(err.code);
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
        <h2 className="text-3xl font-bold underline text-center">Login</h2>
        <form
          className="flex flex-col items-center gap-3 my-3"
          onSubmit={loginSubmitHandler}
        >
          <input
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setFormEntries((prev) => ({ ...prev, email: e.target.value }))
            }
            required
            className="bg-zinc-900 focus:outline-none rounded-md shadow-black placeholder:text-slate-100 text-slate-100 text-2xl px-2 py-1"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setFormEntries((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            required
            className="bg-zinc-900 rounded-md focus:outline-none shadow-black placeholder:text-slate-100 text-slate-100 text-2xl px-2 py-1"
          />
          <button className="bg-white text-black focus:outline-none px-5 text-xl py-1 mt-3 rounded-md w-full">
            Login Now
          </button>
        </form>
        <div className="border w-full border-white rounded-full mb-2"></div>
        <button
          onClick={submitGoogle}
          className="hidden lg:flex justify-center items-center gap-2 bg-white text-black w-full px-5 text-xl py-1 rounded-md"
        >
          <BsGoogle />
          Sign In with Google
        </button>
        <p className="my-2 text-lg text-center">
          Don't have an account?
          <span
            className="underline cursor-pointer pl-1"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
