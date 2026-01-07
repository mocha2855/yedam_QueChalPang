const express = require("express");
const router = express.Router();
const centerService = require("../services/centerService.js");
// 전체 센터 목록
router.get(`/centers`, async (req, res) => {
  const { key, value, badge } = req.query;
  console.log(key, value, badge);
  let list = await centerService.findAllCenter(key, value, badge);
  res.send(list);
});
router.post(`/center`, async (req, res) => {
  const { name, address, tel, email, lunch } = req.body;
  let value = [name, address, tel, email, lunch];
  let result = await centerService.addCenterInfo(value);
  res.send(result);
});
router.get(`/center/:no`, async (req, res) => {
  const no = req.params.no;
  let result = await centerService.findByCenterNo(no);
  res.send(result);
});
router.get(`/center/name/:name`, async (req, res) => {
  const name = req.params.name;
  let result = await centerService.findByCenterName(name);
  res.send(result);
});
router.put(`/center/:no`, async (req, res) => {
  const no = req.params.no;
  const { name, email, address, tel, lunch } = req.body;
  const value = [name, email, address, tel, lunch, no];
  let result = await centerService.modifyByCenterNo(value);
  res.send(result);
});
router.put(`/centerEnd/:no`, async (req, res) => {
  const no = req.params.no;
  let result = await centerService.endCenterByCenterNo(no);
  res.send(result);
});
module.exports = router;
