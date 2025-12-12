# Changelog

## Version 2.0 - Connection Selector Update

### New Features

✨ **Dynamic Connection Selection**
- App now reads the Connection table from the database
- Displays all available MUD connections with their details
- Users select which connection to import aliases and triggers to
- Auto-selects if only one connection exists
- Shows connection display name, host, and port

### Changes

- Removed hardcoded connection_id of 5
- Added `getConnections()` function to read Connection table
- Added `ConnectionSelector` component for choosing target connection
- Updated `importToDatabase()` to require connectionId parameter
- Enhanced error handling for missing Connection table
- Improved UI flow with loading states

### UI Improvements

- New connection selection interface with radio-button style cards
- Loading indicator while fetching connections from database
- Connection details displayed (name, host, port)
- Visual feedback for selected connection
- Updated success message shows which connection was used

### Technical Details

**New Files:**
- `app/components/ConnectionSelector.tsx` - Connection selection UI

**Modified Files:**
- `app/lib/importer.ts` - Added getConnections() function
- `app/page.tsx` - Integrated connection selection flow
- `app/components/ImportResults.tsx` - Display connection name

**Database Requirements:**
The app now requires a `Connection` table with these columns:
- `id` (INTEGER)
- `display_name` (TEXT)
- `host_name` (TEXT)
- `port_number` (INTEGER)
- `sort_order` (INTEGER, optional)

### User Flow

1. Upload XML file
2. Upload database file → App automatically loads connections
3. Select target connection from list
4. Click Import
5. Download updated database

### Migration from v1.0

No changes needed! The app is backward compatible. If your database has a Connection table, you'll see the new selector. The only difference is that connection_id is no longer hardcoded.

### Bug Fixes

- Fixed potential race condition when selecting files
- Improved error messages for missing tables
- Better handling of databases without connections
