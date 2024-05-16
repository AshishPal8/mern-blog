import { useState } from "react";
import { Spinner, Button, Alert, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formData, setFromData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFromData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("All fields are required");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(formData),
      });

      const data = res.json();

      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      if (res.ok) {
        navigate("/sign-in");
      }
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-[#F4F7FE] dark:bg-[#1E2142]">
      <div className="flex p-10 max-w-md bg-white dark:bg-[#121430] mx-auto flex-col  md:items-center rounded-xl shadow-lg">
        <div className="mb-5 w-full">
          <h1 className="text-[#004C99] text-center font-bold text-3xl">
            Ashish Blog
          </h1>

          <h2 className="text-start font-semibold text-2xl mt-5">
            Start Your Adventure Here!🚀
          </h2>
          <p className="text-gray-500">
            Join for adventures, stories, and more!
          </p>
        </div>
        <div className="w-full">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Username" />
              <TextInput
                type="text"
                placeholder="Enter Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="Enter Email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="Enter Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button className="bg-[#004C99] hover:bg-[#4f5faa] " type="submit">
              {loading ? (
                <>
                  <Spinner size={"sm"} />
                  <span className="">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex items-center justify-center gap-2 text-[1rem] font-normal text-gray-500 mt-3">
            <span>Already have an account?</span>
            <Link to={"/sign-in"} className="text-blue-600">
              Signin
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="Failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
