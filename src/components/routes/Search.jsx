import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import FeedCard from "../layouts/FeedCard";

const Search = () => {
  const [postList, setPostList] = useState([]);
  const [searchText, setSearchText] = useState("");

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
      <div className="w-full sticky -top-0 bg-black py-2">
        <h2 className="text-2xl py-2  rounded-sm ">Search</h2>
        <input
          type="text"
          className="bg-zinc-800 outline-none rounded-md px-2 py-1 mt-3 w-full h-10 placeholder:text-white placeholder:text-md"
          placeholder="🔍 Search..."
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div>
        {postList
          .filter((post) => {
            return searchText.toLowerCase() === ""
              ? post
              : post.name.toLowerCase().includes(searchText.toLowerCase()) ||
                  post.tweedle
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                  post.tags.toLowerCase().includes(searchText.toLowerCase());
          })
          .map((eachPost) => (
            <FeedCard
              key={eachPost.id}
              username={eachPost.name}
              tweedle={eachPost.tweedle}
              likes={eachPost.likes}
              tags={eachPost.tags}
            />
          ))}
      </div>
    </div>
  );
};

export default Search;
