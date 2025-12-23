// boardRouter.js
const express = require("express");
const router = express.Router();
const boardService = require("../services/applicationServiceJH.js");

router.get(`/application/:no`, async (req, res) => {
  let no = req.params.no;
  let post = await boardService.findById(no);
  res.send(post);
});

router.get(`/rejectApplication`, async (req, res) => {
  let no = req.params.no;
  let post = await boardService.rejectorFindById(no);
  res.send(post);
});

module.exports = router;
