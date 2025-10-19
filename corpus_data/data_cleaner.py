import os.path
import sys


def clean_data(path):
	file_name = os.path.basename(path)
	new_file_name = f"clean_{file_name}"
	file_path = list(os.path.split(path))
	file_path.pop()
	new_file_path = os.path.join(*file_path, new_file_name)
	
	with open(path, "r", encoding='utf-8') as infile, open(new_file_path, "w", encoding='utf-8') as outfile:
		for line in infile:
			number, text = line.split(' ', 1)
			print(text, file=outfile, end='')

if __name__ == "__main__":
	if len(sys.argv) == 2:
		clean_data(sys.argv[1])
		