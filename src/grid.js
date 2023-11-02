import React from 'react';

const Grid = () => {
    const gridContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
    };

    const gridItemStyle = {
        border: '2px solid #1DB954', // Spotify green color
        borderRadius: '10px', // Rounded corners
        padding: '10px', // Add padding for content inside the boxes
    };

    return (
        <div>
            <p style={{ fontSize: 12 }}>Grid with Dynamic Data</p>
            <div style={gridContainerStyle}>
                <div style={gridItemStyle}>Example</div>
                <div style={gridItemStyle}>Example</div>
                <div style={gridItemStyle}>Example</div>
                <div style={gridItemStyle}>Example</div>
                <div style={gridItemStyle}>Example</div>
                <div style={gridItemStyle}>Example</div>
                <div style={gridItemStyle}>Example</div>
                <div style={gridItemStyle}>Example</div>
                <div style={gridItemStyle}>Example</div>
                <div style={gridItemStyle}>Example</div>
                <div style={gridItemStyle}>Example</div>
                <div style={gridItemStyle}>Example</div>
                <div style={gridItemStyle}>Example</div>
                <div style={gridItemStyle}>Example</div>
                <div style={gridItemStyle}>Example</div>
                <div style={gridItemStyle}>Example</div>
            </div>
        </div>
    );
};

export default Grid;
