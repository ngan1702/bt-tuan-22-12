import { createContext, useContext, useState } from "react";
import cookie from 'react-cookies';

const AddContext = createContext();

export function useLocalContext() {
  return useContext(AddContext);
}

export function ContextProvider({ children }) {
  const [createClassDialog, setCreateClassDialog] = useState(false);
  const [joinClassDialog, setJoinClassDialog] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [check, setChecked] = useState(false);
  const [dataInfo, setDataInfo] = useState(cookie.load('user_data'));
  const [dataGrade, setDataGrade] = useState([]);
  const [authLogin, setAuthLogin] = useState(false)
  
  const [classId, setClassId]=useState('');

  const value = {
    createClassDialog, setCreateClassDialog,
    joinClassDialog, setJoinClassDialog,
    showForm, setShowForm,
    check, setChecked,
    dataInfo, setDataInfo,
    dataGrade, setDataGrade,
    authLogin, setAuthLogin,
    classId, setClassId,
  };
  return <AddContext.Provider value={value}>{children}</AddContext.Provider>;
}

