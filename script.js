const main = document.getElementById("main");
const clicks = document.getElementById("clicks");
const clickArea = document.getElementById("click-area");
const store = document.getElementById("store");
const itemInfo = document.getElementById("item-info");

// Pega clicks salvos
let savedClicks = parseInt(localStorage.getItem("clicks")) || 0;
clicks.textContent = savedClicks;

// Lista de itens da loja
const storeItems = [
    {
        id: "cursor",
        img: "./images/cursor.png",
        upgradeKey: "autoclickers",
        baseCost: 10,
        multiplier: 1.15,
        unlockCondition: () => parseInt(localStorage.getItem("clicks")) > 9,
        delay: 2000,
        lastRun: 0,
        effect: () => {
            let amount = parseInt(localStorage.getItem("autoclickers")) || 0;
            if (amount > 0) {
                let current = parseInt(clicks.textContent);
                current += amount;
                clicks.textContent = current;
                localStorage.setItem("clicks", current);
            }
        }
    },
    // pode adicionar outros itens aqui facilmente
];

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
    }
}

// Função para inicializar loja dinamicamente
function initStore() {
    storeItems.forEach(item => {
        if (!document.getElementById(item.id) && item.unlockCondition()) {
            addItemStore(item);
        }
    });
}

// Clique normal
clickArea.addEventListener("click", () => {
    let current = parseInt(clicks.textContent);
    current++;
    clicks.textContent = current;
    localStorage.setItem('clicks', current);

    initStore(); // verifica se algum item desbloqueou
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
