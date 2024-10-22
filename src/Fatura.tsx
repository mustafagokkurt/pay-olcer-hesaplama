import "./Fatura.css";
// import "./A4.css";
import "./A4-2.css";
import { IDetail } from "./interfaces/Detail";
import { Consumption } from "./interfaces/Consumption";
import { getArea, getPreviousCounter } from "./util";
import { Constants } from "./interfaces/Constants";
import { Message } from "primereact/message";

type IProps = {
  detail: IDetail;
  consumption: Consumption;
  constants: Constants;
  consumptionList: Consumption[];
};

export const Fatura = (props: IProps) => {
  const { detail, consumption, constants, consumptionList } = props;

  return (
    <>
      <div className="page">
        <div className="content subpage">
          <div className="grid gray mb-2">
            <div className="col-4">
              <div className="text-center text-left p-3 border-round-sm font-bold">
                4
              </div>
            </div>
            <div className="col-4 col-offset-4">
              <div className="text-center text-right p-3 border-round-sm font-bold">
                4
              </div>
            </div>
          </div>
          <div className="grid">
            <div className="col">
              <table className="w-full">
                <tr className="dark-gray">
                  <th colSpan={2} className="text-left	">
                    ISINMA DİGERLERİ
                  </th>
                </tr>
                <tr>
                  <td className="gray">T.TÜKETİM</td>
                  <td>{detail.consumptionKwh}</td>
                </tr>
                <tr>
                  <td className="gray">FARK</td>
                  <td>{detail.manipulation}</td>
                </tr>
                <tr>
                  <td className="gray">BİRİM FİYAT</td>
                  <td>{consumption.isinmaGideriBirimFiyat}</td>
                </tr>
              </table>
            </div>
            <div className="col">
              <table className="w-full">
                <tr className="dark-gray">
                  <th colSpan={2} className="text-left	">
                    ORTAK KULLANIM
                  </th>
                </tr>
                <tr>
                  <td className="gray">MESKEN ALANI</td>
                  <td>{getArea(detail.apartmentNo, constants)}</td>
                </tr>
                <tr>
                  <td className="gray">BİRİM FİYAT</td>
                  <td>{consumption.ortakKullanimBirimFiyat}</td>
                </tr>
              </table>
            </div>
            <div className="col">
              <table className="w-full">
                <tr className="dark-gray">
                  <th colSpan={2} className="text-left	">
                    DİĞER GİDERLER
                  </th>
                </tr>
                <tr>
                  <td className="gray"></td>
                  <td></td>
                </tr>
              </table>
            </div>
          </div>
          <div className="grid">
            <div className="col">
              <table className="w-full">
                <tr className="dark-gray">
                  <th colSpan={7} className="text-left	">
                    SAYAÇLAR
                  </th>
                </tr>
                <tr>
                  <td className="w-1 gray">SAYAÇ NO</td>
                  <td className="w-1 gray">SAYAÇ TİPİ</td>
                  <td className="w-1 gray">İLK ENDEKS</td>
                  <td className="w-1 gray">SON ENDEKS</td>
                  <td className="w-1 gray">TÜKETİM</td>
                  <td className="w-1 gray">BİRİM FİYAT</td>
                  <td className="w-1 gray">TOPLAM</td>
                </tr>
                <tr>
                  <td className="w-1"></td>
                  <td className="w-1"></td>
                  <td className="w-1">
                    {getPreviousCounter(
                      detail.apartmentNo,
                      consumptionList[0].details
                    )}
                  </td>
                  <td className="w-1">{detail.counter}</td>
                  <td className="w-1">{detail.consumptionKwh}</td>
                  <td className="w-1">{consumption.isinmaGideriBirimFiyat}</td>
                  <td className="w-1">{detail.heatingExpense}</td>
                </tr>
              </table>
            </div>
          </div>
          <div className="grid">
            <div className="col">
              <table className="w-full">
                <tr className="dark-gray">
                  <th colSpan={7} className="text-left	">
                    DÖNEM BİLGİLERİ
                  </th>
                </tr>
                <tr>
                  <td className="w-1 gray">DÖNEM</td>
                  <td className="w-1">{consumption.month}</td>
                  <td className="w-1 gray">SON ÖDEME</td>
                  <td className="w-1">{"sonOdemeTarihi"}</td>
                  <td className="w-1 gray">BÖLGE</td>
                  <td className="w-1">{consumption.coefficient}</td>
                </tr>
                <tr>
                  <td className="w-1 gray">İLK OKUMA</td>
                  <td className="w-1"></td>
                  <td className="w-1 gray">SON OKUMA</td>
                  <td className="w-1"></td>
                  <td className="w-1 gray">TOP.TÜKETİM</td>
                  <td className="w-1">{consumption.yakitFaturasi}</td>
                </tr>
                <tr>
                  <td className="w-1 gray">FATURA TARİHİ</td>
                  <td className="w-1">{"faturaTarihi"}</td>
                  <td className="w-1 gray">YAK.FATURASI</td>
                  <td className="w-1">{consumption.yakitFaturasi}</td>
                  <td className="w-1 gray">ORT.TÜKETİM</td>
                  <td className="w-1"></td>
                </tr>
                <tr>
                  <td className="w-1 gray">KAPALI ALAN</td>
                  <td className="w-1">{constants.totalClosedArea}</td>
                  <td className="w-1 gray">ORTAK KULLANIM</td>
                  <td className="w-1">{consumption.ortakKullanim}</td>
                  <td className="w-1 gray"></td>
                  <td className="w-1"></td>
                </tr>
              </table>
            </div>
          </div>
          <Message
            severity="secondary"
            text={
              detail.manipulation > 0
                ? "Isınma tüketiminiz 15C derece şartını sağlamadığı için faturanıza ilgili yönetmelik gereği fark ücreti ilave edilmiştir."
                : ""
            }
          />
        </div>
      </div>
    </>
  );
};
