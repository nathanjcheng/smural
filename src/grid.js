import React from 'react';

const Grid = ({ artists }) => {
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
        {artists.map((artist) => (
          <div key={artist.id} style={gridItemStyle}>
            {artist.images.length ? (
              <div>
                <img width={"100%"} src={artist.images[0].url} alt={artist.name} />
                {artist.name}
              </div>
            ) : (
              <div>No Image</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grid;
