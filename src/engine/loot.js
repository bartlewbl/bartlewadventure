// Item generation, loot tables, and shop logic
// All item creation logic extracted from gameData.js

import { RARITIES, RARITY_LOOKUP, ITEM_LIBRARY, POTION_TIERS, ENERGY_DRINK_TIERS } from '../data/gameData';
import { MATERIAL_DROP_CONFIG, BUILDING_MATERIALS, CRAFTED_ITEMS, CAMP_LOOT_TABLES, createMaterialItem, BUFF_POTION_TYPES, BUFF_POTION_DROP_TABLE } from '../data/baseData';
import { uid, pickWeighted, seededRandom, seededPickWeighted } from './utils';

function pickFromLibrary(pool, targetLevel) {
  if (!pool || pool.length === 0) return null;
  const weighted = pool.map(item => {
    const levelDiff = Math.abs(item.level - targetLevel);
    const levelWeight = Math.max(1, 18 - levelDiff * 2);
    return { item, weight: (item.weight || 1) * levelWeight };
  });
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;
  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) return entry.item;
  }
  return weighted[weighted.length - 1].item;
}

function buildGearDrop(template, monsterLevel, dropType) {
  const rarityData = RARITY_LOOKUP[template.rarity] || RARITIES[0];
  const baseLevelFactor = 1 + template.level * 0.05;
  const adaptFactor = 1 + Math.max(0, monsterLevel - template.level) * 0.04;
  const atk = template.baseAtk > 0
    ? Math.max(0, Math.round(template.baseAtk * baseLevelFactor * adaptFactor * rarityData.multiplier))
    : 0;
  const def = template.baseDef > 0
    ? Math.max(0, Math.round(template.baseDef * baseLevelFactor * adaptFactor * rarityData.multiplier))
    : 0;
  const effectiveLevel = Math.max(template.level, monsterLevel);

  return {
    id: uid(),
    name: template.name,
    type: dropType,
    slot: template.slot,
    level: effectiveLevel,
    rarity: template.rarity,
    rarityClass: rarityData.cssClass,
    rarityColor: rarityData.color,
    atk,
    def,
    icon: template.icon,
    sellPrice: Math.max(10, Math.floor((atk + def) * 4 + effectiveLevel * 3 + rarityData.multiplier * 10)),
  };
}

// Generate a random buff potion from the drop table
export function generateBuffPotion() {
  const totalWeight = BUFF_POTION_DROP_TABLE.reduce((s, e) => s + e.weight, 0);
  let roll = Math.random() * totalWeight;
  let picked = BUFF_POTION_DROP_TABLE[BUFF_POTION_DROP_TABLE.length - 1];
  for (const entry of BUFF_POTION_DROP_TABLE) {
    roll -= entry.weight;
    if (roll <= 0) { picked = entry; break; }
  }
  const bType = BUFF_POTION_TYPES[picked.id];
  if (!bType) return null;
  const rarityData = RARITY_LOOKUP[bType.rarity] || RARITIES[0];
  return {
    id: uid(),
    name: bType.name,
    type: 'buff-potion',
    buffPotionId: bType.id,
    slot: null,
    level: 1,
    rarity: bType.rarity,
    rarityClass: rarityData.cssClass,
    rarityColor: rarityData.color,
    icon: 'buff-potion',
    description: bType.description,
    sellPrice: bType.sellPrice,
    duration: bType.duration,
  };
}

// Generate a specific buff potion by ID (used by brewery crafting)
export function generateSpecificBuffPotion(buffPotionId) {
  const bType = BUFF_POTION_TYPES[buffPotionId];
  if (!bType) return null;
  const rarityData = RARITY_LOOKUP[bType.rarity] || RARITIES[0];
  return {
    id: uid(),
    name: bType.name,
    type: 'buff-potion',
    buffPotionId: bType.id,
    slot: null,
    level: 1,
    rarity: bType.rarity,
    rarityClass: rarityData.cssClass,
    rarityColor: rarityData.color,
    icon: 'buff-potion',
    description: bType.description,
    sellPrice: bType.sellPrice,
    duration: bType.duration,
  };
}

export function generateItem(dropType, monsterLevel) {
  if (dropType === 'buff-potion') {
    return generateBuffPotion();
  }

  if (dropType === 'potion') {
    const rarity = pickWeighted(RARITIES);
    const tierIndex = Math.min(POTION_TIERS.length - 1, Math.floor(monsterLevel / 4));
    const tier = POTION_TIERS[tierIndex];
    const healAmount = Math.floor(tier.baseHeal + monsterLevel * 4 * rarity.multiplier);
    return {
      id: uid(),
      name: tier.name,
      type: 'potion',
      slot: null,
      level: Math.max(1, monsterLevel),
      rarity: rarity.name,
      rarityClass: rarity.cssClass,
      rarityColor: rarity.color,
      healAmount,
      icon: 'potion',
      sellPrice: Math.floor(healAmount * 0.6),
    };
  }

  if (dropType === 'energy-drink') {
    const rarity = pickWeighted(RARITIES);
    const tierIndex = Math.min(ENERGY_DRINK_TIERS.length - 1, Math.floor(monsterLevel / 4));
    const tier = ENERGY_DRINK_TIERS[tierIndex];
    const energyAmount = Math.floor(tier.baseEnergy * rarity.multiplier);
    return {
      id: uid(),
      name: tier.name,
      type: 'energy-drink',
      slot: null,
      level: Math.max(1, monsterLevel),
      rarity: rarity.name,
      rarityClass: rarity.cssClass,
      rarityColor: rarity.color,
      energyAmount,
      icon: 'energy-drink',
      sellPrice: Math.floor(energyAmount * 0.8),
    };
  }

  const pool = ITEM_LIBRARY[dropType];
  if (!pool) return null;
  const template = pickFromLibrary(pool, monsterLevel);
  if (!template) return null;

  return buildGearDrop(template, monsterLevel, dropType);
}

export function rollDrop(dropTable, monsterLevel) {
  if (!dropTable || dropTable.length === 0) return null;
  const drop = pickWeighted(dropTable);
  return generateItem(drop.type, monsterLevel);
}

// Generate an item from a daily reward spec: { kind:'item'|'potion', type, rarity, minLevel }
// Picks a random template of the given type + rarity, scaled to player level.
export function generateRewardItem(spec, playerLevel) {
  const effectiveLevel = Math.max(spec.minLevel || 1, playerLevel);

  if (spec.kind === 'potion') {
    const rarityData = RARITY_LOOKUP[spec.rarity] || RARITIES[0];
    const tierIndex = Math.min(POTION_TIERS.length - 1, Math.floor(effectiveLevel / 4));
    const tier = POTION_TIERS[tierIndex];
    const healAmount = Math.floor(tier.baseHeal + effectiveLevel * 4 * rarityData.multiplier);
    return {
      id: uid(),
      name: tier.name,
      type: 'potion',
      slot: null,
      level: effectiveLevel,
      rarity: rarityData.name,
      rarityClass: rarityData.cssClass,
      rarityColor: rarityData.color,
      healAmount,
      icon: 'potion',
      sellPrice: Math.floor(healAmount * 0.6),
    };
  }

  const pool = ITEM_LIBRARY[spec.type];
  if (!pool) return null;

  // Filter to matching rarity candidates near the player's level
  const candidates = pool.filter(t => t.rarity === spec.rarity && t.level <= effectiveLevel + 3);
  const source = candidates.length > 0
    ? candidates
    : pool.filter(t => t.rarity === spec.rarity);
  if (source.length === 0) return generateItem(spec.type, effectiveLevel);

  const template = source[Math.floor(Math.random() * source.length)];
  return buildGearDrop(template, effectiveLevel, spec.type);
}

export function getShopItems(playerLevel) {
  const tierIndex = Math.min(POTION_TIERS.length - 1, Math.floor(playerLevel / 4));
  const start = Math.max(0, tierIndex - 1);
  const end = Math.min(POTION_TIERS.length - 1, start + 2);
  const normalizedStart = Math.max(0, end - 2);
  const tiers = POTION_TIERS.slice(normalizedStart, end + 1);

  return tiers.map((tier, offset) => {
    const absoluteIdx = normalizedStart + offset;
    const rarity = RARITIES[Math.min(RARITIES.length - 1, absoluteIdx)];
    const effectiveLevel = Math.max(1, absoluteIdx * 4 + 1);
    const healAmount = Math.floor(tier.baseHeal + playerLevel * 3 + absoluteIdx * 10);
    const buyPrice = Math.floor(healAmount * 1.4 + effectiveLevel * 5);

    return {
      id: uid(),
      name: tier.name,
      type: 'potion',
      slot: null,
      level: effectiveLevel,
      rarity: rarity.name,
      rarityClass: rarity.cssClass,
      rarityColor: rarity.color,
      healAmount,
      icon: 'potion',
      buyPrice,
      sellPrice: Math.floor(healAmount * 0.6),
    };
  });
}

export function getShopEnergyDrinks(playerLevel) {
  const tierIndex = Math.min(ENERGY_DRINK_TIERS.length - 1, Math.floor(playerLevel / 4));
  const start = Math.max(0, tierIndex - 1);
  const end = Math.min(ENERGY_DRINK_TIERS.length - 1, start + 2);
  const normalizedStart = Math.max(0, end - 2);
  const tiers = ENERGY_DRINK_TIERS.slice(normalizedStart, end + 1);

  return tiers.map((tier, offset) => {
    const absoluteIdx = normalizedStart + offset;
    const rarity = RARITIES[Math.min(RARITIES.length - 1, absoluteIdx)];
    const energyAmount = Math.floor(tier.baseEnergy * rarity.multiplier);
    const buyPrice = Math.floor(energyAmount * 2 + (absoluteIdx + 1) * 8);

    return {
      id: uid(),
      name: tier.name,
      type: 'energy-drink',
      slot: null,
      level: Math.max(1, absoluteIdx * 4 + 1),
      rarity: rarity.name,
      rarityClass: rarity.cssClass,
      rarityColor: rarity.color,
      energyAmount,
      icon: 'energy-drink',
      buyPrice,
      sellPrice: Math.floor(energyAmount * 0.8),
    };
  });
}

export function getDailyFeaturedItems(playerLevel, shopSeed) {
  const seed = shopSeed != null ? shopSeed : (() => {
    const today = new Date();
    return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  })();
  const rng = seededRandom(seed + playerLevel);

  // Only Uncommon and Epic gear available in the featured store — Rare and Legendary must be earned through drops
  // Epic is extremely rare in the featured store (weight reduced from 2.5 to 0.1)
  const extraordinaryRarities = RARITIES
    .filter(r => r.name === 'Uncommon' || r.name === 'Epic')
    .map(r => r.name === 'Epic' ? { ...r, weight: 0.1 } : r);
  const gearTypes = ['sword', 'shield', 'helmet', 'armor', 'boots', 'ring'];
  const featured = [];
  const usedNames = new Set();

  const count = 3;
  for (let i = 0; i < count; i++) {
    const typeIdx = Math.floor(rng() * gearTypes.length);
    const type = gearTypes[typeIdx];
    const pool = ITEM_LIBRARY[type];
    if (!pool) continue;

    const rarity = seededPickWeighted(extraordinaryRarities, rng);
    const candidates = pool.filter(item => item.rarity === rarity.name && item.level <= Math.max(playerLevel + 3, 5));
    if (candidates.length === 0) continue;

    const template = candidates[Math.floor(rng() * candidates.length)];
    if (usedNames.has(template.name)) continue;
    usedNames.add(template.name);

    const rarityData = RARITY_LOOKUP[template.rarity] || RARITIES[0];
    const baseLevelFactor = 1 + template.level * 0.05;
    const atk = template.baseAtk > 0
      ? Math.max(0, Math.round(template.baseAtk * baseLevelFactor * rarityData.multiplier))
      : 0;
    const def = template.baseDef > 0
      ? Math.max(0, Math.round(template.baseDef * baseLevelFactor * rarityData.multiplier))
      : 0;

    const buyPrice = Math.floor((atk + def) * 8 + template.level * 6 + rarityData.multiplier * 20);

    featured.push({
      id: uid(),
      name: template.name,
      type,
      slot: template.slot,
      level: template.level,
      rarity: template.rarity,
      rarityClass: rarityData.cssClass,
      rarityColor: rarityData.color,
      atk,
      def,
      icon: template.icon,
      buyPrice,
      sellPrice: Math.max(10, Math.floor((atk + def) * 4 + template.level * 3 + rarityData.multiplier * 10)),
    });
  }

  return featured;
}

// ---- ARMOURER SHOP: gear items for buy ----
export function getArmourerStock(playerLevel, shopSeed) {
  const gearTypes = ['sword', 'shield', 'helmet', 'armor', 'boots', 'ring'];
  const items = [];
  const usedNames = new Set();
  const rng = shopSeed != null ? seededRandom(shopSeed + playerLevel * 7) : null;

  for (const type of gearTypes) {
    const pool = ITEM_LIBRARY[type];
    if (!pool) continue;
    // Pick items near player level
    const candidates = pool.filter(t => t.level <= playerLevel + 3 && t.level >= Math.max(1, playerLevel - 5));
    const source = candidates.length > 0 ? candidates : pool.filter(t => t.level <= playerLevel + 5);
    // Pick up to 2 per type — use weighted selection so rare items are extremely rare in shops
    // Apply heavy shop penalty: Epic weight /50, Legendary weight /500
    const shopWeighted = source.map(t => {
      let w = t.weight || (RARITY_LOOKUP[t.rarity]?.weight ?? 1);
      if (t.rarity === 'Epic') w *= 0.02;
      if (t.rarity === 'Legendary') w *= 0.002;
      return { template: t, weight: w };
    });
    let count = 0;
    for (let attempt = 0; attempt < 10 && count < 2; attempt++) {
      const pick = rng ? seededPickWeighted(shopWeighted, rng) : pickWeighted(shopWeighted);
      const template = pick.template;
      if (usedNames.has(template.name)) continue;
      usedNames.add(template.name);
      const rarityData = RARITY_LOOKUP[template.rarity] || RARITIES[0];
      const baseLevelFactor = 1 + template.level * 0.05;
      const adaptFactor = 1 + Math.max(0, playerLevel - template.level) * 0.03;
      const atk = template.baseAtk > 0
        ? Math.max(0, Math.round(template.baseAtk * baseLevelFactor * adaptFactor * rarityData.multiplier))
        : 0;
      const def = template.baseDef > 0
        ? Math.max(0, Math.round(template.baseDef * baseLevelFactor * adaptFactor * rarityData.multiplier))
        : 0;
      const effectiveLevel = Math.max(template.level, playerLevel);
      const buyPrice = Math.floor((atk + def) * 6 + effectiveLevel * 4 + rarityData.multiplier * 15);

      items.push({
        id: uid(),
        name: template.name,
        type,
        slot: template.slot,
        level: effectiveLevel,
        rarity: template.rarity,
        rarityClass: rarityData.cssClass,
        rarityColor: rarityData.color,
        atk,
        def,
        icon: template.icon,
        buyPrice,
        sellPrice: Math.max(10, Math.floor((atk + def) * 4 + effectiveLevel * 3 + rarityData.multiplier * 10)),
      });
      count++;
    }
  }

  return items;
}

// ---- LOCATION-SPECIFIC ITEM DROPS ----

// Generate an item that is specifically findable at the given location
export function generateLocationItem(locationId, playerLevel) {
  const gearTypes = ['sword', 'shield', 'helmet', 'armor', 'boots', 'ring'];
  const candidates = [];

  for (const type of gearTypes) {
    const pool = ITEM_LIBRARY[type];
    if (!pool) continue;
    for (const template of pool) {
      if (template.findableAt && template.findableAt.includes(locationId)) {
        candidates.push({ template, type });
      }
    }
  }

  if (candidates.length === 0) return null;

  // Weight by level proximity
  const weighted = candidates.map(({ template, type }) => {
    const levelDiff = Math.abs(template.level - playerLevel);
    const weight = Math.max(1, 18 - levelDiff * 2);
    return { template, type, weight };
  });

  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;
  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) {
      const item = buildGearDrop(entry.template, playerLevel, entry.type);
      item.foundLocation = locationId;
      return item;
    }
  }

  const last = weighted[weighted.length - 1];
  const item = buildGearDrop(last.template, playerLevel, last.type);
  item.foundLocation = locationId;
  return item;
}

// ---- BASE BUILDING: Material drops ----

// Roll for a material drop based on the region the player is in
export function rollMaterialDrop(regionId) {
  const config = MATERIAL_DROP_CONFIG[regionId];
  if (!config) return null;
  if (Math.random() > config.dropRate) return null;

  const totalWeight = config.materials.reduce((s, m) => s + m.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const mat of config.materials) {
    roll -= mat.weight;
    if (roll <= 0) {
      return createMaterialItem(mat.id, 1);
    }
  }
  return createMaterialItem(config.materials[config.materials.length - 1].id, 1);
}

// Generate a crafted item from workshop template
export function generateCraftedItem(templateId, playerLevel) {
  const template = CRAFTED_ITEMS[templateId];
  if (!template) return null;

  const rarityData = RARITY_LOOKUP[template.rarity] || RARITIES[0];
  const levelFactor = 1 + Math.max(template.baseLevel, playerLevel) * 0.05;
  const atk = template.baseAtk > 0
    ? Math.max(0, Math.round(template.baseAtk * levelFactor * rarityData.multiplier))
    : 0;
  const def = template.baseDef > 0
    ? Math.max(0, Math.round(template.baseDef * levelFactor * rarityData.multiplier))
    : 0;
  const effectiveLevel = Math.max(template.baseLevel, playerLevel);

  return {
    id: uid(),
    name: template.name,
    type: template.slot === 'accessory' ? 'ring' : template.slot === 'weapon' ? 'sword' : template.slot,
    slot: template.slot,
    level: effectiveLevel,
    rarity: template.rarity,
    rarityClass: rarityData.cssClass,
    rarityColor: rarityData.color,
    atk,
    def,
    icon: template.slot,
    sellPrice: Math.max(10, Math.floor((atk + def) * 4 + effectiveLevel * 3 + rarityData.multiplier * 10)),
  };
}

// Generate loot from adventure camp mission
export function generateCampLoot(lootTier, playerLevel) {
  const table = CAMP_LOOT_TABLES[lootTier];
  if (!table) return { items: [], gold: 0 };

  const mission = table;
  const results = [];
  const usedIds = new Set();

  for (let i = 0; i < mission.maxItems; i++) {
    const totalWeight = mission.items.reduce((s, item) => s + item.weight, 0);
    let roll = Math.random() * totalWeight;
    for (const entry of mission.items) {
      roll -= entry.weight;
      if (roll <= 0) {
        if (entry.type === 'material') {
          const qty = entry.qtyRange
            ? entry.qtyRange[0] + Math.floor(Math.random() * (entry.qtyRange[1] - entry.qtyRange[0] + 1))
            : 1;
          results.push(createMaterialItem(entry.id, qty));
        } else if (entry.type === 'gear') {
          const item = generateItem(entry.gearType, playerLevel);
          if (item) results.push(item);
        }
        break;
      }
    }
  }

  return results;
}
