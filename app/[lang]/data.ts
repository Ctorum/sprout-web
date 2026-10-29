export const scopes = ["personal", "household", "company"] as const;
export type Scope = (typeof scopes)[number];

export type Goal = {
  id: string;
  target: number;
  months: number;
  start: string;
  history: number[];
};

export type Entry = {
  id: string;
  amount: number;
  kind: "debt" | "credit" | "invest";
  inDays: number;
};

export type Holding = { id: string; value: number; change: number };

export type ScopeData = {
  netWorth: number;
  income: number;
  expenses: number;
  goals: Goal[];
  upcoming: Entry[];
  holdings: Holding[];
};

export const scopeData: Record<Scope, ScopeData> = {
  personal: {
    netWorth: 84320,
    income: 7200,
    expenses: 5460,
    goals: [
      {
        id: "emergency",
        target: 30000,
        months: 24,
        start: "2025-11",
        history: [1200, 2500, 4100, 5400, 7000, 8600, 10100, 11800, 13400, 14900, 16100, 17200],
      },
      {
        id: "japan",
        target: 18000,
        months: 14,
        start: "2026-01",
        history: [900, 2100, 3200, 4500, 5600, 6900, 8100, 9300, 10400, 11400],
      },
      {
        id: "card",
        target: 9400,
        months: 10,
        start: "2026-03",
        history: [800, 1750, 2600, 3500, 4500, 5500, 6500, 7600],
      },
    ],
    upcoming: [
      { id: "cardInstallment", amount: 480, kind: "debt", inDays: 3 },
      { id: "salary", amount: 7200, kind: "credit", inDays: 5 },
      { id: "treasuryTopUp", amount: 1000, kind: "invest", inDays: 6 },
      { id: "internet", amount: 129, kind: "debt", inDays: 9 },
      { id: "friendRepay", amount: 350, kind: "credit", inDays: 12 },
    ],
    holdings: [
      { id: "treasurySelic", value: 22400, change: 11.2 },
      { id: "cdb", value: 14800, change: 10.4 },
      { id: "globalIndex", value: 9300, change: -3.4 },
    ],
  },
  household: {
    netWorth: 268900,
    income: 11400,
    expenses: 9870,
    goals: [
      {
        id: "apartment",
        target: 120000,
        months: 48,
        start: "2025-10",
        history: [2000, 5100, 8000, 11000, 13800, 16900, 19800, 22600, 25700, 28600, 31400, 34200, 36800],
      },
      {
        id: "familyTrip",
        target: 24000,
        months: 12,
        start: "2026-02",
        history: [1600, 3300, 4800, 6500, 8200, 9800, 11900, 13800, 15600],
      },
      {
        id: "homeReserve",
        target: 15000,
        months: 12,
        start: "2026-01",
        history: [900, 2300, 3600, 4800, 6200, 7600, 9300, 11000, 12700, 14400],
      },
    ],
    upcoming: [
      { id: "rent", amount: 3200, kind: "debt", inDays: 2 },
      { id: "combinedSalaries", amount: 11400, kind: "credit", inDays: 5 },
      { id: "apartmentFund", amount: 2500, kind: "invest", inDays: 6 },
      { id: "school", amount: 1850, kind: "debt", inDays: 8 },
      { id: "utilities", amount: 640, kind: "debt", inDays: 10 },
    ],
    holdings: [
      { id: "treasuryIpca", value: 96000, change: 10.9 },
      { id: "cdb", value: 41500, change: 10.4 },
      { id: "realEstate", value: 18700, change: -2.1 },
    ],
  },
  company: {
    netWorth: 412500,
    income: 26000,
    expenses: 21300,
    goals: [
      {
        id: "workingCapital",
        target: 80000,
        months: 12,
        start: "2026-01",
        history: [4000, 10500, 16000, 22800, 29000, 36400, 42000, 48900, 53600, 58200],
      },
      {
        id: "equipment",
        target: 45000,
        months: 20,
        start: "2025-09",
        history: [2300, 4600, 7000, 9200, 11600, 14000, 16200, 18500, 21000, 23800, 26600, 29000, 31200, 33500],
      },
      {
        id: "renovation",
        target: 35000,
        months: 10,
        start: "2026-04",
        history: [3200, 7000, 10100, 13400, 17000, 20500, 24100],
      },
    ],
    upcoming: [
      { id: "payroll", amount: 18500, kind: "debt", inDays: 4 },
      { id: "clientInvoice", amount: 26000, kind: "credit", inDays: 6 },
      { id: "supplier", amount: 5200, kind: "debt", inDays: 8 },
      { id: "taxes", amount: 7400, kind: "debt", inDays: 11 },
      { id: "equipmentInstallment", amount: 2300, kind: "debt", inDays: 14 },
    ],
    holdings: [
      { id: "cashReserve", value: 120000, change: 10.2 },
      { id: "receivables", value: 64000, change: 12.1 },
    ],
  },
};

export function goalProgress(goal: Goal) {
  const elapsed = goal.history.length;
  const saved = goal.history[elapsed - 1];
  const step = goal.target / goal.months;
  const plan = Array.from({ length: goal.months }, (_, i) => step * (i + 1));
  const [year, month] = goal.start.split("-").map(Number);
  const dates = Array.from(
    { length: goal.months },
    (_, i) => new Date(Date.UTC(year, month - 1 + i, 1)),
  );
  const monthsLeft = goal.months - elapsed;

  return {
    saved,
    plan,
    dates,
    share: saved / goal.target,
    aheadMonths: Math.round((saved - plan[elapsed - 1]) / step),
    monthlyNeeded: monthsLeft > 0 ? (goal.target - saved) / monthsLeft : 0,
    deadline: dates[goal.months - 1],
  };
}
