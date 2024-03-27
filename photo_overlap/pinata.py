import requests
import os
import json
from dotenv import load_dotenv
load_dotenv()
def upload_photo_to_ipfs(photo_directory, api_token, json_directory):
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    headers = {
        "Authorization": f"Bearer {api_token}"
    }
    if not os.path.exists(json_directory):
        os.makedirs(json_directory)
    # Loop through all files in the specified folderhttps://chat.openai.com/c/f7366380-c252-44a0-8698-f9d2a54d78d4
    for filename in os.listdir(photo_directory):
        if filename.endswith('.png'):  # Adjust this condition based on the file types you want to upload
            file_path = os.path.join(photo_directory, filename)
            
            # Open the file in binary mode
            with open(file_path, 'rb') as file_to_upload:
                # Define the multipart/form-data payload
                files = {
                    'file': (filename, file_to_upload),
                    'pinataMetadata': ('', '{"name": "' + filename + '"}'),
                    'pinataOptions': ('', '{"cidVersion": 1}')
                }
                
                # Make the POST request to upload the file to IPFS via Pinata
                response = requests.post(url, headers=headers, files=files)
                response_data = response.json()  # Convert response text to a Python dictionary

                # Extract the 'IpfsHash' value
                print(response_data)
                ipfs_hash = response_data.get("IpfsHash", "")
                # Print the response from Pinata
                print(f"Uploaded {filename}: {ipfs_hash}")
                traits = filename.replace('.png', '').split('_')
                body_value = traits[2]
                eye_value = traits[3] 
                eyebrow_value = traits[4] 
                index_value = traits[0]

                json_filename = f"{index_value}.json"
                json_data = {
                    "description": "",
                    "external_url": "",
                    "image": f"ipfs://{ipfs_hash}",
                    "name": "XueDAO Core Contributor NFT",
                    "attributes": [
                        {"trait_type": "body", "value": body_value},
                        {"trait_type": "eye", "value": eye_value},
                        {"trait_type": "eyebrow", "value": eyebrow_value}
                    ]
                }
                json_path = os.path.join(json_directory, json_filename)
                with open(json_path, 'w') as json_file:
                    json.dump(json_data, json_file, indent=4)
                    print(f"Wrote response to {json_path}")

def upload_folders(photo_directory, api_token, baseURI):
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    headers = {
        "Authorization": f"Bearer {api_token}",
    }
    #package all the files in the folder
    files = []
    for filename in os.listdir(photo_directory):
        if filename.endswith('.json'):
            file_path = os.path.join(photo_directory, filename)
            files.append(('file', (f'folders/{filename}', open(file_path, 'rb'), 'application/json')))

    # Define the multipart/form-data payload
    files.append(('pinataMetadata', ('', '{"name": "XueDAO Core Contributor NFT"}')))
    files.append(('pinataOptions', ('', '{"cidVersion": 1}')))
    print(files)
    # Make the POST request to upload the file to IPFS via Pinata
    response = requests.post(url, headers=headers, files=files)
    print(response)
    response_data = response.json()
    ipfs_hash = response_data.get("IpfsHash", "")
    print(f"Uploaded {photo_directory}: {ipfs_hash}")
    print(f"{baseURI}{ipfs_hash}")


photo_directory = os.getenv('PHOTO_DIRECTORY')

json_directory = os.getenv('JSON_DIRECTORY')
#Get the API token from the Pinata account
api_token = os.getenv('PINATA_API_TOKEN')
# baseURI = "https://ipfs.io/ipfs/" or others
baseURI = os.getenv('BASE_URI')

# Upload the photo to IPFS and make a JSON file
upload_photo_to_ipfs(photo_directory, api_token, json_directory)
# Upload the JSON files to IPFS as a folder
upload_folders(json_directory, api_token, baseURI)
