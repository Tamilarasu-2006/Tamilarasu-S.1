# SyncPulse — Team Availability Tracker (Standalone Web Page)

A modern, responsive, client-side **Team Availability Tracker** dashboard for distributed engineering, design, and product teams.

## 🚀 How to Run

### Option 1: Direct in Browser (No Server Needed!)
Simply double-click [`index.html`](file:///c:/Users/AJAY/OneDrive/Desktop/Team-Availability-Tracker-main/index.html) or open it in any modern browser (Chrome, Edge, Firefox, Safari, Brave):

```bash
# In PowerShell:
Start-Process index.html
```

### Option 2: Run with Local Web Server
You can also serve it with any static server:
```bash
npx serve .
# or
python -m http.server 8000
```

---

## ✨ Features

- 🟢 **Instant Availability Toggle**: Flip between *Available* and *Away* with instant UI feedback and local persistence.
- 💬 **Custom Status Notes & 1-Click Presets**: Share what you're working on (*Focus Mode*, *In Meeting*, *Reviewing PRs*, *Lunch*, *Out of Office*).
- 📊 **Real-Time Analytics & Stats**: Available Now count, % active progress bar, away count, and department breakdown.
- 🔍 **Search & Multi-Filter**: Search across names, roles, emails, and status messages (Hotkey: `/`), with status & department filter chips.
- 👥 **Add & Edit Team Members**: Custom avatar colors, initials, roles, departments, and timezones.
- 📜 **Live Activity Feed**: Sliding timeline drawer tracking status updates and changes.
- ⚡ **Bulk Actions**: Mark all available/away in one click, and reset demo data.
- 💾 **Data Export**: Export team availability as CSV or JSON.
- 🌓 **Dark & Light Mode**: Sleek glassmorphism theme with automatic preference detection.
- 🔊 **Synthesized Sound Effects**: Built-in Web Audio API micro-interaction sound effects with mute toggle.
- 📱 **Fully Responsive**: Mobile-first layout optimized for phones, tablets, and desktops.
