export type Mode = 'cook' | 'order' | 'any';
export type House = 'solo' | 'couple' | 'family' | null;
export type Baby = 'withKids' | 'noKids' | null;
export type Vibe = 'chef' | 'sweet' | 'rain' | 'late' | 'diet';
export type Budget = 'any' | 'under10k' | 'under20k' | 'over20k';

export interface FilterState {
  mode: Mode;
  house: House;
  baby: Baby;
  vibes: Vibe[];
  budget: Budget;
}

export const DEFAULT_FILTER: FilterState = {
  mode: 'any',
  house: null,
  baby: null,
  vibes: [],
  budget: 'any',
};
