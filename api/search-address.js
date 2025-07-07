async function searchAddressByMois() {
    const keyword = document.getElementById('address').value.trim();
    if (!keyword) return alert("주소를 입력해주세요.");

    try {
        const res = await fetch(`/api/search-address?keyword=${encodeURIComponent(keyword)}`);
        const data = await res.json();
        const juso = data?.results?.juso;

        if (!juso || juso.length === 0) {
            alert("검색 결과가 없습니다.");
            return;
        }

        const suggestionsBox = document.getElementById('addressSuggestions');
        suggestionsBox.innerHTML = '';
        document.getElementById('confirmedAddressDisplay').style.display = 'none';
        document.getElementById('dongHosuSelection').style.display = 'none';

        juso.forEach(item => {
            const addr = item.roadAddr || item.jibunAddr || '';
            const btn = document.createElement('button');
            btn.className = 'list-group-item list-group-item-action';
            btn.textContent = addr;
            btn.onclick = () => handleAddressSelect(item);
            suggestionsBox.appendChild(btn);
        });

        const modal = new bootstrap.Modal(document.getElementById('addressDetailModal'));
        modal.show();
    } catch (error) {
        alert("API 호출 중 오류가 발생했습니다.");
        console.error(error);
    }
}

function handleAddressSelect(item) {
    const addr = item.roadAddr || item.jibunAddr;
    document.getElementById('confirmedAddress').innerText = addr;
    document.getElementById('confirmedAddressDisplay').style.display = 'block';
    document.getElementById('dongHosuSelection').style.display = 'flex';

    const jibun = item.jibunAddr || '';
    const match = jibun.match(/(\d+동)\s?(\d+호)?/);
    const dong = match?.[1] || '기타';
    const hosu = match?.[2] || '기타';

    state.dongList = [dong];
    state.hosuMap = { [dong]: [hosu] };

    // 동 셀렉트 박스 채우기
    const dongSelect = document.getElementById('dongSelect');
    dongSelect.innerHTML = '';
    const option = document.createElement('option');
    option.value = dong;
    option.textContent = dong;
    dongSelect.appendChild(option);

    updateHosuOptions();
}
