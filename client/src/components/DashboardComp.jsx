import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

const DashboardComp = () => {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState([]);
  const [totalPosts, setTotalPosts] = useState([]);
  const [totalComments, setTotalComments] = useState([]);
  const [lastMonthUsers, setLastMonthUsers] = useState([]);
  const [lastMonthPosts, setLastMonthPosts] = useState([]);
  const [lastMonthComments, setLastMonthComments] = useState([]);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers?limit=5`);
        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=5`);
        const data = await res.json();

        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments?limit=5`);
        const data = await res.json();

        if (res.ok) {
          setComments(data.comment);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);
  return (
    <div className="p-3 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center">
        <div className="flex flex-col py-4 px-5 bg-white dark:bg-[#262E54] gap-4 md:w-[350px] w-full rounded-3xl">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 dark:text-gray-100 text-medium font-semibold">
                Total Users
              </h3>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-[#F4F7FE] dark:bg-[#27345D]  text-blue-600 rounded-full text-5xl p-3" />
          </div>
          <div className="flex gap-1 text-sm">
            <span className="text-green-500 font-bold text-sm flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500 dark:text-gray-100 font-thin text-sm">
              Last month
            </div>
          </div>
        </div>
        <div className="flex flex-col py-4 px-5 bg-white dark:bg-[#262E54] gap-4 md:w-[350px] w-full rounded-3xl ">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 dark:text-gray-100 text-medium font-semibold">
                Total Posts
              </h3>
              <p className="text-2xl font-bold">{totalPosts}</p>
            </div>
            <HiDocumentText className="bg-[#f8fff5] dark:bg-[#27345D] text-green-600 rounded-full text-5xl p-3" />
          </div>
          <div className="flex gap-1 text-sm">
            <span className="text-green-500 font-bold text-sm flex items-center">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className="text-gray-500 dark:text-gray-100 font-thin text-sm">
              Last month
            </div>
          </div>
        </div>
        <div className="flex flex-col py-4 px-5 bg-white dark:bg-[#262E54] gap-4 md:w-[350px] w-full rounded-3xl ">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 dark:text-gray-100 text-medium font-semibold">
                Total Comments
              </h3>
              <p className="text-2xl font-bold">{totalComments}</p>
            </div>
            <HiAnnotation className="bg-[#fff5f5] dark:bg-[#27345D]  text-red-600 rounded-full text-5xl p-3" />
          </div>
          <div className="flex gap-1 text-sm">
            <span className="text-green-500 font-bold text-sm flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500 dark:text-gray-100 font-thin text-sm">
              Last month
            </div>
          </div>
        </div>
      </div>
      <div className="my-5">
        <div className="flex justify-between p-3 text-sm font-semibold">
          <h1 className="text-2xl">Recent Users</h1>
          <Button>
            <Link to={"/dashboard?tab=users"}>See all</Link>
          </Button>
        </div>
        <div>
          <div className="flex gap-4 items-center">
            {users &&
              users.map((user) => (
                <div key={user._id}>
                  <div className="border-[3px] border-[#01509A] dark:border-blue-600  rounded-full p-[2px]">
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-20 h-20 object-cover rounded-full"
                    />
                  </div>
                  <h3 className="text-center">{user.username}</h3>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent posts</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=posts"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((post) => (
                <Table.Body key={post._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={post.image}
                        alt="user"
                        className="w-14 h-10 rounded-md bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="w-96">{post.title}</Table.Cell>
                    <Table.Cell className="w-5">{post.category}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent comments</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </Button>
          </div>
          <Table hoverable className="">
            <Table.Head>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <Table.Body key={comment._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="w-96">
                      <p className="line-clamp-2">{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardComp;
