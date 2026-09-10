// AUTO-GENERATED from SD_DeltagerDetaljer.dfm
// by Cantor-Claude/dfm-to-angular/dfm_to_angular.py
// DO NOT EDIT BY HAND — your changes will be overwritten on regeneration.

import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { SDDeltagerDetaljerRecord } from "./sd-deltager-detaljer.model";
import { SDDeltagerDetaljerService } from "./sd-deltager-detaljer.service";

@Component({
  selector: "cds-sd-deltager-detaljer",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrl: "./sd-deltager-detaljer.component.scss",
  templateUrl: "./sd-deltager-detaljer.component.html",
})
export class SDDeltagerDetaljerComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(SDDeltagerDetaljerService);

  /** Currently visible TcxTabSheet, mirrors the Delphi PageControl ActivePageIndex. */
  readonly activeTab = signal<number>(0);
  /** Stub data for cxGrid5Rows — replace with real query results. */
  readonly cxGrid5Rows = signal<
    { inntektstype?: any; skattetrekksbeloep?: any }[]
  >([]);
  /** Stub data for cxGrid3Rows — replace with real query results. */
  readonly cxGrid3Rows = signal<
    { landkode?: any; anvendtSkattesats?: any; beloepINok?: any }[]
  >([]);
  /** Stub data for cxGrid1Rows — replace with real query results. */
  readonly cxGrid1Rows = signal<
    {
      selskapetsNavn?: any;
      eierandel?: any;
      stemmerettsandel?: any;
      ervervsaar?: any;
    }[]
  >([]);
  /** Stub data for cxGrid2Rows — replace with real query results. */
  readonly cxGrid2Rows = signal<{ kommunenummer?: any; grunnlag?: any }[]>([]);
  /** Stub data for cxGrid4Rows — replace with real query results. */
  readonly cxGrid4Rows = signal<
    {
      kraftverketsNavn?: any;
      loepenummer?: any;
      eiendomsskattegrunnlag?: any;
    }[]
  >([]);
  /** Stub data for cxGrid6Rows — replace with real query results. */
  readonly cxGrid6Rows = signal<
    {
      loepenummer?: any;
      kraftverketsNavn?: any;
      andelAvPositivGrunnrenteinntektFoerSamordning?: any;
      andelAvNegativGrunnrenteinntektFoerSamordning?: any;
      andelAvNegativGrunnrenteskattVedDriftssettelse?: any;
      andelAvNegativGrunnrenteskattVedOpphoer?: any;
    }[]
  >([]);

  readonly form = this.fb.group({
    firmanr: this.fb.control<number | null>(0),
    aar: this.fb.control<string>(""),
    id: this.fb.control<string>(""),
    deltakerensNorskePersonidentifikator: this.fb.control<string>(""),
    deltakerensOrganisasjonsnummer: this.fb.control<string>(""),
    deltakerensNavn: this.fb.control<string>(""),
    andelAvNettoformue: this.fb.control<number | null>(0),
    andelAvSamletInntekt: this.fb.control<number | null>(0),
    alminneligInntekt: this.fb.control<number | null>(0),
    underskudd: this.fb.control<number | null>(0),
    tilleggIAlminneligInntekt: this.fb.control<number | null>(0),
    gevinstVedUttakFraNorskBeskatningsomraade: this.fb.control<number | null>(
      0,
    ),
    tapVedUttakFraNorskBeskatningsomraade: this.fb.control<number | null>(0),
    arbeidsgodtgjoerelseInnenFiskeOgFangst: this.fb.control<number | null>(0),
    arbeidsgodtgjoerelseInnenFamiliebarnehageIDeltakersHjem: this.fb.control<
      number | null
    >(0),
    arbeidsgodtgjoerelseInnenAnnenNaering: this.fb.control<number | null>(0),
    annetTillegg: this.fb.control<number | null>(0),
    annenReduksjon: this.fb.control<number | null>(0),
    begrensningKnyttetTilUtenlandsforhold: this.fb.control<number | null>(0),
    samletPositivUtdeling: this.fb.control<number | null>(0),
    uegentligInnskudd: this.fb.control<number | null>(0),
    kontantUtbetaling: this.fb.control<number | null>(0),
    verdIAvEiendelOgTjenesteOverfoertTilDeltaker: this.fb.control<
      number | null
    >(0),
    tilbakebetalingAvInnbetaltEgenkapital: this.fb.control<number | null>(0),
    inngangsverdiJustertForInnskuddErvervRealisasjonMv: this.fb.control<
      number | null
    >(0),
    ubenyttetSkjermingsfradragFraTidligereAar: this.fb.control<number | null>(
      0,
    ),
    anvendtSkjermingsfradragVedRealisasjonMv: this.fb.control<number | null>(0),
    annetTilleggIInngangsverdi: this.fb.control<number | null>(0),
    annenReduksjonIInngangsverdi: this.fb.control<number | null>(0),
    skjermingsgrunnlag: this.fb.control<number | null>(0),
    aaretsSkjermingsfradrag: this.fb.control<number | null>(0),
    tilleggTilSkjermingsfradragFraArvEllerGave: this.fb.control<number | null>(
      0,
    ),
    reduksjonISkjermingsfradragFraArvEllerGave: this.fb.control<number | null>(
      0,
    ),
    overfoertUbenyttetSkjermingsfradragFraTidligereAarFraAnnetSDF:
      this.fb.control<number | null>(0),
    overfoertUbenyttetSkjermingsfradragFraTidligereAarTilAnnetSDF:
      this.fb.control<number | null>(0),
    overfoertUbenyttetSkjermingsfradragIInntektsaarFraAnnetSDF: this.fb.control<
      number | null
    >(0),
    overfoertUbenyttetSkjermingsfradragIInntektsaarTilAnnetSDF: this.fb.control<
      number | null
    >(0),
    korrigertUbenyttetSkjermingsfradragFraTidligereAar: this.fb.control<
      number | null
    >(0),
    annetTilleggTilSkjermingsfradrag: this.fb.control<number | null>(0),
    annenReduksjonISkjermingsfradrag: this.fb.control<number | null>(0),
    skjermingsfradragTilAnvendelseOgFremfoering: this.fb.control<number | null>(
      0,
    ),
    anvendtSkjermingsfradragIInntektsaar: this.fb.control<number | null>(0),
    skjermingsfradragTilFremfoeringFoerMotregningMotGevinst: this.fb.control<
      number | null
    >(0),
    skjermingsfradragTilFremfoeringTilNesteInntektsaar: this.fb.control<
      number | null
    >(0),
    grunnlagForBeregningAvJordbruksfradrag: this.fb.control<number | null>(0),
    leieinntektFraJordbruksdriftSomInngaarIDriftsinntekt: this.fb.control<
      number | null
    >(0),
    erKommandittistEllerStilleDeltakerMedBeloepsbegrensetAnsvar:
      this.fb.control<boolean>(false),
    andelIkkeinnkaltSelskapskapitalEllerInnskuddsforpliktelse: this.fb.control<
      number | null
    >(0),
    fremfoertUnderskuddFraTidligereAar: this.fb.control<number | null>(0),
    oppnaaddUnderhaandsakkordOgGjeldsettergivelse: this.fb.control<
      number | null
    >(0),
    aaretsAnvendelseAvFremfoertUnderskuddFraTidligereAar: this.fb.control<
      number | null
    >(0),
    skattepliktigGevinstVedRealisasjonAvAndel: this.fb.control<number | null>(
      0,
    ),
    fremfoerbartUnderskudd: this.fb.control<number | null>(0),
    inngaaendeVerdiInngV: this.fb.control<number | null>(0),
    inngaaendeVerdiInnbEK: this.fb.control<number | null>(0),
    inngaaendeVerdiOpptEK: this.fb.control<number | null>(0),
    inngaaendeVerdiTotEK: this.fb.control<number | null>(0),
    kostprisVedErvervAvAndelInngV: this.fb.control<number | null>(0),
    kostprisVedErvervAvAndelInnbEK: this.fb.control<number | null>(0),
    kostprisVedErvervAvAndelOpptEK: this.fb.control<number | null>(0),
    kostprisVedErvervAvAndelTotEK: this.fb.control<number | null>(0),
    realisasjonAvAndelInngV: this.fb.control<number | null>(0),
    realisasjonAvAndelInnbEK: this.fb.control<number | null>(0),
    realisasjonAvAndelOpptEK: this.fb.control<number | null>(0),
    realisasjonAvAndelTotEK: this.fb.control<number | null>(0),
    innskuddInngV: this.fb.control<number | null>(0),
    innskuddInnbEK: this.fb.control<number | null>(0),
    innskuddTotEK: this.fb.control<number | null>(0),
    tilbakebetalingAvInnbetaltKapitalInngV: this.fb.control<number | null>(0),
    tilbakebetalingAvInnbetaltKapitalInnbEK: this.fb.control<number | null>(0),
    tilbakebetalingAvInnbetaltKapitalTotEK: this.fb.control<number | null>(0),
    aaretsUtdeling: this.fb.control<number | null>(0),
    uegentligInnskuddInngV: this.fb.control<number | null>(0),
    uegentligInnskuddInnbEK: this.fb.control<number | null>(0),
    uegentligInnskuddOpptEK: this.fb.control<number | null>(0),
    skattefordelAvUnderskuddInngV: this.fb.control<number | null>(0),
    skattefordelAvUnderskuddInnbEK: this.fb.control<number | null>(0),
    skattefordelAvUnderskuddOpptEK: this.fb.control<number | null>(0),
    skattemessigResultat: this.fb.control<number | null>(0),
    andelAvSkattefriInntekt: this.fb.control<number | null>(0),
    andelAvIkkeFradragsberettigetKostnad: this.fb.control<number | null>(0),
    annetTilleggInngV: this.fb.control<number | null>(0),
    annetTilleggInnbEK: this.fb.control<number | null>(0),
    annetTilleggOpptEK: this.fb.control<number | null>(0),
    annetTilleggTotEK: this.fb.control<number | null>(0),
    annenReduksjonInngV: this.fb.control<number | null>(0),
    annenReduksjonInnbEK: this.fb.control<number | null>(0),
    annenReduksjonOpptEK: this.fb.control<number | null>(0),
    annenReduksjonTotEK: this.fb.control<number | null>(0),
    utgaaendeVerdiInngV: this.fb.control<number | null>(0),
    utgaaendeVerdiInnbEK: this.fb.control<number | null>(0),
    utgaaendeVerdiOpptEK: this.fb.control<number | null>(0),
    utgaaendeVerdiTotEK: this.fb.control<number | null>(0),
    samletEgenkapitalUtgaaendeVerdi: this.fb.control<number | null>(0),
    kalkGrunnlagForTilbakebetalingInnbEK: this.fb.control<number | null>(0),
    kalkDelSumInngV: this.fb.control<number | null>(0),
    inngaaendeOverpris: this.fb.control<number | null>(0),
    inngaaendeUnderpris: this.fb.control<number | null>(0),
    realisertAndelAvOverEllerUnderpris: this.fb.control<number | null>(0),
    akkumulertOverpris: this.fb.control<number | null>(0),
    akkumulertUnderpris: this.fb.control<number | null>(0),
    erKomplementarEllerHovedperson: this.fb.control<boolean>(false),
    skattefordelAvUnderskudd: this.fb.control<number | null>(0),
    heravAndelAvAlminneligInntektUnderlagtBeskatningIUtlandetBeloepINok:
      this.fb.control<number | null>(0),
    heravAndelITilleggIAlminneligInntektUnderlagtBeskatningIUtlandetBeloepINok:
      this.fb.control<number | null>(0),
    heravAndelAvArbeidsgodtgjoerelseUnderlagtBeskatningIUtlandetBeloepINok:
      this.fb.control<number | null>(0),
    sum210UtdelingForSkattOgSkjerming: this.fb.control<number | null>(0),
    sum440: this.fb.control<number | null>(0),
    sumGrlForTilbakebet620: this.fb.control<number | null>(0),
    sum1114: this.fb.control<number | null>(0),
    aaretsUnderskuddTilFremforing1115b: this.fb.control<number | null>(0),
    sum1120: this.fb.control<number | null>(0),
    gevinstTapVedRealisasjonAvAndel145: this.fb.control<number | null>(0),
    kostprisVedErvervAvAndelInngV864: this.fb.control<number | null>(0),
    sum865: this.fb.control<number | null>(0),
    kostprisVedErvervAvAndelInngV863: this.fb.control<number | null>(0),
    skattPaaDeltakersAndelAvSelskapetsOverskudd: this.fb.control<number | null>(
      0,
    ),
    andelIkkeinnkaltSelskapskapitalEllerInnskuddsforpliktelse_O:
      this.fb.control<boolean>(false),
    andelAvNettoformue_O: this.fb.control<boolean>(false),
    andelAvIkkeFradragsberettigetKostnad_O: this.fb.control<boolean>(false),
    andelAvSamletInntekt_O: this.fb.control<boolean>(false),
    kontantUtbetaling_O: this.fb.control<boolean>(false),
    tilbakebetalingAvInnbetaltEgenkapital_O: this.fb.control<boolean>(false),
    innskuddInngV_O: this.fb.control<boolean>(false),
    selskapsandelIProsent_O: this.fb.control<boolean>(false),
    deltakersAndelAvInntektIProsent_O: this.fb.control<boolean>(false),
    deltagernr: this.fb.control<number | null>(0),
    andelVektet: this.fb.control<number | null>(0),
    deltakersAndelAvFormueIProsent_O: this.fb.control<boolean>(false),
    utbetaltOverskuddMvTilUpersonligDeltakerFraMidlerOpptjentFoerSelskapBleNokus:
      this.fb.control<number | null>(0),
    grunnlagForBeregningAvSaerskiltFradragForSkiferproduksjonFraSDF:
      this.fb.control<number | null>(0),
    grunnlagForBeregningAvSaerskiltFradragForReindriftFraSDF: this.fb.control<
      number | null
    >(0),
    erOmfattetAvRederiskatteordning: this.fb.control<boolean>(false),
    rEandelAvSamletInntekt: this.fb.control<number | null>(0),
    rEandelAvSamletUnderskudd: this.fb.control<number | null>(0),
    rEandelAvTonnasjeskatt: this.fb.control<number | null>(0),
    rEandelAvFinansinntekt: this.fb.control<number | null>(0),
    rEandelFinansaktivaAvTotalkapital: this.fb.control<number | null>(0),
    rEandelAvTotalkapitalVedInngangenTilInntektsaaret: this.fb.control<
      number | null
    >(0),
    rEandelAvTotalkapitalVedUtgangenAvInntektsaaret: this.fb.control<
      number | null
    >(0),
    rEandelAvGjeldVedInngangenTilInntektsaaret: this.fb.control<number | null>(
      0,
    ),
    rEandelAvGjeldVedUtgangenAvInntektsaaret: this.fb.control<number | null>(0),
    nOantallAksjeEllerAndel: this.fb.control<number | null>(0),
    nOpaalydendeVerdi: this.fb.control<number | null>(0),
    nOkostpris: this.fb.control<number | null>(0),
    nOandelAvUtbytte: this.fb.control<number | null>(0),
    nOeierandel: this.fb.control<number | null>(0),
    nOstemmerettsandel: this.fb.control<number | null>(0),
    nOervervsaar: this.fb.control<string>(""),
    nOfremfoertUnderskuddFraTidligereAar31122002: this.fb.control<
      number | null
    >(0),
    nOaaretsAnvendelseAvFremfoertUnderskuddFraTidligereAar31122002:
      this.fb.control<number | null>(0),
    nOfremfoerbartUnderskudd31122002: this.fb.control<number | null>(0),
    nOfremfoertUnderskuddFraTidligereAar: this.fb.control<number | null>(0),
    nOaaretsAnvendelseAvFremfoertUnderskuddFraTidligereAar: this.fb.control<
      number | null
    >(0),
    nOfremfoerbartUnderskudd: this.fb.control<number | null>(0),
    nOselskapsskattBetaltAvNokus: this.fb.control<number | null>(0),
    nOandelAvAvsattUtbytte: this.fb.control<number | null>(0),
    nOandelAvEkstraordinaertUtbytte: this.fb.control<number | null>(0),
    nOendringISelskapetsSkattlagteKapital: this.fb.control<number | null>(0),
    nOregulertInngangsverdiPerAksje: this.fb.control<number | null>(0),
    nOakkumulertRisk: this.fb.control<number | null>(0),
    nOsamletRisk: this.fb.control<number | null>(0),
    kRendeligSamordnetPositivGrunnrenteinntekt: this.fb.control<number | null>(
      0,
    ),
    kRendeligSamordnetNegativGrunnrenteinntekt: this.fb.control<number | null>(
      0,
    ),
    hApositivGrunnrenteinntektFoerSamordning: this.fb.control<number | null>(0),
    hAnegativGrunnrenteinntektFoerSamordning: this.fb.control<number | null>(0),
    hAproduksjonsavgift: this.fb.control<number | null>(0),
    samletSkattefradrag: this.fb.control<number | null>(0),
    samletTilleggIBeregnetSkatt: this.fb.control<number | null>(0),
    selskapsandelIProsent: this.fb.control<number | null>(0),
    deltakersAndelAvInntektIProsent: this.fb.control<number | null>(0),
    deltakersAndelAvFormueIProsent: this.fb.control<number | null>(0),
    sum632: this.fb.control<number | null>(0),
    tAIsamletPositivUtdeling: this.fb.control<number | null>(0),
    andelAvSkattefriInntekt_O: this.fb.control<boolean>(false),
    erNokus: this.fb.control<boolean>(false),
    erUtenlandskSelskapMedDeltakerfastsetting: this.fb.control<boolean>(false),
    annenPositivEndring: this.fb.control<number | null>(0),
    annenNegativEndring: this.fb.control<number | null>(0),
    rEandelAvSamletInntekt_O: this.fb.control<boolean>(false),
    rEandelAvTonnasjeskatt_O: this.fb.control<boolean>(false),
    rEandelAvFinansinntekt_O: this.fb.control<boolean>(false),
    rEandelFinansaktivaAvTotalkapital_O: this.fb.control<boolean>(false),
    rEandelAvTotalkapitalVedInngangenTilInntektsaaret_O:
      this.fb.control<boolean>(false),
    rEandelAvGjeldVedInngangenTilInntektsaaret_O:
      this.fb.control<boolean>(false),
    rEandelAvTotalkapitalVedUtgangenAvInntektsaaret_O:
      this.fb.control<boolean>(false),
    rEandelAvGjeldVedUtgangenAvInntektsaaret_O: this.fb.control<boolean>(false),
    ikkeSkattepliktigNorge: this.fb.control<boolean>(false),
    finansskattepliktig: this.fb.control<boolean>(false),
    finnmarkskatt: this.fb.control<boolean>(false),
    gevinstTapVedRealisasjonAvAndel145_O: this.fb.control<boolean>(false),
    rEaaretsFremfoerteDifferanseMellomVirkeligVerdiOgSkattemessigVerdiVedUttreden:
      this.fb.control<number | null>(0),
    rEandelAvDifferanseMellomVirkeligVerdiOgSkattemessigVerdiVedUttredenBenyttetIInntektsaaret:
      this.fb.control<number | null>(0),
    rEandelAvDifferanseMellomVirkeligVerdiOgSkattemessigVerdiVedUttredenTilFremfoering:
      this.fb.control<number | null>(0),
    kRpositivGrunnrenteinntektFoerSamordning: this.fb.control<number | null>(0),
    kRnegativGrunnrenteinntektFoerSamordning: this.fb.control<number | null>(0),
    hApositivGrunnrenteinntektForAnsvarligSelskapFoerSamordningEtterBunnfradrag:
      this.fb.control<number | null>(0),
    nOandelAvNettoSkattemessigFormueForrigeInntektsaar: this.fb.control<
      number | null
    >(0),
    nOandelAvNettoSkattemessigFormueIInntektsaaret: this.fb.control<
      number | null
    >(0),
    nOandelAvKursverdi1JanuarIAaretEtterInntektsaaret: this.fb.control<
      number | null
    >(0),
    nOandelAvAntattSalgsverdi1JanuarIAaretEtterInntektsaaret: this.fb.control<
      number | null
    >(0),
    deltagerId: this.fb.control<string>(""),
    erverversOrganisasjonsnummer: this.fb.control<string>(""),
    erverversPersonidentifikator: this.fb.control<string>(""),
    overdragelsestidspunktR: this.fb.control<string>(""),
    erverversNavn: this.fb.control<string>(""),
    realisasjonstype: this.fb.control<string>(""),
    vederlagR: this.fb.control<number | null>(0),
    realisasjonskostnad: this.fb.control<number | null>(0),
    tilleggForIkkeFradragsberettigetTapForArvEllerGave: this.fb.control<
      number | null
    >(0),
    ubenyttetSkjermingsfradrag: this.fb.control<number | null>(0),
    annetTilleggR: this.fb.control<number | null>(0),
    annenReduksjonR: this.fb.control<number | null>(0),
    gevinstVedRealisasjonAvAndel: this.fb.control<number | null>(0),
    tapVedRealisasjonAvAndel: this.fb.control<number | null>(0),
    gevinstEllerTapErOmfattetAvFritaksmetoden: this.fb.control<boolean>(false),
    sumForelopigGevTap720: this.fb.control<number | null>(0),
    realisasjonAvAndelInngV704: this.fb.control<number | null>(0),
    reguleringForPositivRiskIEiertiden: this.fb.control<number | null>(0),
    reguleringForNegativRiskIEiertiden: this.fb.control<number | null>(0),
    realisertAndel: this.fb.control<number | null>(0),
    kostprisForRealisertAksjeEllerAndelINokus: this.fb.control<number | null>(
      0,
    ),
    realisasjonstype_O: this.fb.control<boolean>(false),
    avhendersNavn: this.fb.control<string>(""),
    avhendersOrganisasjonsnummer: this.fb.control<string>(""),
    avhendersPersonidentifikator: this.fb.control<string>(""),
    overdragelsestidspunktE: this.fb.control<string>(""),
    ervervstype: this.fb.control<string>(""),
    vederlagE: this.fb.control<number | null>(0),
    kjoepskostnad: this.fb.control<number | null>(0),
    overtattInngangsverdiForAndelSomArvEllerGave: this.fb.control<
      number | null
    >(0),
    deltagerAutokey: this.fb.control<number | null>(0),
    kostprisPaaRealiserteAndeler: this.fb.control<number | null>(0),
    tilfoertKapitalUtenOekningAvEierandel: this.fb.control<number | null>(0),
    ikkeSkattepliktigTilbakebetaltKapital: this.fb.control<number | null>(0),
    samletKostpris: this.fb.control<number | null>(0),
    samletNegativKostpris: this.fb.control<number | null>(0),
    nOubenyttetSkjermingsfradragFraTidligereAar: this.fb.control<number | null>(
      0,
    ),
    nOskjermingsgrunnlag: this.fb.control<number | null>(0),
    nOaaretsSkjermingsfradrag: this.fb.control<number | null>(0),
    nOakkumulertRiskPaaAndelVedInngangTil2006: this.fb.control<number | null>(
      0,
    ),
    nOmottattSkatterettsligUtbytte: this.fb.control<number | null>(0),
    nOandelKreditfradrag: this.fb.control<number | null>(0),
    nOskattepliktigUtbytteFoerSkjermingsfradrag: this.fb.control<number | null>(
      0,
    ),
    nOskattepliktigUtbytte: this.fb.control<number | null>(0),
    nOubenyttetSkjermingsfradragTilFremfoering: this.fb.control<number | null>(
      0,
    ),
    overtattNegativInngangsverdiForAndelSomArvEllerGave: this.fb.control<
      number | null
    >(0),
    ervervetAndel: this.fb.control<number | null>(0),
    ervervstype_O: this.fb.control<boolean>(false),
    kode: this.fb.control<string>(""),
    beskrivelse: this.fb.control<string>(""),
    land: this.fb.control<string>(""),
    kode2: this.fb.control<string>(""),
    landkode: this.fb.control<string>(""),
    anvendtSkattesats: this.fb.control<number | null>(0),
    beloepINok: this.fb.control<number | null>(0),
    deltagerType: this.fb.control<string>(""),
    selskapetsNavn: this.fb.control<string>(""),
    eierandel: this.fb.control<number | null>(0),
    stemmerettsandel: this.fb.control<number | null>(0),
    ervervsaar: this.fb.control<string>(""),
    kommunenummer: this.fb.control<string>(""),
    grunnlag: this.fb.control<number | null>(0),
    kommunenr: this.fb.control<string>(""),
    navn: this.fb.control<string>(""),
    loepenummer: this.fb.control<string>(""),
    kraftverketsNavn: this.fb.control<string>(""),
    eiendomsskattegrunnlag: this.fb.control<number | null>(0),
    inntektstype: this.fb.control<string>(""),
    skattetrekksbeloep: this.fb.control<number | null>(0),
    andelAvPositivGrunnrenteinntektFoerSamordning: this.fb.control<
      number | null
    >(0),
    andelAvNegativGrunnrenteinntektFoerSamordning: this.fb.control<
      number | null
    >(0),
    andelAvNegativGrunnrenteskattVedDriftssettelse: this.fb.control<
      number | null
    >(0),
    andelAvNegativGrunnrenteskattVedOpphoer: this.fb.control<number | null>(0),
  });

  ngOnInit(): void {
    this.service.load().subscribe((record) => this.form.patchValue(record));
  }

  setActiveTab(i: number): void {
    this.activeTab.set(i);
  }

  navFirst(): void {
    console.info("[sd-deltager-detaljer] navFirst not yet implemented");
  }

  navPrev(): void {
    console.info("[sd-deltager-detaljer] navPrev not yet implemented");
  }

  navNext(): void {
    console.info("[sd-deltager-detaljer] navNext not yet implemented");
  }

  navLast(): void {
    console.info("[sd-deltager-detaljer] navLast not yet implemented");
  }

  navInsert(): void {
    console.info("[sd-deltager-detaljer] navInsert not yet implemented");
  }

  navDelete(): void {
    console.info("[sd-deltager-detaljer] navDelete not yet implemented");
  }

  navPost(): void {
    console.info("[sd-deltager-detaljer] navPost not yet implemented");
  }

  navCancel(): void {
    console.info("[sd-deltager-detaljer] navCancel not yet implemented");
  }

  navRefresh(): void {
    console.info("[sd-deltager-detaljer] navRefresh not yet implemented");
  }
}
