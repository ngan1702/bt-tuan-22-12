import React, { useEffect,useState } from "react";
import classApi from '../../apis/class.api';
import { Button} from '@material-ui/core'
import { useNavigate, useParams } from 'react-router-dom'
import {AxiosBasic} from "../../services/api";
import "./style.css";
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useLocalContext } from "../../context/context";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '10rem',
}));

const ConfirmInvite = () => {
    const navigate = useNavigate()
    const path = window.location.pathname.substring(1)
    const {id} = useParams()

    const handleClick = () => {
        navigate("/")
      }

      const [check,setCheck]=useState(false)

  useEffect(() => { 
    const fetchData = async () => {
        if (!path.includes("confirm-invite-by-code")){
          try {
            let response = await classApi.verifyMember({inviteToken: id})
            
            setCheck(true)      
          }
          catch (err) {
            console.log("ERROR verify, err: ", err)
    
            if (Object.keys(err).length > 0) {
                alert(err?.message)
            }
            else {
                // An error has occurred
                alert('An error has occurred')
            }      
          }
      }
      else{
        //confirm-invite-by-code/VBfsX0C
        try {       
          const inviteMemberByCode = async () => {
              return AxiosBasic({
                  url: '/class/join?code='+id,
                  method: 'POST'
              })
          }

          let response = await inviteMemberByCode()
          
          setCheck(true)
        }
        catch (err) {
          console.log("err",err.message)
          if (Object.keys(err).length > 0) {
            alert(err?.message)
          }
          else {
              // An error has occurred
              alert('An error has occurred')
          }           
      }
    }}
    fetchData()
  }, []);

  return (
    <div class="wrapper">
      {(check)
      ?<Item>Joined Class succeeded</Item>
      :null
      }
      
        <Button onClick={handleClick}>HOME</Button>
    </div>
  );
}

export default ConfirmInvite;
