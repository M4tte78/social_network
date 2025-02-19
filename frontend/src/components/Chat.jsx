import React from 'react';
import { useState, useEffect } from 'react';
import { sendMessage, getMessages } from '../services/api';

const Chat = ({ userId, receiverId }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            setMessages(await getMessages(userId, receiverId));
        };
        fetchMessages();
    }, []);

    const handleSend = async () => {
        await sendMessage(userId, receiverId, text);
        setMessages(await getMessages(userId, receiverId));
        setText('');
    };

    return (
        <div className="chat">
            {messages.map((m) => (
                <p key={m.id}>{m.content}</p>
            ))}
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message..." />
            <button onClick={handleSend}>Envoyer</button>
        </div>
    );
};

export default Chat;
