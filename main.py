import tkinter as tk
from tkinter import filedialog
from tkinter import messagebox
from pathlib import Path
import eel
import os
import re
import sqlite3
import filecryp

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SIZE = (1300, 700)
PORT = 8001
DB_PATH = os.path.join(BASE_DIR, r"web\database\recent_files.db")

eel.init("web")

active_temp_file = "blank_doc"
active_file_path = ""

root = tk.Tk()
root.withdraw()

@eel.expose
def App():
    print("Running...")

@eel.expose
def give_temp_txt():
    cont_path = fr"web\templates\{active_temp_file}.txt"
    total_path = os.path.join(BASE_DIR, cont_path)
    file_text = ""

    with open(total_path, "r") as file:
        file_text = file.read()    
    
    return file_text

@eel.expose
def get_temp_txt(elem_id):
    global active_temp_file
    active_temp_file = elem_id
    
    cont_path = fr"web\templates\{elem_id}.txt"
    total_path = os.path.join(BASE_DIR, cont_path)
    file_text = ""

    with open(total_path, "r") as file:
        file_text = file.read()    
    
    return file_text

@eel.expose
def return_temp_text():
    global active_temp_file
    
    cont_path = fr"web\templates\{active_temp_file}.txt"
    total_path = os.path.join(BASE_DIR, cont_path)
    file_text = ""

    with open(total_path, "r") as file:
        file_text = file.read()    
        
    text = []
    copy = ""
    stop_index = 0
    prev_start_index = 0
    start_index = 0
    input_class = "text-to-change"
    for i in range(len(file_text)):
        if file_text[i] == "[":
            prev_start_index = start_index
            start_index = i
        if file_text[i] == "]":
            stop_index = i
            text.append(file_text[start_index:stop_index+1])
            if prev_start_index == 0:
                copy = file_text.replace(file_text[start_index:stop_index+1], f"<span contenteditable='true' class='{input_class}'>{file_text[start_index:stop_index+1]}</span>")
            else:
                copy = copy.replace(file_text[start_index:stop_index+1], f"<span contenteditable='true' class='{input_class}'>{file_text[start_index:stop_index+1]}</span>")
        
    return copy

@eel.expose
def find_text(text_to_find, text_lst):
    pattern = fr'{text_to_find}'
    final_text_lst = []
    count = 0
    match_length = 0
    
    for text in text_lst:
        match_lst = re.findall(pattern, text)
        match_length += len(match_lst)
        
        match_ = re.search(pattern, text)
        final_txt = re.sub(pattern, f"<span class='highlight'>{text_to_find}</span>", text)
        
        if count == 0 and match_ != None:
            final_txt = re.sub("<span class='highlight'>", "<span class='highlight highlight-one'>", final_txt, count=1)
            count += 1
            
        final_text_lst.append(final_txt)

    return [final_text_lst, match_length]

@eel.expose
def highlight(text_to_find, text_lst):
    pattern = fr'{text_to_find}'
    match_lst = []
    
    final_text_lst = []
    for text in text_lst:
        match_ = re.finditer(pattern, text)
        for i in match_:
            match_lst.append(i)

        final_txt = re.sub(pattern, f"<span class='highlight'>{text_to_find}</span>", text)
        final_text_lst.append(final_txt)

    return [final_text_lst, len(match_lst)]

def change_txt_down(text_lst):
    pattern_one = r'<span class="highlight">'
    pattern_two = r'<span class="highlight highlight-one">'
    final_txt = ""
    index_done = 0

    for index, text in enumerate(text_lst):
        if pattern_one in text:
            final_txt = re.sub(pattern_one, pattern_two, text, count=1)
            index_done = index
            break
        
    return (final_txt, index_done)

def change_txt_up(text_lst):
    pattern_one = r'<span class="highlight">'
    pattern_two = r'<span class="highlight highlight-one">'
    final_txt = ""
    index_done = 0

    for index, text in enumerate(text_lst):
        last_index = text.rfind(pattern_one)
        if last_index != -1:
            final_txt = text[:last_index] + pattern_two + text[last_index+len(pattern_one):]
            index_done = index
            break

    return (final_txt, index_done)

@eel.expose
def highlight_down(text_lst):
    pattern_one = r'<span class="highlight">'
    pattern_two = r'<span class="highlight highlight-one">'
    final_txt = ""
    final_text_lst = []
    index_done = 0 
    
    for index, text in enumerate(text_lst):
        if pattern_two in text:
            removed_txt = re.search(pattern_two, text)

            sliced_index__ = int(removed_txt.span()[0])
            sliced_index = int(removed_txt.span()[1])
                    
            sliced_txt__ = text[0:sliced_index__] 
            sliced_txt = text[sliced_index:]
                    
            html_tag = '<span class="highlight">'
            if pattern_one in sliced_txt:
                edited_txt = re.sub(pattern_one, pattern_two, sliced_txt, count=1)
                final_txt = sliced_txt__ + html_tag + edited_txt
                final_text_lst.append(final_txt)
                index_done = index
                break
            else:
                text = re.sub(pattern_two, pattern_one, text, count=1)
                returned_lst = change_txt_down(list(text_lst[index+1:]))
                final_txt = returned_lst[0]
                index_done = index + returned_lst[1] + 1
                
                for i in range(index, index_done):
                    final_text_lst.append(text)
                    
                final_text_lst.append(final_txt)
                break
            
        else:
            final_text_lst.append(text)
            
    for i in range(index_done+1, len(text_lst)):
        final_text_lst.append(text_lst[i])
    
    return final_text_lst

@eel.expose
def highlight_up(text_lst):
    #TODO: Change 
    reversed_txt_lst = list(reversed(text_lst))
    
    pattern_one = r'<span class="highlight">'
    pattern_two = r'<span class="highlight highlight-one">'
    final_txt = ""
    final_text_lst = []
    index_done = 0 
    
    for index, text in enumerate(reversed_txt_lst):

        if pattern_two in text:
            removed_txt = re.search(pattern_two, text)

            sliced_index__ = int(removed_txt.span()[0])
            sliced_index = int(removed_txt.span()[1])
                    
            sliced_txt__ = text[0:sliced_index__] 
            sliced_txt = text[sliced_index:]
                    
            html_tag = '<span class="highlight">'
            if pattern_one in sliced_txt__:
                edited_txt = re.sub(pattern_one, pattern_two, sliced_txt__, count=1)
                final_txt = edited_txt + html_tag + sliced_txt
                final_text_lst.append(final_txt)
                index_done = index
                break
            else:
                text = re.sub(pattern_two, pattern_one, text, count=1)
                returned_lst = change_txt_up(list(reversed_txt_lst[index+1:]))
                final_txt = returned_lst[0]
                index_done = index + returned_lst[1] + 1
                
                for i in range(index, index_done):
                    final_text_lst.append(text)
                                   
                final_text_lst.append(final_txt)
                break
            
        else:
            final_text_lst.append(text)
            
    for i in range(index_done+1, len(reversed_txt_lst)):
        final_text_lst.append(reversed_txt_lst[i])
    
    final_reversed_lst = list(reversed(final_text_lst))
    return final_reversed_lst


@eel.expose
def replace_all(text_to_replace, text_to_find, text_lst):
    pattern = fr'<span class="highlight">.{{{len(text_to_find)}}}</span>'
    print(text_lst)
    final_txt_lst = []
    
    for text in text_lst:
        final_txt = re.sub(pattern, text_to_replace, text)
        print(final_txt)
        final_txt_lst.append(final_txt)
      
    # print(final_txt_lst)
    return final_txt_lst

@eel.expose
def save_file(text_to_save, extension):
    global active_file_path
    connection = sqlite3.connect(DB_PATH)
    cursor = connection.cursor()
    
    root.wm_attributes('-topmost', 1)
    if extension == "wmail":
        file_path = filedialog.asksaveasfilename(defaultextension=".wmail", filetypes=(("Wmail File", "*.wmail"), ))
        with open(file_path, "w") as file:
            file.write(text_to_save)
            
        filecryp.encrypt_file(file_path, file_path)
    elif extension == "txt":
        file_path = filedialog.asksaveasfilename(defaultextension=".txt", filetypes=(("Text File", "*.txt"), ))
        with open(file_path, "w") as file:
            file.write(text_to_save)
            
    file_name = os.path.basename(file_path)
    active_file_path = file_path

    query = f"""
    --sql 
    INSERT INTO recent_files (filename, filepath) VALUES ("{file_name}", "{file_path}")
    ;
    """
    
    cursor.execute(query)
    connection.commit()
    connection.close()
    
    return file_name
    
@eel.expose
def get_recent_card_data():
    connection = sqlite3.connect(DB_PATH)
    cursor = connection.cursor()
    
    query = f"""
    --sql 
    SELECT * FROM recent_files
    ;
    """
    
    result = cursor.execute(query)
    connection.commit()

    result_array = result.fetchall()
    reversed_res_array = list(reversed(result_array))
    
    connection.close()
    
    return reversed_res_array

@eel.expose
def choose_file():
    root.wm_attributes('-topmost', 1)
    file = filedialog.askopenfile(defaultextension=".wmail", filetypes=(("Wmail File", "*.wmail"), ("Txt File", "*.txt")))
    
    return file.name

@eel.expose
def open_file(file_path):
    global active_file_path
    active_file_path = file_path
    file_content = ""
    file_name = os.path.basename(file_path)
    root.wm_attributes('-topmost', 1)
    
    connection = sqlite3.connect(DB_PATH)
    cursor = connection.cursor()
    
    try:
        file_extension = Path(file_name).suffix
        if "wmail" in file_extension:
            filecryp.decrypt_file(file_path, file_path)
            with open(file_path, "r") as file:
                file_content = file.read()
            filecryp.encrypt_file(file_path, file_path)
        else:
            with open(file_path, "r") as file:
                file_content = file.read()
                
    except FileNotFoundError as error:
        messagebox.showerror("Error", error)
        query = f"""
        --sql 
        DELETE FROM recent_files WHERE filepath = "{file_path}"
        ;
        """
        cursor.execute(query)
        connection.commit()
        connection.close()
        
        return "deleted"

    else:
        connection.close()
        return [file_content, file_name]

@eel.expose
def save_file_(file_content):
    global active_file_path
    root.wm_attributes('-topmost', 1)
    
    if active_file_path == "" or active_file_path == '':
        messagebox.showerror("Wrimail", "No file is open to save")
        return False
        
    file_extension = Path(active_file_path).suffix
    if "wmail" in file_extension:
        filecryp.decrypt_file(active_file_path, active_file_path)
        with open(active_file_path, "w") as file:
            file.write(file_content)
        filecryp.encrypt_file(active_file_path, active_file_path)
        
    else:
        with open(active_file_path, "w") as file:
            file.write(file_content)
        
    return True

@eel.expose
def show_file_error():
    root.wm_attributes("-topmost", 1)
    messagebox.showerror("Wrimail", "No file is open to save")
    
@eel.expose
def ask_save_file():
    root.wm_attributes("-topmost", 1)
    ask = messagebox.askyesnocancel("Wrimail", "File is not saved. Do you want to save it ?")
    
    # YES -> TRUE
    # NO -> FALSE
    # CANCEL -> NONE
    
    if ask == True:
        return "True"
    elif ask == False:
        return "False"
    elif ask == None:
        return "None"

if __name__ == "__main__":
    App()
    eel.start("file_page.html", size=SIZE, port=PORT)
