FROM cubejs/cube:latest

# Install aws-lambda-cpp build dependencies
RUN apt-get update && \
    apt-get install -y \
    g++ \
    make \
    cmake \
    unzip \
    tar \
    gzip \
    autoconf \
    automake \
    libtool \
    python-pip \
    libcurl4-openssl-dev

RUN python -m pip install --upgrade pip
RUN python -m pip install --upgrade cmake

COPY . .

RUN npm install aws-lambda-ric

RUN npm install

ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]
