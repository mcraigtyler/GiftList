# GiftList — Product Requirements Document

## Overview

GiftList is a web application that lets people create and share wish lists of gift ideas. Users can add links to product pages, connect with friends, and coordinate gift purchasing — with built-in spoiler prevention so the list owner never sees who is buying what.

---

## User Personas

**Gift Receiver (List Owner)**
- Creates lists for occasions (birthday, Christmas, wedding, etc.)
- Adds links to products they want
- Shares lists with friends or family
- Cannot see who has claimed any of their gifts

**Gift Giver (Viewer)**
- Views a friend's list
- Claims items they intend to purchase (visible to other viewers, hidden from owner)
- Avoids duplicate purchases through the claims system

---

## Core Features

### Authentication
- Register with email and password
- Login / logout
- Persistent sessions via secure httpOnly JWT cookie

### Gift Lists
- Create multiple named lists per user (e.g. "Birthday 2025", "Christmas")
- Add optional description to each list
- Set list visibility:
  - **Friends** — all accepted friends can view the list
  - **Private** — only people explicitly invited can view the list
- Edit and delete lists

### Gift Items
- Add items to a list with:
  - URL to a product page (required)
  - Auto-scraped metadata: title, image, price (via Open Graph)
  - Manual override for title, description, price
  - Priority ranking (high / medium / low)
- Edit or remove items from own lists

### Friend Connections
- Search for other users by email or display name
- Send, accept, or decline friend requests
- Remove friends
- View friends' lists that are shared with friends

### List Invites (Private Lists)
- Invite specific users to a private list by email
- Invited users receive a notification and can accept or decline
- Revoke access at any time

### Gift Claiming (Spoiler Prevention)
- Any viewer of a list can claim an item to indicate they are buying it
- Claims are visible to all other viewers (to avoid duplicate purchases)
- **Claims are never shown to the list owner**
- Users can unclaim an item if plans change
- "My Claims" page shows everything the user has committed to buying across all lists

---

## Non-Goals (Out of Scope for v1)

- Payment processing or purchasing through the app
- Email notifications (invites and requests are in-app only for v1)
- Link preview/scraping for paywalled or JS-heavy sites
- Mobile app (responsive web only)
- Group/family accounts
- Price tracking or price drop alerts
- Comments or discussions on gift items

---

## Sharing Model

| Scenario | Who can see the list |
|----------|---------------------|
| Visibility = Friends | All accepted friends of the owner |
| Visibility = Private | Only users with an accepted invite |
| Owner viewing own list | Full access, claims hidden |
| Friend/invitee viewing | Can see items + claim status (but not who claimed, only that it's claimed and by whom among viewers — not shown to owner) |

---

## Spoiler Prevention Rules

1. The `GET /api/lists/:id/items` endpoint detects if the requester is the list owner
2. If yes: claim data is stripped from the response entirely
3. If no: claim data is included (item is claimed, claimed by display name)
4. The frontend also hides the claim UI (Claim/Unclaim button) on the owner's view of their own lists

---

## Success Criteria (v1)

- Users can register, log in, and manage their profile
- Users can create multiple gift lists and add items via URL
- Items auto-populate with product title, image, and price from the URL
- Users can add friends and view their shared lists
- Users can invite specific people to private lists
- Gift claims work correctly with spoiler prevention
- App is deployed and accessible on a cloud platform
