import axios from "axios";

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

export default refreshToken;
