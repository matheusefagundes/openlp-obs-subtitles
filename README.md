# OpenLP to OBS Subtitles

## How to install:
This section describes how to install this project.

### 1. Localize OpenLP data folder
Open OpenLP and go to **Tools** > **Open Data Folder...** in order to find out where your data folder is located.

### 2. Create a new stage
Inside your data folder, create a folder called `stages` if it doesn't exist yet. Now you need to copy this repository inside the `stages` folder. You have two options to do so:

- Option 1: Using git, clone this repository by running:
```
git clone https://github.com/matheusefagundes/openlp-obs-subtitles.git
```
- Option 2: Download the content of this repository as a `.zip` file from [this link](https://github.com/matheusefagundes/openlp-obs-subtitles/archive/master.zip). Unzip the file under the `stages` folder and rename the directory to `openlp-obs-subtitles`.

Whatever option you've chosen, make sure your data folder structure now looks like this:
```
├── alerts
├── bibles
├── custom
├── images
├── media
├── presentations
├── projector
├── servicemanager
├── songs
├── songusage
├── stages
│   └── openlp-obs-subtitles
│       ├── Raleway-Bold.ttf
│       ├── stage.css
│       ├── stage.html
│       └── stage.js
└── themes
```

### 3. Find out the new stage remote address.
In OpenLP, go to **Settings** > **Configure OpenLP...**. In the dialog, go to **Remote** and take a look on the **Stage view URL**. It should look like this:
```
http://192.168.1.70:4316/stage
```
Please notice that your IP may be different. To find out your new stage remote address, you just need to append `/openlp-obs-subtitles` to the stage view URL. So, using the same example as above, the final address would be:
```
http://192.168.1.70:4316/stage/openlp-obs-subtitles
```
This address will be used in the next step.

### 4. Add a browser source on OBS 
In OBS, add a new browser source in the scene you want to display subtitles on. **URL** field, enter the new stage remote address.