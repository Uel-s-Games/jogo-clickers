const main = document.getElementById("main");
const clicks = document.getElementById("clicks");
const clickArea = document.getElementById("click-area");
const store = document.getElementById("store");
const itemInfo = document.getElementById("item-info");

let savedClicks = parseInt(localStorage.getItem("clicks")) || 0;
clicks.textContent = savedClicks;

let valueBaseClick = parseInt(localStorage.getItem("valueBaseClick")) || 1;
let critChance = parseFloat(localStorage.getItem("critChance")) || 0;
let critMultiplier = parseFloat(localStorage.getItem("critMultiplier")) || 10;

let totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;
let critCount = parseInt(localStorage.getItem('critCount')) || 0;
let totalItems = parseInt(localStorage.getItem('totalItems')) || 0;

let manualClicks = parseInt(localStorage.getItem('manualClicks')) || 0;
let autoClicks = parseInt(localStorage.getItem('autoClicks')) || 0;
let biggestClick = parseInt(localStorage.getItem('biggestClick')) || 0;
let biggestCrit = parseInt(localStorage.getItem('biggestCrit')) || 0;
let timePlayed = parseInt(localStorage.getItem('timePlayed')) || 0;
let peakCPS = parseFloat(localStorage.getItem('peakCPS')) || 0;

if (!localStorage.getItem('sessionStartTime')) {
    localStorage.setItem('sessionStartTime', Date.now());
    localStorage.setItem('sessionStartClicks', savedClicks);
}

const storeItems = [
    {
        id: "Clique Automático",
        img: "./images/cursor.png",
        upgradeKey: "autoclickers",
        baseCost: 10,
        multiplier: 1.10,
        unlockCondition: () => parseInt(localStorage.getItem("clicks")) > 9,
        delay: 1000,
        lastRun: 0,
        effect: () => {
            let amount = parseInt(localStorage.getItem("autoclickers")) || 0;
            if (amount > 0) {
                let current = parseInt(clicks.textContent);
                current += amount;
                clicks.textContent = current;
                localStorage.setItem("clicks", current);
                
                autoClicks += amount;
                localStorage.setItem('autoClicks', autoClicks);
                
                updateAchievementStats();
            }
        }
    },
    {
        id: "Chance Clique Crítico",
        img: "./images/crit.png",
        upgradeKey: "critChance",
        baseCost: 150,
        multiplier: 2,
        unlockCondition: () => parseInt(localStorage.getItem("clicks")) > 149,
        delay: null,
        lastRun: null,
        effect: null,
    },
    {
        id: "Valor do Clique",
        img: "./images/clique.png",
        upgradeKey: "valueBaseClick",
        baseCost: 100,
        multiplier: 1.75,
        unlockCondition: () => parseInt(localStorage.getItem("clicks")) > 99,
        delay: null,
        lastRun: null,
        effect: null,
    },
    {
        id: "Valor do Crítico",
        img: "./images/critMultiplier.png",
        upgradeKey: "CritMultiplierValue",
        baseCost: 1000,
        multiplier: 1.5,
        unlockCondition: () => parseInt(localStorage.getItem("clicks")) > 999,
        delay: null,
        lastRun: null,
        effect: null,
    },
];

function updateAchievementStats() {
    localStorage.setItem('totalClicks', totalClicks);
    localStorage.setItem('critCount', critCount);
    localStorage.setItem('totalItems', totalItems);
    
    checkAndUnlockAchievements();
}

function checkAndUnlockAchievements() {
    const stats = getCurrentStats();
    const unlocked = loadUnlockedAchievements();
    let newAchievements = [];

    if (stats.totalClicks >= 1 && !unlocked.includes("first_click")) {
        unlocked.push("first_click");
        newAchievements.push("Primeiro Clique!");
        showAchievementPopup("Primeiro Clique!", "👆");
    }
    if (stats.totalClicks >= 10 && !unlocked.includes("click_10")) {
        unlocked.push("click_10");
        newAchievements.push("Clique Iniciante");
        showAchievementPopup("Clique Iniciante", "🔟");
    }
    if (stats.totalClicks >= 100 && !unlocked.includes("click_100")) {
        unlocked.push("click_100");
        newAchievements.push("Clique Intermediário");
        showAchievementPopup("Clique Intermediário", "💯");
    }
    if (stats.totalClicks >= 1000 && !unlocked.includes("click_1000")) {
        unlocked.push("click_1000");
        newAchievements.push("Clique Avançado");
        showAchievementPopup("Clique Avançado", "🎯");
    }
    if (stats.totalClicks >= 10000 && !unlocked.includes("click_10000")) {
        unlocked.push("click_10000");
        newAchievements.push("Mestre dos Cliques");
        showAchievementPopup("Mestre dos Cliques", "👑");
    }

    if (stats.totalItems >= 1 && !unlocked.includes("first_item")) {
        unlocked.push("first_item");
        newAchievements.push("Primeira Compra");
        showAchievementPopup("Primeira Compra", "🛒");
    }
    if (stats.totalItems >= 10 && !unlocked.includes("item_10")) {
        unlocked.push("item_10");
        newAchievements.push("Colecionador");
        showAchievementPopup("Colecionador", "📦");
    }
    if (stats.totalItems >= 50 && !unlocked.includes("item_50")) {
        unlocked.push("item_50");
        newAchievements.push("Mestre das Compras");
        showAchievementPopup("Mestre das Compras", "🏪");
    }

    if (stats.critCount >= 1 && !unlocked.includes("first_crit")) {
        unlocked.push("first_crit");
        newAchievements.push("Crítico!");
        showAchievementPopup("Crítico!", "💥");
    }
    if (stats.critCount >= 10 && !unlocked.includes("crit_10")) {
        unlocked.push("crit_10");
        newAchievements.push("Sorte Crítica");
        showAchievementPopup("Sorte Crítica", "🎲");
    }
    if (stats.autoClickers >= 1 && !unlocked.includes("auto_clicker")) {
        unlocked.push("auto_clicker");
        newAchievements.push("Automático");
        showAchievementPopup("Automático", "🤖");
    }
    if (stats.currentClicks >= 1000 && !unlocked.includes("rich")) {
        unlocked.push("rich");
        newAchievements.push("Rico");
        showAchievementPopup("Rico", "💰");
    }
    if (stats.currentClicks >= 10000 && !unlocked.includes("millionaire")) {
        unlocked.push("millionaire");
        newAchievements.push("Milionário");
        showAchievementPopup("Milionário", "💎");
    }

    const uniqueItems = getUniqueItemsCount();
    if (uniqueItems >= 4 && !unlocked.includes("all_items")) {
        unlocked.push("all_items");
        newAchievements.push("Complecionista");
        showAchievementPopup("Complecionista", "⭐");
    }

    if (newAchievements.length > 0) {
        saveUnlockedAchievements(unlocked);
        console.log('Novas conquistas desbloquadas:', newAchievements);
    }
}

function getCurrentStats() {
    return {
        totalClicks: totalClicks,
        totalItems: totalItems,
        currentClicks: parseInt(localStorage.getItem("clicks")) || 0,
        autoClickers: parseInt(localStorage.getItem("autoclickers")) || 0,
        critCount: critCount
    };
}

function getUniqueItemsCount() {
    const itemKeys = ['autoclickers', 'critChance', 'valueBaseClick', 'CritMultiplierValue'];
    return itemKeys.filter(key => parseInt(localStorage.getItem(key)) > 0).length;
}

function loadUnlockedAchievements() {
    return JSON.parse(localStorage.getItem('unlockedAchievements')) || [];
}

function saveUnlockedAchievements(unlocked) {
    localStorage.setItem('unlockedAchievements', JSON.stringify(unlocked));
}

function showAchievementPopup(name, icon) {
    const popup = document.getElementById('popup-conquista');
    popup.innerHTML = `
        <div class="popup-content">
            <div class="achievement-icon-popup">${icon}</div>
            <h3>Conquista Desbloqueada!</h3>
            <p>${name}</p>
        </div>
    `;
    popup.classList.remove('hidden');
    
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 3000);
}

function addItemStore(item) {
    const div = document.createElement("div");
    div.classList.add("store-item");

    const img = document.createElement("img");
    img.id = item.id;
    img.src = item.img;
    addStoreItemListeners(item, img);

    const span = document.createElement("span");
    span.classList.add("item-count");
    span.textContent = localStorage.getItem(item.upgradeKey) || 0;

    store.appendChild(div);
    div.appendChild(span);
    div.appendChild(img);

    img.addEventListener("click", () => {
        buyItem(item.id, item.upgradeKey, item.baseCost, item.multiplier);
    });
}

function buyItem(itemId, upgradeKey, baseCost, multiplier) {
    let currentClicks = parseInt(clicks.textContent);
    let currentUpgrades = parseInt(localStorage.getItem(upgradeKey) || 0);
    let currentCost = parseFloat(localStorage.getItem(`${upgradeKey}-cost`) || baseCost);

    if (currentClicks >= currentCost) {
        currentClicks -= currentCost;
        currentUpgrades++;

        currentCost = Math.ceil(currentCost * multiplier);
        localStorage.setItem(`${upgradeKey}-cost`, currentCost);

        clicks.textContent = currentClicks;
        localStorage.setItem("clicks", currentClicks);
        localStorage.setItem(upgradeKey, currentUpgrades);

        const badge = document.getElementById(itemId).parentElement.querySelector(".item-count");
        badge.textContent = currentUpgrades;

        totalItems += 1;
        updateAchievementStats();

        let totalSpent = parseInt(localStorage.getItem('totalSpent')) || 0;
        totalSpent += currentCost;
        localStorage.setItem('totalSpent', totalSpent);

        if (upgradeKey === "critChance") {
            critChance = currentUpgrades * 1; // % de chance
            localStorage.setItem("critChance", critChance);
        }

        if (upgradeKey === "CritMultiplierValue") {
            critMultiplier = 10 + currentUpgrades * 5; // cada upgrade adiciona +5 ao crit
            localStorage.setItem("critMultiplier", critMultiplier);
        }

        if (upgradeKey === "valueBaseClick") {
            valueBaseClick = parseInt(localStorage.getItem("valueBaseClick") || 1);
            valueBaseClick += 1; // cada upgrade adiciona +1
            localStorage.setItem("valueBaseClick", valueBaseClick);
        }
        
        initStore();
    }
}

function initStore() {
    storeItems.forEach(item => {
        const upgrades = parseInt(localStorage.getItem(item.upgradeKey) || 0);

        if ((!document.getElementById(item.id)) && (upgrades > 0 || item.unlockCondition())) {
            addItemStore(item);
        }
    });
}

clickArea.addEventListener("click", () => {
    const isCrit = Math.random() * 100 < critChance;
    const ganho = isCrit ? valueBaseClick * critMultiplier : valueBaseClick

    let current = parseInt(clicks.textContent);
    current += ganho;
    clicks.textContent = current;
    localStorage.setItem('clicks', current);
    
    totalClicks += 1;
    manualClicks += 1;
    if (isCrit) critCount += 1;
    
    if (ganho > biggestClick) {
        biggestClick = ganho;
        localStorage.setItem('biggestClick', biggestClick);
    }
    
    if (isCrit && ganho > biggestCrit) {
        biggestCrit = ganho;
        localStorage.setItem('biggestCrit', biggestCrit);
    }
    
    localStorage.setItem('manualClicks', manualClicks);
    
    updateAchievementStats();

    const clickEffect = document.createElement("span");
    clickEffect.classList.add("click-effect");
    clickEffect.textContent = `+${ganho}${isCrit ? " 💥" : ""}`;

    clickEffect.style.left = `${event.clientX}px`;
    clickEffect.style.top = `${event.clientY}px`;

    if (isCrit) clickEffect.classList.add("crit");

    document.body.appendChild(clickEffect);

    setTimeout(() => clickEffect.remove(), 800);

    initStore();
});

setInterval(() => {
    const now = Date.now();
    storeItems.forEach(item => {
        if (item.effect && now - item.lastRun >= item.delay) {
            item.effect();
            item.lastRun = now;
        }
    });
}, 1000);

function showItemInfo(item) {
    const cost = localStorage.getItem(`${item.upgradeKey}-cost`) || item.baseCost;

    itemInfo.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.5rem;">
            <img src="${item.img}" alt="${item.id}" style="width:40px; height:40px;"/>
            <div>
                <strong style="font-size: 1.2rem">${item.id}</strong><br/>
                <strong style="font-size: 1.2rem"> Preço: </strong> ${cost} clicks
            </div>
        </div>
    `;

    itemInfo.style.display = "flex";
}

function hideItemInfo() {
    itemInfo.style.display = "none";
}

function addStoreItemListeners(item, imgElement) {
    imgElement.addEventListener("mouseenter", () => showItemInfo(item));
    imgElement.addEventListener("mouseleave", hideItemInfo);
}

initStore();

checkAndUnlockAchievements();

setInterval(() => {
    const sessionStart = parseInt(localStorage.getItem('sessionStartTime')) || Date.now();
    const sessionTime = Math.floor((Date.now() - sessionStart) / 1000);
    const savedTime = parseInt(localStorage.getItem('timePlayed')) || 0;
    
    if (sessionTime > 0 && sessionTime % 60 === 0) {
        localStorage.setItem('timePlayed', savedTime + 60);
        localStorage.setItem('sessionStartTime', Date.now());
    }
    
    const totalTime = savedTime + sessionTime;
    if (totalTime > 0) {
        const currentCPS = totalClicks / totalTime;
        if (currentCPS > peakCPS) {
            peakCPS = currentCPS;
            localStorage.setItem('peakCPS', peakCPS);
        }
    }
}, 1000);