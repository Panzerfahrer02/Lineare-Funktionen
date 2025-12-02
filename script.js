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

// ================ Lineare Funktionen (1)–(5) ================

// Jede Funktion: y = m x + n mit kleinen ganzen Zahlen
let funktionen = [];

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

// ================ SVG-Koordinatensystem ================

const SVG_NS = "http://www.w3.org/2000/svg";

function renderGraphSet(svgId, funcs) {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  // alles löschen
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const xmin = -5;
  const xmax = 5;
  const ymin = -5;
  const ymax = 5;

  // viewBox: x von -5 bis 5, y von -5 bis 5
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

  // Farben für Funktionsgraphen
  const colors = ["#22c55e", "#2563eb", "#f97316", "#ec4899", "#8b5cf6"];

  // Geraden einzeichnen
  funcs.forEach((f, idx) => {
    const col = colors[idx % colors.length];
    const x1 = xmin;
    const y1 = f.m * x1 + f.n;
    const x2 = xmax;
    const y2 = f.m * x2 + f.n;

    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", -y1); // y nach oben ⇒ Vorzeichen drehen
    line.setAttribute("x2", x2);
    line.setAttribute("y2", -y2);
    line.setAttribute("stroke", col);
    line.setAttribute("stroke-width", "0.09");
    svg.appendChild(line);
  });
}

// ================ Aufgabe 1 Rendering ================

function buildAufgabe1() {
  const listDiv = document.getElementById("aufgabe1-funktionsliste");
  const container = document.getElementById("aufgabe1-container");

  // Liste der Funktionen (1)-(5)
  let listHtml = "<strong>Funktionen:</strong><br/>";
  funktionen.forEach((f) => {
    listHtml += `(${f.id}) <code>${funktionsText(f)}</code><br/>`;
  });
  listDiv.innerHTML = listHtml;

  const f1 = funktionen[0];
  const f2 = funktionen[1];
  const f3 = funktionen[2];
  const f4 = funktionen[3];
  const f5 = funktionen[4];

  const t1 = wertetabelle(f1);
  const t2 = wertetabelle(f2);

  container.innerHTML = `
    <!-- a) Wertetabelle 1 -->
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

    <!-- a) Wertetabelle 2 -->
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

    <!-- b) Graphen von (1) und (2) -->
    <div class="card" id="task-b">
      <div class="subtask-title">b) Graphen von (1) und (2)</div>
      <div class="subtask-body">
        <p>
          Zeichne im Kopf (oder auf Papier) die Graphen der Funktionen (1) und (2) in dasselbe Koordinatensystem.
          Nutze die Steigungen und y-Achsenabschnitte aus Teilaufgabe a).
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

    <!-- c) Schnittpunkte von (2) -->
    <div class="card" id="task-c">
      <div class="subtask-title">c) Schnittpunkte des Graphen (2)</div>
      <div class="subtask-body">
        <p>
          Bestimme die Schnittpunkte des Graphen (2) mit den Achsen.
        </p>
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

    <!-- d) Graphen von (3) bis (5) -->
    <div class="card" id="task-d">
      <div class="subtask-title">d) Graphen der Funktionen (3) bis (5)</div>
      <div class="subtask-body">
        <p>
          Zeichne nun die Graphen der Funktionen (3), (4) und (5) in dasselbe Koordinatensystem.
          Überlege wieder: Wo schneiden sie die y-Achse, wie groß ist die Steigung?
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

    <!-- e) Nullstellen von (4) und (5) -->
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

    <!-- f) Gemeinsame Eigenschaft von (1) und (4) -->
    <div class="card" id="task-f">
      <div class="subtask-title">f) Gemeinsame Eigenschaft von (1) und (4)</div>
      <div class="subtask-body">
        <p>
          Überlege: Welche gemeinsame Eigenschaft haben die Funktionen (1) und (4)?
          (z.B. bezüglich Steigung, Verlauf, Achsenschnittpunkten …)
        </p>
        <div class="subtask-inputs">
          <input type="text" class="long" data-task="f" data-role="text" placeholder="Deine Vermutung (wird nicht automatisch bewertet)">
        </div>
        <button class="btn-solution" data-solution-btn="f">Lösung anzeigen</button>
        <div class="feedback" id="fb-f"></div>
        <div class="explanation" id="exp-f" style="display:none;"></div>
      </div>
    </div>

    <!-- g) Punkt auf dem Graphen von (4)? -->
    <div class="card" id="task-g">
      <div class="subtask-title">g) Punkt auf dem Graphen von (4)?</div>
      <div class="subtask-body">
        <p>
          Wir wählen einen Punkt S zufällig. Entscheide, ob S auf dem Graphen der Funktion (4) liegt.
        </p>
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

    <!-- h) Fehlende Koordinaten zu (5) -->
    <div class="card" id="task-h">
      <div class="subtask-title">h) Fehlende Koordinaten zur Funktion (5)</div>
      <div class="subtask-body">
        <p>
          Für die Funktion (5) sind zwei Punkte gegeben, aber jeweils eine Koordinate fehlt.
        </p>
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

    <!-- i) Monotonie und Symmetrie von (1) -->
    <div class="card" id="task-i">
      <div class="subtask-title">i) Monotonie und Symmetrie der Funktion (1)</div>
      <div class="subtask-body">
        <p>
          Beschreibe die Monotonie und mögliche Symmetrie der Funktion (1).
        </p>
        <div class="subtask-inputs">
          <input type="text" class="long" data-task="i" data-role="text" placeholder="Deine Beschreibung (wird nicht automatisch bewertet)">
        </div>
        <button class="btn-solution" data-solution-btn="i">Lösung anzeigen</button>
        <div class="feedback" id="fb-i"></div>
        <div class="explanation" id="exp-i" style="display:none;"></div>
      </div>
    </div>
  `;

  // Zusatzdaten für g) und h)
  prepareTaskGandH(f4, f5);
  attachSolutionHandlers(f1, f2, f3, f4, f5, t1, t2);
}

// Hilfsdaten für g) und h)
let taskGPoint = null;
let taskHP = null;
let taskHQ = null;

function prepareTaskGandH(f4, f5) {
  // g) Punkt S
  const xS = randomInt(-3, 3);
  const onGraph = Math.random() < 0.5;
  const yCorrect = f4.m * xS + f4.n;
  const yS =
    onGraph ? yCorrect : yCorrect + (randomInt(-3, 3) || 1);
  taskGPoint = { x: xS, y: yS, onGraph };

  const sxInput = document.querySelector(
    'input[data-task="g"][data-role="sx"]'
  );
  const syInput = document.querySelector(
    'input[data-task="g"][data-role="sy"]'
  );
  if (sxInput && syInput) {
    sxInput.value = String(xS);
    syInput.value = String(yS);
  }

  // h) Punkte P und Q für (5)
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

// ================ Lösungs-Buttons ================

function attachSolutionHandlers(f1, f2, f3, f4, f5, t1, t2) {
  const buttons = document.querySelectorAll("[data-solution-btn]");
  buttons.forEach((btn) => {
    const id = btn.getAttribute("data-solution-btn");
    btn.addEventListener("click", () =>
      handleSolutionClick(id, f1, f2, f3, f4, f5, t1, t2)
    );
  });
}

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

function handleSolutionClick(id, f1, f2, f3, f4, f5, t1, t2) {
  switch (id) {
    case "a1":
      checkA("a1", f1, t1);
      break;
    case "a2":
      checkA("a2", f2, t2);
      break;
    case "b":
      explainB(f1, f2);
      break;
    case "c":
      checkC(f2);
      break;
    case "d":
      explainD(f3, f4, f5);
      break;
    case "e":
      checkE(f4, f5);
      break;
    case "f":
      explainF(f1, f4);
      break;
    case "g":
      checkG(f4);
      break;
    case "h":
      checkH(f5);
      break;
    case "i":
      explainI(f1);
      break;
  }
}

// ================ Teilaufgaben-Logik ================

// a) Wertetabellen + m,n
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

  // Erklärung
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
    Für die Funktion <code>${funktionsText(f)}</code> setzt du nacheinander die x-Werte in die Funktionsgleichung ein:<br>
    ${rows}<br><br>
    <strong>Steigung m:</strong> Die Zahl vor dem x ist die Steigung. Hier ist m = <code>${f.m}</code>.<br>
    <strong>y-Achsenabschnitt n:</strong> Wenn du x = 0 einsetzt, erhältst du y = n. Hier ist n = <code>${f.n}</code>.
  `;
  showExplanation(taskId, exp);
}

// b) Graphen qualitativ + Zeichnung
function explainB(f1, f2) {
  // Graph zeichnen
  renderGraphSet("graph-b", [f1, f2]);

  const exp = `
    Im Koordinatensystem siehst du die Graphen von Funktion (1) und (2).<br><br>
    <strong>Graph von Funktion (1):</strong><br>
    <code>${funktionsText(f1)}</code><br>
    • Steigung m = ${f1.m}: Bei jedem Schritt 1 nach rechts geht die Gerade ${
    f1.m > 0 ? f1.m + " nach oben" : Math.abs(f1.m) + " nach unten"
  }. <br>
    • y-Achsenabschnitt n = ${f1.n}: Die Gerade schneidet die y-Achse im Punkt (0 | ${f1.n}).<br><br>

    <strong>Graph von Funktion (2):</strong><br>
    <code>${funktionsText(f2)}</code><br>
    • Steigung m = ${f2.m}, y-Achsenabschnitt n = ${f2.n}.<br>
    Auch hier kannst du die Punkte aus der Wertetabelle eintragen und dann verbinden – so erhältst du genau die Geraden, die du im Bild siehst.
  `;
  setFeedback("b", "", true);
  showExplanation("b", exp);
}

// c) Achsenschnittpunkte von (2)
function checkC(f2) {
  const x0Input = document.querySelector(
    'input[data-task="c"][data-role="x0"]'
  );
  const y0Input = document.querySelector(
    'input[data-task="c"][data-role="y0"]'
  );

  const x0Val = parseNumberToken(x0Input.value || "");
  const y0Val = parseNumberToken(y0Input.value || "");

  const x0Correct = -f2.n / f2.m;
  const y0Correct = f2.n;

  const okX = x0Val !== null && Math.abs(x0Val - x0Correct) < 1e-6;
  const okY = y0Val !== null && Math.abs(y0Val - y0Correct) < 1e-6;
  const ok = okX && okY;

  let msg = ok
    ? "✅ Beide Schnittpunkte sind korrekt."
    : "❌ Mindestens ein Schnittpunkt ist noch falsch.";
  setFeedback("c", msg, ok);

  const exp = `
    Wir betrachten Funktion (2): <code>${funktionsText(f2)}</code><br><br>
    <strong>Schnittpunkt mit der x-Achse:</strong> Dort gilt y = 0.<br>
    Also: 0 = ${f2.m}x ${
    f2.n >= 0 ? "+ " + f2.n : "- " + Math.abs(f2.n)
  }<br>
    ⇒ ${f2.m}x = ${-f2.n}<br>
    ⇒ x = ${-f2.n} / ${f2.m} = ${x0Correct}. Der Punkt ist also (${x0Correct} | 0).<br><br>
    <strong>Schnittpunkt mit der y-Achse:</strong> Dort gilt x = 0.<br>
    y = ${f2.m}·0 ${
    f2.n >= 0 ? "+ " + f2.n : "- " + Math.abs(f2.n)
  } = ${y0Correct}.<br>
    Der Punkt ist also (0 | ${y0Correct}).
  `;
  showExplanation("c", exp);
}

// d) Graphen (3)–(5)
function explainD(f3, f4, f5) {
  renderGraphSet("graph-d", [f3, f4, f5]);

  const exp = `
    Im Koordinatensystem wurden die Graphen der Funktionen (3), (4) und (5) eingezeichnet.<br><br>
    <strong>Funktion (3):</strong> <code>${funktionsText(f3)}</code><br>
    • Steigung m = ${f3.m}, y-Achsenabschnitt n = ${f3.n}.<br><br>

    <strong>Funktion (4):</strong> <code>${funktionsText(f4)}</code><br>
    • Steigung m = ${f4.m}, y-Achsenabschnitt n = ${f4.n}.<br><br>

    <strong>Funktion (5):</strong> <code>${funktionsText(f5)}</code><br>
    • Steigung m = ${f5.m}, y-Achsenabschnitt n = ${f5.n}.<br><br>

    Alle drei Geraden sind nach dem gleichen Schema gezeichnet:<br>
    1. Punkt auf der y-Achse eintragen (0 | n).<br>
    2. Mit Hilfe der Steigung m vom y-Achsenabschnitt aus weitere Punkte markieren.<br>
    3. Punkte mit einer Geraden verbinden und in beide Richtungen verlängern.
  `;
  setFeedback("d", "", true);
  showExplanation("d", exp);
}

// e) Nullstellen von (4) und (5)
function checkE(f4, f5) {
  const x4Input = document.querySelector(
    'input[data-task="e"][data-role="x4"]'
  );
  const x5Input = document.querySelector(
    'input[data-task="e"][data-role="x5"]'
  );

  const x4Val = parseNumberToken(x4Input.value || "");
  const x5Val = parseNumberToken(x5Input.value || "");

  const x4Corr = -f4.n / f4.m;
  const x5Corr = -f5.n / f5.m;

  const ok4 = x4Val !== null && Math.abs(x4Val - x4Corr) < 1e-6;
  const ok5 = x5Val !== null && Math.abs(x5Val - x5Corr) < 1e-6;
  const ok = ok4 && ok5;

  let msg;
  if (ok4 && ok5) msg = "✅ Beide Nullstellen sind korrekt.";
  else if (ok4 || ok5)
    msg = "⚠️ Eine Nullstelle stimmt, die andere nicht ganz.";
  else msg = "❌ Beide Nullstellen sind (noch) nicht korrekt.";

  setFeedback("e", msg, ok);

  const exp = `
    <strong>Allgemein:</strong> Die Nullstelle einer linearen Funktion <code>y = mx + n</code> erhältst du,
    indem du y = 0 setzt und nach x auflöst:<br>
    0 = mx + n ⇒ mx = -n ⇒ x = -n / m.<br><br>

    <strong>Für Funktion (4):</strong> <code>${funktionsText(f4)}</code><br>
    x₀ = -n/m = -(${f4.n}) / ${f4.m} = ${x4Corr}.<br><br>

    <strong>Für Funktion (5):</strong> <code>${funktionsText(f5)}</code><br>
    x₀ = -n/m = -(${f5.n}) / ${f5.m} = ${x5Corr}.
  `;
  showExplanation("e", exp);
}

// f) Gemeinsame Eigenschaft (nur Erklärung)
function explainF(f1, f4) {
  let eigenschaft;
  if (f1.m > 0 && f4.m > 0)
    eigenschaft = "Beide sind streng monoton steigend (m > 0).";
  else if (f1.m < 0 && f4.m < 0)
    eigenschaft = "Beide sind streng monoton fallend (m < 0).";
  else
    eigenschaft =
      "Beide sind Geraden (lineare Funktionen) und haben genau eine Nullstelle.";

  const exp = `
    Mögliche gemeinsame Eigenschaften von (1) und (4):<br>
    • Beide sind lineare Funktionen, also Geraden.<br>
    • Jede besitzt genau eine Nullstelle.<br>
    • Jede hat eine konstante Steigung.<br><br>
    In diesem konkreten Fall gilt zusätzlich:<br>
    <strong>${eigenschaft}</strong>
  `;
  setFeedback(
    "f",
    "ℹ️ Deine Formulierung wird nicht automatisch bewertet.",
    true
  );
  showExplanation("f", exp);
}

// g) Punkt auf dem Graphen von (4)?
function checkG(f4) {
  const ansInput = document.querySelector(
    'input[data-task="g"][data-role="answer"]'
  );
  const ansRaw = (ansInput.value || "").trim().toLowerCase();
  const saysYes =
    ansRaw === "ja" || ansRaw === "j" || ansRaw === "yes";

  const fVal = f4.m * taskGPoint.x + f4.n;
  const reallyOnGraph = Math.abs(fVal - taskGPoint.y) < 1e-6;

  const ok =
    (saysYes && reallyOnGraph) || (!saysYes && !reallyOnGraph);
  const fb = ok
    ? "✅ Deine Einschätzung passt."
    : "❌ Deine Einschätzung stimmt nicht mit der Rechnung überein.";
  setFeedback("g", fb, ok);

  const exp = `
    Wir prüfen, ob S auf dem Graphen von (4) liegt.<br>
    Funktion (4): <code>${funktionsText(f4)}</code><br>
    Punkt S (${taskGPoint.x} | ${taskGPoint.y})<br><br>
    Setze x = ${taskGPoint.x} in die Funktionsgleichung ein:<br>
    y = ${f4.m}·${taskGPoint.x} ${
    f4.n >= 0 ? "+ " + f4.n : "- " + Math.abs(f4.n)
  } = ${fVal}.<br>
    Da der y-Wert von S ${taskGPoint.y} ist, gilt:<br>
    ${
      Math.abs(fVal - taskGPoint.y) < 1e-6
        ? "f(x) und y sind gleich ⇒ S liegt auf dem Graphen."
        : "f(x) und y sind verschieden ⇒ S liegt nicht auf dem Graphen."
    }
  `;
  showExplanation("g", exp);
}

// h) Fehlende Koordinaten zu (5)
function checkH(f5) {
  const pyInput = document.querySelector(
    'input[data-task="h"][data-role="py"]'
  );
  const qxInput = document.querySelector(
    'input[data-task="h"][data-role="qx"]'
  );

  const pyVal = parseNumberToken(pyInput.value || "");
  const qxVal = parseNumberToken(qxInput.value || "");

  const okPy = pyVal !== null && Math.abs(pyVal - taskHP.y) < 1e-6;
  const okQx = qxVal !== null && Math.abs(qxVal - taskHQ.x) < 1e-6;
  const ok = okPy && okQx;

  let msg;
  if (okPy && okQx) msg = "✅ Beide Koordinaten sind korrekt.";
  else if (okPy || okQx)
    msg = "⚠️ Eine Koordinate stimmt, die andere nicht.";
  else msg = "❌ Beide Koordinaten sind noch nicht korrekt.";
  setFeedback("h", msg, ok);

  const exp = `
    Funktion (5): <code>${funktionsText(f5)}</code><br><br>
    Punkt P hat x = ${taskHP.x}. Für den y-Wert gilt:<br>
    y = ${f5.m}·${taskHP.x} ${
    f5.n >= 0 ? "+ " + f5.n : "- " + Math.abs(f5.n)
  } = ${taskHP.y}.<br>
    Also P(${taskHP.x} | ${taskHP.y}).<br><br>
    Punkt Q hat y = ${taskHQ.y}. Wir lösen nach x:<br>
    ${taskHQ.y} = ${f5.m}x ${
    f5.n >= 0 ? "+ " + f5.n : "- " + Math.abs(f5.n)
  }<br>
    ⇒ ${f5.m}x = ${taskHQ.y} ${
    f5.n >= 0 ? "- " + f5.n : "+ " + Math.abs(f5.n)
  } = ${f5.m * taskHQ.x}<br>
    ⇒ x = ${f5.m * taskHQ.x} / ${f5.m} = ${taskHQ.x}.<br>
    Also Q(${taskHQ.x} | ${taskHQ.y}).
  `;
  showExplanation("h", exp);
}

// i) Monotonie & Symmetrie von (1)
function explainI(f1) {
  const steig =
    f1.m > 0 ? "streng monoton steigend" : "streng monoton fallend";
  const exp = `
    Funktion (1): <code>${funktionsText(f1)}</code><br><br>
    <strong>Monotonie:</strong><br>
    Die Steigung m = ${f1.m}.<br>
    • Wenn m > 0 → die Funktion ist <em>streng monoton steigend</em>.<br>
    • Wenn m < 0 → die Funktion ist <em>streng monoton fallend</em>.<br>
    Hier gilt: Die Funktion (1) ist <strong>${steig}</strong>.<br><br>
    <strong>Symmetrie:</strong><br>
    Allgemeine lineare Funktionen <code>y = mx + n</code> mit n ≠ 0 sind weder
    achsensymmetrisch zur y-Achse noch punktsymmetrisch zum Ursprung.<br>
    Nur im Spezialfall <code>y = mx</code> (also n = 0) ist die Funktion
    punktsymmetrisch zum Ursprung.
  `;
  setFeedback(
    "i",
    "ℹ️ Deine Beschreibung wird nicht automatisch bewertet.",
    true
  );
  showExplanation("i", exp);
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
});

