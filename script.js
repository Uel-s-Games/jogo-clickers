const main = document.getElementById("main");
const clicks = document.getElementById("clicks");
const clickArea = document.getElementById("click-area");
const store = document.getElementById("store");
const itemInfo = document.getElementById("item-info");

// Pega clicks salvos
let savedClicks = parseInt(localStorage.getItem("clicks")) || 0;
clicks.textContent = savedClicks;

let valueBaseClick = parseInt(localStorage.getItem("valueBaseClick")) || 1;
let critChance = parseFloat(localStorage.getItem("critChance")) || 0;
let critMultiplier = parseFloat(localStorage.getItem("critMultiplier")) || 10;

// VARIÁVEIS PARA CONQUISTAS
let totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;
let critCount = parseInt(localStorage.getItem('critCount')) || 0;
let totalItems = parseInt(localStorage.getItem('totalItems')) || 0;

// Lista de itens da loja
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
                
                // Atualizar conquistas
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

// FUNÇÕES PARA CONQUISTAS
function updateAchievementStats() {
    // Salvar estatísticas atualizadas
    localStorage.setItem('totalClicks', totalClicks);
    localStorage.setItem('critCount', critCount);
    localStorage.setItem('totalItems', totalItems);
    
    // Verificar e desbloquear conquistas
    checkAndUnlockAchievements();
}

function checkAndUnlockAchievements() {
    const stats = getCurrentStats();
    const unlocked = loadUnlockedAchievements();
    let newAchievements = [];

    // Conquistas de Cliques
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

    // Conquistas de Itens
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

    // Conquistas Especiais
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

    // Conquista de todos os itens
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

// Função para criar item na loja
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

    // Listener de compra
    img.addEventListener("click", () => {
        buyItem(item.id, item.upgradeKey, item.baseCost, item.multiplier);
    });
}

// Função de compra
function buyItem(itemId, upgradeKey, baseCost, multiplier) {
    let currentClicks = parseInt(clicks.textContent);
    let currentUpgrades = parseInt(localStorage.getItem(upgradeKey) || 0);
    let currentCost = parseFloat(localStorage.getItem(`${upgradeKey}-cost`) || baseCost);

    if (currentClicks >= currentCost) {
        currentClicks -= currentCost;
        currentUpgrades++;

        // Atualiza custo do próximo item
        currentCost = Math.ceil(currentCost * multiplier);
        localStorage.setItem(`${upgradeKey}-cost`, currentCost);

        // Atualiza clicks e upgrades
        clicks.textContent = currentClicks;
        localStorage.setItem("clicks", currentClicks);
        localStorage.setItem(upgradeKey, currentUpgrades);

        // Atualiza badge do item
        const badge = document.getElementById(itemId).parentElement.querySelector(".item-count");
        badge.textContent = currentUpgrades;

        // Atualizar estatísticas para conquistas
        totalItems += 1;
        updateAchievementStats();

        // gastos totais
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
        
        initStore(); // verifica se novos itens desbloquearam
    }
}

// Função para inicializar loja dinamicamente
function initStore() {
    storeItems.forEach(item => {
        const upgrades = parseInt(localStorage.getItem(item.upgradeKey) || 0);

        // Se já tem upgrade ou se passou da condição de desbloqueio
        if ((!document.getElementById(item.id)) && (upgrades > 0 || item.unlockCondition())) {
            addItemStore(item);
        }
    });
}

// Clique normal
clickArea.addEventListener("click", () => {
    const isCrit = Math.random() * 100 < critChance;
    const ganho = isCrit ? valueBaseClick * critMultiplier : valueBaseClick

    let current = parseInt(clicks.textContent);
    current += ganho;
    clicks.textContent = current;
    localStorage.setItem('clicks', current);
    
    // Atualizar estatísticas para conquistas
    totalClicks += 1;
    if (isCrit) critCount += 1;
    updateAchievementStats();

    // Efeito visual do clique
    const clickEffect = document.createElement("span");
    clickEffect.classList.add("click-effect");
    clickEffect.textContent = `+${ganho}${isCrit ? " 💥" : ""}`;

    clickEffect.style.left = `${event.clientX}px`;
    clickEffect.style.top = `${event.clientY}px`;

    if (isCrit) clickEffect.classList.add("crit");

    document.body.appendChild(clickEffect);

    // Remove depois da animação
    setTimeout(() => clickEffect.remove(), 800);

    initStore(); // verifica se algum item desbloqueou
});

// Sistema de cliques automáticos
setInterval(() => {
    const now = Date.now();
    storeItems.forEach(item => {
        if (item.effect && now - item.lastRun >= item.delay) {
            item.effect();
            item.lastRun = now;
        }
    });
}, 1000);

// Função para mostrar informações do item na div fixa
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

// Função para esconder informações
function hideItemInfo() {
    itemInfo.style.display = "none";
}

// Adicione nos listeners da loja quando criar os itens
function addStoreItemListeners(item, imgElement) {
    imgElement.addEventListener("mouseenter", () => showItemInfo(item));
    imgElement.addEventListener("mouseleave", hideItemInfo);
}

// Inicializa loja na primeira carga
initStore();

// Verificar conquistas na inicialização
checkAndUnlockAchievements();