#!/bin/sh
echo 'Build bundle' \
&& npm run build \
&& echo 'Remove bundle' \
&& ssh $1@$2 'rm -rf ~/front/*' \
&& echo 'Transfer bundle' \
&& scp -r dist/* $1@$2:~/front \
&& echo 'Deploy done'
