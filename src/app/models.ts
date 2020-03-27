export interface NumberBondPart {
  value: number;
  isMasked: boolean;
}

export interface NumberBonds {
  root: NumberBondPart;
  bonds: readonly NumberBondPart[];
}
