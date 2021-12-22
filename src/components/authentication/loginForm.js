import React, { useState , useEffect} from 'react'
import { Grid, Paper, Avatar, TextField, Button, Typography, Link, Divider, makeStyles } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import authApi from '../../apis/auth.api';
import cookie from 'react-cookies';
import { GoogleLogin } from 'react-google-login';
import { useLocalContext } from '../../context/context';
import {useNavigate} from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    divider: {
        background: theme.palette.divider,
        marginTop: '10px',
        backgroundColor: 'black'
    }
}))

const Login = () => {

    const navigate = useNavigate()

    const paperStyle = { padding: 20, height: '70vh', width: 280, margin: "20px auto" }
    const avatarStyle = { backgroundColor: '#1bbd7e' }
    const btnstyle = { margin: '8px 0' }
    const classes = useStyles();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [check, setChecked] = useState(false);
    const {setDataInfo, setAuthLogin} = useLocalContext();
    const {setClassId} = useLocalContext();
    setClassId('');

    const login = async e => {
        try {
            e.preventDefault()

            const response = await authApi.login({ username, password })
            
            setDataInfo(response.data);
            setAuthLogin(true)
            // set access_token to cookie
            cookie.save('access_token', response.data?.access_token);
            cookie.save('user_data', response.data);
            alert(response.message)
            setChecked(!check)
            // window.open("/home", "_self", "")
            navigate("/")

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

    const googleSuccess = async (res) => {
        try{
            const response = await authApi.googleLogin({fullname: res.profileObj.name, email: res.profileObj.email, access_token: res.accessToken});
            setDataInfo(response.data);
            setAuthLogin(true)

            // set access_token to cookie
            cookie.save('access_token', response.data?.access_token);
            cookie.save('user_data', response.data);
            alert(response.message)
            setChecked(!check)
            // window.open("/home", "_self", "")
            navigate("/")
        }
        catch(err){
            if (Object.keys(err).length > 0) {
                alert(err?.message)
            }
            else {
                // An error has occurred
                alert('An error has occurred')
            }
        }
    }

    const googleFailure = (err) => {
        console.log(err);
    }

    return (
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <div>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                        <h2>Sign In</h2>
                    </Grid>

                    <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                        render={renderProps => (
                            <Button onClick={renderProps.onClick} disabled={renderProps.disabled} fullWidth variant='contained' color='primary' style={{ marginTop: '10px' }}>Login with google</Button>
                        )}
                        buttonText="Login"
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy={'single_host_origin'}
                    />
                    <Divider className={classes.divider} />
                </div>
                <form onSubmit={login}>

                    <TextField onChange={(e) => setUsername(e.target.value)} label='Username' placeholder='Enter username' fullWidth required />
                    <TextField onChange={(e) => setPassword(e.target.value)} label='Password' placeholder='Enter password' type='password' fullWidth required />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="checkedB"
                                color="primary"
                            />
                        }
                        label="Remember me"
                    />
                    <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>
                        Sign in
                    </Button>
                    <Typography >
                        <Link href="/#" >
                            Forgot password ?
                        </Link>
                    </Typography>
                    <Typography > Do you have an account ?
                        <Link href="/register" >
                            Register
                        </Link>
                    </Typography>
                </form>
            </Paper>
        </Grid>
    )
}

export default Login;