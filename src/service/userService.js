import axios from "axios";
import {USER_URL, USER_LIST_URL, USER_CREATE_URL, USER_REMOVE_URL, USER_EDIT_URL } from "./api";

class UserService {
    static getUsers() {
        return axios.get(USER_LIST_URL)
    }
    static createUsers(user) {
        return axios.post(USER_CREATE_URL, user)
    }
    static removeUser(userId){
        return axios.delete(`${USER_REMOVE_URL}/${userId}`)
    }
    static editUser(user){
        return axios.put(`${USER_EDIT_URL}`, user)
    }
    static getUser(userId){
        return axios.get(`${USER_URL}/${userId}`)
    }
}

export default UserService;