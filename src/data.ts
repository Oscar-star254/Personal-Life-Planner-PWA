export type Item = {
  id: string;
  area: "student" | "child" | "business" | "money";
  type: string;
  title: string;
  subtitle?: string;
  date: string;
  time?: string;
  done?: boolean;
  amount?: number;
  priority?: "high" | "medium" | "low";
  status?: string;
};

export type AppData = {
  version: 1;
  items: Item[];
  profile: Profile;
  courses: Course[];
};

export type Profile = {
  fullName: string;
  photo: string;
  phone: string;
  email: string;
  county: string;
  institution: string;
  registrationNumber: string;
  programme: string;
  academicYear: string;
  semester: string;
  childName: string;
  childBirthDate: string;
  businessName: string;
  currency: string;
  paymentMethod: string;
};

export type Course = {
  code: string;
  title: string;
  lecturer: string;
  venue: string;
  day: string;
  time: string;
  credits: number;
};

const today = new Date().toISOString().slice(0, 10);

const starterData: AppData = {
  version: 1,
  profile: {
    fullName: "Amina Mwangi",
    photo: "",
    phone: "+254 712 345 678",
    email: "amina@example.com",
    county: "Kiambu",
    institution: "Jomo Kenyatta University of Agriculture and Technology",
    registrationNumber: "SCT/0000/2024",
    programme: "BSc Statistics",
    academicYear: "Year 2",
    semester: "Semester 1",
    childName: "Nia",
    childBirthDate: "2022-02-14",
    businessName: "Amina Collections",
    currency: "KES — Kenyan Shilling",
    paymentMethod: "M-Pesa",
  },
  courses: [
    { code: "STA 2200", title: "Probability Theory", lecturer: "Not set", venue: "Not set", day: "Monday", time: "8:00 AM", credits: 3 },
    { code: "STA 2201", title: "Distribution Theory", lecturer: "Not set", venue: "Not set", day: "Monday", time: "11:00 AM", credits: 3 },
    { code: "STA 2202", title: "Statistical Inference I", lecturer: "Not set", venue: "Not set", day: "Tuesday", time: "9:00 AM", credits: 3 },
    { code: "STA 2203", title: "Design and Analysis of Sample Surveys", lecturer: "Not set", venue: "Not set", day: "Wednesday", time: "10:00 AM", credits: 3 },
    { code: "STA 2204", title: "Statistical Computing I", lecturer: "Not set", venue: "Not set", day: "Thursday", time: "2:00 PM", credits: 3 },
    { code: "SMA 2200", title: "Linear Algebra II", lecturer: "Not set", venue: "Not set", day: "Friday", time: "8:00 AM", credits: 3 },
  ],
  items: [
    { id: "class", area: "student", type: "class", title: "Statistical Inference I", subtitle: "JKUAT Main Campus", date: today, time: "10:00 AM" },
    { id: "assignment", area: "student", type: "assignment", title: "Probability Theory assignment", subtitle: "Due tomorrow", date: today, time: "11:59 PM", priority: "high" },
    { id: "pickup", area: "child", type: "pickup", title: "Daycare pickup", subtitle: "Little Steps Daycare", date: today, time: "4:30 PM" },
    { id: "medicine", area: "child", type: "medicine", title: "Vitamin drops", subtitle: "2.5 ml after dinner", date: today, time: "7:00 PM" },
    { id: "delivery", area: "business", type: "order", title: "Deliver order to Wanjiku", subtitle: "Order #104 · Kileleshwa", date: today, time: "2:15 PM", status: "in progress" },
    { id: "exam", area: "student", type: "exam", title: "Distribution Theory CAT", subtitle: "Friday · Assembly Hall", date: "2025-06-20", priority: "high" },
    { id: "reading", area: "student", type: "study", title: "Revise Statistical Inference", subtitle: "Due in 3 days", date: "2025-06-20", priority: "medium" },
    { id: "breakfast", area: "child", type: "routine", title: "Breakfast", subtitle: "Porridge & banana", date: today, time: "7:30 AM", done: true },
    { id: "nap", area: "child", type: "routine", title: "Nap time", subtitle: "At daycare", date: today, time: "1:00 PM", done: true },
    { id: "order2", area: "business", type: "order", title: "Achieng · 2 bracelets", subtitle: "Order #105 · Ksh 1,800", date: "2025-06-20", status: "pending" },
    { id: "order3", area: "business", type: "order", title: "Kamau · Gift hamper", subtitle: "Order #103 · Ksh 3,500", date: today, status: "paid", done: true },
    { id: "rent", area: "money", type: "expense", title: "Shop rent", subtitle: "M-Pesa · Today", date: today, amount: -8500 },
    { id: "sale", area: "money", type: "income", title: "Order payment", subtitle: "M-Pesa · Yesterday", date: today, amount: 3500 },
    { id: "transport", area: "money", type: "expense", title: "Transport", subtitle: "Cash · Yesterday", date: today, amount: -320 },
  ],
};

const KEY = "dayweave-data-v1";

export function loadData(): AppData {
  try {
    const stored = localStorage.getItem(KEY);
    if (!stored) return starterData;
    const parsed = JSON.parse(stored) as Partial<AppData>;
    return {
      ...starterData,
      ...parsed,
      profile: { ...starterData.profile, ...parsed.profile },
      courses: parsed.courses?.length ? parsed.courses : starterData.courses,
      items: parsed.items || starterData.items,
    };
  } catch {
    return starterData;
  }
}

export function saveData(data: AppData) {
  localStorage.setItem(KEY, JSON.stringify(data));
  if ("indexedDB" in window) {
    const request = indexedDB.open("dayweave", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("data");
    request.onsuccess = () => {
      const transaction = request.result.transaction("data", "readwrite");
      transaction.objectStore("data").put(data, "app");
    };
  }
}

function download(content: string, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportJson(data: AppData) {
  download(JSON.stringify(data, null, 2), `dayweave-backup-${today}.json`, "application/json");
}

export function exportCsv(data: AppData) {
  const quote = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const columns: (keyof Item)[] = ["date", "time", "area", "type", "title", "subtitle", "status", "amount", "done"];
  const rows = [columns.join(","), ...data.items.map((item) => columns.map((column) => quote(item[column])).join(","))];
  download(rows.join("\n"), `dayweave-records-${today}.csv`, "text/csv");
}
