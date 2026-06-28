/**
 * Espresso Brew Log - Core Logic & UI Bindings
 */

// --- Initial Seed Data (Example data for new users) ---
const SEED_DATA = {
  beans: [
    {
      id: "bean-seed-1",
      name: "衣索比亞 耶加雪菲 沃卡 G1",
      roaster: "微美精品咖啡",
      roastLevel: "light",
      roastDate: "2026-06-15",
      weightInitial: 250,
      weightRemaining: 196,
      notes: "日曬處理法，風味帶有強烈柑橘、茉莉花香、檸檬塔與紅豆甜感。",
      finished: false
    },
    {
      id: "bean-seed-2",
      name: "經典黃金義式配方豆",
      roaster: "湛盧咖啡",
      roastLevel: "medium-dark",
      roastDate: "2026-06-10",
      weightInitial: 500,
      weightRemaining: 420,
      notes: "水洗與日曬拼配，風味偏向堅果、黑巧克力、焦糖甜感，醇厚度高。",
      finished: false
    }
  ],
  logs: [
    {
      id: "log-seed-1",
      beanId: "bean-seed-1",
      date: "2026-06-25T08:30",
      dose: 18.0,
      yield: 36.5,
      time: 27.5,
      grind: "J-Max 1.4.2",
      temp: 93.0,
      pressure: 9.0,
      preinfusion: 3.0,
      rating: 5,
      acidity: 8,
      sweetness: 8,
      bitterness: 3,
      body: 6,
      notes: "非常成功的沖煮！茉莉花香明顯，前段是明亮的萊姆酸，中後段果蜜甜感持久，完全無通道效應。"
    },
    {
      id: "log-seed-2",
      beanId: "bean-seed-1",
      date: "2026-06-26T09:15",
      dose: 18.0,
      yield: 38.0,
      time: 24.5,
      grind: "J-Max 1.4.5",
      temp: 93.0,
      pressure: 8.5,
      preinfusion: 2.0,
      rating: 3,
      acidity: 9,
      sweetness: 5,
      bitterness: 4,
      body: 4,
      notes: "刻度調粗了一格，萃取流速稍快，導致有點萃取不足。酸質略顯尖銳，醇厚度降低，需要把刻度微調回去。"
    },
    {
      id: "log-seed-3",
      beanId: "bean-seed-2",
      date: "2026-06-27T10:00",
      dose: 20.0,
      yield: 40.0,
      time: 29.0,
      grind: "J-Max 1.3.8",
      temp: 91.5,
      pressure: 9.0,
      preinfusion: 4.0,
      rating: 4,
      acidity: 2,
      sweetness: 7,
      bitterness: 6,
      body: 9,
      notes: "湛盧配方豆。醇厚度極高，如糖漿般的口感。焦糖與堅果風味濃郁，苦甜平衡，適合作為拿鐵基底。"
    }
  ]
};

// --- Application State ---
let state = {
  beans: [],
  logs: [],
  filters: {
    beanStatus: "active", // active | finished | all
    searchQuery: "",
    beanId: "",
    rating: ""
  }
};

// --- Global UI elements ---
const DOM = {
  // Stats
  statTotalBrews: document.getElementById("stat-total-brews"),
  statAvgRating: document.getElementById("stat-avg-rating"),
  statActiveBeans: document.getElementById("stat-active-beans"),
  statAvgTime: document.getElementById("stat-avg-time"),
  trendChart: document.getElementById("trend-chart"),

  // Stopwatch
  swTime: document.getElementById("sw-time"),
  swBtnStart: document.getElementById("sw-btn-start"),
  swBtnPause: document.getElementById("sw-btn-pause"),
  swBtnReset: document.getElementById("sw-btn-reset"),
  swBtnLog: document.getElementById("sw-btn-log"),
  swLoggedVal: document.getElementById("sw-logged-val"),
  swGlow: document.getElementById("stopwatch-glow"),

  // Bean Inventory
  beanList: document.getElementById("bean-list"),
  btnAddBean: document.getElementById("btn-add-bean"),
  beanFilterChips: document.querySelectorAll(".bean-filters .filter-chip"),
  
  // History timeline
  logTimeline: document.getElementById("log-timeline"),
  btnAddLog: document.getElementById("btn-add-log"),
  searchLogs: document.getElementById("search-logs"),
  filterBeanSelect: document.getElementById("filter-bean-select"),
  filterRatingSelect: document.getElementById("filter-rating-select"),

  // Dialogs
  dialogBean: document.getElementById("dialog-bean"),
  formBean: document.getElementById("form-bean"),
  beanIdInput: document.getElementById("bean-id"),
  beanNameInput: document.getElementById("bean-name"),
  beanRoasterInput: document.getElementById("bean-roaster"),
  beanRoastLevelSelect: document.getElementById("bean-roast-level"),
  beanRoastDateInput: document.getElementById("bean-roast-date"),
  beanWeightInitialInput: document.getElementById("bean-weight-initial"),
  beanNotesInput: document.getElementById("bean-notes"),
  btnCloseBean: document.getElementById("btn-close-bean"),
  dialogBeanTitle: document.getElementById("dialog-bean-title"),

  dialogLog: document.getElementById("dialog-log"),
  formLog: document.getElementById("form-log"),
  logIdInput: document.getElementById("log-id"),
  logBeanIdSelect: document.getElementById("log-bean-id"),
  logDoseInput: document.getElementById("log-dose"),
  logYieldInput: document.getElementById("log-yield"),
  logTimeInput: document.getElementById("log-time"),
  logGrindInput: document.getElementById("log-grind"),
  logTempInput: document.getElementById("log-temp"),
  logPressureInput: document.getElementById("log-pressure"),
  logPreinfusionInput: document.getElementById("log-preinfusion"),
  logDateInput: document.getElementById("log-date"),
  logNotesInput: document.getElementById("log-notes"),
  logRatingInput: document.getElementById("log-rating"),
  logDeductStockCheckbox: document.getElementById("log-deduct-stock"),
  btnCloseLog: document.getElementById("btn-close-log"),
  dialogLogTitle: document.getElementById("dialog-log-title"),
  starPicker: document.getElementById("star-picker"),

  // Data Export/Import
  btnExport: document.getElementById("btn-export"),
  btnImportTrigger: document.getElementById("btn-import-trigger"),
  importFileInput: document.getElementById("import-file"),
  
  // Toast
  toast: document.getElementById("toast")
};

// --- Storage Handler ---
const Storage = {
  load() {
    try {
      const beansData = localStorage.getItem("espresso_beans");
      const logsData = localStorage.getItem("espresso_logs");
      
      if (beansData && logsData) {
        state.beans = JSON.parse(beansData);
        state.logs = JSON.parse(logsData);
      } else {
        // Seed first-time user
        state.beans = [...SEED_DATA.beans];
        state.logs = [...SEED_DATA.logs];
        this.save();
      }
    } catch (e) {
      console.error("讀取 LocalStorage 發生錯誤，初始化為空資料庫", e);
      state.beans = [];
      state.logs = [];
    }
  },
  
  save() {
    try {
      localStorage.setItem("espresso_beans", JSON.stringify(state.beans));
      localStorage.setItem("espresso_logs", JSON.stringify(state.logs));
    } catch (e) {
      showToast("儲存失敗：空間不足或隱私模式限制", "danger");
    }
  }
};

// --- Toast notification utility ---
function showToast(message, type = "success") {
  DOM.toast.textContent = message;
  DOM.toast.className = `toast show`;
  if (type === "danger") {
    DOM.toast.style.borderColor = "var(--color-danger)";
  } else {
    DOM.toast.style.borderColor = "var(--border-focus)";
  }
  
  setTimeout(() => {
    DOM.toast.classList.remove("show");
  }, 3000);
}

// --- Stopwatch (Timer) Control ---
const stopwatch = {
  startTime: 0,
  elapsedTime: 0,
  timerInterval: null,
  running: false,
  loggedSeconds: 0,

  start() {
    if (this.running) return;
    this.running = true;
    this.startTime = Date.now() - this.elapsedTime;
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      this.updateDisplay();
    }, 10); // Update every 10ms for centisecond precision
    
    DOM.swBtnStart.disabled = true;
    DOM.swBtnPause.disabled = false;
    DOM.swGlow.classList.add("running");
  },

  pause() {
    if (!this.running) return;
    this.running = false;
    clearInterval(this.timerInterval);
    this.loggedSeconds = parseFloat((this.elapsedTime / 1000).toFixed(2));
    
    DOM.swBtnStart.disabled = false;
    DOM.swBtnPause.disabled = true;
    DOM.swGlow.classList.remove("running");
    
    // Enable "Log this Brew" shortcut
    DOM.swBtnLog.disabled = false;
    DOM.swLoggedVal.textContent = this.loggedSeconds.toFixed(1);
  },

  reset() {
    this.running = false;
    clearInterval(this.timerInterval);
    this.elapsedTime = 0;
    this.loggedSeconds = 0;
    this.updateDisplay();
    
    DOM.swBtnStart.disabled = false;
    DOM.swBtnPause.disabled = true;
    DOM.swBtnLog.disabled = true;
    DOM.swGlow.classList.remove("running");
  },

  updateDisplay() {
    let tempTime = this.elapsedTime;
    const ms = Math.floor((tempTime % 1000) / 10);
    tempTime = Math.floor(tempTime / 1000);
    const sec = tempTime % 60;
    const min = Math.floor(tempTime / 60);

    const format = (num) => String(num).padStart(2, "0");
    DOM.swTime.textContent = `${format(min)}:${format(sec)}.${format(ms)}`;
  }
};

// --- SVG Chart Renderer ---
const ChartRenderer = {
  render(logs) {
    if (!logs || logs.length === 0) {
      DOM.trendChart.innerHTML = `<div class="empty-state">尚無數據繪製圖表</div>`;
      return;
    }

    // Get the last 10 logs in chronological order
    const chartLogs = [...logs]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-10);

    const width = 360;
    const height = 100;
    const paddingLeft = 25;
    const paddingRight = 10;
    const paddingTop = 15;
    const paddingBottom = 15;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Y values: Extraction time (seconds) range 15 to 45s for scale
    const minYVal = 15;
    const maxYVal = 45;

    // Map time data to SVG coordinates
    const getX = (index) => {
      if (chartLogs.length <= 1) return paddingLeft + chartWidth / 2;
      return paddingLeft + (index / (chartLogs.length - 1)) * chartWidth;
    };
    
    const getY = (timeVal) => {
      // Clamp time value between minYVal and maxYVal for graphing
      const clamped = Math.max(minYVal, Math.min(maxYVal, timeVal));
      return paddingTop + chartHeight - ((clamped - minYVal) / (maxYVal - minYVal)) * chartHeight;
    };

    // Ideal range box coordinates (25s - 30s)
    const idealY1 = getY(30);
    const idealY2 = getY(25);
    const idealBoxHeight = idealY2 - idealY1;

    let svgHtml = `<svg class="chart-svg" viewBox="0 0 ${width} ${height}">`;

    // 1. Draw Ideal Zone Background (25-30s Sweet Spot)
    svgHtml += `
      <rect x="${paddingLeft}" y="${idealY1}" width="${chartWidth}" height="${idealBoxHeight}" 
        fill="rgba(128, 164, 117, 0.08)" />
      <line x1="${paddingLeft}" y1="${idealY1}" x2="${width - paddingRight}" y2="${idealY1}" 
        stroke="rgba(128, 164, 117, 0.2)" stroke-dasharray="2 2" stroke-width="1" />
      <line x1="${paddingLeft}" y1="${idealY2}" x2="${width - paddingRight}" y2="${idealY2}" 
        stroke="rgba(128, 164, 117, 0.2)" stroke-dasharray="2 2" stroke-width="1" />
    `;

    // 2. Draw Y-Axis Labels
    const yGridValues = [20, 25, 30, 35, 40];
    yGridValues.forEach(val => {
      const y = getY(val);
      svgHtml += `
        <text x="18" y="${y + 3}" class="chart-label" text-anchor="end">${val}s</text>
        <line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" class="chart-grid-line" />
      `;
    });

    // 3. Draw Trend Line
    let pathD = "";
    chartLogs.forEach((log, idx) => {
      const x = getX(idx);
      const y = getY(log.time);
      if (idx === 0) pathD += `M ${x} ${y}`;
      else pathD += ` L ${x} ${y}`;
    });

    if (chartLogs.length > 0) {
      svgHtml += `<path d="${pathD}" class="chart-line" />`;
    }

    // 4. Draw Data Points (color code based on rating)
    chartLogs.forEach((log, idx) => {
      const x = getX(idx);
      const y = getY(log.time);
      
      // Determine point color based on rating stars
      let colorClass = "var(--color-primary)";
      if (log.rating === 5) colorClass = "var(--color-warning)"; // Gold
      else if (log.rating <= 2) colorClass = "var(--color-danger)"; // Red alert

      svgHtml += `
        <circle cx="${x}" cy="${y}" r="4.5" fill="${colorClass}" stroke="var(--bg-card)" stroke-width="1.5" class="chart-point">
          <title>${log.time}秒 - 評分: ${log.rating}★ (${new Date(log.date).toLocaleDateString()})</title>
        </circle>
      `;
    });

    // 5. Bottom Axis Line
    svgHtml += `
      <line x1="${paddingLeft}" y1="${height - paddingBottom}" x2="${width - paddingRight}" y2="${height - paddingBottom}" class="chart-axis-line" />
      <text x="${paddingLeft + chartWidth/2}" y="${height - 2}" class="chart-label" text-anchor="middle">近期沖煮時間趨勢 (綠色為 25-30 秒甜蜜區)</text>
    </svg>`;

    DOM.trendChart.innerHTML = svgHtml;
  }
};

// --- Statistics Updater ---
const StatsManager = {
  update() {
    const total = state.logs.length;
    DOM.statTotalBrews.textContent = total;

    // Active beans
    const activeBeans = state.beans.filter(b => !b.finished).length;
    DOM.statActiveBeans.textContent = activeBeans;

    if (total === 0) {
      DOM.statAvgRating.innerHTML = `0.0 <span class="star-mini">★</span>`;
      DOM.statAvgTime.textContent = `0.0s`;
      ChartRenderer.render([]);
      return;
    }

    // Avg rating
    const ratingSum = state.logs.reduce((acc, log) => acc + log.rating, 0);
    const avgRating = (ratingSum / total).toFixed(1);
    DOM.statAvgRating.innerHTML = `${avgRating} <span class="star-mini">★</span>`;

    // Avg extraction time
    const timeSum = state.logs.reduce((acc, log) => acc + log.time, 0);
    const avgTime = (timeSum / total).toFixed(1);
    DOM.statAvgTime.textContent = `${avgTime}s`;

    // Trend Chart
    ChartRenderer.render(state.logs);
  }
};

// --- Beans Inventory UI Render ---
const BeansManager = {
  render() {
    const container = DOM.beanList;
    container.innerHTML = "";

    let filteredBeans = state.beans;
    if (state.filters.beanStatus === "active") {
      filteredBeans = state.beans.filter(b => !b.finished);
    } else if (state.filters.beanStatus === "finished") {
      filteredBeans = state.beans.filter(b => b.finished);
    }

    if (filteredBeans.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>沒有符合條件的咖啡豆資料</p>
        </div>`;
      return;
    }

    // Render list
    filteredBeans.forEach(bean => {
      const item = document.createElement("div");
      item.className = "bean-item";
      
      // Stock gauge
      const initial = bean.weightInitial || 250;
      const remaining = Math.max(0, bean.weightRemaining ?? 250);
      const pct = Math.round((remaining / initial) * 100);
      const isLow = pct < 20;

      // Translate roast level
      const roastLabels = {
        light: "淺焙",
        medium: "中焙",
        "medium-dark": "中深",
        dark: "深焙"
      };
      
      item.innerHTML = `
        <div class="bean-item-header">
          <div class="bean-meta">
            <div class="bean-title-line">
              <span class="bean-name">${escapeHtml(bean.name)}</span>
              <span class="badge badge-${bean.roastLevel}">${roastLabels[bean.roastLevel]}</span>
            </div>
            <span class="bean-roaster">${escapeHtml(bean.roaster || "無標記烘焙商")} • 烘焙日: ${bean.roastDate || "未知"}</span>
          </div>
          <div class="bean-actions">
            <button class="btn-icon btn-toggle-finished" data-id="${bean.id}" title="${bean.finished ? "標記為現役中" : "標記為已喝完"}">
              ${bean.finished ? `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.67-.7" />
                </svg>
              ` : `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              `}
            </button>
            <button class="btn-icon btn-edit-bean" data-id="${bean.id}" title="編輯咖啡豆">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
              </svg>
            </button>
            <button class="btn-icon btn-icon-danger btn-delete-bean" data-id="${bean.id}" title="刪除咖啡豆">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="bean-stock-bar-wrapper">
          <div class="progress-track" title="庫存剩餘: ${pct}%">
            <div class="progress-fill ${isLow ? 'low' : ''}" style="width: ${pct}%"></div>
          </div>
          <span class="bean-stock-text">${remaining}g / ${initial}g</span>
        </div>
      `;

      // Bind button events
      item.querySelector(".btn-toggle-finished").addEventListener("click", () => this.toggleFinished(bean.id));
      item.querySelector(".btn-edit-bean").addEventListener("click", () => this.openEditDialog(bean));
      item.querySelector(".btn-delete-bean").addEventListener("click", () => this.delete(bean.id));

      container.appendChild(item);
    });

    // Sync select dropdowns
    this.updateDropdowns();
  },

  updateDropdowns() {
    const activeBeans = state.beans.filter(b => !b.finished);
    
    // 1. Filter dropdown in main history
    const oldFilterVal = DOM.filterBeanSelect.value;
    DOM.filterBeanSelect.innerHTML = '<option value="">所有咖啡豆</option>';
    state.beans.forEach(b => {
      const opt = document.createElement("option");
      opt.value = b.id;
      opt.textContent = `${b.name} (${b.finished ? '已喝完' : '現役'})`;
      DOM.filterBeanSelect.appendChild(opt);
    });
    DOM.filterBeanSelect.value = oldFilterVal;

    // 2. Select dropdown in form
    DOM.logBeanIdSelect.innerHTML = '<option value="" disabled selected>-- 請選擇咖啡豆 --</option>';
    activeBeans.forEach(b => {
      const opt = document.createElement("option");
      opt.value = b.id;
      opt.textContent = `${b.name} (剩餘 ${Math.max(0, b.weightRemaining)}g)`;
      DOM.logBeanIdSelect.appendChild(opt);
    });
  },

  toggleFinished(id) {
    const bean = state.beans.find(b => b.id === id);
    if (bean) {
      bean.finished = !bean.finished;
      Storage.save();
      this.render();
      StatsManager.update();
      showToast(bean.finished ? "咖啡豆已標記為喝完！" : "咖啡豆已放回現役清單。");
    }
  },

  openEditDialog(bean) {
    DOM.dialogBeanTitle.textContent = "修改咖啡豆資料";
    DOM.beanIdInput.value = bean.id;
    DOM.beanNameInput.value = bean.name;
    DOM.beanRoasterInput.value = bean.roaster || "";
    DOM.beanRoastLevelSelect.value = bean.roastLevel;
    DOM.beanRoastDateInput.value = bean.roastDate || "";
    DOM.beanWeightInitialInput.value = bean.weightInitial;
    DOM.beanNotesInput.value = bean.notes || "";
    
    DOM.dialogBean.showModal();
  },

  delete(id) {
    const count = state.logs.filter(l => l.beanId === id).length;
    let confirmMsg = "確認要刪除這包咖啡豆嗎？";
    if (count > 0) {
      confirmMsg = `這包咖啡豆有 ${count} 筆相關聯的沖煮紀錄。刪除它將會使該歷史紀錄無咖啡豆關聯，確認刪除嗎？`;
    }
    
    if (confirm(confirmMsg)) {
      state.beans = state.beans.filter(b => b.id !== id);
      Storage.save();
      this.render();
      LogsManager.render();
      StatsManager.update();
      showToast("咖啡豆已刪除", "success");
    }
  }
};

// --- Brew Logs UI Render ---
const LogsManager = {
  render() {
    const container = DOM.logTimeline;
    container.innerHTML = "";

    // 1. Filters & Search Logic
    let filteredLogs = [...state.logs];

    // Search query
    const q = state.filters.searchQuery.toLowerCase().trim();
    if (q) {
      filteredLogs = filteredLogs.filter(log => {
        const bean = state.beans.find(b => b.id === log.beanId);
        const nameMatch = bean ? bean.name.toLowerCase().includes(q) : false;
        const notesMatch = log.notes ? log.notes.toLowerCase().includes(q) : false;
        const grindMatch = log.grind ? log.grind.toLowerCase().includes(q) : false;
        return nameMatch || notesMatch || grindMatch;
      });
    }

    // Bean ID filter
    if (state.filters.beanId) {
      filteredLogs = filteredLogs.filter(log => log.beanId === state.filters.beanId);
    }

    // Rating filter
    if (state.filters.rating) {
      const minRating = parseInt(state.filters.rating);
      if (minRating === 5) {
        filteredLogs = filteredLogs.filter(log => log.rating === 5);
      } else {
        filteredLogs = filteredLogs.filter(log => log.rating >= minRating);
      }
    }

    // 2. Sort by date descending
    filteredLogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filteredLogs.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>沒有符合篩選條件的沖煮紀錄</p>
        </div>`;
      return;
    }

    // 3. Render items
    filteredLogs.forEach(log => {
      const bean = state.beans.find(b => b.id === log.beanId);
      const beanName = bean ? bean.name : "未知咖啡豆（已刪除）";
      
      const ratio = log.dose ? (log.yield / log.dose).toFixed(1) : "0.0";
      
      const item = document.createElement("article");
      item.className = "log-item";
      
      const formattedDate = new Date(log.date).toLocaleString('zh-TW', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const stars = "★".repeat(log.rating) + "☆".repeat(5 - log.rating);

      item.innerHTML = `
        <div class="log-summary">
          <div class="log-row-1">
            <span class="log-bean-name">${escapeHtml(beanName)}</span>
            <span class="log-stars">${stars}</span>
          </div>
          <div class="log-row-2">
            <div class="log-params">
              <span class="log-param-tag">粉水比 <strong>1:${ratio}</strong> (${log.dose}g → ${log.yield}g)</span>
              <span class="log-param-tag">萃取 <strong>${log.time}s</strong></span>
              ${log.grind ? `<span class="log-param-tag">研磨度 <strong>${escapeHtml(log.grind)}</strong></span>` : ''}
            </div>
            <span class="log-date">${formattedDate}</span>
          </div>
        </div>
        
        <div class="log-details">
          <div class="log-details-content">
            <div class="log-extra-specs">
              <div class="spec-item">
                <span class="spec-label">水溫</span>
                <span class="spec-val">${log.temp ? log.temp + ' °C' : '未記錄'}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">壓力</span>
                <span class="spec-val">${log.pressure ? log.pressure + ' bar' : '未記錄'}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">預浸時間</span>
                <span class="spec-val">${log.preinfusion ? log.preinfusion + ' 秒' : '無'}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">粉量與產出</span>
                <span class="spec-val">${log.dose}g / ${log.yield}g</span>
              </div>
            </div>

            <div class="log-flavor-balance">
              <div class="flavor-row">
                <span class="flavor-name">酸度 Acidity</span>
                <div class="flavor-track"><div class="flavor-fill acidity" style="width: ${log.acidity * 10}%"></div></div>
                <span class="flavor-val">${log.acidity}</span>
              </div>
              <div class="flavor-row">
                <span class="flavor-name">甜度 Sweetness</span>
                <div class="flavor-track"><div class="flavor-fill sweetness" style="width: ${log.sweetness * 10}%"></div></div>
                <span class="flavor-val">${log.sweetness}</span>
              </div>
              <div class="flavor-row">
                <span class="flavor-name">苦度 Bitterness</span>
                <div class="flavor-track"><div class="flavor-fill bitterness" style="width: ${log.bitterness * 10}%"></div></div>
                <span class="flavor-val">${log.bitterness}</span>
              </div>
              <div class="flavor-row">
                <span class="flavor-name">醇厚度 Body</span>
                <div class="flavor-track"><div class="flavor-fill body" style="width: ${log.body * 10}%"></div></div>
                <span class="flavor-val">${log.body}</span>
              </div>
            </div>

            ${log.notes ? `<div class="log-notes-section">${escapeHtml(log.notes)}</div>` : ''}

            <div class="log-actions">
              <button class="btn btn-secondary btn-sm btn-edit-log" data-id="${log.id}">
                編輯
              </button>
              <button class="btn btn-danger btn-sm btn-delete-log" data-id="${log.id}">
                刪除
              </button>
            </div>
          </div>
        </div>
      `;

      // Expand/Collapse click bind (only on log-summary click)
      item.querySelector(".log-summary").addEventListener("click", (e) => {
        // Prevent trigger if clicking on something else
        item.classList.toggle("expanded");
      });

      // Bind actions
      item.querySelector(".btn-edit-log").addEventListener("click", () => this.openEditDialog(log));
      item.querySelector(".btn-delete-log").addEventListener("click", () => this.delete(log.id));

      container.appendChild(item);
    });
  },

  openEditDialog(log) {
    DOM.dialogLogTitle.textContent = "修改沖煮紀錄";
    DOM.logIdInput.value = log.id;
    DOM.logBeanIdSelect.value = log.beanId;
    DOM.logDoseInput.value = log.dose;
    DOM.logYieldInput.value = log.yield;
    DOM.logTimeInput.value = log.time;
    DOM.logGrindInput.value = log.grind || "";
    DOM.logTempInput.value = log.temp || "";
    DOM.logPressureInput.value = log.pressure || "";
    DOM.logPreinfusionInput.value = log.preinfusion || 0;
    DOM.logDateInput.value = log.date;
    DOM.logNotesInput.value = log.notes || "";
    
    // Sliders
    DOM.logRatingInput.value = log.rating;
    updateStarUI(log.rating);

    const flavors = ["acidity", "sweetness", "bitterness", "body"];
    flavors.forEach(f => {
      const val = log[f] ?? 5;
      document.getElementById(`log-${f}`).value = val;
      document.getElementById(`val-${f}`).textContent = val;
    });

    // Deduct checkbox disabled on edit (prevent double deduction)
    DOM.logDeductStockCheckbox.checked = false;
    DOM.logDeductStockCheckbox.closest(".checkbox-group").style.display = "none";

    DOM.dialogLog.showModal();
  },

  delete(id) {
    if (confirm("確認要刪除這筆沖煮紀錄嗎？此動作無法復原。")) {
      state.logs = state.logs.filter(l => l.id !== id);
      Storage.save();
      this.render();
      StatsManager.update();
      showToast("沖煮紀錄已刪除");
    }
  }
};

// --- Star Rating Input Handler ---
function updateStarUI(val) {
  const stars = DOM.starPicker.querySelectorAll(".star-btn");
  stars.forEach((star, idx) => {
    if (idx < val) {
      star.classList.add("selected");
    } else {
      star.classList.remove("selected");
    }
  });
}

DOM.starPicker.addEventListener("click", (e) => {
  if (e.target.classList.contains("star-btn")) {
    const val = parseInt(e.target.dataset.value);
    DOM.logRatingInput.value = val;
    updateStarUI(val);
  }
});

// --- Flavor Slider Displays ---
["acidity", "sweetness", "bitterness", "body"].forEach(f => {
  const input = document.getElementById(`log-${f}`);
  const display = document.getElementById(`val-${f}`);
  input.addEventListener("input", () => {
    display.textContent = input.value;
  });
});

// --- Helper Utilities ---
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateId() {
  return "id-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
}

function getLocalDateTimeString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// --- Backup & Restore (JSON Portability) ---
DOM.btnExport.addEventListener("click", () => {
  const dataStr = JSON.stringify({
    beans: state.beans,
    logs: state.logs
  }, null, 2);
  
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  const dateStr = new Date().toISOString().slice(0, 10);
  link.download = `espresso_brew_backup_${dateStr}.json`;
  link.href = url;
  link.click();
  
  URL.revokeObjectURL(url);
  showToast("資料備份檔導出成功！");
});

DOM.btnImportTrigger.addEventListener("click", () => {
  DOM.importFileInput.click();
});

DOM.importFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const parsed = JSON.parse(evt.target.result);
      if (Array.isArray(parsed.beans) && Array.isArray(parsed.logs)) {
        if (confirm("導入將會覆蓋當前瀏覽器的所有紀錄。確認要覆蓋並還原資料嗎？")) {
          state.beans = parsed.beans;
          state.logs = parsed.logs;
          Storage.save();
          
          // Re-render UI
          BeansManager.render();
          LogsManager.render();
          StatsManager.update();
          showToast("資料庫還原成功！");
        }
      } else {
        alert("JSON 格式不符，缺少 beans 或 logs 欄位！");
      }
    } catch (err) {
      alert("解析備份檔案失敗，請確保這是個有效的 JSON 檔案。");
    }
  };
  reader.readAsText(file);
  DOM.importFileInput.value = ""; // Reset input
});

// --- Event Bindings & Modal Dialogs ---

// --- Bean Dialog ---
DOM.btnAddBean.addEventListener("click", () => {
  DOM.dialogBeanTitle.textContent = "新增咖啡豆庫存";
  DOM.formBean.reset();
  DOM.beanIdInput.value = "";
  DOM.beanRoastDateInput.value = new Date().toISOString().slice(0, 10);
  DOM.beanWeightInitialInput.value = 250;
  
  DOM.dialogBean.showModal();
});

DOM.btnCloseBean.addEventListener("click", () => {
  DOM.dialogBean.close();
});

// Native click outside overlay closes dialog
DOM.dialogBean.addEventListener("click", (e) => {
  const rect = DOM.dialogBean.getBoundingClientRect();
  if (
    e.clientX < rect.left ||
    e.clientX > rect.right ||
    e.clientY < rect.top ||
    e.clientY > rect.bottom
  ) {
    DOM.dialogBean.close();
  }
});

DOM.formBean.addEventListener("submit", (e) => {
  // Prevent native default browser form submit redirect
  e.preventDefault();
  
  const name = DOM.beanNameInput.value.trim();
  if (!name) return;

  const id = DOM.beanIdInput.value;
  const initialWeight = parseInt(DOM.beanWeightInitialInput.value) || 0;

  if (id) {
    // Edit existing
    const bean = state.beans.find(b => b.id === id);
    if (bean) {
      const diff = initialWeight - bean.weightInitial;
      bean.name = name;
      bean.roaster = DOM.beanRoasterInput.value.trim();
      bean.roastLevel = DOM.beanRoastLevelSelect.value;
      bean.roastDate = DOM.beanRoastDateInput.value;
      bean.weightRemaining = Math.max(0, bean.weightRemaining + diff); // Shift remaining by diff of initial
      bean.weightInitial = initialWeight;
      bean.notes = DOM.beanNotesInput.value.trim();
      showToast("咖啡豆資料修改完成");
    }
  } else {
    // Add new
    const newBean = {
      id: generateId(),
      name: name,
      roaster: DOM.beanRoasterInput.value.trim(),
      roastLevel: DOM.beanRoastLevelSelect.value,
      roastDate: DOM.beanRoastDateInput.value,
      weightInitial: initialWeight,
      weightRemaining: initialWeight,
      notes: DOM.beanNotesInput.value.trim(),
      finished: false
    };
    state.beans.push(newBean);
    showToast("成功新增一包咖啡豆！");
  }

  Storage.save();
  BeansManager.render();
  DOM.dialogBean.close();
});

// --- Brew Log Dialog ---
DOM.btnAddLog.addEventListener("click", () => {
  DOM.dialogLogTitle.textContent = "新增沖煮紀錄";
  DOM.formLog.reset();
  DOM.logIdInput.value = "";
  DOM.logDateInput.value = getLocalDateTimeString();
  
  // Default values
  DOM.logDoseInput.value = 18.0;
  DOM.logYieldInput.value = 36.0;
  DOM.logTimeInput.value = 28.0;
  DOM.logTempInput.value = 93.0;
  DOM.logPressureInput.value = 9.0;
  DOM.logPreinfusionInput.value = 0;
  DOM.logGrindInput.value = "J-Ultra ";
  DOM.logRatingInput.value = 4;
  updateStarUI(4);

  // Set flavor sliders to 5
  const flavors = ["acidity", "sweetness", "bitterness", "body"];
  flavors.forEach(f => {
    document.getElementById(`log-${f}`).value = 5;
    document.getElementById(`val-${f}`).textContent = 5;
  });

  // Enable stock deduct checkbox
  DOM.logDeductStockCheckbox.checked = true;
  DOM.logDeductStockCheckbox.closest(".checkbox-group").style.display = "flex";

  // Pre-fill time if stopwatch has a value
  if (stopwatch.loggedSeconds > 0) {
    DOM.logTimeInput.value = stopwatch.loggedSeconds;
  }

  DOM.dialogLog.showModal();
});

DOM.btnCloseLog.addEventListener("click", () => {
  DOM.dialogLog.close();
});

DOM.dialogLog.addEventListener("click", (e) => {
  const rect = DOM.dialogLog.getBoundingClientRect();
  if (
    e.clientX < rect.left ||
    e.clientX > rect.right ||
    e.clientY < rect.top ||
    e.clientY > rect.bottom
  ) {
    DOM.dialogLog.close();
  }
});

DOM.formLog.addEventListener("submit", (e) => {
  e.preventDefault();

  const beanId = DOM.logBeanIdSelect.value;
  if (!beanId) {
    alert("請選擇沖煮使用的咖啡豆！");
    return;
  }

  const id = DOM.logIdInput.value;
  const dose = parseFloat(DOM.logDoseInput.value) || 0;
  const yieldVal = parseFloat(DOM.logYieldInput.value) || 0;
  const time = parseFloat(DOM.logTimeInput.value) || 0;

  const logData = {
    beanId: beanId,
    dose: dose,
    yield: yieldVal,
    time: time,
    grind: DOM.logGrindInput.value.trim(),
    temp: parseFloat(DOM.logTempInput.value) || null,
    pressure: parseFloat(DOM.logPressureInput.value) || null,
    preinfusion: parseFloat(DOM.logPreinfusionInput.value) || 0,
    date: DOM.logDateInput.value || getLocalDateTimeString(),
    notes: DOM.logNotesInput.value.trim(),
    rating: parseInt(DOM.logRatingInput.value) || 4,
    acidity: parseInt(document.getElementById("log-acidity").value),
    sweetness: parseInt(document.getElementById("log-sweetness").value),
    bitterness: parseInt(document.getElementById("log-bitterness").value),
    body: parseInt(document.getElementById("log-body").value)
  };

  if (id) {
    // Edit existing
    const logIdx = state.logs.findIndex(l => l.id === id);
    if (logIdx !== -1) {
      // Keep old ID
      logData.id = id;
      state.logs[logIdx] = logData;
      showToast("沖煮紀錄修改完成");
    }
  } else {
    // Add new
    logData.id = generateId();
    state.logs.push(logData);

    // Deduct stock if checked
    if (DOM.logDeductStockCheckbox.checked) {
      const bean = state.beans.find(b => b.id === beanId);
      if (bean) {
        bean.weightRemaining = Math.max(0, bean.weightRemaining - dose);
      }
    }
    showToast("成功新增一筆沖煮紀錄！");
  }

  Storage.save();
  BeansManager.render();
  LogsManager.render();
  StatsManager.update();
  DOM.dialogLog.close();
});

// --- Stopwatch Controls Action ---
DOM.swBtnStart.addEventListener("click", () => stopwatch.start());
DOM.swBtnPause.addEventListener("click", () => stopwatch.pause());
DOM.swBtnReset.addEventListener("click", () => stopwatch.reset());

DOM.swBtnLog.addEventListener("click", () => {
  // Trigger dialog open logic directly
  DOM.btnAddLog.click();
});

// --- Bean Filter Chip Clicks ---
DOM.beanFilterChips.forEach(chip => {
  chip.addEventListener("click", () => {
    DOM.beanFilterChips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    state.filters.beanStatus = chip.dataset.filter;
    BeansManager.render();
  });
});

// --- History Timeline Filter Controls ---
DOM.searchLogs.addEventListener("input", (e) => {
  state.filters.searchQuery = e.target.value;
  LogsManager.render();
});

DOM.filterBeanSelect.addEventListener("change", (e) => {
  state.filters.beanId = e.target.value;
  LogsManager.render();
});

DOM.filterRatingSelect.addEventListener("change", (e) => {
  state.filters.rating = e.target.value;
  LogsManager.render();
});

// --- Application Initialization ---
function init() {
  // Load data
  Storage.load();
  
  // Render views
  BeansManager.render();
  LogsManager.render();
  StatsManager.update();
  
  console.log("Espresso Brew Log App initialized successfully!");
}

// Start application
window.addEventListener("DOMContentLoaded", init);

// Register PWA Service Worker for offline use
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('PWA Service Worker registered successfully on scope:', reg.scope))
      .catch(err => console.error('PWA Service Worker registration failed:', err));
  });
}
