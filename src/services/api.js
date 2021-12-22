import axios from 'axios';
import cookie from 'react-cookies';

const ErrorResponse = (e) => {
    try {
        console.log("----------------------------------------------")
        console.log("Status: ", e.response?.status);
        console.log("Data: ", e.response?.data)
        console.log("----------------------------------------------")
        
        return { ...e.response?.data}
    }
    catch (err) {
        console.log("ERROR ErrorResponse")
        console.log("err: ", err)
        return err
    }
}

export const AxiosBasic = async ({ url, method, headers = {}, data = {} }) => {
    return new Promise(async (resolve, reject) => {
        await axios({
            url: (process.env.NODE_ENV === "production" ? process.env.REACT_APP_API_PRO : process.env.REACT_APP_API_DEV) + url,
            method,
            headers: {
                Authorization: `Bearer ${cookie.load('access_token')}`,
                ...headers
            },
            data
        }).then(({ data }) => {
            resolve({ ...data })
        }).catch(err=> reject(ErrorResponse(err)))
    })
}

export const AxiosDownload = async ({ url, method, headers = {}, responseType }) => {
    const res = await axios({
        url: (process.env.NODE_ENV === "production" ? process.env.REACT_APP_API_PRO : process.env.REACT_APP_API_DEV) + url,
        method,
        headers: {
            Authorization: `Bearer ${cookie.load('access_token')}`,
            ...headers
        },
        responseType: responseType
    });
    return res;

}