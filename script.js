// 初始化頁面元素
document.addEventListener('DOMContentLoaded', function() {
    // 初始設置
    updateCustomResolution();
    updateSensorWidth();

    // 綁定計算按鈕事件
    document.getElementById('calculateBtn').addEventListener('click', calculateDORI);
});

// 處理解析度下拉選單變更
function updateCustomResolution() {
    const select = document.getElementById('resolutionSelect');
    const customInput = document.getElementById('customResolution');
    
    if (select.value === 'custom') {
        customInput.style.display = 'block';
    } else {
        customInput.style.display = 'none';
    }
}

// 處理感光元件下拉選單變更
function updateSensorWidth() {
    const select = document.getElementById('sensorSelect');
    const customInput = document.getElementById('customSensorWidth');
    const widthDisplay = document.getElementById('sensorWidthValue');
    const widthDisplayContainer = document.getElementById('sensorWidthDisplay');
    
    if (select.value === 'custom') {
        customInput.style.display = 'block';
        widthDisplayContainer.style.display = 'none';
    } else {
        customInput.style.display = 'none';
        widthDisplayContainer.style.display = 'block';
        widthDisplay.textContent = select.value;
    }
}

// DORI 計算核心函數
function calculateDORI() {
    // 1. 獲取輸入值
    let resolutionH;
    const resSelect = document.getElementById('resolutionSelect');
    if (resSelect.value === 'custom') {
        resolutionH = parseFloat(document.getElementById('customResolution').value);
    } else {
        resolutionH = parseFloat(resSelect.value);
    }

    let sensorWidthMm;
    const sensorSelect = document.getElementById('sensorSelect');
    if (sensorSelect.value === 'custom') {
        sensorWidthMm = parseFloat(document.getElementById('customSensorWidth').value);
    } else {
        sensorWidthMm = parseFloat(sensorSelect.value);
    }

    const focalLengthMm = parseFloat(document.getElementById('focalLength').value);

    // 2. 基本驗證
    if (isNaN(resolutionH) || resolutionH <= 0) {
        alert("請輸入有效的水平解析度。");
        return;
    }
    if (isNaN(sensorWidthMm) || sensorWidthMm <= 0) {
        alert("請輸入有效的感光元件寬度。");
        return;
    }
    if (isNaN(focalLengthMm) || focalLengthMm <= 0) {
        alert("請輸入有效的鏡頭焦距。");
        return;
    }

    // 3. 計算邏輯
    
    // 計算水平視場角 (HFOV) - 使用 2 * arctan(h/2f) 公式
    // Math.atan 回傳的是弧度，需要轉換為角度用於顯示
    const hfovRadians = 2 * Math.atan(sensorWidthMm / (2 * focalLengthMm));
    const hfovDegrees = hfovRadians * (180 / Math.PI);

    // 顯示 HFOV 結果 (取小數點後一位)
    document.getElementById('hfovResult').textContent = hfovDegrees.toFixed(1);

    // 定義 DORI PPM 閾值 (Pixels Per Meter)
    const ppmD = 25;
    const ppmO = 62.5;
    const ppmR = 125;
    const ppmI = 250;

    // 計算每個 DORI 的目標場景寬度 (Target Scene Width in meters)
    // Scene Width = Resolution / PPM
    const widthD = resolutionH / ppmD;
    const widthO = resolutionH / ppmO;
    const widthR = resolutionH / ppmR;
    const widthI = resolutionH / ppmI;

    // 計算距離 (Distance)
    // Distance = Scene Width / (2 * tan(HFOV_radians / 2))
    // 注意：這裡要用弧度進行 tan 計算
    const tanHalfHFOV = Math.tan(hfovRadians / 2);

    const distD = widthD / (2 * tanHalfHFOV);
    const distO = widthO / (2 * tanHalfHFOV);
    const distR = widthR / (2 * tanHalfHFOV);
    const distI = widthI / (2 * tanHalfHFOV);

    // 4. 更新 UI 顯示結果 (取小數點後一位)
    document.getElementById('distD').textContent = distD.toFixed(1);
    document.getElementById('distO').textContent = distO.toFixed(1);
    document.getElementById('distR').textContent = distR.toFixed(1);
    document.getElementById('distI').textContent = distI.toFixed(1);

    // 顯示結果區域
    document.getElementById('resultsArea').style.display = 'block';
}