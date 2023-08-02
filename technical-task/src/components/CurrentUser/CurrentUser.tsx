import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from '../UserList/types'
import cls from './CurrentUser.module.css'

interface IProps {
  user: User;
}

const CurrentUser: FC<IProps> = ({ user }) => {
  const navigate = useNavigate();
  const handleChange = (user: User) => {
    navigate(`/users/${user.id}`, {
      state: {
        user,
      },
    });
  };

  return (
    <>
      <div onClick={() => handleChange(user)}>
        <img width={150} src={user?.avatar_url} alt="User Avatar" />
        <div className={cls.user}>{user?.login}</div>
        <div>репозиториев: {user.repos}</div>
      </div>
    </>
  );
};

export default CurrentUser;

