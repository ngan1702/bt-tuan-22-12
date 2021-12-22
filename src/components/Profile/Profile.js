import {
  Button,
  Container,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
  Box,
} from "@material-ui/core";
import React, { useState } from "react";
import authApi from "../../apis/auth.api";
import { useLocalContext } from "../../context/context";
import Notification from "../Notifications/Notification";
import severity from "../Notifications/severity";
import cookie from "react-cookies";

const useStyles = makeStyles((themes) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  root: {
    marginTop: themes.spacing(5),
    display: "flex",
    justifyContent: "center",
    width: "70%",
  },
  changePassword: {
    display: "flex",
    margin: themes.spacing(2),
    flexDirection: "column",
  },
  grid: {
    width: "300px",
    margin: themes.spacing(5),
  },
}));

const Profile = () => {
  const { dataInfo, setDataInfo } = useLocalContext();
  const { setClassId } = useLocalContext();
  setClassId("");
  const styles = useStyles();

  const [isChangeProfile, setIsChangeProfile] = useState(false);
  const [currentFullName, setFullName] = useState(dataInfo.fullname);
  const [currentEmail, setEmail] = useState(dataInfo.email);
  const [currentStudentID, setCurrentStudentID] = useState(dataInfo.studentId);

  /**
   * change password
   */
  const [currentPassword, setCurrentPassword] = useState("");
  const [changePassword, setChangePassword] = useState("");
  const [confirmChangePassword, setConfirmChangePassword] = useState("");

  const [Notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const updateProfile = async (e) => {
    try {
      e.preventDefault();
      await authApi.changeProfile({
        fullname: currentFullName,
        email: currentEmail,
      });
      setNotify({
        isOpen: true,
        message: "Change successed",
        type: severity.success,
      });
      const newData = await authApi.getInfo();
      setDataInfo(newData.data);
      setIsChangeProfile(false);
      cookie.save("user_data", newData.data);
    } catch (err) {}
  };

  const setStudentId = async (e) => {
    try {
        e.preventDefault();
        await authApi.updateStudentId({
          studentId: currentStudentID
        });
        setNotify({
          isOpen: true,
          message: "Change successed",
          type: severity.success,
        });
        const newData = await authApi.getInfo();
        setDataInfo(newData.data);
        setIsChangeProfile(false);
        cookie.save("user_data", newData.data);
      } catch (err) {}
  }

  const updatePassword = async (e) => {
    try {
      e.preventDefault();

      const data = await authApi.changePassword({
        curPass: currentPassword,
        changePass: changePassword,
        confirmPass: confirmChangePassword,
      });
      
      setNotify({
        isOpen: true,
        message: "Change successed",
        type: severity.success,
      });
    } catch (err) {
      if (Object.keys(err).length > 0) {
        setNotify({
          isOpen: true,
          message: err?.message,
          type: severity.error,
        });
      } else {
        // An error has occurred
        alert("An error has occurred");
      }
    }
  };

  return (
    <div>
      {/* <Drawer /> */}
      <Container>
        <Box className={styles.container}>
          <Paper className={styles.root}>
            <Grid className={styles.grid}>
              <Grid>
                <Typography>Thông tin cá nhân</Typography>
              </Grid>
              {dataInfo.studentId ? (
                <Grid>
                  <Typography>Student ID</Typography>
                  <Typography>{currentStudentID}</Typography>
                </Grid>
              ) : (
                <Grid>
                    <form onSubmit={setStudentId}>
                    <Typography>Student ID</Typography>
                    <TextField
                      fullWidth
                      value={currentStudentID}
                      onChange={(e) => {
                        setCurrentStudentID(e.target.value);
                      }}
                    />
                    <Button type="submit"> update </Button>
                    </form>
                </Grid>
              )}
              {isChangeProfile == false ? (
                <Grid>
                  <Typography>FullName</Typography>
                  <Typography>{currentFullName}</Typography>
                  <Typography>Email</Typography>
                  <Typography>{currentEmail}</Typography>
                  <Typography>User Name</Typography>
                  <Typography>{dataInfo.username}</Typography>
                  <Button onClick={() => setIsChangeProfile(true)}>
                    Change
                  </Button>
                </Grid>
              ) : (
                <form onSubmit={updateProfile}>
                  <Grid>
                    <Typography>FullName</Typography>
                    <TextField
                      fullWidth
                      value={currentFullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                      }}
                    />

                    <Typography>Email</Typography>
                    <TextField
                      fullWidth
                      value={currentEmail}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />

                    <Typography>User Name</Typography>
                    <Typography>{dataInfo.username}</Typography>
                    <Button type="submit">Update</Button>
                  </Grid>
                </form>
              )}
            </Grid>
          </Paper>
          <Paper className={styles.root}>
            <Grid className={styles.grid}>
              <form className={styles.changePassword} onSubmit={updatePassword}>
                <Typography>Change password</Typography>
                <TextField
                  fullWidth
                  label="Current Password"
                  placeholder="Enter curent password"
                  type="password"
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                  }}
                />
                <TextField
                  fullWidth
                  label="New Password"
                  placeholder="Enter new password"
                  type="password"
                  onChange={(e) => {
                    setChangePassword(e.target.value);
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  placeholder="Re-enter new password"
                  type="password"
                  onChange={(e) => {
                    setConfirmChangePassword(e.target.value);
                  }}
                />
                <Button type="submit">Change Password</Button>
              </form>
            </Grid>
          </Paper>
        </Box>
      </Container>
      <Notification Notify={Notify} setNotify={setNotify} />
    </div>
  );
};

export default Profile;
