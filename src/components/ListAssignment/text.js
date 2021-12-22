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
                column.Header === "Grade"
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
                      <MenuItem>Reset</MenuItem>
                    </Menu>
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
                  <p>/{maxPoint}</p>
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

          return <TableRow {...row.getRowProps()}>{cell}</TableRow>;

          //   if (row.original.isHaveAccount)
          //       return <TableRow {...row.getRowProps()}>{cell}</TableRow>;
          //   else if (!row.original.isHaveAccount) {
          //       return (
          //           <TableRow
          //               {...row.getRowProps()}
          //               style={{ background: "#808080" }}
          //           >
          //               {cell}
          //           </TableRow>
          //       );
          //   }
        })}
      </TableBody>
    </MaUTable>
  );
}

const DetailClassGrade = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingGradeStructure, setLoadingGradeStructure] = useState(false);
  const [loadingGradeBoard, setLoadingGradeBoard] = useState(false);
  const [gradeStructure, setGradeStructure] = useState([]);
  const [board, setBoard] = useState();

  const [data, setData] = useState([]);
  const [uploadListStudentFile, setUploadListStudentFile] = useState();

  useEffect(() => {
    setLoading(true);
    setLoadingGradeBoard(true);
    setLoadingGradeStructure(true);

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
        studentCode: "003",
        gradeArray: [
          { name: "bt1", point: 100 },
          { name: "bt2", point: 99 },
        ],
      },
    ];

    // axios
    //     .get(API_URL_GRADE + id, { headers })
    //     .then((response) => {
    //         if (response.data.data) {
    setLoadingGradeStructure(false);

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
    //         }
    //     })
    //     .then(() => {
    //         axios
    //             .get(
    //                 API_URL_GRADE + "board/" + id,
    //                 { headers: headers }
    //             )
    // .then(function (response) {
    setLoadingGradeBoard(false);

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
          isHaveAccount: student.name ? true : false,
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

  const columns = React.useMemo(
    () => [
      {
        Header: "Info Student",
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
              gradeStructure.name + " ( Max: " + gradeStructure.maxPoint + " )",
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

    //console.log("rowIndex: ", rowIndex);
    //console.log("columnId: ", columnId);
    //console.log("value:", value);
    // const studentId = board[rowIndex].studentId;
    // const gradeId = board[rowIndex].gradeArray.find(
    //   (element) => element.name === columnId
    // ).id;
    // const point = parseInt(value);

    // const postData = {
    //   studentId,
    //   gradeId,
    //   point,
    // };

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
    // axios.post(API_URL_GRADE + id, postData, { headers })
    //     .then(function (response) {
    //         if (response.data.status === 0) {
    //             setError("Occur error! Please try again later!")
    //         }
    //         else if (response.data.status === 1) {
    //             setData((old) =>
    //                 old.map((row, index) => {
    //                     if (index === rowIndex) {
    //                         return {
    //                             ...old[rowIndex],
    //                             [columnId]: value,
    //                         };
    //                     }
    //                     return row;
    //                 })
    //             );
    //         }
    //         setLoading(false);
    //     })
  };

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

  const downloadStudentList = () => {
    // axios
    //     .get(
    //         API_URL_CLASSROOM + id + "/export-student",
    //         { headers: headers }
    //     ).then((response) => {
    //         const downloadLink = response.data.data;
    //         window.open(downloadLink);
    //     })
  };

  const handleUploadStudentListFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setUploadListStudentFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setUploadListStudentFile(e.target.files[0]);
  };

  useEffect(() => {
    if (!uploadListStudentFile) {
      return;
    }

    const objectUrl = URL.createObjectURL(uploadListStudentFile);

    setLoading(true);

    const dataArray = new FormData();
    dataArray.append("import-student-file", uploadListStudentFile);
    // axios.post(API_URL_CLASSROOM + id + "/import-student", dataArray, { headers })
    //     .then(function (response) {
    //         if (response.data.status === 0) {
    //             setError("Please check your permission and try again later!")
    //         }
    //         else if (response.data.status === 1) {
    //             window.location.reload();
    //         }
    //     })
    //     .catch(function (error) {
    //         setError(error);
    //         return error;
    //     })
    setLoading(false);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [uploadListStudentFile]);

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  return (
    <Fragment>
      <Box sx={{ p: 2, pr: 10, display: "flex", flexDirection: "row-reverse" }}>
        <IconButton variant="outlined" onClick={downloadStudentList}>
          Download Student List
        </IconButton>
        <IconButton variant="outlined" component="label" sx={{ mr: 2 }}>
          {" "}
          Upload Student List{" "}
          <input
            type="file"
            hidden
            onChange={handleUploadStudentListFile}
          />{" "}
        </IconButton>
      </Box>
      <Container>
        <Table
          columns={columns}
          data={data}
          updateMyData={updateMyData}
          skipPageReset={skipPageReset}
        />
      </Container>
    </Fragment>
  );
};

export default DetailClassGrade;
