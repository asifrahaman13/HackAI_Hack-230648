import React from "react";

const Success = (props) => {


  // Function to show the toast
//   const handleShowToast = () => {
//     setShowToast(true);
//     setTimeout(() => {
//       setShowToast(false);
//     }, 3000); // Hide the toast after 3 seconds (adjust as needed)
//   };

//   handleShowToast()

  const { msg, statuscode } = props.message;
  console.log(props);
  console.log(statuscode);
  console.log(msg);

  return (
    <>
      {statuscode == 200 ? (
        <div className="fixed top-0 left-0 w-full bg-green-600 text-white text-center py-4 px-6 z-50 animate-toast-slide">
          {msg}
        </div>
      ) : (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-4 px-6 z-50 animate-toast-slide">
          {msg}
        </div>
      )}
    </>
  );
};

export default Success;