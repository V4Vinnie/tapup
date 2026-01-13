# Fix: Port 5000 Already in Use

## The Problem

Port 5000 is being used by **macOS Control Center (AirPlay Receiver)**. This is a common issue on macOS.

## The Solution

You have two options:

### Option 1: Disable AirPlay Receiver (Recommended)

1. Open **System Settings** (or System Preferences on older macOS)
2. Go to **General** → **AirDrop & Handoff** (or **Sharing**)
3. Find **AirPlay Receiver**
4. Turn it **OFF**
5. Port 5000 will be freed

After disabling, you can use port 5000 normally:
```bash
python3 app.py
```

### Option 2: Use a Different Port

Run your Flask app on a different port:

```bash
PORT=5001 python3 app.py
```

Or set it temporarily:
```bash
export PORT=5001
python3 app.py
```

Then access your app at: `http://localhost:5001`

The Flask app already supports the `PORT` environment variable, so this will work immediately.

## Quick Fix Right Now

If you want to run your app immediately without changing system settings:

```bash
PORT=5001 python3 app.py
```

Your app will be available at `http://localhost:5001`

