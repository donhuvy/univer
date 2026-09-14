import os
from PIL import Image, ImageDraw, ImageFont

def render_centered_text(
    width, height, text, font_path, text_color, bg_color=None, padding_ratio=0.15, bold=True
):
    # Render at 4x resolution for super-sampling anti-aliasing
    scale = 4
    canvas_w = width * scale
    canvas_h = height * scale
    
    if bg_color is not None:
        img = Image.new("RGBA", (canvas_w, canvas_h), bg_color)
    else:
        img = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
        
    draw = ImageDraw.Draw(img)
    
    # Binary search to find optimal font size to fit within target bounding box
    max_w = canvas_w * (1.0 - 2 * padding_ratio)
    max_h = canvas_h * (1.0 - 2 * padding_ratio)
    
    low = 10
    high = max(canvas_w, canvas_h)
    best_font = None
    best_size = low
    
    while low <= high:
        mid = (low + high) // 2
        font = ImageFont.truetype(font_path, mid)
        bbox = font.getbbox(text)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        if w <= max_w and h <= max_h:
            best_font = font
            best_size = mid
            low = mid + 1
        else:
            high = mid - 1
            
    # Calculate optical center
    bbox = best_font.getbbox(text)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    
    # Position: (canvas_w - w)/2 - bbox[0], (canvas_h - h)/2 - bbox[1]
    x = (canvas_w - w) / 2.0 - bbox[0]
    y = (canvas_h - h) / 2.0 - bbox[1]
    
    draw.text((x, y), text, font=best_font, fill=text_color)
    
    # Downsample to target size with Lanczos filter
    final_img = img.resize((width, height), Image.Resampling.LANCZOS)
    return final_img

def generate_svg_text(width, height, text, text_color, bg_color=None, font_weight="bold"):
    bg_rect = ""
    if bg_color:
        bg_rect = f'<rect width="100%" height="100%" fill="{bg_color}"/>\n  '
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
  {bg_rect}<text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, Helvetica, sans-serif" font-weight="{font_weight}" fill="{text_color}"
        font-size="{int(min(width, height) * 0.75)}">{text}</text>
</svg>"""
    return svg

def generate_svg_banner(width, height, text, text_color, bg_color="#ffffff", font_weight="bold"):
    bg_rect = f'<rect width="100%" height="100%" fill="{bg_color}"/>\n  '
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
  {bg_rect}<text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, Helvetica, sans-serif" font-weight="{font_weight}" fill="{text_color}"
        font-size="{int(height * 0.5)}">{text}</text>
</svg>"""
    return svg

def main():
    base_dir = os.path.abspath("branding")
    dir_b = os.path.join(base_dir, "icon-b")
    dir_bkit = os.path.join(base_dir, "icon-bkit")
    dir_tauri = os.path.join(base_dir, "tauri-icons")
    
    for d in [dir_b, dir_bkit, dir_tauri]:
        os.makedirs(d, exist_ok=True)
        
    font_bold = "C:/Windows/Fonts/arialbd.ttf"
    font_regular = "C:/Windows/Fonts/arial.ttf"
    red_color = (255, 0, 0, 255) # #ff0000
    white_bg = (255, 255, 255, 255) # #ffffff
    
    # ----------------------------------------------------
    # 1. ICON "B" (#ff0000, Arial)
    # ----------------------------------------------------
    print("Generating Icon B...")
    sizes = [16, 24, 32, 48, 64, 128, 256, 512]
    
    # Transparent versions
    b_images_trans = []
    for s in sizes:
        img = render_centered_text(s, s, "B", font_bold, red_color, bg_color=None, padding_ratio=0.12)
        img.save(os.path.join(dir_b, f"icon_b_{s}x{s}.png"))
        b_images_trans.append(img)
        
    # Save Windows .ico (transparent)
    ico_imgs_trans = [img for img in b_images_trans if img.width in [16, 24, 32, 48, 64, 128, 256]]
    ico_imgs_trans[-1].save(
        os.path.join(dir_b, "icon_b.ico"),
        format="ICO",
        sizes=[(im.width, im.height) for im in ico_imgs_trans]
    )
    
    # White background versions
    b_images_white = []
    for s in sizes:
        img = render_centered_text(s, s, "B", font_bold, red_color, bg_color=white_bg, padding_ratio=0.12)
        img.save(os.path.join(dir_b, f"icon_b_white_{s}x{s}.png"))
        b_images_white.append(img)
        
    # Save Windows .ico (white background)
    ico_imgs_white = [img for img in b_images_white if img.width in [16, 24, 32, 48, 64, 128, 256]]
    ico_imgs_white[-1].save(
        os.path.join(dir_b, "icon_b_white.ico"),
        format="ICO",
        sizes=[(im.width, im.height) for im in ico_imgs_white]
    )
    
    # SVGs for Icon B
    with open(os.path.join(dir_b, "icon_b.svg"), "w", encoding="utf-8") as f:
        f.write(generate_svg_text(512, 512, "B", "#ff0000", bg_color=None))
    with open(os.path.join(dir_b, "icon_b_white.svg"), "w", encoding="utf-8") as f:
        f.write(generate_svg_text(512, 512, "B", "#ff0000", bg_color="#ffffff"))

    # ----------------------------------------------------
    # 2. ICON "BKIT.VN" (Arial, #ff0000, background #ffffff)
    # ----------------------------------------------------
    print("Generating Icon BKIT.VN...")
    
    # A. Square App Icon version (background #ffffff, text BKIT.VN)
    bkit_square_imgs = []
    for s in sizes:
        img = render_centered_text(s, s, "BKIT.VN", font_bold, red_color, bg_color=white_bg, padding_ratio=0.08)
        img.save(os.path.join(dir_bkit, f"bkit_square_{s}x{s}.png"))
        bkit_square_imgs.append(img)
        
    ico_imgs_bkit = [img for img in bkit_square_imgs if img.width in [16, 24, 32, 48, 64, 128, 256]]
    ico_imgs_bkit[-1].save(
        os.path.join(dir_bkit, "icon_bkit.ico"),
        format="ICO",
        sizes=[(im.width, im.height) for im in ico_imgs_bkit]
    )
    
    with open(os.path.join(dir_bkit, "bkit_square.svg"), "w", encoding="utf-8") as f:
        # Scale font for square display of long word
        svg_square = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, Helvetica, sans-serif" font-weight="bold" fill="#ff0000"
        font-size="96" letter-spacing="2">BKIT.VN</text>
</svg>"""
        f.write(svg_square)
        
    # B. Horizontal Banner / Logo (800x200 & 1200x300)
    banner_img = render_centered_text(800, 200, "BKIT.VN", font_bold, red_color, bg_color=white_bg, padding_ratio=0.08)
    banner_img.save(os.path.join(dir_bkit, "bkit_banner_800x200.png"))
    
    banner_img_lg = render_centered_text(1200, 300, "BKIT.VN", font_bold, red_color, bg_color=white_bg, padding_ratio=0.08)
    banner_img_lg.save(os.path.join(dir_bkit, "bkit_banner_1200x300.png"))
    
    with open(os.path.join(dir_bkit, "bkit_banner.svg"), "w", encoding="utf-8") as f:
        f.write(generate_svg_banner(800, 200, "BKIT.VN", "#ff0000", bg_color="#ffffff"))

    # ----------------------------------------------------
    # 3. TAURI v2 READY ICON PACK (Default using B / BKIT)
    # ----------------------------------------------------
    print("Generating Tauri v2 icon pack...")
    # Standard Tauri icon set:
    # 32x32.png, 128x128.png, 128x128@2x.png (256x256), icon.ico, icon.png (512x512)
    # We will generate standard icon sets for both B and BKIT.VN
    
    # Tauri package based on B with white bg:
    tauri_b_dir = os.path.join(dir_tauri, "tauri-icon-b")
    os.makedirs(tauri_b_dir, exist_ok=True)
    render_centered_text(32, 32, "B", font_bold, red_color, bg_color=white_bg, padding_ratio=0.12).save(os.path.join(tauri_b_dir, "32x32.png"))
    render_centered_text(128, 128, "B", font_bold, red_color, bg_color=white_bg, padding_ratio=0.12).save(os.path.join(tauri_b_dir, "128x128.png"))
    render_centered_text(256, 256, "B", font_bold, red_color, bg_color=white_bg, padding_ratio=0.12).save(os.path.join(tauri_b_dir, "128x128@2x.png"))
    render_centered_text(512, 512, "B", font_bold, red_color, bg_color=white_bg, padding_ratio=0.12).save(os.path.join(tauri_b_dir, "icon.png"))
    ico_imgs_white[-1].save(os.path.join(tauri_b_dir, "icon.ico"), format="ICO", sizes=[(im.width, im.height) for im in ico_imgs_white])
    
    # Tauri package based on BKIT.VN:
    tauri_bkit_dir = os.path.join(dir_tauri, "tauri-icon-bkit")
    os.makedirs(tauri_bkit_dir, exist_ok=True)
    render_centered_text(32, 32, "BKIT.VN", font_bold, red_color, bg_color=white_bg, padding_ratio=0.08).save(os.path.join(tauri_bkit_dir, "32x32.png"))
    render_centered_text(128, 128, "BKIT.VN", font_bold, red_color, bg_color=white_bg, padding_ratio=0.08).save(os.path.join(tauri_bkit_dir, "128x128.png"))
    render_centered_text(256, 256, "BKIT.VN", font_bold, red_color, bg_color=white_bg, padding_ratio=0.08).save(os.path.join(tauri_bkit_dir, "128x128@2x.png"))
    render_centered_text(512, 512, "BKIT.VN", font_bold, red_color, bg_color=white_bg, padding_ratio=0.08).save(os.path.join(tauri_bkit_dir, "icon.png"))
    ico_imgs_bkit[-1].save(os.path.join(tauri_bkit_dir, "icon.ico"), format="ICO", sizes=[(im.width, im.height) for im in ico_imgs_bkit])

    print("All icons successfully generated in branding/ folder!")

if __name__ == "__main__":
    main()
