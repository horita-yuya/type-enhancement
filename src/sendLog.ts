type EventName = "page_view" | "click";
type EventPayload = {
  page_view: { id: string };
  click: undefined;
};

function sendLog0(event: string, payload?: Record<string, string | number>) {
  console.log({ eventName: event, ...payload });
}

sendLog0("page_view", { id: "123" });
sendLog0("click");
sendLog0("page_view");
sendLog0("click", undefined);

// Pattern1: Tuples in rest parameters
// https://github.com/Microsoft/TypeScript/pull/24897
function sendLog<E extends EventName>(
  event: E,
  ...options: EventPayload[E] extends undefined ? [] : [EventPayload[E]]
) {
  const data = options[0] ?? {};
  const payload = {
    eventName: event,
    ...data,
  };

  console.log(payload);
}

sendLog("page_view", { id: "123" });
sendLog("click");
// sendLog("page_view"); // Error
// sendLog("click", undefined); // Error

// Pattern2: Overload
// https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads
function sendLog2<E extends EventName>(
  event: EventPayload[E] extends undefined ? never : E,
  payload: EventPayload[E],
): void;
function sendLog2<E extends EventName>(event: EventPayload[E] extends undefined ? E : never): void;
function sendLog2<E extends EventName>(event: E, payload?: EventPayload[E]) {
  console.log({ eventName: event, ...payload });
}

sendLog2("page_view", { id: "123" });
sendLog2("click");
// sendLog2("page_view"); // Error
// sendLog2("click", undefined); // Error

console.info("sendLog check completed");
