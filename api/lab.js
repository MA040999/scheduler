const router = require("express").Router();
const controller = require("../controller");

router.get("/", controller.Lab.getSchedule);
router.get("/courses", controller.Lab.getCourses);
router.patch("/update", controller.Lab.update);

module.exports = router;
