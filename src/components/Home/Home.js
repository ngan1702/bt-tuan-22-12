import React, { useEffect, useState } from "react";
import JoinedClasses from "../JoinedClasses/JoinedClasses";
import { useLocalContext } from "../../context/context";
import classApi from '../../apis/class.api';

const Home = () => {

  const [dataClassJoined, setDataClassJoined] = useState([]);
  const [dataClassCreate, setDataClassCreate] = useState([]);
  const {setClassId} = useLocalContext();
  setClassId('');

  useEffect(
    async () => {
    try {
      let response = await classApi.getClasses()

      // set response.data to global state user
      setDataClassCreate(response.data.classOwner)
      setDataClassJoined(response.data.classMember)
    }
    catch (err) {
      console.log("ERROR login, err: ", err)
    }
    
    // setReloadClass(true);
  }, []);
  console.log(dataClassJoined);
  return (
    <div>
      {/* <Drawer /> */}
      <ol className="joined">
        {[...dataClassCreate, ...dataClassJoined].map((item, index) => (
          <div key={index}>
            <JoinedClasses classData={item} />
          </div>
        ))}

      </ol>
    </div>
  );
}

export default Home;
