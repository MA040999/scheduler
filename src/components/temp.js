import app from "../axiosConfig";
import React from "react";
import { useEffect, useState } from "react";
import UpdateDialog from "./UpdateDialog";

function TimeTable() {
  const [day, setDay] = useState([]);
  const [slot, setSlot] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getSchedule();
  }, []);

  let getSchedule = () => {
    app.get("/api/lab/").then((res) => {
      console.log("res.data :>> ", res.data);
      let [days, slots, sch] = res.data;
      setDay(days);
      setSlot(slots);
      setSchedule(sch);
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  var cur = 0;
  var rSpan = 0;
  const day_arr = [];
  const slot_arr = [];

  return (
    <div className="tbl">
      <table>
        <thead>
          <tr>
            <th>Time/Day</th>
            {day.map((d) => (
              <th key={d._id}>{d.dayname}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slot.map((s) => {
            cur = 0;
            return (
              <tr key={s._id}>
                <th>{s.timing}</th>

                {schedule.map((sch) => {
                  rSpan = 0;
                  if (sch.slotid === s.slotid) {
                    if (
                      slot_arr.includes(sch.slotid) &&
                      day_arr.includes(sch.dayid)
                    ) {
                    } else {
                      if (sch.courseid === 0) {
                        cur = cur + 1;

                        for (const next_oh of schedule) {
                          if (
                            next_oh.dayid === cur &&
                            next_oh.slotid >= sch.slotid
                          ) {
                            if (next_oh.courseid !== 0) {
                              break;
                            } else {
                              rSpan = rSpan + 1;
                              day_arr.push(next_oh.dayid);
                              slot_arr.push(next_oh.slotid);
                            }
                          }
                        }

                        return (
                          <td
                            rowSpan={rSpan}
                            onClick={handleClickOpen}
                            key={sch._id}
                          >
                            O-H
                          </td>
                        );
                      } else {
                        if (sch.slotid === 7) {
                          return (
                            <td key={sch._id}>
                              <pre>
                                {`${sch.course.sectionname}\n${sch.course.coursename}\n${sch.course.faculty}\n${sch.slot.timing}`}
                              </pre>
                            </td>
                          );
                        } else {
                          cur = cur + 1;
                          return schedule.map((next) => {
                            if (
                              next.dayid === cur &&
                              next.slotid === s.slotid + 1
                            ) {
                              if (next.courseid !== 0) {
                                if (next.courseid === sch.courseid) {
                                  day_arr.push(next.dayid);
                                  slot_arr.push(next.slotid);

                                  return (
                                    <td rowSpan="2" key={sch._id}>
                                      <pre>
                                        {`${next.course.sectionname}\n${
                                          next.course.coursename
                                        }\n${
                                          next.course.faculty
                                        }\n${sch.slot.timing.substr(
                                          0,
                                          7
                                        )}${next.slot.timing.substr(7)}`}
                                      </pre>
                                    </td>
                                  );
                                }
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
      <UpdateDialog open={open} handleClose={handleClose} />
      {/* <div>
        <pre>{JSON.stringify(day_arr, null, 2)}</pre>
      </div> */}
    </div>
  );
}

export default TimeTable;
