import React, { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [jsonResponse, setJsonResponse] = useState("");
  const [messageType, setMessageType] = useState("");

  const checkEmail = async () => {
    // Clear previous outputs and styles [cite: 8]
    setMessage("");
    setMessageType("");
    setJsonResponse("");

    if (!email) {
      // Handle empty email input [cite: 9]
      setMessage("Please enter an email address.");
      setMessageType("error");
      setJsonResponse(JSON.stringify({ error: "No email provided" }, null, 2)); // [cite: 10]
      return; // [cite: 11]
    }

    try {
      const response = await fetch("https://emailscript.pythonanywhere.com/check_disposable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json(); // [cite: 12]
      setJsonResponse(JSON.stringify(data, null, 2));

      // Display user-friendly message [cite: 13]
      if (response.ok) {
        if (data.disposable) {
          setMessage("The email is likely disposable.");
          setMessageType("error"); // [cite: 14]
        } else {
          setMessage("The email is not disposable.");
          setMessageType("success"); // [cite: 15]
        }
      } else {
        setMessage(data.error || "An error occurred while checking the email."); // [cite: 16]
        setMessageType("error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("Network error: Unable to reach the server."); // [cite: 17]
      setMessageType("error");
      setJsonResponse(
        JSON.stringify({ error: `Network error: ${error.message}` }, null, 2)
      ); // [cite: 18]
    }
  };

  return (
    <div className="container">
      <h1>Email Disposable Checker</h1>
      <input
        type="email"
        id="emailInput"
        placeholder="Enter email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button onClick={checkEmail}>Check Email</button>
      <div id="messageOutput" className={messageType}>
        {message}
      </div>
      <div id="jsonOutput">{jsonResponse}</div>
    </div>
  );
}

export default App;