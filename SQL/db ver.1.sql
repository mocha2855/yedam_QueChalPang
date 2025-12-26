show databases;
show tables;

use project;

create table test_tbl
(test int primary key);

select * from test_tbl;

insert into test_tbl
values(10000);

commit;

DROP TABLE IF EXISTS `center`;

CREATE TABLE `center` (
	`center_no`	int	NOT NULL primary key auto_increment,
	`center_name`	varchar(30)	NOT NULL,
	`center_address`	varchar(200)	NOT NULL,
	`center_tel`	varchar(13)	NOT NULL,
	`center_email`	varchar(100)	NOT NULL,
	`center_status`	char(2)	NOT NULL	DEFAULT 'b1',
	`center_start`	date	NOT NULL,
	`center_end`	date	NOT NULL,
	`center_lunch`	time	NULL
);

INSERT INTO `center` (`center_name`, `center_address`, `center_tel`, `center_email`, `center_status`, `center_start`, `center_end`, `center_lunch`) 
VALUES ('행복복지센터', '서울시 강남구 역삼동 123', '02-123-4567', 'happy@center.com', 'b1', '2024-01-01', '2024-12-31', '12:00:00');

DROP TABLE IF EXISTS `member`;

CREATE TABLE `member` (
	`member_id`	varchar(100) primary key	NOT NULL,
	`member_phone`	varchar(13)	NOT NULL,
	`member_pass`	varchar(64)	NOT NULL,
	`member_name`	varchar(10)	NOT NULL,
	`member_address`	varchar(200)	NOT NULL,
	`member_email`	varchar(100)	NOT NULL,
	`member_authority`	char(2)	NOT NULL,
	`member_date`	datetime	NOT NULL	DEFAULT current_timestamp,
	`member_confirm`	char(2)	NOT NULL	DEFAULT 'e1',
	`center_no`	int	NOT NULL
);

select * from member;



ALTER TABLE `member` ADD CONSTRAINT `FK_center_TO_member_1` FOREIGN KEY (
	`center_no`
)
REFERENCES `center` (
	`center_no`
);

INSERT INTO `member` (`member_id`, `member_phone`, `member_pass`, `member_name`, `member_address`, `member_email`, `member_authority`, `center_no`)
VALUES 
('master01', '010-1111-2222', 'master01', '홍길동', '서울시 강남구', 'master@test.com', 'a4', 1),
('admin01', '010-2221-2222', 'admin01', '김갑수', '서울시 강남구', 'admin@test.com', 'a3', 1),
('teacher01', '010-3333-4554', 'teacher01', '김갑돌', '서울시 서초구', 'teacher@test.com', 'a2', 1),
('user01', '010-3343-4224', 'user01', '김창수', '서울시 서초구', 'user@test.com', 'a1', 1);

delete from member where member_id = 'user01';

DROP TABLE IF EXISTS `disability`;

CREATE TABLE `disability` (
	`disability_no`	int	NOT NULL primary key	auto_increment,
	`disability_name`	varchar(100)	NOT NULL
);

INSERT INTO `disability` (`disability_name`) VALUES ('시각장애'), ('청각장애'), ('지체장애'), ('발달장애');

DROP TABLE IF EXISTS `dependant`;

CREATE TABLE `dependant` (
	`dependant_no`	int	NOT NULL primary key	auto_increment,
	`disability_no`	int	NOT NULL,
	`member_id`	varchar(100)	NOT NULL,
	`dependant_name`	varchar(20)	NOT NULL,
	`dependant_birth`	date	NOT NULL,
	`despendant_gender`	char(2)	NOT NULL,
	`dependant_address`	varchar(200)	NOT NULL,
	`dependant_date`	date	NOT NULL,
	`manager_main`	varchar(100)	NULL,
	`manager_sub`	varchar(100)	NULL
);

INSERT INTO `dependant` (`disability_no`, `member_id`, `dependant_name`, `dependant_birth`, `despendant_gender`, `dependant_address`, `dependant_date`)
VALUES (4, 'user01', '홍이동', '2015-05-20', 'g1', '서울시 서초구','2025-12-09');

delete from member where disability_no = 4;


ALTER TABLE `dependant` ADD CONSTRAINT `FK_disability_TO_dependant_1` FOREIGN KEY (
	`disability_no`
)
REFERENCES `disability` (
	`disability_no`
);

DROP TABLE IF EXISTS `survey`;

CREATE TABLE `survey` (
	`survey_no`	int	NOT NULL primary key	auto_increment,
	`survey_version`	varchar(10)	NOT NULL unique,
	`survey_start`	datetime	NOT NULL,
	`survey_end`	datetime	NOT NULL,
	`survey_vesion_status`	varchar(10)	NOT NULL
);

alter table survey modify column `survey_end` datetime;

INSERT INTO `survey` (`survey_version`, `survey_start`, `survey_vesion_status`)
VALUES ('v1.0', '2024-01-01 00:00:00',  'active');

DROP TABLE IF EXISTS `survey_history`;

CREATE TABLE `survey_history` (
	`survey_history_no`	int	NOT NULL primary key	auto_increment,
	`survey_no`	int	NOT NULL,
	`survey_history_person`	varchar(20)	NOT NULL,
	`survey_history_reason`	varchar(1000)	NOT NULL,
	`survey_history_date`	datetime	NOT NULL	DEFAULT current_timestamp
);

ALTER TABLE `survey_history` ADD CONSTRAINT `FK_survey_TO_survey_history_1` FOREIGN KEY (
	`survey_no`
)
REFERENCES `survey` (
	`survey_no`
);

DROP TABLE IF EXISTS `survey_title`;

CREATE TABLE `survey_title` (
	`survey_title_no`	int	NOT NULL key	auto_increment,
	`survey_no`	int	NOT NULL,
	`survey_title`	varchar(100)	NOT NULL
);

INSERT INTO `survey_title` (`survey_no`, `survey_title`) VALUES (1, '초기 상담 설문지');

ALTER TABLE `survey_title` ADD CONSTRAINT `FK_survey_TO_survey_title_1` FOREIGN KEY (
	`survey_no`
)
REFERENCES `survey` (
	`survey_no`
);

DROP TABLE IF EXISTS `survey_subtitle`;

CREATE TABLE `survey_subtitle` (
	`survey_subtitle_no`	int	NOT NULL primary key	auto_increment,
	`survey_title_no`	int	NOT NULL,
	`survey_subtitle`	varchar(100)	NOT NULL,
	`survey_subtitle_detail`	varchar(100)	NOT NULL
);

INSERT INTO `survey_subtitle` (`survey_title_no`, `survey_subtitle`, `survey_subtitle_detail`) 
VALUES (1, '생활 습관', '일상 생활 패턴에 대한 질문입니다.');

ALTER TABLE `survey_subtitle` ADD CONSTRAINT `FK_survey_title_TO_survey_subtitle_1` FOREIGN KEY (
	`survey_title_no`
)
REFERENCES `survey_title` (
	`survey_title_no`
);

DROP TABLE IF EXISTS `survey_qitem`;

CREATE TABLE `survey_qitem` (
	`survey_qitem_no`	int	NOT NULL primary key	auto_increment,
	`survey_subtitle_no`	int	NOT NULL,
	`survey_qitem_question`	varchar(1000)	NOT NULL,
	`survey_qitem_type`	varchar(10)	NOT NULL
);

INSERT INTO `survey_qitem` (`survey_subtitle_no`, `survey_qitem_question`, `survey_qitem_type`)
VALUES (1, '평소 기상 시간은 언제입니까?', 'text'), (1, '도움이 필요한 영역을 선택하세요.', 'choice');

ALTER TABLE `survey_qitem` ADD CONSTRAINT `FK_survey_subtitle_TO_survey_qitem_1` FOREIGN KEY (
	`survey_subtitle_no`
)
REFERENCES `survey_subtitle` (
	`survey_subtitle_no`
);

DROP TABLE IF EXISTS `application`;

CREATE TABLE `application` (
	`application_no`	int	NOT NULL primary key	auto_increment,
	`dependant_no`	int	NOT NULL,
	`survey_no`	int	NOT NULL,
	`member_id`	varchar(100)	NOT NULL,
	`application_date`	datetime	NOT NULL,
	`status`	char(2)	NOT NULL	DEFAULT 'e1'
);

ALTER TABLE `application` ADD CONSTRAINT `FK_dependant_TO_application_1` FOREIGN KEY (
	`dependant_no`
)
REFERENCES `dependant` (
	`dependant_no`
);

-- 결재자 및 대기단계 반려사유, 대기단계 진행상태 추가(12/24)
alter table application add application_rejector varchar(100);
alter table application add status_reject varchar(100);
alter table application add status_status char(2) ;
alter table application drop column status_status;

 
DROP TABLE IF EXISTS `planning`;

CREATE TABLE `planning` (
	`planning_no`	int	NOT NULL primary key	auto_increment,
	`application_no`	int	NOT NULL,
	`planning_id`	varchar(100)	NOT NULL,
	`planning_rejecter`	varchar(100)	NOT NULL,
	`planning_approvedDate`	datetime	NULL,
	`planning_date`	datetime	NOT NULL,
	`planning_start`	date	NOT NULL,
	`planning_end`	date	NOT NULL,
	`planning_title`	varchar(100)	NOT NULL,
	`planning_content`	varchar(200)	NOT NULL,
	`planning_status`	char(2)	NOT NULL	DEFAULT 'i1',
	`planning_reject`	varchar(100)	NULL,
	`attachment_no`	int	NULL,
	`planning_reject_date`	datetime	NULL
);

ALTER TABLE `planning` ADD CONSTRAINT `FK_attachment_TO_planning_1` FOREIGN KEY (
	`attachment_no`
)
REFERENCES `attachment` (
	`attachment_no`
);
INSERT INTO `attachment` (`attachment_orginal`, `attachment_path`, `attachment_date`, `attachment_filetype`, `attachment_size`) 
VALUES ('report.pdf', '/uploads/2024/', NOW(), 'application/pdf', '1024KB');

ALTER TABLE `planning` ADD CONSTRAINT `FK_application_TO_planning_1` FOREIGN KEY (
	`application_no`
)
REFERENCES `application` (
	`application_no`
);


DROP TABLE IF EXISTS `result`;

CREATE TABLE `result` (
	`result_no`	int	NOT NULL primary key	auto_increment,
	`planning_no`	int	NOT NULL,
	`attachment_no`	int	NULL,
	`planning_rejecter`	varchar(100)	NOT NULL,
	`planning_id`	varchar(100)	NOT NULL,
	`result_date`	datetime	NOT NULL,
	`result_title`	varchar(100)	NOT NULL,
	`result_content`	varchar(200)	NOT NULL,
	`result_status`	char(2)	NOT NULL	DEFAULT 'i1',
	`result_reject`	varchar(100)	NULL,
	`result_reject_date`	datetime	NULL,
	`planning_start`	date	NOT NULL,
	`planning_end`	date	NOT NULL,
	`result_approvedDate`	datetime	NULL
);

ALTER TABLE `result` ADD CONSTRAINT `FK_planning_TO_result_1` FOREIGN KEY (
	`planning_no`
)
REFERENCES `planning` (
	`planning_no`
);

ALTER TABLE `result` ADD CONSTRAINT `FK_attachment_TO_result_1` FOREIGN KEY (
	`attachment_no`
)
REFERENCES `attachment` (
	`attachment_no`
);

DROP TABLE IF EXISTS `app_answer`;

CREATE TABLE `app_answer` (
	`app_answer_no`	int	NOT NULL primary key	auto_increment,
	`survey_qitem_no`	int	NOT NULL	,
	`application_no`	int	NOT NULL,
	`app_answer_type`	varchar(10)	NULL,
	`app_date`	date	NULL,
	`app_reason`	varchar(200)	NULL
);

ALTER TABLE `app_answer` ADD CONSTRAINT `FK_survey_qitem_TO_app_answer_1` FOREIGN KEY (
	`survey_qitem_no`
)
REFERENCES `survey_qitem` (
	`survey_qitem_no`
);

ALTER TABLE `app_answer` ADD CONSTRAINT `FK_application_TO_app_answer_1` FOREIGN KEY (
	`application_no`
)
REFERENCES `application` (
	`application_no`
);

DROP TABLE IF EXISTS `notification`;

CREATE TABLE `notification` (
	`notification_no`	int	NOT NULL primary key	auto_increment,
	`member_id`	varchar(100)	NOT NULL,
	`notification_content`	varchar(100)	NOT NULL,
	`notification_date`	datetime	NOT NULL	DEFAULT current_timestamp
);

DROP TABLE IF EXISTS `app_history`;

CREATE TABLE `app_history` (
	`app_history_no`	int	NOT NULL primary key	auto_increment,
	`application_no`	int	NOT NULL,
	`app_history_id`	varchar(100)	NOT NULL,
	`app_history_date`	datetime	NOT NULL,
	`app_history_reason`	varchar(200)	NOT NULL
);

ALTER TABLE `app_history` ADD CONSTRAINT `FK_application_TO_app_history_1` FOREIGN KEY (
	`application_no`
)
REFERENCES `application` (
	`application_no`
);

DROP TABLE IF EXISTS `reservation`;

CREATE TABLE `reservation` (
	`resv_id`	int	NOT NULL primary key	 auto_increment,
	`dependant_no`	int	NOT NULL,
	`application_no`	int	NOT NULL,
	`guardian_id`	varchar(100)	NOT NULL	COMMENT 'member_authority check (insert member_id)',
	`manager_id`	varchar(100)	NOT NULL,
	`created_at`	datetime	NOT NULL	DEFAULT current_timestamp,
	`resv_day`	datetime	NOT NULL,
	`start_at`	datetime	NOT NULL,
	`end_at`	datetime	NOT NULL,
	`resv_status`	char(2)	NOT NULL	DEFAULT 'f1',
	`reject_reason`	varchar(1000)	NULL
);

ALTER TABLE `reservation` ADD CONSTRAINT `FK_dependant_TO_reservation_1` FOREIGN KEY (
	`dependant_no`
)
REFERENCES `dependant` (
	`dependant_no`
);

ALTER TABLE `reservation` ADD CONSTRAINT `FK_application_TO_reservation_1` FOREIGN KEY (
	`application_no`
)
REFERENCES `application` (
	`application_no`
);

DROP TABLE IF EXISTS `meeting_log`;

CREATE TABLE `meeting_log` (
	`log_id`	int	NOT NULL primary key	auto_increment,
	`resv_id`	int	NOT NULL,
	`member_id`	varchar(100)	NOT NULL,
	`log_title`	varchar(300)	NOT NULL,
	`log_content`	varchar(1000)	NOT NULL,
	`log_date`	datetime	NULL	DEFAULT current_timestamp,
	`attachment_no`	int	NULL
);

ALTER TABLE `meeting_log` ADD CONSTRAINT `FK_reservation_TO_meeting_log_1` FOREIGN KEY (
	`resv_id`
)
REFERENCES `reservation` (
	`resv_id`
);

ALTER TABLE `meeting_log` ADD CONSTRAINT `FK_attachment_TO_meeting_log_1` FOREIGN KEY (
	`attachment_no`
)
REFERENCES `attachment` (
	`attachment_no`
);


DROP TABLE IF EXISTS `schedule_block`;

CREATE TABLE `schedule_block` (
	`block_no`	int primary key	NOT NULL,
	`member_id`	varchar(100)	NOT NULL,
	`block_date`	date	NOT NULL,
	`block_time`	time	NOT NULL
);

﻿DROP TABLE IF EXISTS `qna`;

CREATE TABLE `qna` (
	`qna_no`	int	NOT NULL primary key	auto_increment,
	`member_id`	varchar(100)	NULL,
	`qna_title`	varchar(100)	NULL,
	`qna_content`	varchar(1000)	NULL,
	`qna_date`	datetime	NULL,
	`qna_category`	char(2)	NOT NULL,
	`qna_status`	char(2)	NOT NULL	DEFAULT 'k2',
	`attachment_no`	int	NULL
);

ALTER TABLE `qna` ADD CONSTRAINT `FK_attachment_TO_qna_1` FOREIGN KEY (
	`attachment_no`
)
REFERENCES `attachment` (
	`attachment_no`
);

DROP TABLE IF EXISTS `qna_answer`;

CREATE TABLE `qna_answer` (
	`qanswer_no`	int	NOT NULL primary key	auto_increment,
	`qna_no`	int	NOT NULL,
	`member_id`	varchar(100)	NOT NULL,
	`qanswer_content`	varchar(1000)	NOT NULL,
	`qanswer_date`	datetime	NOT NULL,
	`attachment_no`	int	NULL
);

ALTER TABLE `qna_answer` ADD CONSTRAINT `FK_qna_TO_qna_answer_1` FOREIGN KEY (
	`qna_no`
)
REFERENCES `qna` (
	`qna_no`
);

ALTER TABLE `qna_answer` ADD CONSTRAINT `FK_attachment_TO_qna_answer_1` FOREIGN KEY (
	`attachment_no`
)
REFERENCES `attachment` (
	`attachment_no`
);

DROP TABLE IF EXISTS `attachment`;

CREATE TABLE `attachment` (
	`attachment_no`	int	NOT NULL primary key	auto_increment,
	`attachment_orginal`	varchar(100)	NOT NULL,
	`attachment_path`	varchar(200)	NOT NULL,
	`attachment_date`	datetime	NOT NULL	DEFAULT current_timestamp,
	`attachment_filetype`	varchar(500)	NOT NULL,
	`attachment_size`	varchar(500)	NOT NULL
);

DROP TABLE IF EXISTS `temp`;

CREATE TABLE `temp` (
	`temp_no`	int	NOT NULL primary key	auto_increment,
	`dependant_no`	int	NOT NULL,
	`member_id`	varchar(100)	NOT NULL,
	`temp_start`	date	NOT NULL,
	`temp_end`	date	NOT NULL,
	`temp_title`	varchar(100)	NOT NULL,
	`temp_content`	varchar(200)	NOT NULL,
	`temp_type`	char(2)	NOT NULL,
	`attachment_no`	int	NULL
);

ALTER TABLE `temp` ADD CONSTRAINT `FK_dependant_TO_temp_1` FOREIGN KEY (
	`dependant_no`
)
REFERENCES `dependant` (
	`dependant_no`
);

ALTER TABLE `temp` ADD CONSTRAINT `FK_attachment_TO_temp_1` FOREIGN KEY (
	`attachment_no`
)
REFERENCES `attachment` (
	`attachment_no`
);

-- //////////////////////////////////////////////////////









































