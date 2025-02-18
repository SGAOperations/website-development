const mongoose = require('mongoose');

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
  pictureUrl: { type: String, required: true },
  position: { type: String, required: true },
  divisionName: { type: String, 
                  enum: Object.values(DivisionNames),
                  required: true },
  divisionBlurb: { type: String, required: true },
  header: { type: String, required: true },
  blurb: { type: String, required: true },
  links: { type: String, required: false },


});

module.exports = mongoose.model('User', userSchema);