//routers/meetingLogRouter.js
const express = require("express");
const router = express.Router();
const meetingLogService = require("../services/meetingLogService");

//[1] 담당자 미팅로그 작성
router.post("/meetingLog", async (req, res) => {
  try {
    const { resv_id, member_id, log_title, log_content } = req.body;
    console.log(req.body);

    // 필수값 체크
    if (!resv_id || !member_id || !log_title || !log_content) {
      return res.status(400).json({
        message: "missing fields",
        required: ["resv_id", "member_id", "log_title", "log_content"],
      });
    }

    await meetingLogService.addMeetingLog({
      resv_id,
      member_id,
      log_title,
      log_content,
    });

    // 등록 후 상세 다시 내려주면 프론트가 바로 오른쪽 갱신하기 편함
    const detail = await meetingLogService.findLogDetailByResvId(resv_id);
    return res.status(201).json(detail);
  } catch (err) {
    if (err.status === 409) {
      return res.status(409).json({ message: "meeting_log already exists" });
    }
    console.error("[addMeetingLog] ERROR:", err);
    return res.status(500).json({ message: "server error" });
  }
});

//[2] 해당 지원자의 지원신청서 앞으로 작성된 미팅로그 조회
router.get("/logByAppNo/:appNo", async (req, res) => {
  try {
    console.log("[logByAppNo] params:", req.params);
    const { appNo } = req.params;

    const rows = await meetingLogService.findLogbyAppNo(appNo);
    res.json(rows);
  } catch (err) {
    console.error("[logByAppNo] ERROR:", err);
    res.status(500).json({ message: "Server error", error: String(err) });
  }
});

//[3] 상담일지 상세 조회 (resv_id 기준)
router.get("/meetingLogDetail/:resvId", async (req, res) => {
  try {
    const { resvId } = req.params;
    const row = await meetingLogService.findLogDetailByResvId(resvId);
    res.json(row);
  } catch (err) {
    console.error("[meetingLogDetail] ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 상담일지 작성시 상담확정으로 변경(260108_JH)
router.put("/reserveStatusChange/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const row = await meetingLogService.modifyreserveStatus(id);
    res.send(row);
  } catch (err) {
    console.error(("[modifyreserveStatus] ERROR:", err));
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
