import React, { useState, useEffect } from "react";
import Logout from "./components/authentication/registerForm";
import Login from "./components/authentication/loginForm";
import Home from "./components/Home/Home";
import ConfirmInvite from "./components/ConfirmInvite/ConfirmInvite";
import Assignment from "./components/Assignment/Assignment";
import Profile from "./components/Profile/Profile";
import GradesList from "./components/GradesList/GradesList";
import MemberList from "./components/MemberList/MemberList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClassDetail from "./components/ClassDetail/ClassDetail";
import { Header } from "./components";
import { useLocalContext } from "./context/context";
import cookie from "react-cookies";
import authApi from "./apis/auth.api";
import AuthMiddleware from "./middleware/auth.middleware";
import DetailClassGrade from "./components/ListAssignment/ListAssignment.js";
import Test from "./components/ListAssignment/text";
function App() {
  const { dataInfo, authLogin, setDataInfo, setAuthLogin } = useLocalContext();

  const [loadingAuth, setloadingAuth] = useState(true);

  // auto check access_token
  useEffect(()=>{
    async function fetchData () {
      let access_token = cookie.load("access_token");
      if (!!access_token) {
        try {
          setloadingAuth(true);
          let response = await authApi.authenticate();
  
          setDataInfo(response.data);
          setAuthLogin(true);
  
          // set access_token to cookie
          cookie.save("access_token", response.data?.access_token);
          cookie.save("user_data", response.data);
        } catch (err) {
          console.log(err);
          setAuthLogin(false);
        }
      }
      setloadingAuth(false);
  }
  fetchData()
  }, []);

  /* <Routes>
      <Route exact path='/' element={<DetailClassGrade />} />
    </Routes> */

  return (
    <>
      {!loadingAuth ? (
        <Router>
          <Header />
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Logout />} />
            <Route
              exact
              path="/"
              element={
                <AuthMiddleware>
                  <Home />
                </AuthMiddleware>
              }
            />
            <Route
              exact
              path="/profile"
              element={
                <AuthMiddleware>
                  <Profile />
                </AuthMiddleware>
              }
            />
            <Route
              exact
              path="/grade"
              element={
                <AuthMiddleware>
                  <GradesList />
                </AuthMiddleware>
              }
            />
            <Route
              path="/:classId"
              element={
                <AuthMiddleware>
                  <ClassDetail />
                </AuthMiddleware>
              }
            />
            <Route
              exact
              path="/:classId/memberlist"
              element={
                <AuthMiddleware>
                  <MemberList />
                </AuthMiddleware>
              }
            />
            <Route
              exact
              path="/confirm-invite/:id"
              element={
                <AuthMiddleware>
                  <ConfirmInvite />
                </AuthMiddleware>
              }
            />
            <Route
              exact
              path="/confirm-invite-by-code/:id"
              element={
                <AuthMiddleware>
                  <ConfirmInvite />
                </AuthMiddleware>
              }
            />
            <Route
              exact
              path="/:classId/assignment"
              element={
                <AuthMiddleware>
                  <Assignment />
                </AuthMiddleware>
              }
            />
            <Route
              exact
              path="/:classId/grades"
              element={
                <AuthMiddleware>
                  <DetailClassGrade />
                </AuthMiddleware>
              }
            />
            <Route
              exact
              path="/:classId/grades/test"
              element={
                <AuthMiddleware>
                  <Test/>
                </AuthMiddleware>
              }
            />
          </Routes>
        </Router>
      ) : (
        <h3>Loading....</h3>
      )}
    </>
  );
}

export default App;
