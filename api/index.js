
// 필요한 모듈들을 가져옵니다.
const express = require('express'); // 웹 프레임워크
const cors = require('cors'); // CORS(Cross-Origin Resource Sharing)를 처리하기 위한 모듈
const axios = require('axios'); // HTTP 클라이언트
const path = require('path');

// Express 애플리케이션을 생성합니다.
const app = express();

// 미들웨어를 설정합니다.
app.use(cors()); // 모든 도메인에서의 요청을 허용하도록 CORS 설정
app.use(express.json()); // JSON 형태의 요청 본문을 파싱하도록 설정




// 주소 검색 API 라우트
app.get('/api/search-address', async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    try {
        // 중요: 실제 배포 시에는 이 API 키를 Vercel의 환경 변수로 옮겨야 합니다.
        const apiKey = 'devU01TX0FVVEgyMDI1MDcwNTE0MDg0MjExNTkxNDg='; 
        const apiUrl = `https://www.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${apiKey}&keyword=${encodeURIComponent(keyword)}&resultType=json`;
        
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Address API error:', error);
        res.status(500).json({ error: 'Failed to fetch address data' });
    }
});

// Vercel 환경에서 Express 앱을 내보냅니다.
module.exports = (req, res) => {
    app(req, res);
};