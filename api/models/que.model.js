import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    correctOption: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return this.options.includes(value);
        },
        message: (props) =>
          `${props.value} is not a valid answer! It must match one of the options`,
      },
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
