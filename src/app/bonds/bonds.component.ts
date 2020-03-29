import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { take } from 'rxjs/operators';
import { AutoFocusDirective } from 'src/app/bonds/auto-focus.directive';
import { ConfettiService } from 'src/app/confetti.service';
import { NumberBondPart, NumberBonds } from 'src/app/models';

@Component({
  selector: 'nb-bonds',
  templateUrl: './bonds.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BondsComponent implements OnChanges {
  @Input() bonds: NumberBonds;
  @Output() correct = new EventEmitter<void>();

  @ViewChildren(AutoFocusDirective) private focusDirectives: QueryList<AutoFocusDirective>;

  @HostBinding('class.correct') isCorrect = false;

  @HostBinding('class')
  get hostClass(): string {
    if (this.bonds) {
      return CLASS_MAP.get(this.bonds.bonds.length) || '';
    } else {
      return '';
    }
  }

  constructor(private readonly confetti: ConfettiService, private zone: NgZone) {}

  ngOnChanges(changes: SimpleChanges): void {
    const bondsChange = changes['bonds'];
    if (bondsChange && bondsChange.currentValue) {
      this.isCorrect = false;
      if (!bondsChange.firstChange) {
        this.zone.onStable.pipe(take(1)).subscribe(() => {
          this.focusDirectives.forEach((directive) => {
            directive.refocus();
          });
        });
      }
    }
  }

  checkBond(bond: NumberBondPart, $event: Event) {
    if (!bond.isMasked) {
      return;
    }

    const targetElement = $event.target as HTMLInputElement;
    if (bond.value === targetElement.valueAsNumber) {
      this.isCorrect = true;
      this.correct.emit();
      this.confetti.explode(targetElement);
    } else {
      this.isCorrect = false;
    }
  }
}

const CLASS_MAP = new Map<number, string>([
  [2, 'two-bonds'],
  [3, 'three-bonds'],
  [4, 'four-bonds'],
  [5, 'five-bonds'],
  [6, 'six-bonds'],
]);
