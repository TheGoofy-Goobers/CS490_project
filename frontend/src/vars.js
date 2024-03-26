import { v4 as uuidv4 } from 'uuid';

export const FLASK_URL = "http://localhost:5000";
export const SITE_URL = "http://localhost:3000";

// export const setSessionLogin = (user_id, username) => {
//     sessionStorage.setItem("isLoggedIn", "true")
//     sessionStorage.setItem("user_id", user_id)
//     const sessionToken = uuidv4();
//     sessionStorage.setItem("sessionToken", sessionToken)
//     setTimeout(() => {
//         sessionStorage.clear();
//         window.location.href = SITE_URL + "/login";
//     }, 60 * 60 * 1000); // 60 minutes in milliseconds
// }

export const setLocal = (user_id, username, loginTime, rememberMe) => {
    localStorage.setItem("lastLogIn", loginTime)
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("user_id", user_id)
    // const sessionToken = uuidv4();
    // localStorage.setItem("sessionToken", sessionToken)
    localStorage.setItem("username", username)
    localStorage.setItem("rememberMe", rememberMe)
}

export const isExpired = () => {
    const expires = 60 * 60 * 24; //in seconds
    const lastLogIn = parseInt(localStorage.getItem("lastLogIn"), 10);
    const currentTime = Math.floor(Date.now() / 1000)
    const elapsedTime = currentTime - lastLogIn;

    
    console.log(`current time: ${currentTime}`)
    console.log(`lastLogin: ${lastLogIn}`)
    console.log(`elapsed time: ${elapsedTime}`)

    if (elapsedTime > expires){
        localStorage.clear();
        window.location.href = SITE_URL + "/login";
    }
}