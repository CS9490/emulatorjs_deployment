import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; // Flask url

const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.access_token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    }
    return response.data;
};

const register = async (firstName, lastName, email, password) => {
    const response = await axios.post(`${API_URL}/register`, {
        first_name: firstName,  
        last_name: lastName,
        email: email,
        password: password
    });
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
};

const getCurrentToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.access_token;
  };

export default {
    login,
    register,
    logout,
    getCurrentToken,
};
