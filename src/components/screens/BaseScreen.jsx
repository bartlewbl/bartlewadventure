import { useState, useMemo } from 'react';
import {
  BUILDINGS, BUILDING_MATERIALS, FUEL_ITEMS, BREWERY_RECIPES, SMELTER_RECIPES,
  WORKSHOP_RECIPES, SPARRING_DUMMIES, getChamberBuffs, getInnExpBonus, getWarehouseBonus,
  EGG_TYPES, getIncubatorSpeedBonus, getIncubatorSlots, getIncubatorFood, INCUBATOR_MAX_FOOD,
  FARM_SEEDS, CROP_QUALITIES,
} from '../../data/baseData';

const BUILDING_ICONS = {
  brewery: '\u2697\uFE0F',
  smelter: '\uD83D\uDD25',
  workshop: '\uD83D\uDD28',
  inn: '\uD83C\uDFE8',
  chamber: '\uD83D\uDECF\uFE0F',
  adventureCamp: '\u26FA',
  sparringRange: '\u2694\uFE0F',
  bank: '\uD83C\uDFE6',
  farm: '\uD83C\uDF3E',
  warehouse: '\uD83D\uDCE6',
  incubator: '\uD83E\uDD5A',
  marketplace: '\uD83D\uDED2',
};

const TAB_ICONS = {
  overview: '\uD83C\uDFE0',
  brewery: '\u2697\uFE0F',
  smelter: '\uD83D\uDD25',
  workshop: '\uD83D\uDD28',
  inn: '\uD83C\uDFE8',
  chamber: '\uD83D\uDECF\uFE0F',
  adventureCamp: '\u26FA',
  sparringRange: '\u2694\uFE0F',
  bank: '\uD83C\uDFE6',
  farm: '\uD83C\uDF3E',
  warehouse: '\uD83D\uDCE6',
  incubator: '\uD83E\uDD5A',
};

// ---- Building Info Modal ----

function getBuildingBenefits(buildingId, def) {
  switch (buildingId) {
    case 'brewery':
      return ['Craft healing potions (Small, Standard, Combat Stim)', 'Brew energy drinks to restore stamina', 'Uses herb bundles, glass vials, and toxic resin'];
    case 'smelter':
      return ['Smelt Iron Ore into Iron Ingots', 'Refine and multiply Crystal Shards & Copper Wire', 'Salvage unwanted gear into raw materials', 'Requires fuel to operate'];
    case 'workshop':
      return ['Forge weapons: daggers, swords, staves, plasma & void blades', 'Craft shields, helmets, armor, and boots', 'Create accessories: bracelets, rings, charms, pendants', '21 recipes across 6 gear categories'];
    case 'inn':
      return ['Purchase timed EXP boost buffs', 'Upgrade through 3 tiers for stronger boosts', 'Tier 1: +10% EXP | Tier 2: +20% EXP | Tier 3: +35% EXP', 'Boosts last 30 min up to 24 hours'];
    case 'chamber':
      return ['Upgrade Bed: bonus healing (+10% to +50%)', 'Upgrade Kitchen: passive ATK/DEF/HP buffs', 'Upgrade Study: passive Wisdom & Max Mana buffs', 'All buffs are permanent while upgrades are active'];
    case 'adventureCamp':
      return ['Send squads on timed missions for passive loot', 'Quick Raid (1h) to Full Campaign (24h)', 'Earn gold, materials, and gear while offline', 'Longer missions yield rarer rewards'];
    case 'sparringRange':
      return ['Fight training dummies with no HP or energy cost', '4 dummy tiers from Straw to Boss-level', 'Test your damage, skills, and gear setups', 'Great for optimizing your build'];
    case 'bank':
      return ['Safely deposit gold (10% fee, no loss on death)', 'Freeze gold for interest (1% to 5% return)', 'Borrow up to 1,000g with 15% interest', 'Manage your finances strategically'];
    case 'farm':
      return ['Plant seeds found while exploring to grow valuable crops', 'Crops have random quality: Wilted to Golden (3x value!)', '5 seed rarities from Common to Legendary', 'Sell harvested crops for profit, or buy material crops with gold'];
    case 'incubator':
      return ['Place rare eggs found from monsters to hatch them into pets', 'Eggs hatch over time into pets of varying rarity', 'Upgrade for more slots and faster hatching', 'Rarer eggs hatch into more powerful pets'];
    case 'warehouse':
      return ['Increases your inventory capacity by +20 slots', 'Upgrade through 5 tiers for +10 more each level', 'Base: 20 slots, Max: 80 slots at Legendary Vault', 'Essential for hoarding loot and materials'];
    default:
      return [def.description];
  }
}

function BuildingInfoModal({ buildingId, buildingDef, player, base, onClose, onBuild, onNavigate }) {
  const built = base.buildings?.[buildingId]?.built;
  const cost = buildingDef.buildCost;
  const meetsLevel = player.level >= buildingDef.levelReq;
  const benefits = getBuildingBenefits(buildingId, buildingDef);

  const canAffordGold = player.gold >= cost.gold;
  const matChecks = Object.entries(cost.materials || {}).map(([matId, qty]) => ({
    id: matId, name: BUILDING_MATERIALS[matId]?.name || matId, needed: qty, have: base.materials?.[matId] || 0,
  }));
  const canAffordMats = matChecks.every(m => m.have >= m.needed);

  return (
    <div className="base-info-overlay" onClick={onClose}>
      <div className="base-info-modal" onClick={e => e.stopPropagation()}>
        <div className="base-info-header">
          <div className="base-info-icon">{BUILDING_ICONS[buildingId] || '\uD83C\uDFE0'}</div>
          <div className="base-info-name">{buildingDef.name}</div>
          <button className="btn btn-sm base-info-close" onClick={onClose}>{'✕'}</button>
        </div>
        <div className="base-info-desc">{buildingDef.description}</div>

        <div className="base-info-section">
          <div className="base-info-section-title">Benefits</div>
          <ul className="base-info-benefits">
            {benefits.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>

        {!built && (
          <div className="base-info-section">
            <div className="base-info-section-title">Requirements</div>
            <div className={`base-info-req ${meetsLevel ? 'met' : 'unmet'}`}>
              Level {buildingDef.levelReq} {meetsLevel ? '(met)' : `(you are Lv.${player.level})`}
            </div>
            <div className="base-info-section-title" style={{ marginTop: '6px' }}>Build Cost</div>
            <div className="base-info-costs">
              <div className={`base-cost-item ${canAffordGold ? 'met' : 'unmet'}`}>
                {cost.gold}g {!canAffordGold && `(have ${player.gold}g)`}
              </div>
              {matChecks.map(m => (
                <div key={m.id} className={`base-cost-item ${m.have >= m.needed ? 'met' : 'unmet'}`}>
                  {m.needed}x {m.name} {m.have < m.needed ? `(have ${m.have})` : ''}
                </div>
              ))}
            </div>
            <button
              className="btn base-build-btn"
              disabled={!canAffordGold || !canAffordMats || !meetsLevel}
              onClick={() => { onBuild(buildingId); onClose(); }}
            >
              {!meetsLevel ? `Unlock at Lv.${buildingDef.levelReq}` : 'Construct'}
            </button>
          </div>
        )}

        {built && (
          <div className="base-info-section">
            <div className="base-info-built-badge">Constructed</div>
            <button className="btn btn-sm base-info-enter" onClick={() => { onNavigate(buildingId); onClose(); }}>
              Enter Building
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Sub-panels ----

function FuelPanel({ base, player, onAddFuel, onAddFuelFromStorage }) {
  const now = Date.now();
  let currentFuel = base.fuel || 0;
  if (base.fuelLastUpdate) {
    const elapsed = (now - base.fuelLastUpdate) / 60000;
    currentFuel = Math.max(0, currentFuel - elapsed);
  }
  const fuelPercent = Math.min(100, (currentFuel / 480) * 100);

  const fuelMats = Object.entries(base.materials || {}).filter(([id]) => FUEL_ITEMS[id] && base.materials[id] > 0);
  const invFuel = player.inventory.filter(i => i.type === 'material' && i.isFuel);

  return (
    <div className="base-fuel-panel">
      <div className="base-section-title">{'🔥'} Furnace Fuel</div>
      <div className="base-fuel-bar-track">
        <div className="base-fuel-bar-fill" style={{ width: `${fuelPercent}%` }} />
        <span className="base-fuel-bar-text">{Math.floor(currentFuel)} / 480 min</span>
      </div>
      {currentFuel <= 0 && <div className="base-warning">{'⚠'} No fuel! Buildings cannot operate.</div>}

      {fuelMats.length > 0 && (
        <div className="base-fuel-sources">
          <div className="base-sub-label">From Storage:</div>
          {fuelMats.map(([id, qty]) => (
            <button key={id} className="btn btn-sm base-fuel-btn" onClick={() => onAddFuelFromStorage(id)}>
              {FUEL_ITEMS[id].name} ({qty}) +{FUEL_ITEMS[id].burnTime}min
            </button>
          ))}
        </div>
      )}
      {invFuel.length > 0 && (
        <div className="base-fuel-sources">
          <div className="base-sub-label">From Inventory:</div>
          {invFuel.map(item => (
            <button key={item.id} className="btn btn-sm base-fuel-btn" onClick={() => onAddFuel(item)}>
              {item.name} +{FUEL_ITEMS[item.materialId]?.burnTime || 0}min
            </button>
          ))}
        </div>
      )}
      {fuelMats.length === 0 && invFuel.length === 0 && currentFuel <= 0 && (
        <div className="base-empty-text">No fuel materials. Find wood, charcoal, coal, or oil from exploring.</div>
      )}
    </div>
  );
}

function MaterialStoragePanel({ base, player, onStoreMaterial }) {
  const materials = base.materials || {};
  const invMaterials = player.inventory.filter(i => i.type === 'material');

  return (
    <div className="base-storage-panel">
      <div className="base-section-title">{'📦'} Material Storage</div>
      <div className="base-material-grid">
        {Object.entries(materials).filter(([, qty]) => qty > 0).map(([id, qty]) => {
          const mat = BUILDING_MATERIALS[id];
          return (
            <div key={id} className={`base-material-item rarity-${(mat?.rarity || 'common').toLowerCase()}`}>
              <span className="base-mat-name">{mat?.name || id}</span>
              <span className="base-mat-qty">x{qty}</span>
            </div>
          );
        })}
        {Object.entries(materials).filter(([, qty]) => qty > 0).length === 0 && (
          <div className="base-empty-text">No materials stored. Defeat monsters or explore to find materials.</div>
        )}
      </div>
      {invMaterials.length > 0 && (
        <div className="base-store-section">
          <div className="base-sub-label">Store from inventory:</div>
          <div className="base-store-list">
            {invMaterials.map(item => (
              <button key={item.id} className="btn btn-sm base-store-btn" onClick={() => onStoreMaterial(item)}>
                Store {item.name} {item.stackQuantity > 1 ? `x${item.stackQuantity}` : ''}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CraftingQueuePanel({ base, onCollect }) {
  const queue = base.craftingQueue;
  if (!queue) return null;
  const now = Date.now();
  const elapsed = now - queue.startTime;
  const done = elapsed >= queue.craftTime;
  const progress = Math.min(100, (elapsed / queue.craftTime) * 100);

  return (
    <div className="base-crafting-queue">
      <div className="base-sub-label">Crafting in Progress</div>
      <div className="base-craft-bar-track">
        <div className="base-craft-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      {done ? (
        <button className="btn btn-sm base-collect-btn" onClick={onCollect}>Collect!</button>
      ) : (
        <div className="base-craft-time">{Math.ceil((queue.craftTime - elapsed) / 1000)}s remaining</div>
      )}
    </div>
  );
}

function BuildingConstructPanel({ buildingId, buildingDef, player, base, onBuild }) {
  const cost = buildingDef.buildCost;
  const canAffordGold = player.gold >= cost.gold;
  const matChecks = Object.entries(cost.materials || {}).map(([matId, qty]) => ({
    id: matId, name: BUILDING_MATERIALS[matId]?.name || matId, needed: qty, have: base.materials?.[matId] || 0,
  }));
  const canAffordMats = matChecks.every(m => m.have >= m.needed);
  const meetsLevel = player.level >= buildingDef.levelReq;

  return (
    <div className="base-build-panel">
      <div className="base-build-name">{buildingDef.name}</div>
      <div className="base-build-desc">{buildingDef.description}</div>
      <div className="base-build-req">Requires: Level {buildingDef.levelReq}</div>
      <div className="base-build-costs">
        <div className={`base-cost-item ${canAffordGold ? 'met' : 'unmet'}`}>
          {cost.gold}g {canAffordGold ? '' : `(have ${player.gold}g)`}
        </div>
        {matChecks.map(m => (
          <div key={m.id} className={`base-cost-item ${m.have >= m.needed ? 'met' : 'unmet'}`}>
            {m.needed}x {m.name} {m.have < m.needed ? `(have ${m.have})` : ''}
          </div>
        ))}
      </div>
      <button
        className="btn base-build-btn"
        disabled={!canAffordGold || !canAffordMats || !meetsLevel}
        onClick={() => onBuild(buildingId)}
      >
        {!meetsLevel ? `Unlock at Lv.${buildingDef.levelReq}` : 'Construct'}
      </button>
    </div>
  );
}

function BreweryPanel({ base, onBrew, onCollect }) {
  const mats = base.materials || {};
  return (
    <div className="base-building-content">
      <div className="base-section-title">Brewery</div>
      <div className="base-section-desc">Craft potions and energy drinks from gathered materials.</div>
      <CraftingQueuePanel base={base} onCollect={onCollect} />
      {!base.craftingQueue && (
        <div className="base-recipe-list">
          {BREWERY_RECIPES.map(recipe => {
            const canCraft = Object.entries(recipe.materials).every(([id, qty]) => (mats[id] || 0) >= qty);
            return (
              <div key={recipe.id} className="base-recipe-item">
                <div className="base-recipe-info">
                  <div className="base-recipe-name">{recipe.name}</div>
                  <div className="base-recipe-desc">{recipe.desc}</div>
                  <div className="base-recipe-mats">
                    {Object.entries(recipe.materials).map(([id, qty]) => (
                      <span key={id} className={`base-recipe-mat ${(mats[id] || 0) >= qty ? 'met' : 'unmet'}`}>
                        {qty}x {BUILDING_MATERIALS[id]?.name || id} ({mats[id] || 0})
                      </span>
                    ))}
                  </div>
                </div>
                <button className="btn btn-sm" disabled={!canCraft} onClick={() => onBrew(recipe.id)}>Brew</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SmelterPanel({ base, player, onSmelt, onCollect }) {
  const mats = base.materials || {};
  return (
    <div className="base-building-content">
      <div className="base-section-title">Smelter</div>
      <div className="base-section-desc">Smelt raw materials into refined resources. Melt down gear for scraps.</div>
      <CraftingQueuePanel base={base} onCollect={onCollect} />
      {!base.craftingQueue && (
        <div className="base-recipe-list">
          {SMELTER_RECIPES.map(recipe => {
            const canCraft = recipe.materials
              ? Object.entries(recipe.materials).every(([id, qty]) => (mats[id] || 0) >= qty)
              : true;
            const hasGear = recipe.salvageGear ? player.inventory.some(i => i.slot) : true;
            return (
              <div key={recipe.id} className="base-recipe-item">
                <div className="base-recipe-info">
                  <div className="base-recipe-name">{recipe.name}</div>
                  <div className="base-recipe-desc">{recipe.desc}</div>
                  {recipe.materials && (
                    <div className="base-recipe-mats">
                      {Object.entries(recipe.materials).map(([id, qty]) => (
                        <span key={id} className={`base-recipe-mat ${(mats[id] || 0) >= qty ? 'met' : 'unmet'}`}>
                          {qty}x {BUILDING_MATERIALS[id]?.name || id} ({mats[id] || 0})
                        </span>
                      ))}
                    </div>
                  )}
                  {recipe.salvageGear && (
                    <div className="base-recipe-mats">
                      <span className={`base-recipe-mat ${hasGear ? 'met' : 'unmet'}`}>
                        1x Equipment from inventory
                      </span>
                    </div>
                  )}
                  <div className="base-recipe-fuel">Fuel: {recipe.fuelRequired} min</div>
                </div>
                <button
                  className="btn btn-sm"
                  disabled={!canCraft || !hasGear}
                  onClick={() => {
                    if (recipe.salvageGear) {
                      const gear = player.inventory.find(i => i.slot);
                      onSmelt(recipe.id, gear);
                    } else {
                      onSmelt(recipe.id, null);
                    }
                  }}
                >
                  Smelt
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function WorkshopPanel({ base, onCraft, onCollect }) {
  const mats = base.materials || {};
  return (
    <div className="base-building-content">
      <div className="base-section-title">Workshop</div>
      <div className="base-section-desc">Forge weapons, armor, and accessories from refined materials.</div>
      <CraftingQueuePanel base={base} onCollect={onCollect} />
      {!base.craftingQueue && (
        <div className="base-recipe-list">
          {WORKSHOP_RECIPES.map(recipe => {
            const canCraft = Object.entries(recipe.materials).every(([id, qty]) => (mats[id] || 0) >= qty);
            return (
              <div key={recipe.id} className="base-recipe-item">
                <div className="base-recipe-info">
                  <div className="base-recipe-name">{recipe.name}</div>
                  <div className="base-recipe-desc">{recipe.desc}</div>
                  <div className="base-recipe-mats">
                    {Object.entries(recipe.materials).map(([id, qty]) => (
                      <span key={id} className={`base-recipe-mat ${(mats[id] || 0) >= qty ? 'met' : 'unmet'}`}>
                        {qty}x {BUILDING_MATERIALS[id]?.name || id} ({mats[id] || 0})
                      </span>
                    ))}
                  </div>
                </div>
                <button className="btn btn-sm" disabled={!canCraft} onClick={() => onCraft(recipe.id)}>Craft</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InnPanel({ base, player, onUpgrade, onBuyBoost }) {
  const innLevel = base.innLevel || 1;
  const current = BUILDINGS.inn.upgrades.find(u => u.level === innLevel);
  const next = BUILDINGS.inn.upgrades.find(u => u.level === innLevel + 1);
  const boosts = current?.boosts || [];

  const boost = base.innBoost;
  const now = Date.now();
  const boostActive = boost && (now - boost.startTime < boost.duration);
  const boostRemaining = boostActive ? boost.duration - (now - boost.startTime) : 0;
  const boostMins = Math.ceil(boostRemaining / 60000);
  const boostHours = Math.floor(boostMins / 60);
  const boostMinsLeft = boostMins % 60;

  return (
    <div className="base-building-content">
      <div className="base-section-title">Inn</div>
      <div className="base-section-desc">Pay gold for timed EXP boosts. Upgrade the inn for stronger boosts.</div>
      <div className="base-inn-current">
        <div className="base-inn-level">{current?.name || 'Basic Inn'} (Tier {innLevel})</div>
        <div className="base-inn-bonus">Boost strength: +{Math.round((current?.expBonus || 0.10) * 100)}% EXP</div>
      </div>

      {boostActive && (
        <div className="base-inn-active-boost">
          <div className="base-sub-label">Active Boost</div>
          <div className="base-inn-boost-name">{boost.boostName}</div>
          <div className="base-inn-boost-info">
            +{Math.round(boost.expBonus * 100)}% EXP &middot; {boostHours > 0 ? `${boostHours}h ` : ''}{boostMinsLeft}m remaining
          </div>
        </div>
      )}

      <div className="base-inn-boosts">
        <div className="base-sub-label">{boostActive ? 'Replace Boost' : 'Buy EXP Boost'}</div>
        <div className="base-recipe-list">
          {boosts.map(b => (
            <div key={b.id} className="base-recipe-item">
              <div className="base-recipe-info">
                <div className="base-recipe-name">{b.name}</div>
                <div className="base-recipe-desc">{b.desc}</div>
              </div>
              <button
                className="btn btn-sm"
                disabled={player.gold < b.cost}
                onClick={() => onBuyBoost(b.id)}
              >
                {b.cost}g
              </button>
            </div>
          ))}
        </div>
      </div>

      {next ? (
        <div className="base-upgrade-section">
          <div className="base-sub-label">Upgrade to: {next.name}</div>
          <div className="base-upgrade-desc">{next.desc}</div>
          <div className="base-build-costs">
            <div className="base-cost-item">{next.upgradeCost.gold}g</div>
            {Object.entries(next.upgradeCost.materials || {}).map(([id, qty]) => (
              <div key={id} className="base-cost-item">
                {qty}x {BUILDING_MATERIALS[id]?.name || id} ({base.materials?.[id] || 0})
              </div>
            ))}
          </div>
          <button className="btn btn-sm" onClick={onUpgrade}>Upgrade</button>
        </div>
      ) : (
        <div className="base-max-level">Inn at max tier!</div>
      )}
    </div>
  );
}

function ChamberPanel({ base, onUpgrade }) {
  const upgrades = base.chamberUpgrades || {};
  const chamberDef = BUILDINGS.chamber;
  const buffs = getChamberBuffs(base);

  return (
    <div className="base-building-content">
      <div className="base-section-title">Chamber</div>
      <div className="base-section-desc">Your personal quarters. Upgrade furnishings for passive bonuses.</div>

      {(buffs.atkBuff > 0 || buffs.defBuff > 0 || buffs.hpBuff > 0 || buffs.manaBuff > 0 || buffs.healBonus > 0 || buffs.wisdomBuff > 0) && (
        <div className="base-buffs-summary">
          <div className="base-sub-label">Active Buffs:</div>
          {buffs.atkBuff > 0 && <span className="base-buff-tag">+{buffs.atkBuff} ATK</span>}
          {buffs.defBuff > 0 && <span className="base-buff-tag">+{buffs.defBuff} DEF</span>}
          {buffs.hpBuff > 0 && <span className="base-buff-tag">+{buffs.hpBuff} Max HP</span>}
          {buffs.manaBuff > 0 && <span className="base-buff-tag">+{buffs.manaBuff} Max Mana</span>}
          {buffs.healBonus > 0 && <span className="base-buff-tag">+{Math.round(buffs.healBonus * 100)}% Heal</span>}
          {buffs.wisdomBuff > 0 && <span className="base-buff-tag">+{buffs.wisdomBuff} Wisdom</span>}
        </div>
      )}

      <div className="base-chamber-upgrades">
        {Object.entries(chamberDef.subUpgrades).map(([subId, subDef]) => {
          const currentLevel = upgrades[subId] || 0;
          const currentData = currentLevel > 0 ? subDef.levels[currentLevel - 1] : null;
          const nextData = subDef.levels[currentLevel];

          return (
            <div key={subId} className="base-chamber-sub">
              <div className="base-chamber-sub-name">{subDef.name}</div>
              {currentData && (
                <div className="base-chamber-current">Lv.{currentLevel}: {currentData.name} - {currentData.desc}</div>
              )}
              {!currentData && <div className="base-chamber-current">Not yet installed</div>}
              {nextData ? (
                <div className="base-chamber-next">
                  <div className="base-upgrade-desc">Next: {nextData.name} - {nextData.desc}</div>
                  <div className="base-build-costs">
                    <span className="base-cost-item">{nextData.cost.gold}g</span>
                    {Object.entries(nextData.cost.materials || {}).map(([id, qty]) => (
                      <span key={id} className="base-cost-item">
                        {qty}x {BUILDING_MATERIALS[id]?.name || id}
                      </span>
                    ))}
                  </div>
                  <button className="btn btn-sm" onClick={() => onUpgrade(subId)}>Upgrade</button>
                </div>
              ) : (
                <div className="base-max-level">Maxed!</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdventureCampPanel({ base, onSend, onCollect }) {
  const mission = base.activeMission;
  const now = Date.now();

  if (mission) {
    const elapsed = now - mission.startTime;
    const done = elapsed >= mission.duration;
    const remaining = mission.duration - elapsed;
    const hours = Math.floor(remaining / 3600000);
    const mins = Math.floor((remaining % 3600000) / 60000);
    const missionDef = BUILDINGS.adventureCamp.missions.find(m => m.id === mission.missionId);

    return (
      <div className="base-building-content">
        <div className="base-section-title">Adventure Camp</div>
        <div className="base-section-desc">Your squad is on a {missionDef?.name || 'mission'}!</div>
        <div className="base-mission-status">
          {done ? (
            <div>
              <div className="base-mission-done">Squad has returned!</div>
              <button className="btn base-collect-btn" onClick={onCollect}>Collect Loot</button>
            </div>
          ) : (
            <div className="base-mission-time">Returns in {hours}h {mins}m</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="base-building-content">
      <div className="base-section-title">Adventure Camp</div>
      <div className="base-section-desc">Send squads out to pillage and gather resources. Longer missions yield better rewards.</div>
      <div className="base-mission-list">
        {BUILDINGS.adventureCamp.missions.map(m => (
          <div key={m.id} className="base-mission-item">
            <div className="base-mission-info">
              <div className="base-mission-name">{m.name}</div>
              <div className="base-mission-desc">{m.desc}</div>
              <div className="base-mission-gold">Gold: {m.goldRange[0]}-{m.goldRange[1]}g</div>
            </div>
            <button className="btn btn-sm" onClick={() => onSend(m.id)}>Send</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SparringPanel({ base, onStart, onAttack, onSkill, onReset }) {
  const dummy = base.sparringDummy;

  if (dummy) {
    const hp = base.sparringHp || 0;
    const hpPercent = Math.max(0, (hp / dummy.hp) * 100);
    return (
      <div className="base-building-content">
        <div className="base-section-title">Sparring Range</div>
        <div className="base-spar-active">
          <div className="base-spar-dummy-name">{dummy.name}</div>
          <div className="base-spar-desc">{dummy.desc}</div>
          <div className="base-spar-hp">HP: {hp}/{dummy.hp} (DEF: {dummy.def})</div>
          <div className="base-fuel-bar-track">
            <div className="base-spar-hp-fill" style={{ width: `${hpPercent}%` }} />
          </div>
          <div className="base-spar-actions">
            <button className="btn btn-sm" onClick={onAttack} disabled={hp <= 0}>Attack</button>
            <button className="btn btn-sm" onClick={onSkill} disabled={hp <= 0}>Skill</button>
            <button className="btn btn-sm base-spar-reset" onClick={onReset}>
              {hp <= 0 ? 'Back' : 'Stop'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="base-building-content">
      <div className="base-section-title">Sparring Range</div>
      <div className="base-section-desc">Test your damage against training dummies. No energy or HP cost.</div>
      <div className="base-dummy-list">
        {SPARRING_DUMMIES.map(d => (
          <div key={d.id} className="base-dummy-item">
            <div className="base-dummy-info">
              <div className="base-dummy-name">{d.name}</div>
              <div className="base-dummy-desc">{d.desc}</div>
              <div className="base-dummy-stats">HP: {d.hp} | DEF: {d.def}</div>
            </div>
            <button className="btn btn-sm" onClick={() => onStart(d.id)}>Fight</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FarmPanel({ base, player, onPlant, onPlantSeed, onHarvest }) {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [farmTab, setFarmTab] = useState('seeds');
  const plots = base.farmPlots || [];
  const crops = BUILDINGS.farm.crops;
  const now = Date.now();

  const seeds = player.inventory.filter(i => i.type === 'seed');

  const renderPlot = (plot, i) => {
    if (!plot) {
      return (
        <div key={i} className="base-farm-plot empty">
          <div className="base-farm-plot-label">Plot {i + 1} - Empty</div>
          {farmTab === 'seeds' ? (
            seeds.length > 0 ? (
              <div className="base-recipe-list">
                {seeds.map(seed => (
                  <div key={seed.id} className="base-recipe-item">
                    <div className="base-recipe-info">
                      <div className={`base-recipe-name rarity-${seed.rarityClass}`}>{seed.name}</div>
                      <div className="base-recipe-desc">{seed.description}</div>
                    </div>
                    <button className="btn btn-sm" onClick={() => onPlantSeed(i, seed.id)}>Plant</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="base-empty-text">No seeds in inventory. Explore locations to find seeds!</div>
            )
          ) : (
            <div className="base-farm-crop-select">
              <select
                className="base-bank-input"
                value={selectedCrop || ''}
                onChange={e => setSelectedCrop(e.target.value || null)}
              >
                <option value="">Select crop...</option>
                {crops.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.cost.gold}g) - {c.desc}</option>
                ))}
              </select>
              <button
                className="btn btn-sm"
                disabled={!selectedCrop || player.gold < (crops.find(c => c.id === selectedCrop)?.cost.gold || 999999)}
                onClick={() => { onPlant(i, selectedCrop); setSelectedCrop(null); }}
              >
                Plant
              </button>
            </div>
          )}
        </div>
      );
    }

    // Seed-based plot
    if (plot.isSeed) {
      const seedDef = FARM_SEEDS[plot.seedId];
      if (!seedDef) return null;
      const elapsed = now - plot.plantedAt;
      const done = elapsed >= seedDef.growTime;
      const progress = Math.min(100, (elapsed / seedDef.growTime) * 100);
      const remaining = Math.max(0, seedDef.growTime - elapsed);
      const mins = Math.ceil(remaining / 60000);
      const hours = Math.floor(mins / 60);
      const minsLeft = mins % 60;

      return (
        <div key={i} className={`base-farm-plot ${done ? 'ready' : 'growing'}`}>
          <div className={`base-farm-plot-label rarity-${seedDef.rarity.toLowerCase()}`}>
            Plot {i + 1} - {seedDef.cropName}
          </div>
          <div className="base-craft-bar-track">
            <div className="base-craft-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          {done ? (
            <button className="btn btn-sm base-collect-btn" onClick={() => onHarvest(i)}>Harvest!</button>
          ) : (
            <div className="base-craft-time">{hours > 0 ? `${hours}h ` : ''}{minsLeft}m remaining</div>
          )}
        </div>
      );
    }

    // Gold/material crop plot (legacy)
    const cropDef = crops.find(c => c.id === plot.cropId);
    if (!cropDef) return null;
    const elapsed = now - plot.plantedAt;
    const done = elapsed >= cropDef.growTime;
    const progress = Math.min(100, (elapsed / cropDef.growTime) * 100);
    const remaining = Math.max(0, cropDef.growTime - elapsed);
    const mins = Math.ceil(remaining / 60000);
    const hours = Math.floor(mins / 60);
    const minsLeft = mins % 60;

    return (
      <div key={i} className={`base-farm-plot ${done ? 'ready' : 'growing'}`}>
        <div className="base-farm-plot-label">Plot {i + 1} - {cropDef.name}</div>
        <div className="base-craft-bar-track">
          <div className="base-craft-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        {done ? (
          <button className="btn btn-sm base-collect-btn" onClick={() => onHarvest(i)}>Harvest!</button>
        ) : (
          <div className="base-craft-time">{hours > 0 ? `${hours}h ` : ''}{minsLeft}m remaining</div>
        )}
      </div>
    );
  };

  return (
    <div className="base-building-content">
      <div className="base-section-title">Farm</div>
      <div className="base-section-desc">Plant seeds found while exploring to grow crops and sell them for profit.</div>

      <div className="base-farm-tabs" style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
        <button
          className={`btn btn-sm ${farmTab === 'seeds' ? 'active' : ''}`}
          style={{ opacity: farmTab === 'seeds' ? 1 : 0.6 }}
          onClick={() => setFarmTab('seeds')}
        >
          Seeds ({seeds.length})
        </button>
        <button
          className={`btn btn-sm ${farmTab === 'crops' ? 'active' : ''}`}
          style={{ opacity: farmTab === 'crops' ? 1 : 0.6 }}
          onClick={() => setFarmTab('crops')}
        >
          Buy Crops
        </button>
      </div>

      <div className="base-farm-plots">
        <div className="base-sub-label">Farm Plots</div>
        {plots.map((plot, i) => renderPlot(plot, i))}
      </div>

      {farmTab === 'seeds' && (
        <div className="base-farm-crops">
          <div className="base-sub-label">Crop Quality Guide</div>
          <div className="base-recipe-list">
            {CROP_QUALITIES.map(q => (
              <div key={q.id} className="base-recipe-item">
                <div className="base-recipe-info">
                  <div className="base-recipe-name" style={{ color: q.color }}>{q.name}</div>
                  <div className="base-recipe-desc">
                    {q.multiplier}x sell value ({q.weight}% chance)
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="base-sub-label" style={{ marginTop: '10px' }}>Seed Types</div>
          <div className="base-recipe-list">
            {Object.values(FARM_SEEDS).map(s => (
              <div key={s.id} className="base-recipe-item">
                <div className="base-recipe-info">
                  <div className={`base-recipe-name rarity-${s.rarity.toLowerCase()}`}>{s.name}</div>
                  <div className="base-recipe-desc">{s.desc} (base value: {s.baseValue[0]}-{s.baseValue[1]}g)</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {farmTab === 'crops' && (
        <div className="base-farm-crops">
          <div className="base-sub-label">Available Crops (buy with gold)</div>
          <div className="base-recipe-list">
            {crops.map(c => (
              <div key={c.id} className="base-recipe-item">
                <div className="base-recipe-info">
                  <div className="base-recipe-name">{c.name}</div>
                  <div className="base-recipe-desc">{c.desc}</div>
                  <div className="base-recipe-mats">
                    <span className={`base-recipe-mat ${player.gold >= c.cost.gold ? 'met' : 'unmet'}`}>
                      Cost: {c.cost.gold}g
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WarehousePanel({ base, player, onUpgrade }) {
  const currentLevel = base.warehouseLevel || 1;
  const currentDef = BUILDINGS.warehouse.upgrades.find(u => u.level === currentLevel);
  const nextDef = BUILDINGS.warehouse.upgrades.find(u => u.level === currentLevel + 1);
  const mats = base.materials || {};

  return (
    <div className="base-building-content">
      <div className="base-section-title">Warehouse</div>
      <div className="base-section-desc">Expand your inventory capacity with upgrades.</div>

      <div className="base-inn-current">
        <div className="base-inn-level">{currentDef?.name || 'Basic Warehouse'} (Level {currentLevel})</div>
        <div className="base-inn-bonus">Inventory: {player.maxInventory} slots (+{currentDef?.inventoryBonus || 0} from warehouse)</div>
      </div>

      {nextDef ? (
        <div className="base-upgrade-section">
          <div className="base-sub-label">Upgrade to: {nextDef.name}</div>
          <div className="base-upgrade-desc">{nextDef.desc}</div>
          <div className="base-build-costs">
            <div className={`base-cost-item ${player.gold >= nextDef.upgradeCost.gold ? 'met' : 'unmet'}`}>
              {nextDef.upgradeCost.gold}g {player.gold < nextDef.upgradeCost.gold ? `(have ${player.gold}g)` : ''}
            </div>
            {Object.entries(nextDef.upgradeCost.materials || {}).map(([id, qty]) => (
              <div key={id} className={`base-cost-item ${(mats[id] || 0) >= qty ? 'met' : 'unmet'}`}>
                {qty}x {BUILDING_MATERIALS[id]?.name || id} ({mats[id] || 0})
              </div>
            ))}
          </div>
          <button className="btn btn-sm" onClick={onUpgrade}>Upgrade</button>
        </div>
      ) : (
        <div className="base-max-level">Warehouse at max level!</div>
      )}
    </div>
  );
}

function BankPanel({ base, player, onDeposit, onWithdraw, onFreeze, onCollectFrozen, onLoan, onRepay }) {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [freezeAmount, setFreezeAmount] = useState('');
  const [loanAmount, setLoanAmount] = useState('');

  const bankDef = BUILDINGS.bank;
  const deposit = base.bankDeposit || 0;
  const frozen = base.frozenGold;
  const loan = base.loan;

  const now = Date.now();
  const frozenDone = frozen && (now - frozen.startTime >= frozen.duration);
  const frozenDaysLeft = frozen ? Math.ceil((frozen.duration - (now - frozen.startTime)) / (24 * 60 * 60 * 1000)) : 0;
  const loanOverdue = loan && now > loan.dueTime;
  const loanDaysLeft = loan ? Math.ceil((loan.dueTime - now) / (24 * 60 * 60 * 1000)) : 0;

  return (
    <div className="base-building-content">
      <div className="base-section-title">Bank</div>
      <div className="base-section-desc">
        Store gold safely (10% deposit fee). Freeze gold for interest. Borrow up to {bankDef.maxLoanAmount}g.
      </div>

      <div className="base-bank-balance">
        <div className="base-bank-stat">Wallet: <strong>{player.gold}g</strong></div>
        <div className="base-bank-stat">Safe Deposit: <strong>{deposit}g</strong></div>
      </div>

      {/* Deposit */}
      <div className="base-bank-section">
        <div className="base-sub-label">Deposit (10% fee)</div>
        <div className="base-bank-row">
          <input
            type="number" min="1" max={player.gold}
            value={depositAmount} onChange={e => setDepositAmount(e.target.value)}
            placeholder="Amount" className="base-bank-input"
          />
          <button className="btn btn-sm" onClick={() => { onDeposit(parseInt(depositAmount) || 0); setDepositAmount(''); }}>
            Deposit
          </button>
        </div>
      </div>

      {/* Withdraw */}
      {deposit > 0 && (
        <div className="base-bank-section">
          <div className="base-sub-label">Withdraw (no fee)</div>
          <div className="base-bank-row">
            <input
              type="number" min="1" max={deposit}
              value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
              placeholder="Amount" className="base-bank-input"
            />
            <button className="btn btn-sm" onClick={() => { onWithdraw(parseInt(withdrawAmount) || 0); setWithdrawAmount(''); }}>
              Withdraw
            </button>
          </div>
        </div>
      )}

      {/* Freeze Gold */}
      <div className="base-bank-section">
        <div className="base-sub-label">Freeze Gold for Interest (max {bankDef.maxFreezeAmount}g)</div>
        {frozen ? (
          <div className="base-bank-frozen">
            <div>{frozen.amount}g frozen - {frozen.optionDesc}</div>
            {frozenDone ? (
              <button className="btn btn-sm base-collect-btn" onClick={onCollectFrozen}>Collect + Interest</button>
            ) : (
              <div className="base-bank-frozen-time">{frozenDaysLeft} day(s) remaining</div>
            )}
          </div>
        ) : (
          <div>
            <div className="base-bank-row">
              <input
                type="number" min="1" max={Math.min(deposit, bankDef.maxFreezeAmount)}
                value={freezeAmount} onChange={e => setFreezeAmount(e.target.value)}
                placeholder="Amount" className="base-bank-input"
              />
            </div>
            <div className="base-freeze-options">
              {bankDef.freezeOptions.map(opt => (
                <button
                  key={opt.id} className="btn btn-sm"
                  disabled={!parseInt(freezeAmount) || parseInt(freezeAmount) > deposit}
                  onClick={() => { onFreeze(parseInt(freezeAmount) || 0, opt.id); setFreezeAmount(''); }}
                >
                  {opt.desc}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loan */}
      <div className="base-bank-section">
        <div className="base-sub-label">Borrow Gold (max {bankDef.maxLoanAmount}g, 15% interest, 7 days)</div>
        {loan ? (
          <div className="base-bank-loan">
            <div className={loanOverdue ? 'base-warning' : ''}>
              Owe {loan.amount}g {loanOverdue ? '(OVERDUE!)' : `(${loanDaysLeft} day(s) left)`}
            </div>
            <button className="btn btn-sm" onClick={onRepay} disabled={player.gold < loan.amount}>
              Repay {loan.amount}g
            </button>
          </div>
        ) : (
          <div className="base-bank-row">
            <input
              type="number" min="1" max={bankDef.maxLoanAmount}
              value={loanAmount} onChange={e => setLoanAmount(e.target.value)}
              placeholder="Amount" className="base-bank-input"
            />
            <button className="btn btn-sm" onClick={() => { onLoan(parseInt(loanAmount) || 0); setLoanAmount(''); }}>
              Borrow
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function IncubatorPanel({ base, player, onPlaceEgg, onFeedIncubator, onCollectHatch, onUpgrade }) {
  const incubatorLevel = base.incubatorLevel || 1;
  const current = BUILDINGS.incubator.upgrades.find(u => u.level === incubatorLevel);
  const next = BUILDINGS.incubator.upgrades.find(u => u.level === incubatorLevel + 1);
  const maxSlots = getIncubatorSlots(base);
  const speedBonus = getIncubatorSpeedBonus(base);
  const slots = base.incubatorSlots || [];
  const now = Date.now();
  const mats = base.materials || {};

  // Food status
  const currentFood = getIncubatorFood(base);
  const foodPercent = Math.min(100, (currentFood / INCUBATOR_MAX_FOOD) * 100);
  const foodHours = Math.floor(currentFood / 60);
  const foodMins = Math.floor(currentFood % 60);

  // Find eggs and food in player inventory
  const eggs = player.inventory.filter(i => i.type === 'egg');
  const foodItems = player.inventory.filter(i => i.type === 'incubator-food');

  return (
    <div className="base-building-content">
      <div className="base-section-title">Incubator</div>
      <div className="base-section-desc">Place eggs found from monsters. Keep it fed to hatch pets!</div>
      <div className="base-inn-current">
        <div className="base-inn-level">{current?.name || 'Basic Incubator'} (Tier {incubatorLevel})</div>
        <div className="base-inn-bonus">{maxSlots} slot{maxSlots > 1 ? 's' : ''}{speedBonus > 0 ? ` | ${Math.round(speedBonus * 100)}% faster hatching` : ''}</div>
      </div>

      {/* Food Bar */}
      <div className="base-fuel-panel">
        <div className="base-section-title">{'\uD83C\uDF56'} Incubator Food</div>
        <div className="base-fuel-bar-track">
          <div className="base-fuel-bar-fill" style={{ width: `${foodPercent}%`, background: currentFood <= 0 ? '#a33' : undefined }} />
          <span className="base-fuel-bar-text">{foodHours > 0 ? `${foodHours}h ` : ''}{foodMins}m / {INCUBATOR_MAX_FOOD / 60}h</span>
        </div>
        {currentFood <= 0 && <div className="base-warning">{'\u26A0'} No food! Eggs won't incubate. Buy food from the Grocery shop.</div>}

        {foodItems.length > 0 && (
          <div className="base-fuel-sources">
            <div className="base-sub-label">Feed from inventory:</div>
            {foodItems.map(item => (
              <button key={item.id} className="btn btn-sm base-fuel-btn" onClick={() => onFeedIncubator(item.id)}>
                {item.name} +{item.fuelMinutes}min
              </button>
            ))}
          </div>
        )}
        {foodItems.length === 0 && currentFood <= 0 && (
          <div className="base-empty-text">No food items. Visit the Grocery shop in town to buy incubator food.</div>
        )}
      </div>

      <div className="base-sub-label">Incubation Slots</div>
      <div className="base-farm-plots">
        {Array.from({ length: maxSlots }, (_, i) => {
          const slot = slots[i];
          if (!slot) {
            return (
              <div key={i} className="base-farm-plot empty">
                <div className="base-farm-plot-label">Slot {i + 1} - Empty</div>
                {eggs.length > 0 ? (
                  <div className="base-recipe-list">
                    {eggs.map(egg => (
                      <div key={egg.id} className="base-recipe-item">
                        <div className="base-recipe-info">
                          <div className={`base-recipe-name rarity-${egg.rarityClass}`}>{egg.name}</div>
                          <div className="base-recipe-desc">{egg.description}</div>
                          <div className="base-recipe-mats">
                            <span className="base-recipe-mat met">
                              Hatch time: {formatIncubateTime(EGG_TYPES[egg.eggId]?.incubateTime, speedBonus)}
                            </span>
                          </div>
                        </div>
                        <button className="btn btn-sm" onClick={() => onPlaceEgg(egg.id)} disabled={currentFood <= 0}>
                          {currentFood <= 0 ? 'Need food' : 'Place'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="base-empty-text">No eggs in inventory. Defeat monsters for a chance to find eggs!</div>
                )}
              </div>
            );
          }

          const eggDef = EGG_TYPES[slot.eggId];
          if (!eggDef) return null;
          const effectiveTime = eggDef.incubateTime * (1 - speedBonus);
          const elapsed = now - slot.placedAt;
          const done = elapsed >= effectiveTime && currentFood >= 0;
          const progress = currentFood <= 0 && !done
            ? Math.min(99, (elapsed / effectiveTime) * 100) // stall display if no food
            : Math.min(100, (elapsed / effectiveTime) * 100);
          const remaining = Math.max(0, effectiveTime - elapsed);
          const mins = Math.ceil(remaining / 60000);
          const hours = Math.floor(mins / 60);
          const minsLeft = mins % 60;

          return (
            <div key={i} className={`base-farm-plot ${done ? 'ready' : 'growing'}`}>
              <div className={`base-farm-plot-label rarity-${(slot.rarity || 'common').toLowerCase()}`}>
                Slot {i + 1} - {slot.itemName}
              </div>
              <div className="base-craft-bar-track">
                <div className="base-craft-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              {done ? (
                <button className="btn btn-sm base-collect-btn" onClick={() => onCollectHatch(i)}>Hatch!</button>
              ) : currentFood <= 0 ? (
                <div className="base-craft-time" style={{ color: '#f66' }}>Paused - no food!</div>
              ) : (
                <div className="base-craft-time">{hours > 0 ? `${hours}h ` : ''}{minsLeft}m remaining</div>
              )}
            </div>
          );
        })}
      </div>

      {next ? (
        <div className="base-upgrade-section">
          <div className="base-sub-label">Upgrade to: {next.name}</div>
          <div className="base-upgrade-desc">{next.desc}</div>
          <div className="base-build-costs">
            <div className={`base-cost-item ${player.gold >= next.upgradeCost.gold ? 'met' : 'unmet'}`}>
              {next.upgradeCost.gold}g {player.gold < next.upgradeCost.gold ? `(have ${player.gold}g)` : ''}
            </div>
            {Object.entries(next.upgradeCost.materials || {}).map(([id, qty]) => (
              <div key={id} className={`base-cost-item ${(mats[id] || 0) >= qty ? 'met' : 'unmet'}`}>
                {qty}x {BUILDING_MATERIALS[id]?.name || id} ({mats[id] || 0})
              </div>
            ))}
          </div>
          <button className="btn btn-sm" onClick={onUpgrade}>Upgrade</button>
        </div>
      ) : (
        <div className="base-max-level">Incubator at max level!</div>
      )}
    </div>
  );
}

function formatIncubateTime(ms, speedBonus) {
  if (!ms) return '???';
  const effective = ms * (1 - (speedBonus || 0));
  const mins = Math.ceil(effective / 60000);
  const hours = Math.floor(mins / 60);
  const minsLeft = mins % 60;
  if (hours > 0) return `${hours}h ${minsLeft}m`;
  return `${minsLeft}m`;
}

// ---- Main Base Screen ----

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'brewery', label: 'Brewery' },
  { id: 'smelter', label: 'Smelter' },
  { id: 'workshop', label: 'Workshop' },
  { id: 'inn', label: 'Inn' },
  { id: 'chamber', label: 'Chamber' },
  { id: 'adventureCamp', label: 'Camp' },
  { id: 'sparringRange', label: 'Spar' },
  { id: 'bank', label: 'Bank' },
  { id: 'farm', label: 'Farm' },
  { id: 'warehouse', label: 'Storage' },
  { id: 'incubator', label: 'Eggs' },
];

export default function BaseScreen({
  player, base, onBack,
  onBuild, onAddFuel, onAddFuelFromStorage, onStoreMaterial,
  onBrew, onSmelt, onCraft, onCollectCraft,
  onUpgradeInn, onBuyInnBoost, onUpgradeChamber,
  onSendMission, onCollectMission,
  onBankDeposit, onBankWithdraw, onBankFreeze, onBankCollectFrozen, onBankLoan, onBankRepay,
  onStartSpar, onSparAttack, onSparSkill, onResetSpar,
  onFarmPlant, onFarmPlantSeed, onFarmHarvest, onUpgradeWarehouse,
  onPlaceEgg, onFeedIncubator, onCollectHatch, onUpgradeIncubator,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const buildings = base.buildings || {};

  const builtTabs = useMemo(() => {
    return TABS.filter(tab => {
      if (tab.id === 'overview') return true;
      return buildings[tab.id]?.built;
    });
  }, [buildings]);

  const renderBuildingOrConstruct = (buildingId) => {
    const buildingDef = BUILDINGS[buildingId];
    if (!buildingDef) return null;
    if (!buildings[buildingId]?.built) {
      return (
        <BuildingConstructPanel
          buildingId={buildingId}
          buildingDef={buildingDef}
          player={player}
          base={base}
          onBuild={onBuild}
        />
      );
    }
    return null;
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="base-overview">
            <FuelPanel
              base={base} player={player}
              onAddFuel={onAddFuel} onAddFuelFromStorage={onAddFuelFromStorage}
            />
            <MaterialStoragePanel base={base} player={player} onStoreMaterial={onStoreMaterial} />

            <div className="base-section-title">{'🏗️'} Buildings</div>
            <div className="base-buildings-grid">
              {Object.entries(BUILDINGS).map(([id, def]) => {
                const built = buildings[id]?.built;
                return (
                  <div
                    key={id}
                    className={`base-building-card ${built ? 'built' : 'locked'} clickable`}
                    onClick={() => setSelectedBuilding(id)}
                  >
                    <div className="base-building-card-icon">{BUILDING_ICONS[id] || '\uD83C\uDFE0'}</div>
                    <div className="base-building-card-name">{def.name}</div>
                    <div className="base-building-card-status">
                      {built ? (
                        <span className="base-status-active">{'✔'} Active</span>
                      ) : (
                        <span className="base-status-locked">{'🔒'} Lv.{def.levelReq} | {def.buildCost.gold}g</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'brewery':
        if (!buildings.brewery?.built) return renderBuildingOrConstruct('brewery');
        return <BreweryPanel base={base} onBrew={onBrew} onCollect={onCollectCraft} />;

      case 'smelter':
        if (!buildings.smelter?.built) return renderBuildingOrConstruct('smelter');
        return <SmelterPanel base={base} player={player} onSmelt={onSmelt} onCollect={onCollectCraft} />;

      case 'workshop':
        if (!buildings.workshop?.built) return renderBuildingOrConstruct('workshop');
        return <WorkshopPanel base={base} onCraft={onCraft} onCollect={onCollectCraft} />;

      case 'inn':
        if (!buildings.inn?.built) return renderBuildingOrConstruct('inn');
        return <InnPanel base={base} player={player} onUpgrade={onUpgradeInn} onBuyBoost={onBuyInnBoost} />;

      case 'chamber':
        if (!buildings.chamber?.built) return renderBuildingOrConstruct('chamber');
        return <ChamberPanel base={base} onUpgrade={onUpgradeChamber} />;

      case 'adventureCamp':
        if (!buildings.adventureCamp?.built) return renderBuildingOrConstruct('adventureCamp');
        return <AdventureCampPanel base={base} onSend={onSendMission} onCollect={onCollectMission} />;

      case 'sparringRange':
        if (!buildings.sparringRange?.built) return renderBuildingOrConstruct('sparringRange');
        return (
          <SparringPanel
            base={base} onStart={onStartSpar}
            onAttack={onSparAttack} onSkill={onSparSkill} onReset={onResetSpar}
          />
        );

      case 'bank':
        if (!buildings.bank?.built) return renderBuildingOrConstruct('bank');
        return (
          <BankPanel
            base={base} player={player}
            onDeposit={onBankDeposit} onWithdraw={onBankWithdraw}
            onFreeze={onBankFreeze} onCollectFrozen={onBankCollectFrozen}
            onLoan={onBankLoan} onRepay={onBankRepay}
          />
        );

      case 'farm':
        if (!buildings.farm?.built) return renderBuildingOrConstruct('farm');
        return <FarmPanel base={base} player={player} onPlant={onFarmPlant} onPlantSeed={onFarmPlantSeed} onHarvest={onFarmHarvest} />;

      case 'warehouse':
        if (!buildings.warehouse?.built) return renderBuildingOrConstruct('warehouse');
        return <WarehousePanel base={base} player={player} onUpgrade={onUpgradeWarehouse} />;

      case 'incubator':
        if (!buildings.incubator?.built) return renderBuildingOrConstruct('incubator');
        return (
          <IncubatorPanel
            base={base} player={player}
            onPlaceEgg={onPlaceEgg} onFeedIncubator={onFeedIncubator}
            onCollectHatch={onCollectHatch} onUpgrade={onUpgradeIncubator}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="screen screen-base">
      <div className="base-header">
        <button className="btn btn-sm base-back-btn" onClick={onBack}>{'←'} Town</button>
        <div className="base-title">{'🏰'} Your Base</div>
        <div className="base-gold">{'💰'} {player.gold}g</div>
      </div>

      <div className="base-tabs">
        {builtTabs.map(tab => (
          <button
            key={tab.id}
            className={`base-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="base-tab-icon">{TAB_ICONS[tab.id] || ''}</span>
            <span className="base-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="base-content">
        {renderActiveTab()}
      </div>

      {selectedBuilding && BUILDINGS[selectedBuilding] && (
        <BuildingInfoModal
          buildingId={selectedBuilding}
          buildingDef={BUILDINGS[selectedBuilding]}
          player={player}
          base={base}
          onClose={() => setSelectedBuilding(null)}
          onBuild={onBuild}
          onNavigate={setActiveTab}
        />
      )}
    </div>
  );
}
