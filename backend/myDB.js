const { connect, Schema, model, set, connection } = require("mongoose");
const { MONGODB_URL } = require("./config/env");



/***********Mongoose Schema*********/
const sessionSchema = new Schema({
  "webId": { 
    type: String, 
    enum: { values: ["SUB001"], message: "{VALUE} is not Valid!" },
    required: [true, "Why no WEB ID?"]
  },
  "currentUrlHost": { type: String, required: [true, "Why no URL Orgin?"] },
  "currentPagePath": { type: String, required: [true, "Why no Page Path?"] },
  "visiOrOpenDateTime": { type: Date, required: [true, "Why no Page Visit Date?"] },
  "timeOnPageInS": {
    type: Number, 
    min: [0, "Negative time duration!"], 
    required: [true, "Why no Time Spent on Page?"]
  },
  "trafficSource": { type: String, required: [true, 'Why no Traffic Source?'] },
  "deviceWidth": { 
    type: Number,
    min: [100, "Screen width too small!"],
    max: [10500, "Screen width so large!"],
    required: [true, 'Why no Device Width?']
  }
});




/**********Mongoose Model*****/
exports.Record = model("Record", sessionSchema);




/********CONNECT DB*******/
exports.connectDB = async () => {
  
  // Mongoose Problem
  // `strictQuery` option will be switched back 
  // to `false` by default in Mongoose 7

  set("strictQuery", false);

  try {
    await connect(MONGODB_URL);
    console.log(`DB connected: ${connection.name}`);
  }
  catch (err) {
    console.error(err);
  }
}