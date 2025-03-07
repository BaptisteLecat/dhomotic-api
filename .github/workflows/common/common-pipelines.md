# Common Pipelines

## Deploy Cloud Run Pipeline

### Requirements

This pipeline was designed to deploy a Node.js application to Google Cloud Run. The pipeline requires the following:

- Google Cloud Platform account
- Artifact Registry API enabled, Cloud Run Admin API enabled
- Artifact Registry Repository with name identical to the **gcp_app_name**
- Service Account with the following roles:
  - Artifact Registry Service Agent
  - Cloud Run Admin
  - Service Account User
- A folder with name identical to the **gcp_app_name** in the root of the repository
- A Dockerfile in the root of the folder