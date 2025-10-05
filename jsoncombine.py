import os

# 📁 Folder containing the files to combine
input_folder = "src/data"
# 📄 Name of the output file
output_file = "combined_output.txt"

# List all files in the folder (sorted alphabetically)
files = sorted(os.listdir(input_folder))

# Open the output file for writing
with open(output_file, 'w', encoding='utf-8') as outfile:
    for filename in files:
        file_path = os.path.join(input_folder, filename)

        # Only process regular files
        if os.path.isfile(file_path):
            # Write header with filename
            outfile.write(f"=== Start of {filename} ===\n")

            # Write file contents
            with open(file_path, 'r', encoding='utf-8') as infile:
                contents = infile.read()
                outfile.write(contents)

            # Write footer and spacing between files
            outfile.write(f"\n=== End of {filename} ===\n\n")

print(f"✅ All files in '{input_folder}' combined into '{output_file}' with filenames included.")
