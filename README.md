# <img alt="visjo" width="400px" height="auto" src="https://github.com/peybl/visjo/blob/master/logo-img.png" />

## How-To for Visjo

Once you open the application it welcomes you with the following home page:

# <img alt="visjo" width="600px" height="auto" src="https://github.com/peybl/visjo/blob/master/tutorial-images/home-page.PNG" />

By clicking the Sign In at the top right you can log into your account:

# <img alt="visjo" width="600px" height="auto" src="https://github.com/peybl/visjo/blob/master/tutorial-images/sign-in.PNG" />

If you do not have any journeys in your journey overview you'll get this page:

# <img alt="visjo" width="600px" height="auto" src="https://github.com/peybl/visjo/blob/master/tutorial-images/empty-journey-overview.PNG" />

As the info alert says, you can now click on Create button in the navigation bar to create your first journey:

# <img alt="visjo" width="600px" height="auto" src="https://github.com/peybl/visjo/blob/master/tutorial-images/empty-create-journey.PNG" />

You can enter the title for your journey and then click "Select" button to select the images you want to upload. Once your images are selected you will get the following view:

# <img alt="visjo" width="600px" height="auto" src="https://github.com/peybl/visjo/blob/master/tutorial-images/create-journey-before-upload.PNG" />

Here you can edit latitude and longitude for now. Features for editing image name and date has not implemented yet. Once you are ready to upload your images click the "Upload" button at the bottom. You will get an info alert if the upload is successful:

# <img alt="visjo" width="600px" height="auto" src="https://github.com/peybl/visjo/blob/master/tutorial-images/create-journey-after-upload.PNG" />

If you want to upload more images you can click on "Select" and then "Upload" again.

After you are done with creating your journey, you can click "Journey View" in the navigation bar to see your images pinned on the map:

# <img alt="visjo" width="600px" height="auto" src="https://github.com/peybl/visjo/blob/master/tutorial-images/journey-view-1.PNG" />

Here you can also see the information regarding all of your images on the left scrollable menu. When you click on one of the images in this menu the map zoom into this image's location. If you have more journeys you can select them from the dropdown menu and then click "Load Journey" to load the pin marks for that journey on the map.

You can also switch to satellite view by clicking icon on the top right corner of the map and selecting "satellite":

# <img alt="visjo" width="600px" height="auto" src="https://github.com/peybl/visjo/blob/master/tutorial-images/journey-view-2.PNG" />

You can see your journeys if you click on the "Home" button in the navigation bar. The first image of your journey will be selected for your journey overview. If you click on the image you can navigate back to journey view for that journey.

Moreover, you can also click the share icon on the top left corner of the journey card to get a code for your journey which you can use to share with others:

# <img alt="visjo" width="600px" height="auto" src="https://github.com/peybl/visjo/blob/master/tutorial-images/journey-share-code.PNG" />

Others that want to see your journey view without logging in can just go to the home page of Visjo and enter the code in the navigation menu, then click "Go!":

# <img alt="visjo" width="600px" height="auto" src="https://github.com/peybl/visjo/blob/master/tutorial-images/journey-share-logged-out.PNG" />

This small tutorial sums up all the available features Visjo offers.

## Setup for Development in Unix Systems

*Prerequisite:* Ubuntu 18.x, user with sudo priviledges

If you want to run Ubuntu in Windows via a virtual machine please follow the instructions shown in this video: <https://www.youtube.com/watch?v=diIW3fgewhI>

### Installation Steps

* Docker for Ubuntu
* Node.js and npm*
* Angular/CLI*
* Java-JDK*
* A code editor (In this case Visual Studio Code)
* Git (if not installed with Ubuntu already)

<sub><sup>*Not necessarily needed since build installs these elements as well.</sup></sub>

#### Docker For Ubuntu
It's good to update the local database of software to make sure you've got access to the latest revisions. Therefore, open a terminal window and type:

> ```sudo apt-get update```

Next step is unstalling any old versions of Docker if they exist. Use the following command:

> ```sudo apt-get remove docker docker-engine docker.io```

Then install Docker:

> ```sudo apt install docker.io```

Automating Docker at system start is always recommended so you don't have to start it manually every time. If you want to automate it follow commands below:

> ```sudo systemctl start docker```

> ```sudo systemctl enable docker```

You can check the installed version of Docker by following command:

> ```docker --version```

You might get an error starting with

> Got permission denied while trying to connect to the Docker daemon...

at a later stage while building the project. This means that the user needs to be added to the group docker. You can add your user by doing so:

> ```sudo usermod -a -G docker <Username>```

Credit goes to <https://phoenixnap.com/kb/how-to-install-docker-on-ubuntu-18-04> for instructions and explanations.


#### Node.js and npm

Enable NodeSource repository by running the following curl command:

> ```sudo curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -```

If curl isn't installed you can install it by entering following command:

> ```sudo apt install curl```

Once the NodeSource repository is enabled, install Node.js and npm by typing:

> ```sudo apt install nodejs```

You can verify the installation of nodejs and npm by checking their versions:

> ```node --version```

> ```npm --version```

Credit goes to <https://linuxize.com/post/how-to-install-node-js-on-ubuntu-18.04/> for instructions and explanations.


#### Angular/CLI

To install Angular cli tool globally on your system:

> ```sudo npm install -g @angular/cli```

You can check the installed version with the following command:

> ```ng --version```


#### Java-JDK

To install Java use the following command:

> ```sudo apt install default-jdk```


#### Visual Studio Code (Optional)

First, update the packages index and install the dependencies by typing:

> ```sudo apt update```

> ```sudo apt install software-properties-common apt-transport-https wget```

Next, import the Microsoft GPG key using the following command:

> ```wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | sudo apt-key add -```

And enable the Visual Studio Code repository by typing:

> ```sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main"```

Once the apt repository is enabled, install the latest version of Visual Code with:

> ```sudo apt update```

> ```sudo apt install code```

Credit goes to <https://linuxize.com/post/how-to-install-visual-studio-code-on-ubuntu-18-04/> for instructions and explanations.

#### Git

Use the following command:

> ```sudo apt-get install git```


### Cloning visjo and running the application

After deciding the directory you want to clone visjo to type:

> ```git clone https://github.com/peybl/visjo.git```

After that you can open the project folder in your code editor. First you need to build the project by running the following command:

> ```~/visjo$ ./scripts/build.sh```

You also need to install docker-compose by entering the following command in terminal:

> ```sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose```

... and apply executable permissions to the binary:

> ```sudo chmod +x /usr/local/bin/docker-compose```

You can check the version with:

> ```docker-compose --version```

If you get 'No such file or directory error' run the following command:

> ```sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose```

Once the build is successful and docker-compose is installed, run the following command to run the application:

> ```~/visjo$ ./scripts/run.sh```

If you get the following error:

> ```ERROR: The compose file './docker-compose.yml' is invalid because: networks.visjo-net value Additional properties are not allowed ('name' was unexpected)```

you can delete the line '```name: visjo-net```' at the end of '```docker-compose.yml```' file and then run the command.

This might take several minutes to complete. After that you can open a browser and see the application on ```https://localhost:8080```.

After the changes you made in code you can run the following to recompile:

> ```~/visjo$ ./scripts/restart.sh```

For a clean run you can use the following command before running ```run.sh```:

> ```~/visjo$ ./scripts/clean.sh```

## Setup for Development in WSL

*Prerequisite:* Windows 10 Build 19018 or higher, *LOTS* of RAM

### Installation Steps for Windows

* Install WSL (Windows Subsystem for Linux) and enable WSL 2 (see below)
* Install Docker Desktop Edge 2.1.6.0 or later (see below)
* Install VS Code (recommended)
* Install GIT in WSL
    > ````sudo apt-get install git````
* Clone the repository into the WSL folder of your choice
* Start VS Code in WSL
    > ````wsl code .````
* Wait for VS Code to install the additional tools for WSL
* (recommended) Install the VS Code Remote Development Extension Pack
* Run the script *build.sh*
    > ````scripts/build.sh````
* If everything is configured correctly, dependencies and Docker Containers should be set up.
* Run the project with *run.sh*
    > ````scripts/run.sh````
* If you want to reload the project (after implementing changes in the code), you can either use the provided script *restart.sh* or just restart the Docker container *visjo*

#### Installing and enabling WSL 2

Follow the steps at <https://docs.microsoft.com/en-us/windows/wsl/wsl2-install>

#### Installing Docker Desktop Edge

Download, install and follow the steps at <https://docs.docker.com/docker-for-windows/wsl-tech-preview/>

### Troubleshooting

#### Line endings

Some errors occur because the line endings are not set to **\LF**, for example if you clone the project into a Windows (non-WSL) part of your Computer. That's why it's recommended to clone the project to a WSL folder. You can, of course, also configure GIT that it changes those automatically.
