// boardRouter.js
const express = require("express");
const router = express.Router();
const boardService = require("../services/applicationServiceJH.js");

router.get(`/boards`, async (req, res) => {
  let list = await boardService.findAll();
  console.log("board");
  console.log("list", list);
  res.send(list);
});
router.get(`/boards/:no`, async (req, res) => {
  let no = req.params.no;
  let post = await boardService.findById(no);
  res.send(post);
});
router.post(`/boards`, async (req, res) => {
  const data = req.body;
  let result = await boardService.postBoard(data);
  res.send(result);
});
router.put(`/boards/:no`, async (req, res) => {
  const data = req.body;
  const no = req.params.no;
  let result = await boardService.modifyBoard(no, data);
  res.send(result);
});
router.delete(`/boards/:no`, async (req, res) => {
  const no = req.params.no;
  console.log(no);
  let result = await boardService.removeBoard(no);
  res.send(result);
});

module.exports = router;
