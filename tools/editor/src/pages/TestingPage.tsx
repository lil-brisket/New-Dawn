import { useState } from 'react';
import {
  createBattle,
  createCombatant,
  createGrid,
  offsetToCube,
  dispatchAction,
} from '@dawn/game-core';
import { defaultRegistry } from '@dawn/game-data';
import type { BattleEvent } from '@dawn/types';

const page: React.CSSProperties = { padding: 24 };
const log: React.CSSProperties = {
  background: '#16161d',
  borderRadius: 8,
  padding: 16,
  maxHeight: 400,
  overflow: 'auto',
  fontFamily: 'monospace',
  fontSize: 12,
};

function formatEvent(event: BattleEvent): string {
  switch (event.type) {
    case 'damage_dealt':
      return `Damage: ${event.amount} → ${event.targetId}`;
    case 'status_applied':
      return `Status ${event.statusId} on ${event.targetId}`;
    case 'skill_used':
      return `Skill ${event.skillId} by ${event.sourceId}`;
    case 'heal_applied':
      return `Heal ${event.amount} → ${event.targetId}`;
    default:
      return event.type;
  }
}

export function TestingPage() {
  const [skillId, setSkillId] = useState('skill_fireball');
  const [events, setEvents] = useState<string[]>([]);
  const skills = defaultRegistry.getAllSkills();

  const runTest = () => {
    const skill = defaultRegistry.getSkill(skillId);
    if (!skill) {
      setEvents([`Unknown skill: ${skillId}`]);
      return;
    }

    const grid = createGrid({ width: 8, height: 8 });
    const player = createCombatant({
      id: 'player',
      name: 'Tester',
      team: 'player',
      position: offsetToCube(2, 3),
      hp: 200,
      maxHp: 200,
      sp: 100,
      maxSp: 100,
      attack: 30,
      defense: 5,
      movement: 3,
      ap: 30,
      maxAp: 30,
      skillIds: [skillId],
    });
    const dummy = createCombatant({
      id: 'dummy',
      name: 'Training Dummy',
      team: 'enemy',
      position: offsetToCube(4, 3),
      hp: 500,
      maxHp: 500,
      sp: 0,
      maxSp: 0,
      attack: 1,
      defense: 0,
      movement: 0,
      ap: 0,
      maxAp: 0,
      skillIds: [],
    });

    const battle = createBattle({
      party: [player],
      enemies: [dummy],
      grid,
      seed: 42,
    });

    if (!battle.ok) {
      setEvents([`Battle failed: ${battle.error.code}`]);
      return;
    }

    const result = dispatchAction(battle.state, {
      type: 'skill',
      combatantId: 'player',
      skillId,
      targetId: 'dummy',
    });

    const lines = [
      `Cast ${skill.name} (${skillId})`,
      ...(result.ok ? result.events.map(formatEvent) : [`Error: ${result.error.code}`]),
      ...(result.ok
        ? [
            `Dummy HP: ${result.state.combatants.get('dummy')?.hp ?? '?'}/${result.state.combatants.get('dummy')?.maxHp ?? '?'}`,
          ]
        : []),
    ];
    setEvents(lines);
  };

  return (
    <div style={page}>
      <h1 style={{ marginTop: 0 }}>Battle Sandbox</h1>
      <p style={{ color: '#888' }}>Spawn training dummy, cast skill, read event log.</p>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <select value={skillId} onChange={(e) => setSkillId(e.target.value)}>
          {skills.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.id})
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={runTest}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            background: '#f0c674',
            border: 'none',
            color: '#1a1a1f',
            fontWeight: 600,
          }}
        >
          Test Skill
        </button>
      </div>
      <div style={log}>
        {events.length === 0 ? (
          <div style={{ color: '#666' }}>Press Test Skill to run simulation</div>
        ) : (
          events.map((line, i) => <div key={i}>{line}</div>)
        )}
      </div>
    </div>
  );
}
