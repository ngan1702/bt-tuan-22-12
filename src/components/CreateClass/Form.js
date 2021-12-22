import { Button, DialogActions, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { useLocalContext } from "../../context/context";
import classApi from '../../apis/class.api';
import cookie from 'react-cookies';

const Form = () => {
  const { setShowForm } = useLocalContext();
  const { check, setChecked } = useLocalContext();
  const { dataInfo } = useLocalContext();

  const [name, setClassName] = useState("");
  const [description, setDescription] = useState("");

  const { dataClassCreate, setCreateClassDialog, setDataClassCreate } = useLocalContext();
  const {setCheckTeacher} = useLocalContext();

  const handleSubmit = async (e) => {
    try {
        e.preventDefault()
        let userID=dataInfo.id

        let response = await classApi.createClass({ name, description, userID })
        setDataClassCreate([
          ...dataClassCreate,
          response.data
        ])
        setCreateClassDialog(false);
        setShowForm(false);
        setCheckTeacher(true)
        cookie.save('check_teacher', true)
    }
    catch (err) {
        console.log("ERROR create class, err: ", err)
    }
  }

  const handleCancel = () => {
    setCreateClassDialog(false);
    setShowForm(false);
    setChecked(!check);
    setCheckTeacher(false)
    cookie.save('check_teacher', false)
  };

  return (
    <div className="form">
      <p className="class__title">Create Class</p>

      <div className="form__inputs">
        <TextField
          id="filled-basic"
          label="Class Name (required)"
          className="form__input"
          variant="filled"
          value={name}
          onChange={(e) => setClassName(e.target.value)}
        />
        <TextField
          id="filled-basic"
          label="Description"
          className="form__input"
          variant="filled"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <DialogActions>
        <Button onClick={handleCancel}>
          Cancel
        </Button>
        <Button color="primary" disabled={!name} onClick={handleSubmit}>
          Create
        </Button>
      </DialogActions>
    </div>
  );
};

export default Form;
