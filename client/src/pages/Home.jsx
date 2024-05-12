import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PostCard from "../components/PostCard";

const Home = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [recentPosts, setRecentPosts] = useState(null);
  console.log(recentPosts);

  const { postSlug } = useParams();
  useEffect(() => {
    try {
      const fetchRecentPost = async () => {
        const res = await fetch(`/api/post/getposts?limit=9`);
        const data = await res.json();

        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPost();
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  return (
    <div className="bg-[#F4F7FE] dark:bg-[#1E2142]">
      <div className="max-w-6xl mx-auto p-3">
        <h1 className="text-2xl font-semibold mx-5 mt-5">Recent Posts</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 place-items-center">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </div>
  );
};

export default Home;
