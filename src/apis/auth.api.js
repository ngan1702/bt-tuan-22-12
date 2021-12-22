import {AxiosBasic} from "../services/api";
import urls from './urls'

const login = async ({username, password}) => {
    return AxiosBasic({
        url: urls.login,
        method: 'POST',
        data:{
            username,
            password,
        }
    })
}

const register = async ({username, password, fullname, email}) => {
    return AxiosBasic({
        url: urls.register,
        method: 'POST',
        data:{
            username,
            password,
            fullname,
            email
        }
    })
}

const logout = async () => {
    return AxiosBasic({
        url: urls.logout,
        method: 'GET'
    })
}

const getInfo = async () => {
    return AxiosBasic({
        url: urls.info,
        method: 'GET'
    })
}

const getMyGrade = async () => {
    return AxiosBasic({
        url: urls.getMyGrade,
        method: 'GET'
    })
}

const authenticate = ()=>{
    return AxiosBasic({
        url: urls.authenticate,
        method: 'GET'
    })
}

const googleLogin = async ({fullname, email, access_token}) => {
    return AxiosBasic ({
        url: urls.googleLogin,
        method: 'POST',
        data:{
            fullname,
            email,
            access_token
        }
    })
}

const changePassword = async ({curPass, changePass, confirmPass}) => {
    return AxiosBasic({
        url: urls.changePassword,
        method: "POST",
        data:{
            currentPassword: curPass,
            changePassword: changePass,
            confirmPassword: confirmPass
        }
    })
}

const changeProfile = async ({fullname, email}) => {
    return AxiosBasic({
        url: urls.changeProfile,
        method: "POST",
        data:{
            fullname,
            email,
        }
    })
}

const updateStudentId = async ({studentId}) => {
    console.log('ult',studentId);
    return AxiosBasic({
        url: urls.updateStudentId,
        method: "POST",
        data:{
            studentId,
        }
    })
}

const authApi = {
    login,
    googleLogin,
    register,
    logout,
    getInfo,
    getMyGrade,
    changeProfile,
    changePassword,
    authenticate,
    updateStudentId,
}

export default authApi