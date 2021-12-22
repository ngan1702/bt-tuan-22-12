import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@mui/material";

const Notification = ({Notify, setNotify}) => {
    const handleClose = (event, reason) => {
        setNotify({
            ...Notify,
            isOpen: false
        })
    }

    return(
        <Snackbar
        open={Notify.isOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        >
            <Alert 
            severity={Notify.type}
            onClose={handleClose}
            >
                {Notify.message}
            </Alert>
        </Snackbar>
    )
}

export default Notification;