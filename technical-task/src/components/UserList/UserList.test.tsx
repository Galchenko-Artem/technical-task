import { render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import UserList from './UserList'

const mock = new MockAdapter(axios);

describe('UserList component', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('renders without errors', () => {
    render(<UserList />);
    expect(screen.getByTestId('user-list')).toBeInTheDocument();
  });

  it('fetches users and displays them', async () => {
    const users = [
      { id: 1, login: 'user1', avatar_url: 'avatar1.jpg', repos: 3 },
      { id: 2, login: 'user2', avatar_url: 'avatar2.jpg', repos: 5 },
    ];

    mock.onGet(/https:\/\/api\.github\.com\/search\/users/).reply(200, {
      total_count: 2,
      items: users,
    });

    render(<UserList />);
    await waitFor(() => {
      expect(screen.getAllByTestId('user-item')).toHaveLength(2);
    });
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
    expect(screen.getByText('репозиториев: 3')).toBeInTheDocument();
    expect(screen.getByText('репозиториев: 5')).toBeInTheDocument();
  });

  it('handles errors when fetching users', async () => {
    mock.onGet(/https:\/\/api\.github\.com\/search\/users/).reply(500);

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText('Error fetching users')).toBeInTheDocument();
    });
  });

});
