from PIL import Image

def remove_white_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        r, g, b, a = item
        # Calculate how close to pure white the pixel is
        if r > 240 and g > 240 and b > 240:
            # Map edge pixels to partial transparency
            alpha_factor = (255 - max(r, g, b)) / 15.0  # 240->1.0, 255->0.0
            alpha = int(255 * alpha_factor)
            newData.append((r, g, b, alpha))
        else:
            newData.append((r, g, b, 255))

    img.putdata(newData)
    img.save(output_path, "PNG")

remove_white_bg('logo.png', 'logo.png')
print("Successfully processed logo.png!")
