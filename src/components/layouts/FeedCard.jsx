import {
  BsFillBookmarkHeartFill,
  BsFillBookmarkCheckFill,
} from "react-icons/bs";
import { BiSolidCommentDetail, BiSolidCommentAdd } from "react-icons/bi";
import { auth, db } from "../../firebase/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const FeedCard = ({
  username,
  tweedle,
  likes,
  tags,
  thisPostid,
  deleteIcon,
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const [cmnts, setCmnts] = useState([]);
  const gettingComments = async () => {
    const commentsRef = collection(db, `posts/${thisPostid}/comments`);
    try {
      const thisPostCommentsFetching = [];
      const snapshot = await getDocs(commentsRef);
      snapshot.forEach((eachComment) => {
        thisPostCommentsFetching.push({
          ...eachComment.data(),
          id: eachComment.id,
        });
      });
      setCmnts(thisPostCommentsFetching);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const run = async () => {
      await gettingComments();
    };
    run().catch((err) => console.log(err));
  }, []);

  const navigate = useNavigate();
  // const likeHandler = async () => {
  //   try {
  //     const postsRef = collection(db, "posts");
  //     const snapshot = await getDocs(postsRef);
  //     snapshot.forEach(async (eachPost) => {
  //       if (eachPost.id === thisPostid) {
  //         await updateDoc(doc(db, "posts", eachPost.id), {
  //           likes: likes + 1,
  //         });
  //         console.log(likes);
  //       }
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // chakra ui modal
  const {
    isOpen: createcmntModalisOpen,
    onClose: createcmntModalonClose,
    onOpen: createcmntModalonOpen,
  } = useDisclosure();

  const {
    isOpen: viewCmntsModalisOpen,
    onClose: viewCmntsModalonClose,
    onOpen: viewCmntsModalonOpen,
  } = useDisclosure();

  const [newCmnt, setNewCmnt] = useState({
    name: "",
    tweedle: "",
  });
  useEffect(() => {
    if (auth.currentUser) {
      setNewCmnt({ ...newCmnt, name: auth?.currentUser?.displayName });
    }
  }, []);

  const handleCreateNewCmnt = async (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      if (!auth.currentUser.displayName) {
        navigate("/profile");
        toast("Pick a username first🤓", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        return;
      }
      try {
        await setDoc(
          doc(
            db,
            `posts/${thisPostid}/comments`,
            `commentBy${auth.currentUser?.uid}${crypto.randomUUID()}`
          ),
          newCmnt
        );
        toast("commented", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setNewCmnt({
          name: "",
          tweedle: "",
        });
        const run = async () => {
          await gettingComments();
        };
        run().catch((err) => console.log(err));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const deletePost = async (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, `posts`, thisPostid));
        toast("I'll be gone👋", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const saveHandler = async () => {
    if (auth.currentUser) {
      try {
        await setDoc(
          doc(db, `mySavedPosts${auth.currentUser?.uid}`, `${thisPostid}`),
          {
            id: thisPostid,
            likes: likes,
            name: username,
            tweedle: tweedle,
            tags: tags,
          }
        );
        setIsSaved(true);
        toast("Saved", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      navigate("/login");
    }
  };

  const unSaveHandler = async () => {
    if (auth.currentUser) {
      try {
        await deleteDoc(
          doc(db, `mySavedPosts${auth.currentUser?.uid}`, `${thisPostid}`)
        );
        toast("🌊Removed", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setIsSaved(false);
      } catch (err) {
        console.log(err);
      }
    }
  };
  const checkingLikedOnLoading = async () => {
    try {
      const snap = await getDoc(
        doc(db, `mySavedPosts${auth.currentUser?.uid}`, `${thisPostid}`)
      );
      if (snap.exists()) {
        setIsSaved(true);
      } else {
        setIsSaved(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteComment = async (e, thisComment) => {
    e.preventDefault();
    try {
      await deleteDoc(
        doc(db, `posts/${thisPostid}/comments`, `${thisComment}`)
      );
      toast("🧺Deleted", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      const run = async () => {
        await gettingComments();
      };
      run().catch((err) => console.log(err));
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    const run = async () => {
      await checkingLikedOnLoading();
    };
    run().catch((err) => console.log(err));
  }, []);
  return (
    <div className="bg-zinc-900 border rounded-md px-2 py-2 my-2 hover:shadow-lg hover:shadow-white transition-all">
      <p className="text-2xl">@{username}</p>
      <textarea
        className="bg-black px-1 my-2 rounded-md w-full text-xl"
        value={tweedle}
        disabled
      ></textarea>
      {tags.trim() !== "" && (
        <>
          <h6 className="text-2xl">Tags</h6>
          <textarea
            className="bg-black px-1 my-2 rounded-md w-full text-xl"
            value={tags}
            disabled
          ></textarea>
        </>
      )}
      {/* dont feel like adding likes now */}
      {/* <div
        className="flex items-center justify-center w-fit gap-1 text-2xl"
        onClick={likeHandler}
        >
        <AiOutlineHeart />
        <p>{likes}</p>
      </div> */}
      <div className="flex items-center gap-3">
        <button className="flex items-center justify-center w-fit gap-1 text-2xl mb-1">
          {isSaved ? (
            <BsFillBookmarkCheckFill onClick={unSaveHandler} />
          ) : (
            <BsFillBookmarkHeartFill onClick={saveHandler} />
          )}
        </button>

        {/* <button className="text-2xl" onClick={() => setCmntDisplay(true)}>
          <FaRegCommentAlt />
        </button>
        {cmntDisplay && (
          <>
          <div className="bg-zinc-900 opacity-90 w-full absolute top-0 right-0 left-0">
          <button
          className="text-2xl"
          onClick={() => setCmntDisplay(false)}
          >
          <MdOutlineCancel />
          </button>
          </div>
          </>
        )} */}

        <button
          className="text-2xl outline-none"
          onClick={createcmntModalonOpen}
        >
          <BiSolidCommentAdd />
        </button>
        <Modal isOpen={createcmntModalisOpen} onClose={createcmntModalonClose}>
          <ModalOverlay />
          <ModalContent marginStart={"0.5rem"} marginEnd={"0.5rem"}>
            <ModalBody
              bg="brand.maingray"
              border="brand.white"
              borderWidth={"1px"}
              borderRadius={"md"}
            >
              <form>
                <p className="text-xl underline">
                  Reply to @{username}'s tweedle
                </p>
                <textarea
                  className="bg-black px-1 my-2 rounded-md w-full text-xl"
                  value={tweedle}
                  disabled
                ></textarea>
                <div className="flex items-center justify-start gap-3">
                  <p className="text-white text-md mb-3 underline">
                    {auth.currentUser?.displayName
                      ? `Reply as @${auth.currentUser?.displayName}`
                      : "@youdonthaveaname"}
                  </p>
                </div>
                <textarea
                  className="bg-black outline-none rounded-md px-2 py-1 mb-2 w-full h-32 placeholder:text-white placeholder:text-md"
                  type="text"
                  placeholder="Whats on your mind?"
                  value={newCmnt.tweedle}
                  onChange={(e) =>
                    setNewCmnt({ ...newCmnt, tweedle: e.target.value })
                  }
                  required
                ></textarea>
                <button
                  onClick={handleCreateNewCmnt}
                  className="bg-white text-black rounded-md px-8 py-2 mt-2 text-lg mx-auto"
                  disabled={newCmnt.tweedle === "" ? true : false}
                >
                  Comment
                </button>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>

        <button
          className="text-2xl outline-none"
          onClick={viewCmntsModalonOpen}
        >
          <BiSolidCommentDetail />
        </button>
        <Modal isOpen={viewCmntsModalisOpen} onClose={viewCmntsModalonClose}>
          <ModalOverlay />
          <ModalContent marginStart={"0.5rem"} marginEnd={"0.5rem"}>
            <ModalBody
              bg="brand.maingray"
              border="brand.white"
              borderWidth={"1px"}
              borderRadius={"md"}
            >
              <div>
                <ModalCloseButton />
                <p className="text-xl underline">
                  Comments on @{username}'s tweedle
                </p>
                <textarea
                  className="bg-black px-1 my-2 rounded-md w-full text-xl"
                  value={tweedle}
                  disabled
                ></textarea>
                <div className="flex flex-col gap-2 mt-1">
                  {cmnts.map((eachComment) => (
                    <div
                      className="border border-white rounded-md px-2 pt-2 mt-2"
                      key={eachComment.id}
                    >
                      <p>@{eachComment.name}</p>
                      <textarea
                        className="bg-black px-1 my-2 rounded-md w-full text-xl"
                        value={eachComment.tweedle}
                        readOnly
                      ></textarea>
                      {eachComment.id.startsWith(
                        "commentBy" + auth.currentUser?.uid
                      ) ? (
                        <button
                          onClick={(e) => deleteComment(e, eachComment.id)}
                          className="bg-white text-black rounded-md px-3 py-1 mb-3 text-lg"
                        >
                          Delete Comment
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
        {deleteIcon && (
          <button
            className="bg-white text-black rounded-md px-3 py-1 text-lg"
            onClick={deletePost}
          >
            Delete Post
          </button>
        )}
      </div>
    </div>
  );
};

export default FeedCard;
