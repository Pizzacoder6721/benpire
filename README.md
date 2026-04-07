# Benpire — Member & Events Guide

All member and event data live in JSON files. Edit those files to update the site — no HTML changes needed.

---

## Adding a Regular Member (`members.json`)

Add a new object to the `"members"` array:

```json
{
  "name": "Greg",
  "rank": "General",
  "tier": 3,
  "note": null
}
```

- **name** — their name
- **rank** — their title/position
- **tier** — sort order (1 = highest rank, higher numbers = lower rank)
- **note** — italic text next to their rank e.g. `"Demoted by Ben"`. Use `null` for none.

---

## Adding / Removing Peasants (`members.json`)

The Peasantry entry uses a `"peasants"` list instead of a single name:

```json
{
  "rank": "Peasantry",
  "tier": 6,
  "note": null,
  "peasants": ["Steve", "Jeff", "Karen"]
}
```

---

## Adding a Note to Someone (`members.json`)

Set `"note"` to any text, or `null` to remove it:

```json
{ "name": "Kylie", "rank": "Head of TBD", "tier": 4, "note": "Demoted by Ben" }
```

---

## Removing a Member (`members.json`)

Delete their entire `{ }` block from the `"members"` array.

---

## Adding an Event (`events.json`)

Add a new object to the `"events"` array:

```json
{
  "id": 8,
  "title": "Alliance with Mr. Walter",
  "type": "diplomacy",
  "status": "ongoing",
  "priority": "high",
  "date": "2024-12-10",
  "parties": ["Ben", "Dallas"],
  "description": "Formal negotiations have begun.",
  "outcome": null
}
```

### Field reference

| Field | Options | Description |
|-------|---------|-------------|
| `id` | any unique number | Unique ID for the event |
| `type` | `war` `diplomacy` `meeting` `expansion` `internal` `economic` | Category — controls the badge color and filter button |
| `status` | `ongoing` `resolved` `upcoming` | Current state of the event |
| `priority` | `high` `medium` `low` | Controls the left-border accent color and sort order |
| `date` | `YYYY-MM-DD` | Date of the event |
| `parties` | array of names | Members or groups involved |
| `description` | string | What happened / is happening |
| `outcome` | string or `null` | Result — use `null` if still ongoing/upcoming |

### Sort order on the page

Events are sorted: **Ongoing → Upcoming → Resolved**, then by priority (high first), then by date (newest first).

