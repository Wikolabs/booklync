# BookLync — Plateforme de prise de rendez-vous intelligente

> Vos clients réservent en 30 secondes. Votre calendrier ne se chevauche jamais.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat&logo=redis)](https://redis.io)

---

## Vue d'ensemble

BookLync est une plateforme de prise de rendez-vous B2B avec gestion intelligente de disponibilités, règles de routage (round-robin, load balancing, spécialisation), confirmations automatiques, et intégrations calendrier (Google Calendar, Outlook). Elle optimise le booking rate des équipes commerciales et support.

**Domaine :** Sales Productivity / Customer Experience  
**Port VM :** 3005 | **Sous-domaine :** booklync.wikolabs.com

---

## Stack technique

| Couche | Technologie | Rôle |
|--------|------------|------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS | Calendrier de réservation, dashboard bookings |
| Backend | FastAPI (Python 3.11), Uvicorn | API disponibilités, réservations, routing |
| Calendrier | google-auth + Microsoft Graph | Google Calendar / Outlook sync |
| Notifications | SMTP (Resend) + Twilio SMS | Confirmations + rappels |
| Base de données | PostgreSQL 16 | Bookings, disponibilités, hosts |
| Cache | Redis 7 | Disponibilités en cache (TTL 1 min) |
| Scheduler | APScheduler | Rappels automatiques (24h, 1h avant) |
| Infra | Docker Compose, Nginx | VM mono-repo (port 3005) |

### backend/requirements.txt
```
fastapi==0.111.0
uvicorn[standard]==0.29.0
google-auth==2.29.0
google-api-python-client==2.128.0
msal==1.28.0
apscheduler==3.10.4
asyncpg==0.29.0
sqlalchemy[asyncio]==2.0.30
redis==5.0.4
pydantic==2.7.1
python-dateutil==2.9.0
pytz==2024.1
resend==0.7.2
twilio==9.1.0
```

---

## Architecture mono-repo

```
booklync/
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx             # Dashboard bookings + metrics
│   │   ├── book/[slug]/         # Page de réservation publique
│   │   ├── availability/        # Config disponibilités host
│   │   └── admin/               # Gestion équipes + routing rules
│   └── src/components/
│       ├── CalendarPicker.tsx   # Sélecteur date/heure disponible
│       ├── BookingForm.tsx       # Formulaire réservation + questions
│       ├── AvailabilityGrid.tsx  # Configuration plages horaires
│       ├── RoundRobinCard.tsx    # Visualisation routing équipe
│       └── BookingConfirm.tsx    # Confirmation avec add-to-calendar
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── bookings.py       # CRUD bookings + cancel/reschedule
│   │   │   ├── availability.py   # GET /slots (créneaux libres)
│   │   │   └── routing.py        # Round-robin + load balancing
│   │   ├── services/
│   │   │   ├── calendar_sync.py  # Google Calendar + Outlook
│   │   │   ├── slot_engine.py    # Calcul créneaux disponibles
│   │   │   ├── router.py         # Routing rules engine
│   │   │   └── notifications.py  # Email + SMS confirmations
│   │   └── models/
│   │       ├── booking.py
│   │       └── host.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/deploy.yml
```

---

## Diagrammes UML

### Architecture système

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#d97706', 'primaryTextColor': '#fff', 'primaryBorderColor': '#b45309', 'lineColor': '#374151', 'secondaryColor': '#fef3c7'}}}%%
flowchart TB
    subgraph VM["🖥️ VM — Docker Compose (port 3005)"]
        NEXT["Next.js 14\nBooking UI"]
        API["FastAPI"]

        subgraph ENGINE["📅 Booking Engine"]
            SLOTS["Slot Engine\nDisponibilités calculées"]
            ROUTER["Routing Engine\nRound-robin / LB"]
            NOTIF["Notifications\nEmail + SMS"]
        end

        PG[("PostgreSQL\nBookings + Hosts")]
        REDIS[("Redis\nCreneaux cache TTL 1min")]
    end

    GCAL["Google Calendar\nAPI"] --> ENGINE
    OUTLOOK["Microsoft Graph\nAPI"] --> ENGINE
    ENGINE --> NOTIF
```

### Séquence — Prise de rendez-vous

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#d97706', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
sequenceDiagram
    participant CLIENT as Client
    participant API as FastAPI
    participant SLOT as Slot Engine
    participant ROUTER as Router
    participant GCAL as Google Calendar
    participant NOTIF as Notifications

    CLIENT->>API: GET /availability?date=2024-03-15&duration=30

    API->>SLOT: get_available_slots(date, duration, team_id)
    SLOT->>GCAL: freebusy(hosts, timeMin, timeMax)
    GCAL-->>SLOT: busy_intervals[]
    SLOT-->>API: available_slots=[09:00, 09:30, 10:00, 14:00, 14:30]

    CLIENT->>API: POST /bookings {slot: "2024-03-15T10:00", guest_name: "Marie D.", guest_email: "..."}

    API->>ROUTER: assign_host(slot, routing_rule=round_robin)
    ROUTER-->>API: host_id=h_alice

    API->>GCAL: events.insert(host_calendar, event_details)
    GCAL-->>API: event_id=evt_xyz

    API->>NOTIF: send_confirmation(guest, host, booking)
    NOTIF-->>CLIENT: confirmation email + calendar invite

    API-->>CLIENT: {booking_id: "bk_123", host: "Alice R.", meet_link: "..."}
```

### Modèle de données (ER)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#d97706', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
erDiagram
    HOST {
        uuid id PK
        string name
        string email
        string calendar_provider
        string calendar_id
        int bookings_count
        float avg_load
    }
    BOOKING_TYPE {
        uuid id PK
        string name
        string slug
        int duration_minutes
        string routing_rule
        string[] required_fields
        string location_type
    }
    BOOKING {
        uuid id PK
        uuid host_id FK
        uuid booking_type_id FK
        string guest_email
        string guest_name
        timestamp start_time
        timestamp end_time
        string status
        string cancel_token
        string calendar_event_id
    }
    AVAILABILITY_RULE {
        uuid id PK
        uuid host_id FK
        string day_of_week
        time start_time
        time end_time
        string timezone
    }

    HOST ||--o{ BOOKING : "receives"
    HOST ||--o{ AVAILABILITY_RULE : "has"
    BOOKING_TYPE ||--o{ BOOKING : "defines"
```

### États d'un booking

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#d97706', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
stateDiagram-v2
    [*] --> PENDING : POST /bookings
    PENDING --> CONFIRMED : calendar event created
    CONFIRMED --> REMINDED : -24h auto SMS/email
    REMINDED --> COMPLETED : post-event
    CONFIRMED --> CANCELLED : cancel link clicked
    CONFIRMED --> RESCHEDULED : reschedule request
    RESCHEDULED --> CONFIRMED : new slot accepted
    CANCELLED --> [*]
    COMPLETED --> [*]
```

---

## PRD

### Problème
La prise de rendez-vous par email (aller-retour "quand êtes-vous disponible ?") génère 3-5 échanges pour chaque réunion. Les équipes commerciales perdent 2h/semaine en coordination. Le double-booking et les no-shows coûtent cher.

### Solution
BookLync offre une page de réservation en self-service avec créneaux en temps réel, routing intelligent vers le bon commercial (spécialisation sectorielle, load balancing), et confirmation automatique avec lien de conférence vidéo.

### Utilisateurs cibles
| Persona | Besoin |
|---------|--------|
| Commercial | Partager son lien de booking, zéro coordination manuelle |
| Customer Success | Scheduler des check-ins, QBR, avec routing vers le bon CSM |
| Admin / RevOps | Configurer les routing rules, monitorer le load de l'équipe |

### OKRs
- Réduction temps de scheduling : -90% (vs email back-and-forth)
- No-show rate < 10% (vs 25% sans rappels)
- Booking rate > 65% sur les créneaux proposés

---

## User Stories

```
US-01 [Commercial] En tant que commercial,
      je veux partager un lien de booking personnalisé
      qui montre mes disponibilités en temps réel depuis mon Google Calendar
      afin que mes prospects réservent sans m'envoyer d'email.

US-02 [Admin] En tant qu'admin RevOps,
      je veux configurer une règle round-robin pour l'équipe de 5 SDR
      afin que les bookings se distribuent équitablement.

US-03 [Client] En tant que prospect,
      je veux recevoir un rappel SMS 1h avant ma démo
      afin de ne pas oublier le rendez-vous.

US-04 [Manager] En tant que manager,
      je veux voir le nombre de bookings par commercial ce mois
      afin d'identifier qui est surchargé et qui peut prendre plus.

US-05 [Commercial] En tant que commercial,
      je veux que le booking soit automatiquement annulé
      si le prospect ne confirme pas dans les 24h
      afin de libérer le créneau pour d'autres.
```

---

## Règles métier

| # | Règle | Description | Simulable UI |
|---|-------|-------------|-------------|
| R1 | Buffer time | 15 min entre 2 rendez-vous (pas de back-to-back) | ✅ Buffer config |
| R2 | Advance notice | Min 2h d'avance pour booker | ✅ Lead time slider |
| R3 | Round-robin | Distribution équitable entre hosts disponibles | ✅ Load meter |
| R4 | Spécialisation | Leads "Industrie" → host_specialization=manufacturing | ✅ Routing rules |
| R5 | Rappels | SMS -1h, email -24h automatiques | ✅ Reminder toggle |
| R6 | No-show | Pas de rejoint après 5min → no_show enregistré | ✅ Status update |
| R7 | Max bookings | Max 8 réunions/jour par host | ✅ Cap slider |
| R8 | Annulation | Annulation possible jusqu'à 2h avant | ✅ Cancel link |
| R9 | Reschedule | Lien de report envoyé automatiquement | ✅ Reschedule flow |
| R10 | Confirmation | Double opt-in : email de confirmation avec CTA | ✅ Confirm email |

---

## Spécification API

**Base URL :** `http://booklync.wikolabs.com/api/v1`

### GET /availability
```json
// GET /availability?team_id=t1&date=2024-03-15&duration=30
// Response: {"slots": ["09:00", "09:30", "10:00", "14:30"], "timezone": "Europe/Paris"}
```

### POST /bookings
```json
{"booking_type_id": "bt_demo", "slot": "2024-03-15T10:00:00+01:00", "guest_name": "Marie Dupont", "guest_email": "m.dupont@acme.fr", "company": "Acme Corp"}
// Response: {"booking_id": "bk_xyz", "host": "Alice R.", "meet_link": "https://meet.google.com/abc-def-ghi", "ical_url": "..."}
```

### DELETE /bookings/{id}
```json
// Response: {"status": "cancelled", "refund_policy": "no charge"}
```

---

## Simulation UI

| Composant | Description |
|-----------|-------------|
| **Calendar Picker** | Calendrier interactif avec créneaux disponibles colorés |
| **Booking Form** | Formulaire: nom, email, company, message (configurable) |
| **Routing Visualizer** | Animation round-robin entre avatars des membres de l'équipe |
| **Dashboard Bookings** | Tableau de bord : bookings du jour, semaine, taux no-show |
| **Host Load View** | Barre de charge par commercial (0-8 bookings/jour) |

---

## Déploiement

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:16-alpine
    environment: {POSTGRES_DB: booklync, POSTGRES_USER: bl_user, POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"}
  redis:
    image: redis:7-alpine
  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql+asyncpg://bl_user:${POSTGRES_PASSWORD}@postgres/booklync
      REDIS_URL: redis://redis:6379
      GOOGLE_CLIENT_ID: "${GOOGLE_CLIENT_ID}"
      GOOGLE_CLIENT_SECRET: "${GOOGLE_CLIENT_SECRET}"
    depends_on: [postgres, redis]
    expose: ["8000"]
  frontend:
    build: ./frontend
    expose: ["3000"]
  nginx:
    image: nginx:alpine
    ports: ["3005:80"]
volumes:
  pg_data:
```

---

## Roadmap

### Phase 1 — MVP
- [ ] Page booking publique + créneaux statiques
- [ ] Confirmation email automatique
- [ ] Dashboard bookings

### Phase 2 — Intégrations
- [ ] Google Calendar sync (OAuth2)
- [ ] Outlook sync (Microsoft Graph)
- [ ] Rappels SMS (Twilio)

### Phase 3 — Intelligence
- [ ] Round-robin + spécialisation routing
- [ ] Prédiction no-show (ML)
- [ ] Intégration NexusCRM (booking → deal update)

---

*Un produit [Wikolabs](https://wikolabs.com) — Intelligence artificielle appliquée aux métiers*
