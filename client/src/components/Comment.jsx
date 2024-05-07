import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

const Comment = ({ comment, onLike }) => {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  console.log(user);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUsers();
  }, [comment]);
  return (
    <div className="flex gap-3 p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-10 h-10 object-cover rounded-full"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-sm truncate">
            {user ? `@${user.username}` : "Anonymous User"}
          </span>
          <span className="text-gray-500 text-sm font-semibold">
            {moment(user.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 pb-2">
          {comment.content}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onLike(comment._id)}
            className={`text-gray-500 ${
              currentUser &&
              comment.likes.includes(currentUser._id) &&
              "text-sky-600"
            }`}
          >
            <FaThumbsUp />
          </button>
          <p className="text-gray-500">
            {comment.numberOfLikes > 0 &&
              comment.numberOfLikes +
                " " +
                (comment.numberOfLikes === 1 ? "like" : "likes")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
