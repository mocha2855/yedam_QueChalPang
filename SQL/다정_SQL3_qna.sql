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

UPDATE member
SET member_authority = 'a1'
WHERE member_authority = 'u1';
