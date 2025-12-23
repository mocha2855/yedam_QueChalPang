//surveyRouter.js
const express = require("express");
const router = express.Router();
const surveyService = require("../services/surveyService.js");

//survey 전체조회(active 활성된 것만 불러옴)
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

//survey 등록
router.post(`/surveys`, async (req, res) => {
  const data = req.body;
  let result = await surveyService.addSurvey(data);
  res.send(result);
});

//survey 수정
router.put(`/survey/:no`, async (req, res) => {
  const data = req.body;
  const no = req.params.no;
  let result = await surveyService.modifySurvey(no, data);
  res.send(result);
});

module.exports = router;
