import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [ws, setWs] = useState(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
            console.log('WebSocket connection established');
            setWs(socket);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'status') {
                setStatus(data.message);
            }
        };

        socket.onclose = (event) => {
            console.log('WebSocket connection closed:', event.reason);
            setWs(null);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setWs(null);
        };

        return () => {
            socket.close();
        };
    }, []);

    const launchMediaPlayer = () => {
        if (ws) {
            ws.send(JSON.stringify({ type: 'launch' }));
        } else {
            console.error('WebSocket connection is not established');
        }
    };

    const handleCommand = (command) => {
        if (ws) {
            ws.send(JSON.stringify({ type: 'control', command }));
        } else {
            console.error('WebSocket connection is not established');
        }
    };

    return (
        <div className="App">
            <h1>Media Player Control</h1>
            <button onClick={launchMediaPlayer}>Launch Media Player</button>
            <button onClick={() => handleCommand('play')}>Play</button>
            <button onClick={() => handleCommand('pause')}>Pause</button>
            <button onClick={() => handleCommand('stop')}>Stop</button>
            <div>Status: {status}</div>
        </div>
    );
}

export default App;
