import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function deepMerge(a, b) {
  if (b === undefined) return a;
  if (Array.isArray(a) && Array.isArray(b)) {
    return b.map((bi, i) => (typeof bi === 'object' && bi !== null && a[i] ? deepMerge(a[i], bi) : bi));
  }
  if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null && !Array.isArray(b)) {
    const out = { ...a };
    for (const [k, v] of Object.entries(b)) {
      out[k] =
        k in a &&
        typeof a[k] === 'object' &&
        a[k] !== null &&
        typeof v === 'object' &&
        v !== null &&
        !Array.isArray(v)
          ? deepMerge(a[k], v)
          : v ?? a[k];
    }
    return out;
  }
  return b;
}

/** @type {Record<string,string>} rudimentary Trad→Simp */
const mapPairs = Object.entries({
  '專為': '专为',
  讓: '让',
  與: '与',
  雲端: '云端',
  擷取: '采集',
  檔案: '档案',
  網站: '网站',
  內容: '内容',
  網頁: '网页',
  模組: '模块',
  發佈: '发布',
  稽核: '审计',
  資訊: '信息',
  組織: '组织',
  監察: '监察',
  優化: '优化',
  數碼: '数码',
  顧客: '顾客',
  擴展: '扩展',
  導覽: '导航'
});

function toHans(s) {
  if (typeof s !== 'string') return s;
  let o = s;
  for (const [t, sv] of mapPairs) {
    o = o.split(t).join(sv);
  }
  return (
    o
      .replace(/臺/g, '台')
      .replace(/國/g, '国')
      .replace(/區/g, '区')
      .replace(/臺/g, '台')
      .replace(/體/g, '体')
      .replace(/務/g, '务')
      .replace(/臺/g, '台')
      .replace(/時/g, '时')
      .replace(/間/g, '间')
      .replace(/關/g, '关')
      .replace(/聯/g, '联')
      .replace(/開/g, '开')
      .replace(/發/g, '发')
      .replace(/經/g, '经')
      .replace(/過/g, '过')
      .replace(/達/g, '达')
      .replace(/複/g, '复')
      .replace(/編/g, '编')
      .replace(/輯/g, '辑')
      .replace(/權/g, '权')
      .replace(/設/g, '设')
      .replace(/證/g, '证')
      .replace(/書/g, '书')
      .replace(/對/g, '对')
      .replace(/護/g, '护')
      .replace(/險/g, '险')
      .replace(/隱/g, '隐')
      .replace(/臺/g, '台')
  );
}

function walkHans(o) {
  if (typeof o === 'string') return toHans(o);
  if (Array.isArray(o)) return o.map(walkHans);
  if (o && typeof o === 'object') {
    const n = {};
    for (const [k, v] of Object.entries(o)) n[k] = walkHans(v);
    return n;
  }
  return o;
}

const dmHantPatch = JSON.parse(`
{
  "heroBadge": "FOCAL 文件管理系統",
  "heroLine1": "機構級",
  "heroLine2Accent": "知識，穩妥守護。",
  "heroP1": "FOCAL 文件管理系統提供具策略與效率的資訊平台，協助組繖將業務過程衍生的無結構資訊迅速轉化為可用的商業內容。",
  "heroP2": "兼具廣泛能力與強大安全／治理機制：集中業務內容以利管理與對內對外發佈協同，並提供工具支援分布式團隊。",
  "heroCta": "索取方案概要",
  "floatingEncryptLabel": "加密",
  "floatingEncryptValue": "待用 AES-256",
  "benefitsSectionTitle": "效益",
  "officialBenefits": [
    {"keyword": "端到端文件生命期管理","detail": "提升安全與管控，並降低未授權或未經批准的變動風險。"},
    {"keyword": "資訊分享更順暢","detail": "增進跨團隊與跨渠道的協作與運營效率。"},
    {"keyword": "雲端交付","detail": "隨時隨地發佈、分享與取用關鍵資訊資產。"},
    {"keyword": "多裝置存取","detail": "桌面、手機與平板保持一致體驗。"},
    {"keyword": "易於使用","detail": "操作流程直觀，利於日常使用推廣。"},
    {"keyword": "統一 FOCAL 平台","detail": "與其他 FOCAL 產品整合，形成一致的資訊主幹與協同。"}
  ],
  "platformEyebrow": "平台概览",
  "platformTitle": "由建立到封存的核心能力",
  "platformP1": "FOCAL 文件管理系統具備端到端生命周期所需能力—由建立到归档均可管理與控管。",
  "platformP2": "以統一儲存將無結構內容化為可查與可用的資訊資產。FOCAL DMS 架構強韌並可延展，適合管理資訊資產規模演進。",
  "capabilitiesEyebrow": "能力",
  "capabilitiesTitle": "功能亮點",
  "capabilitiesLead": "對應產品介紹之重點摘要—實際範疇請與 FDS 項目團隊確認。",
  "intelBandLine1": "運營可視",
  "intelBandAccent": "與治理訊號",
  "complianceTitle": "安全、稽核與合規態勢",
  "complianceBody": "面向嚴謹環境：加密與特權存取縮少曝險；稽核線索與生命週期工具支援可查證的證據鏈而非口頭自述。",
  "badgeAes": "AES-256 加密",
  "badgeAudit": "防篡改稽核日誌",
  "badgeLifecycle": "生命週期狀態管控",
  "specEyebrow": "規格",
  "specTitle": "具代表性的技術基線",
  "specIntro": "以下摘自公版資料—部署或遷移前請與 FDS 項目人員確認現行支援版本與容量規劃。",
  "ctaTitle": "整合數碼資產",
  "ctaBody": "在香港廣為採用的 FOCAL 基礎上，同時對齊政策、可搜索性與協同。",
  "ctaButton": "聯絡專家"
}`);

dmHantPatch.platformEyebrow = '平台概覽';

dmHantPatch.intelligenceHighlights = [
  '涵蓋由建立協作以至歸檔與報廢紀律的全生命期。',
  '雲友好的發佈與分享模型，適用關鍵資訊資產。',
  'Thin-client／Web 適合分部團隊與混合終端環境。',
  '具治理轉換的狀態流轉（如草稿→審閱→發佈→關閉）。',
  '防篡改稽核日誌，支援安全強制與合規核查。',
  '受控分享可設到期並主動提示共享入站。',
  '儀表板呈現近期活動、檔案與共享資料夾。',
  '可与 FOCAL 套件協同作統一協作主幹。'
];

dmHantPatch.specLines = [
  '平台：Red Hat Enterprise Linux 6 或以上；Windows Server 2008 或以上。',
  '運行環境：Java JDK/JRE 1.6 或以上。',
  '應用伺服器：JBoss 7 或以上。',
  '資料庫：MySQL 5.5+；Microsoft SQL Server 2008+；Oracle Database 11g 或以上。',
  '瀏覽器（公版）：Apple Safari 7+；Google Chrome 38+；Microsoft IE 8+；Mozilla Firefox 31+。'
];

dmHantPatch.productFeatures = [
  { title: '雲端集中儲存', desc: '把分散团队的檔案集中至受管控儲藏庫—保留、權限與搜尋保持一致。' },
  { title: '256 位加密', desc: '伺服器上以 AES 256 位為資訊靜態加密。' },
  { title: '資料夾樹狀結構', desc: '於受管控根之下建立資料夾層級並對齊組織工作方式調整權限。' },
  { title: '文件管制', desc: '細粒度權限如讀、寫與删除，確保敏感文件只看該看的對象。' },
  { title: '角色式安全', desc: '對應使用者職務角色，對齊目標政策、資安與規範預期。' },
  { title: '用戶群組管理', desc: '建立群組並指派使用者，按角色或邏輯分區控制權限。' },
  { title: '版本控制', desc: '紀錄修訂歷史、回滾與纠错。' },
  { title: '签入／签出', desc: '同一时间僅单一使用者編輯，降低衝突與並行覆寫。' },
  { title: '搜尋', desc: '以名稱、描述或索引字段尋找資料夾與文件。' },
  { title: '內容／關鍵字搜尋', desc: '以詞或片語深挖文件內文。' },
  { title: '自訂文件索引', desc: '按文件類型設定歸檔索引並復用以利搜尋與一致性。' },
  { title: '稽核日誌', desc: '系统產生、防篡改的登入、读取、搜寻、編輯与刪除等动作紀録。' },
  { title: '分享', desc: '在安全框與可有期限下分享資料夾與文件。' },
  { title: '儀表板', desc: '一覽活動並捷徑到近期文件與共享資料夾。' },
  { title: '通知', desc: '當對象向您分享資料夾或文件時提示。' },
  { title: '生命期維護', desc: '定義草稿、覆核、發佈、關閉等狀態及轉移動作。' }
];

// FixTraditional typos manually
dmHantPatch.heroP1 = dmHantPatch.heroP1.replace('組繖', '組織');

for (let i = 0; i < dmHantPatch.productFeatures.length; i++) {
  dmHantPatch.productFeatures[i].desc = dmHantPatch.productFeatures[i].desc
    .replace('团队', '團隊')
    .replace('签入', '簽入')
    .replace('签出', '簽出')
    .replace('单一', '單一')
    .replace('系统', '系統')
    .replace('紀録', '紀錄')
    .replace('读取', '讀取')
    .replace('搜寻', '搜尋')
    .replace('与刪除', '與刪除')
    .replace('紀錄.', '紀錄。')
    .replace('伺服器上以', '在伺服器上以');
}

dmHantPatch.productFeatures[0].desc =
  '把分散在各地的檔案彙總到受管制儲庫—備援、權限與搜尋統一於一處。';

const enDm = JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/locales/en/documentManagement.json'), 'utf8'));
const zhHantDm = deepMerge(enDm, dmHantPatch);
fs.writeFileSync(path.join(root, 'src/i18n/locales/zh-Hant/documentManagement.json'), JSON.stringify(zhHantDm, null, 2), 'utf8');
fs.writeFileSync(path.join(root, 'src/i18n/locales/zh-Hans/documentManagement.json'), JSON.stringify(walkHans(zhHantDm), null, 2), 'utf8');

/** WCM */
const wcmHant = JSON.parse(`{
  "heroBadge": "FOCAL 網站內容管理",
  "heroLine1": "掌握您的",
  "heroLine2Accent": "數碼門面。",
  "heroCtaPrimary": "預約示範",
  "exploreEyebrow": "探索",
  "exploreTitle": "團隊如何運用 FOCAL WCM",
  "tabOverview": "概覽",
  "tabPublishingFlow": "發佈流程",
  "overviewChannelTitle": "適合多渠道的網頁運營",
  "overviewChannelLead": "FOCAL WCM 將建立、管理及發佈網頁內容流程化—在正確時間把正確訊息交到正確對象——並提升編采生產力。",
  "overviewChannelUnified": "跨通道呈現一致體驗；日常更新可由業務團隊主導而非長期卡在 IT backlog。",
  "officialBenefits": [
    "以最少磨擦發佈或更新頁面。",
    "在同一技術堆疊控管視覺與文字內容。",
    "全站搜索加速查找內容。",
    "按日期、時間或可重複排程發佈。",
    "以擴展模組能力提升功能而毋須推倒核心。"
  ],
  "capabilitiesEyebrow": "能力",
  "modulesSidebarTitle": "模組與組件",
  "modulesSidebarSummary": "編采工具備妥現成組件——導航、媒體、搜索、聚合——協助發佈一致網頁並減少對 IT 的串連依賴。",
  "modulesSidebarBenefitsTitle": "主要益處",
  "modulesSidebarBenefits": [
    "發佈與排程低摩擦完成。",
    "版型與內容一併規劃。",
    "全站搜索並保留擴展空間。"
  ],
  "modulesFooterNote": "模組對照公開清單—實際套裝請與 FDS 確認。",
  "workflowSteps": [
    {"step": "創作組裝","desc": "依權限制作文章並插入模組化元件（焦點新聞、Banner、HTML 區塊）。"},
    {"step": "審閱與就位","desc": "編輯校對語調、鏈結與顯示位置再嵌入導航插槽——維護對外公訊一致性。"},
    {"step": "排程發佈","desc": "以排程對齊推行或維護窗口——替代手動重佈線。"},
    {"step": "歸檔保存","desc": "自動化歸檔按時間保留历史頁，網際表面保持新鮮與公信。"}
  ],
  "channelHighlightTitleLine1": "為編采速度而建",
  "channelHighlightTitleAccent": "並兼顧交付治理",
  "channelHighlights": [
    "以單一整合主幹承載沉浸式體驗—而非零碎微站碎片化。",
    "業務主導的發佈週期將日常調整移出中央 IT backlog 風險。",
    "可組合模組（投票、信息流、姊妹文、嵌入式頁框）延展功能且維持範本治理。",
    "排程加歸檔兼顧外顯新意與內部備存紀律。",
    "集中儲存維護可復用版型、更可預見的部署並減少孤雪環境。"
  ],
  "guardrailsTitle": "運維護欄",
  "guardrailsBody": "多用戶、模組化位置、排程與歸檔流程協同——貢獻者可快速進展同時對「線上」「暫存」「必須保留」保持可視。",
  "guardrailAccount": "範圍化編輯帳號",
  "guardrailSchedule": "定時發佈窗口",
  "guardrailRetention": "排程歸檔保存",
  "ctaBandTitle": "發佈有把握的網頁體驗",
  "ctaBandLead": "讓編采自治與 FOCAL 模組深度兼備——香港企業在整體產品線所期待的兼得。",
  "ctaBandButton": "聯絡顧問",
  "heroVisualCaption": "沉浸式數碼內容"
}`);

// fix typos
wcmHant.workflowSteps[3].desc = wcmHant.workflowSteps[3].desc.replace('历史', '歷史');
wcmHant.channelHighlights[4] = wcmHant.channelHighlights[4].replace('孤雪', 'snowflake ');
wcmHant.channelHighlights[4] = '集中儲存支撐可重複版面、更可預測部署並較少「雪花」環境。';

const wcmFeatures = [
  { title: '集中儲存', desc: '頁面、模組與媒體在受控環境中流轉並維護呈現一致性。' },
  { title: '網頁內容歸檔', desc: '按月份／年度等排程自動歸檔—線上保持更新同時備存歷史。' },
  { title: '橫幅與資訊流管理', desc: '可依業務調整視窗曝光、總展示或總點擊上限與多樣投放位。' },
  { title: '自訂 HTML', desc: '在結構化元件之上另建自訂 HTML 模組承載版面彈性。' },
  { title: '多帳號', desc: '多組編輯帳號僅改所屬區塊以降低誤編風險。' },
  { title: '選單管理', desc: '現成選單範本定義網站導航而毋須反覆手刻標記。' },
  { title: '最多瀏覽與最新消息', desc: '同列熱門與最新內容維持高關注度。' },
  { title: '即時焦點', desc: '依配置分類／欄目拉取項目作快訊呈現。' },
  { title: '投票', desc: '在前端模板位置呈現投票元件輸入。' },
  { title: '隨機圖片', desc: '輪替指定資料夾影像讓版面保持新鮮。' },
  { title: '相關條目', desc: '以關鍵字推薦姊妹文—減少逐篇手動互連。' },
  { title: '搜尋', desc: '訪客可從現有位置快速搜尋並跳到結果。' },
  { title: '欄目', desc: '依站點結構列出文章欄目—瀏覽貼合分類。' },
  { title: '聚合', desc: '呈現可供向外聚合的 feed 類型。' },
  { title: '嵌入式頁框', desc: '於模組位置以 URL 嵌入另一頁—銜接舊系或外部微站。' }
];

wcmHant.productFeatures = wcmFeatures;

const enWcm = JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/locales/en/webContentManagement.json'), 'utf8'));
const zhHantWcm = deepMerge(enWcm, wcmHant);
fs.writeFileSync(path.join(root, 'src/i18n/locales/zh-Hant/webContentManagement.json'), JSON.stringify(zhHantWcm, null, 2), 'utf8');
fs.writeFileSync(path.join(root, 'src/i18n/locales/zh-Hans/webContentManagement.json'), JSON.stringify(walkHans(zhHantWcm), null, 2), 'utf8');

console.log('Wrote zh documentManagement + webContentManagement');
