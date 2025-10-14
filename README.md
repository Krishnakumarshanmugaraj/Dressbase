# Dressbase

## Overview

1. Project overview

Dressbase helps you track dresses/outfits you wore.
For each entry you can: pick the date
upload a photo of the clothing
automatically detect the dominant color
save the record (date, hex color, optional color name, image path)
view previous entries in “History” with timeline filters (week / month / year / all)
Designed for quick MVP with excellent UX: Tailwind CSS and Framer Motion for animations, ColorThief for client-side color extraction, and Supabase for database & storage.

2. Key features

Date input for each outfit
Photo upload & client-side color extraction (dominant color hex)
Save image to cloud storage and metadata to Postgres
History page with timeline filter (this week / month / year / all)
Responsive, colorful UI with smooth animations
Minimal setup and free-tier friendly

3. Tech stack

Frontend: React
Backend / Database: Supabase 
Hosting: Vercel 

4. Architecture & data flow

User picks a date and uploads an image in the React app.
The client uses ColorThief to extract the dominant RGB color and converts to hex.
Client uploads the image to Supabase Storage (bucket dress-images) and gets a public or signed URL.
Client inserts a metadata row into Supabase dresses table with date_worn, detected_color, image_path, etc.

## Deployment

click below :
https://v0-dress-color-analyzer.vercel.app/

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
