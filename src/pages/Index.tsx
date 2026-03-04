import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Bell,
  Briefcase,
  CalendarDays,
  CheckSquare,
  ChevronRight,
  CircleDollarSign,
  FileText,
  Layers3,
  LayoutDashboard,
  Sparkles,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type Role = "director" | "leader" | "member";
type ViewKey = "dashboard" | "teams" | "calendar" | "tasks" | "notes" | "activities" | "finance" | "settings";

const years = ["2026", "2025", "2024"];

const roleCopy: Record<Role, { label: string; summary: string; accent: string }> = {
  director: {
    label: "Director",
    summary: "See the full organization, compare teams, and prepare the next yearly cycle.",
    accent: "Executive overview",
  },
  leader: {
    label: "Team Leader",
    summary: "Coordinate your team, monitor deadlines, and prepare weekly summaries.",
    accent: "Team operations",
  },
  member: {
    label: "Member",
    summary: "Track personal tasks, upcoming group sessions, and your latest notes.",
    accent: "Personal workspace",
  },
};

const navItems: Array<{ key: ViewKey; label: string; icon: typeof LayoutDashboard; hint: string }> = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, hint: "Overview + quick actions" },
  { key: "teams", label: "Teams", icon: Users, hint: "Hierarchy + yearly structure" },
  { key: "calendar", label: "Calendar", icon: CalendarDays, hint: "Shared events by team" },
  { key: "tasks", label: "Tasks", icon: CheckSquare, hint: "Assignments + deadlines" },
  { key: "notes", label: "Notes", icon: FileText, hint: "Group + member knowledge" },
  { key: "activities", label: "Activities", icon: Activity, hint: "Weekly logs + summaries" },
  { key: "finance", label: "Finance", icon: CircleDollarSign, hint: "Budgets + reporting" },
  { key: "settings", label: "Settings", icon: Briefcase, hint: "Roles + yearly controls" },
];

const statMap: Record<Role, Array<{ label: string; value: string; delta: string }>> = {
  director: [
    { label: "Active teams", value: "12", delta: "+2 this year" },
    { label: "Open tasks", value: "84", delta: "67% on track" },
    { label: "Upcoming events", value: "19", delta: "Next in 2 days" },
    { label: "Digest readiness", value: "91%", delta: "3 teams pending" },
  ],
  leader: [
    { label: "Team members", value: "26", delta: "4 subgroup leads" },
    { label: "Open tasks", value: "18", delta: "11 due this week" },
    { label: "Planned events", value: "7", delta: "2 recurring" },
    { label: "Weekly reports", value: "5/6", delta: "1 group missing" },
  ],
  member: [
    { label: "My tasks", value: "6", delta: "2 high priority" },
    { label: "Upcoming events", value: "3", delta: "Choir rehearsal Friday" },
    { label: "My notes", value: "14", delta: "3 pinned" },
    { label: "Activity logs", value: "2", delta: "Update due Sunday" },
  ],
};

const boardColumns: Record<Role, Array<{ title: string; count: number; items: string[] }>> = {
  director: [
    { title: "Needs review", count: 4, items: ["Approve youth team budget", "Confirm annual calendar draft"] },
    { title: "In motion", count: 7, items: ["Leadership retreat planning", "Volunteer onboarding refresh"] },
    { title: "Ready to send", count: 3, items: ["Weekly org digest", "Quarterly activity recap"] },
  ],
  leader: [
    { title: "Today", count: 5, items: ["Assign meeting roles", "Review member notes"] },
    { title: "This week", count: 8, items: ["Prepare Sunday checklist", "Publish small-group schedule"] },
    { title: "Waiting", count: 2, items: ["Finance sign-off", "Director feedback"] },
  ],
  member: [
    { title: "Next up", count: 2, items: ["Finish outreach checklist", "Upload meeting notes"] },
    { title: "Upcoming", count: 3, items: ["Attend rehearsal", "Update weekly activity log"] },
    { title: "Done", count: 4, items: ["Prayer team follow-up", "Shared member summary"] },
  ],
};

const yearlySteps = [
  "Archive the current year as read-only history.",
  "Clone teams and subgroup structure into the new year.",
  "Reassign leaders and members where needed.",
  "Switch dashboards and reports to the active year by default.",
];

function AppSidebar({ activeView, onSelect }: { activeView: ViewKey; onSelect: (view: ViewKey) => void }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border/70">
      <SidebarHeader className="gap-3 px-3 py-4">
        <div className="crm-sidebar-brand">
          <div className="crm-brand-mark">
            <Layers3 className="size-4" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/70">
                Community CRM
              </p>
              <h2 className="truncate text-lg font-semibold text-sidebar-foreground">Yearly Operations Hub</h2>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeView === item.key}
                    tooltip={item.label}
                    className="data-[active=true]:crm-sidebar-active"
                    onClick={() => onSelect(item.key)}
                  >
                    <item.icon className="size-4" />
                    {!collapsed && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-3">
        <div className="crm-sidebar-footnote">
          <Badge variant="secondary" className="crm-soft-badge">
            Prototype
          </Badge>
          {!collapsed && <p className="text-xs leading-relaxed text-sidebar-foreground/70">Dark command center + light workspaces.</p>}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function DashboardHero({ role, year }: { role: Role; year: string }) {
  const copy = roleCopy[role];

  return (
    <section className="crm-hero-panel overflow-hidden rounded-[calc(var(--radius)*2.2)] border border-border/60 p-6 lg:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-5">
          <Badge className="crm-soft-badge border-0">{copy.accent}</Badge>
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/70">Operational year {year}</p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-primary-foreground sm:text-5xl">
              Run every team, subgroup, and weekly flow from one focused control layer.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-primary-foreground/78 sm:text-lg">{copy.summary}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="crm-hero-button">
              Start new year
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="secondary" className="border-0 bg-background/12 text-primary-foreground hover:bg-background/18">
              Preview weekly digest
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {statMap[role].slice(0, 2).map((stat) => (
            <div key={stat.label} className="crm-glass-tile rounded-2xl p-4">
              <p className="text-sm text-primary-foreground/70">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold text-primary-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-primary-foreground/70">{stat.delta}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsGrid({ role }: { role: Role }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statMap[role].map((stat) => (
        <Card key={stat.label} className="crm-light-card border-border/60 shadow-none">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm text-muted-foreground">{stat.label}</CardDescription>
            <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">{stat.value}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{stat.delta}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function WorkspaceBoard({ role }: { role: Role }) {
  return (
    <section className="grid gap-4 xl:grid-cols-3">
      {boardColumns[role].map((column) => (
        <Card key={column.title} className="crm-light-card border-border/60 shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xl text-foreground">{column.title}</CardTitle>
                <CardDescription>{column.count} items in this lane</CardDescription>
              </div>
              <Badge variant="outline" className="border-border/70 text-foreground">
                {column.count}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {column.items.map((item) => (
              <div key={item} className="rounded-2xl border border-border/70 bg-background/90 p-4">
                <p className="text-sm font-medium text-foreground">{item}</p>
                <p className="mt-2 text-sm text-muted-foreground">Prototype card for Phase 1 navigation and role-specific workload previews.</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function TeamsPanel() {
  return (
    <Card className="crm-light-card border-border/60 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Organization hierarchy</CardTitle>
        <CardDescription>Prototype the yearly structure from director → team leader → subgroup → member.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-3">
        {[
          { title: "Director", items: ["Organization dashboard", "Finance oversight", "Year transition"] },
          { title: "Team Leaders", items: ["Schedule planning", "Task assignments", "Weekly summaries"] },
          { title: "Members", items: ["Personal tasks", "Group notes", "Activity submissions"] },
        ].map((section) => (
          <div key={section.title} className="rounded-[calc(var(--radius)*1.5)] border border-border/70 bg-background/90 p-5">
            <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {section.items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <ChevronRight className="size-4 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function CalendarPanel() {
  return (
    <Card className="crm-light-card border-border/60 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Shared calendar preview</CardTitle>
        <CardDescription>Monthly planning across teams with scoped visibility for each role.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid grid-cols-7 gap-2 rounded-[calc(var(--radius)*1.5)] border border-border/70 bg-background/90 p-4">
          {Array.from({ length: 35 }, (_, index) => {
            const highlighted = [3, 8, 11, 16, 22, 27].includes(index);
            return (
              <div
                key={index}
                className={cn(
                  "flex aspect-square items-start justify-end rounded-xl border p-2 text-sm",
                  highlighted ? "border-primary/20 bg-primary/10 text-foreground" : "border-border/60 bg-muted/35 text-muted-foreground",
                )}
              >
                {index + 1}
              </div>
            );
          })}
        </div>
        <div className="space-y-3">
          {[
            "Leadership meeting · Tuesday 19:00",
            "Youth subgroup activity log due · Friday",
            "Finance review · First Monday monthly",
          ].map((event) => (
            <div key={event} className="rounded-2xl border border-border/70 bg-background/90 p-4 text-sm text-foreground">
              {event}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function NotesPanel() {
  return (
    <Card className="crm-light-card border-border/60 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Structured notes</CardTitle>
        <CardDescription>Capture member notes, group decisions, and searchable weekly knowledge.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        {[
          "Weekly leadership debrief with prayer requests and action points.",
          "Member care note linked to a subgroup and ready for follow-up.",
          "Event recap template for attendance, wins, and blockers.",
          "Year transition notes documenting which teams should be restructured.",
        ].map((note, index) => (
          <div key={note} className="rounded-[calc(var(--radius)*1.5)] border border-border/70 bg-background/90 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">Note {index + 1}</p>
              <Badge variant="outline" className="border-border/70">
                Pinned
              </Badge>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{note}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ActivitiesPanel() {
  return (
    <Card className="crm-light-card border-border/60 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Weekly activities feed</CardTitle>
        <CardDescription>See what every group completed and where follow-up is needed.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          ["Community Outreach", "Visited 18 households and scheduled 3 return visits."],
          ["Youth Team", "Ran mentorship circle and logged attendance for 24 members."],
          ["Finance Team", "Closed February reconciliation and flagged 2 pending reimbursements."],
        ].map(([group, detail]) => (
          <div key={group} className="flex flex-col gap-2 rounded-[calc(var(--radius)*1.5)] border border-border/70 bg-background/90 p-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-base font-semibold text-foreground">{group}</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{detail}</p>
            </div>
            <Badge variant="secondary" className="w-fit">
              This week
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function FinancePanel() {
  return (
    <Card className="crm-light-card border-border/60 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Finance preview</CardTitle>
        <CardDescription>Prototype for income, expenses, and team-level reporting.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-3">
        {[
          ["Income", "$24,800", "+8% vs last month"],
          ["Expenses", "$16,240", "Facilities + outreach"],
          ["Net balance", "$8,560", "Healthy trend"],
        ].map(([label, value, detail]) => (
          <div key={label} className="rounded-[calc(var(--radius)*1.5)] border border-border/70 bg-background/90 p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SettingsPanel({ year }: { year: string }) {
  return (
    <Card className="crm-light-card border-border/60 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Year transition workflow</CardTitle>
        <CardDescription>Recommended model: single workspace, all records tagged by year, previous years locked as read-only history.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[calc(var(--radius)*1.5)] border border-border/70 bg-background/90 p-5">
          <p className="text-sm uppercase tracking-[0.24em] text-primary/70">Active year</p>
          <p className="mt-3 text-4xl font-semibold text-foreground">{year}</p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">When the new year starts, the structure is copied forward, reassigned where needed, and old records stay visible through the year selector.</p>
        </div>
        <div className="space-y-3">
          {yearlySteps.map((step, index) => (
            <div key={step} className="flex gap-4 rounded-[calc(var(--radius)*1.4)] border border-border/70 bg-background/90 p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {index + 1}
              </div>
              <p className="pt-1 text-sm leading-6 text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MainContent({
  role,
  activeView,
  year,
  setRole,
  setActiveView,
  setYear,
}: {
  role: Role;
  activeView: ViewKey;
  year: string;
  setRole: (role: Role) => void;
  setActiveView: (view: ViewKey) => void;
  setYear: (year: string) => void;
}) {
  const viewTitle = useMemo(() => navItems.find((item) => item.key === activeView)?.label ?? "Dashboard", [activeView]);
  const viewHint = useMemo(() => navItems.find((item) => item.key === activeView)?.hint ?? "Overview", [activeView]);

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-3">
            <SidebarTrigger className="mt-1 h-9 w-9 rounded-full border border-border/70 bg-background/80" />
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary/70">Phase 1 prototype</p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">{viewTitle}</h2>
              <p className="text-sm text-muted-foreground">{viewHint}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <div className="inline-flex rounded-full border border-border/70 bg-card/90 p-1">
              {(["director", "leader", "member"] as Role[]).map((roleOption) => (
                <button
                  key={roleOption}
                  type="button"
                  onClick={() => setRole(roleOption)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    role === roleOption ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {roleCopy[roleOption].label}
                </button>
              ))}
            </div>

            <div className="inline-flex rounded-full border border-border/70 bg-card/90 p-1">
              {years.map((yearOption) => (
                <button
                  key={yearOption}
                  type="button"
                  onClick={() => setYear(yearOption)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    year === yearOption ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {yearOption}
                </button>
              ))}
            </div>

            <Button variant="outline" className="rounded-full border-border/70 bg-card/80">
              <Bell className="size-4" />
              Weekly digest
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
          <DashboardHero role={role} year={year} />

          <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary/70">Live prototype controls</p>
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">Role-aware workspace preview</h3>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="rounded-full border-border/70 px-4 py-2 text-foreground">
                {roleCopy[role].accent}
              </Badge>
              <Badge variant="secondary" className="rounded-full px-4 py-2">
                Year {year}
              </Badge>
            </div>
          </section>

          <StatsGrid role={role} />

          {activeView === "dashboard" && <WorkspaceBoard role={role} />}
          {activeView === "teams" && <TeamsPanel />}
          {activeView === "calendar" && <CalendarPanel />}
          {activeView === "tasks" && <WorkspaceBoard role={role} />}
          {activeView === "notes" && <NotesPanel />}
          {activeView === "activities" && <ActivitiesPanel />}
          {activeView === "finance" && <FinancePanel />}
          {activeView === "settings" && <SettingsPanel year={year} />}

          <section className="grid gap-4 xl:grid-cols-[1fr_0.75fr]">
            <Card className="crm-light-card border-border/60 shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl">Roadmap built into the prototype</CardTitle>
                <CardDescription>Every section in the sidebar maps to one of your approved product phases.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveView(item.key)}
                    className={cn(
                      "flex items-center justify-between rounded-[calc(var(--radius)*1.4)] border p-4 text-left transition-transform hover:-translate-y-0.5",
                      activeView === item.key ? "border-primary/30 bg-primary/10" : "border-border/70 bg-background/90",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                        <item.icon className="size-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.hint}</p>
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="crm-dark-card border-0 shadow-none">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-background/10 text-primary-foreground">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-primary-foreground">Director snapshot</CardTitle>
                    <CardDescription className="text-primary-foreground/70">A hybrid layout keeps high-level control dark and focused while the workspace stays bright and readable.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-primary-foreground/82">
                {[
                  "Dark executive dashboard for scanning team health at a glance.",
                  "Lighter workspace panels for tasks, notes, and calendar work.",
                  "Role toggles to preview Director, Team Leader, and Member experiences.",
                ].map((point) => (
                  <div key={point} className="flex gap-3 rounded-2xl border border-background/10 bg-background/6 p-4">
                    <BadgeCheck className="mt-0.5 size-4 shrink-0" />
                    <p className="text-sm leading-6">{point}</p>
                  </div>
                ))}
                <div className="rounded-2xl border border-background/10 bg-background/6 p-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-primary-foreground/60">Current route</p>
                  <p className="mt-2 text-lg font-medium">/{activeView}</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

const Index = () => {
  const [role, setRole] = useState<Role>("director");
  const [activeView, setActiveView] = useState<ViewKey>("dashboard");
  const [year, setYear] = useState("2026");

  return (
    <SidebarProvider defaultOpen>
      <div className="crm-shell w-full">
        <AppSidebar activeView={activeView} onSelect={setActiveView} />
        <SidebarInset>
          <MainContent
            role={role}
            activeView={activeView}
            year={year}
            setRole={setRole}
            setActiveView={setActiveView}
            setYear={setYear}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;

