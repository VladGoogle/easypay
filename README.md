
# EasyPay

The PhD diploma project is a fintech app, designed to provide SaaS for making international payment like Internal Transfers, SWIFT, SEPA, UKFP, etc.

# Pre-conditions
Create ```.env``` files in the root of the project, and in "client" and "server" folders by example of according ```.env.example``` files and provide your own credentials.

In order to run the application, you need a Docker installed on your local machine.

In order to deploy project infrastructure into cloud, you need to have Terraform installed on your local machine

# Database

Before starting the application, the migrations have to be applied. Run Postgres container via ```docker compose up db -d``` command, and then, run ```yarn migration:up``` to apply migrations, described in the "migration" folder of the "database" directory. (Note: You have to set ```DB_HOST``` variable in ```.env``` file to "localhost" in order for  migrations to be correctly applied. After that, change it back to the name of the Docker container, which is stated in Docker Compose file)

To run seeds, run ```yarn seed-db <path-to-the-seed-file>``` command (seed files located at path ```/server/database/seeds/*```)

# Start the application

To run the application, run ```docker compose up --build```

To run the application via on the localhost, separately from the supporting Docker contaners, run ```yarn start:dev```

# Documentation

Access the ```http://localhost:3000/docs``` after starting the application endpoint in order to observe Swagger documentation for REST endpoints.

# Deploying infrastructure via Terraform

There is a complete Terraform script for deploying project infrastructure into Azure cloud. Put your own values into variables in the ```terraform-example.tfvars``` file in the ```terraform``` directory. After that, run commands in such order :

    1. terraform init
    2. terraform plan
    3. terraform apply