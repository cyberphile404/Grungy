import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/SearchPage.css';
import '../styles/FollowList.css';

function FollowingListPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchFollowing() {
      try {
        const res = await authAPI.getUserById(userId);
        setFollowing(res.data.following || []);
      } catch (err) {
        setError('Failed to load following');
      } finally {
        setLoading(false);
      }
    }
    fetchFollowing();
  }, [userId]);

  if (loading) return <div className="search-container"><div className="empty-state-glass"><h3>Loading following...</h3></div></div>;
  if (error) return <div className="search-container"><div className="empty-state-glass"><h3>{error}</h3></div></div>;

  return (
    <div className="search-container">
      <div className="search-content">
        <div className="search-form-container" style={{ paddingBottom: 0 }}>
          <h2>Following</h2>
        </div>
        <div className="search-results">
          {following.length === 0 ? (
            <div className="empty-state-glass">
              <h3>Not following anyone yet.</h3>
            </div>
          ) : (
            <div className="users-list">
              {following.map((user) => (
                <div key={user._id || user.id} className="user-card">
                  <div className="user-header">
                    <div className="user-avatar" style={{ overflow: 'hidden' }}>
                      {user.avatar && !user.avatar.includes('via.placeholder.com') ? (
                        <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        user.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="user-info">
                      <h3>{user.username}</h3>
                      {user.bio && <p className="user-bio">{user.bio}</p>}
                    </div>
                  </div>
                  
                  <div className="user-stats">
                    <div className="stat">
                      <span className="stat-number">{user.followers?.length || 0}</span>
                      <span className="stat-label">Followers</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{user.following?.length || 0}</span>
                      <span className="stat-label">Following</span>
                    </div>
                  </div>
                  
                  <button
                    className="view-profile-btn"
                    onClick={() => navigate(`/profile/${user._id || user.id}`)}
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FollowingListPage;
