import React, { useEffect, Fragment, useState } from "react";
import Input from "@mui/material/Input";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { useTable, usePagination } from "react-table";
import { Container } from "@material-ui/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import classApi from "../../apis/class.api";
import { useParams } from "react-router-dom";
import { Menu, MenuItem, IconButton } from "@material-ui/core";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    if (value === initialValue) {
      return;
    }
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <Input value={value} onChange={onChange} onBlur={onBlur} />;
};

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
};

// Be sure to pass our updateMyData and the skipPageReset option
function Table({ columns, data, updateMyData, skipPageReset }) {
  // For this example, we're using pagination to illustrate how to stop the current page from resetting when our data changes
  // Otherwise, nothing is different here.
  const { getTableProps, headerGroups, prepareRow, page } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // use the skipPageReset option to disable page resetting temporarily
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but anything we put into these options will automatically be available on the instance.
      // That way we can call this function from our cell renderer!
      updateMyData,
    },
    usePagination
  );

  //Profile dialog
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const handleClickProfile = (event) => setAnchorElProfile(event.currentTarget);
  const handleCloseProfile = () => setAnchorElProfile(null);

  // get column id
  const [colID, setColID] = useState();
   
  // get column data
  const [colData, setColData] = useState([]);

  // Render the UI for your table
  return (
    <MaUTable {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => {
              if (
                column.Header === "Code" ||
                column.Header === "Name" ||
                column.Header === "Info Student" ||
                column.Header === "Grade" ||
                column.Header.includes("Total Point")
              ) {
                return (
                  <TableCell {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </TableCell>
                );
              } else {
                return (
                  <TableCell
                    {...column.getHeaderProps()}
                    onClick={() => {
                      setColID(column.id)
                      setColData([])
                    }}
                  >
                    {column.render("Header")}
                    <IconButton onClick={handleClickProfile}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorElProfile}
                      open={Boolean(anchorElProfile)}
                      onClose={handleCloseProfile}
                      onClick={handleCloseProfile}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            float: "right",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                    >
                      <MenuItem
                        onClick={() => {
                          console.log("column id", colID);
                          setColData([])
                          let coldata=[];

                          page.forEach(element => {
                              coldata.push({
                                code: element.values.code,
                                name: element.values.name,
                                grade: element.values[colID]
                            })
                          });

                          setColData(coldata)
                            console.log('col data',colData)
                        }}
                      >
                        Save
                      </MenuItem>
                      <MenuItem
                        onClick={() => {

                        }}
                      >
                        Set As Done
                        </MenuItem>
                    </Menu>

                    <p style={{ color: "gray" }}>Finish ✔</p>
                  </TableCell>
                );
              }
            })}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {page.map((row, i) => {
          prepareRow(row);
          const cell = row.cells.map((cell) => {
            if (
              cell.column.Header !== "Code" &&
              cell.column.Header !== "Name"
            ) {
              let header = cell.column.Header.split(" ");
              let maxPoint = header[header.length - 2];
              return (
                <TableCell {...cell.getCellProps()}>
                  {cell.render("Cell")}
                  <span>/{maxPoint}</span>
                </TableCell>
              );
            } else {
              return (
                <TableCell {...cell.getCellProps()}>
                  {cell.render("Cell")}
                </TableCell>
              );
            }
          });

            if (row.original.isHaveAccount)
                return <TableRow {...row.getRowProps()}>{cell}</TableRow>;
            else if (!row.original.isHaveAccount) {
                return (
                    <TableRow
                        {...row.getRowProps()}
                        style={{ background: "#808080" }}
                    >
                        {cell}
                    </TableRow>
                );
            }
        })}
      </TableBody>
    </MaUTable>
  );
}

const DetailClassGrade = () => {
  const { classId } = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingGradeStructure, setLoadingGradeStructure] = useState(false);
  const [loadingGradeBoard, setLoadingGradeBoard] = useState(false);
  const [gradeStructure, setGradeStructure] = useState([]);
  const [board, setBoard] = useState();

  const [data, setData] = useState([]);
  const [uploadListStudentFile, setUploadListStudentFile] = useState();
  const [assignments, setAssignments] = useState([]);
  const [studentGrade, setStudentGrade] = useState([]);

  
  useEffect(() => {
    setLoading(true);
    setLoadingGradeBoard(true);
    setLoadingGradeStructure(true);

    // const fetchData = async () => {
    //   const callApi = await classApi.getGradeList({ classId })

    //   if (callApi.message==="successed"){
    //     console.log("callApi",callApi)
    //     setLoadingGradeStructure(false);
    //     setAssignments(
    //       callApi.assignment.map((gradeComponent) => {
    //           return {
    //               maxPoint: gradeComponent.max,
    //               name: gradeComponent.name
    //           };
    //       })
    //     );

    //     let totalPoint=0;
    //     assignments.forEach(bt=>{
    //         totalPoint += bt.maxPoint
    //     });
    
    //     assignments.push({name: "Total Point", maxPoint: totalPoint})

    //     setStudentGrade(
    //       callApi.data.map((student) => {
    //           let gradeNameAndGradeArrayObject = {};
    //           gradeNameAndGradeArrayObject = student.grades.map((grade) => {
    //               const gradeName = grade.name;
    //               return { [gradeName]: grade.point };
    //           });

    //           let gradeNameAndGradeArray = {};

    //           for (let i = 0; i < gradeNameAndGradeArrayObject.length; i++)
    //               gradeNameAndGradeArray = Object.assign(
    //                   gradeNameAndGradeArray,
    //                   gradeNameAndGradeArrayObject[i]
    //               );

    //           const row = {
    //               ...gradeNameAndGradeArray,
    //               code: student.studentId,
    //               name: student.fullname,
    //               subRows: 0,
    //               isHaveAccount: student.studentId ? true : false,
    //           };

    //           return row;
    //       })
    //     )

    //     studentGrade.forEach(student=>{
    //       let totalPoint=0;
    //       student.grades.forEach(bt=>{
    //           totalPoint += bt.point
    //       });
    //       student.grades.push({name: "Total Point", point: totalPoint})
    //   })
    //   }
    //   console.log("assignments",assignments)
    //   console.log("studentGrade",studentGrade)
    // }

    // fetchData()

    const dataGrade = [
      { name: "bt1", maxPoint: 100 },
      { name: "bt2", maxPoint: 50 },
    ];

    const dataGradeBoard = [
      {
        studentId: "001",
        studentCode: "001",
        studentName: "tram ngan",
        gradeArray: [
          { name: "bt1", point: 100 },
          { name: "bt2", point: 99 },
        ],
      },
      {
        studentId: "002",
        studentCode: "002",
        studentName: "yen tram",
        gradeArray: [
          { name: "bt1", point: 100 },
          { name: "bt2", point: 99 },
        ],
      },
      {
        studentId: "003",
        studentName: "yen tram",
        gradeArray: [
          { name: "bt1", point: 100 },
          { name: "bt2", point: 99 },
        ],
      },
    ];

    let totalPoint=0;
    dataGrade.forEach(bt=>{
        totalPoint += bt.maxPoint
    });

    dataGrade.push({name: "Total Point", maxPoint: totalPoint})

    setGradeStructure(
      dataGrade.map((gradeComponent) => {
        return {
          maxPoint: gradeComponent.maxPoint,
          name: gradeComponent.name,
        };
      })
    );

    dataGradeBoard.forEach(student=>{
        let totalPoint=0;
        student.gradeArray.forEach(bt=>{
            totalPoint += bt.point
        });
        student.gradeArray.push({name: "Total Point", point: totalPoint})
    })

    const responseBoard = dataGradeBoard;
    setData(
      responseBoard.map((student) => {
        let gradeNameAndGradeArrayObject = {};
        gradeNameAndGradeArrayObject = student.gradeArray.map((grade) => {
          const gradeName = grade.name;
          return { [gradeName]: grade.point };
        });

        let gradeNameAndGradeArray = {};

        for (let i = 0; i < gradeNameAndGradeArrayObject.length; i++)
          gradeNameAndGradeArray = Object.assign(
            gradeNameAndGradeArray,
            gradeNameAndGradeArrayObject[i]
          );

        const row = {
          ...gradeNameAndGradeArray,
          code: student.studentCode,
          name: student.studentName,
          subRows: 0,
          isHaveAccount: student.studentCode ? true : false,
        };

        //console.log('row',row);
        return row;
      })
    );

    setBoard(
      dataGrade.map((element) => {
        return element;
      })
    );
    //             })
    //             .catch((err) => {
    //                 setError(ERROR_CODE[err] || "Error!");
    //             });
    //         setLoading(false);
    //     });
  }, []);

  // useEffect(
  //   async () => {
  //   setLoading(true);
  //   setLoadingGradeBoard(true);
  //   setLoadingGradeStructure(true);
  //   const callApi = await classApi.getGradeList({ classId })

  //   setAssignments(oldData => [...oldData, callApi.assignment.map((element) => {
  //     return {
  //       name: element.name,
  //       maxPoint: element.max,
  //     };
  //   })])
    
  //   //setStudentGrade( () => { })
  //   const dataGradeBoard = [
  //     {
  //       studentId: "001",
  //       studentCode: "001",
  //       studentName: "tram ngan",
  //       gradeArray: [
  //         { name: "bt1", point: 100 },
  //         { name: "bt2", point: 99 },
  //       ],
  //     },
  //     {
  //       studentId: "002",
  //       studentCode: "002",
  //       studentName: "yen tram",
  //       gradeArray: [
  //         { name: "bt1", point: 100 },
  //         { name: "bt2", point: 99 },
  //       ],
  //     },
  //     {
  //       studentId: "003",
  //       gradeArray: [
  //         { name: "bt1", point: 100 },
  //         { name: "bt2", point: 99 },
  //       ],
  //     },
  //   ];
  //   // axios
  //   //     .get(API_URL_GRADE + id, { headers })
  //   //     .then((response) => {
  //   //         if (response.data.data) {
  //   setLoadingGradeStructure(false);
  //   setGradeStructure(
  //     assignments.map((gradeComponent) => {
  //       return {
  //         maxPoint: gradeComponent.maxPoint,
  //         name: gradeComponent.name,
  //       };
  //     })
  //   );
  //   //         }
  //   //     })
  //   //     .then(() => {
  //   //         axios
  //   //             .get(
  //   //                 API_URL_GRADE + "board/" + id,
  //   //                 { headers: headers }
  //   //             )
  //   // .then(function (response) {
  //   setLoadingGradeBoard(false);
  //   const responseBoard = dataGradeBoard;
  //   setData(
  //     responseBoard.map((student) => {
  //       let gradeNameAndGradeArrayObject = {};
  //       gradeNameAndGradeArrayObject = student.gradeArray.map((grade) => {
  //         const gradeName = grade.name;
  //         return { [gradeName]: grade.point };
  //       });

  //       let gradeNameAndGradeArray = {};

  //       for (let i = 0; i < gradeNameAndGradeArrayObject.length; i++)
  //         gradeNameAndGradeArray = Object.assign(
  //           gradeNameAndGradeArray,
  //           gradeNameAndGradeArrayObject[i]
  //         );

  //       const row = {
  //         ...gradeNameAndGradeArray,
  //         code: student.studentId,
  //         name: student.studentName,
  //         subRows: 0,
  //         isHaveAccount: student.name ? true : false,
  //       };

  //       return row;
  //     })
  //   );

  //   setBoard(
  //     assignments.map((element) => {
  //       return element;
  //     })
  //   );
  // }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        columns: [
          {
            Header: "Code",
            accessor: "code",
          },
          {
            Header: "Name",
            accessor: "name",
          },
        ],
      },
      {
        Header: "Grade",
        columns: gradeStructure.map((gradeStructure) => {
          return {
            Header:
              gradeStructure.name + " (Max: " + gradeStructure.maxPoint + " )",
            accessor: gradeStructure.name,
          };
        }),
      },
    ],
    [gradeStructure]
  );

  const [skipPageReset, setSkipPageReset] = React.useState(false);

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setLoading(true);
    setSkipPageReset(true);

    const studentId = board[rowIndex].studentId;
    const gradeId = board[rowIndex].gradeArray.find(
      (element) => element.name === columnId
    ).id;
    const point = parseInt(value);

    const postData = {
      studentId,
      gradeId,
      point,
    };

    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

  const downloadStudentList = async (e) => {
    e.preventDefault();
    await classApi.exportStudentList({ classId: classId });
  };

  const exportStudentList = async (e) => {
    e.preventDefault();
    await classApi.exportStudentList({ classId: classId });
  };

  const handleUploadStudentListFile = async (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setUploadListStudentFile(undefined);
      return;
    } else {
      setUploadListStudentFile(e.target.files[0]);
    }
  };

  useEffect(async () => {
    console.log(2);
    if (!uploadListStudentFile) {
      return;
    }

    const objectUrl = URL.createObjectURL(uploadListStudentFile);

    setLoading(true);

    const dataArray = new FormData();
    dataArray.append("data", uploadListStudentFile);
    await classApi.importStudentList({classId: classId, file: dataArray})
    setLoading(false);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [uploadListStudentFile]);

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  return (
    <Fragment>
      <Box sx={{ p: 2, pr: 10, display: "flex", flexDirection: "row-reverse" }}>
        <Button variant="outlined" onClick={downloadStudentList}>
          Download Student List
        </Button>
        <Button variant="outlined" component="label" sx={{ mr: 2 }}>
          {" "}Upload Student List{" "}
          <input
            type="file"
            hidden
            onChange={handleUploadStudentListFile}
          />{" "}
        </Button>
        <Button variant="outlined" component="label" sx={{ mr: 2 }}>
          {" "}Export All{" "}
          <input
            type="file"
            hidden
            onChange={exportStudentList}
          />{" "}
        </Button>
      </Box>
      <Container>
        <Table
          columns={columns}
          data={data}
          updateMyData={updateMyData}
          skipPageReset={skipPageReset}
          options={{
            exportButton: true,
            exportAllData: true
            }}
        />
      </Container>
    </Fragment>
  );
};

export default DetailClassGrade;
