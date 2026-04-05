// Item generation, loot tables, and shop logic
// All item creation logic extracted from gameData.js

import { RARITIES, RARITY_LOOKUP, ITEM_LIBRARY, POTION_TIERS, ENERGY_DRINK_TIERS, ITEM_PASSIVES, PASSIVE_RARITY_VALUES } from '../data/gameData';
import { MATERIAL_DROP_CONFIG, BUILDING_MATERIALS, CRAFTED_ITEMS, CAMP_LOOT_TABLES, createMaterialItem, EGG_DROP_CONFIG, createEggItem, TICKET_DROP_CONFIG, createTicketItem } from '../data/baseData';
import { CHEST_LOOKUP, RARITY_ORDER, CHEST_MATERIAL_POOLS } from '../data/lootChests';
import { uid, pickWeighted, seededRandom, seededPickWeighted } from './utils';
import { prob } from '../data/probabilityStore';

// Normal-distribution weight: items near targetLevel are most common,
// items 10+ levels above targetLevel become extremely rare.
function gaussianWeight(itemLevel, targetLevel) {
  const diff = itemLevel - targetLevel;
  // Use a tighter sigma for items ABOVE player level to make high-level items rarer
  const sigma = diff > 0 ? 4 : 6;
  let w = Math.exp(-0.5 * (diff / sigma) ** 2);
  // Extra suppression: items 10+ levels above become vanishingly rare
  if (diff > 10) {
    w *= Math.max(0.001, Math.exp(-0.8 * (diff - 10)));
  }
  return Math.max(0.001, w);
}

function pickFromLibrary(pool, targetLevel) {
  if (!pool || pool.length === 0) return null;
  // Hard cap: never pick items more than 5 levels above target
  const capped = pool.filter(item => item.level <= targetLevel + 5);
  const source = capped.length > 0 ? capped : pool;
  const weighted = source.map(item => {
    const levelWeight = gaussianWeight(item.level, targetLevel);
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

// Roll a random passive for Uncommon+ gear based on slot and rarity
function rollItemPassive(slot, rarity) {
  if (rarity === 'Common') return null;
  const passivePool = ITEM_PASSIVES[slot];
  if (!passivePool || passivePool.length === 0) return null;
  const ranges = PASSIVE_RARITY_VALUES[rarity];
  if (!ranges) return null;

  // Weighted pick from the passive pool
  const totalWeight = passivePool.reduce((s, p) => s + p.weight, 0);
  let roll = Math.random() * totalWeight;
  let picked = passivePool[passivePool.length - 1];
  for (const p of passivePool) {
    roll -= p.weight;
    if (roll <= 0) { picked = p; break; }
  }

  const range = ranges[picked.format];
  const value = range[0] + Math.floor(Math.random() * (range[1] - range[0] + 1));

  return { id: picked.id, label: picked.label, format: picked.format, value };
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
  // Use the template level as the item's equip requirement level
  const effectiveLevel = template.level;
  const passive = rollItemPassive(template.slot, template.rarity);

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
    classes: template.classes || null,
    passive: passive || undefined,
    sellPrice: Math.max(10, Math.floor((atk + def) * 4 + effectiveLevel * 3 + rarityData.multiplier * 10)),
  };
}

export function generateItem(dropType, monsterLevel) {
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
  if (Math.random() > prob('loot.monsterDropChance')) return null;
  const drop = pickWeighted(dropTable);
  return generateItem(drop.type, monsterLevel);
}

// Boss-specific drop: always drops a gear item of at least Rare quality
export function rollBossDrop(dropTable, monsterLevel) {
  if (!dropTable || dropTable.length === 0) return null;
  // Filter to gear types only (no potions/energy-drinks)
  const gearDrops = dropTable.filter(d => d.type !== 'potion' && d.type !== 'energy-drink');
  const table = gearDrops.length > 0 ? gearDrops : dropTable;
  const drop = pickWeighted(table);
  const pool = ITEM_LIBRARY[drop.type];
  if (!pool) return generateItem(drop.type, monsterLevel);

  const template = pickFromLibrary(pool, monsterLevel);
  if (!template) return generateItem(drop.type, monsterLevel);

  // Ensure minimum Rare rarity — re-roll rarity from Rare+ tiers
  const rareAndAbove = RARITIES.filter(r => r.multiplier >= 1.7);
  const rarity = pickWeighted(rareAndAbove);
  const upgraded = { ...template, rarity: rarity.name };
  return buildGearDrop(upgraded, monsterLevel, drop.type);
}

// Boss-specific material drops: always drops 3-5 materials from the region
export function rollBossMaterials(regionId) {
  const config = MATERIAL_DROP_CONFIG[regionId];
  if (!config) return [];
  const min = prob('loot.bossMaterialMin');
  const max = prob('loot.bossMaterialMax');
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const materials = [];
  for (let i = 0; i < count; i++) {
    const totalWeight = config.materials.reduce((s, m) => s + m.weight, 0);
    let roll = Math.random() * totalWeight;
    for (const mat of config.materials) {
      roll -= mat.weight;
      if (roll <= 0) {
        materials.push(createMaterialItem(mat.id, 1));
        break;
      }
    }
  }
  return materials;
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
  let source = candidates;
  if (source.length === 0) {
    source = pool.filter(t => t.rarity === spec.rarity && t.level <= effectiveLevel + 5);
  }
  if (source.length === 0) {
    source = pool.filter(t => t.rarity === spec.rarity);
  }
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
      stock: 3 + Math.floor(Math.random() * 3),
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

export function getDailyFeaturedItems(playerLevel, shopSeed, playerClass) {
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
  const gearTypes = ['sword', 'shield', 'helmet', 'armor', 'boots', 'ring', 'gloves', 'amulet', 'belt', 'cape'];
  const featured = [];
  const usedNames = new Set();

  const count = 3;
  for (let i = 0; i < count; i++) {
    const typeIdx = Math.floor(rng() * gearTypes.length);
    const type = gearTypes[typeIdx];
    const pool = ITEM_LIBRARY[type];
    if (!pool) continue;

    const rarity = seededPickWeighted(extraordinaryRarities, rng);
    // ~30% chance to show a cross-class item in the featured store
    const showCrossClass = rng() < 0.3;
    const classPool = playerClass && !showCrossClass ? pool.filter(t => !t.classes || t.classes.includes(playerClass)) : pool;
    const candidates = classPool.filter(item => item.rarity === rarity.name && item.level <= Math.max(playerLevel + 3, 5));
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
    const passive = rollItemPassive(template.slot, template.rarity);

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
      classes: template.classes || null,
      passive: passive || undefined,
      buyPrice,
      sellPrice: Math.max(10, Math.floor((atk + def) * 4 + template.level * 3 + rarityData.multiplier * 10)),
      stock: 1,
    });
  }

  return featured;
}

// ---- ARMOURER SHOP: gear items for buy ----
export function getArmourerStock(playerLevel, shopSeed, playerClass) {
  const gearTypes = ['sword', 'shield', 'helmet', 'armor', 'boots', 'ring', 'gloves', 'amulet', 'belt', 'cape'];
  const items = [];
  const usedNames = new Set();
  const rng = shopSeed != null ? seededRandom(shopSeed + playerLevel * 7) : null;

  for (const type of gearTypes) {
    let pool = ITEM_LIBRARY[type];
    if (!pool) continue;
    // Filter by player class, but ~25% chance to show a cross-class item
    const crossClassRoll = rng ? rng() : Math.random();
    if (playerClass && crossClassRoll >= 0.25) {
      pool = pool.filter(t => !t.classes || t.classes.includes(playerClass));
    }
    // Pick items near player level
    const candidates = pool.filter(t => t.level <= playerLevel + 3 && t.level >= Math.max(1, playerLevel - 5));
    const source = candidates.length > 0 ? candidates : pool.filter(t => t.level <= playerLevel + 5);
    // Pick up to 2 per type — use weighted selection so rare items are extremely rare in shops
    // Apply heavy shop penalty: Epic weight /50, Legendary weight /500
    const shopWeighted = source.map(t => {
      let w = t.weight || (RARITY_LOOKUP[t.rarity]?.weight ?? 1);
      if (t.rarity === 'Epic') w *= prob('loot.shopEpicWeight');
      if (t.rarity === 'Legendary') w *= prob('loot.shopLegendaryWeight');
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
      const effectiveLevel = template.level;
      const buyPrice = Math.floor((atk + def) * 6 + effectiveLevel * 4 + rarityData.multiplier * 15);
      const passive = rollItemPassive(template.slot, template.rarity);

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
        classes: template.classes || null,
        passive: passive || undefined,
        buyPrice,
        sellPrice: Math.max(10, Math.floor((atk + def) * 4 + effectiveLevel * 3 + rarityData.multiplier * 10)),
        stock: 1,
      });
      count++;
    }
  }

  return items;
}

// ---- LOCATION-SPECIFIC ITEM DROPS ----

// Generate an item that is specifically findable at the given location
export function generateLocationItem(locationId, playerLevel) {
  const gearTypes = ['sword', 'shield', 'helmet', 'armor', 'boots', 'ring', 'gloves', 'amulet', 'belt', 'cape'];
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

  // Weight by level proximity using normal distribution
  const weighted = candidates.map(({ template, type }) => {
    const weight = gaussianWeight(template.level, playerLevel) * (template.weight || 1);
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
const REGION_MATERIAL_KEY = {
  'neon-district': 'material.neonDistrict',
  'frozen-wastes': 'material.frozenWastes',
  'scorched-badlands': 'material.scorchedBadlands',
  'toxic-marshlands': 'material.toxicMarshlands',
  'abyssal-depths': 'material.abyssalDepths',
  'celestial-highlands': 'material.celestialHighlands',
  'void-nexus': 'material.voidNexus',
};

export function rollMaterialDrop(regionId) {
  const config = MATERIAL_DROP_CONFIG[regionId];
  if (!config) return null;
  const dropRate = REGION_MATERIAL_KEY[regionId] ? prob(REGION_MATERIAL_KEY[regionId]) : config.dropRate;
  if (Math.random() > dropRate) return null;

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
  const levelFactor = 1 + template.baseLevel * 0.05;
  const atk = template.baseAtk > 0
    ? Math.max(0, Math.round(template.baseAtk * levelFactor * rarityData.multiplier))
    : 0;
  const def = template.baseDef > 0
    ? Math.max(0, Math.round(template.baseDef * levelFactor * rarityData.multiplier))
    : 0;
  const effectiveLevel = template.baseLevel;
  const passive = rollItemPassive(template.slot, template.rarity);

  return {
    id: uid(),
    name: template.name,
    type: template.slot === 'accessory' ? 'ring' : template.slot === 'weapon' ? 'sword' : template.slot === 'gloves' ? 'gloves' : template.slot === 'amulet' ? 'amulet' : template.slot === 'belt' ? 'belt' : template.slot === 'cape' ? 'cape' : template.slot,
    slot: template.slot,
    level: effectiveLevel,
    rarity: template.rarity,
    rarityClass: rarityData.cssClass,
    rarityColor: rarityData.color,
    atk,
    def,
    icon: template.slot,
    classes: template.classes || null,
    passive: passive || undefined,
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

// Roll for a rare egg drop based on the region the player is in
const REGION_EGG_KEY = {
  'neon-district': 'egg.neonDistrict',
  'frozen-wastes': 'egg.frozenWastes',
  'scorched-badlands': 'egg.scorchedBadlands',
  'toxic-marshlands': 'egg.toxicMarshlands',
  'abyssal-depths': 'egg.abyssalDepths',
  'celestial-highlands': 'egg.celestialHighlands',
  'void-nexus': 'egg.voidNexus',
};

export function rollEggDrop(regionId) {
  const config = EGG_DROP_CONFIG[regionId];
  if (!config) return null;
  const dropRate = REGION_EGG_KEY[regionId] ? prob(REGION_EGG_KEY[regionId]) : config.dropRate;
  if (Math.random() > dropRate) return null;

  const totalWeight = config.eggs.reduce((s, e) => s + e.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of config.eggs) {
    roll -= entry.weight;
    if (roll <= 0) {
      return createEggItem(entry.id);
    }
  }
  return createEggItem(config.eggs[config.eggs.length - 1].id);
}

// ---- REGION TICKET DROPS ----

// Roll for a very rare region ticket drop based on current region
export function rollTicketDrop(regionId) {
  const config = TICKET_DROP_CONFIG[regionId];
  if (!config) return null;
  if (Math.random() > config.dropRate) return null;

  const totalWeight = config.tickets.reduce((s, t) => s + t.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of config.tickets) {
    roll -= entry.weight;
    if (roll <= 0) {
      return createTicketItem(entry.regionId);
    }
  }
  return createTicketItem(config.tickets[config.tickets.length - 1].regionId);
}

// ---- LOOT CHEST OPENING ----

// Filter rarities to a min/max range
function filterRarities(rarityMin, rarityMax) {
  const minIdx = rarityMin ? RARITY_ORDER.indexOf(rarityMin) : 0;
  const maxIdx = rarityMax ? RARITY_ORDER.indexOf(rarityMax) : RARITY_ORDER.length - 1;
  return RARITIES.filter(r => {
    const idx = RARITY_ORDER.indexOf(r.name);
    return idx >= minIdx && idx <= maxIdx;
  });
}

// Open a loot chest and return { items: [], gold: number }
export function openLootChest(chestId, playerLevel, playerClass) {
  const chest = CHEST_LOOKUP[chestId];
  if (!chest) return { items: [], gold: 0 };

  // Roll gold bonus
  const gold = chest.goldBonus.min + Math.floor(Math.random() * (chest.goldBonus.max - chest.goldBonus.min + 1));

  // Roll item count
  const count = chest.itemCount.min + Math.floor(Math.random() * (chest.itemCount.max - chest.itemCount.min + 1));

  const items = [];
  for (let i = 0; i < count; i++) {
    // Pick a loot table entry
    const entry = pickWeighted(chest.lootTable);

    if (entry.type === 'potion') {
      items.push(generateItem('potion', playerLevel));
      continue;
    }

    if (entry.type === 'energy-drink') {
      items.push(generateItem('energy-drink', playerLevel));
      continue;
    }

    if (entry.type === 'material') {
      const pool = CHEST_MATERIAL_POOLS[entry.materialPool || 'common'];
      if (pool && pool.length > 0) {
        const matId = pool[Math.floor(Math.random() * pool.length)];
        items.push(createMaterialItem(matId, 1));
      }
      continue;
    }

    // Gear item — pick from library with rarity constraints
    const gearPool = ITEM_LIBRARY[entry.type];
    if (!gearPool) continue;

    const allowedRarities = filterRarities(entry.rarityMin, entry.rarityMax);
    const allowedNames = new Set(allowedRarities.map(r => r.name));

    // Filter candidates by rarity and level
    let candidates = gearPool.filter(t =>
      allowedNames.has(t.rarity) && t.level <= playerLevel + 3
    );
    // Fallback: relax level constraint but still cap at playerLevel + 5
    if (candidates.length === 0) {
      candidates = gearPool.filter(t => allowedNames.has(t.rarity) && t.level <= playerLevel + 5);
    }
    // Last resort: any rarity match (should rarely happen)
    if (candidates.length === 0) {
      candidates = gearPool.filter(t => allowedNames.has(t.rarity));
    }
    if (candidates.length === 0) continue;

    // Prefer class-matching items (70% chance)
    if (playerClass && Math.random() < 0.7) {
      const classCandidates = candidates.filter(t => !t.classes || t.classes.includes(playerClass));
      if (classCandidates.length > 0) candidates = classCandidates;
    }

    // Weight by level proximity
    const weighted = candidates.map(t => ({
      item: t,
      weight: gaussianWeight(t.level, playerLevel) * (t.weight || 1),
    }));
    const total = weighted.reduce((sum, w) => sum + w.weight, 0);
    let roll = Math.random() * total;
    let template = weighted[weighted.length - 1].item;
    for (const w of weighted) {
      roll -= w.weight;
      if (roll <= 0) { template = w.item; break; }
    }

    items.push(buildGearDrop(template, playerLevel, entry.type));
  }

  return { items, gold };
}
