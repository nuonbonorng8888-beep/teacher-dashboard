# -*- coding: utf-8 -*-
"""
Script to update js/lesson-plans.js with comprehensive Print & Save PDF Hub.
Supports:
1. Single lesson (ម្តង ១ មេរៀន)
2. Multiple lessons (ម្តងលើសពី ១ មេរៀន)
3. Full grade level (ម្តង ១ កម្រិតថ្នាក់ទាំងមូល)
"""
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's inspect constructor additions
# We want to ensure this.printHubActiveTab, this.printHubSelectedSingleChapter, this.printHubSelectedChapters
print("Original size:", len(content))
