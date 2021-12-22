import React, { useState, useEffect } from "react";
import { useLocalContext } from "../../context/context";
import "./style.css";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import {
  Button,
  Box,
  FormControl,
  InputLabel,
  NativeSelect,
  Grid,
  TextField,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import classApi from "../../apis/class.api";
import Notification from "../Notifications/Notification";
import severity from "../Notifications/severity";
import { useParams } from "react-router";
import { Update } from "@material-ui/icons";
import { Divider } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const GridFixed = styled("div")({
  display: "grid",
  gridTemplateColumns: "1fr 3fr",
  width: "90%",
});

const useStyle = makeStyles((theme) => ({
  aside: {
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing(2),
  },
  asideElement: {
    marginBottom: theme.spacing(2),
  },
  main: {
    display: "flex",
    margin: theme.spacing(2),
  },
}));

export default function ClassDetail() {
  const navigate = useNavigate();
  const { classId } = useParams();
  const { dataInfo } = useLocalContext();
  const [emailInvite, setEmailInvite] = useState();
  const [role, setRole] = useState("member");
  const [showForm, setShowForm] = useState(false);
  const [Notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [classData, setClassData] = useState({});
  const [isTeacher, setIsTeacher] = useState(false);
  const style = useStyle();

  useEffect(async () => {
    try {
      const res = await classApi.getClassById({ id: classId });
      setClassData(res.data);

      for (let i = 0; i < res.data.ownerId.length; i++) {
        if (res.data.ownerId[i] == dataInfo.id) {
          setIsTeacher(true);
          break;
        }
      }
    } catch (e) {}
  }, []);

  const handleInvite = async () => {
    try {
      await classApi.inviteMember({
        email: emailInvite,
        classId: classData?.id,
        role: role,
      });
      setNotify({
        isOpen: true,
        message: "invite succeeded",
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

  let codeID =
    (process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PRODUCTION
      : process.env.REACT_APP_LOCAL) +
    "/confirm-invite-by-code/" +
    classData?.code;

  const handleCopyToClipboard = async () => {
    navigator.clipboard.writeText(codeID);

    setNotify({
      isOpen: true,
      message: "copied",
      type: severity.success,
    });
    setShowForm(false);
  };

  return (
    <Grid className="cover">
      <div className="list">
        <div className="wrapper">
          <div className="container">
            <div className="image" />
            <div className="content">
              <div className="title">
                <h1>{classData?.name}</h1>
                <p>{classData?.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GridFixed fix>
        <div className={style.aside}>
          {!isTeacher ? (
            <></>
          ) : (
            <Paper className={style.asideElement}>
              <Grid>
                <form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: '5%'
                  }}
                >
                  <div>
                  <Box>
                    <FormControl fullWidth>
                      <InputLabel
                        variant="standard"
                        htmlFor="uncontrolled-native"
                      >
                        Role
                      </InputLabel>
                      <NativeSelect
                        defaultValue={"member"}
                        onChange={(e) => {
                          setRole(e.target.value);
                        }}
                      >
                        <option value={"member"}>Student</option>
                        <option value={"owner"}>Teacher</option>
                      </NativeSelect>
                    </FormControl>
                  </Box>
                  <TextField
                    onChange={(e) => setEmailInvite(e.target.value)}
                    label="Email"
                    placeholder="Enter email"
                    fullWidth
                    required
                  />
                  </div>
                  <Button onClick={handleInvite} style={{marginTop: '2%', marginBottom: '2%'}} color='primary'>Invite</Button>
                </form>
                <Divider variant="middle" />
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "3%",
                    }}
                  >
                    <Item>
                      <h3>{classData?.code}</h3>
                    </Item>
                    <Button variant="outlined" onClick={handleCopyToClipboard}>
                      Copy Link
                    </Button>
                  </div>
                </div>
              </Grid>
            </Paper>
          )}

          <Paper className={style.asideElement}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginLeft: "5%",
                marginRight: "5%",
              }}
            >
              <Typography variant="h6">Point distribution</Typography>
              <Update
                onClick={() => {
                  navigate(`/${classId}/assignment`);
                }}
                style={{ cursor: "pointer" }}
              />
            </div>
            {!classData.assignments ? (
              <></>
            ) : (
              <div style={{ marginBottom: "3%" }}>
                {classData.assignments.map((item) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginLeft: "15%",
                        marginRight: "15%",
                      }}
                    >
                      <p>{item.name} :</p>
                      <p>{item.scoreRate}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </Paper>
        </div>
        <div className={style.main}>Something here</div>
      </GridFixed>
      <Notification Notify={Notify} setNotify={setNotify} />
    </Grid>
  );
}
