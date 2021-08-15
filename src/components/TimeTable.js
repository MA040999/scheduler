import app from "../axiosConfig";
import React from "react";
import { useEffect, useState } from "react";
import UpdateDialog from "./UpdateDialog";

function TimeTable() {
  const [timing, setTiming] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [open, setOpen] = useState(false);

  const [day, setDay] = useState("");
  const [bool, setBool] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [time, setTime] = useState("");
  const [twoSlots, setTwoSlots] = useState(false);

  useEffect(() => {
    getSchedule();
  }, [bool]);

  let getSchedule = () => {
    app.get("/api/lab/").then((res) => {
      let [timings, sch] = res.data;
      setTiming(timings);
      setSchedule(sch);
    });
  };

  // let getCourses = () => {
  //   const class_arr = [];
  //   const course_arr = [];

  //   axios.get("/api/lab/courses").then((res) => {
  //     let courses = res.data;

  //     courses.map((course) => {
  //       Object.keys(course).map((k) => {
  //         if (k === "class") {
  //           if (!class_arr.includes(course.class)) {
  //             class_arr.push(course.class);
  //           }
  //         } else if (k === "name") {
  //           if (!course_arr.includes(course.name)) {
  //             course_arr.push(course.name);
  //           }
  //         }
  //         return null;
  //       });

  //       // if (
  //       //   Object.getOwnPropertyNames(course).includes("class") &&
  //       //   course.class !== null
  //       // ) {
  //       //   if (!class_arr.includes(course.class)) {
  //       //     class_arr.push(course.class);
  //       //   }
  //       // }
  //       return null;
  //     });

  //     setSection(class_arr);

  //     setCourse(course_arr);
  //   });
  // };

  const handleClickOpen = (day, course, faculty, time, isTwo) => {
    setDay(day);
    if (time === undefined) {
      setTime("");
      setSelectedCourse("");
      setSelectedFaculty("");
      setTwoSlots(false);
    } else {
      setTime(time);
      setSelectedCourse(course);
      setSelectedFaculty(faculty);
      setTwoSlots(isTwo);
    }

    setOpen(true);
  };

  var cur = 0;
  var rSpan = 0;

  const arr = [];
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const booked = [];

  return (
    <div className="tbl">
      <table>
        <thead>
          <tr>
            <th>Time/Day</th>
            {days.map((day, i) => (
              <th className="day-th" key={i}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timing.map((time) => {
            cur = 0;
            return (
              <tr key={time._id}>
                <th className="time-th">{time.timeslot}</th>

                {schedule.map((sch) => {
                  rSpan = 0;

                  if (sch.timingid === time.timingid) {
                    if (
                      arr.filter(
                        (e) =>
                          e.day === sch.daynumber && e.timing === sch.timingid
                      ).length > 0
                    ) {
                      /* ONLY INCREMENT DAY */
                      cur = cur + 1;
                    } else {
                      if (sch.courseid === 0) {
                        cur = cur + 1;
                        if (sch.timingid === 5 && cur === 5) {
                          booked.push({
                            day: cur,
                            timing: sch.timingid,
                          });
                          return (
                            <td className="break-td" key={sch._id}>
                              <pre>{`NAMAZ BREAK\n${time.timeslot}`}</pre>
                            </td>
                          );
                        } else {
                          if (sch.timingid === 8) {
                            // Do Nothing
                            rSpan = rSpan + 1;
                          } else {
                            for (const next_oh of schedule) {
                              if (
                                next_oh.daynumber === cur &&
                                next_oh.timingid >= sch.timingid
                              ) {
                                if (cur === 5 && next_oh.timingid === 5) {
                                  return (
                                    <td
                                      rowSpan={rSpan}
                                      onClick={() => {
                                        handleClickOpen(sch.daynumber);
                                      }}
                                      key={sch._id}
                                    >
                                      O-H
                                    </td>
                                  );
                                } else {
                                  if (next_oh.courseid !== 0) {
                                    break;
                                  } else {
                                    rSpan = rSpan + 1;

                                    arr.push({
                                      day: next_oh.daynumber,
                                      timing: next_oh.timingid,
                                    });
                                  }
                                }
                                if (cur === 5 && next_oh.timingid === 5) {
                                  break;
                                }
                              }
                            }
                          }
                          if (cur === 5 && sch.timingid === 5) {
                          } else {
                            return (
                              <td
                                rowSpan={rSpan}
                                onClick={() => {
                                  handleClickOpen(sch.daynumber);
                                }}
                                key={sch._id}
                              >
                                O-H
                              </td>
                            );
                          }
                        }
                      } else {
                        if (sch.timingid === 8) {
                          booked.push({
                            day: sch.daynumber,
                            timing: sch.timingid,
                          });
                          return (
                            <td
                              onClick={() => {
                                handleClickOpen(
                                  sch.daynumber,
                                  sch.course.courseid,
                                  sch.faculty.facultyid,
                                  sch.timingid
                                );
                              }}
                              key={sch._id}
                            >
                              <pre>
                                {`${sch.course.class}\n${sch.course.name}\n${sch.faculty.facultyname}\n${sch.timing.timeslot}\n(${sch.course.studentcount})`}
                              </pre>
                            </td>
                          );
                        } else {
                          cur = cur + 1;

                          return schedule.map((next) => {
                            var isTwo = false;
                            if (
                              next.daynumber === cur &&
                              next.timingid === time.timingid + 1
                            ) {
                              if (next.courseid !== 0) {
                                if (next.courseid === sch.courseid) {
                                  isTwo = true;

                                  arr.push({
                                    day: next.daynumber,
                                    timing: next.timingid,
                                  });

                                  booked.push({
                                    day: sch.daynumber,
                                    timing: sch.timingid,
                                  });
                                  booked.push({
                                    day: next.daynumber,
                                    timing: next.timingid,
                                  });

                                  return (
                                    <td
                                      onClick={() => {
                                        handleClickOpen(
                                          sch.daynumber,
                                          sch.course.courseid,
                                          sch.faculty.facultyid,
                                          sch.timingid,
                                          isTwo
                                        );
                                      }}
                                      rowSpan="2"
                                      key={sch._id}
                                    >
                                      <pre>
                                        {`${next.course.class}\n${
                                          next.course.name
                                        }\n${
                                          next.faculty.facultyname
                                        }\n${sch.timing.timeslot.substr(
                                          0,
                                          7
                                        )}${next.timing.timeslot.substr(7)}\n(${
                                          sch.course.studentcount
                                        })`}
                                      </pre>
                                    </td>
                                  );
                                } else {
                                  booked.push({
                                    day: sch.daynumber,
                                    timing: sch.timingid,
                                  });
                                  return (
                                    <td
                                      onClick={() => {
                                        handleClickOpen(
                                          sch.daynumber,
                                          sch.course.courseid,
                                          sch.faculty.facultyid,
                                          sch.timingid,
                                          isTwo
                                        );
                                      }}
                                      key={sch._id}
                                    >
                                      <pre>
                                        {`${sch.course.class}\n${sch.course.name}\n${sch.faculty.facultyname}\n${sch.timing.timeslot}\n(${sch.course.studentcount})`}
                                      </pre>
                                    </td>
                                  );
                                }
                              } else {
                                booked.push({
                                  day: sch.daynumber,
                                  timing: sch.timingid,
                                });

                                return (
                                  <td
                                    onClick={() => {
                                      handleClickOpen(
                                        sch.daynumber,
                                        sch.course.courseid,
                                        sch.faculty.facultyid,
                                        sch.timingid,
                                        isTwo
                                      );
                                    }}
                                    key={sch._id}
                                  >
                                    <pre>
                                      {`${sch.course.class}\n${sch.course.name}\n${sch.faculty.facultyname}\n${sch.timing.timeslot}\n(${sch.course.studentcount})`}
                                    </pre>
                                  </td>
                                );
                              }
                            }

                            return null;
                          });
                        }
                      }
                    }
                  }
                  return null;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <UpdateDialog
        open={open}
        time={time}
        setTime={setTime}
        selectedCourse={selectedCourse}
        selectedFaculty={selectedFaculty}
        setSelectedCourse={setSelectedCourse}
        setSelectedFaculty={setSelectedFaculty}
        setOpen={setOpen}
        bool={bool}
        setBool={setBool}
        timing={timing}
        booked={booked}
        day={day}
        twoSlots={twoSlots}
      />
      {/* <div>
        <pre>{JSON.stringify(selectedCourse, null, 2)}</pre>
      </div> */}
    </div>
  );
}

export default TimeTable;
