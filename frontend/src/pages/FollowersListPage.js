import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/SearchPage.css';
import '../styles/FollowList.css';

function FollowersListPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchFollowers() {
      try {
        const res = await authAPI.getUserById(userId);
        setFollowers(res.data.followers || []);
      } catch (err) {
        setError('Failed to load followers');
      } finally {
        setLoading(false);
      }
    }
    fetchFollowers();
  }, [userId]);

  if (loading) return <div className="search-container"><div className="empty-state-glass"><h3>Loading followers...</h3></div></div>;
  if (error) return <div className="search-container"><div className="empty-state-glass"><h3>{error}</h3></div></div>;

  return (
    <div className="search-container">
      <div className="search-content">
        <div className="search-form-container" style={{ paddingBottom: 0 }}>
          <h2>Followers</h2>
        </div>
        <div className="search-results">
          {followers.length === 0 ? (
            <div className="empty-state-glass">
              <h3>No followers yet.</h3>
            </div>
          ) : (
            <div className="users-list">
              {followers.map((follower) => (
                <div key={follower._id || follower.id} className="user-card">
                  <div className="user-header">
                    <div className="user-avatar" style={{ overflow: 'hidden' }}>
                      {follower.avatar && !follower.avatar.includes('via.placeholder.com') ? (
                        <img src={follower.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        follower.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="user-info">
                      <h3>{follower.username}</h3>
                      {follower.bio && <p className="user-bio">{follower.bio}</p>}
                    </div>
                  </div>
                  
                  <div className="user-stats">
                    <div className="stat">
                      <span className="stat-number">{follower.followers?.length || 0}</span>
                      <span className="stat-label">Followers</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{follower.following?.length || 0}</span>
                      <span className="stat-label">Following</span>
                    </div>
                  </div>
                  
                  <button
                    className="view-profile-btn"
                    onClick={() => navigate(`/profile/${follower._id || follower.id}`)}
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

export default FollowersListPage;
