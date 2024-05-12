import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="my-5 p-4 border-[1px] dark:border-[rgba(168,179,207,.16)] sm:w-[340px] rounded-2xl dark:hover:bg-[rgba(168,179,207,.08)]">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt={post.slug}
          className="h-[180px] w-full object-cover rounded-lg"
        />
        <div>
          <p className="font-thin text-lg text-slate-500">{post.category}</p>
          <h1 className="text-2xl font-semibold line-clamp-2">{post.title}</h1>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
