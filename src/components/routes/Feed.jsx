import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import FeedCard from "../layouts/FeedCard";

const Feed = () => {
  const [postList, setPostList] = useState([]);

  const gettingPosts = async () => {
    const postsRef = collection(db, "posts");
    try {
      const postListFetching = [];
      const snapshot = await getDocs(postsRef);
      snapshot.forEach((eachPost) => {
        postListFetching.push({
          ...eachPost.data(),
          id: eachPost.id,
        });
      });
      setPostList(postListFetching);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const run = async () => {
      await gettingPosts();
    };
    run().catch((err) => console.log(err));
  }, []);

  if (postList.length === 0) {
    return (
      <div className="h-96 w-full flex justify-center items-center">
        Loading...
      </div>
    );
  }
  return (
    <div className="px-5 mb-20 md:mb-0 w-full h-[46rem] overflow-scroll">
      <h2 className="text-2xl py-2 bg-black rounded-sm w-full sticky -top-0">
        Home
      </h2>
      <div className="flex flex-col gap-3">
        {postList.map((eachPost) => (
          <FeedCard
            key={eachPost.id}
            username={eachPost.name}
            tweedle={eachPost.tweedle}
            likes={eachPost.likes}
            tags={eachPost.tags}
            thisPostid={eachPost.id}
            deleteIcon={
              eachPost.id.startsWith(auth.currentUser?.uid) ? true : false
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Feed;
