import React, { useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container } from '@material-ui/core';
import authApi from '../../apis/auth.api';
import { useLocalContext } from "../../context/context";

export default function GradesList() {
    const {dataGrade, setDataGrade} = useLocalContext();
    const {setClassId} = useLocalContext();
    setClassId('');

    useEffect(() => { 
        const fetchData = async () => {
          try {
            let response = await authApi.getMyGrade()
      
            // set response.data to global state user
            setDataGrade(response.data)
          }
          catch (err) {
            console.log("ERROR set grade, err: ", err)
          }
        };
        fetchData();
      }, []);
    
    return (
        <Container>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 400 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Subjects</TableCell>
                            <TableCell align="right">Grade</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataGrade.map((row) => (
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.classes.name}
                                </TableCell>
                                <TableCell align="right">{row.grade}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
