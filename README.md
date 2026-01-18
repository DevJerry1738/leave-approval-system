# Leave Approval System 🗂️

A role-based **Leave Request & Approval System** built with **Next.js, TypeScript, and Supabase**.  
Staff can submit leave requests, while admins can review, approve, or reject them in real time.

This project demonstrates:
- Authentication & role-based access control
- Database relationships and joins
- Secure data access with Supabase RLS
- Modern frontend architecture with Next.js App Router

---

## 🚀 Features

### 👤 Authentication
- Email & password signup/login
- Role-based routing (Admin vs Staff)
- Secure session handling via Supabase Auth

### 🧑‍💼 Staff Dashboard
- Submit leave requests
- View leave history
- Track request status (Pending / Approved / Rejected)

### 🛠️ Admin Dashboard
- View all leave requests
- See staff names attached to requests
- Approve or reject leave requests

### 🔐 Security
- Supabase Row Level Security (RLS)
- Users can only access data they are allowed to see

---

## 🧰 Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **Backend & DB:** Supabase (PostgreSQL + Auth)
- **Styling:** Tailwind CSS + shadcn/ui
- **Forms & Validation:** React Hook Form, Zod
- **Deployment:** Vercel

---

## 🗃️ Database Schema

### `profiles`
| Column | Type | Description |
|------|----|----|
| id | uuid | User ID (auth.uid) |
| name | text | Staff/Admin name |
| role | text | `admin` or `staff` |

### `leave_requests`
| Column | Type | Description |
|------|----|----|
| id | uuid | Leave request ID |
| user_id | uuid | References profiles.id |
| leave_type | text | Type of leave |
| start_date | date | Start date |
| end_date | date | End date |
| reason | text | Optional reason |
| status | text | pending / approved / rejected |
| created_at | timestamp | Submission time |

---


