use project;

insert into test_tbl
values (1);
commit;


select * from member;
SELECT * FROM member 
WHERE member_authority IN ('u1', 'a3');



delete from survey where survey_no= '11';
delete from survey_title where survey_title_no= '1';
delete from survey_subtitle where survey_subtitle_no= '14';
delete from survey_qitem where survey_qitem_no= '25';
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

UPDATE survey
SET survey_version_status = 'active'
WHERE survey_no = 4;
commit;


-- 버전 자동 업그레이드
select Max(survey_version) as max_version
from surveys;
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

INSERT INTO  survey_subtitle
(survey_subtitle_no, survey_title_no, survey_subtitle, survey_subtitle_detail)
VALUES
(15, 15, '긴급 지원 필요', '즉시 지원이 필요한 경우'),
(16, 15, '중점 지원 필요', '2년 이내 지원이 필요한 경우'),
(17, 15, '계획 수립 필요', '2~5년 이내 지원이 예상되는 경우'),
(19, 15, '개인별 지원 서비스', '개인 맞춤형 지원이 필요한 경우'),
(20, 15, '교통 및 복지 서비스', '교통 또는 복지 관련 추가 지원이 필요한 경우');
commit;

INSERT INTO survey_qitem
(survey_subtitle_no, survey_qitem_question, survey_qitem_type)
VALUES
-- 15 : 긴급 지원 필요
(15, '가족 또는 보호자가 없어 즉각적인 지원이 필요한 상태이다', '예/아니요'),
(15, '현재 심각한 건강 문제 또는 위기 상황이 있다', '예/아니요'),
(15, '즉시 지원이 없으면 생활 유지가 어려운 상태이다', '예/아니요'),
(15, '법적 또는 사회적 보호가 필요한 상황이다', '예/아니요'),

-- 16 : 중점 지원 필요
(16, '향후 2년 이내에 지속적인 지원이 필요할 가능성이 있다', '예/아니요'),
(16, '건강 문제로 인해 생활 지원이 필요하다', '예/아니요'),
(16, '가족 또는 보호자의 돌봄 제공이 어려운 상태이다', '예/아니요'),
(16, '정기적인 의료 또는 복지 지원이 필요하다', '예/아니요'),

-- 17 : 계획 수립 필요
(17, '2~5년 이내 지원이 필요할 것으로 예상된다', '예/아니요'),
(17, '거주 환경 변화 또는 이전 가능성이 있다', '예/아니요'),
(17, '장기적인 생활 안정 계획이 필요한 상황이다', '예/아니요'),
(17, '장기 지원을 고려해야 할 사유가 있다', '예/아니요'),

-- 19 : 개인별 지원 서비스
(19, '개인별 맞춤형 지원 서비스가 필요하다', '예/아니요'),
(19, '일상생활을 위한 직접적인 지원이 필요하다', '예/아니요'),
(19, '행동 지원 또는 서비스介입이 필요하다', '예/아니요'),

-- 20 : 교통 및 복지 서비스
(20, '교통 지원 서비스가 필요하다', '예/아니요'),
(20, '정기적인 이동 지원이 필요하다', '예/아니요'),
(20, '장거리 이동으로 인해 교통비 부담이 있다', '예/아니요'),
(20, '생활 안정 복지 서비스 지원이 필요하다', '예/아니요'),
(20, '의료 관련 복지 서비스 지원이 필요하다', '예/아니요');


SELECT 
       s.survey_no,
       s.survey_version,
       s.survey_start,
       s.survey_end,
       s.survey_version_status,
       st.survey_title_no, 
       st.survey_title, 
       ss.survey_subtitle_no, 
       ss.survey_subtitle,
       ss.survey_subtitle_detail
  FROM survey s
  LEFT JOIN survey_title st ON s.survey_no = st.survey_no
  LEFT JOIN survey_subtitle ss ON st.survey_title_no = ss.survey_title_no
  WHERE s.survey_no = 28 AND s.survey_version_status = 'active';