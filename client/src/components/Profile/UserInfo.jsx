import React from 'react';
import { Link } from 'react-router-dom';

const UserInfo = ({ session }) => {
  const formatDate = (date) => {
    const newDate = new Date(date).toLocaleDateString('en-PH');
    const newTime = new Date(date).toLocaleTimeString('en-PH');

    return `${newDate} at ${newTime}`;
  };

  return (
    <div>
      <h3>User Info</h3>
      <p>Username: {session.getCurrentUser.username}</p>
      <p>Email: {session.getCurrentUser.email}</p>
      <p>Join Date: {formatDate(session.getCurrentUser.joinDate)}</p>
      <ul>
        <h3>{session.getCurrentUser.username}'s Favorites</h3>
        {session.getCurrentUser.favorites.map((favorite) => (
          <li key={favorite.id}>
            <Link to={`/recipes/${favorite.id}`}>
              <p>{favorite.name}</p>
            </Link>
          </li>
        ))}
        {!session.getCurrentUser.favorites.length && (
          <p>
            <strong>You have no favorites currently. Go add some!</strong>
          </p>
        )}
      </ul>
    </div>
  );
};

export default UserInfo;
