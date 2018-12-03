import json

with open('yelp_academic_dataset_business.json', 'r') as f: 
	businesses = f.read().strip().split("\n")
businesses = [json.loads(business) for business in businesses]

output = []
for b in businesses: 
	if b["city"]=="Las Vegas": 
		output += [b]
		print b

with open('LV_data.json', 'w') as outfile:
	json.dump(output, outfile) 
