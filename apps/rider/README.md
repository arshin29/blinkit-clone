# Blinkit Delivery Partner (Rider) Application

Mobile-first React application for Blinkit delivery partners. Built with Vite, React 19, TypeScript, and the shared Blinkit design system.

## Features

- **Authentication**: JWT authentication with automatic session persistence and strict `Role.RIDER` role enforcement.
- **Assigned Orders Dashboard**: Real-time list of orders assigned exclusively to the authenticated rider.
- **Status Filters**: Filter orders by ALL, Active, Assigned, Picked Up, Out for Delivery, and Delivered.
- **Order Details**: Full customer information (name, phone with click-to-call, email), delivery address, order items, and payment details.
- **Strict Status Workflow**:
  - Enforces sequence: `ASSIGNED` → `PICKED_UP` → `OUT_FOR_DELIVERY` → `DELIVERED`.
  - Step-by-step confirmation dialogs before status transitions.
  - Automatic background synchronization on status advancement.
- **Partner Profile**: Rider information, delivery statistics, and secure sign-out.
- **No Maps / GPS / Live Location Tracking**: Adheres strictly to requirements.

## Development Credentials

- **Email**: `rider@blinkit.com`
- **Password**: `Rider@123`

## Running Locally

```bash
# Start rider application
npm run dev --workspace=rider

# Or inside apps/rider
npm run dev
```

Default development port: `http://localhost:3004`
API URL: `http://localhost:4000/api`
