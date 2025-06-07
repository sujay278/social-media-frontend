import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import UserCard from './UserCard';
import './Search.css';

const Search = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const cached = sessionStorage.getItem('allUsers');
      if (cached) {
        setAllUsers(JSON.parse(cached));
        setHasFetched(true);
      } else {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8989/katta/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUsers(response.data);
        sessionStorage.setItem('allUsers', JSON.stringify(response.data));
        setHasFetched(true);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = () => {
    if (!hasFetched) {
      fetchUsers();
    }
  };

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearch = useMemo(() =>
    debounce((term) => {
      const lowerTerm = term.toLowerCase();
      const matches = allUsers.filter(
        user =>
          user.username.toLowerCase().includes(lowerTerm) ||
          user.name.toLowerCase().includes(lowerTerm)
      );
      setFilteredUsers(matches);
    }, 300), [allUsers]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers([]);
    } else {
      debouncedSearch(searchTerm);
    }
  }, [searchTerm, debouncedSearch]);

  const handleUserClick = (user) => {
    console.log('User clicked:', user);
  };

  return (
    <div className="page-content">
      <h2>Search Users</h2>
      <input
        type="text"
        placeholder="Search by username or name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={handleFocus}
        className="search-input"
      />
      {loading && <div className="loading">Loading users...</div>}
      {!searchTerm && !loading && (
        <p className="empty-state">Start typing to search users</p>
      )}
      {filteredUsers.length > 0 && (
        <div className="search-results">
          {filteredUsers.map(user => (
            <UserCard key={user.userId} user={user} onClick={handleUserClick} />
          ))}
        </div>
      )}
      {searchTerm && !loading && filteredUsers.length === 0 && (
        <p className="empty-state">No users found.</p>
      )}
    </div>
  );
};

export default Search;
