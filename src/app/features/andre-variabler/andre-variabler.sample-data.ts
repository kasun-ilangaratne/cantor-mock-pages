import {
  OtherVariable,
  VariableCategory,
  emptyAmounts,
  emptyGrafAmounts,
  emptyMonths
} from './andre-variabler.models';

function createVariable(
  category: VariableCategory,
  nr: string,
  name: string,
  options: Partial<OtherVariable> = {}
): OtherVariable {
  const yearCurrent = options.yearCurrent ?? 0;
  const yearPrior = options.yearPrior ?? 0;
  const hasFormula = options.hasFormula ?? true;
  const amounts = emptyAmounts();
  amounts.virkeligHittil = emptyMonths(Math.round(yearCurrent / 12));
  amounts.virkeligHittil.des = yearCurrent - (Math.round(yearCurrent / 12) * 11);
  amounts.budsjett = emptyMonths(Math.round((yearPrior || yearCurrent) / 12));

  return {
    id: `${category}-${nr}`,
    nr,
    name,
    language: options.language ?? '',
    type: options.type ?? 'K',
    konsKonto: options.konsKonto ?? '',
    category,
    yearCurrent,
    yearPrior,
    hasFormula,
    allowManualInput: options.allowManualInput ?? false,
    formula: options.formula ?? (hasFormula ? `SALDOV(${nr})` : ''),
    inputLine: options.inputLine ?? 'hittil',
    amounts,
    grafType: options.grafType ?? 'Virkelig',
    grafId: options.grafId ?? 'Dim0',
    grafAmounts: options.grafAmounts ?? emptyGrafAmounts(Math.round(yearCurrent / 12))
  };
}

export function createSampleVariables(): OtherVariable[] {
  return [
    createVariable('generelle', '0002', 'Omsetning', { yearCurrent: 18450000, yearPrior: 17120000, hasFormula: true }),
    createVariable('generelle', '0004', 'Driftsresultat', { yearCurrent: 2140000, yearPrior: 1980000, hasFormula: true }),
    createVariable('generelle', '0006', 'Årsresultat', { yearCurrent: 1650000, yearPrior: 1420000, hasFormula: true }),
    createVariable('generelle', '0008', 'Egenkapital', { yearCurrent: 9800000, yearPrior: 8150000, hasFormula: false }),
    createVariable('generelle', '0010', 'Kommentar nøkkel', { yearCurrent: 0, yearPrior: 0, hasFormula: false, type: 'E' }),

    createVariable('kontantstrom', '0200', 'Kontantstrøm fra operasjonelle aktiviteter', { yearCurrent: 2450000, yearPrior: 2100000 }),
    createVariable('kontantstrom', '0202', 'Kontantstrøm fra investeringsaktiviteter', { yearCurrent: -860000, yearPrior: -720000 }),
    createVariable('kontantstrom', '0204', 'Kontantstrøm fra finansieringsaktiviteter', { yearCurrent: -410000, yearPrior: -380000 }),
    createVariable('kontantstrom', '0206', 'Endring i likvider', { yearCurrent: 1180000, yearPrior: 1000000 }),
    createVariable('kontantstrom', '0208', 'Manuell justering', { yearCurrent: 25000, yearPrior: 0, hasFormula: false, allowManualInput: true }),

    createVariable('regnskapsanalyse', '0100', 'Salgsinntekt', { yearCurrent: 18450000, yearPrior: 17120000, hasFormula: false }),
    createVariable('regnskapsanalyse', '0102', 'Årsoverskudd', { yearCurrent: 1650000, yearPrior: 1420000 }),
    createVariable('regnskapsanalyse', '0104', 'Dekningsbidrag', { yearCurrent: 7320000, yearPrior: 6810000, type: 'K' }),
    createVariable('regnskapsanalyse', '0106', 'Dekningsgrad i %', { yearCurrent: 39.7, yearPrior: 39.8 }),
    createVariable('regnskapsanalyse', '0108', 'Nullpunktsomsetning', { yearCurrent: 11240000, yearPrior: 10890000 }),
    createVariable('regnskapsanalyse', '0110', 'Sikkerhetsmargin', { yearCurrent: 7210000, yearPrior: 6230000 }),
    createVariable('regnskapsanalyse', '0112', 'Sikkerhetsmargin i %', { yearCurrent: 39.1, yearPrior: 36.4 }),
    createVariable('regnskapsanalyse', '0114', 'Totalkapitalrentabilitet', { yearCurrent: 11.4, yearPrior: 10.8 }),
    createVariable('regnskapsanalyse', '0116', 'Resultatgrad', { yearCurrent: 8.9, yearPrior: 8.3 }),
    createVariable('regnskapsanalyse', '0118', 'Kapitalens omløpshastighet', { yearCurrent: 1.28, yearPrior: 1.31 }),
    createVariable('regnskapsanalyse', '0120', 'Egenkapitalrentabilitet før skatt', { yearCurrent: 16.8, yearPrior: 17.4 }),
    createVariable('regnskapsanalyse', '0124', 'Egenkapitalrentabilitet etter skatt', { yearCurrent: 13.1, yearPrior: 13.6 }),
    createVariable('regnskapsanalyse', '0126', 'Arbeidskapital', { yearCurrent: 3450000, yearPrior: 2980000, hasFormula: false }),
    createVariable('regnskapsanalyse', '0128', 'Arbeidskapital i %', { yearCurrent: 18.7, yearPrior: 17.4 }),
    createVariable('regnskapsanalyse', '0130', 'Likviditetsreserve', { yearCurrent: 2120000, yearPrior: 1760000 }),
    createVariable('regnskapsanalyse', '0132', 'Likviditetsgrad I', { yearCurrent: 1.84, yearPrior: 1.71 }),
    createVariable('regnskapsanalyse', '0134', 'Likviditetsgrad II', { yearCurrent: 1.21, yearPrior: 1.14 }),
    createVariable('regnskapsanalyse', '0136', 'Lagringstid råv./hand.v', { yearCurrent: 34, yearPrior: 37 }),
    createVariable('regnskapsanalyse', '0138', 'Kredittid kunder', { yearCurrent: 28, yearPrior: 31 }),
    createVariable('regnskapsanalyse', '0140', 'Kredittid leverandører', { yearCurrent: 22, yearPrior: 24 }),
    createVariable('regnskapsanalyse', '0144', 'Egenkapitalprosent', { yearCurrent: 41.2, yearPrior: 39.5 }),
    createVariable('regnskapsanalyse', '0146', 'Gjeldsgrad', { yearCurrent: 1.43, yearPrior: 1.53 }),

    createVariable('notevariabler', '0300', 'Lønnskostnader note', { yearCurrent: 6120000, yearPrior: 5840000 }),
    createVariable('notevariabler', '0302', 'Avskrivninger note', { yearCurrent: 870000, yearPrior: 810000 }),
    createVariable('notevariabler', '0304', 'Finanskostnader note', { yearCurrent: 210000, yearPrior: 198000 }),
    createVariable('notevariabler', '0306', 'Skattekostnad note', { yearCurrent: 430000, yearPrior: 390000, hasFormula: false }),

    createVariable('grafvariabler', '0400', 'Resultat virkelig', { yearCurrent: 1650000, yearPrior: 1420000, grafType: 'Virkelig' }),
    createVariable('grafvariabler', '0402', 'Inntekter - virkelig', { yearCurrent: 18450000, yearPrior: 17120000, grafType: 'Virkelig' }),
    createVariable('grafvariabler', '0404', 'Resultat - budsjett', { yearCurrent: 1500000, yearPrior: 1400000, grafType: 'Bud/prognose' }),
    createVariable('grafvariabler', '0406', 'Inntekter - budsjett', { yearCurrent: 17900000, yearPrior: 16800000, grafType: 'Bud/prognose' }),
    createVariable('grafvariabler', '0408', 'Egenkapital', { yearCurrent: 9800000, yearPrior: 8150000, grafType: 'Eiendeler' }),
    createVariable('grafvariabler', '0410', 'Anleggsmidler', { yearCurrent: 12400000, yearPrior: 11900000, grafType: 'Eiendeler' }),
    createVariable('grafvariabler', '0412', 'Omløpsmidler', { yearCurrent: 6400000, yearPrior: 5900000, grafType: 'Eiendeler' }),
    createVariable('grafvariabler', '0414', 'Langsiktig gjeld', { yearCurrent: 7200000, yearPrior: 7500000, grafType: 'Gjeld' }),
    createVariable('grafvariabler', '0416', 'Kortsiktig gjeld', { yearCurrent: 3100000, yearPrior: 3450000, grafType: 'Gjeld' }),
    createVariable('grafvariabler', '0418', 'Inntekter budsjettert per periode', { yearCurrent: 1491667, yearPrior: 1400000, grafType: 'Bud/prognose' }),
    createVariable('grafvariabler', '0420', 'Resultat virkelig i fjor', { yearCurrent: 1420000, yearPrior: 1310000, grafType: 'Virkelig' }),
    createVariable('grafvariabler', '0422', 'Egenkapital IB', { yearCurrent: 8150000, yearPrior: 6900000, grafType: 'Eiendeler' })
  ];
}
