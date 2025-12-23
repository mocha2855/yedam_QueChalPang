// commentRouter.js
const express = require("express");
const router = express.Router();
const commentService = require("../services/commentService.js");

router.get(`/comments/:bno`, async (req, res) => {
  const bno = req.params.bno;
  let list = await commentService.findComments(bno);
  res.send(list);
});
router.get(`/comment/test`, async (req, res) => {
  let list = await commentService.test();
  res.send(list);
});

module.exports = router;
