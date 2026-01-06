show tables;
-- ###############################
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE qna_answer;
TRUNCATE TABLE qna;

SET FOREIGN_KEY_CHECKS = 1;
-- ###############################

select * from qna;
select * from qna_answer;
select * from qna
where member_id='user01';
select * from member;

   SELECT
  q.qna_title,
  q.qna_content,
  q.member_id AS author,
  m.member_name AS author_name,
  a.member_id AS respondent,
  q.qna_date AS date,
  q.qna_category AS category,
  dm.manager_main AS manager_id,
  m.member_name AS manager_name,
  m.member_phone AS manager_phone,
  m.member_email AS manager_email,
  q.qna_status AS status
FROM qna q
LEFT JOIN qna_answer a
  ON q.qna_no = a.qna_no
LEFT JOIN (
  SELECT member_id, MAX(manager_main) AS manager_main
  FROM dependant
  GROUP BY member_id
) dm
  ON q.member_id = dm.member_id
LEFT JOIN member m
  ON m.member_id = dm.manager_main
WHERE q.member_id = 'user01'
ORDER BY q.qna_date DESC;

alter table qna add qna_manager_id varchar(100);

select * from dependant;
select * from qna;
desc qna;

-- fk추가!!!! 
ALTER TABLE qna
ADD CONSTRAINT fk_qna_member
FOREIGN KEY (member_id)
REFERENCES member(member_id);

ALTER TABLE qna MODIFY member_id varchar(100) NOT NULL;
ALTER TABLE qna MODIFY qna_date datetime NOT NULL;
ALTER TABLE qna MODIFY qna_title varchar(100) NOT NULL;
ALTER TABLE qna MODIFY qna_content varchar(1000) NOT NULL;

select * from member;
select * from reservation;
select * from application;
select * from dependant;
select * from meeting_log;
select * from planning;

UPDATE member
SET member_authority = 'a1'
WHERE member_authority = 'u1';

SELECT
 r.resv_id 			AS resv_id,
 r.application_no 	AS application_no,
 r.dependant_no 	AS dependant_no,
 d.dependant_name 	AS dependant_name,
 r.guardian_id		AS guardian_id, 
 r.start_at			AS resv_day,
 r.start_at 		AS start_at,
 r.resv_status 		AS resv_status,
 r.reject_reason 	AS reject_reason
FROM reservation r
JOIN dependant d ON r.dependant_no = d.dependant_no
WHERE application_no=20
ORDER BY start_at DESC;


INSERT INTO meeting_log
(
  log_id,
  resv_id,
  member_id,
  log_title,
  log_content,
  log_date,
  attachment_no
)
VALUES
-- resv_id = 37 (2025-12-29 상담)
(
  1,
  37,
  'teacher01',
  '1회차 초기 상담',
  '지원자 김이박에 대한 첫 상담을 진행함.
가정 환경과 현재 발달 상태를 중심으로 면담을 진행했으며,
센터 직접 방문 상담으로 보호자와 충분한 논의를 진행함.
추후 지속적인 관찰과 지원계획 수립이 필요하다고 판단됨.',
  '2025-12-29 14:30:00',
  NULL
),

-- resv_id = 38 (2025-12-21 상담)
(
  2,
  38,
  'teacher01',
  '사전 상담 및 기초 평가',
  '본 상담은 초기 사전 상담 단계로,
지원자의 기본 정보 확인 및 보호자 요청 사항을 청취함.
향후 정기 상담 일정에 대한 안내를 완료하였으며,
지원신청서 검토 후 다음 상담을 예약함.',
  '2025-12-21 12:00:00',
  NULL
);

UPDATE planning 
SET planning_status = 'i2'
WHERE planning_no = 67;

select * from planning;
select * from application;

desc member;
desc planning;