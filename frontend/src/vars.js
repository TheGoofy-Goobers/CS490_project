import { v4 as uuidv4 } from 'uuid';

export const FLASK_URL = "http://localhost:5000";
export const SITE_URL = "http://localhost:3000";
export const setSessionLogin = (user_id) => {
    sessionStorage.setItem("isLoggedIn", "true")
    sessionStorage.setItem("user_id", user_id)
    const sessionToken = uuidv4();
    sessionStorage.setItem("sessionToken", sessionToken)

    setTimeout(() => {
        sessionStorage.clear();
        window.location.href = SITE_URL + "/login";
    }, 60 * 60 * 1000); // 60 minutes in milliseconds
}