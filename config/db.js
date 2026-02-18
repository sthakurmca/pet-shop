const mongoose = require("mongoose");

// console.log("NODE_ENV :", process.env.NODE_ENV);
const url = process.env.DB_URL;
mongoose
  .connect(url)
  .then(() => {
    console.log(`Mongodb connected`);
  })
  .catch((err) => {
    console.log("MongoDb Error : ", err);
    console.error(`MongoDB Connection Error: ${err}`);
  });

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Connection is open");
});

// module.exports = connection;
