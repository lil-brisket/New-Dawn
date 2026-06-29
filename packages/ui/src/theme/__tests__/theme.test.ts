import { describe, it, expect } from 'vitest';
import { createTheme, themes } from '../createTheme';
import { resolveShadow } from '../tokens/shadows';
import { game } from '../tokens/game';
import { darkPalette } from '../tokens/colors';
import { createButtonVariants } from '../components/button';

describe('createTheme', () => {
  it('returns distinct backgrounds for light and dark', () => {
    const light = createTheme('light');
    const dark = createTheme('dark');
    expect(light.colors.background).not.toBe(dark.colors.background);
    expect(light.mode).toBe('light');
    expect(dark.mode).toBe('dark');
  });

  it('exposes domain-organized game tokens', () => {
    expect(themes.dark.game.battle.hexSize).toBe(18);
    expect(themes.dark.game.inventory.slotSize).toBe(72);
    expect(themes.dark.game.effects.rarityGlow.mythic).toBe(0.65);
  });
});

describe('resolveShadow', () => {
  it('includes iOS and Android elevation keys', () => {
    const shadow = resolveShadow('medium');
    expect(shadow).toMatchObject({
      shadowColor: expect.any(String),
      shadowOffset: expect.objectContaining({ width: 0, height: expect.any(Number) }),
      shadowOpacity: expect.any(Number),
      shadowRadius: expect.any(Number),
      elevation: 4,
    });
  });
});

describe('button variants', () => {
  it('uses palette colors without orphan hex in primary variant', () => {
    const variants = createButtonVariants(darkPalette);
    expect(variants.primary.bg).toBe(darkPalette.primary);
    expect(variants.primary.text).toBe(darkPalette.text);
  });
});

describe('game token shape', () => {
  it('has all required domains', () => {
    expect(Object.keys(game)).toEqual(
      expect.arrayContaining(['battle', 'inventory', 'guild', 'world', 'effects']),
    );
  });
});
