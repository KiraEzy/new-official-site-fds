# Room booking screenshots — Focal Flow

For the company page site builder. **54 PNGs** + this index.

- Desktop: `01`–`43` at 1920×1080
- Phone: `m01`–`m11` at iPhone 14 (390×844 @2x)
- Crops: `09` Gantt, `10` legend, `20` digits, `26` QR card, `32` keypad card

**Do not** use door `?demo=true` on the marketing site.  
On QR shots, **crop out** the `http://localhost:5173/...` URL strip — keep the QR + room number.

Demo user `tester` appears in the header. Crop or ignore.

---

## Use this sequence on the page

| # | File | What it sells |
|---|---|---|
| 1 | `04-floor-plan.png` | Live occupancy: green / amber / red pins + Gantt |
| 2 | `11-floor-plan-pin-calendar.png` | Click a pin → that room’s week → Book |
| 3 | `15-booking-form-filled.png` | Booking form |
| 4 | `17-booking-overlap-error.png` | No double-book |
| 5 | `18-booking-confirmed-code.png` | 5-digit door code (crop `20` for a hero detail) |
| 6 | `25-qr-generator-1001.png` or crop `26` | Printable door QR |
| 7 | `m07-roomcode-keypad.png` | Scan the wall (phone) — also desktop `31` |
| 8 | `34-roomcode-wrong-code.png` / `m08` | Wrong code, red shake |
| 9 | `35-roomcode-access-granted.png` / `m10` | Access granted |
| 10 | `36-roomcode-checkin-overlay.png` / `m11` | Check-in |
| 11 | `38-roomcode-checkout-overlay.png` | Check-out |
| 12 | `21-my-bookings.png` | Weekly calendar, colour by room |
| 13 | `41-approvals-pending-detail.png` | Optional: manager approve / reject |

Time-scrub extras if you want a slider story: `06` morning, `07` afternoon, `08` evening.  
Nav IA: `05-nav-room-booking.png`.

---

## Full catalogue

### Login
| File | Title |
|---|---|
| `01-login.png` | Login |
| `02-login-filled.png` | Login filled |
| `03-login-create-user.png` | Create user tab |
| `m01-login.png` | Login (mobile) |

### Floor plan
| File | Title |
|---|---|
| `04-floor-plan.png` | Floor plan — live occupancy |
| `05-nav-room-booking.png` | Room Booking nav dropdown |
| `06-floor-plan-morning.png` | Floor plan ~09:15 |
| `07-floor-plan-afternoon.png` | Floor plan ~17:15 |
| `08-floor-plan-evening.png` | Floor plan ~20:15 |
| `09-floor-plan-gantt.png` | Room timeline / Gantt (crop) |
| `10-floor-plan-legend.png` | Available / Booked / Active / Ended |
| `11-floor-plan-pin-calendar.png` | Pin → room calendar |
| `12-floor-plan-calendar-room-tab.png` | Calendar room tabs |
| `m02-floor-plan.png` | Floor plan (mobile, tight) |

### Booking form
| File | Title |
|---|---|
| `13-booking-from-pin.png` | Form prefilled from pin |
| `14-booking-form.png` | Empty-ish form |
| `15-booking-form-filled.png` | Filled form |
| `16-booking-form-calendar-modal.png` | In-form week calendar |
| `17-booking-overlap-error.png` | Overlap blocked |
| `18-booking-confirmed-code.png` | Confirmed + 5-digit code |
| `19-booking-code-copied.png` | Copy code |
| `20-booking-code-digits.png` | Digit boxes (crop) |
| `m03-booking-form.png` | Form (mobile) |
| `m04-booking-confirmed.png` | Code (mobile) |

### My Bookings
| File | Title |
|---|---|
| `21-my-bookings.png` | Week calendar |
| `22-my-bookings-sidebar.png` | Sidebar |
| `23-my-bookings-detail.png` | Booking detail popup |
| `24-my-bookings-embedded-floorplan.png` | Floor plan inside My Bookings |
| `m05-my-bookings.png` | Week calendar (mobile) |

### Room QR
| File | Title |
|---|---|
| `25-qr-generator-1001.png` | QR for 1001 |
| `26-qr-card-1001.png` | QR card crop |
| `27-qr-generator-1003.png` | QR for 1003 |
| `28-qr-generator-1005.png` | QR for 1005 |
| `m06-qr-generator.png` | QR (mobile) |

### Door / keypad
| File | Title |
|---|---|
| `29-roomcode-missing-id.png` | No room id |
| `30-roomcode-no-active-booking.png` | No booking right now |
| `31-roomcode-keypad.png` | Empty keypad |
| `32-roomcode-keypad-card.png` | Keypad card crop |
| `33-roomcode-partial-code.png` | Two digits entered |
| `34-roomcode-wrong-code.png` | Incorrect code |
| `35-roomcode-access-granted.png` | Access granted + Check in |
| `36-roomcode-checkin-overlay.png` | Check-in success |
| `37-roomcode-checked-in.png` | Meeting live + Check out |
| `38-roomcode-checkout-overlay.png` | Check-out success |
| `39-roomcode-session-ended.png` | Session ended |
| `m07-roomcode-keypad.png` | Keypad (mobile) — **use this for “scan the wall”** |
| `m08-roomcode-wrong.png` | Wrong code (mobile) |
| `m09-roomcode-checked-in.png` | Already in meeting (mobile) |
| `m10-roomcode-access-granted.png` | Access granted (mobile) |
| `m11-roomcode-checkin.png` | Check-in overlay (mobile) |

### Approvals (optional)
| File | Title |
|---|---|
| `40-approvals.png` | Pending inbox (viewport) |
| `41-approvals-pending-detail.png` | Approve / Reject + comment |
| `42-approvals-all-bookings.png` | All bookings + status badges |
| `43-approvals-booking-record.png` | Facilities record |

---

Copies live in both:

- EventQR: `public/assets/focal-flow/screenshots/room-booking/`
- Official site: `new-official-site-fds/public/assets/focal-flow/screenshots/room-booking/`
