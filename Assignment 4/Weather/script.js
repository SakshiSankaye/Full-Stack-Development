/**
 * script.js — Global Weather Dashboard
 * ─────────────────────────────────────────────────────────────────
 * Architecture:
 *  - WeatherAPI      : data fetching (real API or mock fallback)
 *  - StorageManager  : localStorage search history
 *  - ChartManager    : Chart.js line + bar charts
 *  - UIController    : page transitions, render, events
 *  - App             : bootstrap & wiring
 * ─────────────────────────────────────────────────────────────────
 *
 * HOW TO CONNECT THE REAL API
 * ─────────────────────────────────────────────────────────────────
 * 1. Sign up at https://openweathermap.org/api (free tier)
 * 2. Copy your key below — replace "YOUR_API_KEY_HERE"
 * 3. Set USE_REAL_API = true
 * ─────────────────────────────────────────────────────────────────
 */

/* ================================================================
   CONFIGURATION
================================================================ */
const CONFIG = {
  /* ⬇  Paste your OpenWeatherMap API key here ⬇ */
  API_KEY: 'YOUR_API_KEY_HERE',
  /* Set to true once you have a valid API key */
  USE_REAL_API: false,

  OWM_CURRENT_URL: 'https://api.openweathermap.org/data/2.5/weather',
  OWM_FORECAST_URL: 'https://api.openweathermap.org/data/2.5/forecast',

  /* localStorage key for search history */
  HISTORY_KEY: 'wx_history',
  /* Max items in history */
  MAX_HISTORY: 8,

  /* Mock data file path */
  DATA_FILE: 'data.json',
};

/* ================================================================
   WEATHER API MODULE
   Handles both real OpenWeatherMap calls and mock fallback
================================================================ */
const WeatherAPI = (() => {
  /* Mock data loaded from data.json once */
  let _mockDB = null;

  /**
   * Load mock data from data.json.
   * Called once on init; subsequent lookups use the cached object.
   */
  async function _loadMockDB() {
    if (_mockDB) return _mockDB;
    try {
      const res = await fetch(CONFIG.DATA_FILE);
      const json = await res.json();
      _mockDB = json.cities;
    } catch {
      /* If file load fails (e.g., file:// protocol), use hardcoded inline data */
      _mockDB = _getInlineMock();
    }
    return _mockDB;
  }

  /**
   * Inline mock — used if data.json fails to load (e.g., opened directly from file system).
   * Subset of the full dataset for resilience.
   */
  function _getInlineMock() {
    return {
      "mumbai":    { name:"Mumbai",    country:"IN", currentUV:8,  current:{ temperature:33, feels_like:38, humidity:82, wind_speed:22, wind_dir:"SW", condition:"Partly Cloudy", condition_code:"cloudy", uv_index:8,  visibility:6,  pressure:1008 }, forecast:[{date:"Mon",high:33,low:27,humidity:82,wind:22,condition:"Partly Cloudy",code:"cloudy"},{date:"Tue",high:31,low:26,humidity:87,wind:25,condition:"Rainy",code:"rainy"},{date:"Wed",high:29,low:25,humidity:91,wind:30,condition:"Heavy Rain",code:"rainy"},{date:"Thu",high:28,low:25,humidity:88,wind:28,condition:"Rainy",code:"rainy"},{date:"Fri",high:30,low:26,humidity:84,wind:20,condition:"Cloudy",code:"cloudy"},{date:"Sat",high:32,low:27,humidity:79,wind:17,condition:"Sunny",code:"sunny"},{date:"Sun",high:34,low:28,humidity:75,wind:14,condition:"Sunny",code:"sunny"}]},
      "new york":  { name:"New York",  country:"US", currentUV:5,  current:{ temperature:15, feels_like:13, humidity:55, wind_speed:29, wind_dir:"NW", condition:"Windy",        condition_code:"windy",  uv_index:5,  visibility:12, pressure:1018 }, forecast:[{date:"Mon",high:15,low:9,humidity:55,wind:29,condition:"Windy",code:"windy"},{date:"Tue",high:12,low:7,humidity:64,wind:34,condition:"Rainy",code:"rainy"},{date:"Wed",high:10,low:5,humidity:72,wind:42,condition:"Stormy",code:"stormy"},{date:"Thu",high:11,low:6,humidity:66,wind:32,condition:"Cloudy",code:"cloudy"},{date:"Fri",high:16,low:9,humidity:50,wind:22,condition:"Cloudy",code:"cloudy"},{date:"Sat",high:18,low:11,humidity:44,wind:18,condition:"Sunny",code:"sunny"},{date:"Sun",high:21,low:13,humidity:40,wind:15,condition:"Sunny",code:"sunny"}]},
      "london":    { name:"London",    country:"GB", currentUV:3,  current:{ temperature:12, feels_like:10, humidity:74, wind_speed:23, wind_dir:"W",  condition:"Drizzle",       condition_code:"rainy",  uv_index:3,  visibility:8,  pressure:1012 }, forecast:[{date:"Mon",high:12,low:7,humidity:74,wind:23,condition:"Drizzle",code:"rainy"},{date:"Tue",high:10,low:6,humidity:80,wind:27,condition:"Rainy",code:"rainy"},{date:"Wed",high:11,low:7,humidity:70,wind:22,condition:"Cloudy",code:"cloudy"},{date:"Thu",high:13,low:8,humidity:65,wind:19,condition:"Cloudy",code:"cloudy"},{date:"Fri",high:15,low:9,humidity:60,wind:18,condition:"Sunny",code:"sunny"},{date:"Sat",high:14,low:8,humidity:63,wind:20,condition:"Cloudy",code:"cloudy"},{date:"Sun",high:13,low:7,humidity:68,wind:24,condition:"Drizzle",code:"rainy"}]},
      "tokyo":     { name:"Tokyo",     country:"JP", currentUV:6,  current:{ temperature:19, feels_like:18, humidity:61, wind_speed:15, wind_dir:"NE", condition:"Clear",         condition_code:"sunny",  uv_index:6,  visibility:14, pressure:1020 }, forecast:[{date:"Mon",high:19,low:12,humidity:61,wind:15,condition:"Clear",code:"sunny"},{date:"Tue",high:21,low:13,humidity:57,wind:13,condition:"Sunny",code:"sunny"},{date:"Wed",high:18,low:11,humidity:69,wind:19,condition:"Cloudy",code:"cloudy"},{date:"Thu",high:15,low:10,humidity:75,wind:22,condition:"Rainy",code:"rainy"},{date:"Fri",high:16,low:10,humidity:71,wind:18,condition:"Cloudy",code:"cloudy"},{date:"Sat",high:20,low:12,humidity:63,wind:14,condition:"Sunny",code:"sunny"},{date:"Sun",high:22,low:13,humidity:58,wind:12,condition:"Sunny",code:"sunny"}]},
      "paris":     { name:"Paris",     country:"FR", currentUV:4,  current:{ temperature:17, feels_like:15, humidity:62, wind_speed:19, wind_dir:"W",  condition:"Partly Sunny",  condition_code:"cloudy", uv_index:4,  visibility:10, pressure:1016 }, forecast:[{date:"Mon",high:17,low:10,humidity:62,wind:19,condition:"Partly Sunny",code:"cloudy"},{date:"Tue",high:14,low:8,humidity:70,wind:23,condition:"Rainy",code:"rainy"},{date:"Wed",high:13,low:7,humidity:76,wind:26,condition:"Rainy",code:"rainy"},{date:"Thu",high:15,low:9,humidity:66,wind:20,condition:"Cloudy",code:"cloudy"},{date:"Fri",high:18,low:10,humidity:58,wind:17,condition:"Sunny",code:"sunny"},{date:"Sat",high:20,low:11,humidity:53,wind:15,condition:"Sunny",code:"sunny"},{date:"Sun",high:19,low:10,humidity:56,wind:16,condition:"Partly Sunny",code:"cloudy"}]},
      "sydney":    { name:"Sydney",    country:"AU", currentUV:7,  current:{ temperature:23, feels_like:22, humidity:64, wind_speed:20, wind_dir:"SE", condition:"Sunny",         condition_code:"sunny",  uv_index:7,  visibility:13, pressure:1019 }, forecast:[{date:"Mon",high:23,low:16,humidity:64,wind:20,condition:"Sunny",code:"sunny"},{date:"Tue",high:25,low:17,humidity:60,wind:18,condition:"Sunny",code:"sunny"},{date:"Wed",high:22,low:15,humidity:70,wind:24,condition:"Windy",code:"windy"},{date:"Thu",high:19,low:13,humidity:76,wind:31,condition:"Rainy",code:"rainy"},{date:"Fri",high:21,low:14,humidity:72,wind:26,condition:"Cloudy",code:"cloudy"},{date:"Sat",high:24,low:16,humidity:63,wind:18,condition:"Sunny",code:"sunny"},{date:"Sun",high:26,low:17,humidity:58,wind:15,condition:"Sunny",code:"sunny"}]},
      "dubai":     { name:"Dubai",     country:"AE", currentUV:11, current:{ temperature:38, feels_like:43, humidity:45, wind_speed:16, wind_dir:"NW", condition:"Hot & Sunny",   condition_code:"sunny",  uv_index:11, visibility:9,  pressure:1004 }, forecast:[{date:"Mon",high:38,low:30,humidity:45,wind:16,condition:"Sunny",code:"sunny"},{date:"Tue",high:39,low:31,humidity:42,wind:14,condition:"Sunny",code:"sunny"},{date:"Wed",high:40,low:31,humidity:40,wind:12,condition:"Sunny",code:"sunny"},{date:"Thu",high:38,low:30,humidity:46,wind:18,condition:"Hazy",code:"cloudy"},{date:"Fri",high:37,low:29,humidity:48,wind:20,condition:"Hazy",code:"cloudy"},{date:"Sat",high:39,low:30,humidity:43,wind:15,condition:"Sunny",code:"sunny"},{date:"Sun",high:40,low:31,humidity:41,wind:13,condition:"Sunny",code:"sunny"}]},
      "singapore": { name:"Singapore", country:"SG", currentUV:9,  current:{ temperature:30, feels_like:35, humidity:83, wind_speed:12, wind_dir:"S",  condition:"Thunderstorm",  condition_code:"stormy", uv_index:9,  visibility:5,  pressure:1010 }, forecast:[{date:"Mon",high:30,low:24,humidity:83,wind:12,condition:"Thunderstorm",code:"stormy"},{date:"Tue",high:29,low:23,humidity:86,wind:14,condition:"Rainy",code:"rainy"},{date:"Wed",high:31,low:25,humidity:80,wind:11,condition:"Partly Cloudy",code:"cloudy"},{date:"Thu",high:32,low:25,humidity:78,wind:10,condition:"Sunny",code:"sunny"},{date:"Fri",high:30,low:24,humidity:82,wind:13,condition:"Rainy",code:"rainy"},{date:"Sat",high:29,low:23,humidity:85,wind:15,condition:"Rainy",code:"rainy"},{date:"Sun",high:31,low:25,humidity:79,wind:11,condition:"Cloudy",code:"cloudy"}]},
    };
  }

  /**
   * Map OpenWeatherMap API response → our internal data shape.
   */
  function _transformOWMCurrent(owmCurrent, owmForecast) {
    const c = owmCurrent;
    const f = owmForecast.list;

    // Build 7-day summary from 3-hourly forecast
    const dayMap = {};
    const dayOrder = [];
    f.forEach(item => {
      const d = new Date(item.dt * 1000);
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      if (!dayMap[label]) {
        dayMap[label] = { temps: [], humidity: [], wind: [], conditions: [] };
        dayOrder.push(label);
      }
      dayMap[label].temps.push(item.main.temp);
      dayMap[label].humidity.push(item.main.humidity);
      dayMap[label].wind.push(item.wind.speed * 3.6); // m/s → km/h
      dayMap[label].conditions.push(item.weather[0].main);
    });

    const forecast = dayOrder.slice(0, 7).map(day => {
      const d = dayMap[day];
      const cond = d.conditions[Math.floor(d.conditions.length / 2)];
      return {
        date: day,
        high: Math.round(Math.max(...d.temps) - 273.15),
        low:  Math.round(Math.min(...d.temps) - 273.15),
        humidity: Math.round(d.humidity.reduce((a,b)=>a+b,0) / d.humidity.length),
        wind: Math.round(d.wind.reduce((a,b)=>a+b,0) / d.wind.length),
        condition: cond,
        code: _owmCondToCode(cond),
      };
    });

    const condDesc = c.weather[0].description;
    return {
      name: c.name,
      country: c.sys.country,
      current: {
        temperature: Math.round(c.main.temp - 273.15),
        feels_like:  Math.round(c.main.feels_like - 273.15),
        humidity:    c.main.humidity,
        wind_speed:  Math.round(c.wind.speed * 3.6),
        wind_dir:    _degToCardinal(c.wind.deg),
        condition:   condDesc.charAt(0).toUpperCase() + condDesc.slice(1),
        condition_code: _owmCondToCode(c.weather[0].main),
        uv_index:    0,
        visibility:  Math.round(c.visibility / 1000),
        pressure:    c.main.pressure,
      },
      forecast,
    };
  }

  /** Convert OWM main condition string to our icon code */
  function _owmCondToCode(main) {
    const m = (main||'').toLowerCase();
    if (m.includes('thunder') || m.includes('storm')) return 'stormy';
    if (m.includes('drizzle') || m.includes('rain'))  return 'rainy';
    if (m.includes('snow'))    return 'snowy';
    if (m.includes('clear'))   return 'sunny';
    if (m.includes('cloud'))   return 'cloudy';
    if (m.includes('wind'))    return 'windy';
    return 'cloudy';
  }

  /** Wind degrees → cardinal direction */
  function _degToCardinal(deg) {
    const dirs = ['N','NE','E','SE','S','SW','W','NW'];
    return dirs[Math.round(deg / 45) % 8];
  }

  /**
   * Public: fetch weather for a city name.
   * Tries real API first (if configured), falls back to mock.
   * Returns our unified data shape.
   */
  async function fetchCity(cityName) {
    if (CONFIG.USE_REAL_API && CONFIG.API_KEY && CONFIG.API_KEY !== 'YOUR_API_KEY_HERE') {
      return _fetchFromAPI(cityName);
    }
    return _fetchFromMock(cityName);
  }

  async function _fetchFromAPI(cityName) {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`${CONFIG.OWM_CURRENT_URL}?q=${encodeURIComponent(cityName)}&appid=${CONFIG.API_KEY}`),
      fetch(`${CONFIG.OWM_FORECAST_URL}?q=${encodeURIComponent(cityName)}&appid=${CONFIG.API_KEY}`),
    ]);
    if (!currentRes.ok) throw new Error(`City "${cityName}" not found (API status ${currentRes.status})`);
    const [owmCurrent, owmForecast] = await Promise.all([currentRes.json(), forecastRes.json()]);
    return _transformOWMCurrent(owmCurrent, owmForecast);
  }

  async function _fetchFromMock(cityName) {
    const db = await _loadMockDB();
    const key = cityName.toLowerCase().trim();
    /* Try exact match first, then partial match */
    let record = db[key] || Object.values(db).find(c => c.name.toLowerCase() === key);
    if (!record) {
      // Try substring search
      record = Object.values(db).find(c => c.name.toLowerCase().startsWith(key.split(' ')[0]));
    }
    if (!record) throw new Error(`City "${cityName}" not found in mock data. Try: Mumbai, London, Tokyo, Paris, Sydney, Dubai, Singapore, New York.`);
    return record;
  }

  return { fetchCity };
})();

/* ================================================================
   STORAGE MANAGER MODULE
   Manages search history in localStorage
================================================================ */
const StorageManager = (() => {
  /**
   * Load history array from localStorage.
   * @returns {Array} Array of { city, timestamp, temp, condition }
   */
  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem(CONFIG.HISTORY_KEY) || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Save (or update) a city to the front of history.
   * Deduplicated by city name (case-insensitive).
   * Capped at MAX_HISTORY items.
   */
  function saveToHistory(cityData) {
    const history = getHistory().filter(
      h => h.city.toLowerCase() !== cityData.name.toLowerCase()
    );
    history.unshift({
      city:      cityData.name,
      country:   cityData.country,
      timestamp: Date.now(),
      temp:      cityData.current.temperature,
      condition: cityData.current.condition,
      code:      cityData.current.condition_code,
    });
    localStorage.setItem(CONFIG.HISTORY_KEY, JSON.stringify(history.slice(0, CONFIG.MAX_HISTORY)));
  }

  /**
   * Remove a single city from history.
   */
  function removeFromHistory(cityName) {
    const filtered = getHistory().filter(h => h.city !== cityName);
    localStorage.setItem(CONFIG.HISTORY_KEY, JSON.stringify(filtered));
  }

  /**
   * Clear all history.
   */
  function clearHistory() {
    localStorage.removeItem(CONFIG.HISTORY_KEY);
  }

  return { getHistory, saveToHistory, removeFromHistory, clearHistory };
})();

/* ================================================================
   CHART MANAGER MODULE
   Handles Chart.js creation and updates
================================================================ */
const ChartManager = (() => {
  let _tempChart  = null;
  let _humidChart = null;

  const _isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
  const _gridColor  = () => _isDark() ? 'rgba(255,255,255,.07)'  : 'rgba(0,0,0,.06)';
  const _tickColor  = () => _isDark() ? '#7cb9da' : '#5b8fa8';
  const _labelColor = () => _isDark() ? '#e0f2fe' : '#0c4a6e';

  /** Shared scale options factory */
  function _scales(yLabel) {
    return {
      x: {
        grid:   { color: _gridColor(), lineWidth: 1 },
        ticks:  { color: _tickColor(), font: { family: 'Instrument Sans', size: 11 } },
        border: { color: _gridColor() },
      },
      y: {
        grid:   { color: _gridColor(), lineWidth: 1 },
        ticks:  { color: _tickColor(), font: { family: 'Instrument Sans', size: 11 } },
        border: { color: _gridColor() },
        title:  { display: !!yLabel, text: yLabel, color: _tickColor(), font: { family: 'Instrument Sans', size: 11 } },
      },
    };
  }

  /** Shared tooltip options */
  function _tooltip() {
    return {
      backgroundColor: _isDark() ? '#0a1828' : '#fff',
      titleColor:  _labelColor(),
      bodyColor:   _tickColor(),
      borderColor: '#0ea5e9',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 10,
    };
  }

  /**
   * Render or update the temperature line chart.
   * @param {string[]} labels  — day labels
   * @param {number[]} highs   — high temps
   * @param {number[]} lows    — low temps
   */
  function renderTempChart(labels, highs, lows) {
    if (_tempChart) _tempChart.destroy();
    const ctx = document.getElementById('tempChart').getContext('2d');

    /* Gradient fills */
    const gHigh = ctx.createLinearGradient(0, 0, 0, 230);
    gHigh.addColorStop(0, 'rgba(14,165,233,.4)');
    gHigh.addColorStop(1, 'rgba(14,165,233,0)');

    const gLow = ctx.createLinearGradient(0, 0, 0, 230);
    gLow.addColorStop(0, 'rgba(56,189,248,.2)');
    gLow.addColorStop(1, 'rgba(56,189,248,0)');

    _tempChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'High (°C)',
            data: highs,
            borderColor: '#0ea5e9',
            backgroundColor: gHigh,
            borderWidth: 2.5,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#0ea5e9',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Low (°C)',
            data: lows,
            borderColor: '#38bdf8',
            backgroundColor: gLow,
            borderWidth: 2,
            borderDash: [5, 3],
            pointBackgroundColor: '#fff',
            pointBorderColor: '#38bdf8',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 700, easing: 'easeInOutQuart' },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            labels: { color: _labelColor(), font: { family: 'Instrument Sans', size: 12 }, boxWidth: 14, padding: 14 },
          },
          tooltip: _tooltip(),
        },
        scales: _scales('Temperature (°C)'),
      },
    });
  }

  /**
   * Render or update the humidity bar chart.
   * @param {string[]} labels
   * @param {number[]} humidity
   */
  function renderHumidChart(labels, humidity) {
    if (_humidChart) _humidChart.destroy();
    const ctx = document.getElementById('humidChart').getContext('2d');

    _humidChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Humidity (%)',
          data: humidity,
          backgroundColor: humidity.map(v =>
            v > 80 ? 'rgba(14,165,233,.88)' :
            v > 65 ? 'rgba(56,189,248,.75)' :
                     'rgba(186,230,253,.8)'
          ),
          borderColor: '#0ea5e9',
          borderWidth: 1.5,
          borderRadius: 7,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 700, easing: 'easeInOutQuart' },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: _tooltip(),
        },
        scales: _scales('Humidity (%)'),
      },
    });
  }

  /** Force chart color refresh (called after theme toggle) */
  function refreshColors() {
    [_tempChart, _humidChart].forEach(ch => {
      if (!ch) return;
      ch.options.scales.x.grid.color = _gridColor();
      ch.options.scales.x.ticks.color = _tickColor();
      ch.options.scales.x.border.color = _gridColor();
      ch.options.scales.y.grid.color = _gridColor();
      ch.options.scales.y.ticks.color = _tickColor();
      ch.options.scales.y.border.color = _gridColor();
      if (ch.options.plugins.tooltip) {
        Object.assign(ch.options.plugins.tooltip, _tooltip());
      }
      if (ch.options.plugins.legend?.labels) {
        ch.options.plugins.legend.labels.color = _labelColor();
      }
      ch.update('none');
    });
  }

  return { renderTempChart, renderHumidChart, refreshColors };
})();

/* ================================================================
   UTILITY HELPERS
================================================================ */

/** Map condition code → animated emoji icon */
function condToIcon(code) {
  const map = {
    sunny:  '☀️',
    cloudy: '⛅',
    rainy:  '🌧️',
    stormy: '⛈️',
    windy:  '🌬️',
    snowy:  '❄️',
  };
  return map[code] || '🌤️';
}

/** Format timestamp → "Today, 3:42 PM" */
function formatTimestamp(ts) {
  const d = new Date(ts);
  const isToday = new Date().toDateString() === d.toDateString();
  return isToday
    ? `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ================================================================
   UI CONTROLLER MODULE
   Manages page rendering, navigation, and DOM events
================================================================ */
const UIController = (() => {
  /* Page elements */
  const pages = {
    home:      document.getElementById('page-home'),
    dashboard: document.getElementById('page-dashboard'),
  };
  const loadingOverlay = document.getElementById('loadingOverlay');
  const toastContainer = document.getElementById('toastContainer');
  let _toastTimer = null;

  /* ── Page navigation ─────────────────────────────────────────── */

  function showPage(name) {
    Object.entries(pages).forEach(([key, el]) => {
      el.classList.toggle('active', key === name);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── Loading indicator ───────────────────────────────────────── */

  function showLoading() { loadingOverlay.classList.add('show'); }
  function hideLoading() { loadingOverlay.classList.remove('show'); }

  /* ── Toast notifications ─────────────────────────────────────── */

  /**
   * Show a non-blocking toast message.
   * @param {string} msg
   * @param {'error'|'success'|'info'} type
   */
  function showToast(msg, type = 'info') {
    clearTimeout(_toastTimer);
    toastContainer.innerHTML = '';
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const icons = { error: '⚠️', success: '✓', info: 'ℹ️' };
    el.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
    toastContainer.appendChild(el);
    _toastTimer = setTimeout(() => { toastContainer.innerHTML = ''; }, 4000);
  }

  /* ── Dashboard render ────────────────────────────────────────── */

  /**
   * Populate the entire dashboard with city weather data.
   * @param {Object} data  — unified weather data shape
   */
  function renderDashboard(data) {
    const cur = data.current;
    const fc  = data.forecast;

    /* City heading */
    document.getElementById('dashCity').textContent    = data.name;
    document.getElementById('dashCountry').textContent = data.country;

    const now = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });
    document.getElementById('dashMeta').textContent = `Last updated: ${now}`;

    /* Hero card */
    document.getElementById('heroIcon').textContent      = condToIcon(cur.condition_code);
    document.getElementById('heroTemp').innerHTML        = `${cur.temperature}<sup>°C</sup>`;
    document.getElementById('heroCondition').textContent = cur.condition;
    document.getElementById('heroFeels').textContent     = `Feels like ${cur.feels_like}°C`;

    /* Hero stat mini-cards */
    document.getElementById('heroHumidity').textContent  = `${cur.humidity}%`;
    document.getElementById('heroWind').textContent      = `${cur.wind_speed} km/h`;
    document.getElementById('heroPressure').textContent  = `${cur.pressure} hPa`;
    document.getElementById('heroVisibility').textContent= `${cur.visibility} km`;

    /* Secondary stat cards */
    document.getElementById('statUV').textContent    = `${cur.uv_index}/11`;
    document.getElementById('statDir').textContent   = cur.wind_dir;

    /* 7-day forecast strip */
    const strip = document.getElementById('forecastStrip');
    strip.innerHTML = fc.map((day, i) => `
      <div class="forecast-day ${i === 0 ? 'today' : ''}">
        <div class="fd-label">${i === 0 ? 'Today' : day.date}</div>
        <div class="fd-icon">${condToIcon(day.code)}</div>
        <div class="fd-high">${day.high}°</div>
        <div class="fd-low">${day.low}°</div>
        <div class="fd-cond">${day.condition}</div>
      </div>
    `).join('');

    /* Charts */
    const labels = fc.map((d, i) => i === 0 ? 'Today' : d.date);
    ChartManager.renderTempChart(labels, fc.map(d => d.high), fc.map(d => d.low));
    ChartManager.renderHumidChart(labels, fc.map(d => d.humidity));

    showPage('dashboard');
  }

  /* ── Search History ──────────────────────────────────────────── */

  /**
   * Re-render the history section on the home page.
   */
  function renderHistory() {
    const history = StorageManager.getHistory();
    const container = document.getElementById('historySection');
    const list      = document.getElementById('historyList');

    if (!history.length) {
      container.style.display = 'none';
      return;
    }
    container.style.display = 'block';

    list.innerHTML = history.map(h => `
      <div class="history-card" data-city="${h.city}" role="button" tabindex="0">
        <div class="history-icon">${condToIcon(h.code || 'cloudy')}</div>
        <div class="history-info">
          <div class="history-city">${h.city}, ${h.country || ''}</div>
          <div class="history-meta">${h.temp}°C · ${formatTimestamp(h.timestamp)}</div>
        </div>
        <button class="history-del" data-del="${h.city}" title="Remove" aria-label="Remove ${h.city}">✕</button>
      </div>
    `).join('');

    /* Attach click events */
    list.querySelectorAll('.history-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('history-del')) return;
        App.search(card.dataset.city);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') App.search(card.dataset.city);
      });
    });

    list.querySelectorAll('.history-del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        StorageManager.removeFromHistory(btn.dataset.del);
        renderHistory();
      });
    });
  }

  return {
    showPage,
    showLoading,
    hideLoading,
    showToast,
    renderDashboard,
    renderHistory,
  };
})();

/* ================================================================
   APP — bootstrap, wiring, public search function
================================================================ */
const App = (() => {
  /**
   * Main search function — called from UI events and history cards.
   * @param {string} cityName
   */
  async function search(cityName) {
    if (!cityName.trim()) {
      UIController.showToast('Please enter a city name.', 'error');
      return;
    }

    UIController.showLoading();

    try {
      /* Artificial min delay so loading state is visible */
      const [data] = await Promise.all([
        WeatherAPI.fetchCity(cityName),
        new Promise(r => setTimeout(r, 420)),
      ]);

      StorageManager.saveToHistory(data);
      UIController.renderDashboard(data);
      UIController.renderHistory();

    } catch (err) {
      UIController.showToast(err.message, 'error');
    } finally {
      UIController.hideLoading();
    }
  }

  /** Attempt geolocation auto-detect */
  function locateUser() {
    if (!navigator.geolocation) {
      UIController.showToast('Geolocation not supported by your browser.', 'error');
      return;
    }
    UIController.showToast('Detecting your location…', 'info');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        /* If real API is enabled, we can reverse-geocode */
        if (CONFIG.USE_REAL_API && CONFIG.API_KEY && CONFIG.API_KEY !== 'YOUR_API_KEY_HERE') {
          const { latitude: lat, longitude: lon } = pos.coords;
          UIController.showLoading();
          try {
            const [res] = await Promise.all([
              fetch(`${CONFIG.OWM_CURRENT_URL}?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}`).then(r => r.json()),
              new Promise(r => setTimeout(r, 400)),
            ]);
            search(res.name);
          } catch {
            UIController.showToast('Could not fetch location data.', 'error');
            UIController.hideLoading();
          }
        } else {
          /* Mock fallback: pick closest city from lat/lon (simplified) */
          const closestCity = _guessCity(pos.coords.latitude, pos.coords.longitude);
          search(closestCity);
        }
      },
      () => { UIController.showToast('Location access denied.', 'error'); }
    );
  }

  /** Very rough nearest-city guess for mock mode */
  function _guessCity(lat, lon) {
    const cities = [
      { name: 'Mumbai',    lat: 19.07, lon: 72.87 },
      { name: 'New York',  lat: 40.71, lon: -74.00 },
      { name: 'London',    lat: 51.50, lon: -0.12  },
      { name: 'Tokyo',     lat: 35.67, lon: 139.65 },
      { name: 'Paris',     lat: 48.85, lon: 2.35   },
      { name: 'Sydney',    lat: -33.86,lon: 151.20 },
      { name: 'Dubai',     lat: 25.20, lon: 55.27  },
      { name: 'Singapore', lat: 1.35,  lon: 103.81 },
    ];
    let best = cities[0], bestDist = Infinity;
    cities.forEach(c => {
      const d = Math.hypot(c.lat - lat, c.lon - lon);
      if (d < bestDist) { bestDist = d; best = c; }
    });
    return best.name;
  }

  /** Dark mode toggle */
  function toggleTheme() {
    const html   = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('themeIcon').textContent  = isDark ? '🌙' : '☀️';
    document.getElementById('themeLabel').textContent = isDark ? 'Dark Mode' : 'Light Mode';
    ChartManager.refreshColors();
  }

  /** Wiring all DOM events */
  function _bindEvents() {
    /* Search button */
    document.getElementById('searchBtn').addEventListener('click', () => {
      search(document.getElementById('searchInput').value.trim());
    });

    /* Enter key in search input */
    document.getElementById('searchInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') search(document.getElementById('searchInput').value.trim());
    });

    /* Locate button */
    document.getElementById('locateBtn').addEventListener('click', locateUser);

    /* City quick chips */
    document.querySelectorAll('.chip[data-city]').forEach(chip => {
      chip.addEventListener('click', () => search(chip.dataset.city));
    });

    /* Back to home */
    document.getElementById('backBtn').addEventListener('click', () => {
      UIController.showPage('home');
      UIController.renderHistory();
      document.getElementById('searchInput').value = '';
    });

    /* Dark mode toggle */
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  }

  /** Bootstrap */
  function init() {
    _bindEvents();
    UIController.renderHistory();
    UIController.showPage('home');
    document.getElementById('searchInput').focus();
  }

  return { init, search };
})();

/* ── Start ── */
document.addEventListener('DOMContentLoaded', App.init);
