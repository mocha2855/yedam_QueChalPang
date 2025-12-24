const express = require("express");
const router = express.Router();
const centerService = require("../services/centerService.js");
// 전체 센터 목록
router.get(`/centers`, async (req, res) => {
  const { key, value } = req.query;
  let list = await centerService.findAllCenter(key, value);
  res.send(list);
});
router.post(`/center`, async (req, res) => {
  const { name, address, tel, email, lunch } = req.body;
  let value = [name, address, tel, email, lunch];
  let result = await centerService.addCenterInfo(value);
  res.send(result);
});
module.exports = router;
