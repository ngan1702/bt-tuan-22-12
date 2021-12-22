import { AppBar, Toolbar, Typography, Avatar, Menu, MenuItem, Divider, ListItemIcon, IconButton, Tabs, Box, Link, Tab, Button } from "@material-ui/core";
import { Add, Apps, Logout } from "@mui/icons-material";
import React, { useState } from "react";
import { CreateClass } from "..";
import { useLocalContext } from "../../context/context";
import { useStyles } from "./style";
import { Link as LinkDom } from 'react-router-dom';
import authApi from "../../apis/auth.api";
import cookie from 'react-cookies';
import { useNavigate } from "react-router-dom";

const Header = ({ children }) => {
  const classes = useStyles();
  const navigate = useNavigate()

  //Add and join dialog
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  //Profile dialog
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const handleClickProfile = (event) => setAnchorElProfile(event.currentTarget);
  const handleCloseProfile = () => setAnchorElProfile(null);

  const {
    dataInfo,
    setCreateClassDialog,
    setJoinClassDialog,
    setDataInfo,
    classId,
    setClassId,
    isTeacher,
  } = useLocalContext();

  const handleCreate = () => {
    handleClose();
    setCreateClassDialog(true);
  };

  const handleJoin = () => {
    handleClose();
    setJoinClassDialog(true);
  };

  //Nav tabs
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChangePage = (event, newValue) => {
    setSelectedTab(newValue);
  };

  //Log out
  const logout = async () => {
    try {
      await authApi.logout();
      cookie.remove('user_data');
      cookie.remove('access_token');
      setDataInfo({});
      setClassId('')
      navigate("/login")
      //console.log(cookie.load('access_token'));

    }
    catch (err) {
      console.log("ERROR login, err: ", err)

      if (Object.keys(err).length > 0) {
        alert(err?.message)
      }
      else {
        // An error has occurred
        alert('An error has occurred')
      }
    }
  }
  return (
    <div className={classes.root}>

      <AppBar className={classes.appBar} position="static">
        <Toolbar className={classes.toolbar}>
          <div className={classes.headerWrapper} >
            {children}
            <Link underline="none" to='/' component={LinkDom}>
              <Typography variant="h6" className={classes.title}>
                Classroom
              </Typography>
            </Link>
          </div>
          {

            !classId ?
              <></> :
              <div >
                <Box sx={{ width: '100%' }}>
                  <Tabs value={selectedTab} onChange={handleChangePage} aria-label="nav tabs example">
                    <Tab label="Class" to={`${classId}`} component={LinkDom} />
                    <Tab label="Member" to={`/${classId}/memberlist`} component={LinkDom} />
                    <Tab label="Grades" to={`/${classId}/grades`} component={LinkDom} />
                  </Tabs>

                </Box>
              </div>
          }
          {
            dataInfo?.access_token == undefined ?
              <></> :
              <div className={classes.header__wrapper__right}>
                <Add onClick={handleClick} className={classes.icon} />
                <Apps className={classes.icon} />
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleCreate}>Create Class</MenuItem>
                </Menu>
                <div>
                  <IconButton onClick={handleClickProfile}>
                    <Avatar />
                  </IconButton>
                  <Menu
                    anchorEl={anchorElProfile}
                    open={Boolean(anchorElProfile)}
                    onClose={handleCloseProfile}
                    onClick={handleCloseProfile}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}

                  >
                    <MenuItem component={LinkDom} to='profile'>
                      <Avatar /> Profile
                    </MenuItem>
                    <MenuItem component={LinkDom} to='grade'>
                      <Avatar /> Grades
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={logout}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              </div>
          }
        </Toolbar>
      </AppBar>
      <CreateClass />
      {/* {selectedTab === 0 && <Home />}
      {selectedTab === 1 && <MemberList />} */}
    </div>
  );
};

export default Header;