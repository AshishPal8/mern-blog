import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import CallToAction from "../components/CallToAction";

const Home = () => {
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
      <div className="max-w-6xl mx-auto p-3 pt-10">
        <CallToAction
          title="Test Your Knowledge!"
          description="Take our fun quiz and see how much you know. Start now!"
          buttonText="Play Now"
          buttonUrl="/leaderboard"
          bgImageUrl="https://img.freepik.com/free-vector/half-tone-blue-abstract-background-with-text-space_1017-41428.jpg"
        />
      </div>
      <div className="max-w-6xl mx-auto p-3">
        <h1 className="text-3xl font-semibold text-center mx-5 mt-5">
          Recent Posts
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 place-items-center">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </div>
  );
};

export default Home;
