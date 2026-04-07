# Benpire — Member Guide

All member data is stored in `members.json`. Edit that file to update the registry — the website updates automatically.

---

## Adding a Regular Member

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
- **tier** — controls sort order on the page (1 = highest rank, higher numbers = lower rank)
- **note** — shows in small italic text next to their rank, e.g. `"Demoted by Ben"`. Use `null` for no note.

---

## Adding / Removing Peasants

The Peasantry entry has a `"peasants"` list instead of a single name. Just add or remove names:

```json
{
  "rank": "Peasantry",
  "tier": 6,
  "note": null,
  "peasants": [
    "Steve",
    "Jeff",
    "Karen"
  ]
}
```

---

## Adding a Note to Someone

Set the `"note"` field to any text:

```json
{
  "name": "Kylie",
  "rank": "Head of TBD",
  "tier": 4,
  "note": "Demoted by Ben"
}
```

Set it to `null` to remove the note.

---

## Removing a Member

Delete their entire `{ }` block from the `"members"` array.

