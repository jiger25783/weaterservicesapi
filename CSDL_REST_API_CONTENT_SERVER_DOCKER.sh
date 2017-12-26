#!/bin/bash

############# docker build
#local #dev # prod
docker build --rm -t csdlrestcontent .

######### To run mosquitto
docker run -it -d -p 1883:1883 -p 9001:9001 --name="eclipse-mosquitto" eclipse-mosquitto || echo 'No mosquitto docekr container running locally'

## docker tagging
docker tag csdlrestcontent:dev cicd.computer.org:5080/csdlrest/csdlrestcontent:latest
docker tag csdlrestcontent:dev cicd.computer.org:5080/csdlrest/csdlrestcontent:${BUILD_NUMBER}

############ push to local docker registry
## This is pushing to CICD's local docker registry
## we still needs to configure HTTPS in order to use this registry on host machine
## where application will be deployed.
docker push cicd.computer.org:5080/csdlrest/csdlrestcontent:${BUILD_NUMBER}
docker push cicd.computer.org:5080/csdlrest/csdlrestcontent:latest
docker rmi cicd.computer.org:5080/csdlrest/csdlrestcontent:${BUILD_NUMBER}
docker rmi cicd.computer.org:5080/csdlrest/csdlrestcontent:latest
docker rmi csdlrestcontent:latest


############ stop and remove any running docker container of csdlrest_content
docker rm -f csdlrest_content || echo 'No csdlrest_content docker container running locally'


############ To pull and run image build by jenkins and kept on local docker registry
#local
docker run -it --rm -p 80:80 -p 8069:8069 -p 443:443 -d -e "NODE_ENV=development" --name csdlrest_content csdlrestcontent

#dev
############ Remove any local image before running  
docker rmi -f cicd.computer.org:5080/csdlrest/csdlrestcontent || echo 'No csdlrestcontent docker image locally'
############ Running container from local repo
docker run -it --rm -p 80:80 -p 8069:8069 -p 443:443 -v /mnt/data/csdlrestcontent:/mnt/data/log/csdlrestcontent/ -d -e "NODE_ENV=development" --name csdlrest_content cicd.computer.org:5080/csdlrest/csdlrestcontent

#prod
############ Remove any local image before running  
docker rmi -f cicd.computer.org:5080/csdlrest/csdlrestcontent || echo 'No csdlrestcontent docker image locally'
############ Running container from local repo
docker run -it --rm -p 80:80 -p 8069:8069 -p 443:443 -v /mnt/data/csdlrestcontent:/mnt/data/log/csdlrestcontent/ -d -e "NODE_ENV=production" --name csdlrest_content cicd.computer.org:5080/csdlrest/csdlrestcontent
