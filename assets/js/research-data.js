window.RESEARCH_DATA = Object.freeze({
  meta: {
    version: '0.9.0',
    studyYear: 2026,
    studyArea: 'Đắk Lắk',
    sample: { cost: 217, wtp: 217, land: 218 },
    sourceRun: '20260615_223347',
    validation: 'Nền tảng đã hoàn thiện về chức năng nhưng chưa được đánh giá với người dùng cuối; nghiên cứu vì vậy chưa kết luận về tính dễ sử dụng, mức độ chấp nhận hoặc hiệu quả hỗ trợ quyết định trong thực tế.'
  },
  labels: {
    shortage: {
      1: 'Không bao giờ',
      2: 'Hiếm khi',
      3: 'Thỉnh thoảng',
      4: 'Thường xuyên',
      5: 'Rất thường xuyên'
    },
    decline: {
      1: 'Tăng nhiều',
      2: 'Tăng',
      3: 'Không đổi',
      4: 'Giảm',
      5: 'Giảm nhiều'
    },
    stability: {
      1: 'Rất không ổn định',
      2: 'Không ổn định',
      3: 'Bình thường',
      4: 'Ổn định',
      5: 'Rất ổn định'
    }
  },
  cost: {
    intercept: 0.22274108228932815,
    coefficients: {
      lnArea: 0.26362920907270254,
      lnProduction: 0.18272910455547178,
      shortage: 0.08787422647787113,
      decline: -0.10835719783882349
    },
    irrigation: {
      'Tưới dí': { beta: 0, p: null, reference: true },
      'Tưới phun hoặc nhỏ giọt': { beta: 0.3336284874154875, p: 0.035 },
      'Kết hợp': { beta: 0.1704800385355926, p: 0.186 }
    },
    source: {
      'Giếng khoan': { beta: 0, p: null, reference: true },
      'Hồ chứa': { beta: -0.058543039145706924, p: 0.702 },
      'Suối': { beta: 0.039654861608283215, p: 0.856 },
      'Kênh mương': { beta: 0.15304846488133395, p: 0.312 },
      'Khác': { beta: 0.1640647968993532, p: 0.643 }
    },
    pValues: { lnArea: 0.004, lnProduction: 0.011, shortage: 0.154, decline: 0.118 },
    range: {
      area: { min: 0.5, max: 40, median: 5 },
      production: { min: 100, max: 20000, median: 1700 }
    },
    diagnostics: { r2: 0.238, adjustedR2: 0.201, breuschPaganP: 0.081367, resetP: 0.339705 }
  },
  wtp: {
    bids: [
      { group: 'A', amount: 50000, n: 52, yes: 42, rate: 42/52, ci: [0.675, 0.904] },
      { group: 'B', amount: 100000, n: 48, yes: 32, rate: 32/48, ci: [0.516, 0.796] },
      { group: 'C', amount: 200000, n: 44, yes: 24, rate: 24/44, ci: [0.388, 0.696] },
      { group: 'D', amount: 400000, n: 73, yes: 34, rate: 34/73, ci: [0.348, 0.586] }
    ],
    median: 262619.07703987823,
    medianCI: [192472, 384305],
    mean: 2032158.761631506,
    meanCI: [851532, 8352562],
    shortage: { beta: -0.10122620184553967, p: 0.504 },
    educationUniversity: { beta: 1.5951818294752402, p: 0.015 },
    experience: { beta: -0.04799040052694137, p: 0.014 },
    responseChains: { YY: 108, YN: 24, NY: 29, NN: 56 }
  },
  land: {
    shortage: { beta: -0.24062669518717356, se: 0.05509984497773361, p: 0.0001, ci: [-0.349, -0.132] },
    stability: {
      reference: 3,
      omnibusP: 0.072878,
      levels: {
        1: { beta: -0.7223381262086563, p: 0.006, ci: [-1.234, -0.211], n: 8 },
        2: { beta: -0.14698345773098448, p: 0.421, ci: [-0.507, 0.213], n: 27 },
        3: { beta: 0, p: null, ci: [0, 0], reference: true, n: 109 },
        4: { beta: 0.016476287744906278, p: 0.897, ci: [-0.234, 0.267], n: 65 },
        5: { beta: -0.13193188639997325, p: 0.666, ci: [-0.734, 0.471], n: 9 }
      }
    },
    privateWell: { beta: -0.04219274151293411, p: 0.721 },
    descriptive: { mean: 253.33, median: 200, min: 20, max: 1000 },
    diagnostics: { breuschPaganP: 0.068214, resetP: 0.075757 }
  },
  integrated: [
    { key: 'cost', label: 'Chi phí tưới', beta: 0.08787422647787113, p: 0.154, direction: 'positive', status: 'Chưa có tín hiệu độc lập rõ', note: 'Tổng chi phí tưới hộ khai báo' },
    { key: 'wtp', label: 'WTP chương trình', beta: -0.10122620184553967, p: 0.504, direction: 'negative', status: 'Chưa có tín hiệu độc lập rõ', note: 'Giá trị/ủng hộ được phát biểu cho chương trình cụ thể' },
    { key: 'land', label: 'Giá trị đất', beta: -0.24062669518717356, p: 0.0001, direction: 'negative', status: 'Tín hiệu âm rõ', note: 'Giá trị đất cà phê do hộ tự ước tính' }
  ]
});
