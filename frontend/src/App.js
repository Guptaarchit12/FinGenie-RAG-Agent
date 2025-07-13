import React, { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const payload = { question: query };
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResponse(data.response);
      setHistory([{ question: query, answer: data.response }, ...history]);
    } catch (err) {
      setResponse('⚠️ Could not connect to backend.');
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setResponse(null);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const themeStyles = {
    background: darkMode ? '#111827' : 'linear-gradient(to right, #f7f8fa, #eef1f6)',
    color: darkMode ? '#f3f4f6' : '#1f2937',
    transition: 'all 0.3s ease-in-out',
  };

  return (
    <div style={{ ...styles.container, ...themeStyles }}>
      <div style={styles.topBar}>
        <div style={styles.spacer}></div>

        <h1 style={{ ...styles.heading, color: themeStyles.color }}>
          💰 FinGenie RAG Agent
        </h1>

        <div style={styles.toggleContainer}>
          <button onClick={toggleDarkMode} style={styles.toggleButton}>
            {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
          {history.length > 0 && (
            <button onClick={clearHistory} style={{ ...styles.toggleButton, backgroundColor: '#ef4444' }}>
              🗑️ Clear Chats
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Ask anything about finance..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          {isLoading ? 'Generating...' : 'Ask'}
        </button>
      </form>

      {response && (
        <div style={{ ...styles.responseCard, backgroundColor: darkMode ? '#1f2937' : '#ffffff', color: themeStyles.color }}>
          <h3>🔍 Answer:</h3>
          <p>{response}</p>
        </div>
      )}

      {history.length > 0 && (
        <div style={styles.historySection}>
          <h3 style={{ color: themeStyles.color }}>📜 Previous Interactions</h3>
          <ul style={styles.historyList}>
            {history.map((item, idx) => (
              <li key={idx} style={{ ...styles.historyItem, backgroundColor: darkMode ? '#374151' : '#f9fafb', color: themeStyles.color }}>
                <strong>Q:</strong> {item.question} <br />
                <strong>A:</strong> {item.answer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Segoe UI, sans-serif',
    minHeight: '100vh',
    padding: '40px 20px',
    textAlign: 'center',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  spacer: {
    width: '100px',
  },
  heading: {
    fontSize: '2.5rem',
    margin: 0,
    flex: 1,
    textAlign: 'center',
  },
  toggleContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'flex-end',
  },
  toggleButton: {
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '8px 16px',
    fontSize: '0.9rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.3s ease-in-out',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '30px',
  },
  input: {
    width: '90%',
    maxWidth: '500px',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    backgroundColor: '#10b981',
    color: '#fff',
    padding: '10px 20px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.3s ease-in-out',
  },
  responseCard: {
    maxWidth: '700px',
    margin: '20px auto',
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  historySection: {
    marginTop: '40px',
    textAlign: 'left',
    paddingLeft: '10%',
    paddingRight: '10%',
  },
  historyList: {
    listStyle: 'none',
    padding: 0,
  },
  historyItem: {
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
};

export default App;
