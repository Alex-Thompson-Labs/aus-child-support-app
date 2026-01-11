# How to Create the Perfect Social Share Preview Image

This guide explains how to create high-converting Open Graph (OG) images for `share-preview.png` and blog posts.

## 1. Technical Specifications

- **Dimensions**: **1200 x 630 pixels** (Aspect ratio 1.91:1)
- **Format**: PNG or JPG (PNG is crisper for text, JPG is smaller file size)
- **File Size**: Keep under **300KB** for fast loading
- **Safe Zone**: Keep text and logos away from the very edges (leave ~40px padding)

## 2. Design Best Practices (The "Pro" Look)

A plain background with text is okay, but to get clicks, you need **Depth** and **Authority**.

### The "High-CTR" Layout Formula
Divide your canvas into two zones:
*   **Left 60% (The Hook)**: Large headline, sub-headline, and CTA button.
*   **Right 40% (The Proof)**: A screenshot of the calculator or a relevant high-quality illustration.

### 4 Key Elements to Add
1.  **Background Texture**: Don't use flat blue. Use a **subtle gradient** (Blue to slightly darker Blue) or add a very faint geometric pattern (opacity 5%) to look premium.
2.  **App Screenshot / "The Proof"**: People want to see the tool. Place a screenshot of the calculator form on the right side. Add a **Drop Shadow** to it so it "pops" off the background.
3.  **Visual CTA**: Add a button graphic that says **"Calculate Now >"** or **"Start Free"**. Even though it's not clickable in the image, it triggers the click instinct.
4.  **Trust Signals**: Add "2026 Rules Updated" not just as text, but as a "stamp" or "badge" styling.

---

## 3. Creating the Image in Canva (Advanced Step-by-Step)

1.  **Setup**: Create design `1200` x `630` px.
2.  **Background**:
    *   Select the background canvas itself.
    *   Click the **Color** tile (top left).
    *   Scroll down to **Gradients** and choose a **Blue -> Navy** option.
    *   *Correction:* Do NOT place a white/faded square *over* your text. If using an overlay, make it **Dark Blue/Black** with low transparency (20%) to make the background richer, not foggy. The #1 goal is high contrast for the white text.
3.  **The Headline (Left Side)**:
    *   Text: **"Check Your 2026 Child Support"**
    *   Font: **Inter** or **Roboto** (Heavy/Bold).
    *   Alignment: Left aligned.
    *   Size: **72pt+** (Make it huge).
    *   Color: White.
4.  **The Sub-Headline (Under Headline)**:
    *   Text: "Official Services Australia Formula • Instant Results"
    *   Size: 32pt.
    *   Color: Light Blue/Grey (e.g., `#BFDBFE`).
5.  **The Visual (Right Side) - Polishing the Screenshot**:
    *   **Option A: Phone Frame (Best)**
        1.  Select your uploaded screenshot.
        2.  Click **Edit Photo** (top bar).
        3.  Scroll to **Mockups** (or search "Mockups" in Apps).
        4.  Choose **"Phone"** -> Select a clean iPhone or Android model (e.g., "Smartphone 6").
        5.  This automatically wraps your image in a realistic device frame.
    
    *   **Option B: Floating Card (Alternative)**
        1.  Select your screenshot.
        2.  **Corner Radius**: In the top bar, look for the Border Style icon (lines). Set "Corner Rounding" to **20**.
        3.  **Shadow**: Click **Edit Photo** -> **Effects** -> **Shadows** -> **Drop**.
            *   *Settings*: Blur 20, Distance 15, Transparency 40, Color Black.
        4.  **Tilt**: Rotate it slightly (-5 degrees) to make it dynamic.
    
    *   **Positioning**: Place it on the right side. It's okay if the bottom of the phone/card is cut off by the bottom edge of the image—this looks like a "peek" and works well.
6.  **The Logo (Bottom Left)**:
    *   **CRITICAL**: Do NOT use a colored logo on a dark background. It will disappear.
    *   **The Fix**: Make the logo pure **WHITE**.
    *   *Canva Trick:* Select your blue logo -> Click **Edit Photo** -> **Effects** -> **Duotone** -> Choose any preset -> Change BOTH colors (Highlights & Shadows) to **White** (#FFFFFF).
    *   This instantly makes it pop against the dark gradient.
    *   **Text**: Ensure "auschildsupport.com" is also pure white and large enough to read.
7.  **The Icon (Optional)**:
    *   If you don't use a screenshot, use a high-quality 3D icon (e.g., "3D calculator" or "3D coin").
    *   Avoid generic flat white icons in boxes if possible.

### Visual Checklist
- [ ] Is the headline readable at 10% size (phone screen)?
- [ ] Is there proper contrast?
- [ ] Does it look like software/app (premium) or a PowerPoint slide (basic)?
- [ ] Is there empty "breathing room" around the edges?

### Option B: Using Figma (Pro)
1.  Press `F` and create a frame `1200` x `630`.
2.  Paste your UI mockup or screenshot on the right side.
3.  Add large headline text on the left side.
4.  Export as PNG @ 1x.

## 4. Testing Your Image

Before publishing, verify how it looks on different platforms:

1.  **Facebook Debugger**: [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/)
2.  **LinkedIn Inspector**: [booking.com/post-inspector](https://www.linkedin.com/post-inspector/)
3.  **Twitter Card Validator**: [cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator)

## 5. Where to Upload

### For the Main App
Save the file as `public/share-preview.png` in your project folder.

### For the Blog (Rank Math)
Go to **Rank Math** -> **Titles & Meta** -> **Global Meta** -> **Open Graph Thumbnail**.

**Upload Settings:**
*   **Title**: `share-preview-child-support-calculator`
*   **Alt Text**: `Child Support Calculator interface showing estimated payments and accurate breakdown`
