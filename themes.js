const themes = {
    default: {
        name: "Padrão",
        icon: "🌿",
        colors: {
            background: "yellowgreen",
            menu: "#f0f0f0",
            clickArea: "#fff",
            text: "#000",
            border: "#000"
        }
    },
    dark: {
        name: "Escuro",
        icon: "🌙",
        colors: {
            background: "#1a1a1a",
            menu: "#2d2d2d",
            clickArea: "#3d3d3d",
            text: "#fff",
            border: "#555"
        }
    },
    ocean: {
        name: "Oceano",
        icon: "🌊",
        colors: {
            background: "#006994",
            menu: "#004d6b",
            clickArea: "#0088cc",
            text: "#fff",
            border: "#00bfff"
        }
    },
    sunset: {
        name: "Pôr do Sol",
        icon: "🌅",
        colors: {
            background: "#ff6b6b",
            menu: "#ff8e8e",
            clickArea: "#ffb3b3",
            text: "#fff",
            border: "#ff4757"
        }
    },
    forest: {
        name: "Floresta",
        icon: "🌲",
        colors: {
            background: "#2d5016",
            menu: "#1a3009",
            clickArea: "#4a7c2a",
            text: "#fff",
            border: "#6b9c3d"
        }
    },
    purple: {
        name: "Roxo",
        icon: "💜",
        colors: {
            background: "#6c5ce7",
            menu: "#5f4fd4",
            clickArea: "#a29bfe",
            text: "#fff",
            border: "#4834d4"
        }
    },
    neon: {
        name: "Neon",
        icon: "💡",
        colors: {
            background: "#0a0a0a",
            menu: "#1a1a1a",
            clickArea: "#2a2a2a",
            text: "#00ff00",
            border: "#00ff00"
        }
    },
    retro: {
        name: "Retrô",
        icon: "🎮",
        colors: {
            background: "#ffd700",
            menu: "#ffed4e",
            clickArea: "#fff8dc",
            text: "#8b4513",
            border: "#8b4513"
        }
    }
};

function applyTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) return;
    
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', theme.colors.background);
    root.style.setProperty('--theme-menu', theme.colors.menu);
    root.style.setProperty('--theme-click-area', theme.colors.clickArea);
    root.style.setProperty('--theme-text', theme.colors.text);
    root.style.setProperty('--theme-border', theme.colors.border);
    
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.style.backgroundColor = theme.colors.background;
    }
    
    const menu = document.getElementById('menu');
    if (menu) {
        menu.style.backgroundColor = theme.colors.menu;
        menu.style.borderColor = theme.colors.border;
    }
    
    const clickArea = document.getElementById('click-area');
    if (clickArea) {
        clickArea.style.backgroundColor = theme.colors.clickArea;
        clickArea.style.color = theme.colors.text;
        clickArea.style.borderColor = theme.colors.border;
    }
    
    const clicks = document.getElementById('clicks');
    if (clicks) {
        clicks.style.color = theme.colors.text;
    }
    
    const menuItems = document.querySelectorAll('#itens li');
    menuItems.forEach(item => {
        item.style.backgroundColor = theme.colors.menu === "#f0f0f0" ? "#e6e6e6" : 
            theme.colors.menu === "#2d2d2d" ? "#3d3d3d" : 
            theme.colors.clickArea;
        const link = item.querySelector('a');
        if (link) {
            link.style.color = theme.colors.text;
        }
    });
    
    const headings = document.querySelectorAll('h1, h2');
    headings.forEach(heading => {
        heading.style.color = theme.colors.text;
        heading.style.fontWeight = 'bold';
    });
    
    const statCards = document.querySelectorAll('.stat-card, .stat-box');
    statCards.forEach(card => {
        card.style.borderColor = theme.colors.border;
        card.style.backgroundColor = theme.colors.text === "#fff" ? "#ffffff" : "#ffffff";
    });
    
    const statSections = document.querySelectorAll('.stat-section');
    statSections.forEach(section => {
        section.style.backgroundColor = "#ffffff";
        section.style.borderColor = theme.colors.border;
    });
    
    const statSectionsH2 = document.querySelectorAll('.stat-section h2');
    statSectionsH2.forEach(h2 => {
        h2.style.color = "#000";
        h2.style.borderColor = theme.colors.border;
    });
    
    const statLabels = document.querySelectorAll('.stat-label');
    statLabels.forEach(label => {
        label.style.color = "#000";
        label.style.fontWeight = '600';
    });
    
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(value => {
        value.style.color = "#000";
        value.style.fontWeight = 'bold';
    });
    
    const achievements = document.querySelectorAll('.achievement');
    achievements.forEach(achievement => {
        achievement.style.borderColor = theme.colors.border;
        if (achievement.classList.contains('unlocked')) {
            achievement.style.backgroundColor = "#e8f5e8";
        } else {
            achievement.style.backgroundColor = "#f0f0f0";
        }
    });
    
    const achievementNames = document.querySelectorAll('.achievement-name');
    achievementNames.forEach(name => {
        name.style.color = "#000";
    });
    
    const achievementDescriptions = document.querySelectorAll('.achievement-description');
    achievementDescriptions.forEach(desc => {
        desc.style.color = "#000";
    });
    
    const itemInfo = document.getElementById('item-info');
    if (itemInfo) {
        itemInfo.style.backgroundColor = theme.colors.clickArea;
        itemInfo.style.color = theme.colors.text;
        itemInfo.style.borderColor = theme.colors.border;
    }
    
    localStorage.setItem('selectedTheme', themeName);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    applyTheme(savedTheme);
}

function createThemeSelector() {
    const container = document.getElementById('themes-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.keys(themes).forEach(themeKey => {
        const theme = themes[themeKey];
        const themeCard = document.createElement('div');
        themeCard.className = 'theme-card';
        themeCard.innerHTML = `
            <div class="theme-icon">${theme.icon}</div>
            <div class="theme-name">${theme.name}</div>
        `;
        
        themeCard.addEventListener('click', () => {
            applyTheme(themeKey);
            closeThemeModal();
        });
        
        container.appendChild(themeCard);
    });
}

function openThemeModal() {
    const modal = document.getElementById('theme-modal');
    if (modal) {
        modal.classList.remove('hidden');
        createThemeSelector();
    }
}

function closeThemeModal() {
    const modal = document.getElementById('theme-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function initProfileImage() {
    const profileImgs = document.querySelectorAll('#profile img');
    if (profileImgs.length === 0) return;
    
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        profileImgs.forEach(img => {
            img.src = savedImage;
        });
    }
    
    profileImgs.forEach(profileImg => {
        profileImg.style.cursor = 'pointer';
        profileImg.title = 'Clique para trocar a foto';
        
        profileImg.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const imageUrl = event.target.result;
                        localStorage.setItem('profileImage', imageUrl);
                        
                        const allProfileImgs = document.querySelectorAll('#profile img');
                        allProfileImgs.forEach(img => {
                            img.src = imageUrl;
                        });
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            input.click();
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    initProfileImage();
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            openThemeModal();
        });
    }
    
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeThemeModal);
    }
    
    const modal = document.getElementById('theme-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeThemeModal();
            }
        });
    }
});

