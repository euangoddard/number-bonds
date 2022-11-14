import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { random, range } from 'lodash-es';
import { NumberBonds } from 'src/app/models';

@Component({
  selector: 'nb-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit {
  @Output() bonds = new EventEmitter<NumberBonds>();

  readonly maxChoices = [10, ...range(20, 210, 20)] as const;
  readonly bondCountChoices = range(2, 7);
  readonly formGroup = this.formBuilder.group({
    max: [10, [Validators.required]],
    bonds: [2, [Validators.required]],
  });

  constructor(private readonly formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.emitChoices();
  }

  emitChoices(): void {
    const { max, bonds } = this.formGroup.value;
    this.bonds.emit(makeBonds(bonds, max));
  }
}

function makeBonds(bondCount: number, maxNumber: number): NumberBonds {
  const rootNumber = random(bondCount * (bondCount + 1), maxNumber);

  const bondNumbers = [];
  let runningTotal = 0;
  for (let i = 0; i < bondCount - 1; i += 1) {
    const max = rootNumber - runningTotal - (bondCount - 1) + i;
    const bondNumber = random(1, max);
    bondNumbers.push(bondNumber);
    runningTotal += bondNumber;
  }
  bondNumbers.push(rootNumber - runningTotal);
  const hiddenPosition = random(0, bondCount);
  return {
    root: { value: rootNumber, isMasked: hiddenPosition === bondCount },
    bonds: bondNumbers.map((bondNumber, index) => {
      return {
        value: bondNumber,
        isMasked: index === hiddenPosition,
      };
    }),
  };
}
