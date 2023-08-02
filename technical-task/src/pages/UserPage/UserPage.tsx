import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { User } from '../../components/UserList/types'

const UserPage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user }: { user: User } = location.state;
  const [countFollowers, setCountFollowers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(`https://api.github.com/users/${user.login}/followers`);
        setCountFollowers(data.data.length);
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
      setIsLoading(false); 
    };
    fetchData();
  }, [user.login]);

  const handleClickBack = () => {
    navigate('/');
  };

  return (
    <div>
      <button onClick={handleClickBack}>Назад</button>
      <h2>Это профиль {user.login}</h2>
      <img src={user.avatar_url} alt="photo" />
      {isLoading ? (
        <div>Loading...</div> 
      ) : (
        <div>Подписчиков {countFollowers}</div>
      )}
    </div>
  );
};

export default UserPage;
