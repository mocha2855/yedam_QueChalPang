const express = require("express");
const router = express.Router();
const notificationService = require("../services/notificationService");

// 알림 개수 조회
router.get("/notifications/count", async (req, res) => {
  try {
    // 쿼리 파라미터로 받기
    const userId = req.query.userId;
    const userAuth = req.query.userAuth;

    console.log("userId:", userId, "userAuth:", userAuth);

    const count = await notificationService.getNotificationCount(
      userId,
      userAuth
    );

    res.json({ count });
  } catch (error) {
    console.error("알림 개수 조회 실패:", error);
    res.status(500).json({ error: error.message });
  }
});
// 알림 목록 조회
router.get("/notifications/list", async (req, res) => {
  try {
    const userId = req.query.userId;
    const userAuth = req.query.userAuth;

    console.log("알림 목록 조회 - userId:", userId, "userAuth:", userAuth);

    const notifications = await notificationService.getNotificationList(
      userId,
      userAuth
    );

    res.json({ notifications });
  } catch (error) {
    console.error("알림 목록 조회 실패:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
