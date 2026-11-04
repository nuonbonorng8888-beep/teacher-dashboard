import fitz, json, sys
sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open('កិច្ចការតែងការទី១២/សៀវភៅកិច្ចតែងការបង្រៀនថ្នាក់ទី១២_Version_1.pdf')
starts = [7, 11, 16, 21, 26, 31, 37, 42, 46, 51, 56, 62, 66, 71, 75, 79, 83, 87, 91, 95, 99, 103, 107, 111, 116, 120, 125, 128, 132, 135, 138, 141, 145, 150, 153, 156, 159, 162, 166, 170, 174, 179, 184, 188, 192, 196, 200, 204, 207, 212, 216, 220, 224, 230, 240, 247, 253, 257, 263, 268, 275, 279, 284, 290, 296, 303, 308, 314, 320, 325, 330, 334, 341, 348, 354, 361, 367, 371, 375, 381, 386, 391, 397, 403, 407, 412, 416, 420, 426, 432, 436, 441, 446, 452, 458, 464, 469, 475, 481, 486, 490, 496, 501, 506, 512, 518, 522, 527, 533, 537, 542, 546, 553]

# Cumulative counts of plans per chapter:
# Ch 1: 13 (indices 0..12) -> next is 13
# Ch 2: 17 (indices 13..29) -> next is 30
# Ch 3: 7  (indices 30..36) -> next is 37
# Ch 4: 15 (indices 37..51) -> next is 52
# Ch 5: 11 (indices 52..62) -> next is 63
# Ch 6: 16 (indices 63..78) -> next is 79
# Ch 7: 10 (indices 79..88) -> next is 89
# Ch 8: 9  (indices 89..97) -> next is 98
# Ch 9: 7  (indices 98..104) -> next is 105
# Ch 10: 8 (indices 105..112) -> total 113

for i in range(60, 95):
    txt = doc[starts[i]-1].get_text().replace('\n', ' ')
    print(f"[{i}] p.{starts[i]}: {txt[:120]}")

