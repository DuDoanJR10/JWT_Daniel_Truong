import { getAllUsers, deleteUser } from "../../redux/apiRequest";
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { useEffect } from "react";
import axios from "axios";
import "./home.css";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const message = useSelector(state => state.users?.message);
  const user = useSelector(state => state.auth.login?.currentUser);
  const userList = useSelector(state => state.users.users?.allUsers);
  let axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken = jwt_decode(user?.accessToken);
      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken();
        const refreshUser = {
          ...user,
          accessToken: data.accessToken
        }
        // Update info user
        dispatch(loginSuccess(refreshUser));
        config.headers['token'] = `Bearer ${refreshUser.accessToken}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const handleDelete = (id) => {
    deleteUser(user?.accessToken, dispatch, id, axiosJWT);
  }

  const refreshToken = async () => {
    try {
      const res = await axios.post('/v1/auth/refresh', {
        withCredentials: true, // Gắn cookies vào request
      })
      return res.data;
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (user?.accessToken) {
      getAllUsers(user?.accessToken, dispatch, axiosJWT)
    }
  }, [])

  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-role">
        {`Your role: ${user?.admin ? 'Admin' : 'User'}`}
      </div>
      <div className="home-userlist">
        {userList?.map((user, i) => {
          return (
            <div key={i} className="user-container">
              <div className="home-user">{user.username}</div>
              <div className="delete-user" onClick={() => handleDelete(user._id)}> Delete </div>
            </div>
          );
        })}
      </div>
      {message}
    </main>
  );
};

export default HomePage;
