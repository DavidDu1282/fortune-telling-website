#%%
import json

# Define the input and output file paths
input_file = "optimized_tarot_translated.json"  # Change this to your actual file path
output_file = "simplified_tarot.json"

# Load the JSON file
with open(input_file, "r", encoding="utf-8") as file:
    data = json.load(file)

# Extract only "name" and "img" fields from each card
extracted_data = [{"name": card["name"], "img": card["img"]} for card in data["cards"]]

# Save the extracted data to a new JSON file
with open(output_file, "w", encoding="utf-8") as file:
    json.dump(extracted_data, file, indent=4, ensure_ascii=False)

print(f"Extracted data saved to {output_file}")

# %%
