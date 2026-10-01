import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { exportCsv, exportJson, loadData, saveData, type AppData, type Item, type Profile } from "./data";
import { Icon, type IconName } from "./icons";

type Screen = "today" | "student" | "child" | "business" | "money" | "calendar" | "profile" | "settings";
type Area = Item["area"];

const areaMeta: Record<Area, { label: string; className: string }> = {
  student: { label: "Student", className: "student" },
  child: { label: "Child", className: "child" },
  business: { label: "Business", className: "business" },
  money: { label: "Money", className: "money" },
};

const screenTitles: Record<Screen, string> = {
  today: "Today",
  student: "Student",
  child: "Child care",
  business: "Business",
  money: "Finances",
  calendar: "Calendar",
  profile: "My profile",
  settings: "Settings",
};

function Button({
  children,
  onClick,
  className = "",
  ariaLabel,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  type?: "button" | "submit";
}) {
  return (
    <button type={type} onClick={onClick} className={className} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

function Badge({ area }: { area: Area }) {
  return <span className={`badge ${areaMeta[area].className}`}>{areaMeta[area].label}</span>;
}

function Empty({ icon, title, text }: { icon: IconName; title: string; text: string }) {
  return (
    <div className="empty">
      <span className="empty-icon"><Icon name={icon} size={22} /></span>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

function ItemRow({
  item,
  onToggle,
  trailing,
}: {
  item: Item;
  onToggle?: (id: string) => void;
  trailing?: ReactNode;
}) {
  return (
    <div className={`item-row ${item.done ? "is-done" : ""}`}>
      {onToggle ? (
        <Button className="check" onClick={() => onToggle(item.id)} ariaLabel={`Mark ${item.title} complete`}>
          {item.done && <Icon name="check" size={14} />}
        </Button>
      ) : (
        <span className={`area-dot ${item.area}`} />
      )}
      <div className="item-copy">
        <strong>{item.title}</strong>
        <span>{item.subtitle || item.time || item.date}</span>
      </div>
      {trailing || (item.time && <span className="item-time">{item.time}</span>)}
    </div>
  );
}

function Card({
  title,
  icon,
  area,
  children,
  action,
}: {
  title: string;
  icon: IconName;
  area?: Area;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="card">
      <div className="card-head">
        <div className="card-title">
          <span className={`icon-box ${area || ""}`}><Icon name={icon} size={18} /></span>
          <h2>{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Header({
  screen,
  onNavigate,
  dark,
  setDark,
  profile,
}: {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
  dark: boolean;
  setDark: (value: boolean) => void;
  profile: Profile;
}) {
  const date = new Intl.DateTimeFormat("en-KE", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{screen === "today" ? date : "My day, in one place"}</p>
        <h1>{screenTitles[screen]}</h1>
      </div>
      <div className="head-actions">
        <Button className="icon-button" onClick={() => setDark(!dark)} ariaLabel="Toggle dark mode">
          <Icon name={dark ? "sun" : "moon"} size={19} />
        </Button>
        <Button className={`avatar ${profile.photo ? "has-photo" : ""}`} onClick={() => onNavigate("profile")} ariaLabel="Open profile">
          {profile.photo ? <img src={profile.photo} alt="" /> : profile.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}
        </Button>
      </div>
    </header>
  );
}

function Today({
  data,
  onToggle,
  onCapture,
  onNavigate,
}: {
  data: AppData;
  onToggle: (id: string) => void;
  onCapture: (area?: Area) => void;
  onNavigate: (screen: Screen) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const items = data.items.filter((item) => item.date === today || item.date === "today").slice(0, 5);
  const done = items.filter((item) => item.done).length;
  return (
    <>
      <section className="welcome">
        <div>
          <p>Habari, {data.profile.fullName.split(" ")[0]}</p>
          <h2>You have <em>{Math.max(items.length - done, 0)} things</em> to focus on today.</h2>
        </div>
        <div className="progress-ring" aria-label={`${done} of ${items.length} tasks complete`}>
          <span>{items.length ? Math.round((done / items.length) * 100) : 0}%</span>
        </div>
      </section>

      <div className="clash">
        <span><Icon name="spark" size={18} /></span>
        <div><strong>Busy window at 2:00 PM</strong><p>Your lecture and order delivery are close together.</p></div>
        <Button className="text-button" onClick={() => onNavigate("calendar")}>View</Button>
      </div>

      <Card title="Today's focus" icon="sun">
        <div className="item-list">
          {items.length ? items.map((item) => <ItemRow key={item.id} item={item} onToggle={onToggle} />) : (
            <Empty icon="check" title="All clear" text="Use quick capture to add something." />
          )}
        </div>
      </Card>

      <div className="section-heading">
        <div><p className="eyebrow">Your spaces</p><h2>At a glance</h2></div>
      </div>
      <div className="space-grid">
        <Button className="space-card student" onClick={() => onNavigate("student")}>
          <span className="space-icon"><Icon name="book" size={20} /></span>
          <span><small>{data.profile.programme}</small><strong>2 deadlines</strong><em>{data.profile.academicYear} · {data.profile.semester}</em></span>
          <Icon name="chevron" size={18} />
        </Button>
        <Button className="space-card child" onClick={() => onNavigate("child")}>
          <span className="space-icon"><Icon name="heart" size={20} /></span>
          <span><small>Child care</small><strong>Pickup at 4:30</strong><em>Medicine at 7:00</em></span>
          <Icon name="chevron" size={18} />
        </Button>
        <Button className="space-card business" onClick={() => onNavigate("business")}>
          <span className="space-icon"><Icon name="bag" size={20} /></span>
          <span><small>{data.profile.businessName}</small><strong>3 active orders</strong><em>1 low stock alert</em></span>
          <Icon name="chevron" size={18} />
        </Button>
        <Button className="space-card money" onClick={() => onNavigate("money")}>
          <span className="space-icon"><Icon name="wallet" size={20} /></span>
          <span><small>Money</small><strong>Ksh 12,450</strong><em>Available this month</em></span>
          <Icon name="chevron" size={18} />
        </Button>
      </div>

      <Card title="Money due" icon="wallet" area="money" action={<Button className="text-button" onClick={() => onCapture("money")}>Add</Button>}>
        <ItemRow item={{ id: "fee", area: "money", type: "bill", title: "Daycare fee", subtitle: "Due Friday", date: "today", amount: 4500 }} trailing={<strong className="amount">Ksh 4,500</strong>} />
        <ItemRow item={{ id: "owed", area: "business", type: "debt", title: "Njeri owes you", subtitle: "Order #104", date: "today", amount: 2200 }} trailing={<strong className="amount positive">+ Ksh 2,200</strong>} />
      </Card>
    </>
  );
}

function Student({ data, onToggle, onAdd }: { data: AppData; onToggle: (id: string) => void; onAdd: () => void }) {
  const assignments = data.items.filter((i) => i.area === "student" && ["assignment", "exam", "study"].includes(i.type));
  return (
    <>
      <section className="jkuat-banner">
        <span className="kenya-stripe" />
        <div><p>Jomo Kenyatta University</p><h2>{data.profile.programme}</h2><span>{data.profile.academicYear} · {data.profile.semester} · Main Campus</span></div>
        <strong>JKUAT</strong>
      </section>
      <div className="metric-grid">
        <div className="metric student"><span><Icon name="book" size={18} /></span><strong>5</strong><small>Courses</small></div>
        <div className="metric"><span><Icon name="target" size={18} /></span><strong>3.6</strong><small>GPA</small></div>
        <div className="metric"><span><Icon name="check" size={18} /></span><strong>92%</strong><small>Attendance</small></div>
      </div>
      <Card title="Next class" icon="clock" area="student">
        <div className="feature-row student">
          <div className="date-block"><strong>10:00</strong><span>AM</span></div>
          <div><Badge area="student" /><h3>{data.courses[0]?.title || "Next class"}</h3><p>{data.courses[0]?.code} · {data.courses[0]?.venue}</p></div>
        </div>
      </Card>
      <Card title="Year 2 · Semester 1 units" icon="book" area="student" action={<span className="curriculum-count">{data.courses.length} units</span>}>
        <p className="curriculum-note">Your JKUAT Statistics curriculum workspace. Confirm unit codes against your current student portal, then update timetable details in your profile.</p>
        <div className="course-list">
          {data.courses.map((course) => (
            <div className="course-row" key={course.code}>
              <span>{course.code}</span>
              <div><strong>{course.title}</strong><p>{course.day} · {course.time} · {course.venue}</p></div>
              <em>{course.credits} CU</em>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Assignments & exams" icon="clipboard" area="student" action={<Button className="text-button" onClick={onAdd}>Add</Button>}>
        {assignments.map((item) => <ItemRow key={item.id} item={item} onToggle={onToggle} trailing={<span className={`priority ${item.priority || "medium"}`}>{item.priority || "Medium"}</span>} />)}
      </Card>
      <Card title="Study plan" icon="calendar" area="student">
        <div className="week-strip">{["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i} className={i === 2 ? "active" : ""}>{d}<small>{12 + i}</small></span>)}</div>
        <ItemRow item={{ id: "study", area: "student", type: "study", title: "Review statistics notes", subtitle: "45 min focus session", date: "today", time: "8:30 PM" }} />
      </Card>
    </>
  );
}

function Child({ data, onToggle, onAdd }: { data: AppData; onToggle: (id: string) => void; onAdd: () => void }) {
  const childItems = data.items.filter((i) => i.area === "child");
  return (
    <>
      <section className="profile-banner child">
        <div className="child-avatar">N</div>
        <div><p>My child</p><h2>{data.profile.childName}</h2><span>Born {new Intl.DateTimeFormat("en-KE", { dateStyle: "medium" }).format(new Date(data.profile.childBirthDate))}</span></div>
        <Button className="soft-button" onClick={onAdd}>Add update</Button>
      </section>
      <Card title="Today's routine" icon="sun" area="child" action={<span className="subtle">3 of 5 done</span>}>
        {childItems.filter((i) => ["routine", "pickup", "medicine"].includes(i.type)).map((item) => <ItemRow key={item.id} item={item} onToggle={onToggle} />)}
      </Card>
      <Card title="Care coverage" icon="users" area="child">
        <div className="coverage">
          <div><span className="tiny-avatar">MK</span><div><strong>Mum</strong><p>8:00 AM – 1:30 PM</p></div></div>
          <div><span className="tiny-avatar alt">JW</span><div><strong>James</strong><p>1:30 PM – 5:30 PM</p></div></div>
        </div>
        <div className="coverage-note"><Icon name="check" size={15} /> Covered during all your classes</div>
      </Card>
      <div className="two-cards">
        <Card title="Health" icon="plus" area="child"><strong>Clinic visit</strong><p className="subtle">18 Jun · 9:00 AM</p></Card>
        <Card title="Milestones" icon="spark" area="child"><strong>New words</strong><p className="subtle">Added 2 days ago</p></Card>
      </div>
    </>
  );
}

function Business({ data, onToggle, onAdd }: { data: AppData; onToggle: (id: string) => void; onAdd: () => void }) {
  const orders = data.items.filter((i) => i.area === "business" && i.type === "order");
  return (
    <>
      <section className="profit-banner">
        <div><p>{data.profile.businessName} · monthly profit</p><h2>Ksh 18,650</h2><span><Icon name="up" size={14} /> 12% from last month</span></div>
        <div className="mini-bars">{[40, 62, 48, 76, 56, 90, 72].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div>
      </section>
      <div className="metric-grid business-metrics">
        <div className="metric"><strong>3</strong><small>Active orders</small></div>
        <div className="metric"><strong>8</strong><small>Customers</small></div>
        <div className="metric warning"><strong>1</strong><small>Low stock</small></div>
      </div>
      <Card title="Orders" icon="bag" area="business" action={<Button className="text-button" onClick={onAdd}>New order</Button>}>
        {orders.map((item) => <ItemRow key={item.id} item={item} onToggle={onToggle} trailing={<span className={`status ${item.status?.replace(" ", "-")}`}>{item.status}</span>} />)}
      </Card>
      <Card title="Stock watch" icon="box" area="business">
        <div className="stock-row"><div><strong>Packaging boxes</strong><p>4 remaining</p></div><div className="stock-track"><span /></div><span className="priority high">Low</span></div>
        <div className="stock-row"><div><strong>Beaded bracelets</strong><p>18 remaining</p></div><div className="stock-track healthy"><span /></div><span className="priority low">Good</span></div>
      </Card>
    </>
  );
}

function Money({ data, onAdd }: { data: AppData; onAdd: () => void }) {
  const expenses = data.items.filter((i) => i.area === "money" && i.amount);
  return (
    <>
      <div className="balance-card">
        <p>Available this month</p><h2>Ksh 12,450</h2>
        <div><span><small>Income</small><strong>+ Ksh 34,200</strong></span><span><small>Spent</small><strong>− Ksh 21,750</strong></span></div>
      </div>
      <div className="segment"><Button className="active">Personal</Button><Button>Business</Button></div>
      <Card title="Monthly budget" icon="chart" area="money">
        <div className="budget-head"><div><strong>Ksh 21,750</strong><span> of Ksh 30,000</span></div><strong>72%</strong></div>
        <div className="budget-track"><span /></div>
        <div className="budget-key"><span><i className="money" />Spent</span><span><i />Ksh 8,250 left</span></div>
      </Card>
      <Card title="Recent activity" icon="wallet" area="money" action={<Button className="text-button" onClick={onAdd}>Add expense</Button>}>
        {expenses.length ? expenses.map((item) => <ItemRow key={item.id} item={item} trailing={<strong className={item.amount! > 0 ? "amount positive" : "amount"}>{item.amount! > 0 ? "+" : "−"} Ksh {Math.abs(item.amount!).toLocaleString()}</strong>} />) : <Empty icon="wallet" title="No transactions yet" text="Add your first income or expense." />}
      </Card>
      <Card title="Savings goal" icon="target" area="money">
        <div className="saving"><span className="saving-icon"><Icon name="home" size={20} /></span><div><strong>Emergency fund</strong><p>Ksh 24,000 of Ksh 50,000</p><div className="budget-track"><span style={{ width: "48%" }} /></div></div><strong>48%</strong></div>
      </Card>
    </>
  );
}

function CalendarView({ data }: { data: AppData }) {
  const [selected, setSelected] = useState(17);
  const days = Array.from({ length: 35 }, (_, i) => i - 2);
  const selectedItems = data.items.filter((item) => item.date === "today" || item.date.endsWith(`-${String(selected).padStart(2, "0")}`));
  return (
    <>
      <section className="calendar-card">
        <div className="calendar-head"><Button className="icon-button"><Icon name="chevronLeft" size={18} /></Button><h2>June 2025</h2><Button className="icon-button"><Icon name="chevron" size={18} /></Button></div>
        <div className="calendar-grid labels">{["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
        <div className="calendar-grid">
          {days.map((day, i) => day < 1 || day > 30 ? <span key={i} /> : (
            <Button key={i} className={`calendar-day ${selected === day ? "selected" : ""}`} onClick={() => setSelected(day)}>
              {day}<i>{[12, 17, 20, 24].includes(day) && <><b className="student" /><b className={day === 17 ? "business" : "child"} /></>}</i>
            </Button>
          ))}
        </div>
        <div className="legend">{(["student", "child", "business", "money"] as Area[]).map((a) => <span key={a}><i className={a} />{areaMeta[a].label}</span>)}</div>
      </section>
      <div className="clash warning">
        <span><Icon name="alert" size={18} /></span><div><strong>Schedule clash</strong><p>Statistics class overlaps order delivery by 15 minutes.</p></div>
      </div>
      <Card title={`Tuesday, June ${selected}`} icon="calendar">
        {selectedItems.length ? selectedItems.map((item) => <ItemRow key={item.id} item={item} />) : <Empty icon="calendar" title="No plans this day" text="Tap the + button to add one." />}
      </Card>
    </>
  );
}

function ProfileEditor({ data, onSave }: { data: AppData; onSave: (profile: Profile) => void }) {
  const [draft, setDraft] = useState(data.profile);
  const [saved, setSaved] = useState(false);
  const update = (key: keyof Profile, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };
  const addPhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const size = 360;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d");
        if (!context) return;
        const crop = Math.min(image.width, image.height);
        context.drawImage(image, (image.width - crop) / 2, (image.height - crop) / 2, crop, crop, 0, 0, size, size);
        update("photo", canvas.toDataURL("image/jpeg", 0.78));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(draft);
    setSaved(true);
  };
  return (
    <form className="profile-editor" onSubmit={submit}>
      <section className="profile-hero">
        <span className="kenya-stripe" />
        <label className="photo-picker">
          {draft.photo ? <img src={draft.photo} alt="Your profile" /> : <span>{draft.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span>}
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && addPhoto(e.target.files[0])} />
          <i><Icon name="plus" size={15} /></i>
        </label>
        <div><h2>{draft.fullName || "Your name"}</h2><p>{draft.programme} · {draft.institution.includes("Jomo") ? "JKUAT" : draft.institution}</p><span>{draft.county} County, Kenya</span></div>
      </section>

      <Card title="Personal details" icon="users">
        <div className="profile-fields">
          <label className="field wide"><span>Full name</span><input value={draft.fullName} onChange={(e) => update("fullName", e.target.value)} /></label>
          <label className="field"><span>Phone</span><input type="tel" value={draft.phone} onChange={(e) => update("phone", e.target.value)} /></label>
          <label className="field"><span>Email</span><input type="email" value={draft.email} onChange={(e) => update("email", e.target.value)} /></label>
          <label className="field wide"><span>County</span><select value={draft.county} onChange={(e) => update("county", e.target.value)}>{["Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa","Homa Bay","Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi","Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos","Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a","Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri","Samburu","Siaya","Taita-Taveta","Tana River","Tharaka-Nithi","Trans Nzoia","Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot"].map((county) => <option key={county}>{county}</option>)}</select></label>
        </div>
      </Card>

      <Card title="JKUAT student profile" icon="book" area="student">
        <div className="profile-fields">
          <label className="field wide"><span>Institution</span><input value={draft.institution} onChange={(e) => update("institution", e.target.value)} /></label>
          <label className="field wide"><span>Registration number</span><input value={draft.registrationNumber} onChange={(e) => update("registrationNumber", e.target.value)} /></label>
          <label className="field wide"><span>Programme</span><input value={draft.programme} onChange={(e) => update("programme", e.target.value)} /></label>
          <label className="field"><span>Academic year</span><select value={draft.academicYear} onChange={(e) => update("academicYear", e.target.value)}>{["Year 1","Year 2","Year 3","Year 4"].map((year) => <option key={year}>{year}</option>)}</select></label>
          <label className="field"><span>Semester</span><select value={draft.semester} onChange={(e) => update("semester", e.target.value)}><option>Semester 1</option><option>Semester 2</option></select></label>
        </div>
      </Card>

      <Card title="Family & business" icon="heart" area="child">
        <div className="profile-fields">
          <label className="field"><span>Child's name</span><input value={draft.childName} onChange={(e) => update("childName", e.target.value)} /></label>
          <label className="field"><span>Child's date of birth</span><input type="date" value={draft.childBirthDate} onChange={(e) => update("childBirthDate", e.target.value)} /></label>
          <label className="field wide"><span>Business name</span><input value={draft.businessName} onChange={(e) => update("businessName", e.target.value)} /></label>
          <label className="field"><span>Currency</span><select value={draft.currency} onChange={(e) => update("currency", e.target.value)}><option>KES — Kenyan Shilling</option></select></label>
          <label className="field"><span>Default payment</span><select value={draft.paymentMethod} onChange={(e) => update("paymentMethod", e.target.value)}><option>M-Pesa</option><option>Cash</option><option>Bank transfer</option><option>Card</option></select></label>
        </div>
      </Card>
      <Button type="submit" className="primary-button"><Icon name="check" size={18} /> {saved ? "Changes saved" : "Save all details"}</Button>
      <p className="save-note"><Icon name="lock" size={14} /> Your profile and photo stay privately on this device</p>
    </form>
  );
}

function Settings({
  data,
  dark,
  setDark,
  onImport,
  pinEnabled,
  onPinToggle,
}: {
  data: AppData;
  dark: boolean;
  setDark: (value: boolean) => void;
  onImport: (file: File) => void;
  pinEnabled: boolean;
  onPinToggle: (enabled: boolean) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const requestNotifications = async () => {
    if ("Notification" in window) await Notification.requestPermission();
  };
  return (
    <>
      <Card title="Appearance & privacy" icon="settings">
        <label className="setting-row"><span><Icon name="moon" size={18} /><span><strong>Dark mode</strong><small>Gentler on your eyes at night</small></span></span><input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} /></label>
        <label className="setting-row"><span><Icon name="lock" size={18} /><span><strong>PIN lock</strong><small>Protect personal information</small></span></span><input type="checkbox" checked={pinEnabled} onChange={(e) => onPinToggle(e.target.checked)} /></label>
        <div className="setting-row"><span><Icon name="bell" size={18} /><span><strong>Reminders</strong><small>Allow local notifications</small></span></span><Button className="soft-button" onClick={requestNotifications}>Enable</Button></div>
      </Card>
      <Card title="Your data" icon="download">
        <p className="card-intro">Everything stays on this device. Export a backup regularly so your information is always safe.</p>
        <div className="action-stack">
          <Button className="action-button" onClick={() => exportJson(data)}><Icon name="download" size={18} /><span><strong>Export backup</strong><small>Download all data as JSON</small></span><Icon name="chevron" size={18} /></Button>
          <Button className="action-button" onClick={() => exportCsv(data)}><Icon name="file" size={18} /><span><strong>Export spreadsheet</strong><small>Download records as CSV</small></span><Icon name="chevron" size={18} /></Button>
          <Button className="action-button" onClick={() => fileRef.current?.click()}><Icon name="upload" size={18} /><span><strong>Import backup</strong><small>Restore from a JSON file</small></span><Icon name="chevron" size={18} /></Button>
          <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
        </div>
      </Card>
      <div className="offline-note"><Icon name="wifiOff" size={20} /><div><strong>Ready offline</strong><p>This app and your saved data work without internet.</p></div></div>
    </>
  );
}

function LockScreen({ onUnlock }: { onUnlock: (pin: string) => boolean }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!onUnlock(pin)) {
      setError(true);
      setPin("");
    }
  };
  return (
    <div className="lock-screen">
      <form className="lock-card" onSubmit={submit}>
        <span className="lock-mark"><Icon name="lock" size={25} /></span>
        <p className="eyebrow">DayWeave</p>
        <h1>Welcome back</h1>
        <p>Your life, plans and finances are protected.</p>
        <label className="field">
          <span>4-digit PIN</span>
          <input type="password" inputMode="numeric" maxLength={4} pattern="[0-9]{4}" value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setError(false); }} autoFocus />
        </label>
        {error && <span className="pin-error">That PIN was not correct. Try again.</span>}
        <Button className="primary-button" type="submit">Unlock</Button>
        <small><Icon name="wifiOff" size={13} /> Your PIN and data stay on this device</small>
      </form>
    </div>
  );
}

function QuickCapture({
  open,
  initialArea,
  onClose,
  onSave,
}: {
  open: boolean;
  initialArea: Area;
  onClose: () => void;
  onSave: (item: Item) => void;
}) {
  const [area, setArea] = useState<Area>(initialArea);
  const [type, setType] = useState("task");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  useEffect(() => setArea(initialArea), [initialArea, open]);
  if (!open) return null;
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: crypto.randomUUID(),
      title: title.trim(),
      area,
      type,
      date: "today",
      time: new Intl.DateTimeFormat("en-KE", { hour: "numeric", minute: "2-digit" }).format(new Date()),
      amount: amount ? (type === "income" ? Number(amount) : -Number(amount)) : undefined,
      done: false,
      status: type === "order" ? "pending" : undefined,
    });
    setTitle("");
    setAmount("");
  };
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="capture-sheet" onSubmit={submit}>
        <div className="sheet-handle" />
        <div className="sheet-head"><div><p className="eyebrow">Quick capture</p><h2>What needs your attention?</h2></div><Button className="icon-button" onClick={onClose} ariaLabel="Close"><Icon name="close" size={20} /></Button></div>
        <div className="capture-types">
          {["task", "note", "expense", "reminder"].map((value) => <Button key={value} className={type === value ? "active" : ""} onClick={() => setType(value)}><Icon name={value === "note" ? "file" : value === "expense" ? "wallet" : value === "reminder" ? "bell" : "check"} size={17} />{value}</Button>)}
        </div>
        <label className="field"><span>Details</span><textarea value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Submit marketing assignment" autoFocus /></label>
        <div className="form-grid">
          <label className="field"><span>Area</span><select value={area} onChange={(e) => setArea(e.target.value as Area)}>{Object.entries(areaMeta).map(([value, meta]) => <option value={value} key={value}>{meta.label}</option>)}</select></label>
          <label className="field"><span>When</span><input type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></label>
        </div>
        {type === "expense" && <label className="field"><span>Amount (Ksh)</span><input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" /></label>}
        <Button type="submit" className="primary-button"><Icon name="plus" size={18} /> Save capture</Button>
        <p className="save-note"><Icon name="wifiOff" size={14} /> Saves instantly, even offline</p>
      </form>
    </div>
  );
}

function MoreMenu({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const links: { screen: Screen; icon: IconName; label: string; detail: string; area?: Area }[] = [
    { screen: "profile", icon: "users", label: "My profile", detail: "Photo & personal details" },
    { screen: "child", icon: "heart", label: "Child care", detail: "Routine, health & care", area: "child" },
    { screen: "money", icon: "wallet", label: "Finances", detail: "Budgets, bills & savings", area: "money" },
    { screen: "calendar", icon: "calendar", label: "Calendar", detail: "Everything in one view" },
    { screen: "settings", icon: "settings", label: "Settings & backup", detail: "Privacy, theme & your data" },
  ];
  return <section className="more-menu">{links.map((link) => <Button key={link.screen} className="action-button" onClick={() => onNavigate(link.screen)}><span className={`icon-box ${link.area || ""}`}><Icon name={link.icon} size={19} /></span><span><strong>{link.label}</strong><small>{link.detail}</small></span><Icon name="chevron" size={18} /></Button>)}</section>;
}

export default function App() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [screen, setScreen] = useState<Screen>("today");
  const [moreOpen, setMoreOpen] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [captureArea, setCaptureArea] = useState<Area>("student");
  const [dark, setDark] = useState(() => localStorage.getItem("dayweave-theme") === "dark");
  const [pinEnabled, setPinEnabled] = useState(() => Boolean(localStorage.getItem("dayweave-pin")));
  const [locked, setLocked] = useState(() => Boolean(localStorage.getItem("dayweave-pin")));

  useEffect(() => { saveData(data); }, [data]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("dayweave-theme", dark ? "dark" : "light");
  }, [dark]);

  const toggle = (id: string) => setData((current) => ({ ...current, items: current.items.map((item) => item.id === id ? { ...item, done: !item.done } : item) }));
  const navigate = (next: Screen) => { setScreen(next); setMoreOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const capture = (area: Area = "student") => { setCaptureArea(area); setCaptureOpen(true); };
  const save = (item: Item) => { setData((current) => ({ ...current, items: [item, ...current.items] })); setCaptureOpen(false); };
  const importData = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as AppData;
      if (!Array.isArray(parsed.items)) throw new Error("Invalid backup");
      setData(parsed);
      alert("Backup restored successfully.");
    } catch { alert("That backup could not be imported."); }
  };
  const saveProfile = (profile: Profile) => setData((current) => ({ ...current, profile }));
  const togglePin = (enabled: boolean) => {
    if (enabled) {
      const pin = window.prompt("Choose a 4-digit PIN");
      if (!pin || !/^\d{4}$/.test(pin)) {
        if (pin !== null) alert("Please use exactly 4 numbers.");
        return;
      }
      localStorage.setItem("dayweave-pin", pin);
      setPinEnabled(true);
    } else {
      localStorage.removeItem("dayweave-pin");
      setPinEnabled(false);
    }
  };

  const content = useMemo(() => {
    if (screen === "student") return <Student data={data} onToggle={toggle} onAdd={() => capture("student")} />;
    if (screen === "child") return <Child data={data} onToggle={toggle} onAdd={() => capture("child")} />;
    if (screen === "business") return <Business data={data} onToggle={toggle} onAdd={() => capture("business")} />;
    if (screen === "money") return <Money data={data} onAdd={() => capture("money")} />;
    if (screen === "calendar") return <CalendarView data={data} />;
    if (screen === "profile") return <ProfileEditor data={data} onSave={saveProfile} />;
    if (screen === "settings") return <Settings data={data} dark={dark} setDark={setDark} onImport={importData} pinEnabled={pinEnabled} onPinToggle={togglePin} />;
    return <Today data={data} onToggle={toggle} onCapture={capture} onNavigate={navigate} />;
  }, [screen, data, dark]);

  if (locked) return <LockScreen onUnlock={(pin) => {
    const valid = pin === localStorage.getItem("dayweave-pin");
    if (valid) setLocked(false);
    return valid;
  }} />;

  return (
    <div className="app-shell">
      <main>
        <Header screen={screen} onNavigate={navigate} dark={dark} setDark={setDark} profile={data.profile} />
        <div className="content">{content}</div>
      </main>
      {moreOpen && <div className="more-popover"><MoreMenu onNavigate={navigate} /></div>}
      <nav className="bottom-nav" aria-label="Main navigation">
        <Button className={screen === "today" ? "active" : ""} onClick={() => navigate("today")}><Icon name="home" size={21} /><span>Today</span></Button>
        <Button className={screen === "student" ? "active" : ""} onClick={() => navigate("student")}><Icon name="book" size={21} /><span>Student</span></Button>
        <Button className="capture-button" onClick={() => capture()} ariaLabel="Quick capture"><span><Icon name="plus" size={25} /></span><small>Capture</small></Button>
        <Button className={screen === "business" ? "active" : ""} onClick={() => navigate("business")}><Icon name="bag" size={21} /><span>Business</span></Button>
        <Button className={moreOpen ? "active" : ""} onClick={() => setMoreOpen(!moreOpen)}><Icon name="grid" size={21} /><span>More</span></Button>
      </nav>
      <QuickCapture open={captureOpen} initialArea={captureArea} onClose={() => setCaptureOpen(false)} onSave={save} />
    </div>
  );
}
