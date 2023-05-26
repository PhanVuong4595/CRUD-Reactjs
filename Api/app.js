import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

const app = express();

// middleware
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

//schema
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    mobile: Number,
  },
  { timestamps: true }
);

const userSchema = mongoose.model("user", UserSchema);

//read
app.get("/user", async (req, res) => {
  const data = await userSchema.find({});

  res.json({ success: true, data: data });
});

// Detail
app.get("/user/:id", async (req, res) => {
  const category = await userSchema.findOne({ _id: req.params.id }).exec();

  res.json({ success: true, data: category });
});

//create data

app.post("/user/add", async (req, res) => {
  const data = new userSchema(req.body);
  await data.save();

  res.send({ success: true, data: data, message: "data save success" });
});

//update data

app.put("/user/:id", async (req, res) => {
  try {
    const category = await userSchema
      .findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
      })
      .exec();
    res.send({
      success: true,
      data: category,
      message: "data update success",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Không sửa được!" });
  }
});

app.delete("/user/:id", async (req, res) => {
  const id = req.params.id;

  const data = await userSchema.deleteOne({ _id: id });
  res.send({ success: true, data: data, message: "data delete success" });
});

// connect database
mongoose
  .set("strictQuery", true)
  .connect("mongodb://127.0.0.1:27017/crud")
  .then(() => console.log("Kết nối db thành công"))
  .catch((error) => console.log(error));

// connection
const PORT = 8000;
app.listen(PORT, () => {
  console.log("Server is running port", PORT);
});
