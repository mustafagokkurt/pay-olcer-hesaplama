import { IDetail } from "./Detail";

export interface Consumption {
  id: number;
  index: number;
  month: number;
  details: IDetail[];
  yakitFaturasi: number;
  toplamTuketimKwh: number;
  toplamManipulationKwh: number;
  ortakKullanim: number;
  ortakKullanimBirimFiyat: number;
  faturaTarihi: Date;
  isinmaGideriBirimFiyat: number;
  sonOdemeTarihi: Date;
  coefficient: number;
}
