import React from "react";
import { Link } from "react-router-dom";

const CallToAction = ({
  title,
  description,
  buttonText,
  buttonUrl,
  bgImageUrl,
}) => {
  return (
    <div
      className="p-6 h-60 flex items-center justify-around text-white text-center rounded-lg shadow-lg bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImageUrl})` }}
    >
      <div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{description}</p>
      </div>
      <div>
        <Link
          to={buttonUrl}
          className="inline-block bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default CallToAction;
