#
# A daily updated common KTH Alpine based image.
# Versions: https://hub.docker.com/r/kthse/kth-nodejs/tags
#
FROM kthse/kth-nodejs:12.0.0

#
# Put the application into a direcctory in the root.
# This will prevent file polution, and possible overwriting of files.
#
RUN mkdir -p /application
WORKDIR /application

#
# Copy the files needed to install the production dependencies,
# and install them using the script docker.
#
# Remember to only install production dependencies.
#
COPY ["package-lock.json", "package-lock.json"]
COPY ["package.json", "package.json"]
RUN ["npm", "run", "docker"]

#
# Copy the files needed for the application to run.
#
COPY ["config", "config"]
COPY ["app.js", "app.js"]
COPY ["swagger.json", "swagger.json"]
COPY ["server", "server"]

#
# Port that the application will expose.
#
EXPOSE 3001

#
# The command that is executed when an instance of this image is run.
#
CMD ["node", "app.js"]
