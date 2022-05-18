git add *
git commit -m "Update source"
git push
ssh $pi "cd ~/projects/television-front-end && git pull"