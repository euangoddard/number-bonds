import { Pipe, PipeTransform } from '@angular/core';
import { NumberBondPart, NumberBonds } from 'src/app/models';

@Pipe({
  name: 'answer',
})
export class AnswerPipe implements PipeTransform {
  transform(numberBonds: NumberBonds): string {
    const lhsPhrase = numberBonds.bonds.map(formatBondPart).join(' + ');
    const rhsPhrase = formatBondPart(numberBonds.root);
    return `${lhsPhrase} = ${rhsPhrase}`;
  }
}

function formatBondPart(bondPart: NumberBondPart): string {
  if (bondPart.isMasked) {
    return `<strong>${bondPart.value}</strong>`;
  } else {
    return bondPart.value.toString();
  }
}
