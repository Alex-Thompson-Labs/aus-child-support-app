#!/usr/bin/env python3
"""
Filter family law contacts to create outreach list
"""

import csv
from collections import Counter

# Load the CSV
with open('/Users/sammcdougal/d/csc/data/family_law_contacts_full.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    data = list(reader)

print(f"Loaded {len(data)} rows\n")

# Filter for lawyers (not firms) with key positions
target_positions = ['Principal', 'Director', 'Partner', 'Managing Director', 'Managing Partner', 'Senior Partner']
lawyers = [row for row in data if row['type'] == 'lawyer' and any(pos in row['position'] for pos in target_positions)]
print(f"✓ Found {len(lawyers)} lawyers with target positions")

# Filter for priority states
target_states = ['NSW', 'VIC', 'QLD']
lawyers_priority = [row for row in lawyers if row['state'] in target_states]
print(f"✓ Found {len(lawyers_priority)} lawyers in NSW/VIC/QLD")

# Filter for those with contact info (email OR linkedin)
lawyers_contactable = [row for row in lawyers_priority if row['email'] or row['linkedin']]
print(f"✓ Found {len(lawyers_contactable)} lawyers with email or LinkedIn")

# Count lawyers per firm to identify small firms
firm_counts = Counter([row['firm_name'] for row in lawyers_contactable])

# Add firm size to each lawyer record
for lawyer in lawyers_contactable:
    lawyer['firm_size'] = firm_counts[lawyer['firm_name']]

# Filter for small firms (1-5 lawyers)
lawyers_small_firms = [row for row in lawyers_contactable if row['firm_size'] <= 5]
print(f"✓ Found {len(lawyers_small_firms)} lawyers in firms with 1-5 lawyers\n")

# Sort by state, then firm size, then position priority
position_priority = {
    'Managing Director': 1,
    'Managing Partner': 2, 
    'Principal': 3,
    'Senior Partner': 4,
    'Director': 5,
    'Partner': 6
}

def get_priority(lawyer):
    for pos, priority in position_priority.items():
        if pos in lawyer['position']:
            return priority
    return 99

lawyers_sorted = sorted(lawyers_small_firms, key=lambda x: (x['state'], x['firm_size'], get_priority(x)))

# Show state breakdown
state_counts = Counter([row['state'] for row in lawyers_sorted])
print("State breakdown:")
for state in ['NSW', 'VIC', 'QLD']:
    print(f"  {state}: {state_counts[state]} lawyers")
print()

# Take top 50 for outreach list
outreach_list = lawyers_sorted[:50]

print("=" * 80)
print("TOP 50 LAWYERS FOR OUTREACH")
print("=" * 80)
print()

for i, lawyer in enumerate(outreach_list, 1):
    has_email = '✓' if lawyer['email'] else '✗'
    has_linkedin = '✓' if lawyer['linkedin'] else '✗'
    
    print(f"{i}. {lawyer['contact_name']} ({lawyer['position']})")
    print(f"   {lawyer['firm_name']} [{lawyer['state']}]")
    print(f"   Firm size: {lawyer['firm_size']} lawyers")
    print(f"   Email: {has_email}  LinkedIn: {has_linkedin}")
    if lawyer['email']:
        print(f"   Email: {lawyer['email']}")
    if lawyer['linkedin']:
        print(f"   LinkedIn: {lawyer['linkedin']}")
    print()

# Save to CSV
output_file = '/Users/sammcdougal/d/csc/data/outreach_list_top50.csv'
fieldnames = ['contact_name', 'position', 'firm_name', 'firm_size', 'state', 'email', 'linkedin', 'phone', 'website', 'address']

with open(output_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')
    writer.writeheader()
    writer.writerows(outreach_list)

print(f"✓ Saved to: {output_file}")
