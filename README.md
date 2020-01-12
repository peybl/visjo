# visjo

## Setup for Development in WSL

*Prerequisite:* Windows 10

Follow https://code.visualstudio.com/docs/remote/wsl#_installation

Install Docker on Windows.

Follow the steps in https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly

Open the Project in WSL: https://code.visualstudio.com/docs/remote/wsl#_open-a-folder-in-wsl

Execute scripts in folder /scripts (NOTICE: file endings have to be LF, otherwise the scripts won't work)


## Setup for Development in Unix Systems

*Prerequisite:* Ubuntu 18.x, user with sudo priviledges

If you want to run Ubuntu in Windows via a virtual machine please follow the instructions showed in this video: https://www.youtube.com/watch?v=diIW3fgewhI

### Installation Steps

* Docker for Ubuntu
* Node.js and npm
* Angular/CLI
* Java-JDK
* A code editor (In this case Visual Studio Code)
* Git (if not installed with Ubuntu already)

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

Credit goes to https://phoenixnap.com/kb/how-to-install-docker-on-ubuntu-18-04 for instructions and explanations.


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

Credit goes to https://linuxize.com/post/how-to-install-node-js-on-ubuntu-18.04/ for instructions and explanations.


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

Credit goes to https://linuxize.com/post/how-to-install-visual-studio-code-on-ubuntu-18-04/ for instructions and explanations.

#### Git

Use the following command:

> ```sudo apt install git```


### Cloning visjo

After deciding the directory you want to clone visjo to type:

> ```git clone https://github.com/peybl/visjo.git```

After that you can open the project folder in your code editor. First you need to build the project by running the following command:

> ```~/visjo$ ./scripts/build.sh```

You also need to install docker-compose by entering the following command in terminal:

> ```sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose```

... and apply executable permissions to the binary:

> ```sudo chmod +x /usr/local/bin/docker-compose```

Once the build is successful and docker-compose is installed, run the following command to run the application:

> ```~/visjo$ ./scripts/run.sh```
