# Wrimail
This is an app which provides templates for the content of email and let you edit and save them for future use

![icon-modified-4](https://github.com/Sagnik-Dey/TkinterNewsApp/assets/85222136/64aa4597-11ce-4342-a063-5892bb746ef7)

## Screenshots
The file tab where you will get the templates
![Screenshot 2024-02-10 132533](https://github.com/Sagnik-Dey/TkinterNewsApp/assets/85222136/980525dc-4236-4801-8a75-be05b5fdab04)

The editor looks like this
![image](https://github.com/Sagnik-Dey/TkinterNewsApp/assets/85222136/0b5f5209-7c56-42e2-ba3c-eee418d7bfd7)

## Languages Used
> * Python
> * HTML
> * CSS
> * Javascript

## How to use
* ### Direct use (Windows version)
* Download the installer and install the software from [here](https://github.com/Sagnik-Dey/Wrimail/raw/main/Output/wrimail-setup.exe) *(Windows Version is available olny as of now)*

* ### Through Python

* Clone the repository
* Install all the requirements by 
```bash
pip install requirements.txt
```
* Run the application by
```bash
python main.py
```

### Troubleshoot
1. ##### When you start the app, "Running.." will be printed on the console. After this if the app fails to load the window, go through the following steps
* Close the application by pressing *Ctrl+C* in terminal
* Close all the browsers if opened
* Run the application again
* The window is expected to open this time
* After the window has opened, you can open the browsers again

2. ##### If the following error comes
   ```bash
    OSError: [WinError 10048] Only one usage of each socket address (protocol/network address/port) is normally permitted: ('localhost', 8001) 
   ```
* Open the *main.py* file
* Go to line number 13
* Change the port number from *8001* to some other number *(Number between 8000 and 9000 would be most suitable)*
  ```python
   PORT = 8001 # Change this port number
  ``` 
* Save the file
* Run again
   ##### *Alternate Solution* 
* Open Task Manager
* Check for which app is using the same port number *(8001)*
* You can end the task of that app if it's not needed anymore 
* Run main.py again

