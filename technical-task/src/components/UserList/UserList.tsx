import axios from 'axios'
import { debounce } from 'lodash'
import { FC, useCallback, useEffect, useState } from 'react'
import CurrentUser from '../CurrentUser/CurrentUser'
import cls from './UserList.module.css'
import { User } from './types'

interface IUserListProps {}

const UserList: FC<IUserListProps> = () => {
  const [name, setName] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchData();
  }, [name, page, perPage]);

  useEffect(() => {
    fetchReposData();
  }, [users, sortOrder]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await axios.get(
        `https://api.github.com/search/users?q=${name}&per_page=${perPage}&page=${page}`,
      );
      const { total_count, items } = data.data;
      setTotalCount(total_count);
      setUsers((prevUsers) => (page > 1 ? [...prevUsers, ...items] : items));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setIsLoading(false);
  };

  const fetchReposData = async () => {
    setIsLoading(true);
    try {
      const usersName = users.map((user) => axios.get(`https://api.github.com/users/${user.login}/repos`));
      const data = await Promise.all(usersName);
      const updatedUsers = data.map((response, index) => ({
        ...users[index],
        repos: response.data.length,
      }));

      const sorted = sortOrder === 'asc' ? [...updatedUsers].sort((a, b) => a.repos - b.repos) : [...updatedUsers].sort((a, b) => b.repos - a.repos);

      setSortedUsers(sorted);
    } catch (error) {
      console.error('Error fetching user repositories:', error);
    }
    setIsLoading(false);
  };

  const updateName = useCallback(
    debounce(async (str: string) => {
      setIsLoading(true);
      try {
        const data = await axios.get(
          `https://api.github.com/search/users?q=${str}&per_page=${perPage}&page=${page}`,
        );
        const { total_count, items } = data.data;
        setTotalCount(total_count);
        setUsers(items);
        if (page === 1) {
          setPage(1);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      setIsLoading(false);
    }, 500),
    [page, perPage],
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setName(value);
    updateName(value);
  };

  const handleClickNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handleSortChange = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const userListToDisplay = sortedUsers.length > 0 ? sortedUsers : users;

  return (
    <div>
      <input value={name} onChange={handleNameChange} placeholder="Введите имя" type="text" />
      <h4>Нашлось всего {totalCount} пользователей</h4>
      <div>
        <button onClick={handleSortChange}>
          Сортировка: {sortOrder === 'asc' ? 'возрастанию' : 'убыванию'}
        </button>
      </div>
      <div className={cls.Wrapper}>
        {userListToDisplay.map((user) => (
          <div key={user?.id}>{isLoading ? <div>Loading..</div> : <CurrentUser user={user} />}</div>
        ))}
      </div>
      <button onClick={handleClickNextPage}>Загрузить еще</button>
    </div>
  );
};

export default UserList;
