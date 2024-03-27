 # Guide to Generating Photos and Uploading to IPFS using Pinata

This guide walks you through the process of generating a photo, uploading it to IPFS via Pinata, and then creating and uploading a JSON metadata file for that photo. Follow these steps to seamlessly integrate your project with IPFS.

## Prerequisites

- Ensure you have Python 3 installed on your system.
- A Pinata account. Pinata is used to pin your files to IPFS easily.

## Step 1: Obtain Your Pinata API Key

To interact with Pinata through their API, you first need an API key.

1. Visit [Pinata Developers API Keys page](https://app.pinata.cloud/developers/api-keys).
2. Login or sign up if you haven't already.
3. Generate a new API key by following the prompts on the dashboard. Note down your API Key and API Secret safely.

## Step 2: Install Necessary Python Packages

Some Python packages are needed for generating the photo and interacting with the Pinata API.

Open your terminal or command prompt and run the following command:

```bash
pip install <necessary-package-names>
```
Replace <necessary-package-names> with the names of the packages you're using. For interacting with IPFS and Pinata, you might need packages like requests for API calls.
Step 3: Generate the Photo
Assuming you have a Python script (generate.py) that generates a photo:

```bash
python3 generate.py
```
Ensure your script saves the photo to a known directory (e.g., photo_directory).

## Step 4: Upload Photo and Metadata to IPFS
You need to execute two main steps to upload your photo and its metadata to IPFS using Pinata.

### Step 4.1: Upload the Photo
Use a script (pinata.py) that includes a function to upload the photo to IPFS:

```bash
upload_photo_to_ipfs(photo_directory, api_token, json_directory)
```
photo_directory: The directory where your generated photo is saved.
api_token: Your Pinata API token.
json_directory: The directory to save the generated JSON metadata file.
### Step 4.2: Upload the JSON Metadata
After uploading the photo, you'll have an IPFS hash for it. Use this hash to create a JSON file representing the photo's metadata, then upload this JSON file to IPFS:

```bash
upload_folders(json_directory, api_token, baseURI)
```
json_directory: The directory where your JSON metadata file(s) is located.
api_token: Your Pinata API token.
baseURI: The base URI for the uploaded content on IPFS. This will be used to access the metadata.

##Conclusion
Following these steps, you can generate photos, upload them to IPFS, and manage their metadata using Pinata. This guide helps streamline the process, making it easy to integrate with blockchain projects or decentralized applications.

