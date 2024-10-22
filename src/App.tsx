import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as firestore from "firebase/firestore";
import { InputNumber } from "primereact/inputnumber";
import * as app from "firebase/app";
import { db } from "./firebaseConfig";
import { Constants } from "./interfaces/Constants";
import { Consumption } from "./interfaces/Consumption";
import { Button } from "primereact/button";
import {
  calculateCommonUseAmountForAnApartment,
  calculateEnergyForAnApartment,
  calculateEnergyForOneSquareMeter,
  calculateHeatingExpense,
  getArea,
  getCommonUsePrice,
  getCommonUseUnitPrice,
  getConsumptionAverage,
  getConsumptionKwh,
  getHeatingExpenseUnitPrice,
  getParam,
  getPreviousCounter,
  getTotalConsumptionAmountKwh,
  hasManipulation,
  sum,
} from "./util";
import { IDetail } from "./interfaces/Detail";
import { Fatura } from "./Fatura";
import { Dialog } from "primereact/dialog";
import * as $ from "jquery";
import { useApp } from "./useApp";

function App() {
  const { getDocById } = useApp();

  const [consumptionList, setConsumptionList] = useState([] as Consumption[]);
  const [newConsumption, setNewConsumption] = useState({
    details: [] as IDetail[],
  } as Consumption);
  const consumptionsRef = firestore.collection(db, "consumptions");
  const [constants, setConstants] = useState({} as Constants);
  const [visible, setVisible] = useState(false);
  const [createdFatura, setCreatedFatura] = useState(false);
  const [faturaConsumption, setFaturaConsumption] = useState<Consumption>({
    details: [] as IDetail[],
  } as Consumption);

  useEffect(() => {
    const unsubscribe2 = getConstants(
      (querySnapshot: any) => {
        const list = querySnapshot.docs.map((docSnapshot: any) => {
          return Object.assign(docSnapshot.data(), { id: docSnapshot.id });
        });
        setConstants(list[0]);
      },
      (error: any) => {
        console.error(error);
      }
    );

    init();
  }, []);

  const init = async () => {
    await getConsumptions();
    const doc = (await getDocById(getParam("id"))) as Consumption;
    setFaturaConsumption(doc);
  };

  const getConstants = (snapshot: any, error: any) => {
    const itemsColRef = firestore.collection(db, "constants");
    const itemsQuery = firestore.query(itemsColRef);
    return firestore.onSnapshot(itemsQuery, snapshot, error);
  };

  const getConsumptions = async () => {
    // Create a query against the collection.
    const querySnapshot = await firestore.getDocs(consumptionsRef);
    let tmp: Consumption[] = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      tmp.push(doc.data() as Consumption);
    });
    setConsumptionList(tmp);
    const temp: Consumption = JSON.parse(JSON.stringify(tmp[0])) as Consumption;
    setNewConsumption({ ...newConsumption, ...temp });
  };

  const addDoc2 = async () => {
    try {
      const docRef = await firestore.addDoc(consumptionsRef, newConsumption);
      // await firestore.setDoc(firestore.doc(consumptionsRef, "1"), {
      //   month: 8,
      //   index: 0,
      //   details: getDetails(),
      // });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const hesapla = () => {
    newConsumption.ortakKullanimBirimFiyat = getCommonUseUnitPrice(
      newConsumption.yakitFaturasi,
      constants.totalClosedArea
    );

    newConsumption.ortakKullanim = getCommonUsePrice(
      newConsumption.yakitFaturasi
    );

    newConsumption.details.forEach((detail: IDetail) => {
      detail.consumptionKwh = getConsumptionKwh(
        detail,
        consumptionList[0].details
      );
    });

    newConsumption.toplamTuketimKwh = getTotalConsumptionAmountKwh(
      newConsumption.details,
      consumptionList[0].details
    );

    newConsumption.details.forEach((detail: IDetail) => {
      detail.manipulation = hasManipulation(
        detail,
        consumptionList[0].details,
        constants,
        newConsumption
      );
    });

    newConsumption.toplamManipulationKwh = sum(
      newConsumption.details.map((detail: IDetail) => detail.manipulation)
    );

    newConsumption.isinmaGideriBirimFiyat = getHeatingExpenseUnitPrice(
      newConsumption.yakitFaturasi,
      sum(newConsumption.details.map((detail: IDetail) => detail.manipulation)),
      newConsumption.toplamTuketimKwh
    );

    newConsumption.details.forEach((detail: IDetail) => {
      detail.commonUseAmount = calculateCommonUseAmountForAnApartment(
        getArea(detail.apartmentNo, constants),
        newConsumption.yakitFaturasi,
        constants.totalClosedArea
      );

      detail.heatingExpense = calculateHeatingExpense(
        newConsumption.isinmaGideriBirimFiyat,
        detail
      );

      detail.amount = Number(
        (detail.commonUseAmount + detail.heatingExpense).toFixed(2)
      );
    });

    setNewConsumption((current: Consumption) => ({
      ...current,
      ...newConsumption,
    }));
  };

  const printDiv = (divId: string, title: string) => {
    let mywindow = window.open(
      "",
      "PRINT",
      "height=650,width=900,top=100,left=150"
    ) as any;

    mywindow.document.write(`<html><head><title>${title}</title>`);
    mywindow.document.write("</head><body >");
    mywindow.document.write(document.getElementById(divId)?.innerHTML);
    mywindow.document.write("</body></html>");

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
  };

  const getFaturaContent = () => {
    return (
      <>
        <div id="myDivToPrint">
          {getParam("fatura") &&
            faturaConsumption.details.map((detail: IDetail) => {
              return (
                <Fatura
                  detail={detail}
                  consumption={faturaConsumption}
                  constants={constants}
                  consumptionList={consumptionList}
                />
              );
            })}
          <button
            onClick={() => {
              // printDiv("myDivToPrint", "");
              const url = "somesite.com?data=yourDataToSend";
              window.open(url, "_blank");
            }}
          >
            PRINT
          </button>
        </div>
      </>
    );
  };

  const getTableHeaders = () => (
    <div className="grid">
      <div className="col">
        <div className="text-center p-3 border-round-sm font-bold">
          Daire No
        </div>
      </div>
      <div className="col">
        <div className="text-center p-3 border-round-sm font-bold">m2</div>
      </div>
      <div className="col">
        <div className="text-center p-3 border-round-sm font-bold ">
          İlk Endeks
        </div>
      </div>
      <div className="col">
        <div className="text-center p-3 border-round-sm font-bold ">
          Son Endeks
        </div>
      </div>
      <div className="col">
        <div className="text-center p-3 border-round-sm font-bold ">
          Sayaç Tüketim Kwh
        </div>
      </div>
      <div className="col">
        <div className="text-center p-3 border-round-sm font-bold ">
          15C ısıtılması için gerekli Kwh
        </div>
      </div>
      <div className="col">
        <div className="text-center p-3 border-round-sm font-bold ">
          Ceza Kwh
        </div>
      </div>
      <div className="col">
        <div className="text-center p-3 border-round-sm font-bold ">
          Ortak Kullanım
        </div>
      </div>
      <div className="col">
        <div className="text-center p-3 border-round-sm font-bold ">
          Isınma Gideri
        </div>
      </div>
      <div className="col">
        <div className="text-center p-3 border-round-sm font-bold ">
          Ödenecek Tutar
        </div>
      </div>
    </div>
  );

  const keyValue = (key: string, value: number) => (
    <div className="field grid">
      <div className="col-1">{key}</div>
      <div className="col-1">
        <InputNumber className="h-2rem" value={value}></InputNumber>
      </div>
    </div>
  );

  const getDetails = () => {
    return Array.from(Array(5).keys())
      .map((x) => x + 1)
      .map((idx: number) => {
        return { amount: 0, apartmentNo: idx, counter: 0 };
      });
  };

  if (getParam("fatura") && newConsumption.details.length > 0) {
    return getFaturaContent();
  }

  return (
    <div className="App">
      <button
        onClick={async () => {
          await firestore.setDoc(firestore.doc(consumptionsRef, "2"), {
            month: 9,
            index: 1,
            details: getDetails(),
          });
        }}
      >
        add
      </button>
      <div className="grid">
        <div className="col-1">
          <InputNumber
            className="h-2rem"
            onValueChange={(e) =>
              setNewConsumption((current: Consumption) => ({
                ...current,
                yakitFaturasi: Number(e.value),
              }))
            }
            placeholder="Yakıt Faturası"
          />
        </div>

        <div className="col-1">
          <InputNumber
            className="h-2rem"
            value={newConsumption.toplamTuketimKwh}
            onValueChange={
              (e) => {}
              // setNewConsumption((current: Consumption) => ({
              //   ...current,
              //   toplamTuketimKwh: Number(e.value),
              // }))
            }
            placeholder="ToplamTuketimKwh"
          />
        </div>
        <div className="col-1">
          <InputNumber
            className="h-2rem"
            value={newConsumption.toplamManipulationKwh}
            onValueChange={
              (e) => {}
              // setNewConsumption((current: Consumption) => ({
              //   ...current,
              //   toplamTuketimKwh: Number(e.value),
              // }))
            }
            placeholder="ToplamTuketimKwh"
          />
        </div>
      </div>
      {getTableHeaders()}
      {newConsumption.details?.map((m: IDetail, index) => (
        <div className="grid">
          <div className="col">
            <div className="text-center p-3 border-round-sm font-bold">
              {m.apartmentNo}
            </div>
          </div>
          <div className="col">
            <div className="text-center p-3 border-round-sm font-bold">
              {getArea(m.apartmentNo, constants)}
            </div>
          </div>
          <div className="col">
            <div className="text-center p-3 border-round-sm font-bold ">
              {getPreviousCounter(m.apartmentNo, consumptionList[0].details)}
            </div>
          </div>
          <div className="col">
            <div className="text-center p-3 border-round-sm font-bold ">
              <InputNumber
                className="h-2rem"
                value={m.counter}
                onValueChange={(e) => {
                  newConsumption.details[index].counter = e.value as number;

                  setNewConsumption((current: Consumption) => ({
                    ...current,
                    ...newConsumption,
                  }));
                }}
              />
            </div>
          </div>
          <div className="col">
            <div className="text-center p-3 border-round-sm font-bold ">
              {m.consumptionKwh}
            </div>
          </div>
          <div className="col">
            <div className="text-center p-3 border-round-sm font-bold ">
              {calculateEnergyForAnApartment(
                getArea(m.apartmentNo, constants),
                constants.coefficients["ekim"],
                newConsumption.toplamTuketimKwh,
                constants.totalClosedArea
              )}
            </div>
          </div>
          <div className="col">
            <div className="text-center p-3 border-round-sm font-bold ">
              {m.manipulation}
            </div>
          </div>
          <div className="col">
            <div className="text-center p-3 border-round-sm font-bold ">
              {m.commonUseAmount}
            </div>
          </div>
          <div className="col">
            <div className="text-center p-3 border-round-sm font-bold ">
              {m.heatingExpense}
            </div>
          </div>
          <div className="col">
            <div className="text-center p-3 border-round-sm font-bold ">
              {m.amount}
            </div>
          </div>
        </div>
      ))}
      <Button label="hesapla" onClick={hesapla} />
      <Button label="Submit" onClick={addDoc2} />
      <Button
        label="Fatura Göster"
        icon="pi pi-external-link"
        onClick={() => {
          // setVisible(true);
          setCreatedFatura(true);

          const url =
            "http://localhost:3000?fatura=yourDataToSend&id=xg8136BK1egpFJzS0NHF";
          window.open(url, "_blank");
        }}
      />

      {keyValue("Ortak Kullanım", newConsumption.ortakKullanim)}

      {keyValue(
        "Ortak Kullanım Birim Fiyat",
        newConsumption.ortakKullanimBirimFiyat
      )}

      {constants.coefficients &&
        keyValue(
          "Isınma Gideri Birim Fiyat",
          newConsumption.isinmaGideriBirimFiyat
        )}

      {constants.coefficients &&
        keyValue(
          "1m2 nin 15C ısıtılması için gerekli enerji miktarı",
          calculateEnergyForOneSquareMeter(
            constants.coefficients["ekim"],
            newConsumption.toplamTuketimKwh,
            constants.totalClosedArea
          )
        )}

      <Dialog
        header="Header"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <p className="m-0">{getFaturaContent()}</p>
      </Dialog>
    </div>
  );
}

export default App;
