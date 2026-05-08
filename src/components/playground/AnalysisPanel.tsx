import { For } from "solid-js";
import type { Accessor } from "solid-js";
import { sfbCompareStyle, statBgColor } from "../../lib/analyzer";
import type { AnalysisResult } from "../../lib/analyzer";

interface Props {
  analysis: Accessor<AnalysisResult | null>;
  prevAnalysis: Accessor<AnalysisResult | null>;
}

const pct = (v: number, digits = 3) => (v * 100).toFixed(digits) + "%";

export default function AnalysisPanel(props: Props) {
  const a = () => props.analysis();
  const p = () => props.prevAnalysis();

  const copyStats = () => {
    const an = a();
    if (!an) return;
    const t = an.trigramFreqs;
    const sfbTotal = Object.values(an.fingerSfb).reduce((s, v) => s + v, 0);
    const lines = [
      `Sfb: ${pct(sfbTotal)}`,
      `Dsfb: ${pct(an.dsfbTotal)}`,
      `Lsb: ${pct(an.lsbTotal)}`,
      `Inrolls: ${pct(t.inrolls)}`,
      `Outrolls: ${pct(t.outrolls)}`,
      `Total Rolls: ${pct(t.inrolls + t.outrolls)}`,
      `Onehands: ${pct(t.onehands)}`,
      `Alternates: ${pct(t.alternates)}`,
      `Alternates (sfs): ${pct(t.alternatesSfs)}`,
      `Total Alternates: ${pct(t.alternates + t.alternatesSfs)}`,
      `Redirects: ${pct(t.redirects)}`,
      `BadRedirects: ${pct(t.badRedirects)}`,
      `Total Redirects: ${pct(t.redirects + t.badRedirects)}`,
      `Other: ${pct(t.other)}`,
      `Invalid: ${pct(t.invalid)}`,
    ];
    navigator.clipboard.writeText(lines.join("\n"));
  };

  const fingerRows = [
    { left: "0", right: "9" },
    { left: "1", right: "8" },
    { left: "2", right: "7" },
    { left: "3", right: "6" },
  ];

  const sfbTotal = () => {
    const an = a();
    if (!an) return 0;
    return Object.values(an.fingerSfb).reduce((s, v) => s + v, 0);
  };
  const prevSfbTotal = () => {
    const pn = p();
    if (!pn) return null;
    return Object.values(pn.fingerSfb).reduce((s, v) => s + v, 0);
  };

  return (
    <div
      class="cursor-pointer border-2 border-[#444] rounded-lg bg-[#393939] p-1 sm:p-2"
      onClick={copyStats}
      title="Click to copy stats"
    >
      <div
        class="grid p-[0.5vw] gap-[1.5vw] grid-flow-col"
        style={{
          "grid-auto-columns": "minmax(0, 1fr)",
        }}
      >
        {/* Left panel: finger usage & SFB per finger */}
        <div
          class="p-[1vw]"
          style={{
            "background-color": "#444",
            "text-align": "center",
            "font-size": "1.4vw",
            "border-radius": "0.5vw",
          }}
        >
          <b>Finger usage:</b>
          <table
            style={{
              "font-size": "85%",
              margin: "2% auto",
              "text-align": "left",
            }}
          >
            <tbody>
              <For each={fingerRows}>
                {(row) => (
                  <tr>
                    <td class="border border-[#555] w-[20%]">finger {row.left}:</td>
                    <td
                      class="border border-[#555]"
                      style={{
                        width: "20%",
                        "background-color": statBgColor(
                          a()?.fingerUsage[row.left] ?? 0,
                          p()?.fingerUsage[row.left] ?? null,
                          false,
                        ),
                      }}
                    >
                      {pct(a()?.fingerUsage[row.left] ?? 0, 2)}
                    </td>
                    <td class="border border-[#555] w-[20%]">finger {row.right}:</td>
                    <td
                      class="border border-[#555] w-[20%]"
                      style={{
                        "background-color": statBgColor(
                          a()?.fingerUsage[row.right] ?? 0,
                          p()?.fingerUsage[row.right] ?? null,
                          false,
                        ),
                      }}
                    >
                      {pct(a()?.fingerUsage[row.right] ?? 0, 2)}
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
          <table style={{ "font-size": "85%", margin: "2% auto" }}>
            <tbody>
              <tr>
                <td class="w-[45%] font-bold text-center border-none">
                  Left hand:{" "}
                  {pct(
                    (a()?.fingerUsage["0"] ?? 0) +
                      (a()?.fingerUsage["1"] ?? 0) +
                      (a()?.fingerUsage["2"] ?? 0) +
                      (a()?.fingerUsage["3"] ?? 0),
                    2,
                  )}
                </td>
                <td class="w-[45%] font-bold text-center border-none">
                  Right hand:{" "}
                  {pct(
                    (a()?.fingerUsage["9"] ?? 0) +
                      (a()?.fingerUsage["8"] ?? 0) +
                      (a()?.fingerUsage["7"] ?? 0) +
                      (a()?.fingerUsage["6"] ?? 0),
                    2,
                  )}
                </td>
              </tr>
              <tr>
                <td class="w-[45%] font-bold text-center border-none">
                  Left center: {pct(a()?.centerUsage.left ?? 0, 3)}
                </td>
                <td class="w-[45%] font-bold text-center border-none">
                  Right center: {pct(a()?.centerUsage.right ?? 0, 3)}
                </td>
              </tr>
            </tbody>
          </table>
          <div
            style={{
              "font-weight": "bold",
              "font-size": "90%",
              margin: "-1.5% auto 3%",
              width: "60%",
            }}
          >
            Home keys usage: {pct(a()?.centerUsage.homerow ?? 0, 2)}
          </div>
          <b>Sfb% per finger:</b>
          <table
            style={{
              "font-size": "85%",
              margin: "2% auto",
              "text-align": "left",
            }}
          >
            <tbody>
              <For each={fingerRows}>
                {(row) => (
                  <tr>
                    <td class="border border-[#555] w-[20%]">finger {row.left}:</td>
                    <td
                      class="border border-[#555]"
                      style={{
                        width: "20%",
                        ...sfbCompareStyle(
                          a()?.fingerSfb[row.left] ?? 0,
                          p()?.fingerSfb[row.left] ?? null,
                        ),
                      }}
                    >
                      {pct(a()?.fingerSfb[row.left] ?? 0)}
                    </td>
                    <td class="border border-[#555] w-[20%]">finger {row.right}:</td>
                    <td
                      class="border border-[#555]"
                      style={{
                        width: "20%",
                        ...sfbCompareStyle(
                          a()?.fingerSfb[row.right] ?? 0,
                          p()?.fingerSfb[row.right] ?? null,
                        ),
                      }}
                    >
                      {pct(a()?.fingerSfb[row.right] ?? 0)}
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>

        {/* Right panel: trigram stats */}
        <div
          style={{
            padding: "1vw",
            "padding-top": "0.8vw",
            "background-color": "#444",
            "text-align": "center",
            "font-size": "1.4vw",
            "border-radius": "0.5vw",
          }}
        >
          <StatLine
            label="Sfb:"
            value={sfbTotal()}
            prev={prevSfbTotal()}
            lowerIsBetter={true}
            topMargin
          />
          <StatLine
            label="Dsfb:"
            value={a()?.dsfbTotal ?? 0}
            prev={p()?.dsfbTotal ?? null}
            lowerIsBetter={true}
          />
          <StatLine
            label="Lsb:"
            value={a()?.lsbTotal ?? 0}
            prev={p()?.lsbTotal ?? null}
            lowerIsBetter={true}
          />
          <StatLine
            label="Inrolls:"
            value={a()?.trigramFreqs.inrolls ?? 0}
            prev={p()?.trigramFreqs.inrolls ?? null}
            lowerIsBetter={false}
            topMargin
          />
          <StatLine
            label="Outrolls:"
            value={a()?.trigramFreqs.outrolls ?? 0}
            prev={p()?.trigramFreqs.outrolls ?? null}
            lowerIsBetter={false}
          />
          <StatLine
            label="Total Rolls:"
            value={(a()?.trigramFreqs.inrolls ?? 0) + (a()?.trigramFreqs.outrolls ?? 0)}
            prev={p() ? p()!.trigramFreqs.inrolls + p()!.trigramFreqs.outrolls : null}
            lowerIsBetter={false}
          />
          <StatLine
            label="Onehands:"
            value={a()?.trigramFreqs.onehands ?? 0}
            prev={p()?.trigramFreqs.onehands ?? null}
            lowerIsBetter={false}
          />
          <StatLine
            label="Alternates:"
            value={a()?.trigramFreqs.alternates ?? 0}
            prev={p()?.trigramFreqs.alternates ?? null}
            lowerIsBetter={false}
            topMargin
          />
          <StatLine
            label="Alternates (sfs):"
            value={a()?.trigramFreqs.alternatesSfs ?? 0}
            prev={p()?.trigramFreqs.alternatesSfs ?? null}
            lowerIsBetter={false}
          />
          <StatLine
            label="Total Alternates:"
            value={(a()?.trigramFreqs.alternates ?? 0) + (a()?.trigramFreqs.alternatesSfs ?? 0)}
            prev={p() ? p()!.trigramFreqs.alternates + p()!.trigramFreqs.alternatesSfs : null}
            lowerIsBetter={false}
          />
          <StatLine
            label="Redirects:"
            value={a()?.trigramFreqs.redirects ?? 0}
            prev={p()?.trigramFreqs.redirects ?? null}
            lowerIsBetter={true}
            topMargin
          />
          <StatLine
            label="BadRedirects:"
            value={a()?.trigramFreqs.badRedirects ?? 0}
            prev={p()?.trigramFreqs.badRedirects ?? null}
            lowerIsBetter={true}
          />
          <StatLine
            label="Total Redirects:"
            value={(a()?.trigramFreqs.redirects ?? 0) + (a()?.trigramFreqs.badRedirects ?? 0)}
            prev={p() ? p()!.trigramFreqs.redirects + p()!.trigramFreqs.badRedirects : null}
            lowerIsBetter={true}
          />
          <StatLine
            label="Other:"
            value={a()?.trigramFreqs.other ?? 0}
            prev={p()?.trigramFreqs.other ?? null}
            lowerIsBetter={false}
            topMargin
          />
          <StatLine
            label="Invalid:"
            value={a()?.trigramFreqs.invalid ?? 0}
            prev={p()?.trigramFreqs.invalid ?? null}
            lowerIsBetter={false}
            bottomMargin
          />
        </div>
      </div>
    </div>
  );
}

function StatLine(props: {
  label: string;
  value: number;
  prev: number | null;
  lowerIsBetter: boolean;
  topMargin?: boolean;
  bottomMargin?: boolean;
}) {
  return (
    <div
      style={{
        width: "fit-content",
        "margin-left": "1vw",
        "margin-top": props.topMargin ? "1.3vw" : "0.1vw",
        "margin-bottom": props.bottomMargin ? "0.75vw" : undefined,
        "font-size": "max(0.75vh, 1.05vw)",
        "background-color": statBgColor(props.value, props.prev, props.lowerIsBetter),
        "border-radius": "2px",
        padding: "0 2px",
      }}
    >
      {props.label} {pct(props.value)}
    </div>
  );
}
