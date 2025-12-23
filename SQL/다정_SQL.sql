use project;

show tables;
select * from member;
select * from center;
desc dependant;
select * from dependant;
select * from qna;
select * from qna_answer;
select * from reservation;
select * from meeting_log;
select * from schedule_block;
select * from disability;

select * from survey_title;

ALTER TABLE `center` 
MODIFY `center_end` date NULL;

commit;

ALTER TABLE `dependant`
ADD CONSTRAINT `FK_member_TO_dependant`
FOREIGN KEY (`member_id`)
REFERENCES `member` (`member_id`)
ON DELETE CASCADE
ON UPDATE CASCADE;

commit;



INSERT INTO dependant VALUES 
(3, 1, 'user02', '홍길순', '2018-03-12', 'f1', '서울시 강남구', '2025-12-10', '이정후', NULL),
(4, 3, 'user02', '홍길동', '1995-07-22', 'm1', '서울시 서초구', '2025-12-11', '최강희', '박서준'),
(5, 2, 'user03', '박지민', '2012-11-05', 'm1', '경기도 수원시', '2025-12-15', '김태희', NULL),
(6, 3, 'user04', '최유리', '1990-01-30', 'f1', '부산시 해운대구', '2025-12-20', '정우성', '이영희');
select * from dependant;
commit;

desc center;
select * from center;
INSERT INTO `center` (
    `center_name`, 
    `center_address`, 
    `center_tel`, 
    `center_email`, 
    `center_status`, 
    `center_start`, 
	`center_end`, 
    `center_lunch`
) VALUES 
(
    '강남 복지 지원센터', 
    '서울시 강남구 테헤란로 123', 
    '02-123-4567', 
    'gangnam@center.or.kr', 
    'b1', 
    '2024-01-01', 
    NULL,
    '12:00:00'
),
(
    '해운대 가족 케어센터', 
    '부산시 해운대구 달맞이길 50', 
    '051-987-6543', 
    'haeundae@center.or.kr', 
    'b1', 
    '2024-03-15', 
    NULL,
    '13:00:00'
);

commit;

select * from member;
INSERT INTO `member` (
    `member_id`, 
    `member_phone`, 
    `member_pass`, 
    `member_name`, 
    `member_address`, 
    `member_email`, 
    `member_authority`, 
    `member_date`, 
    `member_confirm`, 
    `center_no`
) VALUES 
('user02', '010-2222-2222', 'password123!', '이미자', '서울시 강남구 테헤란로 12', 'lee@example.com', 'u1', NOW(), 'e1', 1),
('user03', '010-3333-3333', 'password123!', '박지민', '경기도 수원시 영통구', 'park@example.com', 'u1', NOW(), 'e1', 1),
('user04', '010-4444-4444', 'password123!', '최유리', '부산시 해운대구 우동', 'choi@example.com', 'u1', NOW(), 'e1', 2),
('user05', '010-5555-5555', 'password123!', '김민재', '인천시 남동구 구월동', 'kim@example.com', 'u1', NOW(), 'e1', 1),
('user06', '010-6666-6666', 'password123!', '정수연', '대구시 수성구 범어동', 'jung@example.com', 'u1', NOW(), 'e1', 3);
commit;

select * from member;
select * from dependant;

select * from application;
delete from application where application_no between 9 and 12;

desc application;

-- application 데이터삽입
INSERT INTO application (dependant_no, survey_no, member_id, application_date, status) VALUES
(1, 1, 'user01', '2025-12-23 09:00:00', 'e1'),
(2, 2, 'user01', '2025-12-23 09:05:00', 'e1'),
(3, 1, 'user02', '2025-12-23 09:10:00', 'e1'),
(4, 3, 'user02', '2025-12-23 09:15:00', 'e2'),
(5, 2, 'user03', '2025-12-23 09:20:00', 'e1'),
(6, 1, 'user04', '2025-12-23 09:25:00', 'e1'),
(3, 2, 'user02', '2025-12-24 10:00:00', 'e1');


-- reservation 데이터삽입
select * from reservation;
INSERT INTO reservation
(resv_id, dependant_no, application_no, guardian_id, manager_id, created_at, resv_day, start_at, end_at, resv_status, reject_reason)
VALUES
(1, 1, 13, 'user01', 'teacher01', '2025-12-23 10:30:00','2025-12-26', '2025-12-26 10:00:00', '2025-12-26 11:00:00', 'f1', NULL),
(2, 2, 14, 'user01', 'teacher01', '2025-12-23 10:35:00','2025-12-26', '2025-12-26 11:00:00', '2025-12-26 12:00:00', 'f2', NULL),
(3, 3, 15, 'user02', 'teacher01', '2025-12-23 10:40:00','2025-12-27', '2025-12-27 14:00:00', '2025-12-27 15:00:00', 'f1', NULL),
(4, 4, 16, 'user02', 'teacher01', '2025-12-23 10:45:00','2025-12-27', '2025-12-27 15:00:00', '2025-12-27 16:00:00', 'f4','시간 조율이 필요합니다. 다른 시간으로 신청해 주세요.'),
(5, 5, 17, 'user03', 'teacher01', '2025-12-24 09:10:00','2025-12-30', '2025-12-30 13:00:00', '2025-12-30 14:00:00', 'f3', NULL),
(6, 6, 18, 'user04', 'teacher01', '2025-12-24 09:15:00','2025-12-31', '2025-12-31 16:00:00', '2025-12-31 17:00:00', 'f1', NULL),
(7, 3, 19, 'user02', 'teacher01', '2025-12-24 10:30:00','2026-01-02', '2026-01-02 10:00:00', '2026-01-02 11:00:00', 'f2', NULL);


SELECT
  g.member_name    AS guardian_name,
  d.dependant_name AS dependant_name,    
  r.start_at       AS start_at,
  r.manager_id
FROM reservation r
JOIN member g
  ON g.member_id = r.guardian_id
JOIN dependant d
  ON d.dependant_no = r.dependant_no
WHERE r.manager_id = 'teacher01'
  AND DAY(resv_day) = '27'
ORDER BY r.start_at ASC;

 SELECT 
    g.member_name    AS guardian_name,
    d.dependant_name AS dependant_name,
    r.resv_status,
    r.start_at       AS start_at,
    r.manager_id
  FROM reservation r
  JOIN member g
    ON g.member_id = r.guardian_id
  JOIN dependant d
        ON d.dependant_no = r.dependant_no
where resv_status='f1'
AND manager_id='teacher01';

commit;
