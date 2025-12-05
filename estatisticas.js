function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(2) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    }
    return num.toLocaleString();
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
}

function formatTimeShort(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
}

function loadStats() {
    return {
        totalClicks: parseInt(localStorage.getItem('totalClicks')) || 0,
        currentClicks: parseInt(localStorage.getItem('clicks')) || 0,
        totalItems: parseInt(localStorage.getItem('totalItems')) || 0,
        critCount: parseInt(localStorage.getItem('critCount')) || 0,
        totalSpent: parseInt(localStorage.getItem('totalSpent')) || 0,
        timePlayed: parseInt(localStorage.getItem('timePlayed')) || 0,
        manualClicks: parseInt(localStorage.getItem('manualClicks')) || 0,
        autoClicks: parseInt(localStorage.getItem('autoClicks')) || 0,
        biggestClick: parseInt(localStorage.getItem('biggestClick')) || 0,
        biggestCrit: parseInt(localStorage.getItem('biggestCrit')) || 0,
        peakCPS: parseFloat(localStorage.getItem('peakCPS')) || 0,
        sessionStartTime: parseInt(localStorage.getItem('sessionStartTime')) || Date.now(),
        sessionStartClicks: parseInt(localStorage.getItem('sessionStartClicks')) || parseInt(localStorage.getItem('clicks')) || 0,
        autoclickers: parseInt(localStorage.getItem('autoclickers')) || 0,
        critChance: parseFloat(localStorage.getItem('critChance')) || 0,
        critMultiplier: parseFloat(localStorage.getItem('critMultiplier')) || 10,
        valueBaseClick: parseInt(localStorage.getItem('valueBaseClick')) || 1,
        critUpgrades: parseInt(localStorage.getItem('critChance')) || 0,
        valueUpgrades: parseInt(localStorage.getItem('valueBaseClick')) - 1 || 0,
        multiplierUpgrades: parseInt(localStorage.getItem('CritMultiplierValue')) || 0
    };
}

function calculateDerivedStats(stats) {
    const sessionTime = Math.floor((Date.now() - stats.sessionStartTime) / 1000);
    const sessionClicks = stats.currentClicks - stats.sessionStartClicks;
    
    const totalTimeSeconds = Math.max(stats.timePlayed + sessionTime, 1);
    const cps = stats.totalClicks / totalTimeSeconds;
    
    const critRate = stats.totalClicks > 0 ? (stats.critCount / stats.totalClicks) * 100 : 0;
    
    const cpm = sessionTime > 0 ? Math.floor((sessionClicks / sessionTime) * 60) : 0;
    
    const totalEarned = stats.currentClicks + stats.totalSpent;
    
    const efficiency = stats.totalSpent > 0 ? (totalEarned / stats.totalSpent) : 0;
    
    return {
        cps: cps,
        critRate: critRate,
        cpm: cpm,
        totalEarned: totalEarned,
        efficiency: efficiency,
        sessionTime: sessionTime,
        sessionClicks: sessionClicks,
        sessionEarned: sessionClicks
    };
}

function updateStats() {
    const stats = loadStats();
    const derived = calculateDerivedStats(stats);
    
    document.getElementById('stat-total-clicks').textContent = formatNumber(stats.totalClicks);
    document.getElementById('stat-current-clicks').textContent = formatNumber(stats.currentClicks);
    document.getElementById('stat-time-played').textContent = formatTime(stats.timePlayed + derived.sessionTime);
    document.getElementById('stat-cps').textContent = derived.cps.toFixed(2);
    
    document.getElementById('stat-manual-clicks').textContent = formatNumber(stats.manualClicks);
    document.getElementById('stat-auto-clicks').textContent = formatNumber(stats.autoClicks);
    document.getElementById('stat-biggest-click').textContent = formatNumber(stats.biggestClick);
    document.getElementById('stat-base-click-value').textContent = stats.valueBaseClick;
    
    document.getElementById('stat-total-crits').textContent = formatNumber(stats.critCount);
    document.getElementById('stat-crit-rate').textContent = derived.critRate.toFixed(2) + '%';
    document.getElementById('stat-crit-chance').textContent = stats.critChance.toFixed(1) + '%';
    document.getElementById('stat-crit-multiplier').textContent = stats.critMultiplier.toFixed(1) + 'x';
    document.getElementById('stat-biggest-crit').textContent = formatNumber(stats.biggestCrit);
    
    document.getElementById('stat-total-items').textContent = formatNumber(stats.totalItems);
    document.getElementById('stat-autoclickers').textContent = stats.autoclickers;
    document.getElementById('stat-crit-upgrades').textContent = stats.critUpgrades;
    document.getElementById('stat-value-upgrades').textContent = stats.valueUpgrades;
    document.getElementById('stat-multiplier-upgrades').textContent = stats.multiplierUpgrades;
    document.getElementById('stat-total-spent').textContent = formatNumber(stats.totalSpent);
    
    document.getElementById('stat-cpm').textContent = derived.cpm;
    document.getElementById('stat-peak-cps').textContent = derived.cps > stats.peakCPS ? derived.cps.toFixed(2) : stats.peakCPS.toFixed(2);
    document.getElementById('stat-total-earned').textContent = formatNumber(derived.totalEarned);
    document.getElementById('stat-efficiency').textContent = derived.efficiency.toFixed(2);
    
    document.getElementById('stat-session-time').textContent = formatTimeShort(derived.sessionTime);
    document.getElementById('stat-session-clicks').textContent = formatNumber(derived.sessionClicks);
    document.getElementById('stat-session-earned').textContent = formatNumber(derived.sessionEarned);
}

function initSession() {
    if (!localStorage.getItem('sessionStartTime')) {
        localStorage.setItem('sessionStartTime', Date.now());
        localStorage.setItem('sessionStartClicks', localStorage.getItem('clicks') || 0);
    }
}

function updateTimePlayed() {
    const sessionStart = parseInt(localStorage.getItem('sessionStartTime')) || Date.now();
    const sessionTime = Math.floor((Date.now() - sessionStart) / 1000);
    const savedTime = parseInt(localStorage.getItem('timePlayed')) || 0;
    
    if (sessionTime > 0 && sessionTime % 60 === 0) {
        localStorage.setItem('timePlayed', savedTime + 60);
        localStorage.setItem('sessionStartTime', Date.now());
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initSession();
    updateStats();
    
    setInterval(() => {
        updateStats();
        updateTimePlayed();
    }, 1000);
});

