import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

/** @type {Record<string, Record<string, unknown>>} */
const zhHant = {
  services: {
    heroBadge: '專業 IT 優化',
    heroTitleLine1: '充分發揮',
    heroTitleAccent: '您的 IT 投資效益。',
    heroSubtitle:
      'FDS 服務不止於上線交付。我們以伙伴身份協助釐清優先次序、自動化流程，並維護關鍵任務級穩定性。',
    careTitleLead: 'FDS',
    careTitleAccent: '客戶關懷。',
    careBody:
      '支援團隊提供專業持續服務，協助您盡現系統價值。我們依客戶需要設計支援—由熱線回應到深入架構分析。',
    maintenanceSchemesTitle: '維護方案',
    maintM1Title: '標準辦公',
    maintM1Desc: '08:45 - 18:00（周一至五）',
    maintM2Title: '延伸支援',
    maintM2Desc: '08:30 - 23:00（周一至五）+ 周六',
    maintM3Title: '7×24 可用',
    maintM3Desc: '全天候監察（每日）',
    supportServices: [
      { title: '熱線服務', desc: '專責團隊處理電話／電郵／傳真支援。' },
      { title: '軟件更新服務', desc: '定期更新以修復生產問題並提升穩定性。' },
      { title: '問題診斷', desc: '深入排解與快速應對，將停機時間減至最低。' },
      { title: '系統管理', desc: '協助.navigate 與管理企業級系統變更。' },
      { title: '影響分析', desc: '為應用與架構的微幅變更提供決策支援。' },
      { title: '持續優化', desc: '細部調校應用以配合業務演進。' }
    ],
    methodologyCardBadge: '方法論',
    methodsEyebrow: '方法論與開發',
    methodsHeading: '植根業界最佳實務。',
    methodsLeadPart1: '我們可按需要引入業界標準平台，例如',
    methodsLeadPart2: '與',
    methodsLeadPart3: '；或提供度身訂製方案，如我們自有的',
    methodsLeadPart4: '產品系列。',
    methodsLeadAccent1: 'IBM FileNet',
    methodsLeadAccent2: 'Qmatic',
    methodsLeadAccent3: 'Focal',
    estimationRigidnessHeading: '估算嚴謹度',
    estimationQuote: '精準估算是每個成功企業交付的錨點。',
    estimationFREMName: 'FREM',
    estimationFREMDesc: 'Focal 資源評估方法（源自 FPA）',
    estimationFPAName: 'FPA',
    estimationFPADesc: '功能點分析作精準量度',
    estimationFORMName: 'FORM',
    estimationFORMDesc: 'Focal 品質檢視方法論',
    footerCheckFpa: '功能點分析（FPA）',
    footerCheckFrem: '資源評估方法（FREM）',
    closingTitle: '以簡馭繁。臻於卓越。',
    closingBody: '準備與香港領先系統集成商優化业务流程？',
    closingCTA: '諮詢 FDS 客戶關懷',
    methodologies: [
      {
        id: 'prince',
        title: '專案管理',
        code: 'PRINCE',
        subtitle: '例外管理',
        body: '由英國中央電腦與電傳機構發展而來，側重流程監察，協調功能、時間、資源與品質的平衡。',
        stages: ['啟動專案', '管理產品交付', '結束專案'],
        color: 'bg-blue-600'
      },
      {
        id: 'slc3',
        title: '系統設計',
        code: 'SLC3',
        subtitle: '系統生命週期 V3',
        body: 'FDS 專有 SLC3 以規劃迭代（定義—分析—設計—製作）將風險減低並支援微調。',
        stages: ['定義', '分析', '設計', '製作', '優化', '實施'],
        color: 'bg-blue-500'
      },
      {
        id: 'ssadm',
        title: '結構化分析',
        code: 'SSADM',
        subtitle: '關卡式可靠性',
        body: '電腦系統設計的標準方法，將複雜工作分拆為七段可控部分，以利全面掌控。',
        stages: ['可行性', '調查', '需求', '邏輯設計', '實體設計'],
        color: 'bg-indigo-600'
      },
      {
        id: 'rad',
        title: '快速開發',
        code: 'RAD',
        subtitle: '原型速度',
        body: '運用 CASE 工具與用戶驅動原型，將業務決策更快轉化為高品質軟件。',
        stages: ['需求規劃', '用戶設計', '快速構建', '過渡'],
        color: 'bg-purple-600'
      }
    ]
  },
  capture: {}, // filled from en overlay in code below
  focalAi: {}, // placeholder
  caseManagement: {} // placeholder
};

// Fix typo navigate -> 駕馭 (typo fix in support service)
zhHant.services.supportServices[3].desc = '協助駕馭與管理企業級系統變更。';
zhHant.services.closingBody = '準備與香港領先系統集成商優化業務流程？';

const simp = JSON.parse(JSON.stringify(zhHant));
// Minimal trad->simp for services keys touched
function toHans(o) {
  if (typeof o === 'string') {
    return o
      .replace(/專業/g, '专业')
      .replace(/優化/g, '优化')
      .replace(/發揮/g, '发挥')
      .replace(/投資效益/g, '投资效益')
      .replace(/夥伴/g, '伙伴')
      .replace(/釐清/g, '厘清')
      .replace(/維護/g, '维护')
      .replace(/關鍵/g, '关键')
      .replace(/穩定性/g, '稳定性')
      .replace(/盡現/g, '尽现')
      .replace(/熱線/g, '热线')
      .replace(/傳真/g, '传真')
      .replace(/軟件/g, '软件')
      .replace(/診斷/g, '诊断')
      .replace(/應對/g, '应对')
      .replace(/駕馭/g, '驾驭')
      .replace(/變更/g, '变更')
      .replace(/影響/g, '影响')
      .replace(/調校/g, '调校')
      .replace(/以配合/g, '以配合')
      .replace(/週一至五/g, '周一至五')
      .replace(/監察/g, '监察')
      .replace(/方法論/g, '方法论')
      .replace(/開發/g, '开发')
      .replace(/實務/g, '实务')
      .replace(/度身訂製/g, '量身定制')
      .replace(/產品/g, '产品')
      .replace(/嚴謹/g, '严谨')
      .replace(/臻於/g, '臻于')
      .replace(/領先/g, '领先')
      .replace(/集成商/g, '集成商')
      .replace(/業務流程/g, '业务流程')
      .replace(/諮詢/g, '咨询');
  }
  if (Array.isArray(o)) return o.map(toHans);
  if (o && typeof o === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(o)) out[k] = toHans(v);
    return out;
  }
  return o;
}

// For capture, focalAi, caseManagement: read EN and shallow-copy structure with placeholder translate via same function for long strings
// Simpler: copy en JSON files then apply file-specific maps

function overlayFromEn(file, zhPatch) {
  const enPath = path.join(root, 'src/i18n/locales/en', file);
  const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const merged = deepMerge(en, zhPatch);
  return merged;
}

function deepMerge(a, b) {
  if (b === undefined) return a;
  if (Array.isArray(a) && Array.isArray(b)) {
    return b.map((bi, i) => (typeof bi === 'object' && bi !== null && a[i] ? deepMerge(a[i], bi) : bi));
  }
  if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null && !Array.isArray(b)) {
    const out = { ...a };
    for (const [k, v] of Object.entries(b)) {
      out[k] = k in a && typeof a[k] === 'object' && a[k] !== null && typeof v === 'object' && v !== null && !Array.isArray(v)
        ? deepMerge(a[k], v)
        : v ?? a[k];
    }
    return out;
  }
  return b;
}

// PATCH files: services already fully in zhHant.services — write
fs.writeFileSync(
  path.join(root, 'src/i18n/locales/zh-Hant/services.json'),
  JSON.stringify(zhHant.services, null, 2),
  'utf8'
);
fs.writeFileSync(
  path.join(root, 'src/i18n/locales/zh-Hans/services.json'),
  JSON.stringify(toHans(zhHant.services), null, 2),
  'utf8'
);

// capture + focalAi + caseManagement: large patched objects (abbreviated - use overlay with key subsets)
/** Full Traditional capture from en translated */
const captureHant = overlayFromEn('capture.json', {
  pill: 'FOCAL Capture',
  heroHeadlineLead: '從紙本負載',
  heroHeadlineAccent: '到受控數碼檔案。',
  heroParagraph:
    '將紙張與表單數碼化，串連核心應用與流程，減少人手輸入與遺失批次。結合 FOCAL DMS，從採集到封存與搜尋一站式完成。',
  heroParagraphBold: 'FOCAL DMS',
  heroCta: '規劃上線',
  batchLabel: '擷取批次中…',
  verificationLabel: '驗證',
  verificationValue: '已達 QA 準則',
  tabOverview: '概覽',
  tabFeatures: '功能',
  tabSpecifications: '規格',
  tabResources: '資源',
  overviewTitle: '為實際吞吐而設的影像擷取',
  overviewP1Lead: 'FOCAL Capture 減省重複掃描輸入、收緊與 ECM 及個案系統的交接，並以紀律化的接收取代遺失批次。紙本與表單成為團隊可',
  overviewP1Bold: '檢視、分享與分派',
  overviewP1After: '的政策內檔案。',
  overviewP2Lead: '配搭',
  overviewP2Bold: 'FOCAL DMS',
  overviewP2After: '，攝取與檢索共用同一平台—減少轉椅式工作並讓受規管內容的安全敘述更清晰。',
  benefitsHeading: '效益',
  overviewBenefit0: '由首次掃描到封存，端到端影像流程並強化內容與元資料控管。',
  overviewBenefit1: '各部門可依設定路徑擷取，毋須長期依賴人手救火。',
  overviewBenefit2: '由偶發桌面擷取擴展至量產批次；涵蓋紙本與電子來源。',
  overviewBenefit3: '條碼輔助、驗證與 QA 再把關，避免鍵入錯誤向下游蔓延。',
  featuresIntro: '結構化 intake、條碼自動化與驗證，讓下游應用得可靠元資料—而非臆測。',
  feat0Title: '文件擷取',
  feat0Desc: '將紙本數碼化，使內容進入流程而非堆在紙匣。',
  feat1Title: '批次擷取',
  feat1Desc: '將大量掃瞄整理為有序批次，自接收起保持順序。',
  feat2Title: '影像質量調校',
  feat2Desc: '索引用前先調影像，備存更清晰以利營運與稽核。',
  feat3Title: '文件索引',
  feat3Desc: '於入口擷取元資料，以利 DMS 與線內業務系統的可預期搜尋。',
  feat4Title: '提交',
  feat4Desc: '按治理規則將完成批次送至地端或雲端儲存。',
  feat5Title: '條碼辨識',
  feat5Desc: '以一維／二維條碼分隔文件並驅動自動索引，按鍵更少。',
  feat6Title: '驗證',
  feat6Desc: '內容入庫前審視影像質量與欄位值。',
  specLead: '掃描器支援、輸出、與 DMS 配對及部署選項皆可由營運與稽核查核—而非演示承諾。',
  specBlock0Heading: '影像流程',
  specBlock0Body: '支援 TWAIN/ISIS，前處理、條碼分離、輸出 PDF/TIFF/JPEG 與可供搜尋的 PDF 及整合訊息負載。',
  specBlock1Heading: 'FOCAL 平台整合',
  specBlock1Body: '配合 FOCAL DMS，權限與搜尋由接收延伸至封存—減少孤島。',
  specBlock2Heading: '部署模式',
  specBlock2Body: '分站或集中掃描室；規則可中央管理並隨量擴展。',
  specCard0Title: '接收到封存',
  specCard0Desc: '治理與留存自掃描開始—而非待積壓重做後才開始。',
  specCard1Title: '流程契合',
  specCard1Desc: '模板貼近實際工作方式：入口驗證與清楚稽核軌跡。',
  specCard2Title: '吞吐規模',
  specCard2Desc: '由桌面級作業至量產擷取，維持一致元資料模型。',
  specCard3Title: '索引與 QA',
  specCard3Desc: '條碼輔助、欄位檢查與覆核佇列，阻截壞資料進入下游。',
  resourcesHeading: '後續步驟',
  resourcesLead:
    '與我們團隊商討架構、推出與與現場掃描器試運—對齊您已部署或規劃的 FOCAL 套件。',
  resourcesBullet0: '集中與分部部署 footprint 與務實模式。',
  resourcesBullet1: '索引門檻、QA 門檻與 DMS 接收檢查點。',
  resourcesCta: '與專員洽談',
  glanceEyebrow: '一覽',
  glanceHeading: '量產擷取帶來的價值',
  ctaTitle: '更少人手擷取，交接更順暢。',
  ctaSubtitle: '影像與 FOCAL 結合，讓掃描附有元資料、權限與稽核脈絡，符合項目期望。',
  ctaButton: '聯絡團隊'
});

fs.writeFileSync(path.join(root, 'src/i18n/locales/zh-Hant/capture.json'), JSON.stringify(captureHant, null, 2), 'utf8');
fs.writeFileSync(path.join(root, 'src/i18n/locales/zh-Hans/capture.json'), JSON.stringify(toHans(captureHant), null, 2), 'utf8');

// focalAi Trad
const focalHant = overlayFromEn('focalAi.json', {
  pillEyebrow: '方案 / Focal AI',
  pillBadge: 'FDS 自研 · AI 基建',
  heroTitle: '讓交付保持敏捷且穩妥的 AI 基建。',
  heroLead:
    '當 AI 放大專業而非製造噪音，項目才能加速。Focal AI 將模型、模板與審閱紀律收攏到 FDS 自有的統一層。',
  heroSub: '面向系統集成：敏感情境、分段上線與追求清晰落地的持份者。',
  bandImageAlt: '連線與地球俯瞰影像象徵安全、整合的數碼基建',
  bandCaption: '治理界線分明—AI 加速底層，人類仍對結果負責。',
  whatWeDoEyebrow: '我們做什麽',
  whatWeDoTitle: '統一內部基礎，支援 FDS 各項 AI 輔助交付。',
  whatWeDoP1:
    'Focal AI 將提示、流水線與產出物連結到真正上線的方式—顧問與工程師毋須在每次項目重造流程亦能維持一致品質。',
  whatWeDoP2: '它不取代您重視的把關判斷；而是減少其餘環節的摩擦。',
  missionEyebrow: '我們的使命',
  missionTitle: '讓倚賴成果的人員更輕鬆運用 AI 驅動的交付。',
  storyEyebrow: '我們的故事',
  audiencesEyebrow: '對象',
  audiencesTitle: '負責交付的團隊—而非堆砌簡報。',
  emphasisStrip: '當項目需要嚴謹，Focal AI 複利速度—不犧牲安全或一致。',
  diffEyebrow: '為何不同',
  diffTitle: 'Focal AI 刻意聚焦—深鑽交付機制而非追逐表象新奇。',
  principlesEyebrow: '原則',
  principlesTitle: '我們如何評估 Focal AI 的品質',
  cap0Headline: '自研自控',
  cap0Caption: '由 FDS 設計與營運—工具策略與交付方式一致。',
  cap1Headline: '整合',
  cap1Caption: '模型、模板與覆核嵌入例行儀式，而非旁路畫板。',
  cap2Headline: '受控',
  cap2Caption: '針對敏感情境的安全與權限邊界—非消費級預設。',
  outcome0: '加快迭代並維持可見監督',
  outcome1: '敏感情境維持在可信基建內',
  outcome2: '抬高文件、規格與交接的底線水準',
  story0Title: '為何建立',
  story0Body: '交付團隊曾四散試驗 AI。Focal AI 將能力集中於單一內部層，標準化、可稽核並隨項目演進。',
  story1Title: '日常呈現方式',
  story1Body:
    '由規格文件到檢查與綜述，加速可重複工作—並設覆核門檻，核心判斷仍由領隊掌握。',
  story2Title: '不會改變什麽',
  story2Body: '人類對成果的責任。Focal AI 提升吞吐與一致；並不取代對客戶或合規的交代。',
  audience0Title: '交付負責人',
  audience0Body: '共享模板、交接更清晰，減少各工作流重工。',
  audience1Title: '工程與顧問',
  audience1Body: '少用模板時間，多花於架構、整合風險與客製判斷。',
  audience2Title: '客戶贊助人',
  audience2Body: '透明可視—工作在約定範圍，產出可追溯、覆核與簽批。',
  diff0Title: '為系统集成而設',
  diff0Body: '流程對應 SI 現實：供應商協調、文件負荷與分階交付—而非孤立指令。',
  diff1Title: '易於採納',
  diff1Body: '跨項目共享模式—團隊快速上手，無需每次重構提示或治理。',
  diff2Title: '深度聚焦',
  diff2Body: '在項目最耗時之處深掘品質—文件、規格與覆核迴圈—而非追逐每個潮流。',
  pillar0Title: '資料安全',
  pillar0Body: '工作量留在 FDS 可控邊界—配合治理、權限與敏感物料的審慎處理。',
  pillar1Title: '高效率',
  pillar1Body: '可重用模式與自動化遍及交付生命期，降低重工，將時間花在真正推進里程碑的決策。',
  pillar2Title: '一致交付物',
  pillar2Body: '共通標準、模板與覆核檢查點，讓每次釋出版面一致—里程碑之間少一些意外。',
  pillar3Title: 'AI 驅動品質',
  pillar3Body: '現代 AI 協助草擬、檢查與綜述—並由人類覆核確保準確、符合品牌並可投入生產。'
});

fs.writeFileSync(path.join(root, 'src/i18n/locales/zh-Hant/focalAi.json'), JSON.stringify(focalHant, null, 2), 'utf8');
fs.writeFileSync(path.join(root, 'src/i18n/locales/zh-Hans/focalAi.json'), JSON.stringify(toHans(focalHant), null, 2), 'utf8');

const caseHant = overlayFromEn('caseManagement.json', {
  heroEyebrow: '方案 / 工作流程管理',
  heroTitle: '工作流程管理',
  heroLead:
    'FOCAL Workflow 提供統一業務流程平台，提升營運效率，並強化端到端可視性以便監察與控制。',
  overviewEyebrow: '概覽',
  overviewTitle: '監察、分析與決策—主線不散。',
  benefitsEyebrow: '效益',
  benefitsIntro: '當流程執行可被觀察並維持一致時，團隊可獲得的核心價值。',
  featuresEyebrow: '功能',
  featuresTitle: '建模、路由與洞見的平台能力。',
  productNameShort: 'FOCAL Workflows',
  leadRest:
    '透過監察與分析磨利流程—團隊在正確時間取得正確資訊以供信心決策。',
  miniFlowAssign: '指派個案負責人',
  miniFlowReview: '覆核文件',
  miniFlowResolve: '結束個案',
  miniFlowReceived: '已接收請求',
  benefit0Keyword: '快速部署',
  benefit0Detail: '在同一處設計、執行、監察與優化流程。',
  benefit1Keyword: '規則驅動生命週期',
  benefit1Detail: '任務狀態與安全受一致規則約束。',
  benefit2Keyword: '可視與掌控',
  benefit2Detail: '清楚掌握工作負載健康並持續改進流程。',
  benefit3Keyword: '雲端存取',
  benefit3Detail: '跨區任務管理與協作暢順無阻。',
  benefit4Keyword: '多端裝置',
  benefit4Detail: '桌面、手機與平板—緊貼營運現場。',
  benefit5Keyword: '開放標準',
  benefit5Detail: '更易融入現有 IT 環境。',
  benefit6Keyword: '企業規模',
  benefit6Detail: '由試點以至全機構推廣。'
});

// translate feature titles 0..16 individually (abbrev batch)
for (let i = 0; i <= 16; i++) {
  const titles = [
    '雲端集中儲存',
    '流程設計器',
    '規則路由',
    '生命週期維護',
    '個案詳情檢視',
    '搜尋',
    '報表',
    '活動日誌',
    '後續提示',
    '警示',
    '用戶群組管理',
    '角色安全',
    '通知',
    '儀表板',
    '協作',
    '電郵整合',
    '流動能力'
  ];
  const descs = [
    '讓組織內流程一致；雲端部署適合分部辦公。',
    '隨業務需求快速建模與調整流程。',
    '規則與條件動態將個案送至正確佇列處理或覆核。',
    '無需全套重構即可調整階段—政策與效率目標變動時仍可靈活應對。',
    '單一檢視呈現個案動態—發生何事、何人處理、下一步為何。',
    '以個案號、使用者或群組、流程索引及其他結構準則尋找個案。',
    '支援規劃、深入分析及提前發現問題。',
    '防篡改、系統產生日誌紀錄工作、所用工具、派發與時間戳—合乎安全、合規與舉證。',
    '在個案加上提醒讓相關用戶知悉跟進項目與時間。',
    '向須回應或升級的流程參與者發送警示。',
    '建立群組並按角色與邏輯分組指派權限。',
    '權限對應組織角色、安全政策與法规—可按角色區分細緻權限。',
    '當個案或佇列分配至您時即時获知。',
    '單檢視掌握即時個案活動—呈現樽頸並加快流轉。',
    '支援分布式團隊在個案上受控協作—減延誤並交接更清晰。',
    '透過電郵通道發送通知、警示與提醒。',
    '離開桌面仍可於 iPhone、iPad 與 Android 處理。'
  ];
  caseHant[`feature${i}Title`] = titles[i];
  caseHant[`feature${i}Desc`] = descs[i];
}

fs.writeFileSync(path.join(root, 'src/i18n/locales/zh-Hant/caseManagement.json'), JSON.stringify(caseHant, null, 2), 'utf8');
fs.writeFileSync(path.join(root, 'src/i18n/locales/zh-Hans/caseManagement.json'), JSON.stringify(toHans(caseHant), null, 2), 'utf8');

console.log('Wrote zh services, capture, focalAi, caseManagement');
