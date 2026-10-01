# Pantry Recommendations and Delivered Orders Spec

## Goal

Show pantry-based recipe matches only when the user has pantry ingredients, and show completed deliveries using real order data and real status counts.

## Requirements

1. Hide the pantry-based recipe recommendation section when the pantry is empty.
2. When at least one pantry item exists, show recipes that use pantry ingredients.
3. Reuse the existing `GET /api/orders` order-history query and current `/mypage/delivery` screen. Do not add a new order-list API. Render real items from each order and present the UI state as `배송 완료`.
4. Derive displayed order counts from the existing order-history result, not fixed mock values.
5. Automatic pantry registration of purchased order items is out of scope until the pantry-write contract is defined.
6. OCR consumption-date defaults are explicitly out of scope.

## Constraints and Open Contract

- There is no delivery-state API; this is a UI-only assumption over existing confirmed payment orders.
- The current frontend pantry create request requires an ingredient name and storage method, and does not accept `productId`. Define how order products map to those required fields and how duplicate writes are prevented before adding automatic pantry registration in a later change.
- Do not fabricate carrier/tracking data or issue duplicate pantry writes.
- `/mypage/delivery` is the existing screen to update, populated by existing order-history data.

## Acceptance Criteria

- Empty pantry: no pantry-based recipe recommendation section is rendered.
- One or more pantry items: the section is rendered and the recipe query is restricted to ingredient IDs represented by pantry items.
- Delivery screen: actual order items from the existing order history query are displayed as delivered; no new order-list API is called.
- Summary counts: values are derived from existing order data, not hardcoded.
