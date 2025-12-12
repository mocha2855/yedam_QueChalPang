const express = require("express");
const router = express.Router();

const boardService = require("../services/boardService.js");

// 1. 전체조회
router.get(`/boards`, async (req, res) => {
  let list = await boardService.findAll();
  res.send(list);
});

// 2. 단건조회
router.get(`/boards/:no`, async (req, res) => {
  const bId = req.params.no;
  let info = await boardService.findByBoardId(bId);
  res.send(info);
});

// 댓글 조회
router.get(`/board/:bno`, async (req, res) => {
  const bId = req.params.bno;
  let info = await boardService.findComment(bId);
  res.send(info);
});

// 3. 등록
router.post(`/boards`, async (req, res) => {
  const info = req.body;
  let result = await boardService.addInfo(info);
  console.log(result);
  res.send(result);
});

// 4. 수정
router.put(`/boards/:bno`, async (req, res) => {
  const bId = req.params.bno;
  const info = req.body;
  let result = await boardService.modifyInfo(bId, info);
  res.send(result);
});

// 5. // 게시글 단건삭제 : boards/:bno + DELETE
router.delete(`/boards/:bno`, async (req, res) => {
  const bId = req.params.bno;
  let result = await boardService.removeInfo(bId);
  res.send(result.id);
});

module.exports = router;
