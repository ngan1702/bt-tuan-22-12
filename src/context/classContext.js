import { createContext, useContext, useState } from "react";
import cookie from 'react-cookies';

const AddContext = createContext();

export function useLocalContext() {
  return useContext(AddContext);
}

export function ClassContextProvider({ children }) {
    const [classDetail, setClassDetail]=useState(cookie.load('class_data'));
    const [checkTeacher, setCheckTeacher]=useState(cookie.load('check_teacher'));

    const value = {
        classDetail, setClassDetail,
        checkTeacher, setCheckTeacher,
    }

    return (<AddContext.Provider value={value}>{children}</AddContext.Provider>)
}