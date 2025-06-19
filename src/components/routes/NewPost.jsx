import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const NewPost = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({
    name: "",
    tweedle: "",
    tags: "",
    likes: 0,
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        setPost({ ...post, name: auth?.currentUser?.displayName });
      }
    });
  }, []);

  const handleCreateNewPost = async (e) => {
    e.preventDefault();
    if (post.name === null) {
      toast("Create a Username first");
      navigate("/profile");
    } else {
      setPost({ ...post, name: "youdonthaveaname" });
      try {
        await setDoc(
          doc(
            db,
            "posts",
            `${auth.currentUser?.uid}${
              auth.currentUser?.displayName
            }${crypto.randomUUID()}`
          ),
          post
        );
        toast("Posted", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setPost({
          name: "",
          tweedle: "",
          tags: "",
          likes: 0,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="px-5 py-2 border w-full h-full">
      <h2 className="text-4xl mb-5">New Post</h2>
      <div className="flex items-center justify-start gap-3">
        <p className="text-white text-lg mb-3">
          {auth.currentUser?.displayName
            ? `@${auth.currentUser.displayName}`
            : "@youdonthaveaname"}
        </p>
      </div>
      <form>
        <textarea
          className="bg-zinc-800 outline-none rounded-md px-2 py-1 mb-2 w-full h-32 placeholder:text-white placeholder:text-md"
          type="text"
          placeholder="Whats on your mind?"
          value={post.tweedle}
          onChange={(e) => setPost({ ...post, tweedle: e.target.value })}
          required
        />
        <textarea
          className="bg-zinc-800 outline-none rounded-md px-2 py-1 w-full h-10 placeholder:text-white placeholder:text-md"
          type="text"
          placeholder="#Tags Here"
          value={post.tags}
          onChange={(e) => setPost({ ...post, tags: e.target.value })}
          required
        />
        <button
          onClick={handleCreateNewPost}
          className="bg-white text-black rounded-md px-8 py-2 mt-2 text-lg mx-auto"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default NewPost;
