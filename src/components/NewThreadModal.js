import React, { useState } from 'react';
import './NewThreadModal.css';

function NewThreadModal({ isOpen, onClose, onPost }) {
    const [topic, setTopic] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (topic.trim() && title.trim() && message.trim()) {
            onPost({ topic, title, content: message });
            setTopic('');
            setTitle('');
            setMessage('');
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>Start a discussion</h2>

                <label>What topic does this discussion belong to?</label>
                <input
                    type="text"
                    placeholder="e.g. Mental Health, Nutrition"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                />

                <label>What is the title of this discussion?</label>
                <input
                    type="text"
                    placeholder="Give your post a title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label>Add your message</label>
                <textarea
                    placeholder="Write your full question or message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>

                <button className="post-btn" onClick={handleSubmit}>Post Discussion</button>
            </div>
        </div>
    );
}

export default NewThreadModal;
