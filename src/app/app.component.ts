import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { random, range } from 'lodash-es';
import { merge, Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'nb-root',
  template: ` <form [formGroup]="formGroup">
      <label for="max-choice">Max number:</label>
      <select id="max-choice" formControlName="max">
        <option [ngValue]="choice" *ngFor="let choice of maxChoices">{{ choice }}</option>
      </select>
      <label for="bond-count-choice">Bonds:</label>
      <select id="bond-count-choice" formControlName="bonds">
        <option [ngValue]="choice" *ngFor="let choice of bondCountChoices">{{ choice }}</option>
      </select>
      <button type="button" (click)="refresh()">Another!</button>
    </form>
    <pre>{{ bonds$ | async | json }}</pre>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly maxChoices = range(10, 110, 10);
  readonly bondCountChoices = range(2, 6);
  readonly formGroup = this.formBuilder.group({
    max: [20, [Validators.required]],
    bonds: [2, [Validators.required]],
  });

  private readonly refreshSubject = new Subject<NumberBonds>();

  bonds$: Observable<NumberBonds>;

  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.bonds$ = merge(
      this.formGroup.valueChanges.pipe(startWith(this.formGroup.value)),
      this.refreshSubject,
    ).pipe(
      map(({ max, bonds }) => {
        return makeBonds(bonds, max);
      }),
    );
  }

  refresh(): void {
    this.refreshSubject.next(this.formGroup.value);
  }
}

interface NumberBondPart {
  value: number;
  isMasked: boolean;
}

interface NumberBonds {
  root: NumberBondPart;
  bonds: readonly NumberBondPart[];
}

function makeBonds(bondCount: number, maxNumber: number): NumberBonds {
  const rootNumber = random(bondCount * (bondCount + 1), maxNumber);

  const bondNumbers = [];
  let runningTotal = 0;
  for (let i = 0; i < bondCount - 1; i += 1) {
    const max = rootNumber - runningTotal - (bondCount - 1) + i;
    console.log(max);
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
