const achievements = {
    click: [
        { id: "first_click", name: "Primeiro Clique!", description: "Realize seu primeiro clique", icon: "👆", target: 1 },
        { id: "click_10", name: "Clique Iniciante", description: "Alcance 10 cliques", icon: "🔟", target: 10 },
        { id: "click_100", name: "Clique Intermediário", description: "Alcance 100 cliques", icon: "💯", target: 100 },
        { id: "click_1000", name: "Clique Avançado", description: "Alcance 1.000 cliques", icon: "🎯", target: 1000 },
        { id: "click_10000", name: "Mestre dos Cliques", description: "Alcance 10.000 cliques", icon: "👑", target: 10000 },
        { id: "click_100000", name: "Lenda dos Cliques", description: "Alcance 100.000 cliques", icon: "🔥", target: 100000 },
        { id: "click_1000000", name: "Deus dos Cliques", description: "Alcance 1.000.000 cliques", icon: "⚡", target: 1000000 },
        { id: "click_1000000000", name: "Clicker Supremo", description: "Alcance 1.000.000.000 cliques", icon: "🌌", target: 1000000000 }
    ],

    item: [
        { id: "first_item", name: "Primeira Compra", description: "Compre seu primeiro item na loja", icon: "🛒", target: 1 },
        { id: "item_10", name: "Colecionador", description: "Compre 10 itens no total", icon: "📦", target: 10 },
        { id: "item_50", name: "Mestre das Compras", description: "Compre 50 itens no total", icon: "🏪", target: 50 },
        { id: "item_100", name: "Viciado em Compras", description: "Compre 100 itens no total", icon: "🛍️", target: 100 },
        { id: "item_500", name: "Magnata", description: "Compre 500 itens no total", icon: "💼", target: 500 },
        { id: "all_items", name: "Complecionista", description: "Tenha pelo menos 1 de cada item", icon: "⭐", target: 1 }
    ],

    spent: [
        { id: "spent_100", name: "Pequno Investidor", description: "Gaste 100 cliques no total", icon: "💰", target: 100 },
        { id: "spent_1000", name: "Investidor", description: "Gaste 1.000 cliques no total", icon: "💵", target: 1000 },
        { id: "spent_10000", name: "Grande Investidor", description: "Gaste 10.000 cliques no total", icon: "💎", target: 10000 },
        { id: "spent_100000", name: "Magnata Financeiro", description: "Gaste 100.000 cliques no total", icon: "🏦", target: 100000 },
        { id: "spent_1000000", name: "Bilionário", description: "Gaste 1.000.000 cliques no total", icon: "👑", target: 1000000 }
    ],

    special: [
        { id: "first_crit", name: "Crítico!", description: "Realize seu primeiro clique crítico", icon: "💥", target: 1 },
        { id: "crit_10", name: "Sorte Crítica", description: "Realize 10 cliques críticos", icon: "🎲", target: 10 },
        { id: "crit_100", name: "Mestre do Crítico", description: "Realize 100 cliques críticos", icon: "🎯", target: 100 },
        { id: "crit_1000", name: "Lenda do Crítico", description: "Realize 1.000 cliques críticos", icon: "🔥", target: 1000 },
        { id: "auto_clicker", name: "Automático", description: "Compre seu primeiro clique automático", icon: "🤖", target: 1 },
        { id: "rich", name: "Rico", description: "Tenha mais de 1.000 cliques de uma vez", icon: "💰", target: 1 },
        { id: "millionaire", name: "Milionário", description: "Tenha mais de 10.000 cliques de uma vez", icon: "💎", target: 1 },
        { id: "billionaire", name: "Bilionário", description: "Tenha mais de 100.000 cliques de uma vez", icon: "👑", target: 1 }
    ]
};

function loadGameStats() {
    const stats = {
        totalClicks: parseInt(localStorage.getItem('totalClicks')) || 0,
        totalItems: parseInt(localStorage.getItem('totalItems')) || 0,
        currentClicks: parseInt(localStorage.getItem('clicks')) || 0,
        autoClickers: parseInt(localStorage.getItem('autoclickers')) || 0,
        critCount: parseInt(localStorage.getItem('critCount')) || 0,
        totalSpent: parseInt(localStorage.getItem('totalSpent')) || 0,
        uniqueItems: 0
    };


    const itemKeys = ['autoclickers', 'critChance', 'valueBaseClick', 'CritMultiplierValue'];
    stats.uniqueItems = itemKeys.filter(key => parseInt(localStorage.getItem(key)) > 0).length;

    return stats;
}

function loadUnlockedAchievements() {
    return JSON.parse(localStorage.getItem('unlockedAchievements')) || [];
}

function checkAchievementCondition(achievement, stats) {
    switch(achievement.id) {
        case "first_click":
        case "click_10":
        case "click_100":
        case "click_1000":
        case "click_10000":
        case "click_100000":
        case "click_1000000":
        case "click_1000000000":
            return stats.totalClicks >= achievement.target;
        
        case "first_item":
        case "item_10":
        case "item_50":
        case "item_100":
        case "item_500":
            return stats.totalItems >= achievement.target;
        
        case "all_items":
            return stats.uniqueItems >= 4;
        
        case "spent_100":
        case "spent_1000":
        case "spent_10000":
        case "spent_100000":
        case "spent_1000000":
            return stats.totalSpent >= achievement.target;
        
        case "first_crit":
        case "crit_10":
        case "crit_100":
        case "crit_1000":
            return stats.critCount >= achievement.target;
        
        case "auto_clicker":
            return stats.autoClickers >= achievement.target;
        
        case "rich":
            return stats.currentClicks >= 1000;
        
        case "millionaire":
            return stats.currentClicks >= 10000;
        
        case "billionaire":
            return stats.currentClicks >= 100000;
        
        default:
            return false;
    }
}

function checkAchievements(stats) {
    const unlocked = loadUnlockedAchievements();
    let newAchievements = [];

    Object.keys(achievements).forEach(category => {
        achievements[category].forEach(achievement => {
            if (!unlocked.includes(achievement.id) && checkAchievementCondition(achievement, stats)) {
                unlocked.push(achievement.id);
                newAchievements.push(achievement);
            }
        });
    });

    if (newAchievements.length > 0) {
        localStorage.setItem('unlockedAchievements', JSON.stringify(unlocked));
    }

    return unlocked;
}

function getAchievementProgress(achievement, stats) {
    switch(achievement.id) {
        case "first_click":
        case "click_10":
        case "click_100":
        case "click_1000":
        case "click_10000":
        case "click_100000":
        case "click_1000000":
        case "click_1000000000":
            return Math.min(stats.totalClicks, achievement.target);
        
        case "first_item":
        case "item_10":
        case "item_50":
        case "item_100":
        case "item_500":
            return Math.min(stats.totalItems, achievement.target);
        
        case "all_items":
            return Math.min(stats.uniqueItems, 4);
        
        case "spent_100":
        case "spent_1000":
        case "spent_10000":
        case "spent_100000":
        case "spent_1000000":
            return Math.min(stats.totalSpent, achievement.target);
        
        case "first_crit":
        case "crit_10":
        case "crit_100":
        case "crit_1000":
            return Math.min(stats.critCount, achievement.target);
        
        case "auto_clicker":
            return Math.min(stats.autoClickers, 1);
        
        case "rich":
            return stats.currentClicks >= 1000 ? 1 : 0;
        
        case "millionaire":
            return stats.currentClicks >= 10000 ? 1 : 0;
        
        case "billionaire":
            return stats.currentClicks >= 100000 ? 1 : 0;
        
        default:
            return 0;
    }
}

function renderAchievements() {
    const stats = loadGameStats();
    const unlocked = checkAchievements(stats);

    document.getElementById('unlocked-count').textContent = `${unlocked.length}/${getTotalAchievements()}`;
    document.getElementById('total-clicks').textContent = stats.totalClicks.toLocaleString();
    document.getElementById('total-items').textContent = stats.totalItems.toLocaleString();

    renderAchievementCategory('click-achievements', achievements.click, stats, unlocked);
    renderAchievementCategory('item-achievements', achievements.item, stats, unlocked);
    renderAchievementCategory('spent-achievements', achievements.spent, stats, unlocked);
    renderAchievementCategory('special-achievements', achievements.special, stats, unlocked);
}

function renderAchievementCategory(containerId, categoryAchievements, stats, unlocked) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    categoryAchievements.forEach(achievement => {
        const isUnlocked = unlocked.includes(achievement.id);
        const progress = getAchievementProgress(achievement, stats);
        const progressPercent = (progress / achievement.target) * 100;
        
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        achievementElement.innerHTML = `
            <div class="achievement-header">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
            </div>
            <div class="achievement-description">${achievement.description}</div>
            <div class="achievement-progress">
                <div class="achievement-progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            <div class="achievement-reward">${progress.toLocaleString()}/${achievement.target.toLocaleString()}</div>
        `;

        container.appendChild(achievementElement);
    });
}

function getTotalAchievements() {
    return Object.values(achievements).reduce((total, category) => total + category.length, 0);
}

document.addEventListener('DOMContentLoaded', function() {
    renderAchievements();

    setInterval(renderAchievements, 2000);
});