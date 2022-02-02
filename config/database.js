const mongoose = require('mongoose');

const dbConnect = async () => {
  await mongoose.connect(process.env.MONGO_URL); // add your Mongo URL in dotenv file
  const db = mongoose.connection;
  console.log(`Connected to DB: ${db.name} at ${db.host}`);
};

module.exports = { dbConnect };
