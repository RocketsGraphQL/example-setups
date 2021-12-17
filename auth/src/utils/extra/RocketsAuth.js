
import axios from "axios";
import Cookies from 'js-cookie';

axios.defaults.withCredentials = true;
export default class Auth {
    constructor(config) {
        const { baseURL } = config;
        this.baseURL = baseURL;
    }
    async login ({email, password}) {
        const login = await axios.post(this.baseURL+"/signin", {
            email: email,
            password: password,
        })
        const {ID, Token} = login.data;
        Cookies.set("jwt", Token, { expires: 7 });
        Cookies.set("user_id", ID, { expires: 7 });
        return true;
    }
    logout () {
        Cookies.remove("jwt");
    }
    async register ({email, password}) {
        const signup = await axios.post(this.baseURL+"/signup", {
            email: email,
            password: password,
        })
        const {ID, Token} = signup.data;
        Cookies.set("jwt", Token, { expires: 7 });
        Cookies.set("user_id", ID, { expires: 7 });
        return true;
    }
    getJWTToken () {
        return Cookies.get("jwt");
    }
    getUserId () {
        return Cookies.get("user_id");
    }
    isAuthenticated () {
        if (Cookies.get("jwt")) {
            return true;
        }
        return false;
    }
}