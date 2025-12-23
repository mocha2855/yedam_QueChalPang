//surveyRouter.js
const express = require("express");
const router = express.Router();
const surveyService = require("../services/surveyService.js");

router.get(`/surveys`, async (req, res) => {
  let list = await surveyService.findAll();
  console.log("survey");
  res.send(list);
});
router.get(`/survey/:no`, async (req, res) => {
  let no = req.params.no;
  let post = await surveyService.findByNo(no);
  res.send(post);
});

router.post(`/surveys`, async (req, res) => {
  const data = req.body;
  let result = await surveyService.postSurvey(data);
  res.send(result);
});

router.put(`/survey/:no`, async (req, res) => {
  const data = req.body;
  const no = req.params.no;
  let result = await surveyService.modifySurvey(no, data);
  res.send(result);
});
module.exports = router;
