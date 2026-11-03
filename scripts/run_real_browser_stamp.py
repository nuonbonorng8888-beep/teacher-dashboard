# -*- coding: utf-8 -*-
import sys
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading
import time
import subprocess
import fitz

sys.stdout.reconfigure(encoding='utf-8')

saved_pdf_path = "scratch/browser_stamped_8_1_1.pdf"
if os.path.exists(saved_pdf_path):
    os.remove(saved_pdf_path)

received_event = threading.Event()

class CustomHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/upload_pdf':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            with open(saved_pdf_path, 'wb') as f:
                f.write(post_data)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'OK')
            print(f"Server: received {len(post_data)} bytes PDF from Edge!")
            received_event.set()
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass

server = HTTPServer(('localhost', 8093), CustomHandler)
server_thread = threading.Thread(target=server.serve_forever)
server_thread.daemon = True
server_thread.start()
print("Server started on port 8093")

edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
proc = subprocess.Popen([
    edge,
    "--headless=new",
    "--disable-gpu",
    "--window-size=1280,1024",
    "http://localhost:8093/?tab=lessonplans&test_stamp=true"
])

print("Waiting for Edge to stamp and upload PDF...")
received = received_event.wait(timeout=15)
proc.terminate()
server.shutdown()

print("Received within timeout?", received)
print("File exists?", os.path.exists(saved_pdf_path))
if os.path.exists(saved_pdf_path):
    print("Size:", os.path.getsize(saved_pdf_path))
    doc = fitz.open(saved_pdf_path)
    print("Pages in stamped PDF:", len(doc))

    # Page 0 (Cover)
    p0 = doc[0]
    pix0 = p0.get_pixmap(dpi=150)
    pix0.save('scratch/browser_cover_p0.png')

    # Crop cover header (where date and teacher are)
    # rect in 72 DPI: Rect(200, 50, 580, 250)
    pix0_crop = p0.get_pixmap(clip=fitz.Rect(180, 50, 580, 220), dpi=200)
    pix0_crop.save('scratch/browser_cover_crop.png')

    # Page 3 (Content ending with item 2)
    p3 = doc[3]
    pix3 = p3.get_pixmap(dpi=150)
    pix3.save('scratch/browser_content_p3.png')

    # Page 4 (Item 3 + Signatures)
    p4 = doc[4]
    pix4 = p4.get_pixmap(dpi=150)
    pix4.save('scratch/browser_signatures_p4.png')

    # Crop page 4 top (Item 3 + Signatures)
    pix4_crop = p4.get_pixmap(clip=fitz.Rect(50, 20, 580, 320), dpi=200)
    pix4_crop.save('scratch/browser_p4_item3_sig_crop.png')

    # Crop footer from page 1
    p1 = doc[1]
    pix1_footer = p1.get_pixmap(clip=fitz.Rect(50, 740, 580, 785), dpi=200)
    pix1_footer.save('scratch/browser_footer_crop.png')

    print("Successfully generated all inspection crops in scratch/!")

