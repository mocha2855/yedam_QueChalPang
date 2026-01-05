const express = require("express");
const router = express.Router();
const mypageService = require("../services/mypageService.js");

// 담당자 정보
router.get(`/managerInfo/:id`, async (req, res) => {
  let id = req.params.id;
  let post = await mypageService.findManagerById(id);
  res.send(post);
});

module.exports = router;
