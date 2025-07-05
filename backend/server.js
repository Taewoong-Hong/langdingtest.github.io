
// 필요한 모듈들을 가져옵니다.
const express = require('express'); // 웹 프레임워크
const sqlite3 = require('sqlite3').verbose(); // SQLite 데이터베이스 모듈
const bodyParser = require('body-parser'); // 요청 본문을 파싱하기 위한 모듈
const cors = require('cors'); // CORS(Cross-Origin Resource Sharing)를 처리하기 위한 모듈

// Express 애플리케이션을 생성합니다.
const app = express();
const port = 3000; // 서버가 실행될 포트

const path = require('path');

// 미들웨어를 설정합니다.
app.use(cors()); // 모든 도메인에서의 요청을 허용하도록 CORS 설정
app.use(express.json()); // JSON 형태의 요청 본문을 파싱하도록 설정
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 제공

// 데이터베이스를 초기화합니다.
// 'waitlist.db'라는 파일에 데이터베이스를 저장합니다.
const db = new sqlite3.Database('./waitlist.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the waitlist database.');
});

// 'waitlist' 테이블을 생성합니다.
// 이름, 연락처, 이메일을 저장할 컬럼과 신청 시간을 저장할 컬럼을 가집니다.
db.run(`CREATE TABLE IF NOT EXISTS waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// API 라우트를 설정합니다.
// POST /api/waitlist: 대기자 명단에 정보를 추가하는 라우트
app.post('/api/waitlist', (req, res) => {
  const { name, phone, email } = req.body;

  // [데이터 검증]
  // 필수 필드가 없는 경우 400 오류를 반환합니다.
  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'Name, phone, and email are required' });
  }

  // [데이터베이스에 정보 저장]
  const sql = `INSERT INTO waitlist (name, phone, email) VALUES (?, ?, ?)`;
  db.run(sql, [name, phone, email], function(err) {
    // 이메일이 이미 존재하는 경우 (UNIQUE 제약 조건 위반)
    if (err) {
      return res.status(409).json({ error: 'This email is already on the waitlist.' });
    }
    // 성공적으로 추가된 경우
    res.status(201).json({ message: 'Successfully added to the waitlist.', id: this.lastID });
  });
});

// GET /api/submissions: 모든 제출 데이터를 조회하는 라우트
app.get('/api/submissions', (req, res) => {
  const sql = `SELECT * FROM waitlist ORDER BY created_at DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Successfully retrieved all submissions.',
      data: rows
    });
  });
});

// 서버를 시작합니다.
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
