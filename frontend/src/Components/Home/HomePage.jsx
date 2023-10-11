import "./home.css";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import createAxios from "../../utils/createAxios";
import { loginSuccess } from "../../redux/authSlice";
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, deleteUser } from "../../redux/apiRequest";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const message = useSelector(state => state.users?.message);
  const user = useSelector(state => state.auth.login?.currentUser);
  const userList = useSelector(state => state.users.users?.allUsers);
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const handleDelete = (id) => {
    deleteUser(user?.accessToken, dispatch, id, axiosJWT);
  }

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (user?.accessToken) {
      getAllUsers(user?.accessToken, dispatch, axiosJWT);
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
