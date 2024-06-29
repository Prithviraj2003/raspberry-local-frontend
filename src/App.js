import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [studentData, setStudentData] = useState([]);
  console.log("student", studentData);
  const pushData = (data) => {
    console.log("data", data);
    setStudentData((prev) => [data, ...prev]);
  };

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8887");

    socket.onopen = () => {
      console.log("WebSocket connection established.");
      // Perform any necessary actions after the connection is established
    };

    socket.onmessage = (event) => {
      console.log("Received message:", JSON.parse(event.data));
      pushData(JSON.parse(event.data));
      // Handle incoming messages from the WebSocket server
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
      // Perform any necessary actions when the connection is closed
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <nav
        className="navbar bg-dark border-bottom border-body"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Gate Management System</span>
        </div>
      </nav>
      <div className="w-100 text-center mt-5">
        <span className="h1">Student Data</span>
      </div>
      <div
        className="d-flex justify-content-center mt-5 mx-auto flex-wrap"
        style={{ width: "80%" }}
      >
        {studentData.map((data, i) => {
          function byteArrayToBase64(byteArray) {
            const binaryString = String.fromCharCode(
              ...new Uint8Array(byteArray)
            );
            return btoa(binaryString);
          }

          // Convert the image byte array to a Base64 string
          const base64String = byteArrayToBase64(data.user.ProfileImg.img.data);

          // Create a data URL
          const dataUrl = `data:image/jpeg;base64,${base64String}`;

          return (
            <div key={i}>
              <div className="card m-4">
                <h3
                  className="text-center"
                  style={{ borderBottom: ".5px solid grey" }}
                >
                  {" "}
                  (
                  {data.response
                    ? data.response.success
                      ? "Access Granted"
                      : "Access Denied"
                    : data.message}
                  )
                </h3>
                <img
                  src={dataUrl}
                  className="card-img-top"
                  alt="..."
                  style={{ width: "300px", height: "300px" }}
                />
                <div
                  className="card-body"
                  style={{
                    backgroundColor: `${
                      data.response?.success ? "#5be10f" : "#fe4f4f"
                    }`,
                  }}
                >
                  <h5
                    className="card-title
                "
                  >
                    Name : {data.user.name}
                  </h5>

                  <p className="card-text">
                    PRN : {data.user.prn}
                    <br />
                    DOB : {data.user.DOB}
                    <br />
                    Phone Number : {data.user.phoneNumber}
                    <br />
                    Address : {data.user.address}
                    <br />
                    Time : {data.time}
                  </p>
                </div>
              </div>
              {/* <div>{student.name}</div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
