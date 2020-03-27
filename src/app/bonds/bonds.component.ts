import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NumberBondPart, NumberBonds } from 'src/app/models';

@Component({
  selector: 'nb-bonds',
  template: `
    <ng-container *ngFor="let bond of bonds.bonds">
      <input
        type="number"
        [readOnly]="!bond.isMasked"
        [value]="bond.isMasked ? null : bond.value"
        (input)="checkBond(bond, $event)"
        min="1"
        max="100"
      />
    </ng-container>

    <input
      type="number"
      [readOnly]="!bonds.root.isMasked"
      [value]="bonds.root.isMasked ? null : bonds.root.value"
      (input)="checkBond(bonds.root, $event)"
      min="1"
      max="100"
    />
  `,
  styles: [],
})
export class BondsComponent {
  @Input() bonds: NumberBonds;
  @Output() correct = new EventEmitter<void>();

  checkBond(bond: NumberBondPart, $event: Event) {
    if (!bond.isMasked) {
      return;
    }

    if (bond.value === ($event.target as HTMLInputElement).valueAsNumber) {
      this.correct.emit();
    }
  }
}
