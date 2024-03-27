import os
import csv
import random
from PIL import Image, ImageDraw, ImageFont
from dotenv import load_dotenv
load_dotenv()

def make_transparent(image):
    image = image.convert("RGBA")
    datas = image.getdata()
    
    newData = []
    for item in datas:
        # Change all white (and nearly white!) pixels to transparent
        if item[0] > 200 and item[1] > 200 and item[2] > 200:  # Adjust threshold as needed
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    image.putdata(newData)
    return image

def combine_images(background_path, folder_a_path, folder_b_path, photo_directory):
    # Load the background image
    background = Image.open(background_path).convert("RGBA")
    # Ensure output directory exists
    if not os.path.exists(photo_directory):
        os.makedirs(photo_directory)
    print(f"Output folder: {photo_directory}")
    # Get list of images in folders a and b
    images_a = [f for f in os.listdir(folder_a_path) if f.endswith('.PNG')]

    images_b = [f for f in os.listdir(folder_b_path) if f.endswith('.PNG')]
    print(f"Found {len(images_a)} images in folder a")
    # Loop through each image in folder a
    for image_a_name in images_a:
        image_a = Image.open(os.path.join(folder_a_path, image_a_name)).convert("RGBA")
        image_a = make_transparent(image_a)
        # For each image in folder a, loop through each image in folder b
        for image_b_name in images_b:
            image_b = Image.open(os.path.join(folder_b_path, image_b_name)).convert("RGBA")
            
            # Create a new image with the same size as the background
            combined_image = Image.new("RGBA", background.size)
            combined_image.paste(background, (0, 0))
            image_b = make_transparent(image_b)
            # Paste image_a and image_b onto the background
            # Note: You might need to adjust positioning based on your requirements
            combined_image.paste(image_a, (0, 0), image_a)
            combined_image.paste(image_b, (0, 0), image_b)
            a_name = image_a_name.replace('.PNG', '').split('_')[1]
            b_name = image_b_name.replace('.PNG', '').split('_')[1]

            # Create output filename based on the names of images a and b
            output_filename = f"{a_name}_{b_name}.png"
            output_path = os.path.join(photo_directory, output_filename)
            # Save the combined image
            combined_image.save(output_path)

def combine_images_direct(index, image_background, _nick_name, background_name,folder_a_path, folder_b_path, photo_directory):
    # Ensure output directory exists
    if not os.path.exists(photo_directory):
        os.makedirs(photo_directory)
    # Get list of images in folders a and b
    images_a = [f for f in os.listdir(folder_a_path) if f.endswith('.PNG')]

    images_b = [f for f in os.listdir(folder_b_path) if f.endswith('.PNG')]
    # Create a new image with the same size as the background
    combined_image = Image.new("RGBA", image_background.size)
    combined_image.paste(image_background, (0, 0))

    image_a_name = random.choice(images_a)
    image_b_name = random.choice(images_b)
    # Paste image_a and image_b onto the background
    # Note: You might need to adjust positioning based on your requirements
    image_b = Image.open(os.path.join(folder_b_path, image_b_name)).convert("RGBA")
    image_b = make_transparent(image_b)
    image_a = Image.open(os.path.join(folder_a_path, image_a_name)).convert("RGBA")
    image_a = make_transparent(image_a)
    combined_image.paste(image_a, (0, 0), image_a)
    combined_image.paste(image_b, (0, 0), image_b)
    a_name = image_a_name.replace('.PNG', '').split('_')[1]
    b_name = image_b_name.replace('.PNG', '').split('_')[1]
    # Create output filename based on the names of images a and b
    output_filename = f"{index}_{_nick_name}_{background_name}_{a_name}_{b_name}.png"
    output_path = os.path.join(photo_directory, output_filename)
    # Save the combined image
    combined_image.save(output_path)
    print(f"Saved {output_path}")
    return output_path

# Define the function to change text in an image
def change_text(core_background_path,_background_path,_background, name, position, font_path, font_size, text_color):
    """
    Change text in an image at the specified position.

    Parameters:
    img: Image object to modify.
    new_text: The new text to overlay on the image.
    position: A tuple (x, y) specifying the upper-left corner of the text.
    font_path: Path to the font file.
    font_size: Size of the font.
    text_color: Color of the text.
    """
    new_text = f"Early Contributor 2024 : {name}"
    img = f"{_background_path}/body_{_background}.png"
    try:
        img_photo = Image.open(img).convert("RGBA")
    except FileNotFoundError:
        print(f"found Image error: {img}")
        image_backgrounds = [f for f in os.listdir(core_background_path) if f.endswith('.PNG')]
        image_name = random.choice(image_backgrounds)
        _background = image_name.replace('.PNG', '').split('_')[1]
        img_photo = Image.open(os.path.join(core_background_path, image_name)).convert("RGBA")

    draw = ImageDraw.Draw(img_photo)
    # Define the font
    try:
        font = ImageFont.truetype(font_path, font_size)
    except IOError:
        # Fallback to a default font if the specified one is not found
        font = ImageFont.load_default(font_size)
    #delete word below before write
    draw.rectangle([position, (position[0] + 1800, position[1] + 200)], fill=(255, 255, 255, 255))
    draw.text(position, new_text, fill=text_color, font=font)
    return (img_photo, _background)

# Define the function to change text in an image
def change_backgroung_text(background_path, position, font_path, font_size, text_color):
    new_text = f"Early Contributor 2024 : Mystery"
    img = background_path
    try:
        img_photo = Image.open(img).convert("RGBA")
    except FileNotFoundError:
        print(f"found Image error: {img}")
        return

    # #add photo on top of the background
    draw = ImageDraw.Draw(img_photo)
    # Define the font
    try:
        font = ImageFont.truetype(font_path, font_size)
    except IOError:
        # Fallback to a default font if the specified one is not found
        font = ImageFont.load_default(font_size)
    #delete word below before write
    draw.rectangle([position, (position[0] + 1800, position[1] + 200)], fill=(255, 255, 255, 255))
    draw.text(position, new_text, fill=text_color, font=font)
    img_photo.save(f"{photo_directory}/outputs.png")
    return (img_photo)

def get_nickname_background_by_csv(csv_path):
    with open(csv_path, mode='r') as file:
        reader = csv.DictReader(file)
        print(reader)
        index = 1
        for row in reader:
            if row['nickname'] != "":
                _background = row['background'] if row['background'] != "" else "none"
                _nickname = row['nickname']
                (updated_img, _name) = change_text(core_background_path,background_path,_background, _nickname, (240, 1760), font_path, font_size, (0, 0, 0))
                combine_images_direct(index, updated_img, _nickname, _name, folder_a_path, folder_b_path, photo_directory)
                index += 1

# Paths to the folders and background image
core_background_path = os.getenv('CORE_MEMBER_PATH')
background_path = os.getenv('CORE_MEMBER_PATH')
folder_a_path = os.getenv('FOLDER_A_PATH')
folder_b_path = os.getenv('FOLDER_B_PATH')
photo_directory = os.getenv('PHOTO_DIRECTORY')
input_background = "cow"
name = "vwvwMM"  
font_path = "/System/Library/Fonts/Supplemental/Tahoma Bold.ttf" # Update the path to your font file as necessary
font_size = 90
csv_path = os.getenv('CSV_PATH')
get_nickname_background_by_csv(csv_path)

normal_background_path=f"{core_background_path}/body_normal.png"
# change_backgroung_text(normal_background_path, (240, 1760), font_path, font_size, (0, 0, 0))