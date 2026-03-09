export interface PayrollConfig {
  salarioBasico: number;
  auxilioTransporte: number;
  smlmv: number;
  montoSalud: number;
  montoPension: number;
  montoFSP: number;
  prestamoTotal: number;
  tasaInteresMensual: number;
  fechaInicio: string;
  fechaFin: string;
  mesesTranscurridos: number;
  retencionQuincenal: number;
  otrosDescuentos: number;
  egresosFijos: Array<FixedExpense>;
  enableSalud: boolean;
  enablePension: boolean;
  enableFSP: boolean;
  enableAuxTransporte: boolean;
  enablePrestamo: boolean;
}

export interface FixedExpense {
  nombre: string;
  monto: number;
  quincena: "1Q" | "2Q";
}

export interface PayrollResult {
  aplicaAux: boolean;
  aplicaFSP: boolean;
  aux: number;
  saludM: number;
  saludQ: number;
  pensionM: number;
  pensionQ: number;
  fspM: number;
  fspQ: number;
  tasaQ: number;
  cuotaQ: number;
  cuotaM: number;
  saldo: number;
  qRest: number;
  devQ: number;
  devM: number;
  dedQ: number;
  dedM: number;
  netoQ: number;
  netoM: number;
}

export interface MonthProjection {
  mes: string;
  netoNomina: number;
  tExtras: number;
  ingTotal: number;
  egFijos: number;
  balance: number;
  acum: number;
}

export interface ExtraIncome {
  id: number;
  fecha: string;
  fuente: string;
  monto: number;
}
