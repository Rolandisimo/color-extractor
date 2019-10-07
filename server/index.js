const compression = require('compression')
const express = require('express')
const bodyParser = require("body-parser");
const child_process = require("child_process");
const morgan = require("morgan");
const morganBody = require("morgan-body");
const cors = require("cors");
const formatStringAsStringifiedJson = require("./utils");

const app = express()

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(compression())
app.use(morgan("combined"));
if (process.env.NODE_ENV === "development") {
  morganBody(app);
}

app.use("/colors", (req, res) => {
  child_process.exec(`cd colors_env && source bin/activate && python get_image_colors.py ${req.body.url}`, {
    maxBuffer: 1024 * 10000,
    encoding: "buffer",
  }, (error, stdout, stderr) => {
    if (error) {
      return res.json([error]);
    }

    try {
      const jsonStringified = formatStringAsStringifiedJson(stdout.toString());
      return res.json(JSON.parse(jsonStringified));
    } catch (error) {
      return res.json([error.message]);
    }
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
