import { Avatar } from "@material-ui/core";
import { FolderOpen, PermContactCalendar } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocalContext } from "../../context/context";
import cookie from 'react-cookies';
import "./style.css";

const JoinedClasses = ({ classData, key }) => {
  const { dataInfo } = useLocalContext();
  const{setClassId} = useLocalContext();
  const [code, setCode] = useState();

  useEffect(() => {
    const _code = classData.owner.map((item) => {
      return (
        <p className="joined__owner">
          {item.id !== dataInfo.id ? item.username : null}
        </p>
      )
    })
    setCode(_code)
  }, []);
  console.log('class data', classData);
  return (
    <li key={key} className="joined__list">
      <div className="joined__wrapper">
        <div className="joined__container">
          <div className="joined__imgWrapper">
          </div>
          <div className="joined__image" />
          <div className="joined__content">
            <Link className="joined__title" to={`/${classData.id}`} onClick={() => {
              if (classData) {
                setClassId(classData.id)
                cookie.save('class_data', classData);
              }
            }}>
              <h2>{classData.name}</h2>
              <p>{classData.description}</p>
            </Link>
            {code}
            {/* {classData?.code } */}
          </div>
        </div>
        <Avatar
          className="joined__avatar"
          src="../../img/photo.png"
        />
      </div>
      <div className="joined__bottom">
        <PermContactCalendar />
        <FolderOpen />
      </div>
    </li>
  );
};

export default JoinedClasses;
