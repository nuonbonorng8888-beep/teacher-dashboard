import subprocess
import time
import json
import urllib.request
import sys
import websocket # if available, or use cdp via simple urllib / websocket

sys.stdout.reconfigure(encoding='utf-8')

# Let's check if websocket is available
try:
    import websocket
    has_ws = True
except ImportError:
    has_ws = False

print("has_ws:", has_ws)
