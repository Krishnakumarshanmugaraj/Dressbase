-- Make image_url nullable since image upload is now optional
ALTER TABLE dress_entries ALTER COLUMN image_url DROP NOT NULL;
