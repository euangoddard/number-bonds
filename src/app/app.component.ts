import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ControlsComponent } from 'src/app/controls/controls.component';
import { NumberBonds } from 'src/app/models';
import { SwUpdateService } from 'src/app/sw-update.service';

@Component({
  selector: 'nb-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  @ViewChild(ControlsComponent) controlsComponent: ControlsComponent;

  private readonly bondsSubject = new ReplaySubject<NumberBonds>(1);
  readonly bonds$ = this.bondsSubject.asObservable();

  constructor(private readonly swUpdateService: SwUpdateService) {}

  ngOnInit(): void {
    this.swUpdateService.updateActivated.subscribe(() => {
      console.log('activated update!');
    });
  }

  celebrateCorrect(): void {
    setTimeout(() => {
      this.controlsComponent.emitChoices();
    }, 4000);
  }

  updateBonds(bonds: NumberBonds): void {
    this.bondsSubject.next(bonds);
  }
}
