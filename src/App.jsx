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
    const socket = new WebSocket("ws://192.168.137.140:8887");

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
        {studentData.length === 0 ? (
          <h2>No students have scanned</h2>
        ) : (
          studentData.map((data, i) => {
            function byteArrayToBase64(byteArray) {
              const CHUNK_SIZE = 0x8000; // Maximum number of characters per chunk
              let binaryString = '';

              // Ensure byteArray is a Uint8Array
              const uint8Array = new Uint8Array(byteArray);

              for (let i = 0; i < uint8Array.length; i += CHUNK_SIZE) {
                const chunk = uint8Array.subarray(i, i + CHUNK_SIZE);
                binaryString += String.fromCharCode.apply(null, chunk);
              }
              return btoa(binaryString);
            }

            // Assuming data.user.ProfileImg.img is a Buffer object
            const bufferData = data.user.ProfileImg.img.data;

            // Convert the image byte array to a Base64 string
            const base64String = byteArrayToBase64(bufferData);

            // Create a data URL
            const dataUrl = `data:image/jpeg;base64,${base64String}`;

            return (
              <div key={i} className="card m-3">
                <div className="d-flex gap-1">
                  <div>
                    <img
                      src={dataUrl}
                      className="card-img-top m-2"
                      alt="Student"
                    />
                    <br />
                    <span
                      className="badge m-2"
                      style={{ backgroundColor: data.success ? 'green' : 'red' }}
                    >
                      {data.success ? 'Confirmed' : 'Denied'}
                    </span>
                  </div>
                  <div>
                    <div className="card-body">
                      <span className="text-center">
                        Status : (
                        {data.response
                          ? data.response.success
                            ? "Access Granted"
                            : "Access Denied"
                          : data.message}
                        )
                      </span>
                      <h6 className="card-title fw-bold">
                        Name: {data.user.name || "NA"}
                      </h6>
                      <p className="card-text">
                        PRN: {data.user.prn}
                        <br />
                        DOB: {data.user.DOB}
                        <br />
                        Contact: {data.user.phoneNumber}
                        <br />
                        Address: {data.user.address}
                        <br />
                        Time: {data.time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default App;
