import type { PayrollConfig, PayrollResult, MonthProjection, ExtraIncome } from "@/lib/contracts/payroll";

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export const DEFAULT_PAYROLL_CONFIG: PayrollConfig = {
  salarioBasico: 0,
  auxilioTransporte: 0,
  smlmv: 0,
  montoSalud: 0,
  montoPension: 0,
  montoFSP: 0,
  prestamoTotal: 0,
  tasaInteresMensual: 0,
  fechaInicio: "",
  fechaFin: "",
  mesesTranscurridos: 0,
  retencionQuincenal: 0,
  otrosDescuentos: 0,
  egresosFijos: [],
  enableSalud: false,
  enablePension: false,
  enableFSP: false,
  enableAuxTransporte: false,
  enablePrestamo: false,
};

export function calculatePayroll(config: PayrollConfig): PayrollResult {
  const sal = config.salarioBasico;
  const aplicaAux = config.enableAuxTransporte;
  const aux = aplicaAux ? config.auxilioTransporte : 0;
  const aplicaFSP = config.enableFSP;

  const saludM = config.enableSalud ? config.montoSalud : 0;
  const pensionM = config.enablePension ? config.montoPension : 0;
  const fspM = aplicaFSP ? config.montoFSP : 0;

  let tasaQ = 0;
  let cuotaQ = 0;
  let saldo = 0;
  let qRest = 0;

  if (config.enablePrestamo && config.prestamoTotal > 0) {
    tasaQ = Math.pow(1 + config.tasaInteresMensual, 0.5) - 1;
    const d1 = new Date(config.fechaInicio);
    const d2 = new Date(config.fechaFin);
    const plazoM = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
    const plazoQ = plazoM * 2;
    const qPag = config.mesesTranscurridos * 2;

    if (plazoQ > 0) {
      cuotaQ = (config.prestamoTotal * tasaQ * Math.pow(1 + tasaQ, plazoQ)) / (Math.pow(1 + tasaQ, plazoQ) - 1);
      saldo = config.prestamoTotal * Math.pow(1 + tasaQ, qPag) - cuotaQ * ((Math.pow(1 + tasaQ, qPag) - 1) / tasaQ);
    }

    qRest = Math.max(0, plazoM * 2 - config.mesesTranscurridos * 2);
  }

  const dedQ = saludM / 2 + pensionM / 2 + fspM / 2 + cuotaQ + config.retencionQuincenal + config.otrosDescuentos;
  const devQ = sal / 2 + aux / 2;
  const netoQ = devQ - dedQ;

  return {
    aplicaAux,
    aplicaFSP,
    aux,
    saludM,
    saludQ: saludM / 2,
    pensionM,
    pensionQ: pensionM / 2,
    fspM,
    fspQ: fspM / 2,
    tasaQ,
    cuotaQ,
    cuotaM: cuotaQ * 2,
    saldo,
    qRest,
    devQ,
    devM: devQ * 2,
    dedQ,
    dedM: dedQ * 2,
    netoQ,
    netoM: netoQ * 2,
  };
}

export function buildMonthlyProjections(
  payroll: PayrollResult,
  totalExpenses: number,
  extras: Array<ExtraIncome>,
  year: number
): Array<MonthProjection> {
  const projections = MONTHS.map((mes, i) => {
    const monthExtras = extras.filter((e) => {
      const d = new Date(e.fecha);
      return d.getMonth() === i && d.getFullYear() === year;
    });

    const tExtras = monthExtras.reduce((sum, e) => sum + (e.monto || 0), 0);

    return {
      mes,
      netoNomina: payroll.netoM,
      tExtras,
      ingTotal: payroll.netoM + tExtras,
      egFijos: totalExpenses,
      balance: payroll.netoM + tExtras - totalExpenses,
      acum: 0,
    };
  });

  let accumulated = 0;

  projections.forEach((m) => {
    accumulated += m.balance;
    m.acum = accumulated;
  });

  return projections;
}

export function getMonthNames(): Array<string> {
  return [...MONTHS];
}
