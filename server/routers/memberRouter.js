const express = require("express");
const router = express.Router();
const memberService = require("../services/memberService.js");

//멤버 목록조회
router.get(`/members`, async (req, res) => {
  let list = await memberService.findAllMember();
  res.send(list);
});
//멤버 단건조회(조건 id)
router.get(`/member/:id`, async (req, res) => {
  let id = req.params.id;
  let info = await memberService.findByMemberId(id);
  res.send(info);
});
//멤버 로그인을 위한 일치여부 확인.
router.post(`/member/login`, async (req, res) => {
  let input = req.body;
  let output = await memberService.memberLogIn(input);
  res.send(output);
});
// 회원가입시 중복체크(이메일,아이디만 가능.)
router.get(`/member/:key/:value`, async (req, res) => {
  let key = req.params.key;
  let value = req.params.value;
  let result = await memberService.isExist(key, value);
  res.send(result);
});
router.post(`/member`, async (req, res) => {
  let input = req.body;
  let output = await memberService.addMemberInfo(input);
  res.send(output);
});
module.exports = router;
