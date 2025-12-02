// ================ Hilfsfunktionen ================

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseNumberToken(token) {
  const t = token.trim().replace(",", ".");
  if (!t) return null;
  if (t.includes("/")) {
    const [a, b] = t.split("/").map((s) => s.trim());
    const na = Number(a);
    const nb = Number(b);
    if (!Number.isFinite(na) || !Number.isFinite(nb) || nb === 0) return null;
    return na / nb;
  }
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

// ================ Aufgabe 1: zufällige lineare Funktionen (1)–(5) ================

let funktionen = [];
let aufgabe1Data = {}; // f1..f5, t1, t2

function generateFunktionen() {
  funktionen = [];
  const used = new Set();
  for (let i = 1; i <= 5; i++) {
    let m, n, key;
    do {
      m = randomInt(-3, 3);
      if (m === 0) m = 1;
      n = randomInt(-4, 4);
      key = `${m},${n}`;
    } while (used.has(key));
    used.add(key);
    funktionen.push({ id: i, m, n });
  }
}

function funktionsText(f) {
  const { m, n } = f;
  const mStr = m === 1 ? "" : m === -1 ? "-" : String(m);
  const nStr = n === 0 ? "" : n > 0 ? ` + ${n}` : ` - ${Math.abs(n)}`;
  return `y = ${mStr}x${nStr}`;
}

function wertetabelle(f) {
  const xs = [-2, -1, 0, 1, 2];
  return xs.map((x) => ({ x, y: f.m * x + f.n }));
}

// ================ SVG-Koordinatensystem (für alle Aufgaben) ================

const SVG_NS = "http://www.w3.org/2000/svg";

function renderGraphSet(svgId, funcs) {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const xmin = -5;
  const xmax = 5;
  const ymin = -5;
  const ymax = 5;

  svg.setAttribute("viewBox", `${xmin} ${-ymax} ${xmax - xmin} ${ymax - ymin}`);

  // Gitterlinien
  for (let x = xmin; x <= xmax; x++) {
    const v = document.createElementNS(SVG_NS, "line");
    v.setAttribute("x1", x);
    v.setAttribute("y1", -ymin);
    v.setAttribute("x2", x);
    v.setAttribute("y2", -ymax);
    v.setAttribute("stroke", "#e5e7eb");
    v.setAttribute("stroke-width", "0.03");
    svg.appendChild(v);
  }
  for (let y = ymin; y <= ymax; y++) {
    const h = document.createElementNS(SVG_NS, "line");
    h.setAttribute("x1", xmin);
    h.setAttribute("y1", -y);
    h.setAttribute("x2", xmax);
    h.setAttribute("y2", -y);
    h.setAttribute("stroke", "#e5e7eb");
    h.setAttribute("stroke-width", "0.03");
    svg.appendChild(h);
  }

  // Achsen
  const ax = document.createElementNS(SVG_NS, "line");
  ax.setAttribute("x1", xmin);
  ax.setAttribute("y1", 0);
  ax.setAttribute("x2", xmax);
  ax.setAttribute("y2", 0);
  ax.setAttribute("stroke", "#111827");
  ax.setAttribute("stroke-width", "0.08");
  svg.appendChild(ax);

  const ay = document.createElementNS(SVG_NS, "line");
  ay.setAttribute("x1", 0);
  ay.setAttribute("y1", -ymin);
  ay.setAttribute("x2", 0);
  ay.setAttribute("y2", -ymax);
  ay.setAttribute("stroke", "#111827");
  ay.setAttribute("stroke-width", "0.08");
  svg.appendChild(ay);

  // Farben für Graphen
  const colors = ["#22c55e", "#2563eb", "#f97316", "#ec4899", "#8b5cf6"];

  funcs.forEach((f, idx) => {
    const col = colors[idx % colors.length];
    const x1 = xmin;
    const y1 = f.m * x1 + f.n;
    const x2 = xmax;
    const y2 = f.m * x2 + f.n;

    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", -y1); // y nach oben → Vorzeichen drehen
    line.setAttribute("x2", x2);
    line.setAttribute("y2", -y2);
    line.setAttribute("stroke", col);
    line.setAttribute("stroke-width", "0.09");
    svg.appendChild(line);
  });
}

// ================ Aufgabe 1 – Rendering ================

let taskGPoint = null; // für 1g
let taskHP = null;     // für 1h
let taskHQ = null;     // für 1h

function buildAufgabe1() {
  const listDiv = document.getElementById("aufgabe1-funktionsliste");
  const container = document.getElementById("aufgabe1-container");

  const f1 = funktionen[0];
  const f2 = funktionen[1];
  const f3 = funktionen[2];
  const f4 = funktionen[3];
  const f5 = funktionen[4];

  const t1 = wertetabelle(f1);
  const t2 = wertetabelle(f2);

  aufgabe1Data = { f1, f2, f3, f4, f5, t1, t2 };

  let listHtml = "<strong>Funktionen:</strong><br/>";
  funktionen.forEach((f) => {
    listHtml += `(${f.id}) <code>${funktionsText(f)}</code><br/>`;
  });
  listDiv.innerHTML = listHtml;

  container.innerHTML = `
    <!-- a1 -->
    <div class="card" id="task-a1">
      <div class="subtask-title">a) Wertetabelle und Steigung/Achsenabschnitt für Funktion (1)</div>
      <div class="subtask-body">
        <p>Gegeben ist die Funktion (1): <code>${funktionsText(f1)}</code>.</p>
        <p>Ergänze die Wertetabelle und bestimme Steigung <code>m</code> und y-Achsenabschnitt <code>n</code>.</p>
        <table class="value-table">
          <tr>
            <th>x</th>
            ${t1.map((p) => `<th>${p.x}</th>`).join("")}
          </tr>
          <tr>
            <th>y</th>
            ${t1
              .map(
                (p, idx) =>
                  `<td><input type="text" data-task="a1" data-role="y" data-index="${idx}"></td>`
              )
              .join("")}
          </tr>
        </table>
        <div class="subtask-inputs">
          <div class="inline">
            <label>m =</label>
            <input type="text" data-task="a1" data-role="m">
          </div>
          <div class="inline">
            <label>n =</label>
            <input type="text" data-task="a1" data-role="n">
          </div>
        </div>
        <button class="btn-solution" data-solution-btn="a1">Lösung anzeigen</button>
        <div class="feedback" id="fb-a1"></div>
        <div class="explanation" id="exp-a1" style="display:none;"></div>
      </div>
    </div>

    <!-- a2 -->
    <div class="card" id="task-a2">
      <div class="subtask-title">a) Wertetabelle und Steigung/Achsenabschnitt für Funktion (2)</div>
      <div class="subtask-body">
        <p>Gegeben ist die Funktion (2): <code>${funktionsText(f2)}</code>.</p>
        <p>Ergänze wieder die Wertetabelle und bestimme Steigung <code>m</code> und y-Achsenabschnitt <code>n</code>.</p>
        <table class="value-table">
          <tr>
            <th>x</th>
            ${t2.map((p) => `<th>${p.x}</th>`).join("")}
          </tr>
          <tr>
            <th>y</th>
            ${t2
              .map(
                (p, idx) =>
                  `<td><input type="text" data-task="a2" data-role="y" data-index="${idx}"></td>`
              )
              .join("")}
          </tr>
        </table>
        <div class="subtask-inputs">
          <div class="inline">
            <label>m =</label>
            <input type="text" data-task="a2" data-role="m">
          </div>
          <div class="inline">
            <label>n =</label>
            <input type="text" data-task="a2" data-role="n">
          </div>
        </div>
        <button class="btn-solution" data-solution-btn="a2">Lösung anzeigen</button>
        <div class="feedback" id="fb-a2"></div>
        <div class="explanation" id="exp-a2" style="display:none;"></div>
      </div>
    </div>

    <!-- b -->
    <div class="card" id="task-b">
      <div class="subtask-title">b) Graphen von (1) und (2)</div>
      <div class="subtask-body">
        <p>
          Zeichne im Kopf (oder auf Papier) die Graphen der Funktionen (1) und (2) in dasselbe Koordinatensystem.
          Nach einem Klick auf „Lösung anzeigen“ siehst du die beiden Geraden im Koordinatensystem.
        </p>
        <div class="coord-graph">
          <svg id="graph-b"></svg>
        </div>
        <button class="btn-solution" data-solution-btn="b">Lösung anzeigen</button>
        <div class="feedback" id="fb-b"></div>
        <div class="explanation" id="exp-b" style="display:none;"></div>
      </div>
    </div>

    <!-- c -->
    <div class="card" id="task-c">
      <div class="subtask-title">c) Schnittpunkte des Graphen (2)</div>
      <div class="subtask-body">
        <p>Bestimme die Schnittpunkte des Graphen (2) mit den Achsen.</p>
        <div class="subtask-inputs">
          <div class="inline">
            <label>x-Achse: </label>
            <span>(</span>
            <input type="text" data-task="c" data-role="x0">
            <span>| 0 )</span>
          </div>
          <div class="inline">
            <label>y-Achse: </label>
            <span>(0 |</span>
            <input type="text" data-task="c" data-role="y0">
            <span>)</span>
          </div>
        </div>
        <button class="btn-solution" data-solution-btn="c">Lösung anzeigen</button>
        <div class="feedback" id="fb-c"></div>
        <div class="explanation" id="exp-c" style="display:none;"></div>
      </div>
    </div>

    <!-- d -->
    <div class="card" id="task-d">
      <div class="subtask-title">d) Graphen der Funktionen (3) bis (5)</div>
      <div class="subtask-body">
        <p>
          Zeichne nun die Graphen der Funktionen (3), (4) und (5) in dasselbe Koordinatensystem.
          Nach dem Klick auf „Lösung anzeigen“ siehst du eine mögliche Zeichnung.
        </p>
        <div class="coord-graph">
          <svg id="graph-d"></svg>
        </div>
        <button class="btn-solution" data-solution-btn="d">Lösung anzeigen</button>
        <div class="feedback" id="fb-d"></div>
        <div class="explanation" id="exp-d" style="display:none;"></div>
      </div>
    </div>

    <!-- e -->
    <div class="card" id="task-e">
      <div class="subtask-title">e) Nullstellen der Funktionen (4) und (5)</div>
      <div class="subtask-body">
        <p>Bestimme die Nullstellen der Funktionen (4) und (5) rechnerisch.</p>
        <p>Funktion (4): <code>${funktionsText(f4)}</code></p>
        <div class="subtask-inputs">
          <label>x₀ (4) =</label>
          <input type="text" data-task="e" data-role="x4">
        </div>
        <p>Funktion (5): <code>${funktionsText(f5)}</code></p>
        <div class="subtask-inputs">
          <label>x₀ (5) =</label>
          <input type="text" data-task="e" data-role="x5">
        </div>
        <button class="btn-solution" data-solution-btn="e">Lösung anzeigen</button>
        <div class="feedback" id="fb-e"></div>
        <div class="explanation" id="exp-e" style="display:none;"></div>
      </div>
    </div>

    <!-- f -->
    <div class="card" id="task-f">
      <div class="subtask-title">f) Gemeinsame Eigenschaft von (1) und (4)</div>
      <div class="subtask-body">
        <p>Überlege: Welche gemeinsame Eigenschaft haben die Funktionen (1) und (4)?</p>
        <div class="subtask-inputs">
          <input type="text" class="long" data-task="f" data-role="text" placeholder="Deine Vermutung (wird nicht automatisch bewertet)">
        </div>
        <button class="btn-solution" data-solution-btn="f">Lösung anzeigen</button>
        <div class="feedback" id="fb-f"></div>
        <div class="explanation" id="exp-f" style="display:none;"></div>
      </div>
    </div>

    <!-- g -->
    <div class="card" id="task-g">
      <div class="subtask-title">g) Punkt auf dem Graphen von (4)?</div>
      <div class="subtask-body">
        <p>Wir wählen einen Punkt S zufällig. Entscheide, ob S auf dem Graphen der Funktion (4) liegt.</p>
        <div class="subtask-inputs">
          <span>Punkt S (</span>
          <input type="text" data-task="g" data-role="sx">
          <span>|</span>
          <input type="text" data-task="g" data-role="sy">
          <span>)</span>
        </div>
        <div class="subtask-inputs">
          <label>Liegt S auf dem Graphen?</label>
          <input type="text" data-task="g" data-role="answer" placeholder="ja / nein">
        </div>
        <button class="btn-solution" data-solution-btn="g">Lösung anzeigen</button>
        <div class="feedback" id="fb-g"></div>
        <div class="explanation" id="exp-g" style="display:none;"></div>
      </div>
    </div>

    <!-- h -->
    <div class="card" id="task-h">
      <div class="subtask-title">h) Fehlende Koordinaten zur Funktion (5)</div>
      <div class="subtask-body">
        <p>Für die Funktion (5) sind zwei Punkte gegeben, aber jeweils eine Koordinate fehlt.</p>
        <div class="subtask-inputs">
          <span>P(</span>
          <span id="ph-x"></span>
          <span>|</span>
          <input type="text" data-task="h" data-role="py">
          <span>)</span>
        </div>
        <div class="subtask-inputs">
          <span>Q(</span>
          <input type="text" data-task="h" data-role="qx">
          <span>|</span>
          <span id="qh-y"></span>
          <span>)</span>
        </div>
        <button class="btn-solution" data-solution-btn="h">Lösung anzeigen</button>
        <div class="feedback" id="fb-h"></div>
        <div class="explanation" id="exp-h" style="display:none;"></div>
      </div>
    </div>

    <!-- i -->
    <div class="card" id="task-i">
      <div class="subtask-title">i) Monotonie und Symmetrie der Funktion (1)</div>
      <div class="subtask-body">
        <p>Beschreibe die Monotonie und mögliche Symmetrie der Funktion (1).</p>
        <div class="subtask-inputs">
          <input type="text" class="long" data-task="i" data-role="text" placeholder="Deine Beschreibung (wird nicht automatisch bewertet)">
        </div>
        <button class="btn-solution" data-solution-btn="i">Lösung anzeigen</button>
        <div class="feedback" id="fb-i"></div>
        <div class="explanation" id="exp-i" style="display:none;"></div>
      </div>
    </div>
  `;

  // Zusatzdaten für 1g/1h
  prepareTaskGandH(f4, f5);
}

function prepareTaskGandH(f4, f5) {
  const xS = randomInt(-3, 3);
  const onGraph = Math.random() < 0.5;
  const yCorrect = f4.m * xS + f4.n;
  const yS = onGraph ? yCorrect : yCorrect + (randomInt(-3, 3) || 1);
  taskGPoint = { x: xS, y: yS, onGraph };

  const sxInput = document.querySelector('input[data-task="g"][data-role="sx"]');
  const syInput = document.querySelector('input[data-task="g"][data-role="sy"]');
  if (sxInput && syInput) {
    sxInput.value = String(xS);
    syInput.value = String(yS);
  }

  const xP = randomInt(-4, 4);
  const yP = f5.m * xP + f5.n;
  const yQ = randomInt(-4, 4);
  const xQ = Math.round((yQ - f5.n) / f5.m);

  taskHP = { x: xP, y: yP };
  taskHQ = { x: xQ, y: yQ };

  const phX = document.getElementById("ph-x");
  const qhY = document.getElementById("qh-y");
  if (phX) phX.textContent = String(xP);
  if (qhY) qhY.textContent = String(yQ);
}

// ----- Teilaufgaben Aufgabe 1 -----

function setFeedback(id, msg, ok) {
  const fb = document.getElementById(`fb-${id}`);
  if (!fb) return;
  fb.textContent = msg;
  fb.classList.remove("ok", "error");
  if (msg) fb.classList.add(ok ? "ok" : "error");
}

function showExplanation(id, html) {
  const div = document.getElementById(`exp-${id}`);
  if (!div) return;
  div.innerHTML = html;
  div.style.display = "block";
}

function checkA(taskId, f, table) {
  const inputsY = document.querySelectorAll(
    `input[data-task="${taskId}"][data-role="y"]`
  );
  const mInput = document.querySelector(
    `input[data-task="${taskId}"][data-role="m"]`
  );
  const nInput = document.querySelector(
    `input[data-task="${taskId}"][data-role="n"]`
  );

  let allYCorrect = true;
  inputsY.forEach((inp, idx) => {
    const val = parseNumberToken(inp.value || "");
    const correct = table[idx].y;
    if (val === null || Math.abs(val - correct) > 1e-6) {
      allYCorrect = false;
    }
  });

  const mVal = parseNumberToken(mInput.value || "");
  const nVal = parseNumberToken(nInput.value || "");
  const mOk = mVal !== null && Math.abs(mVal - f.m) < 1e-6;
  const nOk = nVal !== null && Math.abs(nVal - f.n) < 1e-6;

  const ok = allYCorrect && mOk && nOk;

  const msgParts = [];
  msgParts.push(
    allYCorrect ? "Wertetabelle stimmt." : "In der Wertetabelle sind noch Fehler."
  );
  msgParts.push(mOk ? "m ist korrekt." : "m ist noch nicht korrekt.");
  msgParts.push(nOk ? "n ist korrekt." : "n ist noch nicht korrekt.");

  setFeedback(taskId, (ok ? "✅ " : "❌ ") + msgParts.join(" "), ok);

  const rows = table
    .map(
      (p) =>
        `x = ${p.x}  →  y = ${f.m}·(${p.x}) ${
          f.n >= 0 ? "+ " + f.n : "- " + Math.abs(f.n)
        } = ${p.y}`
    )
    .join("<br>");
  const exp = `
    <strong>So kommst du auf die Werte:</strong><br>
    Für die Funktion <code>${funktionsText(f)}</code> setzt du nacheinander die x-Werte ein:<br>
    ${rows}<br><br>
    <strong>Steigung m:</strong> Zahl vor dem x ⇒ m = <code>${f.m}</code>.<br>
    <strong>y-Achsenabschnitt n:</strong> Wert bei x = 0 ⇒ n = <code>${f.n}</code>.
  `;
  showExplanation(taskId, exp);
}

function explainB(f1, f2) {
  renderGraphSet("graph-b", [f1, f2]);

  const exp = `
    Im Koordinatensystem siehst du die Graphen von Funktion (1) und (2).<br><br>
    <strong>Funktion (1):</strong> <code>${funktionsText(f1)}</code><br>
    • Steigung m = ${f1.m}, y-Achsenabschnitt n = ${f1.n}.<br><br>
    <strong>Funktion (2):</strong> <code>${funktionsText(f2)}</code><br>
    • Steigung m = ${f2.m}, y-Achsenabschnitt n = ${f2.n}.<br>
    Genau so konstruierst du die Geraden mithilfe von m und n.
  `;
  setFeedback("b", "", true);
  showExplanation("b", exp);
}

function checkC(f2) {
  const x0Input = document.querySelector('input[data-task="c"][data-role="x0"]');
  const y0Input = document.querySelector('input[data-task="c"][data-role="y0"]');

  const x0Val = parseNumberToken(x0Input.value || "");
  const y0Val = parseNumberToken(y0Input.value || "");

  const x0Correct = -f2.n / f2.m;
  const y0Correct = f2.n;

  const okX = x0Val !== null && Math.abs(x0Val - x0Correct) < 1e-6;
  const okY = y0Val !== null && Math.abs(y0Val - y0Correct) < 1e-6;
  const ok = okX && okY;

  const msg = ok
    ? "✅ Beide Schnittpunkte sind korrekt."
    : "❌ Mindestens ein Schnittpunkt ist noch falsch.";
  setFeedback("c", msg, ok);

  const exp = `
    Funktion (2): <code>${funktionsText(f2)}</code><br><br>
    <strong>x-Achse:</strong> y = 0 setzen und nach x lösen.<br>
    <strong>y-Achse:</strong> x = 0 einsetzen und y berechnen.
  `;
  showExplanation("c", exp);
}

function explainD(f3, f4, f5) {
  renderGraphSet("graph-d", [f3, f4, f5]);
  const exp = `
    Die Funktionen (3), (4) und (5) sind ebenfalls Geraden.<br>
    Jede ist vollständig durch Steigung m und y-Achsenabschnitt n bestimmt.<br>
    Im Koordinatensystem siehst du alle drei zusammen.
  `;
  setFeedback("d", "", true);
  showExplanation("d", exp);
}

function checkE(f4, f5) {
  const x4Input = document.querySelector('input[data-task="e"][data-role="x4"]');
  const x5Input = document.querySelector('input[data-task="e"][data-role="x5"]');

  const x4Val = parseNumberToken(x4Input.value || "");
  const x5Val = parseNumberToken(x5Input.value || "");

  const x4Corr = -f4.n / f4.m;
  const x5Corr = -f5.n / f5.m;

  const ok4 = x4Val !== null && Math.abs(x4Val - x4Corr) < 1e-6;
  const ok5 = x5Val !== null && Math.abs(x5Val - x5Corr) < 1e-6;
  const ok = ok4 && ok5;

  let msg;
  if (ok4 && ok5) msg = "✅ Beide Nullstellen sind korrekt.";
  else if (ok4 || ok5) msg = "⚠️ Eine Nullstelle stimmt, die andere nicht.";
  else msg = "❌ Beide Nullstellen sind (noch) nicht korrekt.";
  setFeedback("e", msg, ok);

  const exp = `
    Allgemein: Nullstelle bei y = 0:<br>
    0 = mx + n ⇒ mx = -n ⇒ x = -n/m.
  `;
  showExplanation("e", exp);
}

function explainF(f1, f4) {
  let eigenschaft;
  if (f1.m > 0 && f4.m > 0)
    eigenschaft = "Beide sind streng monoton steigend (m > 0).";
  else if (f1.m < 0 && f4.m < 0)
    eigenschaft = "Beide sind streng monoton fallend (m < 0).";
  else eigenschaft = "Beide sind Geraden mit genau einer Nullstelle.";

  const exp = `
    Mögliche gemeinsame Eigenschaften von (1) und (4):<br>
    • beides lineare Funktionen (Geraden)<br>
    • konstante Steigung<br>
    • genau eine Nullstelle<br><br>
    In deinem konkreten Fall: <strong>${eigenschaft}</strong>
  `;
  setFeedback("f", "ℹ️ Freitext, wird nicht automatisch bewertet.", true);
  showExplanation("f", exp);
}

function checkG(f4) {
  const ansInput = document.querySelector('input[data-task="g"][data-role="answer"]');
  const ansRaw = (ansInput.value || "").trim().toLowerCase();
  const saysYes = ansRaw === "ja" || ansRaw === "j" || ansRaw === "yes";

  const fVal = f4.m * taskGPoint.x + f4.n;
  const reallyOnGraph = Math.abs(fVal - taskGPoint.y) < 1e-6;

  const ok =
    (saysYes && reallyOnGraph) || (!saysYes && !reallyOnGraph);
  const fb = ok
    ? "✅ Deine Einschätzung passt."
    : "❌ Deine Einschätzung stimmt nicht mit der Rechnung überein.";
  setFeedback("g", fb, ok);

  const exp = `
    Um zu prüfen, ob ein Punkt auf einem Graphen liegt, setzt du seinen x-Wert in
    die Funktionsgleichung ein und vergleichst den berechneten y-Wert mit dem Punkt.
  `;
  showExplanation("g", exp);
}

function checkH(f5) {
  const pyInput = document.querySelector('input[data-task="h"][data-role="py"]');
  const qxInput = document.querySelector('input[data-task="h"][data-role="qx"]');

  const pyVal = parseNumberToken(pyInput.value || "");
  const qxVal = parseNumberToken(qxInput.value || "");

  const okPy = pyVal !== null && Math.abs(pyVal - taskHP.y) < 1e-6;
  const okQx = qxVal !== null && Math.abs(qxVal - taskHQ.x) < 1e-6;
  const ok = okPy && okQx;

  let msg;
  if (okPy && okQx) msg = "✅ Beide Koordinaten sind korrekt.";
  else if (okPy || okQx) msg = "⚠️ Eine Koordinate stimmt, die andere nicht.";
  else msg = "❌ Beide Koordinaten sind noch nicht korrekt.";
  setFeedback("h", msg, ok);

  const exp = `
    Nutze die Funktionsgleichung y = mx + n:<br>
    • Für P ist x gegeben → y berechnen.<br>
    • Für Q ist y gegeben → Gleichung nach x umstellen.
  `;
  showExplanation("h", exp);
}

function explainI(f1) {
  const steig = f1.m > 0 ? "streng monoton steigend" : "streng monoton fallend";
  const exp = `
    Funktion (1): <code>${funktionsText(f1)}</code><br><br>
    <strong>Monotonie:</strong> m = ${f1.m} ⇒ Funktion ist ${steig}.<br><br>
    <strong>Symmetrie:</strong> allgemeine Geraden mit n ≠ 0 sind weder achsensymmetrisch
    zur y-Achse noch punktsymmetrisch zum Ursprung.
  `;
  setFeedback("i", "ℹ️ Freitext, wird nicht automatisch bewertet.", true);
  showExplanation("i", exp);
}

// ================ Aufgabe 2 – feste Funktionen vom Arbeitsblatt ================

// f(x) = (3/2)x + 3
const f2_f = { m: 3 / 2, n: 3 };
// g(x) = (-2/3)x + 2 (durch (0|2), Nullstelle 3)
const g2_f = { m: -2 / 3, n: 2 };

const f2_zero = -2;
const inter2_x = -6 / 13;
const inter2_y = 30 / 13;
const tri2_area = 75 / 13;

function buildAufgabe2() {
  const container = document.getElementById("aufgabe2-container");
  if (!container) return;

  container.innerHTML = `
    <!-- 2a -->
    <div class="card" id="task-2a">
      <div class="subtask-title">a) Graph der Funktion f</div>
      <div class="subtask-body">
        <p>Gegeben ist die lineare Funktion <code>y = f(x) = (3/2)x + 3</code>.</p>
        <p>Zeichne den Graphen der Funktion in ein Koordinatensystem. Nutze dazu z.&nbsp;B. den y-Achsenabschnitt und die Steigung.</p>
        <div class="coord-graph">
          <svg id="graph2-main"></svg>
        </div>
        <button class="btn-solution" data-solution-btn="2a">Lösung anzeigen</button>
        <div class="feedback" id="fb-2a"></div>
        <div class="explanation" id="exp-2a" style="display:none;"></div>
      </div>
    </div>

    <!-- 2b -->
    <div class="card" id="task-2b">
      <div class="subtask-title">b) Nullstelle der Funktion f</div>
      <div class="subtask-body">
        <p>Berechne die Nullstelle der Funktion <code>y = f(x)</code>.</p>
        <div class="subtask-inputs">
          <label>x₀ = </label>
          <input type="text" data-task="2b" data-role="x0">
        </div>
        <button class="btn-solution" data-solution-btn="2b">Lösung anzeigen</button>
        <div class="feedback" id="fb-2b"></div>
        <div class="explanation" id="exp-2b" style="display:none;"></div>
      </div>
    </div>

    <!-- 2c -->
    <div class="card" id="task-2c">
      <div class="subtask-title">c) Zweite Funktion g</div>
      <div class="subtask-body">
        <p>
          Der Graph einer weiteren Funktion <code>y = g(x)</code> verläuft durch den Punkt
          <code>P(0 | 2)</code> und hat die Nullstelle <code>x₀ = 3</code>.<br>
          Gib die Funktionsgleichung an.
        </p>
        <div class="subtask-inputs">
          <div class="inline">
            <span>g(x) = </span>
            <input type="text" data-task="2c" data-role="m" placeholder="m">
            <span>· x + </span>
            <input type="text" data-task="2c" data-role="n" placeholder="n">
          </div>
        </div>
        <p>Nach dem Klick siehst du außerdem den Graphen von f und g im Koordinatensystem.</p>
        <button class="btn-solution" data-solution-btn="2c">Lösung anzeigen</button>
        <div class="feedback" id="fb-2c"></div>
        <div class="explanation" id="exp-2c" style="display:none;"></div>
      </div>
    </div>

    <!-- 2d -->
    <div class="card" id="task-2d">
      <div class="subtask-title">d) Schnittpunkt der Graphen von f und g</div>
      <div class="subtask-body">
        <p>Berechne die Koordinaten des Schnittpunktes der beiden Graphen.</p>
        <div class="subtask-inputs">
          <span>S(</span>
          <input type="text" data-task="2d" data-role="xs" placeholder="x">
          <span>|</span>
          <input type="text" data-task="2d" data-role="ys" placeholder="y">
          <span>)</span>
        </div>
        <button class="btn-solution" data-solution-btn="2d">Lösung anzeigen</button>
        <div class="feedback" id="fb-2d"></div>
        <div class="explanation" id="exp-2d" style="display:none;"></div>
      </div>
    </div>

    <!-- 2e -->
    <div class="card" id="task-2e">
      <div class="subtask-title">e) Flächeninhalt des Dreiecks</div>
      <div class="subtask-body">
        <p>
          Die beiden Graphen von f und g bilden zusammen mit der x-Achse ein Dreieck.<br>
          Berechne den Flächeninhalt dieses Dreiecks.
        </p>
        <div class="subtask-inputs">
          <label>A = </label>
          <input type="text" data-task="2e" data-role="area">
        </div>
        <button class="btn-solution" data-solution-btn="2e">Lösung anzeigen</button>
        <div class="feedback" id="fb-2e"></div>
        <div class="explanation" id="exp-2e" style="display:none;"></div>
      </div>
    </div>
  `;
}

// ----- Teilaufgaben Aufgabe 2 -----

function show2a() {
  renderGraphSet("graph2-main", [f2_f]);
  setFeedback("2a", "", true);

  const exp = `
    Für <code>f(x) = (3/2)x + 3</code> gilt:<br>
    • Steigung m = 3/2: pro 2 nach rechts geht der Graph 3 nach oben.<br>
    • y-Achsenabschnitt n = 3: der Graph schneidet die y-Achse im Punkt (0 | 3).<br><br>
    Zeichnung: Punkt (0 | 3) eintragen, von dort Steigungsdreieck benutzen und Gerade einzeichnen.
  `;
  showExplanation("2a", exp);
}

function check2b() {
  const inp = document.querySelector('input[data-task="2b"][data-role="x0"]');
  const val = parseNumberToken(inp.value || "");

  const ok = val !== null && Math.abs(val - f2_zero) < 1e-6;
  setFeedback(
    "2b",
    ok ? "✅ Nullstelle korrekt." : "❌ Die Nullstelle stimmt noch nicht.",
    ok
  );

  const exp = `
    Nullstelle von f: 0 = (3/2)x + 3<br>
    ⇒ (3/2)x = -3<br>
    ⇒ x = -3 · (2/3) = -2<br>
    Also x₀ = -2.
  `;
  showExplanation("2b", exp);
}

function check2c() {
  const mInput = document.querySelector('input[data-task="2c"][data-role="m"]');
  const nInput = document.querySelector('input[data-task="2c"][data-role="n"]');

  const mVal = parseNumberToken(mInput.value || "");
  const nVal = parseNumberToken(nInput.value || "");

  const okM = mVal !== null && Math.abs(mVal - g2_f.m) < 1e-6;
  const okN = nVal !== null && Math.abs(nVal - g2_f.n) < 1e-6;
  const ok = okM && okN;

  let msg;
  if (okM && okN) msg = "✅ Funktionsgleichung korrekt.";
  else if (okM || okN) msg = "⚠️ Ein Teil stimmt, der andere noch nicht.";
  else msg = "❌ m und n sind (noch) nicht korrekt.";
  setFeedback("2c", msg, ok);

  renderGraphSet("graph2-main", [f2_f, g2_f]);

  const exp = `
    Gesucht ist g(x) mit:<br>
    • Punkt P(0 | 2) liegt auf dem Graphen → g(0) = 2 ⇒ n = 2.<br>
    • Nullstelle x₀ = 3 ⇒ g(3) = 0.<br><br>
    Steigung m aus den Punkten (0|2) und (3|0):<br>
    m = (0 - 2) / (3 - 0) = -2/3.<br><br>
    Also: <code>g(x) = (-2/3)x + 2</code>.
  `;
  showExplanation("2c", exp);
}

function check2d() {
  const xsInput = document.querySelector('input[data-task="2d"][data-role="xs"]');
  const ysInput = document.querySelector('input[data-task="2d"][data-role="ys"]');

  const xsVal = parseNumberToken(xsInput.value || "");
  const ysVal = parseNumberToken(ysInput.value || "");

  const okX = xsVal !== null && Math.abs(xsVal - inter2_x) < 1e-6;
  const okY = ysVal !== null && Math.abs(ysVal - inter2_y) < 1e-6;
  const ok = okX && okY;

  let msg;
  if (okX && okY) msg = "✅ Schnittpunkt korrekt.";
  else if (okX || okY) msg = "⚠️ Eine Koordinate stimmt, die andere nicht.";
  else msg = "❌ Die Koordinaten stimmen noch nicht.";
  setFeedback("2d", msg, ok);

  const exp = `
    Schnittpunkt: f(x) = g(x)<br>
    (3/2)x + 3 = (-2/3)x + 2<br>
    ⇒ (3/2 + 2/3)x = -1<br>
    ⇒ (13/6)x = -1<br>
    ⇒ x = -6/13<br>
    Einsetzen in f oder g:<br>
    f(-6/13) = (3/2)·(-6/13) + 3 = -9/13 + 39/13 = 30/13.<br><br>
    Also S(-6/13 | 30/13).
  `;
  showExplanation("2d", exp);
}

function check2e() {
  const areaInput = document.querySelector('input[data-task="2e"][data-role="area"]');
  const val = parseNumberToken(areaInput.value || "");

  const ok = val !== null && Math.abs(val - tri2_area) < 1e-6;
  setFeedback(
    "2e",
    ok ? "✅ Flächeninhalt korrekt." : "❌ Flächeninhalt stimmt noch nicht.",
    ok
  );

  const exp = `
    Eckpunkte des Dreiecks:<br>
    • A = Nullstelle von f: (-2 | 0)<br>
    • B = Nullstelle von g: (3 | 0)<br>
    • C = Schnittpunkt S(-6/13 | 30/13)<br><br>
    Grundseite auf der x-Achse: Länge 5 (von -2 bis 3).<br>
    Höhe: y-Wert des Schnittpunkts: h = 30/13.<br><br>
    Flächeninhalt: A = (1/2) · 5 · 30/13 = 75/13.
  `;
  showExplanation("2e", exp);
}

// ================ Aufgabe 3 – Arbeitsblatt mit y = 1,5x usw. ================

let aufgabe3Data = {};

function buildAufgabe3() {
  const container = document.getElementById("aufgabe3-container");
  if (!container) return;

  // 1. Teil: y = 1.5x, 1.5x+1, 1.5x-2
  const f31 = { m: 1.5, n: 0 };
  const f32 = { m: 1.5, n: 1 };
  const f33 = { m: 1.5, n: -2 };
  const t31 = wertetabelle(f31);
  const t32 = wertetabelle(f32);
  const t33 = wertetabelle(f33);

  // 2. Teil: andere lineare Funktionen
  const g1 = { m: 3, n: -1 };
  const g2 = { m: -4, n: 0 };
  const g3 = { m: -0.5, n: 3 };   // -1/2 x + 3
  const g4 = { m: -0.75, n: 3 };  // -3/4 x + 3
  const g5 = { m: 1, n: -3 };

  aufgabe3Data = { f31, f32, f33, t31, t32, t33, g1, g2, g3, g4, g5 };

  container.innerHTML = `
    <!-- 3a -->
    <div class="card" id="task-3a">
      <div class="subtask-title">1. a) Wertetabellen – Funktionen mit gleicher Steigung</div>
      <div class="subtask-body">
        <p>Ergänze die Wertetabellen für die folgenden Funktionen. Verwende die x-Werte -2, -1, 0, 1, 2.</p>

        <p><strong>(1)</strong> <code>y = 1,5x</code></p>
        <table class="value-table">
          <tr>
            <th>x</th>
            ${t31.map((p) => `<th>${p.x}</th>`).join("")}
          </tr>
          <tr>
            <th>y</th>
            ${t31
              .map(
                (p, idx) =>
                  `<td><input type="text" data-task="3a" data-f="1" data-index="${idx}"></td>`
              )
              .join("")}
          </tr>
        </table>

        <p><strong>(2)</strong> <code>y = 1,5x + 1</code></p>
        <table class="value-table">
          <tr>
            <th>x</th>
            ${t32.map((p) => `<th>${p.x}</th>`).join("")}
          </tr>
          <tr>
            <th>y</th>
            ${t32
              .map(
                (p, idx) =>
                  `<td><input type="text" data-task="3a" data-f="2" data-index="${idx}"></td>`
              )
              .join("")}
          </tr>
        </table>

        <p><strong>(3)</strong> <code>y = 1,5x - 2</code></p>
        <table class="value-table">
          <tr>
            <th>x</th>
            ${t33.map((p) => `<th>${p.x}</th>`).join("")}
          </tr>
          <tr>
            <th>y</th>
            ${t33
              .map(
                (p, idx) =>
                  `<td><input type="text" data-task="3a" data-f="3" data-index="${idx}"></td>`
              )
              .join("")}
          </tr>
        </table>

        <button class="btn-solution" data-solution-btn="3a">Lösung anzeigen</button>
        <div class="feedback" id="fb-3a"></div>
        <div class="explanation" id="exp-3a" style="display:none;"></div>
      </div>
    </div>

    <!-- 3b -->
    <div class="card" id="task-3b">
      <div class="subtask-title">1. b) Verschiebung und Parallelen</div>
      <div class="subtask-body">
        <p>Betrachte die Graphen der Funktionen aus 1a) (am besten auf Papier oder im Kopf) und ergänze den Text.</p>
        <p>Du kannst deine Vermutung hier eintragen – sie wird nicht automatisch bewertet. Beim Lösungsknopf kommt eine Erklärung.</p>

        <p>
          Den Graphen der Funktion <code>y = 1{,}5x + 1</code> erhält man, indem der Graph von
          <code>y = 1{,}5x</code> um
          <input type="text" data-task="3b" data-role="shift1" size="3">
          Einheiten in
          <input type="text" data-task="3b" data-role="dir1" size="6">
          Richtung verschoben wird.
          Er schneidet die y-Achse im Punkt (0 |
          <input type="text" data-task="3b" data-role="y1" size="3">
          ).
        </p>

        <p>
          Den Graphen der Funktion <code>y = 1{,}5x - 2</code> erhält man, indem eine Parallele
          zum Graphen von <code>y = 1{,}5x</code> durch den Punkt (0 |
          <input type="text" data-task="3b" data-role="y2" size="3">
          ) gezeichnet wird.
        </p>

        <button class="btn-solution" data-solution-btn="3b">Lösung anzeigen</button>
        <div class="feedback" id="fb-3b"></div>
        <div class="explanation" id="exp-3b" style="display:none;"></div>
      </div>
    </div>

    <!-- 3c -->
    <div class="card" id="task-3c">
      <div class="subtask-title">2. a) Anstieg m und y-Achsenabschnitt n</div>
      <div class="subtask-body">
        <p>Gib jeweils den Anstieg <code>m</code> und den y-Achsenabschnitt <code>n</code> an. Nach dem Lösungsknopf siehst du alle Graphen im selben Koordinatensystem.</p>

        <div class="subtask-inputs">
          <p>(1) <code>y = 3x - 1</code></p>
          <label>m = </label><input type="text" data-task="3c" data-role="m1" size="4">
          <label> n = </label><input type="text" data-task="3c" data-role="n1" size="4">
        </div>

        <div class="subtask-inputs">
          <p>(2) <code>y = -4x</code></p>
          <label>m = </label><input type="text" data-task="3c" data-role="m2" size="4">
          <label> n = </label><input type="text" data-task="3c" data-role="n2" size="4">
        </div>

        <div class="subtask-inputs">
          <p>(3) <code>y = -1/2 · x + 3</code></p>
          <label>m = </label><input type="text" data-task="3c" data-role="m3" size="4">
          <label> n = </label><input type="text" data-task="3c" data-role="n3" size="4">
        </div>

        <div class="subtask-inputs">
          <p>(4) <code>y = -3/4 · x + 3</code></p>
          <label>m = </label><input type="text" data-task="3c" data-role="m4" size="4">
          <label> n = </label><input type="text" data-task="3c" data-role="n4" size="4">
        </div>

        <div class="subtask-inputs">
          <p>(5) <code>y = x - 3</code></p>
          <label>m = </label><input type="text" data-task="3c" data-role="m5" size="4">
          <label> n = </label><input type="text" data-task="3c" data-role="n5" size="4">
        </div>

        <div class="coord-graph">
          <svg id="graph-3c"></svg>
        </div>

        <button class="btn-solution" data-solution-btn="3c">Lösung anzeigen</button>
        <div class="feedback" id="fb-3c"></div>
        <div class="explanation" id="exp-3c" style="display:none;"></div>
      </div>
    </div>

    <!-- 3d -->
    <div class="card" id="task-3d">
      <div class="subtask-title">2. b) Achsenschnittpunkte von Graph (4)</div>
      <div class="subtask-body">
        <p>
          Der Graph (4) hat die Funktionsgleichung <code>y = -3/4 · x + 3</code>.<br>
          Bestimme die Schnittpunkte mit der x-Achse und der y-Achse.
        </p>
        <div class="subtask-inputs">
          <p>x-Achse:</p>
          <span>(</span>
          <input type="text" data-task="3d" data-role="x0" size="4">
          <span>| 0 )</span>
        </div>
        <div class="subtask-inputs">
          <p>y-Achse:</p>
          <span>( 0 | </span>
          <input type="text" data-task="3d" data-role="y0" size="4">
          <span>)</span>
        </div>

        <button class="btn-solution" data-solution-btn="3d">Lösung anzeigen</button>
        <div class="feedback" id="fb-3d"></div>
        <div class="explanation" id="exp-3d" style="display:none;"></div>
      </div>
    </div>
  `;
}

// ----- Teilaufgaben Aufgabe 3 -----

function check3a() {
  const { f31, f32, f33, t31, t32, t33 } = aufgabe3Data;
  const funcs = [
    { f: f31, table: t31, id: 1 },
    { f: f32, table: t32, id: 2 },
    { f: f33, table: t33, id: 3 },
  ];

  let allOk = true;
  const details = [];

  funcs.forEach(({ f, table, id }) => {
    let ok = true;
    table.forEach((p, idx) => {
      const inp = document.querySelector(
        `input[data-task="3a"][data-f="${id}"][data-index="${idx}"]`
      );
      const val = parseNumberToken(inp.value || "");
      if (val === null || Math.abs(val - p.y) > 1e-6) ok = false;
    });
    allOk = allOk && ok;
    details.push(
      `Funktion (${id}): ${ok ? "Tabelle korrekt." : "In der Tabelle sind noch Fehler."}`
    );
  });

  setFeedback(
    "3a",
    (allOk ? "✅  " : "❌  ") + details.join(" "),
    allOk
  );

  const explainRows = (f, table, name) =>
    table
      .map(
        (p) =>
          `${name}: x = ${p.x} → y = 1,5 · (${p.x}) ${
            f.n >= 0 ? "+ " + f.n : "- " + Math.abs(f.n)
          } = ${p.y}`
      )
      .join("<br>");

  const exp = `
    <strong>Alle drei Funktionen haben die Steigung m = 1,5.</strong><br>
    Die verschiedenen Tabellen entstehen nur durch unterschiedliche y-Achsenabschnitte n.<br><br>
    ${explainRows(f31, t31, "(1) y = 1,5x")}<br><br>
    ${explainRows(f32, t32, "(2) y = 1,5x + 1")}<br><br>
    ${explainRows(f33, t33, "(3) y = 1,5x - 2")}
  `;
  showExplanation("3a", exp);
}

function explain3b() {
  setFeedback(
    "3b",
    "ℹ️ Deine Einträge werden nicht automatisch bewertet. Unten siehst du die vollständige Erklärung.",
    true
  );

  const exp = `
    <strong>Erste Aussage:</strong><br>
    Beim Übergang von <code>y = 1{,}5x</code> zu <code>y = 1{,}5x + 1</code> wird die gesamte Gerade
    um 1 Einheit nach <strong>oben</strong> verschoben. Die Steigung bleibt gleich (m = 1,5), nur der
    y-Achsenabschnitt ändert sich von 0 auf 1. Deshalb schneidet der Graph die y-Achse im Punkt (0 | 1).<br><br>
    <strong>Zweite Aussage:</strong><br>
    Der Graph von <code>y = 1{,}5x - 2</code> ist zu <code>y = 1{,}5x</code> parallel (gleiche Steigung),
    verläuft aber durch den Punkt (0 | -2). Man erhält ihn also, indem man eine Parallele zum Graphen
    von <code>y = 1{,}5x</code> durch (0 | -2) zeichnet.
  `;
  showExplanation("3b", exp);
}

function check3c() {
  const { g1, g2, g3, g4, g5 } = aufgabe3Data;

  const funcs = [
    { f: g1, mRole: "m1", nRole: "n1", label: "(1)" },
    { f: g2, mRole: "m2", nRole: "n2", label: "(2)" },
    { f: g3, mRole: "m3", nRole: "n3", label: "(3)" },
    { f: g4, mRole: "m4", nRole: "n4", label: "(4)" },
    { f: g5, mRole: "m5", nRole: "n5", label: "(5)" },
  ];

  let allOk = true;
  const msgs = [];

  funcs.forEach(({ f, mRole, nRole, label }) => {
    const mInp = document.querySelector(
      `input[data-task="3c"][data-role="${mRole}"]`
    );
    const nInp = document.querySelector(
      `input[data-task="3c"][data-role="${nRole}"]`
    );

    const mVal = parseNumberToken(mInp.value || "");
    const nVal = parseNumberToken(nInp.value || "");

    const mOk = mVal !== null && Math.abs(mVal - f.m) < 1e-6;
    const nOk = nVal !== null && Math.abs(nVal - f.n) < 1e-6;

    const ok = mOk && nOk;
    allOk = allOk && ok;

    let text;
    if (ok) text = `${label} m und n korrekt.`;
    else if (mOk || nOk) text = `${label} ein Wert stimmt, der andere nicht.`;
    else text = `${label} m und n sind (noch) falsch.`;
    msgs.push(text);
  });

  setFeedback(
    "3c",
    (allOk ? "✅ " : "❌ ") + msgs.join(" "),
    allOk
  );

  renderGraphSet("graph-3c", [g1, g2, g3, g4, g5]);

  const exp = `
    <strong>Merke:</strong> In der Schreibweise <code>y = mx + n</code> ist<br>
    • <code>m</code> immer die Steigung (wie stark geht der Graph pro Schritt nach rechts nach oben/unten),<br>
    • <code>n</code> ist der y-Achsenabschnitt (Schnittpunkt mit der y-Achse).<br><br>
    Für unsere Funktionen gilt zum Beispiel:<br>
    (1) <code>y = 3x - 1</code> → m = 3, n = -1<br>
    (2) <code>y = -4x</code> → m = -4, n = 0<br>
    (3) <code>y = -1/2 x + 3</code> → m = -1/2, n = 3<br>
    (4) <code>y = -3/4 x + 3</code> → m = -3/4, n = 3<br>
    (5) <code>y = x - 3</code> → m = 1, n = -3<br><br>
    Im Koordinatensystem siehst du, dass sich vor allem die Steigung und der y-Achsenabschnitt auf
    die Lage der Geraden auswirken.
  `;
  showExplanation("3c", exp);
}

function check3d() {
  const { g4 } = aufgabe3Data;

  const x0Input = document.querySelector(
    'input[data-task="3d"][data-role="x0"]'
  );
  const y0Input = document.querySelector(
    'input[data-task="3d"][data-role="y0"]'
  );

  const x0Val = parseNumberToken(x0Input.value || "");
  const y0Val = parseNumberToken(y0Input.value || "");

  const x0Corr = -g4.n / g4.m; // -3 / (-3/4) = 4
  const y0Corr = g4.n;         // 3

  const okX = x0Val !== null && Math.abs(x0Val - x0Corr) < 1e-6;
  const okY = y0Val !== null && Math.abs(y0Val - y0Corr) < 1e-6;
  const ok = okX && okY;

  let msg;
  if (okX && okY) msg = "✅ Beide Schnittpunkte sind korrekt.";
  else if (okX || okY)
    msg = "⚠️ Eine Koordinate stimmt, die andere nicht.";
  else msg = "❌ Beide Koordinaten sind noch nicht korrekt.";
  setFeedback("3d", msg, ok);

  const exp = `
    Funktion (4): <code>y = -3/4 x + 3</code><br><br>
    <strong>x-Achse:</strong> Hier ist y = 0.<br>
    0 = -3/4 x + 3 ⇒ -3/4 x = -3 ⇒ x = (-3) / (-3/4) = 4.<br>
    Punkt: (4 | 0).<br><br>
    <strong>y-Achse:</strong> Hier ist x = 0.<br>
    y = -3/4 · 0 + 3 = 3.<br>
    Punkt: (0 | 3).
  `;
  showExplanation("3d", exp);
}

// ================ Lösungsknöpfe global verbinden ================

function attachAllSolutionHandlers() {
  const { f1, f2, f3, f4, f5, t1, t2 } = aufgabe1Data;

  const handlers = {
    // Aufgabe 1
    a1: () => checkA("a1", f1, t1),
    a2: () => checkA("a2", f2, t2),
    b: () => explainB(f1, f2),
    c: () => checkC(f2),
    d: () => explainD(f3, f4, f5),
    e: () => checkE(f4, f5),
    f: () => explainF(f1, f4),
    g: () => checkG(f4),
    h: () => checkH(f5),
    i: () => explainI(f1),

    // Aufgabe 2
    "2a": () => show2a(),
    "2b": () => check2b(),
    "2c": () => check2c(),
    "2d": () => check2d(),
    "2e": () => check2e(),

    // Aufgabe 3
    "3a": () => check3a(),
    "3b": () => explain3b(),
    "3c": () => check3c(),
    "3d": () => check3d(),
  };

  Object.entries(handlers).forEach(([id, fn]) => {
    const btn = document.querySelector(`[data-solution-btn="${id}"]`);
    if (btn && !btn.dataset.bound) {
      btn.addEventListener("click", fn);
      btn.dataset.bound = "true";
    }
  });
}

// ================ Tabs ================

function initTabs() {
  const buttons = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".tab-content");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");
      buttons.forEach((b) => b.classList.remove("active"));
      contents.forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`tab-${tab}`).classList.add("active");
    });
  });
}

// ================ Init ================

window.addEventListener("DOMContentLoaded", () => {
  initTabs();
  generateFunktionen();
  buildAufgabe1();
  buildAufgabe2();
  buildAufgabe3();
  attachAllSolutionHandlers();
});


