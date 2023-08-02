import { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainPage from './pages/MainPage/MainPage'
import UserPage from './pages/UserPage/UserPage'

const App: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />}></Route>
      <Route path="/users/:id" element={<UserPage />}></Route>
    </Routes>
  );
};

export default App;