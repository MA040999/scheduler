const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === "production";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: isProduction ? process.env.DOMAIN : "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/lab/", require("./api/lab"));

if (isProduction) {
  // express will serve up production assets
  app.use(express.static(path.join(__dirname, "build")));

  // express will serve up the front-end index.html file if it doesn't recognize the route
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, `build/index.html`))
  );
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
