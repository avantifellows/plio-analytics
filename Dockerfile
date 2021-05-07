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
    libcurl4-openssl-dev

RUN pip install --upgrade cmake

COPY . .

RUN npm install aws-lambda-ric

RUN npm install

ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]
CMD ["app.handler"]
