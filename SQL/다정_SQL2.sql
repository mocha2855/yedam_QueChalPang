use project;

set autocommit=0;

select * from reservation;
delete from reservation;

select * from member;
select * from dependant;
desc dependant;

INSERT INTO dependant VALUES (7, 3,'user06', '박해운', '2005-08-15', 'm1', '부산시 해운대구', now(),'teacher02', NULL);

INSERT INTO application ( application_no, dependant_no, survey_no, member_id, application_date, status) 
VALUES (4, 7, 1, 'user06', NOW(),'e1');

UPDATE member 
SET center_no = 3
WHERE member_id IN ('user+04');

ALTER TABLE dependant 
ADD CONSTRAINT fk_manager_main 
FOREIGN KEY (manager_main) REFERENCES member(member_id);

ALTER TABLE dependant 
ADD CONSTRAINT fk_manager_sub 
FOREIGN KEY (manager_sub) REFERENCES member(member_id);

select * from application;
select * from member;
select * from reservation;
desc reservation;

INSERT INTO reservation (
    dependant_no, 
    application_no, 
    guardian_id, 
    manager_id, 
    created_at, 
    resv_day, 
    start_at, 
    end_at, 
    resv_status
) VALUES 
-- 1. 홍이동 (dependant 1 / user01 / Center 1) -> teacher01
(1, 13, 'user01', 'teacher01', NOW(), '2025-12-26', '2025-12-26 10:00:00', '2025-12-26 11:00:00', 'f1'),

-- 2. 홍이동 (dependant 2 / user02 / Center 1) -> teacher04 (Center 1의 다른 선생님)
(2, 15, 'user02', 'teacher04', NOW(), '2025-12-26', '2025-12-26 13:00:00', '2025-12-26 14:00:00', 'f1'),

-- 3. 홍길순 (dependant 3 / user03 / Center 1) -> teacher01
(3, 17, 'user03', 'teacher01', NOW(), '2025-12-27', '2025-12-27 10:00:00', '2025-12-27 11:00:00', 'f1'),

-- 4. 홍길동 (dependant 4 / user04 / Center 2) -> teacher03
(4, 18, 'user04', 'teacher03', NOW(), '2025-12-27', '2025-12-27 14:00:00', '2025-12-27 15:00:00', 'f1'),

-- 5. 박지민 (dependant 5 / user05 / Center 1) -> teacher04
(5, 17, 'user05', 'teacher04', NOW(), '2025-12-28', '2025-12-28 10:00:00', '2025-12-28 11:00:00', 'f1'),

-- 6. 최유리 (dependant 6 / user06 / Center 3) -> teacher02
(6, 4, 'user06', 'teacher02', NOW(), '2025-12-28', '2025-12-28 15:00:00', '2025-12-28 16:00:00', 'f1'),

-- 7. 박해운 (dependant 7 / user06 / Center 3) -> teacher02
(7, 4, 'user06', 'teacher02', NOW(), '2025-12-29', '2025-12-29 10:00:00', '2025-12-29 11:00:00', 'f1');

INSERT INTO reservation (
    dependant_no, 
    application_no, 
    guardian_id, 
    manager_id, 
    created_at, 
    resv_day, 
    start_at, 
    end_at, 
    resv_status, 
    reject_reason
) VALUES 
-- 1. 홍길순 (dependant_no: 3 / user02 / Center 1) -> f4 (취소)
(3, 15, 'user02', 'teacher01', NOW(), '2025-12-27', '2025-12-27 10:00:00', '2025-12-27 11:00:00', 'f4', '보호자 요청으로 취소됨'),

-- 2. 박지민 (dependant_no: 5 / user03 / Center 1) -> f3 (상담완료)
(5, 17, 'user03', 'teacher04', NOW(), '2025-12-28', '2025-12-28 09:00:00', '2025-12-28 10:00:00', 'f3', NULL),

-- 3. 홍길동 (dependant_no: 4 / user02 / Center 1) -> f2 (예약확정)
(4, 16, 'user02', 'teacher01', NOW(), '2025-12-29', '2025-12-29 14:00:00', '2025-12-29 15:00:00', 'f2', NULL);

savepoint A;

desc reservation;
select * from reservation;
--
  DELETE FROM reservation 
  WHERE resv_id = 25
    AND manager_id = 'teacher01'; 
    
  SELECT
    g.member_name    AS guardian_name,
    d.dependant_name AS dependant_name,    
    r.start_at       AS start_at,
    r.resv_status    AS status,
    r.manager_id,
    r.guardian_id
  FROM reservation r
  JOIN member g
    ON g.member_id = r.guardian_id
  JOIN dependant d
    ON d.dependant_no = r.dependant_no
  WHERE r.guardian_id = 'user02';
    
rollback to A;
