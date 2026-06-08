export type AvskrType = 'SA' | 'LA' | 'IA';

export interface AnleggsmiddelSaldogruppeGRow {
  id: string;
  kommunenummer: string;
  erElektrotekniskUtrustningIKraftforetak: boolean;
}

export interface AnleggsmiddelGrunnrente {
  gjelderVirksomhetPaaSokkel?: boolean;
  vkBenyttesIGrunnrentepliktig?: 'nei' | 'delvis' | 'ja';
  vkErAnleggsmiddelUnderUtfoerelse?: boolean;
  vkKraftverketsLoepenummer?: string;
  vkAaretsFriinntekt?: number;
  hbBenyttesIGrunnrentepliktig?: 'nei' | 'delvis' | 'ja';
  hbErAnleggsmiddelUnderUtfoerelse?: boolean;
  hbDirekteUtgiftsfoertInvesteringskostnad?: number;
  lvBenyttesIGrunnrentepliktig?: 'nei' | 'delvis' | 'ja';
  lvErAnleggsmiddelUnderUtfoerelse?: boolean;
  lvKraftverketsLoepenummer?: string;
  lvVenterente?: number;
  vkGjenstaaendeLevetid?: number;
  vkNaaverdiAvFremtidigeUtskiftningskostnader?: number;
  vkKonsumprisindeksjustertInvesteringskostnad?: number;
  vkInvesteringskostnadDirekteUtgiftsfoert?: boolean;
  vkDelAvAaretsInvesteringskostnadDirekteUtgiftsfoert?: number;
  vkAaretsInntektsfoeringAvGevinstDirekteUtgiftsfoert?: number;
  vkGevinstTilGevinstOgTapskonto?: number;
  vkTapTilGevinstOgTapskonto?: number;
  hbDelAvAaretsInvesteringskostnadDirekteUtgiftsfoertTidligereAar?: number;
  hbSkattemessigVerdiViderefoertVedKjoepFraNaerstaaende?: number;
  hbAaretsAvskrivningOrdinaer?: number;
  hbAaretsAvskrivningDelvisHavbruk?: number;
  hbAaretsInntektsfoeringGevinstRealisasjon?: number;
  hbAaretsInntektsfoeringGevinstUttak?: number;
  hbGevinstRealisasjonTilGevinstOgTapskonto?: number;
  hbGevinstUttakTilGevinstOgTapskonto?: number;
  hbTapRealisasjonTilGevinstOgTapskonto?: number;
  hbTapUttakTilGevinstOgTapskonto?: number;
  lvDirekteUtgiftsfoertInvesteringskostnad?: number;
  lvDelAvAaretsInvesteringskostnadDirekteUtgiftsfoertTidligereAar?: number;
  lvAndelAvDriftsmiddelAnskaffetIAaretSomAvskrives?: number;
  lvInngaaendeVerdiOppjustertPr01012024?: number;
  lvGrunnlagForAvskrivningOppjustertPr01012024?: number;
  lvOppjustertGrunnlagForAvskrivningPer01012024?: number;
  lvJusteringPaaSaldo?: number;
  lvAaretsAvskrivningOppjustertPr01012024?: number;
  lvUtgaaendeVerdiOppjustertPr01012024?: number;
  lvInngaaendeVerdiAnskaffetEtter01012024?: number;
  lvGrunnlagForAvskrivningAnskaffetEtter01012024?: number;
  lvAaretsAvskrivningAnskaffetEtter01012024?: number;
  lvUtgaaendeVerdiAnskaffetEtter01012024?: number;
  lvAaretsInntektsfoeringGevinstDirekteUtgiftsfoert?: number;
  lvGevinstTilGevinstOgTapskonto?: number;
  lvTapTilGevinstOgTapskonto?: number;
  lvGrunnlagForBeregningAvVenterente?: number;
}

export interface AnleggsmiddelRecord {
  id: string;
  firmanr: number;
  aar: string;
  avskrType: AvskrType;
  objektId: string;
  objektBeskrivelse: string;
  ervervsdato?: string | null;
  realisasjonsdato?: string | null;
  inngVerdi?: number;
  paakostning?: number;
  offTilskudd?: number;
  justeringInngMva?: number;
  vederlagRealiOgUttak?: number;
  vederlagRealiOgUttakIA?: number;
  erRealiUfrivilligOgGevSktfri?: boolean;
  ufrivilligRealiErstatning?: number;
  reinvSalgsgev?: number;
  nedskrNyanskMSalgsgev?: number;
  objektIdNedskrMSalgsgev?: string;
  tilskuddInvestIDistr?: number;
  tilbakefTilskuddInvestIDistr?: number;
  grlAvskrInntektsf?: number;
  utgVerdi?: number;
  gevTilGevOgTapKonto?: number;
  tapTilGevOgTapKonto?: number;
  ekskluderSM?: boolean;
  objektidentifikatorTilhoerendeTilknyttetAnleggsmiddel?: string;
  saSaldogruppe?: string;
  saSatsAvskr?: number;
  saNyanskaffelse?: number;
  saNedskrAvUtskilteDriftsm?: number;
  saErDriftsmIUtgaaendeVerdi?: boolean;
  sa1984HistoriskKostpris?: number;
  sa1984Nedskrevet?: number;
  sa1984NedreGrenseAvskr?: number;
  saSaldogruppeGRows?: AnleggsmiddelSaldogruppeGRow[];
  saInntektsfortNegSaldoIA?: number;
  saAntallDagerKnyttetTilSkattepliktigVirksomhet?: number;
  saAvskrIA?: number;
  laAnskKost?: number;
  laJustertVerdiendring?: number;
  laLevetid?: number;
  laAvskrIA?: number;
  laRealisasjonOverfFraPaakost?: number;
  laRealisasjonOverfTilDriftsm?: number;
  iaNyanskaffelse?: number;
  iaJusteringVerdiendring?: number;
  grunnrente: AnleggsmiddelGrunnrente;
}

export interface AnleggsmiddelPayload {
  firmanr: number;
  aar: string;
  records: AnleggsmiddelRecord[];
}
