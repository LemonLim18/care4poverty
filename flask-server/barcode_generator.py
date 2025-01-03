from barcode import Code128
from barcode.writer import ImageWriter
import json
import os

# Import the JSON mapping
with open('itemList.json', 'r') as file:
    resource_mapping = json.load(file)

# Enter the resource code to generate the barcode
resource_code = '20014'  # Example: 10002 represents Maggie in Foods

# Validate the resource code
if resource_code not in resource_mapping:
    raise ValueError(f"Invalid resource code: {resource_code}")

# Generate and save the barcode
# Use resource name and replace spaces with underscores for the filename
# Create the ../image folder if it doesn't exist
output_folder = 'barcode_image'
os.makedirs(output_folder, exist_ok=True)

# Generate the filename with the path
barcode_filename = os.path.join(output_folder, resource_mapping[resource_code].replace(" ", "_"))

# Generate and save the barcode
Code128(resource_code, writer=ImageWriter()).save(barcode_filename)


# Output details
print(f"Barcode saved as '{barcode_filename}' with data: {resource_code}")
print(f"Item Name: {resource_mapping[resource_code]}")
