const mysql = require("../database/mapper.js");

const notificationService = {
  // 권한별 알림 개수 가져오기
  getNotificationCount: async (userId, userAuth) => {
    let count = 0;

    try {
      if (userAuth === "a1") {
        // 일반사용자
        const reservations = await mysql.notificationQuery(
          "getConfirmedReservationsCount",
          userId
        );
        const applications = await mysql.notificationQuery(
          "getApprovedApplicationsCount",
          userId
        );
        count = (reservations[0]?.cnt || 0) + (applications[0]?.cnt || 0);
      } else if (userAuth === "a2") {
        // 담당자 - manager_main 또는 manager_sub 둘 다 체크
        const plans = await mysql.notificationQuery(
          "getManagerPendingPlansCount",
          [userId, userId] // 두 번 넣어줘야 함 (OR 조건이라서)
        );
        const reservations = await mysql.notificationQuery(
          "getManagerPendingReservationsCount",
          userId
        );
        count = (plans[0]?.cnt || 0) + (reservations[0]?.cnt || 0);
      } else if (userAuth === "a3" || userAuth === "a4") {
        // 관리자 / 시스템관리자
        const applications = await mysql.notificationQuery(
          "getAllPendingApplicationsCount"
        );
        count = applications[0]?.cnt || 0;
      }
    } catch (error) {
      console.error("알림 개수 계산 중 오류:", error);
      count = 0;
    }

    return count;
  },
  //알림 목록 가져오기
  getNotificationList: async (userId, userAuth) => {
    let notifications = [];

    try {
      if (userAuth === "a1") {
        // 일반사용자
        const reservations = await mysql.notificationQuery(
          "getConfirmedReservationsList",
          userId
        );
        const applications = await mysql.notificationQuery(
          "getApprovedApplicationsList",
          userId
        );
        notifications = [...reservations, ...applications];
      } else if (userAuth === "a2") {
        // 담당자
        const plans = await mysql.notificationQuery(
          "getManagerPendingPlansList",
          [userId, userId]
        );
        const reservations = await mysql.notificationQuery(
          "getManagerPendingReservationsList",
          userId
        );
        notifications = [...plans, ...reservations];
      } else if (userAuth === "a3" || userAuth === "a4") {
        // 관리자
        const applications = await mysql.notificationQuery(
          "getAllPendingApplicationsList"
        );
        notifications = applications;
      }
    } catch (error) {
      console.error("알림 목록 조회 중 오류:", error);
      notifications = [];
    }

    return notifications;
  },
};

module.exports = notificationService;
