const compression = require('compression')
const express = require('express')
const bodyParser = require("body-parser");
const spawn = require("child_process").spawn;
const morgan = require("morgan");
const morganBody = require("morgan-body");
const cors = require("cors");
const app = express()

app.use(cors());

app.use(compression())
app.use(morgan("combined"));
morganBody(app);

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

app.use("/colors", (req, res) => {
  const pyProg = spawn(
    "python3",
    ["./colors/test.py", req.body.url],
  );

  const chunks = [];

  pyProg.stdout.on("data", function(data) {
    chunks.push(data);
  });
  // pyProg.stderr.on("data", function(data) {
  //   console.log("DATA ERROR", data)
  //   // chunks.push(data);
  // });
  // pyProg.stderr.on("end", function(data) {
  //   console.log("DATA ERROR END", data)
  //   // chunks.push(data);
  // });

  pyProg.stdout.on("end", () => {
    try {
      const finalBuffer = Buffer.concat(chunks)
      const jsonStringified = finalBuffer.toString().replace(/\'/g, "\"");
      return res.json(JSON.parse(jsonStringified));
    } catch (error) {
      return res.json([error.message]);
    }
  });
})


app.listen(3001, () => {
  console.log("Server running")
})
