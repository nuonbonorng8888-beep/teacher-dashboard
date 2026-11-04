import fitz, json, sys
sys.stdout.reconfigure(encoding='utf-8')

# Test stamping Grade 11 page 0
doc11 = fitz.open('កិច្ចការតែងការទី១១/11_1_1_មេរៀនទី_១__ស្វ៊ីតចំនួនពិត_ម៉ោងទី1.pdf')
p11 = doc11[0]
h11 = p11.rect.height

# 1. Whiteout top header (top 20 to 75 pt)
p11.draw_rect(fitz.Rect(60, 25, 545, 75), color=(1,1,1), fill=(1,1,1))

# 2. Whiteout old footer (top 745 to 780 pt)
p11.draw_rect(fitz.Rect(60, 745, 545, 780), color=(1,1,1), fill=(1,1,1))

# 3. Whiteout class line value (y=195..218, x >= 210)
p11.draw_rect(fitz.Rect(210, 195, 450, 218), color=(1,1,1), fill=(1,1,1))

# 4. Whiteout teacher line value (y=217..239, x >= 210)
p11.draw_rect(fitz.Rect(210, 217, 450, 239), color=(1,1,1), fill=(1,1,1))

# 5. Whiteout date line value (y=239..261, x >= 210)
p11.draw_rect(fitz.Rect(210, 239, 450, 261), color=(1,1,1), fill=(1,1,1))

# Save image of page 0
pix11 = p11.get_pixmap(dpi=150)
pix11.save('C:/Users/LENOVO/.gemini/antigravity/brain/f1e067a4-40af-4458-9768-938ce551f866/test_g11_p0_whiteout.png')
print("Saved test_g11_p0_whiteout.png")

# Test stamping Grade 12 page 0
doc12 = fitz.open('កិច្ចការតែងការទី១២/12_1_1_កិច្ចតែងការ_ជំពូក1_ម៉ោងទី1.pdf')
p12 = doc12[0]
h12 = p12.rect.height

# 1. Whiteout top header (top 30 to 80 pt)
p12.draw_rect(fitz.Rect(60, 30, 545, 80), color=(1,1,1), fill=(1,1,1))

# 2. Whiteout class line value (y=99..118, x >= 235)
p12.draw_rect(fitz.Rect(235, 98, 450, 118), color=(1,1,1), fill=(1,1,1))

# 3. Whiteout date line value (y=172..190, x >= 235)
p12.draw_rect(fitz.Rect(235, 172, 450, 190), color=(1,1,1), fill=(1,1,1))

# 4. Whiteout teacher line value (y=190..208, x >= 235)
p12.draw_rect(fitz.Rect(235, 190, 450, 208), color=(1,1,1), fill=(1,1,1))

pix12 = p12.get_pixmap(dpi=150)
pix12.save('C:/Users/LENOVO/.gemini/antigravity/brain/f1e067a4-40af-4458-9768-938ce551f866/test_g12_p0_whiteout.png')
print("Saved test_g12_p0_whiteout.png")
