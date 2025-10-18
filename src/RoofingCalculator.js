import React, { useState, useMemo } from "react";
import { Calculator } from "lucide-react";

export default function RoofingCalculator() {
  // --- States ---
  const [m2OnRoof, setM2OnRoof] = useState(0);
  const [skylights, setSkylights] = useState(0);
  const [meterBlik, setMeterBlik] = useState(0);
  const [meterRygning, setMeterRygning] = useState(0);
  const [gas, setGas] = useState(0);
  const [overPapType, setOverPapType] = useState("1x5");
  const [underPapType, setUnderPapType] = useState("1x7");
  const [useUnderPap, setUseUnderPap] = useState(true);
  const [useInddaekning, setUseInddaekning] = useState(false);
  const [smallOverPapType, setSmallOverPapType] = useState("0.33x10");
  const [smallOverPapQty, setSmallOverPapQty] = useState(0);
  const [smallUnderPapType, setSmallUnderPapType] = useState("0.33x10");
  const [smallUnderPapQty, setSmallUnderPapQty] = useState(0);
  const [kilometer, setKilometer] = useState(0);
  const [useDiscount, setUseDiscount] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);

  // --- Priser (Indkøb) og Faste Satser er de samme ---
  const M2_ARBEJDE_PRICE = 175;
  const SKYLIGHT_PRICE = 1000;
  const BLIK_PRICE = 85;
  const RYGNING_PRICE = 310;
  const MILJOTILLAEG = 350; // FAST SKJULT TILLÆG
  const GAS_PRICE = 650;
  const KILOMETER_PRICE = 4; // PRIS PR. KILOMETER

  const underPapOptions = {
    "1x7": { price: 387, coverage: 7, name: "SOPRAROCK PF/GF 3500 SBS - 1x7" },
    "1x10": {
      price: 523,
      coverage: 10,
      name: "SOPRAROCK PF/GF 3500 SBS - 1x10",
    },
  };

  const smallUnderPapOptions = {
    "0.33x10": {
      price: 181,
      coverage: 3.3,
      name: "SOPRAROCK PF/GF 3500 SBS - 0,33x10",
    },
    "0.25x10": {
      price: 137,
      coverage: 2.5,
      name: "SOPRAROCK PF/GF 3500 SBS - 0,25x10",
    },
  };

  const overPapOptions = {
    "1x5": {
      price: 363,
      coverage: 5,
      name: "SOPRALENE PF 5000 SBS U/KK - 1x5",
    },
    "1x7": {
      price: 483,
      coverage: 7,
      name: "SOPRALENE PF 5000 SBS U/KK - 1x7",
    },
    "1x10": {
      price: 688,
      coverage: 10,
      name: "SOPRALENE PF 5000 SBS U/KK - 1x10",
    },
  };

  const smallOverPapOptions = {
    "0.33x10": {
      price: 236,
      coverage: 3.3,
      name: "SOPRALENE PF 5000 SBS - 0,33x10",
    },
    "0.25x10": {
      price: 179,
      coverage: 2.5,
      name: "SOPRALENE PF 5000 SBS - 0,25x10",
    },
  };

  // --- Beregninger (Calculations er de samme) ---
  const calculations = useMemo(() => {
    const safeM2OnRoof = Number(m2OnRoof) || 0;
    const safeSkylights = Number(skylights) || 0;
    const safeMeterBlik = Number(meterBlik) || 0;
    const safeMeterRygning = Number(meterRygning) || 0;
    const safeGas = Number(gas) || 0;
    const safeSmallOverPapQty = Number(smallOverPapQty) || 0;
    const safeSmallUnderPapQty = Number(smallUnderPapQty) || 0;
    const safeKilometer = Number(kilometer) || 0;
    const safeDiscountPercent = Number(discountPercent) || 0;

    const m2WithWaste = safeM2OnRoof * 1.15;
    const underPapRolls = useUnderPap
      ? Math.ceil(m2WithWaste / underPapOptions[underPapType].coverage)
      : 0;
    const overPapRolls = Math.ceil(
      m2WithWaste / overPapOptions[overPapType].coverage
    );
    const activeSmallUnderPapQty = useInddaekning ? safeSmallUnderPapQty : 0;
    const activeSmallOverPapQty = useInddaekning ? safeSmallOverPapQty : 0;

    const underPapCost = useUnderPap
      ? underPapRolls * underPapOptions[underPapType].price
      : 0;
    const overPapCost = overPapRolls * overPapOptions[overPapType].price;
    const smallUnderPapCost = useInddaekning
      ? activeSmallUnderPapQty * smallUnderPapOptions[smallUnderPapType].price
      : 0;
    const smallOverPapCost = useInddaekning
      ? activeSmallOverPapQty * smallOverPapOptions[smallOverPapType].price
      : 0;
    const blikCost = safeMeterBlik * BLIK_PRICE;
    const gasCost = safeGas * GAS_PRICE;

    const totalMaterialCost =
      underPapCost +
      overPapCost +
      smallUnderPapCost +
      smallOverPapCost +
      blikCost +
      gasCost;

    const m2LabourCost = safeM2OnRoof * M2_ARBEJDE_PRICE;
    const skylightCost = safeSkylights * SKYLIGHT_PRICE;
    const rygningCost = safeMeterRygning * RYGNING_PRICE;

    const totalM2Cost = m2LabourCost + skylightCost + rygningCost;
    const totalMiljoCost = MILJOTILLAEG;
    const totalKorselCost = safeKilometer * KILOMETER_PRICE;

    const totalMaterialUdlægCost =
      totalMaterialCost + totalMiljoCost + totalKorselCost;

    const totalQuoteBeforeDiscount = totalM2Cost + totalMaterialUdlægCost;

    let discountAmount = 0;
    let safeDiscountPercentCapped = 0;

    if (useDiscount) {
      safeDiscountPercentCapped = Math.min(
        100,
        Math.max(0, safeDiscountPercent)
      );
      discountAmount =
        totalQuoteBeforeDiscount * (safeDiscountPercentCapped / 100);
    }

    const totalQuote = totalQuoteBeforeDiscount - discountAmount;

    return {
      m2WithWaste: m2WithWaste.toFixed(2),
      totalQuote,
      totalQuoteBeforeDiscount,
      discountAmount,
      safeDiscountPercentCapped,
      m2LabourCost,
      skylightCost,
      rygningCost,
      totalM2Cost,
      totalMaterialCost,
      totalMiljoCost,
      totalKorselCost,
      totalMaterialUdlægCost,
    };
  }, [
    m2OnRoof,
    skylights,
    meterBlik,
    meterRygning,
    gas,
    overPapType,
    underPapType,
    useUnderPap,
    useInddaekning,
    smallOverPapType,
    smallOverPapQty,
    smallUnderPapType,
    smallUnderPapQty,
    kilometer,
    useDiscount,
    discountPercent,
  ]);

  const handleNumberChange = (setter) => (e) => {
    setter(e.target.value === "" ? 0 : Number(e.target.value));
  };

  // --- Tailwind klasser (Ens for alle input/select) ---
  // Bruger neutral standard styling
  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  // Read-only feltet får en let grå baggrund for at markere, at det ikke kan redigeres.
  const readOnlyClass =
    "w-full rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 bg-gray-100 cursor-default";

  // --- Render (Brugerflade) ---
  return (
    <div className="min-h-screen bg-gray-100 p-20">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-3xl p-16">
        <div className="flex items-center gap-6 mb-16 border-b-4 border-blue-200 pb-8">
          <Calculator className="w-14 h-14 text-blue-700" />
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Listetag Tilbudsberegner
            </h1>
            <p className="text-xl text-gray-600">
              Beregn prisen for tagpap (0-25 Grader)
            </p>
          </div>
        </div>

        {/* Input Section - Standard grid gap-y-8 og minimal label margin (mb-1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-16 bg-blue-50 p-12 rounded-2xl shadow-inner border border-blue-100">
          {/* Række 1 */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-1">
              M2 på tag:
            </label>
            <input
              type="number"
              value={m2OnRoof === 0 ? "" : m2OnRoof}
              onChange={handleNumberChange(setM2OnRoof)}
              className={inputClass}
              min="0"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-1">
              M2 med 15% spild:
            </label>
            <input
              type="text"
              value={calculations.m2WithWaste}
              readOnly
              className={readOnlyClass}
            />
          </div>

          {/* Række 2 */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-1">
              Antal ovenlysvinduer:
            </label>
            <input
              type="number"
              value={skylights === 0 ? "" : skylights}
              onChange={handleNumberChange(setSkylights)}
              className={inputClass}
              min="0"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-1">
              Antal meter blik:
            </label>
            <input
              type="number"
              value={meterBlik === 0 ? "" : meterBlik}
              onChange={handleNumberChange(setMeterBlik)}
              className={inputClass}
              min="0"
            />
          </div>

          {/* Række 3 */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-1">
              Rygningsudluftning meter:
            </label>
            <input
              type="number"
              value={meterRygning === 0 ? "" : meterRygning}
              onChange={handleNumberChange(setMeterRygning)}
              className={inputClass}
              min="0"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-1">
              Gas:
            </label>
            <input
              type="number"
              value={gas === 0 ? "" : gas}
              onChange={handleNumberChange(setGas)}
              className={inputClass}
              min="0"
            />
          </div>

          {/* Række 4 */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-1">
              Kørsel (Antal km tur/retur):
            </label>
            <input
              type="number"
              value={kilometer === 0 ? "" : kilometer}
              onChange={handleNumberChange(setKilometer)}
              className={inputClass}
              min="0"
            />
          </div>

          {/* Række 5: Underpap Option */}
          <div className="md:col-span-2">
            <label className="block text-lg font-semibold text-gray-700 mb-1">
              Brug underpap:
            </label>
            <select
              value={useUnderPap ? "yes" : "no"}
              onChange={(e) => setUseUnderPap(e.target.value === "yes")}
              className={inputClass}
            >
              <option value="yes">Ja</option>
              <option value="no">Nej</option>
            </select>
          </div>

          {/* Række 6: Pap typer */}
          {useUnderPap && (
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-1">
                Underpap type:
              </label>
              <select
                value={underPapType}
                onChange={(e) => setUnderPapType(e.target.value)}
                className={inputClass}
              >
                <option value="1x7">{underPapOptions["1x7"].name}</option>
                <option value="1x10">{underPapOptions["1x10"].name}</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-1">
              Overpap type:
            </label>
            <select
              value={overPapType}
              onChange={(e) => setOverPapType(e.target.value)}
              className={inputClass}
            >
              <option value="1x5">{overPapOptions["1x5"].name}</option>
              <option value="1x7">{overPapOptions["1x7"].name}</option>
              <option value="1x10">{overPapOptions["1x10"].name}</option>
            </select>
          </div>

          {/* Række 7: Inddækning Option */}
          <div className="md:col-span-2">
            <label className="block text-lg font-semibold text-gray-700 mb-1">
              Brug inddækning:
            </label>
            <select
              value={useInddaekning ? "yes" : "no"}
              onChange={(e) => setUseInddaekning(e.target.value === "yes")}
              className={inputClass}
            >
              <option value="no">Nej</option>
              <option value="yes">Ja</option>
            </select>
          </div>

          {/* Række 8 & 9: Inddækning detaljer (Kun hvis brugt) */}
          {useInddaekning && (
            <>
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-1">
                  Inddækning underpap type:
                </label>
                <select
                  value={smallUnderPapType}
                  onChange={(e) => setSmallUnderPapType(e.target.value)}
                  className={inputClass}
                >
                  <option value="0.33x10">
                    {smallUnderPapOptions["0.33x10"].name}
                  </option>
                  <option value="0.25x10">
                    {smallUnderPapOptions["0.25x10"].name}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-1">
                  Inddækning underpap antal:
                </label>
                <input
                  type="number"
                  value={smallUnderPapQty === 0 ? "" : smallUnderPapQty}
                  onChange={handleNumberChange(setSmallUnderPapQty)}
                  className={inputClass}
                  min="0"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-1">
                  Inddækning overpap type:
                </label>
                <select
                  value={smallOverPapType}
                  onChange={(e) => setSmallOverPapType(e.target.value)}
                  className={inputClass}
                >
                  <option value="0.33x10">
                    {smallOverPapOptions["0.33x10"].name}
                  </option>
                  <option value="0.25x10">
                    {smallOverPapOptions["0.25x10"].name}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-1">
                  Inddækning overpap antal:
                </label>
                <input
                  type="number"
                  value={smallOverPapQty === 0 ? "" : smallOverPapQty}
                  onChange={handleNumberChange(setSmallOverPapQty)}
                  className={inputClass}
                  min="0"
                />
              </div>
            </>
          )}

          {/* Rabat/Discount Indstillinger */}
          <div className="md:col-span-2 flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <label className="text-lg font-semibold text-gray-700">
                Anvend rabat:
              </label>
              <select
                value={useDiscount ? "yes" : "no"}
                onChange={(e) => setUseDiscount(e.target.value === "yes")}
                className={inputClass}
                style={{ width: "auto" }} // Overskriver w-full for et lille felt
              >
                <option value="no">Slået fra</option>
                <option value="yes">Slået til</option>
              </select>
            </div>

            {useDiscount && (
              <div className="w-1/2 ml-4">
                <label className="block text-lg font-semibold text-gray-700 mb-1">
                  Rabat i % (0-100):
                </label>
                <input
                  type="number"
                  value={discountPercent === 0 ? "" : discountPercent}
                  onChange={handleNumberChange(setDiscountPercent)}
                  className={
                    inputClass + " border-red-500 text-red-700 font-bold"
                  }
                  min="0"
                  max="100"
                />
              </div>
            )}
          </div>
        </div>

        {/* --- Separator (Lang Streg) --- */}
        <div className="mb-16 border-b-8 border-gray-400 rounded-full"></div>

        {/* --- Cost Breakdown / Detaljeret Opsummering --- */}
        <div className="bg-gray-50 rounded-2xl p-12 shadow-2xl">
          {/* Sektion 1: Arbejde */}
          <div className="mb-12 p-8 rounded-2xl shadow-xl bg-blue-100 border-l-8 border-blue-600">
            <h3 className="text-3xl font-bold text-blue-800 mb-8 border-b-2 border-blue-300 pb-4">
              1. Arbejde
            </h3>
            <div className="space-y-8 text-xl">
              <div className="flex justify-between">
                <span className="text-gray-700">
                  Arbejdsløn ({m2OnRoof} m²):
                </span>
                <span className="text-gray-900 font-semibold">
                  kr{" "}
                  {calculations.m2LabourCost.toLocaleString("da-DK", {
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">
                  Ovenlysvinduer ({skylights}):
                </span>
                <span className="text-gray-900 font-semibold">
                  kr{" "}
                  {calculations.skylightCost.toLocaleString("da-DK", {
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">
                  Rygningsudluftning ({meterRygning} m):
                </span>
                <span className="text-gray-900 font-semibold">
                  kr{" "}
                  {calculations.rygningCost.toLocaleString("da-DK", {
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
            <div className="flex justify-between pt-8 mt-8 border-t-4 border-blue-400 font-bold text-3xl">
              <span className="text-blue-800">Subtotal Arbejde:</span>
              <span className="text-blue-800">
                kr{" "}
                {calculations.totalM2Cost.toLocaleString("da-DK", {
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>

          {/* Sektion 2: Materialer + Kørsel */}
          <div className="mb-12 p-8 rounded-2xl shadow-xl bg-red-100 border-l-8 border-red-600">
            <h3 className="text-3xl font-bold text-red-800 mb-8 border-b-2 border-red-300 pb-4">
              2. Materialer + Kørsel
            </h3>

            <div className="space-y-8 text-xl pt-2">
              <div className="flex justify-between">
                <span className="text-gray-700">
                  Materialer (Pap, Blik, Gas):
                </span>
                <span className="text-gray-900 font-semibold">
                  kr{" "}
                  {calculations.totalMaterialCost.toLocaleString("da-DK", {
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Miljøtillæg (Fast pris):</span>
                <span className="text-gray-900 font-semibold">
                  kr{" "}
                  {calculations.totalMiljoCost.toLocaleString("da-DK", {
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Kørsel ({kilometer} km):</span>
                <span className="text-gray-900 font-semibold">
                  kr{" "}
                  {calculations.totalKorselCost.toLocaleString("da-DK", {
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-8 mt-8 border-t-4 border-red-400 font-bold text-3xl">
              <span className="text-red-800">
                Subtotal Materialer + Kørsel:
              </span>
              <span className="text-red-800">
                kr{" "}
                {calculations.totalMaterialUdlægCost.toLocaleString("da-DK", {
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>

          {/* Sektion 3: Rabatjustering og Mellemtotal */}
          <div className="mb-16 p-8 rounded-2xl shadow-xl bg-yellow-100 border-l-8 border-yellow-600">
            <h3 className="text-3xl font-bold text-yellow-800 mb-8 border-b-2 border-yellow-300 pb-4">
              3. Rabatjustering
            </h3>

            <div className="flex justify-between pb-6 mb-6 border-y-4 border-yellow-400 py-6">
              <span className="font-semibold text-2xl text-gray-800">
                Pris før rabat:
              </span>
              <span className="font-semibold text-2xl text-gray-800">
                kr{" "}
                {calculations.totalQuoteBeforeDiscount.toLocaleString("da-DK", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>

            {/* Rabat fratrækkes (Kun synlig, hvis rabat er i brug) */}
            {calculations.discountAmount > 0 && (
              <div className="flex justify-between pb-6 mb-6 border-b-4 border-yellow-400">
                <span className="font-semibold text-2xl text-red-700">
                  Fratrukket rabat ({calculations.safeDiscountPercentCapped}%):
                </span>
                <span className="font-semibold text-2xl text-red-700">
                  - kr{" "}
                  {calculations.discountAmount.toLocaleString("da-DK", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            )}

            {/* Subtotal efter rabat (hvis der er rabat) */}
            {calculations.discountAmount > 0 && (
              <div className="flex justify-between pt-4">
                <span className="font-bold text-3xl text-yellow-800">
                  Subtotal (efter rabat):
                </span>
                <span className="font-bold text-3xl text-yellow-800">
                  kr{" "}
                  {(
                    calculations.totalQuoteBeforeDiscount -
                    calculations.discountAmount
                  ).toLocaleString("da-DK", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Endelig Totalpris - GRØN BOKS (Står nu alene med kun "Pris" som overskrift) */}
          <div className="p-10 border-8 border-green-600 bg-green-100 rounded-2xl shadow-3xl text-center">
            <span className="font-bold text-4xl text-green-900 block mb-4">
              Pris:
            </span>
            <span className="font-extrabold text-7xl text-green-900 block">
              kr{" "}
              {calculations.totalQuote.toLocaleString("da-DK", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
