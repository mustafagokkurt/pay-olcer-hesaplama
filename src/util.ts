import { Constants } from "./interfaces/Constants";
import { Consumption } from "./interfaces/Consumption";
import { IDetail } from "./interfaces/Detail";

/**
 * Ortak Kullanım
 */
export const getCommonUsePrice = (totalAmount: number) => {
  return totalAmount * 0.3;
};

/**
 * Ortak Kullanım Birim Fiyat
 */
export const getCommonUseUnitPrice = (
  totalAmount: number,
  totalClosedArea: number
) => {
  return (totalAmount * 0.3) / totalClosedArea;
};

/**
 * Bir daire için ortak kullanım bedeli
 */
export const calculateCommonUseAmountForAnApartment = (
  m2: number,
  totalAmount: number,
  totalClosedArea: number
) => {
  return Number(
    (getCommonUseUnitPrice(totalAmount, totalClosedArea) * m2).toFixed(2)
  );
};

/**
 * IsinmaGideriBirimFiyat
 */
export const getHeatingExpenseUnitPrice = (
  totalAmount: number,
  totalManipulationAmountKwh: number,
  totalConsumptionAmountKwh: number
) => {
  const tuketimMiktari = totalManipulationAmountKwh + totalConsumptionAmountKwh;
  return (totalAmount * 0.7) / tuketimMiktari;
};

/**
 * Bir daire için ısınma gideri
 */
export const calculateHeatingExpense = (unitPrice: number, detail: IDetail) => {
  const kwh = detail.consumptionKwh + detail.manipulation;
  return Number((unitPrice * kwh).toFixed(2));
};

/**
 * 1m2 için harcanan tüketim ortalaması
 */
export const getConsumptionAverage = (
  totalConsumptionAmountKwh: number,
  totalClosedArea: number
) => {
  return totalConsumptionAmountKwh / totalClosedArea;
};

/**
 * 1m2 nin 15C ısıtılması için gerekli enerji miktarı
 * @param coefficient 15C katsayısı
 */
export const calculateEnergyForOneSquareMeter = (
  coefficient: number,
  totalConsumptionAmountKwh: number,
  totalClosedArea: number
) => {
  return (
    getConsumptionAverage(totalConsumptionAmountKwh, totalClosedArea) *
    coefficient
  );
};

/**
 * Dairenin 15C ısıtılması için gerekli enerji miktarı
 */
export const calculateEnergyForAnApartment = (
  m2: number,
  coefficient: number,
  totalConsumptionAmountKwh: number,
  totalClosedArea: number
) => {
  return Number(
    (
      calculateEnergyForOneSquareMeter(
        coefficient,
        totalConsumptionAmountKwh,
        totalClosedArea
      ) * m2
    ).toFixed(2)
  );
};

/**
 * Manipilasyon miktarı
 */
export const getManipulation = (
  energyForOneApartment: number,
  consumptionAmount: number
) => {
  return energyForOneApartment - consumptionAmount;
};

export const hasManipulation = (
  detail: IDetail,
  previousDetails: IDetail[],
  constants: Constants,
  newConsumption: Consumption
) => {
  const manipulation = getManipulation(
    calculateEnergyForAnApartment(
      getArea(detail.apartmentNo, constants),
      constants.coefficients["ekim"],
      newConsumption.toplamTuketimKwh,
      constants.totalClosedArea
    ),
    getConsumptionKwh(detail, previousDetails)
  );

  return manipulation > 0 ? Number(manipulation.toFixed(2)) : 0;
};

/**
 *  Manipülasyonlar toplamı
 */
export const getTotalAmountOfManipulatedConsumption = (
  manipulationList: number[],
  totalConsumptionAmountKwh: number
) => {
  return sum(manipulationList);
};

export const getArea = (apartmentNo: number, constants: Constants) => {
  return constants.area[apartmentNo];
};

export const getPreviousDetail = (
  apartmentNo: number,
  previousDetails: IDetail[]
) => {
  return previousDetails.find(
    (detail: IDetail) => detail.apartmentNo === apartmentNo
  ) as IDetail;
};

export const getPreviousCounter = (
  apartmentNo: number,
  previousDetails: IDetail[]
) => {
  const counter = getPreviousDetail(apartmentNo, previousDetails)?.counter;

  return counter;
};

export const getConsumptionKwh = (
  detail: IDetail,
  previousDetails: IDetail[]
) => {
  return (
    detail.counter -
    getPreviousDetail(detail.apartmentNo, previousDetails)?.counter
  );
};

export const getTotalConsumptionAmountKwh = (
  details: IDetail[],
  previousDetails: IDetail[]
) => {
  return sum(
    details.map((detail: IDetail) => getConsumptionKwh(detail, previousDetails))
  );
};

export const sum = (list: number[]) => {
  return list.reduce((total, numberX) => total + numberX, 0);
};

export const getParam = (param: string) => {
  const queryString = window.location.search;
  console.log(queryString);
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param) || "";
};
