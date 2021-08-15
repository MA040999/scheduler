import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import app from "../axiosConfig";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  formControl: {
    margin: theme.spacing(4.5),
    minWidth: 450,
  },
}));

export default function UpdateDialog(props) {
  const classes = useStyles();

  // const [selectedCourse, setSelectedCourse] = useState("");
  // const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [error, setError] = useState(false);

  const [courses, setCourses] = useState([]);

  const {
    open,
    day,
    timing,
    booked,
    bool,
    setBool,
    setOpen,
    selectedCourse,
    selectedFaculty,
    setSelectedCourse,
    setSelectedFaculty,
    time,
    setTime,
    twoSlots,
  } = props;

  useEffect(() => {
    app.get("/api/lab/courses").then((res) => {
      setCourses(res.data);
    });
  }, []);

  useEffect(() => {
    setSelectedTime(time);
  }, [time]);

  const handleChange = (e) => {
    if (e.target.name === "faculty") {
      if (e.target.value === "0") {
        setSelectedFaculty(e.target.value);
        setSelectedCourse(e.target.value);
      } else {
        setSelectedFaculty(e.target.value);
      }
    } else if (e.target.name === "course") {
      if (e.target.value === "0") {
        setSelectedFaculty(e.target.value);
        setSelectedCourse(e.target.value);
      } else {
        setSelectedCourse(e.target.value);
      }
    } else {
      setSelectedTime(e.target.value);
    }
  };

  const handleClose = () => {
    setError(false);
    setSelectedCourse("");
    setSelectedFaculty("");
    setSelectedTime("");
    setTime("");
    setOpen(false);
  };

  const handleSubmit = () => {
    if (
      selectedCourse === "" ||
      selectedTime === "" ||
      selectedFaculty === ""
    ) {
      setError(true);
    } else {
      if (twoSlots === true) {
        let t2 = selectedTime;
        app
          .patch("/api/lab/update", {
            course: selectedCourse,
            time1: selectedTime,
            time2: t2 + 1,
            day: day,
            faculty: selectedFaculty,
          })
          .then(() => {
            setBool(!bool);

            handleClose();
          });
      } else {
        app
          .patch("/api/lab/update", {
            course: selectedCourse,
            time1: selectedTime,
            day: day,
            faculty: selectedFaculty,
          })
          .then(() => {
            setBool(!bool);

            handleClose();
          });
      }
    }
  };

  var arr = [];

  return (
    <div>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Schedule Details</DialogTitle>
        <div
          style={{
            marginLeft: "1.5em",
            fontWeight: "bold",
            color: "rgb(207, 60, 60)",
          }}
        >
          {error ? "Please fill all the fields" : ""}
        </div>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel
                style={{ fontFamily: "Poppins", fontWeight: "bold" }}
                htmlFor="demo-dialog-native"
              >
                Course
              </InputLabel>

              <Select
                style={{ fontFamily: "Poppins", fontWeight: "bold" }}
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                onChange={handleChange}
                name={"course"}
                value={selectedCourse || ""}
                input={<Input />}
              >
                <MenuItem
                  style={{ fontFamily: "Poppins", fontWeight: "bold" }}
                  value=""
                  disabled
                >
                  Select a course
                </MenuItem>
                <MenuItem
                  style={{ fontFamily: "Poppins", fontWeight: "bold" }}
                  value="0"
                >
                  None
                </MenuItem>
                {courses.map((course) => {
                  if (selectedFaculty === course.facultyid) {
                    return (
                      <MenuItem
                        style={{ fontFamily: "Poppins", fontWeight: "bold" }}
                        key={course._id}
                        value={course.courseid}
                      >
                        {`${course.name} ----- ${course.class}`}
                      </MenuItem>
                    );
                  } else if (selectedFaculty === "") {
                    return (
                      <MenuItem
                        style={{ fontFamily: "Poppins", fontWeight: "bold" }}
                        key={course._id}
                        value={course.courseid}
                      >
                        {`${course.name} ----- ${course.class}`}
                      </MenuItem>
                    );
                  }
                  return null;
                })}
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel
                style={{ fontFamily: "Poppins", fontWeight: "bold" }}
                htmlFor="demo-dialog-native"
              >
                Faculty
              </InputLabel>

              <Select
                style={{ fontFamily: "Poppins", fontWeight: "bold" }}
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                onChange={handleChange}
                name={"faculty"}
                value={selectedFaculty || ""}
                input={<Input />}
              >
                <MenuItem
                  style={{ fontFamily: "Poppins", fontWeight: "bold" }}
                  value=""
                  disabled
                >
                  Select faculty name
                </MenuItem>
                <MenuItem
                  style={{ fontFamily: "Poppins", fontWeight: "bold" }}
                  value="0"
                >
                  None
                </MenuItem>

                {courses.map((course) => {
                  if (selectedCourse === course.courseid) {
                    return (
                      <MenuItem
                        style={{ fontFamily: "Poppins", fontWeight: "bold" }}
                        key={course.faculty._id}
                        value={course.faculty.facultyid}
                      >
                        {`${course.faculty.facultyname}`}
                      </MenuItem>
                    );
                  } else if (selectedCourse === "") {
                    if (!arr.includes(course.faculty.facultyid)) {
                      arr.push(course.faculty.facultyid);
                      return (
                        <MenuItem
                          style={{ fontFamily: "Poppins", fontWeight: "bold" }}
                          key={course.faculty._id}
                          value={course.faculty.facultyid}
                        >
                          {`${course.faculty.facultyname}`}
                        </MenuItem>
                      );
                    }
                  }
                  return null;
                })}
              </Select>
            </FormControl>

            {/* <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                Time:{" "}
                {timing.map((t) => (t.timingid === time ? t.timeslot : null))}
              </div> */}

            {twoSlots ? (
              <div>
                <InputLabel
                  style={{
                    marginTop: "2em",
                    marginLeft: "2.2em",
                    fontFamily: "Poppins",
                    fontWeight: "bold",
                    marginBottom: "0.5em",
                  }}
                  htmlFor="demo-dialog-native"
                >
                  Start Timings
                </InputLabel>
                {timing.map((t) => {
                  if (t.timingid === time) {
                    console.log("adasd");
                    return (
                      <div
                        style={{
                          marginLeft: "2.2em",
                          fontWeight: "bold",
                        }}
                        key={t._id}
                      >{`${t.timeslot.substr(0, 6)} and ${t.timeslot.substr(
                        7
                      )}`}</div>
                    );
                  }

                  return null;
                })}
              </div>
            ) : (
              <FormControl className={classes.formControl}>
                <InputLabel
                  style={{ fontFamily: "Poppins", fontWeight: "bold" }}
                  htmlFor="demo-dialog-native"
                >
                  Timings
                </InputLabel>
                <Select
                  style={{ fontFamily: "Poppins", fontWeight: "bold" }}
                  labelId="demo-dialog-select-label"
                  id="demo-dialog-select"
                  onChange={handleChange}
                  name={"timing"}
                  value={selectedTime || ""}
                  input={<Input />}
                >
                  <MenuItem
                    style={{ fontFamily: "Poppins", fontWeight: "bold" }}
                    value=""
                    disabled
                  >
                    Select time slot
                  </MenuItem>

                  {timing.map((t) => {
                    var isTrue = false;
                    booked.map((b) => {
                      if (b.day === day) {
                        if (t.timingid === b.timing) {
                          isTrue = true;
                        }
                      }
                      return null;
                    });
                    if (isTrue) {
                      if (time === "") {
                        return (
                          <MenuItem
                            style={{
                              fontFamily: "Poppins",
                            }}
                            key={t._id}
                            value={t.timingid}
                            disabled
                          >
                            {t.timeslot}
                          </MenuItem>
                        );
                      } else {
                        if (t.timingid === time) {
                          return (
                            <MenuItem
                              style={{
                                fontFamily: "Poppins",
                                fontWeight: "bold",
                              }}
                              key={t._id}
                              value={t.timingid}
                            >
                              {t.timeslot}
                            </MenuItem>
                          );
                        } else {
                          return (
                            <MenuItem
                              style={{
                                fontFamily: "Poppins",
                              }}
                              key={t._id}
                              value={t.timingid}
                              disabled
                            >
                              {t.timeslot}
                            </MenuItem>
                          );
                        }
                      }
                    } else {
                      if (time === "") {
                        return (
                          <MenuItem
                            style={{
                              fontFamily: "Poppins",
                              fontWeight: "bold",
                            }}
                            key={t._id}
                            value={t.timingid}
                          >
                            {t.timeslot}
                          </MenuItem>
                        );
                      } else {
                        if (t.timingid !== time) {
                          return (
                            <MenuItem
                              style={{
                                fontFamily: "Poppins",
                              }}
                              key={t._id}
                              value={t.timingid}
                              disabled
                            >
                              {t.timeslot}
                            </MenuItem>
                          );
                        }
                      }
                    }
                    return null;
                  })}
                </Select>
              </FormControl>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <button className="cancel-btn" onClick={handleClose} color="primary">
            Cancel
          </button>
          <button className="error-btn" onClick={handleSubmit} color="primary">
            SUBMIT
          </button>
        </DialogActions>
        {/* <div>
          <pre>{JSON.stringify(selectedTime, null, 2)}</pre>
        </div> */}
      </Dialog>
    </div>
  );
}
