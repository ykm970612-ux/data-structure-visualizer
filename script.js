const LIMIT = { stack: 6, queue: 7 };
const DELAY = 500;

const structures = {
  stack: {
    name: "Stack",
    short: "LIFO 구조",
    title: "Stack",
    concept: "Stack은 마지막에 들어온 데이터가 가장 먼저 나가는 LIFO(Last In, First Out) 구조입니다. 브라우저 뒤로 가기, 함수 호출 스택, 실행 취소 기능에서 자주 사용됩니다.",
    operations: ["push: top 위치에 데이터 삽입", "pop: top 위치의 데이터 삭제", "top: 가장 위 데이터 확인", "overflow/underflow: 용량 초과와 빈 상태 오류 처리"],
    useCase: "브라우저 방문 기록, 괄호 검사, 재귀 함수 호출 관리, undo 기능",
    guide: "숫자를 입력하고 Push를 누르면 위쪽에 쌓입니다. Pop은 가장 위 데이터를 제거합니다.",
    complexity: [["push", "O(1)"], ["pop", "O(1)"], ["top", "O(1)"], ["search", "O(n)"]],
    primary: ["Push", "push"],
    actions: [["Pop", "pop"], ["Top 확인", "peekStack"]],
  },
  queue: {
    name: "Queue",
    short: "FIFO 구조",
    title: "Queue",
    concept: "Queue는 먼저 들어온 데이터가 먼저 나가는 FIFO(First In, First Out) 구조입니다. rear에서 삽입되고 front에서 삭제됩니다.",
    operations: ["enqueue: rear 위치에 데이터 삽입", "dequeue: front 위치의 데이터 삭제", "front/rear: 양 끝 데이터 확인", "empty: 데이터가 없는 상태 확인"],
    useCase: "프린터 대기열, 운영체제 작업 스케줄링, BFS 탐색, 메시지 큐",
    guide: "숫자를 입력하고 Enqueue를 누르면 뒤쪽에 들어갑니다. Dequeue는 앞쪽 데이터를 제거합니다.",
    complexity: [["enqueue", "O(1)"], ["dequeue", "O(1)"], ["front/rear", "O(1)"], ["search", "O(n)"]],
    primary: ["Enqueue", "enqueue"],
    actions: [["Dequeue", "dequeue"], ["Front 확인", "front"], ["Rear 확인", "rear"]],
  },
  list: {
    name: "Linked List",
    short: "노드와 포인터",
    title: "Linked List",
    concept: "Linked List는 각 노드가 데이터와 다음 노드를 가리키는 포인터를 함께 가지는 선형 자료구조입니다. 배열과 달리 메모리상 연속 배치가 필요하지 않습니다.",
    operations: ["insert: 새 노드 삽입", "delete: 특정 값을 가진 노드 삭제", "search: 노드를 순서대로 탐색", "pointer: 노드 간 연결 관계 표현"],
    useCase: "동적 메모리 관리, 음악 재생 목록, undo/redo 기록, 해시 체이닝",
    guide: "숫자를 입력하고 삽입, 삭제, 검색을 실행해 노드와 포인터 변화를 확인하세요.",
    complexity: [["insert at tail", "O(1) 또는 O(n)"], ["delete", "O(n)"], ["search", "O(n)"], ["access", "O(n)"]],
    primary: ["노드 삽입", "insertList"],
    actions: [["노드 삭제", "deleteList"], ["노드 검색", "searchList"]],
  },
  bst: {
    name: "Binary Search Tree",
    short: "정렬된 트리",
    title: "Binary Search Tree",
    concept: "Binary Search Tree는 왼쪽 자식은 부모보다 작고 오른쪽 자식은 부모보다 큰 값을 가지는 트리입니다. 균형이 좋으면 탐색, 삽입이 빠르게 동작합니다.",
    operations: ["insert: 루트부터 비교하며 위치 결정", "search: 값의 크기에 따라 왼쪽 또는 오른쪽 이동", "inorder: 왼쪽-루트-오른쪽 순회", "path animation: 삽입/탐색 경로 강조"],
    useCase: "정렬된 데이터 탐색, 인덱스 구조, 우선순위 기반 검색, 집합 자료형",
    guide: "숫자를 입력하고 Insert 또는 Search를 누르세요. Inorder는 트리를 오름차순으로 순회합니다.",
    complexity: [["insert", "O(log n) 평균, O(n) 최악"], ["search", "O(log n) 평균, O(n) 최악"], ["inorder", "O(n)"], ["space", "O(n)"]],
    primary: ["Insert", "insertBst"],
    actions: [["Search", "searchBst"], ["Inorder", "inorderBst"]],
  },
};

const state = {
  active: "stack",
  busy: false,
  data: { stack: [], queue: [], list: [], bst: [] },
  focus: [],
  found: null,
  warning: null,
  message: "",
};

const $ = (selector) => document.querySelector(selector);
const dom = {
  nav: $("#structureNav"),
  title: $("#structureTitle"),
  concept: $("#structureConcept"),
  operations: $("#operationList"),
  useCase: $("#useCaseText"),
  complexity: $("#complexityTable"),
  guide: $("#guideText"),
  input: $("#valueInput"),
  primary: $("#primaryAction"),
  actions: $("#actionButtons"),
  reset: $("#resetButton"),
  visualTitle: $("#visualTitle"),
  stage: d3.select("#visualStage"),
};

const actions = {
  push: () => addValue("stack", LIMIT.stack, "Stack의 top에 push했습니다."),
  enqueue: () => addValue("queue", LIMIT.queue, "Queue의 rear에 enqueue했습니다."),
  insertList: () => addValue("list", Infinity, "Linked List의 tail에 삽입했습니다."),
  insertBst,
  pop: () => removeValue("stack", "Stack underflow: 제거할 데이터가 없습니다.", "Stack에서 pop했습니다."),
  dequeue: () => removeValue("queue", "Queue empty: 제거할 데이터가 없습니다.", "Queue의 front에서 dequeue했습니다.", true),
  peekStack: () => peek("stack", "Stack이 비어 있어 top을 확인할 수 없습니다.", "현재 top 값"),
  front: () => peek("queue", "Queue가 비어 있어 front를 확인할 수 없습니다.", "현재 front 값", false),
  rear: () => peek("queue", "Queue가 비어 있어 rear를 확인할 수 없습니다.", "현재 rear 값"),
  deleteList,
  searchList,
  searchBst,
  inorderBst,
};

init();

function init() {
  dom.primary.addEventListener("click", () => run(structures[state.active].primary[1]));
  dom.reset.addEventListener("click", resetActive);
  dom.input.addEventListener("keydown", (event) => event.key === "Enter" && dom.primary.click());
  setMessage("숫자를 입력한 뒤 원하는 연산 버튼을 누르세요.");
  render();
}

function render() {
  const info = structures[state.active];
  renderNav();
  dom.title.textContent = info.title;
  dom.concept.textContent = info.concept;
  dom.guide.textContent = state.message || info.guide;
  dom.visualTitle.textContent = `${info.name} 동작 화면`;
  dom.operations.innerHTML = info.operations.map((text) => `<li>${text}</li>`).join("");
  dom.useCase.textContent = info.useCase;
  dom.complexity.innerHTML = info.complexity.map(([op, time]) => `<tr><td>${op}</td><td>${time}</td></tr>`).join("");
  renderControls(info);
  renderVisual();
}

function renderNav() {
  d3.select(dom.nav)
    .selectAll(".nav-card")
    .data(Object.entries(structures), ([key]) => key)
    .join("button")
    .attr("type", "button")
    .attr("class", ([key]) => `nav-card${key === state.active ? " active" : ""}`)
    .html(([, info]) => `<strong>${info.name}</strong><span>${info.short}</span>`)
    .on("click", (event, [key, info]) => {
      if (state.busy) return;
      state.active = key;
      clearMarks();
      setMessage(`${info.name} 화면으로 전환했습니다.`);
      render();
    });
}

function renderControls(info) {
  dom.primary.textContent = info.primary[0];
  dom.input.placeholder = state.active === "bst" ? "삽입/검색할 숫자" : "숫자 입력";
  d3.select(dom.actions)
    .selectAll("button")
    .data(info.actions)
    .join("button")
    .attr("type", "button")
    .attr("class", "secondary-button")
    .text(([label]) => label)
    .on("click", (event, [, action]) => run(action));
}

function renderVisual() {
  const renderers = { stack: renderStack, queue: renderQueue, list: renderList, bst: renderBst };
  dom.stage.html("");
  renderers[state.active]();
}

function renderStack() {
  const values = state.data.stack;
  if (showEmpty(values, "Stack이 비어 있습니다.<br>Push 연산으로 데이터를 추가하세요.")) return;
  const wrap = dom.stage.append("div").attr("class", "stack-view");
  wrap.append("div").attr("class", "stack-base");
  wrap.selectAll(".stack-item")
    .data(values)
    .join("div")
    .attr("class", (value, index) => itemClass(value, index === values.length - 1, "stack-item"))
    .text((value, index) => `${value}${index === values.length - 1 ? " · TOP" : ""}`);
}

function renderQueue() {
  const values = state.data.queue;
  if (showEmpty(values, "Queue가 비어 있습니다.<br>Enqueue 연산으로 데이터를 추가하세요.")) return;
  const wrap = dom.stage.append("div").attr("class", "queue-view");
  wrap.selectAll(".queue-item")
    .data(values)
    .join("div")
    .attr("class", (value, index) => itemClass(value, index === 0 || index === values.length - 1, "queue-item"))
    .html((value, index) => {
      const labels = [index === 0 && "FRONT", index === values.length - 1 && "REAR"].filter(Boolean).join(" / ");
      return `${labels ? `<span class="queue-label">${labels}</span>` : ""}${value}`;
    });
}

function renderList() {
  const values = state.data.list;
  if (showEmpty(values, "Linked List가 비어 있습니다.<br>노드를 삽입해 연결 구조를 만들어보세요.")) return;
  const wrap = dom.stage.append("div").attr("class", "linked-view");
  values.forEach((value, index) => {
    wrap.append("div")
      .attr("class", itemClass(value, state.focus.includes(value), "list-node"))
      .html(`<strong>${value}</strong><span class="node-index">node ${index}</span>`);
    wrap.append("span").attr("class", "pointer").text(index < values.length - 1 ? "→" : "∅");
  });
}

function renderBst() {
  const values = state.data.bst;
  if (showEmpty(values, "BST가 비어 있습니다.<br>Insert 연산으로 루트 노드를 만들어보세요.")) return;
  const levels = collectLevels(buildTree(values));
  const tree = dom.stage.append("div").attr("class", "tree-view");
  levels.forEach((level) => {
    const row = tree.append("div").attr("class", "tree-level");
    row.selectAll(".tree-slot")
      .data(level)
      .join("div")
      .attr("class", "tree-slot")
      .html((node) => node ? `<div class="${itemClass(node.value, state.focus.includes(node.value), "tree-node")}">${node.value}</div>` : "");
  });
}

function showEmpty(values, message) {
  if (values.length) return false;
  dom.stage.html(`<div class="empty-state">${message}</div>`);
  return true;
}

async function run(actionName) {
  if (state.busy || !actions[actionName]) return;
  state.busy = true;
  setButtons(true);
  await actions[actionName]();
  state.busy = false;
  setButtons(false);
}

async function addValue(key, limit, message) {
  const value = readNumber();
  if (value === null) return;
  if (state.data[key].length >= limit) return fail(`${structures[key]?.name || "자료구조"} overflow: 최대 ${limit}개까지만 저장할 수 있습니다.`, value);
  state.data[key].push(value);
  mark(value, "found");
  setMessage(`${value}를 ${message}`);
  render();
  await pauseAndClear();
}

async function removeValue(key, emptyMessage, doneMessage, fromFront = false) {
  const values = state.data[key];
  if (!values.length) return fail(emptyMessage);
  const value = fromFront ? values[0] : values.at(-1);
  mark(value, "found");
  render();
  await sleep(DELAY);
  fromFront ? values.shift() : values.pop();
  setMessage(`${value}를 ${doneMessage}`);
  clearMarks();
  render();
}

async function peek(key, emptyMessage, label, useLast = true) {
  const values = state.data[key];
  if (!values.length) return fail(emptyMessage);
  const value = useLast ? values.at(-1) : values[0];
  mark(value, "found");
  setMessage(`${label}은 ${value}입니다.`);
  render();
  await pauseAndClear();
}

async function deleteList() {
  const value = readNumber();
  if (value === null) return;
  const values = state.data.list;
  const index = values.indexOf(value);
  await animate(values.slice(0, index === -1 ? values.length : index + 1));
  if (index === -1) return fail(`${value} 노드를 찾지 못해 삭제하지 않았습니다.`);
  values.splice(index, 1);
  setMessage(`${value} 노드를 삭제하고 포인터를 다시 연결했습니다.`);
  clearMarks();
  render();
}

async function searchList() {
  const value = readNumber();
  if (value === null) return;
  const found = await animate(state.data.list, value);
  setMessage(found ? `${value} 노드를 찾았습니다.` : `${value} 노드는 Linked List에 없습니다.`);
  render();
  await pauseAndClear();
}

async function insertBst() {
  const value = readNumber();
  if (value === null) return;
  if (state.data.bst.includes(value)) return fail(`${value}는 이미 BST에 존재합니다.`, value);
  await animate(getBstPath(value));
  state.data.bst.push(value);
  mark(value, "found");
  setMessage(`${value}를 BST 규칙에 맞는 위치에 삽입했습니다.`);
  render();
  await pauseAndClear();
}

async function searchBst() {
  const value = readNumber();
  if (value === null) return;
  const path = getBstPath(value);
  await animate(path);
  const found = state.data.bst.includes(value);
  found ? mark(value, "found") : mark(path.at(-1), "warning");
  setMessage(found ? `${value}를 BST에서 찾았습니다.` : `${value}는 BST에 없습니다.`);
  render();
  await pauseAndClear();
}

async function inorderBst() {
  if (!state.data.bst.length) return fail("BST가 비어 있어 inorder 순회를 실행할 수 없습니다.");
  const order = inorder(buildTree(state.data.bst));
  await animate(order);
  setMessage(`Inorder traversal 결과: ${order.join(" → ")}`);
  render();
  await pauseAndClear();
}

function resetActive() {
  if (state.busy) return;
  state.data[state.active] = [];
  clearMarks();
  setMessage(`${structures[state.active].name}를 초기화했습니다.`);
  render();
}

async function animate(values, target) {
  let found = false;
  for (const value of values) {
    state.focus = [value];
    render();
    await sleep(DELAY);
    if (value === target) {
      found = true;
      mark(value, "found");
      render();
      break;
    }
  }
  return found;
}

function getBstPath(target) {
  const path = [];
  for (let node = buildTree(state.data.bst); node;) {
    path.push(node.value);
    if (target === node.value) break;
    node = target < node.value ? node.left : node.right;
  }
  return path;
}

function buildTree(values) {
  return values.reduce((root, value) => insertNode(root, value), null);
}

function insertNode(node, value) {
  if (!node) return { value, left: null, right: null };
  if (value < node.value) node.left = insertNode(node.left, value);
  if (value > node.value) node.right = insertNode(node.right, value);
  return node;
}

function collectLevels(root) {
  const levels = [];
  for (let queue = [root], depth = 0; queue.some(Boolean) && depth < 5; depth += 1) {
    levels.push(queue);
    queue = queue.flatMap((node) => node ? [node.left, node.right] : [null, null]);
  }
  return levels;
}

function inorder(node, result = []) {
  if (!node) return result;
  inorder(node.left, result);
  result.push(node.value);
  inorder(node.right, result);
  return result;
}

function readNumber() {
  const raw = dom.input.value.trim();
  if (!raw) return fail("빈 값은 입력할 수 없습니다. 숫자를 입력해 주세요.");
  const value = Number(raw);
  if (!Number.isInteger(value)) return fail("정수만 입력할 수 있습니다.");
  if (value < -999 || value > 999) return fail("입력값은 -999부터 999 사이의 정수만 허용합니다.");
  dom.input.value = "";
  return value;
}

function fail(message, value = null) {
  if (value !== null) mark(value, "warning");
  setMessage(message);
  render();
  return null;
}

function itemClass(value, baseHighlight, baseClass) {
  return [
    baseClass,
    baseHighlight || state.focus.includes(value) ? "highlight" : "",
    state.found === value ? "found" : "",
    state.warning === value ? "warning" : "",
  ].filter(Boolean).join(" ");
}

function mark(value, type) {
  state.focus = value === undefined || value === null ? [] : [value];
  state.found = type === "found" ? value : null;
  state.warning = type === "warning" ? value : null;
}

function clearMarks() {
  state.focus = [];
  state.found = null;
  state.warning = null;
}

async function pauseAndClear() {
  await sleep(DELAY);
  clearMarks();
  render();
}

function setMessage(message) {
  state.message = message;
}

function setButtons(disabled) {
  document.querySelectorAll("button").forEach((button) => {
    button.disabled = disabled;
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
