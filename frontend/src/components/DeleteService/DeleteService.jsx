import React, { useState } from "react";
import axios from "axios";
import Success from "../Succes/Sucess";

const DeleteService = () => {
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState({
    msg: "",
    statuscode: 0,
  });

  async function deleteData(event) {
    event.preventDefault();
    try {
      console.log(userName);
      const response = await axios.delete("http://localhost:5000/user/", {
        data: { user_name: userName },
      });
      if (response.status == 200) {
        setMessage({ msg: "Everything is successfully sent", statuscode: 200 });
      } else {
        setMessage({ msg: "There was a problem asociated.", statuscode: 404 });
      }
    } catch (err) {
      console.error("The following error occurred: ", err);
      setMessage({ msg: "There was a problem asociated.", statuscode: 404 });
    }
    handleShowToast();
  }

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Hide the toast after 3 seconds (adjust as needed)
  };

  const [showToast, setShowToast] = useState(false);
  return (
    <>
      <div className="relative">
        {showToast && <Success message={message} />}
      </div>
      <section class="text-gray-600 body-font">
        <div class="container px-5 py-24 mx-auto">
          <div class="flex flex-col text-center w-full mb-12">
            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-200">
              Delete the service
            </h1>
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
              In case you no longer want to get the updates on email or the
              console enter your username here:
            </p>
          </div>
          <div class="flex lg:w-2/3 w-full sm:flex-row flex-col mx-auto px-8 sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-end">
            <div class="relative flex-grow w-full">
              <label for="full-name" class="leading-7 text-sm text-gray-600">
                Username
              </label>
              <input
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                type="text"
                id="full-name"
                name="full-name"
                class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>

            <button
              class="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
              onClick={(e) => {
                deleteData(e);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </section>

      <section class="text-gray-600 body-font">
        <div class="container px-5 py-24 mx-auto">
          <div class="text-center mb-20">
            <h1 class="sm:text-3xl text-2xl font-medium title-font text-gray-100 mb-4">
              What it does?{" "}
            </h1>
            <p class="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-500s">
              When you enter the username your data is deleted and the backend
              service would no longer process your data to give you the
              notifications.
            </p>
            <div class="flex mt-6 justify-center">
              <div class="w-16 h-1 rounded-full bg-indigo-500 inline-flex"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DeleteService;
