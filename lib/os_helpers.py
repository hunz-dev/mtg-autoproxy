import datetime
import os
from typing import List, Tuple


def parse_file_path(path: str, file_separator: str = "/") -> Tuple[str, str, str]:
    """Parse a file path into the full directory, file name, and extension. 

    Args:
        path (str): Full path to file
        file_separator (str, optional): File separator to use. Defaults to "\\".

    Returns:
        tuple[str, str, str]: A tuple with three elements containing:
            - Full directory path to the file
            - Name of the file (without full directory path)
            - Extension of the file
    """
    path_tokens = path.split(file_separator)
    file_name = path_tokens[-1]
    file_path = file_separator.join(path_tokens[:-1])
    
    ext_tokens = file_name.split('.')
    file_name = ext_tokens[0] if len(ext_tokens) <= 1 else '.'.join(ext_tokens[:-1])
    file_ext = ext_tokens[-1]

    return (file_path, file_name, file_ext)


def duplicate_file(source_path: str, destination_path: str, count: int):
    """Duplicate a file n (count) times by padding with null terminators for a unique MD5 hash.

    Args:
        source_path (str): Source file path
        destination_path (str): Destination file path
        count (int): Number of duplicates to produce
    """
    file_contents = None
    with open(source_path, 'rb') as orig_file:
        file_contents = orig_file.read()

    _, file_name, file_ext = parse_file_path(source_path)
    for i in range(count):
        alt_file_path = os.path.join(destination_path, f"{file_name} [{i + 1}].{file_ext}")
        with open(alt_file_path, 'wb') as alt_file:
            alt_file.write(file_contents + (i * b'\0'))


def find_missing_files(file_path: str, file_names: List[str]) -> List[str]:
    """Look for a set of file names within a path and return missing ones.

    Args:
        file_path (str): File path to search in
        file_names (List[str]): List of names to search

    Returns:
        List[str]: Missing file names
    """
    files = os.listdir(file_path)

    missing_files = []
    for file_name in file_names:
        found = False
        for file in files:
            if file_name in file:
                found = True
                break
        if not found:
            missing_files.append(file_name)

    return missing_files


def list_files(source_path: str, ignore: List[str] = None) -> List[str]:
    """List all files in a directory from a given path with an option to ignore a list of names.

    Args:
        source_path (str): Path to directory
        ignore (List[str], optional): List of names to ignore. Defaults to None.

    Returns:
        List[str]: File names within `source_path`
    """
    return [f for f in os.listdir(source_path) if not ignore or f not in ignore]


def split_files(source_path, destination_path, folder_size, prefix="output_{number:02d}"):
    """Partition files into prefixed directories of a given size.

    Args:
        source_path (_type_): Source path containing files to move
        destination_path (_type_): Destination path to create prefixed directories in
        folder_size (_type_): Size of directories
        prefix (str, optional): Formatted string with a `number` attribute used to name
            split directories. Defaults to "output_{number:02d}".

    Returns:
        List[str]: Created file names
    """
    current_folder = 0
    output_folders = []
    while len(os.listdir(source_path)) > 0:
        # Create prefixed folder
        output_folder = os.path.join(destination_path, prefix.format(number=current_folder))
        os.mkdir(output_folder)
        output_folders.append(output_folder)

        # Move a number of files up to the configured folder size
        for file in os.listdir(source_path)[:folder_size]:
            source_file = os.path.join(source_path, file)
            output_file = os.path.join(output_folder, file)
            os.rename(source_file, output_file)

        current_folder += 1

    return output_folders

def get_modified_date(file_path: str, format_str="%Y-%m-%d"):
    """Return a date string of the last modified timestamp of a given file.

    Args:
        file_path (str): Full path to desired file
        format_str (str, optional): Date format string to use. Defaults to "%Y-%m-%d".

    Returns:
        str: Date string
    """
    modified_timestamp_ms = os.path.getmtime(file_path)
    modified_timestamp_dt = datetime.datetime.fromtimestamp(modified_timestamp_ms)
    return modified_timestamp_dt.strftime(format_str)
