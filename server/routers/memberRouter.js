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
//회원가입
router.post(`/member`, async (req, res) => {
  let input = req.body;
  let output = await memberService.addMemberInfo(input);
  res.send(output);
});
// 인증번호 발송
router.post(`/authenticate`, async (req, res) => {
  let input = req.body;
  console.log("input", input);
  let output = await memberService.phoneAuth(input);
  console.log(output);
  res.send(output);
});
// 인증번호 일치여부 확인
router.post(`/authenticate/:id`, async (req, res) => {
  let id = req.params.id;
  let num = req.body.auth;
  let result = await memberService.getAuth(id, num);
  console.log(result);
  res.send(result);
});
// 이름,전화번호에 맞는 계정 존재여부 확인
router.get("/member/:name/:phone/:way", async (req, res) => {
  const { name, phone, way } = req.params;
  let result = await memberService.searchId(name, phone, way);
  res.send(result);
});
// 비밀번호 재설정
router.put("/modifyMemberPass", async (req, res) => {
  const { id, password } = req.body;
  let result = await memberService.updatePassword(id, password);
  res.send(result);
});

// 승인 관리 라우터 추가

// 승인 관리 목록 조회
router.get(`/members/approval`, async (req, res) => {
  let list = await memberService.getApprovalList();
  res.send(list);
});

// 승인 처리
router.post(`/member/:id/approve`, async (req, res) => {
  let id = req.params.id;
  let result = await memberService.approveMember(id);
  res.send(result);
});

// 승인 대기 건수
router.get(`/members/approval/count`, async (req, res) => {
  let count = await memberService.getPendingCount();
  res.send({ count });
});
// 지원자 목록조회
router.get(`/dependant/:id/:authority`, async (req, res) => {
  let { id, authority } = req.params;
  let result = await memberService.findDependants(id, authority);
  res.send(result);
});

// 승인 거절 처리
router.post(`/member/:id/reject`, async (req, res) => {
  let id = req.params.id;
  let result = await memberService.rejectMember(id);
  res.send(result);
});

// 승인 거절 건수
router.get(`/members/rejected/count`, async (req, res) => {
  let count = await memberService.getRejectedCount();
  res.send({ count });
});
module.exports = router;
