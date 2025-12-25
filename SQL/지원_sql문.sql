use project;

insert into test_tbl
values (1);
commit;

delete from survey where survey_no= '3';
delete from survey_title where survey_title_no= '1';
delete from survey_subtitle where survey_subtitle_no= '1';
delete from survey_qitem where survey_qitem_no= '10';
-- survey 부분 select
select * from survey;
-- 전체 조회
-- 활성만 가져와야함
SELECT *
FROM survey
WHERE survey_version_status = 'active';
-- survey 전체 가져오기(join)
select s.survey_no,s.survey_version,s.survey_start,s.survey_end,s.survey_version_status,
        st.survey_title_no, st.survey_title,
        ss.survey_subtitle_no, ss.survey_subtitle,ss.survey_subtitle_detail,
        sq.survey_qitem_no,sq.survey_qitem_question,sq.survey_qitem_type
 from survey s
LEFT JOIN survey_title st ON s.survey_no = st.survey_no
LEFT JOIN survey_subtitle ss ON st.survey_title_no = ss.survey_title_no
LEFT JOIN survey_qitem sq ON ss.survey_subtitle_no = sq.survey_subtitle_no
WHERE s.survey_version_status = 'active';


UPDATE survey
SET survey_version_status = 'inactive'
WHERE survey_no = 1;
commit;

-- 업데이트 시 기존 active한 걸 골라서 inactive
UPDATE survey
SET survey_version_status = 'inactive'
WHERE survey_no = ?
AND survey_version_status = 'active';
commit;

UPDATE survey
SET survey_version = 1.3
WHERE survey_no = 3;

INSERT INTO survey (survey_no, survey_version, survey_start, survey_end, survey_version_status) 
VALUES 
(3, 1.3, '2025-12-22 00:00:00', '2025-12-22 00:00:00', 'active');

select*from survey_history;
select * from survey_title;
select * from survey_subtitle;
select * from survey_qitem;

delete from survey_title where survey_title_no= '3';

INSERT INTO survey_title (survey_title_no, survey_no, survey_title)
VALUES
(1, 3, '기본 정보 설문'),
(2, 3, '서비스 필요도 조사'),
(3, 3, '보호자 의견 및 만족도');
commit;

INSERT INTO survey_subtitle (survey_subtitle_no, survey_title_no, survey_subtitle, survey_subtitle_detail)
VALUES
(1, 1, '대상자 기본 정보', '대상자의 생활 환경과 건강 상태를 확인합니다.'),
(2, 2, '지원 서비스 필요 영역', '대상자가 필요로 하는 지원 항목을 확인합니다.'),
(3, 3, '보호자 의견', '보호자의 만족도와 건의사항을 조사합니다.');
commit;
