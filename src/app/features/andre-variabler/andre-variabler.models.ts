export type VariableCategory =
  | 'generelle'
  | 'kontantstrom'
  | 'regnskapsanalyse'
  | 'notevariabler'
  | 'grafvariabler';

export type AmountFormat = 'units' | 'two-decimals' | 'thousands' | 'millions';
export type InputLine = 'periode' | 'hittil';
export type VariableType = 'E' | 'G' | 'I' | 'K';

export interface MonthlyAmounts {
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  mai: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  okt: number;
  nov: number;
  des: number;
}

export interface AmountSeries {
  virkeligPeriode: MonthlyAmounts;
  virkeligHittil: MonthlyAmounts;
  budsjett: MonthlyAmounts;
  prognose: MonthlyAmounts;
}

export interface GrafSeries {
  bidrag: MonthlyAmounts;
  variabelLonn: MonthlyAmounts;
  variabelLonnBudsjett: MonthlyAmounts;
  andreVariableKostnader: MonthlyAmounts;
}

export interface OtherVariable {
  id: string;
  nr: string;
  name: string;
  language: string;
  type: VariableType;
  konsKonto: string;
  category: VariableCategory;
  yearCurrent: number;
  yearPrior: number;
  hasFormula: boolean;
  allowManualInput: boolean;
  formula: string;
  inputLine: InputLine;
  amounts: AmountSeries;
  grafType: string;
  grafId: string;
  grafAmounts: GrafSeries;
}

export const MONTH_KEYS: (keyof MonthlyAmounts)[] = [
  'jan', 'feb', 'mar', 'apr', 'mai', 'jun',
  'jul', 'aug', 'sep', 'okt', 'nov', 'des'
];

export const MONTH_LABELS: Record<keyof MonthlyAmounts, string> = {
  jan: 'Jan',
  feb: 'Feb',
  mar: 'Mar',
  apr: 'Apr',
  mai: 'Mai',
  jun: 'Jun',
  jul: 'Jul',
  aug: 'Aug',
  sep: 'Sep',
  okt: 'Okt',
  nov: 'Nov',
  des: 'Des'
};

export function emptyMonths(value = 0): MonthlyAmounts {
  return {
    jan: value, feb: value, mar: value, apr: value, mai: value, jun: value,
    jul: value, aug: value, sep: value, okt: value, nov: value, des: value
  };
}

export function monthTotal(months: MonthlyAmounts): number {
  return MONTH_KEYS.reduce((sum, key) => sum + (months[key] || 0), 0);
}

export function emptyAmounts(value = 0): AmountSeries {
  return {
    virkeligPeriode: emptyMonths(value),
    virkeligHittil: emptyMonths(value),
    budsjett: emptyMonths(value),
    prognose: emptyMonths(value)
  };
}

export function emptyGrafAmounts(value = 0): GrafSeries {
  return {
    bidrag: emptyMonths(value),
    variabelLonn: emptyMonths(value),
    variabelLonnBudsjett: emptyMonths(value),
    andreVariableKostnader: emptyMonths(value)
  };
}
