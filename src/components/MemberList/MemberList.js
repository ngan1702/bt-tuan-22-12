import React, { useState, useEffect } from "react";
import {
  Avatar,
  Container,
  makeStyles,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";
import { Table } from "@material-ui/core";
import { useLocalContext } from "../../context/context";
import cookie from "react-cookies";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  table: {
    width: "70%",
  },
  tableCell: {
    width: "40px",
  },
  role: {
    marginTop: theme.spacing(5),
    width: "70%",
  },
}));

const MemberList = () => {
  const styles = useStyles();
  const classDetail = cookie.load("class_data");

  return (
    <div>
      <Container fixed>
        <div className={styles.container}>
          <Table className={styles.role}>
            <TableBody>
              <TableRow>
                <TableCell color="blue">
                  <h2>Teacher</h2>
                </TableCell>
                <TableCell align="right">
                  <p>{classDetail.owner.length} teacher</p>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className={styles.container}>
          <Table className={styles.table}>
            <TableBody>
              {classDetail.owner.map((item) => (
                <TableRow>
                  <TableCell className={styles.tableCell}>
                    <Avatar />
                  </TableCell>
                  <TableCell>{item.fullname}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className={styles.container}>
          <Table className={styles.role}>
            <TableBody>
              <TableRow style={{ color: "blue" }}>
                <TableCell>
                  <h2>Classmates</h2>
                </TableCell>
                <TableCell align="right">
                  <p>{classDetail.member.length} student</p>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className={styles.container}>
          <Table className={styles.table}>
            <TableBody>
              {classDetail.member.map((item) => (
                <TableRow>
                  <TableCell className={styles.tableCell}>
                    <Avatar />
                  </TableCell>
                  <TableCell>{item.fullname}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Container>
    </div>
  );
};

export default MemberList;
