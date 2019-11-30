#!/bin/bash
cd /home || exit

# Rebuild project on startup
[[ -f /home/visjo/mvnw ]] && cd visjo/ && ./mvnw clean install

if [[ ! -f /home/visjo-run.sh ]]; then
    echo "#!/bin/bash" > /home/visjo-run.sh
    echo "cd /home/visjo/" >> /home/visjo-run.sh
    echo "java -jar $(find /home/visjo/visjo-backend/target/ -type f -name "visjo-*.jar")" >> /home/visjo-run.sh
    chmod +x /home/visjo-run.sh
    echo "Successfully created visjo-run.sh file"
fi

exec /home/visjo-run.sh
