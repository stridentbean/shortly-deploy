#!/bin/bash
echo "START UPLOAD TASKS"
read -p "Are you logged into Microsoft Azure? y/n " yn
case $yn in
  [Nn]* ) exit;;
  [Yy]* ) echo "DOWNLOADING AZURE";
  npm install -g azure-cli;
  echo "DOWNLOADING CLIENT CREDENTIALS...";
  azure account download;
  sleep 5
  while :
  do
    if ! [[ `lsof -c python3.2 | grep ~/Downloads/Free\ Trial-6-10-2015-credentials.publishsettings` ]]

    then
        break
    fi
    sleep 0.5
  done
  echo "...FILE DOWNLOAD COMPLETE";
  azure account import ~/Downloads/Free\ Trial-6-10-2015-credentials.publishsettings
esac
