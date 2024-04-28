import React, { useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        <div className="flex-1">
          <Link href="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Ashish
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            Dont let your passions stay silent. Join a thriving community of
            bloggers who inspire and empower each other.
          </p>
        </div>
        <div className="flex-1 mx-8">
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
            <Button gradientDuoTone={"purpleToPink"} type="submit">
              {loading ? (
                <>
                  <Spinner size={"sm"} />
                  <span className="">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="text-sm flex gap-2 mt-3">
            <span>Have an account</span>
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
