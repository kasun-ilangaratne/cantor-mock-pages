import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { AnleggsmiddelPayload, AnleggsmiddelRecord, AnleggsmiddelSaldogruppeGRow, AvskrType } from './fixed-asset-topic.model';

const SALDOGRUPPER = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

function mockRecord(overrides: Partial<AnleggsmiddelRecord>): AnleggsmiddelRecord {
  return {
    id: crypto.randomUUID(),
    firmanr: 1001,
    aar: '2025',
    avskrType: 'SA',
    objektId: '100001',
    objektBeskrivelse: 'Maskin',
    ervervsdato: '2025-01-01',
    realisasjonsdato: null,
    inngVerdi: 100000,
    paakostning: 0,
    offTilskudd: 0,
    justeringInngMva: 0,
    vederlagRealiOgUttak: 0,
    vederlagRealiOgUttakIA: 0,
    erRealiUfrivilligOgGevSktfri: false,
    ufrivilligRealiErstatning: 0,
    reinvSalgsgev: 0,
    nedskrNyanskMSalgsgev: 0,
    objektIdNedskrMSalgsgev: '',
    tilskuddInvestIDistr: 0,
    tilbakefTilskuddInvestIDistr: 0,
    grlAvskrInntektsf: 0,
    utgVerdi: 80000,
    gevTilGevOgTapKonto: 0,
    tapTilGevOgTapKonto: 0,
    ekskluderSM: false,
    objektidentifikatorTilhoerendeTilknyttetAnleggsmiddel: '',
    saSaldogruppe: 'd',
    saSatsAvskr: 20,
    saNyanskaffelse: 0,
    saNedskrAvUtskilteDriftsm: 0,
    saErDriftsmIUtgaaendeVerdi: true,
    sa1984HistoriskKostpris: 0,
    sa1984Nedskrevet: 0,
    sa1984NedreGrenseAvskr: 0,
    saSaldogruppeGRows: [],
    saInntektsfortNegSaldoIA: 0,
    saAntallDagerKnyttetTilSkattepliktigVirksomhet: 0,
    saAvskrIA: 20000,
    laAnskKost: 0,
    laJustertVerdiendring: 0,
    laLevetid: 0,
    laAvskrIA: 0,
    laRealisasjonOverfFraPaakost: 0,
    laRealisasjonOverfTilDriftsm: 0,
    iaNyanskaffelse: 0,
    iaJusteringVerdiendring: 0,
    grunnrente: {
      gjelderVirksomhetPaaSokkel: false,
      vkBenyttesIGrunnrentepliktig: 'nei',
      vkErAnleggsmiddelUnderUtfoerelse: false,
      vkKraftverketsLoepenummer: '',
      vkGjenstaaendeLevetid: 0,
      vkAaretsFriinntekt: 0,
      vkNaaverdiAvFremtidigeUtskiftningskostnader: 0,
      vkKonsumprisindeksjustertInvesteringskostnad: 0,
      vkInvesteringskostnadDirekteUtgiftsfoert: false,
      vkDelAvAaretsInvesteringskostnadDirekteUtgiftsfoert: 0,
      vkAaretsInntektsfoeringAvGevinstDirekteUtgiftsfoert: 0,
      vkGevinstTilGevinstOgTapskonto: 0,
      vkTapTilGevinstOgTapskonto: 0,
      hbBenyttesIGrunnrentepliktig: 'nei',
      hbErAnleggsmiddelUnderUtfoerelse: false,
      hbDirekteUtgiftsfoertInvesteringskostnad: 0,
      hbDelAvAaretsInvesteringskostnadDirekteUtgiftsfoertTidligereAar: 0,
      hbSkattemessigVerdiViderefoertVedKjoepFraNaerstaaende: 0,
      hbAaretsAvskrivningOrdinaer: 0,
      hbAaretsAvskrivningDelvisHavbruk: 0,
      hbAaretsInntektsfoeringGevinstRealisasjon: 0,
      hbAaretsInntektsfoeringGevinstUttak: 0,
      hbGevinstRealisasjonTilGevinstOgTapskonto: 0,
      hbGevinstUttakTilGevinstOgTapskonto: 0,
      hbTapRealisasjonTilGevinstOgTapskonto: 0,
      hbTapUttakTilGevinstOgTapskonto: 0,
      lvBenyttesIGrunnrentepliktig: 'nei',
      lvErAnleggsmiddelUnderUtfoerelse: false,
      lvKraftverketsLoepenummer: '',
      lvVenterente: 0,
      lvDirekteUtgiftsfoertInvesteringskostnad: 0,
      lvDelAvAaretsInvesteringskostnadDirekteUtgiftsfoertTidligereAar: 0,
      lvAndelAvDriftsmiddelAnskaffetIAaretSomAvskrives: 0,
      lvInngaaendeVerdiOppjustertPr01012024: 0,
      lvGrunnlagForAvskrivningOppjustertPr01012024: 0,
      lvOppjustertGrunnlagForAvskrivningPer01012024: 0,
      lvJusteringPaaSaldo: 0,
      lvAaretsAvskrivningOppjustertPr01012024: 0,
      lvUtgaaendeVerdiOppjustertPr01012024: 0,
      lvInngaaendeVerdiAnskaffetEtter01012024: 0,
      lvGrunnlagForAvskrivningAnskaffetEtter01012024: 0,
      lvAaretsAvskrivningAnskaffetEtter01012024: 0,
      lvUtgaaendeVerdiAnskaffetEtter01012024: 0,
      lvAaretsInntektsfoeringGevinstDirekteUtgiftsfoert: 0,
      lvGevinstTilGevinstOgTapskonto: 0,
      lvTapTilGevinstOgTapskonto: 0,
      lvGrunnlagForBeregningAvVenterente: 0
    },
    ...overrides
  };
}

function createDefaultSaldogruppeGRow(): AnleggsmiddelSaldogruppeGRow {
  return {
    id: crypto.randomUUID(),
    kommunenummer: '',
    erElektrotekniskUtrustningIKraftforetak: false
  };
}

const MOCK_RECORDS: AnleggsmiddelRecord[] = [
  mockRecord({
    objektId: '100000',
    objektBeskrivelse: 'Hydro turbine (group g)',
    avskrType: 'SA',
    saSaldogruppe: 'g',
    saSatsAvskr: 20,
    inngVerdi: 420000,
    saAvskrIA: 84000,
    utgVerdi: 336000,
    saSaldogruppeGRows: [
      {
        id: crypto.randomUUID(),
        kommunenummer: '0301',
        erElektrotekniskUtrustningIKraftforetak: true
      }
    ],
    grunnrente: {
      ...mockRecord({}).grunnrente,
      vkBenyttesIGrunnrentepliktig: 'ja',
      vkErAnleggsmiddelUnderUtfoerelse: false,
      vkKraftverketsLoepenummer: 'VK-001',
      lvBenyttesIGrunnrentepliktig: 'delvis',
      hbBenyttesIGrunnrentepliktig: 'nei'
    }
  }),
  mockRecord({
    objektId: '100001',
    objektBeskrivelse: 'Lastebil',
    avskrType: 'SA',
    saSaldogruppe: 'd',
    saSatsAvskr: 24,
    inngVerdi: 300000,
    saAvskrIA: 72000,
    utgVerdi: 228000
  }),
  mockRecord({
    objektId: '100145',
    objektBeskrivelse: 'Produksjonslinje',
    avskrType: 'LA',
    laAnskKost: 500000,
    laLevetid: 120,
    laAvskrIA: 50000,
    inngVerdi: 500000,
    utgVerdi: 450000,
    grunnrente: {
      ...mockRecord({}).grunnrente,
      lvBenyttesIGrunnrentepliktig: 'ja',
      lvErAnleggsmiddelUnderUtfoerelse: true,
      lvKraftverketsLoepenummer: 'LV-007',
      lvDirekteUtgiftsfoertInvesteringskostnad: 24000,
      lvAaretsInntektsfoeringGevinstDirekteUtgiftsfoert: 3000
    }
  }),
  mockRecord({
    objektId: '100903',
    objektBeskrivelse: 'Tomteareal',
    avskrType: 'IA',
    iaNyanskaffelse: 900000,
    inngVerdi: 900000,
    utgVerdi: 900000,
    grunnrente: {
      ...mockRecord({}).grunnrente,
      hbBenyttesIGrunnrentepliktig: 'ja',
      hbErAnleggsmiddelUnderUtfoerelse: true,
      hbDirekteUtgiftsfoertInvesteringskostnad: 18000,
      gjelderVirksomhetPaaSokkel: true
    }
  })
];

@Injectable({ providedIn: 'root' })
export class FixedAssetTopicService {
  private mockStore = new Map<string, AnleggsmiddelPayload>();

  get(firmanr: number, aar: string): Observable<AnleggsmiddelPayload> {
    const key = `${firmanr}:${aar}`;
    const current = this.mockStore.get(key) ?? {
      firmanr,
      aar,
      records: this.clone(MOCK_RECORDS).map((r) => ({ ...r, firmanr, aar }))
    };
    this.mockStore.set(key, current);
    return of(this.clone(current)).pipe(delay(200));
  }

  save(payload: AnleggsmiddelPayload): Observable<AnleggsmiddelPayload> {
    const validationError = this.validate(payload.records);
    if (validationError) {
      return throwError(() => new Error(validationError)).pipe(delay(200));
    }
    const key = `${payload.firmanr}:${payload.aar}`;
    const recalculated = payload.records.map((record) => this.recalculateRecord(record));
    const saved = this.clone({ ...payload, records: recalculated });
    this.mockStore.set(key, saved);
    return of(this.clone(saved)).pipe(delay(300));
  }

  createEmptyRecord(type: AvskrType, firmanr: number, aar: string, nextObjektId: string): AnleggsmiddelRecord {
    return mockRecord({
      firmanr,
      aar,
      avskrType: type,
      objektId: nextObjektId,
      objektBeskrivelse: '',
      saSaldogruppe: type === 'SA' ? SALDOGRUPPER[0] : undefined,
      saSatsAvskr: type === 'SA' ? 20 : 0,
      saNyanskaffelse: type === 'SA' ? 0 : undefined,
      saErDriftsmIUtgaaendeVerdi: type === 'SA' ? true : undefined,
      saSaldogruppeGRows: type === 'SA' ? [createDefaultSaldogruppeGRow()] : [],
      laAnskKost: type === 'LA' ? 0 : undefined,
      laLevetid: type === 'LA' ? 60 : undefined,
      iaNyanskaffelse: type === 'IA' ? 0 : undefined,
      inngVerdi: 0,
      utgVerdi: 0
    });
  }

  canOpenGevinstTap(record: AnleggsmiddelRecord): boolean {
    return record.avskrType === 'SA' && ['b', 'e', 'f', 'g', 'h', 'i'].includes(record.saSaldogruppe ?? '');
  }

  private validate(records: AnleggsmiddelRecord[]): string | null {
    for (const record of records) {
      if (!record.objektBeskrivelse?.trim()) {
        return `Object ${record.objektId}: Description is required.`;
      }
      if (record.avskrType === 'SA') {
        if (!record.saSaldogruppe) return `Object ${record.objektId}: Balance group is required.`;
        if ((record.saSatsAvskr ?? 0) < 0 || (record.saSatsAvskr ?? 0) > 100) {
          return `Object ${record.objektId}: Depreciation rate must be between 0 and 100.`;
        }
        if ((record.saAntallDagerKnyttetTilSkattepliktigVirksomhet ?? 0) < 0) {
          return `Object ${record.objektId}: Number of days cannot be negative.`;
        }
      }
      if (record.avskrType === 'LA' && (record.laLevetid ?? 0) <= 0) {
        return `Object ${record.objektId}: Lifetime must be greater than 0.`;
      }
      if ((record.inngVerdi ?? 0) < 0) return `Object ${record.objektId}: Opening value cannot be negative.`;
    }
    return null;
  }

  private recalculateRecord(record: AnleggsmiddelRecord): AnleggsmiddelRecord {
    const next = this.clone(record);
    const inng = next.inngVerdi ?? 0;
    const paakost = next.paakostning ?? 0;
    const vederlag = next.vederlagRealiOgUttak ?? 0;
    const justeringer = (next.offTilskudd ?? 0) + (next.justeringInngMva ?? 0);
    if (next.avskrType === 'SA') {
      const avskr = next.saAvskrIA ?? 0;
      next.utgVerdi = Math.max(0, inng + paakost - avskr - vederlag - justeringer);
    } else if (next.avskrType === 'LA') {
      const avskr = next.laAvskrIA ?? 0;
      next.utgVerdi = Math.max(0, inng + paakost - avskr - vederlag - justeringer);
    } else {
      next.utgVerdi = Math.max(0, inng + (next.iaNyanskaffelse ?? 0) - vederlag - justeringer);
    }
    return next;
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }
}
