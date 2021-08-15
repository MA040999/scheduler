const db = require("../models");

exports.getCourses = (req, res) => {
  db.Course.aggregate([
    {
      $sort: { name: 1 },
    },
    {
      $lookup: {
        from: "facultys",
        localField: "facultyid",
        foreignField: "facultyid",
        as: "faculty",
      },
    },
    {
      $unwind: "$faculty",
    },
  ]).then((courses) => {
    res.status(200).json(courses);
  });
};

exports.update = async (req, res) => {
  let result;

  if (req.body.time2 === null) {
    result = await db.Relation.updateOne(
      { timingid: req.body.time, daynumber: req.body.day },
      {
        $set: {
          facultyid: req.body.faculty,
          courseid: req.body.course,
        },
      }
    );
  } else {
    result = await db.Relation.updateMany(
      {
        daynumber: req.body.day,
        $or: [{ timingid: req.body.time1 }, { timingid: req.body.time2 }],
      },
      {
        $set: {
          facultyid: req.body.faculty,
          courseid: req.body.course,
        },
      }
    );
  }

  res.status(200).json(result);
};

exports.getSchedule = (req, res) => {
  Promise.all([
    db.Timing.find().sort({ timingid: 1 }),
    db.Relation.aggregate([
      {
        $sort: { timingid: 1, daynumber: 1 },
      },

      {
        $lookup: {
          from: "courses",
          localField: "courseid",
          foreignField: "courseid",
          as: "course",
        },
      },
      {
        $unwind: { path: "$course", preserveNullAndEmptyArrays: true },
      },

      {
        $lookup: {
          from: "facultys",
          localField: "facultyid",
          foreignField: "facultyid",
          as: "faculty",
        },
      },
      {
        $unwind: { path: "$faculty", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "timings",
          localField: "timingid",
          foreignField: "timingid",
          as: "timing",
        },
      },
      {
        $unwind: "$timing",
      },
    ]),
  ]).then(([timings, sch]) => {
    res.status(200).json([timings, sch]);
  });
};
