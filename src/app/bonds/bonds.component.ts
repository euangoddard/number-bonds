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
import { NumberBonds } from 'src/app/models';

@Component({
  selector: 'nb-bonds',
  templateUrl: './bonds.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./bonds.component.scss'],
})
export class BondsComponent implements OnChanges {
  @Input() bonds: NumberBonds;
  @Output() correct = new EventEmitter<void>();

  @ViewChildren(AutoFocusDirective) private focusDirectives: QueryList<AutoFocusDirective>;

  @HostBinding('class.correct') isCorrect = false;

  @HostBinding('class')
  get hostClass(): string {
    if (this.bonds) {
      return `has-${this.bonds.bonds.length}-bonds`;
    } else {
      return '';
    }
  }

  answer: number | null = null;

  constructor(private readonly confetti: ConfettiService, private zone: NgZone) {}

  ngOnChanges(changes: SimpleChanges): void {
    const bondsChange = changes['bonds'];
    if (bondsChange && bondsChange.currentValue) {
      this.isCorrect = false;
      this.answer = null;
      if (!bondsChange.firstChange) {
        this.zone.onStable.pipe(take(1)).subscribe(() => {
          this.focusDirectives.forEach((directive) => {
            directive.refocus();
          });
        });
      }
    }
  }

  setAnswer(event: Event): void {
    const targetElement = event.target as HTMLInputElement;
    const answer = targetElement.valueAsNumber;
    this.answer = isNaN(answer) ? null : answer;
  }

  checkAnswer(buttonElement: HTMLButtonElement): void {
    if (this.answer === null) {
      return;
    }

    const activeBond = [this.bonds.root, ...this.bonds.bonds].find((b) => b.isMasked);

    if (!activeBond) {
      throw new Error('No active bond!');
    }

    if (activeBond.value === this.answer) {
      this.isCorrect = true;
      this.correct.emit();
      this.confetti.explode(buttonElement);
    } else {
      this.isCorrect = false;
    }
  }
}
