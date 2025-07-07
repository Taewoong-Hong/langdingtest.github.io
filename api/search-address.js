// api/search-address.js 로 분리하거나, 아래처럼 단일 핸들러로 구성

const axios = require('axios');
const cors = require('cors');

// Vercel은 Express 전체를 사용하는 게 아니라 handler 함수만 사용
module.exports = async (req, res) => {
// CORS 설정
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

// Preflight 요청 처리
if (req.method === 'OPTIONS') {
    return res.status(200).end();
}

if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
}

const { keyword } = req.query;
if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
}

try {
    const apiKey = 'devU01TX0FVVEgyMDI1MDcwNTE0MDg0MjExNTkxNDg=';
    const apiUrl = `https://www.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${apiKey}&keyword=${encodeURIComponent(keyword)}&resultType=json`;

    const response = await axios.get(apiUrl);
    res.status(200).json(response.data);
} catch (error) {
    console.error('Address API error:', error);
    res.status(500).json({ error: 'Failed to fetch address data' });
}
};
