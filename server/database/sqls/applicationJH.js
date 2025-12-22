const selectById = `select *
from (select * from application where status = 'e2') a
join (select * from reservation where resv_status = 'f3') r on a.application_no = r.application_no;`;
