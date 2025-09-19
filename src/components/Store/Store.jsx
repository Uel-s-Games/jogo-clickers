import { useState, useEffect } from "react";
import "./Store.css";

const Store = ({ clicks, setClicks }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const initialStoreItems = [
    {
      id: "cursor",
      img: "imgsclickers/cursor.png",
      upgradeKey: "autoclickers",
      baseCost: 10,
      multiplier: 1.15,
      unlockCondition: (clicks) =>
        clicks > 9 || parseInt(localStorage.getItem("autoclickers")) > 0,
    },
    // Adicione outros itens aqui...
  ];

  const [storeItems, setStoreItems] = useState(
    initialStoreItems.map((item) => ({
      ...item,
      count: parseInt(localStorage.getItem(item.upgradeKey)) || 0,
      cost:
        parseInt(localStorage.getItem(`${item.upgradeKey}-cost`)) ||
        item.baseCost,
      unlocked: false,
    }))
  );

  // Atualiza desbloqueio dos itens sempre que clicks muda
  useEffect(() => {
    setStoreItems((prev) =>
      prev.map((item) => ({
        ...item,
        unlocked: item.unlockCondition(clicks),
      }))
    );
  }, [clicks]);

  const buyItem = (itemId) => {
    const itemIndex = storeItems.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;

    const item = storeItems[itemIndex];
    
    if (clicks >= item.cost) {
      const newClicks = clicks - item.cost;
      const newCount = item.count + 1;
      const newCost = Math.ceil(item.cost * item.multiplier);

      // Atualiza clicks
      setClicks(newClicks);
      localStorage.setItem("clicks", newClicks);

      // Atualiza storeItems com uma cópia nova do array
      const updatedItems = [...storeItems];
      updatedItems[itemIndex] = {
        ...item,
        count: newCount,
        cost: newCost
      };
      
      setStoreItems(updatedItems);

      // Atualiza localStorage do item
      localStorage.setItem(item.upgradeKey, newCount);
      localStorage.setItem(`${item.upgradeKey}-cost`, newCost);
    }
  };

  return (
    <div>
      {/* Loja */}
      <div id="store">
        {storeItems
          .filter((item) => item.unlocked)
          .map((item) => (
            <div
              className="store-item"
              key={item.id}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span className="item-count">{item.count}</span>
              <img
                src={item.img}
                alt={item.id}
                onClick={() => buyItem(item.id)}
              />
            </div>
          ))}
      </div>

      {/* Info do item */}
      <div
        id="item-info"
        style={{
          display: hoveredItem ? "flex" : "none",
          marginTop: "1rem",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {hoveredItem && (
          <>
            <img
              src={hoveredItem.img}
              alt={hoveredItem.id}
              style={{ width: 40, height: 40 }}
            />
            <div>
              <strong style={{ fontSize: "1.2rem" }}>{hoveredItem.id}</strong>
              <br />
              <strong style={{ fontSize: "1.2rem" }}>Preço: </strong>
              {hoveredItem.cost} clicks
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Store;