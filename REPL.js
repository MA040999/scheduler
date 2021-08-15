const db = require("./models");

db.Faculty.find()
  .then((course) => console.log(course))
  .catch((error) => console.log(error));

// db.LabSchedule.aggregate([
//   {
//     $sort: { schid: 1 },
//   },
//   {
//     $lookup: {
//       from: "courses",
//       localField: "courseid",
//       foreignField: "courseid",
//       as: "course",
//     },
//   },
//   {
//     $unwind: { path: "$course", preserveNullAndEmptyArrays: true },
//   },
//   {
//     $lookup: {
//       from: "days",
//       localField: "dayid",
//       foreignField: "dayid",
//       as: "day",
//     },
//   },
//   {
//     $unwind: "$day",
//   },
//   {
//     $lookup: {
//       from: "slots",
//       localField: "slotid",
//       foreignField: "slotid",
//       as: "slot",
//     },
//   },
//   {
//     $unwind: "$slot",
//   },
// ]).then((course) => console.log(course));
