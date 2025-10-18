import React, { useState, useMemo } from "react";
import "./styles.css";

// --- DATA: Priser og Opskrifter (Simulerede data) ---
const PRIS_DATA = [
  // Overpap (Priser fra din 20% avance kolonne)
  {
    Varenummer: 53310,
    Beskrivelse: "SOPRALENE PF 5000 SBS - 1x5",
    Uddybbende: "Overpap med KK",
    m2_pr_enhed: 5,
    Pris_20_avance: 362.88,
  },
  {
    Varenummer: 51747,
    Beskrivelse: "SOPRALENE PF 5000 SBS - 1x8",
    Uddybbende: "Overpap med KK",
    m2_pr_enhed: 8,
    Pris_20_avance: 550.8,
  },
  // Underpap
  {
    Varenummer: 18913,
    Beskrivelse: "SOPRAROCK PF/GF 3500 SBS - 1x7",
    Uddybbende: "Underpap",
    m2_pr_enhed: 7,
    Pris_20_avance: 302.4,
  },
  // Blik/Andet materiale
  {
    Varenummer: 101,
    Beskrivelse: "Tagfod pr m",
    Uddybbende: "Andet materiale",
    m2_pr_enhed: 1,
    Pris_20_avance: 57.6,
  },
  {
    Varenummer: 102,
    Beskrivelse: "Vindskede pr m",
    Uddybbende: "Andet materiale",
    m2_pr_enhed: 1,
    Pris_20_avance: 70.8,
  },
];

const TAG_OPPSKRIFTER = {
  "Pris pr m2 0-25*": [
    { Varenummer: 53310, Type: "Overpap", Forbrug_faktor: 1.1 },
    { Varenummer: 18913, Type: "Underpap", Forbrug_faktor: 1.1 },
  ],
  "Pris pr m2 0-25* (1 Lag)": [
    { Varenummer: 53310, Type: "Overpap", Forbrug_faktor: 1.1 },
  ],
};

const FAST_TILLÆG = 350; // Miljøtillæg
const MOMS_FAKTOR = 1.25;

// Hjælpefunktion for at sikre, at et tal er et endeligt tal (ikke NaN, Infinity, etc.)
const ensureFinite = (num) => {
  return Number.isFinite(num) ? num : 0;
};

function App() {
  const [arbejdstype, setArbejdstype] = useState("Pris pr m2 0-25*");
  const [tagAreal, setTagAreal] = useState("");
  const [meterBlik, setMeterBlik] = useState("");
  let subtotalMaterialer = 0; // Gemmer subtotalen her for at kunne opdatere den fra begge listegeneratorer

  // Udfører beregningen sikkert
  const beregnResultat = useMemo(() => {
    // SIKKERHEDS-PARSING
    const areal = parseFloat(tagAreal) || 0;
    const blik = parseFloat(meterBlik) || 0;
    const opskrift = TAG_OPPSKRIFTER[arbejdstype];

    subtotalMaterialer = 0; // Nulstil ved ny beregning

    // 1. BEREGN TAGFLADEMATERIALER (BRUG MAP/FILTER FOR SIKKERHED)
    const tagMaterials =
      opskrift && areal > 0
        ? opskrift
            .map((vareOppskrift) => {
              const prisInfo = PRIS_DATA.find(
                (p) => p.Varenummer === vareOppskrift.Varenummer
              );

              if (!prisInfo || prisInfo.m2_pr_enhed === 0) return null;

              const antalEnhederFloat =
                (areal * vareOppskrift.Forbrug_faktor) / prisInfo.m2_pr_enhed;
              const Antal = Math.ceil(antalEnhederFloat);
              const Total = ensureFinite(Antal * prisInfo.Pris_20_avance);

              // OPPDATER SAMLET TOTAL
              subtotalMaterialer += Total;

              return {
                Vare: prisInfo.Beskrivelse,
                Antal: Antal,
                Enhed: "rulle",
                Pris: prisInfo.Pris_20_avance,
                Total: Total,
              };
            })
            .filter((item) => item !== null)
        : []; // Fjerner garanteret alle null/undefined fra listen

    // 2. BEREGN BLIK-MATERIALER (BRUG MAP/FILTER FOR SIKKERHED)
    const blikMaterials =
      blik > 0
        ? [101, 102]
            .map((varenummer) => {
              const prisInfo = PRIS_DATA.find(
                (p) => p.Varenummer === varenummer
              );

              if (!prisInfo) return null;

              const Total = ensureFinite(blik * prisInfo.Pris_20_avance);
              // OPPDATER SAMLET TOTAL
              subtotalMaterialer += Total;

              return {
                Vare: prisInfo.Beskrivelse,
                Antal: blik,
                Enhed: "m",
                Pris: prisInfo.Pris_20_avance,
                Total: Total,
              };
            })
            .filter((item) => item !== null)
        : []; // Fjerner garanteret alle null/undefined fra listen

    // KOMBINER LISTER
    const materialeliste = [...tagMaterials, ...blikMaterials];

    // 3. Totalsum
    const finalSubtotalMaterialer = ensureFinite(subtotalMaterialer);
    const subtotalInklTillæg = finalSubtotalMaterialer + FAST_TILLÆG;
    const totalPrisInklMoms = ensureFinite(subtotalInklTillæg * MOMS_FAKTOR);

    return {
      materialeliste,
      subtotalMaterialer: finalSubtotalMaterialer,
      subtotalInklTillæg: ensureFinite(subtotalInklTillæg),
      totalPrisInklMoms: totalPrisInklMoms,
    };
  }, [arbejdstype, tagAreal, meterBlik]);

  // --- RENDERING AF KOMPONENTEN ---
  return (
    <div className="beregner-container">
      <h1>Tagberegner (0-25 grader)</h1>
      <div className="input-group">
        <label>
          Vælg Tagtype (Arbejdstype):
          <select
            value={arbejdstype}
            onChange={(e) => setArbejdstype(e.target.value)}
          >
            {Object.keys(TAG_OPPSKRIFTER).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="input-group">
        <label>
          Tagareal i M2:
          <input
            type="number"
            value={tagAreal}
            onChange={(e) => setTagAreal(e.target.value)}
          />
        </label>
      </div>

      <div className="input-group">
        <label>
          Blik i meter (Tagfod/Vindskede):
          <input
            type="number"
            value={meterBlik}
            onChange={(e) => setMeterBlik(e.target.value)}
          />
        </label>
      </div>

      <hr />

      <h2>Resultat</h2>
      <table>
        <thead>
          <tr>
            <th>Vare</th>
            <th>Antal</th>
            <th>Enhed</th>
            <th>Pris (20% avance)</th>
            <th>Linje Total</th>
          </tr>
        </thead>
        <tbody>
          {/* Viser listen. Listen er nu garanteret at være renset for undefined/nulls i useMemo */}
          {beregnResultat.materialeliste.map((item, index) => (
            <tr key={index}>
              <td>{item.Vare}</td>
              {/* Tvinger værdien til at være et tal for at undgå TypeError */}
              <td>
                {(Number(item.Antal) || 0).toFixed(item.Enhed === "m" ? 2 : 0)}
              </td>
              <td>{item.Enhed}</td>
              <td>{(Number(item.Pris) || 0).toFixed(2)}</td>
              <td>{(Number(item.Total) || 0).toFixed(2)}</td>
            </tr>
          ))}
          {/* Faste tillæg */}
          <tr>
            <td>Miljøtillæg (Fast)</td>
            <td>1</td>
            <td>stk</td>
            <td>{Number(FAST_TILLÆG).toFixed(2)}</td>
            <td>{Number(FAST_TILLÆG).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <div className="totaler">
        <p>
          Subtotal Materialer Ekskl. Moms:{" "}
          <strong>{beregnResultat.subtotalMaterialer.toFixed(2)} DKK</strong>
        </p>
        <p>
          Subtotal (Materialer + Tillæg) Ekskl. Moms:{" "}
          <strong>{beregnResultat.subtotalInklTillæg.toFixed(2)} DKK</strong>
        </p>
        <h3>
          TOTAL PRIS INKL. MOMS:{" "}
          <strong>{beregnResultat.totalPrisInklMoms.toFixed(2)} DKK</strong>
        </h3>
      </div>
    </div>
  );
}

export default App;
