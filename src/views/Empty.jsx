import React from 'react';

const Empty = () => {
    return (
        <div className="empty-state">
            <img src="placeholder-image.png" alt="No notes" />
            <p>No notes found.</p>
            <button>Add Note</button>
        </div>
    );
};

export default Empty;