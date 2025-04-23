const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const DivisionNames = Object.freeze({
  OFFICE_OF_THE_PRESIDENT: "Office of the President",
  SENATE: "Senate",
  ACADEMIC_AFFAIRS: "Academic Affairs",
  CAMPUS_AFFAIRS: "Campus Affairs",
  STUDENT_SUCCESS: "Student Success",
  DIVERSITY_EQUITY_INCLUSION: "Diversity, Equity, and Inclusion",
  EXTERNAL_AFFAIRS: "External Affairs",
  STUDENT_INVOLVEMENT: "Student Involvement",
  OPERATIONAL_AFFAIRS: "Operational Affairs",
  FINANCE_BOARD: "Finance Board",
  ELECTIONS_BOARD: "Elections Board",
  OPERATIONAL_APPEALS_BOARD: "Operational Appeals Board",
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false, unique: true, sparse: true},
  password: { type: String, required: false },
  isAdmin: { type: Boolean, default: false },
  pictureUrl: { type: String, required: false },
  positions: [{
    title: { type: String, required: false },
    divisionName: { 
      type: String, 
      enum: Object.values(DivisionNames),
      required: true
    },
    role: { 
      type: String,
      enum: ['leader', 'member', 'committee', 'board', 'workingGroup'],
      required: true
    },
    blurb: { type: String, required: false },
    links: { type: String, required: false },
  }],
  displayOrder: { type: Number, default: 0 },
  blurb: { type: String, required: false },
  links: { type: String, required: false },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Compound index to ensure unique position entries per member
userSchema.index({ name: 1, "positions.divisionName": 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

User.syncIndexes().catch(err => console.error("Index sync error:", err));

module.exports = User;
