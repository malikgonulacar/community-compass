

## Community CRM — Full Roadmap Plan

A specialized CRM for community organization management with **3 roles** (Director, Team Leader, Member), **yearly cycles**, and a **hybrid dark/light UI**.

---

### Phase 1: Foundation & Navigation (Prototype)
- **App shell** with collapsible sidebar navigation: Dashboard, Teams, Calendar, Tasks, Notes, Activities, Finance, Settings
- **Dark-themed Director Dashboard** — overview cards showing team count, active tasks, upcoming events, weekly activity summary, and quick actions (inspired by your reference designs)
- **Light-themed workspace pages** for daily task/content areas
- **Role-based mock navigation** — toggle between Director, Team Leader, and Member views to preview each experience
- **Year selector** in the header to switch between organizational years

### Phase 2: Team & User Structure
- **Organization hierarchy view** — Director → Teams → Groups → Members
- **Team management page** — create/edit teams, assign team leaders, add members to groups
- **Yearly transition flow** — "Start New Year" wizard that archives current year's structure as read-only history, lets you copy/reassign teams for the new year, and tags all data by year
- **Member profiles** — contact info, role assignment, group membership

### Phase 3: Calendar
- **Shared calendar** with monthly/weekly/daily views
- **Scoped views**: Director sees all teams, Team Leaders see their team, Members see their group
- **Event creation** with team/group assignment, recurring events support
- **Color-coded events** by team/group

### Phase 4: Task Management
- **Kanban board + list view** for tasks (inspired by your Cirqly reference)
- **Task assignment** to individuals or groups with priority levels and due dates
- **Director dashboard widget** showing task completion rates per team
- **Team Leader view** — manage and assign tasks within their group

### Phase 5: Notes
- **Structured notes** organized by group and by member
- **Rich text editor** for note content
- **Pinned/starred notes** and search functionality
- **Director can view all notes**; Team Leaders see their group's notes; Members see their own

### Phase 6: Weekly Activities
- **Activity logging form** — each group logs their weekly activities
- **Weekly activity feed** — timeline view per group and aggregated for Director
- **Activity summary cards** on dashboards with charts (productivity heatmap style from your references)

### Phase 7: Financial Reports
- **Income/expense tracking** per team and organization-wide
- **Monthly/yearly financial summaries** with charts
- **Director-only finance dashboard** with totals, trends, and breakdowns by team
- **Export reports** as downloadable summaries

### Phase 8: Weekly Mailing Summary
- **Weekly digest builder** — auto-generated summary of tasks, activities, and notes per group
- **Preview and send** workflow for Team Leaders
- **Director gets an aggregated org-wide digest**
- *(Email sending will require backend integration in a later phase)*

---

### Yearly Transition Approach (Recommended)
**Single workspace, data tagged by year.** Each record (team, task, note, event, activity, finance entry) belongs to a "year." When starting a new year:
1. Director clicks "Start New Year" → enters the new year label
2. Current team structure can be cloned or rebuilt from scratch
3. Previous year's data remains accessible via the year selector (read-only)
4. Dashboards and reports default to the active year

### Role-Specific Dashboards
- **Director**: Org-wide stats, all-team overview, finance summary, activity heatmap, weekly digest preview
- **Team Leader**: Team tasks, group calendar, member activity, group notes summary
- **Member**: Personal tasks, upcoming events, own notes, group activity feed

