import React, { useState } from "react";
import { Input } from "./Input.jsx";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";


const CreateResumeform = () => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleCreateResume = async (e) => {
    e.preventDefault();
    // Perform validation
    if (!title) {
      setError("Title is required");
      return;
    }
    setError("");
    // Call API to create resume
    try {
      console.log("TOKEN:", localStorage.getItem("token"));
console.log("API PATH:", API_PATHS.RESUME.CREATE);


      const token = localStorage.getItem("token");

      const response = await axiosInstance.post(
        API_PATHS.RESUME.CREATE,
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?._id) {
        navigate(`/resume/${response.data._id}`);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Failed to create resume");
      } else {
        setError("Failed to create resume");
        console.error("Error creating resume:", error);
      }
    }
  };
  return (
    <div className=" w-full max-w-md p-8 bg-white rounded-2xl border border-gray-100 shadow-lg">
      <h3 className=" text-2xl font-bold text-gray-900 mb-2">
        Create New Resume
      </h3>
      <p className=" text-gray-600 mb-8">
        Give your resume A title to get started. you can customize everything
        later
      </p>

      <form onSubmit={handleCreateResume}>
        <Input
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          placeholder="Resume Title"
          type="text"
        />
        {error && <p className=" text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:bg-gradient-to-l"
        >
          Create Resume
        </button>
      </form>
    </div>
  );
};

export default CreateResumeform;
