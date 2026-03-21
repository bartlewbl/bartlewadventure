import { useState, useMemo } from 'react';
import {
  PET_MAX_BOND, PET_MAX_ENERGY, PET_MAX_SLOTS,
  PET_BUILDINGS, getPetBuildingBuffs, getPetRarityClass,
  PET_MAX_ACTIVE_QUESTS, pickQuestsToOffer,
  PET_MAX_LEVEL, getPetXpToNextLevel, getPetLevelStats,
} from '../../data/petData';
import { BUILDING_MATERIALS } from '../../data/baseData';

const ROLE_ICONS = {
  attacker: '\u2694',
  defender: '\u26E8',
  healer: '\u2661',
  buffer: '\u2606',
  hybrid: '\u269B',
};

const TABS = [
  { id: 'roster', label: 'My Pets' },
  { id: 'items', label: 'Items' },
  { id: 'buildings', label: 'Pet Base' },
];

export default function PetScreen({
  player, pets, base,
  onEquipPet, onUnequipPet, onFeedPet, onEnergyPet,
  onBuildPetBuilding, onUpgradePetBuilding,
  onAcceptQuest, onAbandonQuest, onCompleteQuest,
  onQuestGiveItem, onQuestGiveGold,
  onBack,
}) {
  const [tab, setTab] = useState('roster');
  const [selectedPet, setSelectedPet] = useState(null);
  const [showGiveItem, setShowGiveItem] = useState(false);
  const [goldInput, setGoldInput] = useState('');

  const ownedPets = pets?.ownedPets || [];
  const equippedIds = new Set(pets?.equippedPets || []);
  const buffs = useMemo(() => getPetBuildingBuffs(pets), [pets]);

  // Pet consumables in player inventory
  const petSnacks = player.inventory.filter(i => i.type === 'pet-snack');
  const petPotions = player.inventory.filter(i => i.type === 'pet-energy');

  const activePet = selectedPet ? ownedPets.find(p => p.instanceId === selectedPet) : null;

  return (
    <div className="screen screen-pets">
      <div className="pet-header">
        <div className="pet-title">Pet Companion Hub</div>
        <div className="pet-summary">
          Pets: {ownedPets.length} owned | {equippedIds.size > 0 ? '1 active' : 'None active'}
        </div>
      </div>

      <div className="pet-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`shop-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => { setTab(t.id); setSelectedPet(null); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="pet-content">
        {/* ===== MY PETS (ROSTER) ===== */}
        {tab === 'roster' && !activePet && (
          <div className="pet-roster">
            {ownedPets.length === 0 && (
              <div className="shop-empty">
                <div className="shop-empty-text">You don't have any pets yet!</div>
                <div className="shop-empty-hint">Visit the Pet Shop to adopt one.</div>
              </div>
            )}
            {ownedPets.map(pet => {
              const isEquipped = equippedIds.has(pet.instanceId);
              return (
                <div
                  key={pet.instanceId}
                  className={`pet-card ${getPetRarityClass(pet.rarity)} ${isEquipped ? 'equipped' : ''}`}
                  onClick={() => setSelectedPet(pet.instanceId)}
                >
                  <div className="pet-card-header">
                    <span className="pet-card-role">{ROLE_ICONS[pet.role]}</span>
                    <span className={`pet-card-name ${getPetRarityClass(pet.rarity)}`}>{pet.name}</span>
                    {isEquipped && <span className="pet-equipped-badge">ACTIVE</span>}
                  </div>
                  <div className="pet-card-bars">
                    <div className="pet-mini-bar">
                      <span className="bar-label">Bond</span>
                      <div className="bar bond-bar">
                        <div className="bar-fill" style={{ width: (pet.bond / PET_MAX_BOND) * 100 + '%' }} />
                      </div>
                      <span className="bar-text">{pet.bond}/{PET_MAX_BOND}</span>
                    </div>
                    <div className="pet-mini-bar">
                      <span className="bar-label">Energy</span>
                      <div className="bar energy-bar">
                        <div className="bar-fill" style={{ width: (pet.energy / PET_MAX_ENERGY) * 100 + '%' }} />
                      </div>
                      <span className="bar-text">{pet.energy}/{PET_MAX_ENERGY}</span>
                    </div>
                  </div>
                  <div className="pet-card-stats">
                    Lv.{pet.level || 1} | ATK:{getPetLevelStats(pet).atk} DEF:{getPetLevelStats(pet).def} HP:{getPetLevelStats(pet).hp}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== PET DETAIL VIEW ===== */}
        {tab === 'roster' && activePet && (
          <div className="pet-detail">
            <button className="btn btn-back btn-sm" onClick={() => setSelectedPet(null)}>Back to roster</button>

            <div className={`pet-detail-header ${getPetRarityClass(activePet.rarity)}`}>
              <div className="pet-detail-name">
                <span className="pet-card-role">{ROLE_ICONS[activePet.role]}</span>
                {activePet.name}
                <span className={`shop-rarity-badge ${getPetRarityClass(activePet.rarity)}`}>{activePet.rarity}</span>
              </div>
              <div className="pet-detail-role">{activePet.role.charAt(0).toUpperCase() + activePet.role.slice(1)} - Level {activePet.level || 1}{(activePet.level || 1) >= PET_MAX_LEVEL ? ' (MAX)' : ''}</div>
            </div>

            <div className="pet-detail-desc">{activePet.description}</div>

            <div className="pet-detail-ability">
              <span className="pet-ability-label">Ability:</span> {activePet.ability.name} - {activePet.ability.desc}
            </div>

            <div className="pet-detail-stats-grid">
              {(() => {
                const ls = getPetLevelStats(activePet);
                return (
                  <>
                    <div className="pet-stat-block">
                      <div className="pet-stat-value">{ls.atk}{buffs.petAtkBuff > 0 ? ` (+${Math.round(buffs.petAtkBuff * 100)}%)` : ''}</div>
                      <div className="pet-stat-label">ATK</div>
                    </div>
                    <div className="pet-stat-block">
                      <div className="pet-stat-value">{ls.def}{buffs.petDefBuff > 0 ? ` (+${Math.round(buffs.petDefBuff * 100)}%)` : ''}</div>
                      <div className="pet-stat-label">DEF</div>
                    </div>
                    <div className="pet-stat-block">
                      <div className="pet-stat-value">{ls.hp}{buffs.petHpBuff > 0 ? ` (+${Math.round(buffs.petHpBuff * 100)}%)` : ''}</div>
                      <div className="pet-stat-label">HP</div>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="pet-detail-bars">
              <div className="pet-bar-row">
                <span className="pet-bar-label">Bond</span>
                <div className="bar bond-bar pet-bar-lg">
                  <div className="bar-fill" style={{ width: (activePet.bond / PET_MAX_BOND) * 100 + '%' }} />
                </div>
                <span className="pet-bar-value">{activePet.bond}/{PET_MAX_BOND}</span>
              </div>
              <div className="pet-bar-row">
                <span className="pet-bar-label">Energy</span>
                <div className="bar energy-bar pet-bar-lg">
                  <div className="bar-fill" style={{ width: (activePet.energy / PET_MAX_ENERGY) * 100 + '%' }} />
                </div>
                <span className="pet-bar-value">{activePet.energy}/{PET_MAX_ENERGY}</span>
              </div>
              {(() => {
                const lvl = activePet.level || 1;
                const isMax = lvl >= PET_MAX_LEVEL;
                const xp = activePet.xp || 0;
                const nextXp = getPetXpToNextLevel(lvl);
                const pct = isMax ? 100 : Math.min(100, Math.floor((xp / nextXp) * 100));
                return (
                  <div className="pet-bar-row">
                    <span className="pet-bar-label">XP</span>
                    <div className="bar xp-bar pet-bar-lg">
                      <div className="bar-fill" style={{ width: pct + '%' }} />
                    </div>
                    <span className="pet-bar-value">{isMax ? 'MAX' : `${xp}/${nextXp}`}</span>
                  </div>
                );
              })()}
            </div>

            {activePet.bond < 30 && (
              <div className="pet-warning">Low bond! This pet may refuse to fight.</div>
            )}
            {activePet.energy <= 0 && (
              <div className="pet-warning critical">No energy! This pet cannot fight.</div>
            )}

            <div className="pet-detail-actions">
              {equippedIds.has(activePet.instanceId) ? (
                <button className="btn btn-unequip" onClick={() => onUnequipPet(activePet.instanceId)}>
                  Unequip Pet
                </button>
              ) : (
                <button
                  className="btn btn-equip"
                  onClick={() => onEquipPet(activePet.instanceId)}
                  disabled={equippedIds.size >= PET_MAX_SLOTS}
                  title={equippedIds.size >= PET_MAX_SLOTS ? 'Unequip current pet first' : ''}
                >
                  Set as Active {equippedIds.size >= PET_MAX_SLOTS ? '(Swap current first)' : ''}
                </button>
              )}
            </div>

            {/* Feed / Energy sections */}
            <div className="pet-consumable-section">
              <div className="pet-section-title">Feed Snack (Bond)</div>
              {petSnacks.length === 0 && <div className="pet-no-items">No pet snacks. Buy some from the Pet Shop!</div>}
              {petSnacks.map(snack => (
                <div key={snack.id} className="pet-consumable-row">
                  <span className="pet-consumable-name">{snack.name}</span>
                  <span className="pet-consumable-info">Bond +{snack.bondRestore}</span>
                  <button
                    className="btn btn-sm btn-feed"
                    onClick={() => onFeedPet(activePet.instanceId, snack)}
                    disabled={activePet.bond >= PET_MAX_BOND}
                  >
                    Feed
                  </button>
                </div>
              ))}
            </div>

            <div className="pet-consumable-section">
              <div className="pet-section-title">Energy Potions</div>
              {petPotions.length === 0 && <div className="pet-no-items">No pet energy potions. Buy some from the Pet Shop!</div>}
              {petPotions.map(potion => (
                <div key={potion.id} className="pet-consumable-row">
                  <span className="pet-consumable-name">{potion.name}</span>
                  <span className="pet-consumable-info">Energy +{potion.energyRestore}</span>
                  <button
                    className="btn btn-sm btn-feed"
                    onClick={() => onEnergyPet(activePet.instanceId, potion)}
                    disabled={activePet.energy >= PET_MAX_ENERGY}
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>

            {/* ===== PET QUESTS ===== */}
            <div className="pet-quest-section">
              <div className="pet-section-title">Quests (Bond + XP)</div>

              {/* Active quests */}
              {(activePet.activeQuests || []).length > 0 && (
                <div className="pet-quest-list">
                  <div className="pet-quest-subtitle">Active Quests</div>
                  {(activePet.activeQuests || []).map(quest => {
                    const done = quest.progress >= quest.target;
                    const pct = Math.min(100, Math.floor((quest.progress / quest.target) * 100));
                    return (
                      <div key={quest.id} className={`pet-quest-card ${done ? 'complete' : ''}`}>
                        <div className="pet-quest-header">
                          <span className="pet-quest-name">{quest.name}</span>
                          <span className="pet-quest-reward">+{quest.bondReward} bond{quest.xpReward > 0 ? ` +${quest.xpReward} XP` : ''}</span>
                        </div>
                        <div className="pet-quest-desc">{quest.desc}</div>
                        <div className="pet-quest-progress-row">
                          <div className="bar pet-quest-bar">
                            <div className="bar-fill" style={{ width: pct + '%' }} />
                          </div>
                          <span className="pet-quest-progress-text">{quest.progress}/{quest.target}</span>
                        </div>

                        {/* Give item / give gold controls for those quest types */}
                        {quest.type === 'give_item' && !done && (
                          <div className="pet-quest-action">
                            {!showGiveItem ? (
                              <button className="btn btn-sm btn-quest-action" onClick={() => setShowGiveItem(true)}>
                                Give Equipment
                              </button>
                            ) : (
                              <div className="pet-quest-give-list">
                                {player.inventory.filter(i => i.slot).length === 0 && (
                                  <div className="pet-no-items">No equipment to give.</div>
                                )}
                                {player.inventory.filter(i => i.slot).map(item => (
                                  <div key={item.id} className="pet-quest-give-row">
                                    <span className={`pet-quest-give-name ${item.rarityClass || ''}`}>{item.name}</span>
                                    <button className="btn btn-sm btn-feed" onClick={() => { onQuestGiveItem(activePet.instanceId, item); setShowGiveItem(false); }}>
                                      Give
                                    </button>
                                  </div>
                                ))}
                                <button className="btn btn-sm btn-back" onClick={() => setShowGiveItem(false)}>Cancel</button>
                              </div>
                            )}
                          </div>
                        )}

                        {quest.type === 'give_gold' && !done && (
                          <div className="pet-quest-action">
                            <div className="pet-quest-gold-row">
                              <input
                                type="number"
                                className="pet-quest-gold-input"
                                placeholder="Gold..."
                                value={goldInput}
                                onChange={e => setGoldInput(e.target.value)}
                                min={1}
                                max={player.gold}
                              />
                              <button
                                className="btn btn-sm btn-quest-action"
                                onClick={() => { onQuestGiveGold(activePet.instanceId, parseInt(goldInput) || 0); setGoldInput(''); }}
                                disabled={!goldInput || parseInt(goldInput) <= 0 || parseInt(goldInput) > player.gold}
                              >
                                Donate
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="pet-quest-buttons">
                          {done && (
                            <button className="btn btn-sm btn-quest-complete" onClick={() => onCompleteQuest(activePet.instanceId, quest.id)}>
                              Claim Reward
                            </button>
                          )}
                          {!done && (
                            <button className="btn btn-sm btn-quest-abandon" onClick={() => onAbandonQuest(activePet.instanceId, quest.id)}>
                              Abandon
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Available quests to accept */}
              {(() => {
                const activeIds = (activePet.activeQuests || []).map(q => q.id);
                const completedIds = activePet.completedQuests || [];
                const available = pickQuestsToOffer(activePet.id, activeIds, completedIds, 4);
                const canAccept = (activePet.activeQuests || []).length < PET_MAX_ACTIVE_QUESTS;

                if (available.length === 0 && (activePet.activeQuests || []).length === 0) {
                  return <div className="pet-no-items">All quests completed! Great bond with {activePet.name}!</div>;
                }
                if (available.length === 0) return null;

                return (
                  <div className="pet-quest-list">
                    <div className="pet-quest-subtitle">Available Quests {!canAccept && <span className="pet-quest-full">(Full - {PET_MAX_ACTIVE_QUESTS} max)</span>}</div>
                    {available.map(quest => (
                      <div key={quest.id} className="pet-quest-card available">
                        <div className="pet-quest-header">
                          <span className="pet-quest-name">{quest.name}</span>
                          <span className="pet-quest-reward">+{quest.bondReward} bond{quest.xpReward > 0 ? ` +${quest.xpReward} XP` : ''}</span>
                        </div>
                        <div className="pet-quest-desc">{quest.desc}</div>
                        <button
                          className="btn btn-sm btn-quest-accept"
                          onClick={() => onAcceptQuest(activePet.instanceId, quest.id)}
                          disabled={!canAccept}
                        >
                          Accept Quest
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Completed count */}
              {(activePet.completedQuests || []).length > 0 && (
                <div className="pet-quest-completed-count">
                  {(activePet.completedQuests || []).length} quest(s) completed
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== PET ITEMS IN INVENTORY ===== */}
        {tab === 'items' && (
          <div className="pet-items-list">
            <div className="pet-section-title">Pet Snacks</div>
            {petSnacks.length === 0 && <div className="pet-no-items">No snacks in inventory</div>}
            {petSnacks.map(item => (
              <div key={item.id} className={`shop-card ${item.rarity?.toLowerCase() || ''}`}>
                <div className="shop-card-left">
                  <div className="shop-card-type">Pet Snack</div>
                  <div className={`shop-card-name ${item.rarity?.toLowerCase() || ''}`}>{item.name}</div>
                  <div className="shop-card-stats">Bond +{item.bondRestore}</div>
                </div>
              </div>
            ))}

            <div className="pet-section-title" style={{ marginTop: '12px' }}>Pet Energy Potions</div>
            {petPotions.length === 0 && <div className="pet-no-items">No pet energy potions in inventory</div>}
            {petPotions.map(item => (
              <div key={item.id} className={`shop-card ${item.rarity?.toLowerCase() || ''}`}>
                <div className="shop-card-left">
                  <div className="shop-card-type">Pet Energy</div>
                  <div className={`shop-card-name ${item.rarity?.toLowerCase() || ''}`}>{item.name}</div>
                  <div className="shop-card-stats">Energy +{item.energyRestore}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== PET BASE BUILDINGS ===== */}
        {tab === 'buildings' && (
          <div className="pet-buildings">
            {Object.values(PET_BUILDINGS).map(building => {
              const state = pets?.petBuildings?.[building.id];
              const built = !!state?.built;
              const level = state?.level || 0;
              const currentUpgrade = built ? building.upgrades.find(u => u.level === level) : null;
              const nextUpgrade = built ? building.upgrades.find(u => u.level === level + 1) : null;
              const meetsLevel = player.level >= building.levelReq;

              return (
                <div key={building.id} className={`pet-building-card ${built ? 'built' : ''}`}>
                  <div className="pet-building-header">
                    <span className="pet-building-name">{building.name}</span>
                    {built && <span className="pet-building-level">Lv.{level}</span>}
                  </div>
                  <div className="pet-building-desc">{building.description}</div>

                  {built && currentUpgrade && (
                    <div className="pet-building-effect">{currentUpgrade.desc}</div>
                  )}

                  {!built && (
                    <div className="pet-building-cost">
                      <div>Cost: {building.buildCost.gold}g</div>
                      <div className="pet-building-mats">
                        {Object.entries(building.buildCost.materials).map(([matId, qty]) => {
                          const have = base?.materials?.[matId] || 0;
                          return (
                            <span key={matId} className={`pet-mat ${have >= qty ? 'ok' : 'missing'}`}>
                              {BUILDING_MATERIALS[matId]?.name || matId}: {have}/{qty}
                            </span>
                          );
                        })}
                      </div>
                      <button
                        className="btn btn-build"
                        onClick={() => onBuildPetBuilding(building.id)}
                        disabled={!meetsLevel || player.gold < building.buildCost.gold}
                      >
                        {!meetsLevel ? `Req Lv.${building.levelReq}` : 'Build'}
                      </button>
                    </div>
                  )}

                  {built && nextUpgrade && (
                    <div className="pet-building-upgrade">
                      <div className="pet-upgrade-label">Upgrade to: {nextUpgrade.name}</div>
                      <div className="pet-upgrade-desc">{nextUpgrade.desc}</div>
                      {nextUpgrade.upgradeCost && (
                        <div className="pet-building-mats">
                          <span>Cost: {nextUpgrade.upgradeCost.gold}g</span>
                          {Object.entries(nextUpgrade.upgradeCost.materials || {}).map(([matId, qty]) => {
                            const have = base?.materials?.[matId] || 0;
                            return (
                              <span key={matId} className={`pet-mat ${have >= qty ? 'ok' : 'missing'}`}>
                                {BUILDING_MATERIALS[matId]?.name || matId}: {have}/{qty}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      <button
                        className="btn btn-build"
                        onClick={() => onUpgradePetBuilding(building.id)}
                        disabled={!nextUpgrade.upgradeCost || player.gold < (nextUpgrade.upgradeCost?.gold || 0)}
                      >
                        Upgrade
                      </button>
                    </div>
                  )}

                  {built && !nextUpgrade && (
                    <div className="pet-building-maxed">Max level reached!</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="shop-footer">
        <button className="btn btn-back" onClick={onBack}>Back to Town</button>
      </div>
    </div>
  );
}
