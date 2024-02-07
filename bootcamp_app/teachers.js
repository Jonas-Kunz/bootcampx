const { Pool } = require("pg");

const pool = new Pool({
  user: "labber",
  password: "labber",
  host: "localhost",
  database: "bootcampx",
});

pool.connect().then(() => {
  const queryString = `
  SELECT DISTINCT teachers.name AS teacher, cohorts.name AS cohort
  FROM assistance_requests
  JOIN teachers ON teachers.id = teacher_id
  JOIN students ON students.id = assistance_requests.student_id
  JOIN cohorts ON cohorts.id = cohort_id
  WHERE cohorts.name LIKE $1
  ORDER BY teachers.name;
  `;
  const cohortName = process.argv[2];
  const values = [cohortName];
  pool
    .query(
      queryString,
      values
    )
    .then((res) => {
      res.rows.forEach((teacher) => {
        console.log(`${teacher.cohort}: ${teacher.teacher}`);
      });
    })
    .catch((err) => console.log(err))
    .finally(() => pool.end())
});
