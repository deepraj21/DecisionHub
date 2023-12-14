import { useState } from 'react'
import styles from './styles.module.css'
import databaseLogo from './assets/database-storage.png'

import './App.css'

function App() {
// use state to track the query descriptor
const [userPrompt, setUserPrompt] = useState("");
const [sqlQuery, setSqlQuery] = useState("");
const [copySuccess, setCopySuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("form submitted: ", userPrompt);
    const query = await generateQuery();
    setSqlQuery(query);
    setCopySuccess(false);
    console.log("query: ", query);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlQuery);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  // const generateQuery = async () => {
  //   const response = await fetch("http://localhost:3005/generate", {
  //     method: "POST",
  //     headers: {
  //       contentType: "application/json"
  //     },
  //     // converting query Javascript object to a JSON object
  //     body: JSON.stringify({ queryDescription: queryDescription }),
  //   });
  //   const data = await response.json();
  //   return data;
  // };
  const generateQuery = async () => {
    try {
      const response = await fetch("http://localhost:5003/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ queryDescription: userPrompt }),
      });
  
      if (!response.ok) {
        console.error("Error in API response:", response.status, response.statusText);
        return "Error in API response";
      }
  
      const data = await response.json();
  
      if (!data || !data.response) {
        console.error("Invalid data format:", data);
        return "Invalid data format";
      }
  
      // Assuming response is the correct property name
      return data.response.trim();
    } catch (error) {
      console.error("Error in fetch:", error);
      return "Error in fetch";
    }
  };
  

  return (
    <main className={styles.main} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1613946709284-0aa74f040a12?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
          <img src={databaseLogo} 
          alt="Database Logo" 
          className={styles.icon}
          style={{ width: '100px', height: '100px' }} 
          />
          <h1 style={{color: 'white'}}>Decision Hub</h1>
          <form onSubmit={onSubmit}>
            <input 
              type="text"
              name="query-descriptor"
              placeholder="Describe your query"
              onChange={(e) => setUserPrompt(e.target.value)}
              />
              <input type="submit" value="Generate Query" />
          </form>
          {sqlQuery && (
        <>
          <pre>{sqlQuery}</pre>
          <button onClick={copyToClipboard}>Copy</button>
          {copySuccess && <div className={styles.copySuccess}>Copied!</div>}
        </>
      )}
    </main>

  )
}

export default App
