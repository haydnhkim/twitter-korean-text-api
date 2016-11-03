FROM ubuntu

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get update -y
RUN apt-get install -y curl wget tar git python build-essential

# Java
RUN \
  wget --header "Cookie: oraclelicense=accept-securebackup-cookie" -O /opt/jdk-8u65-linux-x64.tar.gz http://download.oracle.com/otn-pub/java/jdk/8u65-b17/jdk-8u65-linux-x64.tar.gz \
  && tar -xzf /opt/jdk-8u65-linux-x64.tar.gz -C /opt \
  && rm /opt/jdk-8u65-linux-x64.tar.gz \
  && ln -s /opt/jdk1.8.0_65 /opt/jdk
ENV PATH $PATH:/opt/jdk/bin
ENV JAVA_HOME /opt/jdk
ENV _JAVA_OPTIONS -Djava.net.preferIPv4Stack=true

ENV NVM_DIR="/usr/local/nvm"
ENV NODE_VERSION 6.9.1

# Node
RUN \
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash \
  && source $NVM_DIR/nvm.sh \
  && nvm install $NODE_VERSION \
  && nvm alias default $NODE_VERSION \
  && nvm use default

ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Fix bug https://github.com/npm/npm/issues/9863
RUN cd $(npm root -g)/npm \
  && npm install fs-extra \
  && sed -i -e s/graceful-fs/fs-extra/ -e s/fs\.rename/fs.move/ ./lib/utils/rename.js

WORKDIR /usr/src/myapp
COPY . /usr/src/myapp

RUN npm install -g pm2 \
  && cd /usr/src/myapp \
  && npm install java \
  && npm install

EXPOSE 3000
CMD ["pm2-docker", "/usr/src/myapp/index.js"]
