import type { EffectContext } from './EffectContext';

export type FormulaPhase =
  'offense' | 'mitigation' | 'final' | 'heal' | 'duration' | 'application_chance';

export interface FormulaModifier {
  readonly phase: FormulaPhase;
  modify(value: number, ctx: EffectContext): number;
}

class FormulaModifierRegistryImpl {
  private readonly modifiers: FormulaModifier[] = [];

  register(modifier: FormulaModifier): void {
    this.modifiers.push(modifier);
  }

  apply(phase: FormulaPhase, value: number, ctx: EffectContext): number {
    let result = value;
    for (const modifier of this.modifiers) {
      if (modifier.phase === phase) {
        result = modifier.modify(result, ctx);
      }
    }
    return result;
  }
}

export const formulaModifierRegistry = new FormulaModifierRegistryImpl();
